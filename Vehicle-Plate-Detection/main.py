import os

os.environ["FLAGS_use_mkldnn"] = "0"
os.environ.setdefault("KMP_DUPLICATE_LIB_OK", "TRUE")  

import io
import logging
import re
from contextlib import asynccontextmanager
from typing import List, Optional, Tuple

import cv2
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile, status
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel, Field
from ultralytics import YOLO
from paddleocr import PaddleOCR
from fastapi.middleware.cors import CORSMiddleware

# =============================================================================
# Logging
# =============================================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger("plate-ocr-service")

# =============================================================================
# Constants / Configuration
# =============================================================================
ALLOWED_MIME_TYPES = {"image/jpeg", "image/jpg", "image/png"}

VEHICLE_CLASS_IDS = {2, 3, 5, 7}  # car, motorcycle, bus, truck

YOLO_MODEL_PATH = "yolo11n.pt"
YOLO_CONFIDENCE_THRESHOLD = 0.35

MIN_PLATE_TEXT_LENGTH = 4
MIN_OCR_CONFIDENCE = 0.30

# Only uppercase alphanumeric characters are considered valid plate characters.
NON_PLATE_CHAR_PATTERN = re.compile(r"[^A-Z0-9]")

yolo_model: Optional[YOLO] = None
ocr_engine: Optional[PaddleOCR] = None


# =============================================================================
# Pydantic v2 Schemas
# =============================================================================
class DetectionResult(BaseModel):
    """A single OCR candidate extracted from a detected region."""

    plate_number: str = Field(..., description="Cleaned uppercase alphanumeric plate text")
    confidence: float = Field(..., ge=0.0, le=1.0, description="OCR confidence score")
    bounding_box: List[int] = Field(
        ..., min_length=4, max_length=4, description="[x1, y1, x2, y2] in the original image"
    )


class ExtractPlateResponse(BaseModel):
    """Response schema returned by POST /api/v1/extract-plate."""

    success: bool
    filename: str
    primary_plate_number: Optional[str] = None
    total_detections: int
    all_detections: List[DetectionResult] = Field(default_factory=list)


# =============================================================================
# Application Lifespan (model loading)
# =============================================================================
@asynccontextmanager
async def lifespan(_: FastAPI):
    """Load heavyweight ML models exactly once, at process startup."""
    global yolo_model, ocr_engine
    try:
        logger.info("Loading YOLOv11 detector: %s", YOLO_MODEL_PATH)
        yolo_model = YOLO(YOLO_MODEL_PATH)

        logger.info("Loading PaddleOCR engine (lang='en', use_angle_cls=True, enable_mkldnn=False)...")
        ocr_engine = PaddleOCR(lang="en", use_angle_cls=True, enable_mkldnn=False)

        logger.info("All models loaded successfully. Service is ready.")
    except Exception as exc:  # noqa: BLE001 - we want to fail loudly on startup
        logger.exception("Fatal error while loading models.")
        raise RuntimeError(f"Model initialization failed: {exc}") from exc

    yield  # ---- application runs here ----

    logger.info("Shutting down. Releasing model references.")
    yolo_model = None
    ocr_engine = None


app = FastAPI(
    title="Vehicle License Plate Detection & OCR API",
    description=(
        "Two-stage computer vision pipeline: YOLOv11 vehicle detection "
        "followed by PaddleOCR license plate text recognition."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# Helper Functions
# =============================================================================
def clean_plate_text(raw_text: str) -> str:
    """Uppercase the OCR text and strip every non alphanumeric character."""
    return NON_PLATE_CHAR_PATTERN.sub("", raw_text.upper())


def safe_crop(
    frame: np.ndarray, x1: int, y1: int, x2: int, y2: int
) -> Tuple[np.ndarray, Tuple[int, int, int, int]]:
    """
    Crop a region from `frame` with full boundary safety checks so that
    out-of-range YOLO boxes can never trigger an invalid NumPy slice.

    Returns the cropped array plus the *clamped* box that was actually used,
    so the caller can report accurate coordinates back to the client.
    """
    height, width = frame.shape[:2]

    clamped_x1 = max(0, min(x1, width - 1))
    clamped_y1 = max(0, min(y1, height - 1))
    clamped_x2 = max(clamped_x1 + 1, min(x2, width))
    clamped_y2 = max(clamped_y1 + 1, min(y2, height))

    cropped = frame[clamped_y1:clamped_y2, clamped_x1:clamped_x2]
    return cropped, (clamped_x1, clamped_y1, clamped_x2, clamped_y2)


def parse_ocr_result(ocr_raw_result) -> List[dict]:
    """
    Normalize PaddleOCR's `.ocr()` output across library versions into a flat
    list of {"text": str, "confidence": float} dicts.

    Classic PaddleOCR `.ocr()` output shape:
        [
            [ [box_points, (text, confidence)], [box_points, (text, confidence)], ... ]
        ]
    Some newer PaddleOCR builds return a list of dicts (predict-style) with
    "rec_texts" / "rec_scores" keys instead - both are handled defensively.
    """
    parsed: List[dict] = []
    if not ocr_raw_result:
        return parsed

    for page in ocr_raw_result:
        if not page:
            continue

        if isinstance(page, list):
            for line in page:
                try:
                    text = line[1][0]
                    confidence = float(line[1][1])
                    parsed.append({"text": text, "confidence": confidence})
                except (IndexError, TypeError, ValueError):
                    logger.debug("Skipping malformed OCR line: %s", line)
                    continue

        elif isinstance(page, dict):
            # Newer predict()-style dict format.
            texts = page.get("rec_texts", [])
            scores = page.get("rec_scores", [])
            for text, confidence in zip(texts, scores):
                try:
                    parsed.append({"text": text, "confidence": float(confidence)})
                except (TypeError, ValueError):
                    continue

    return parsed


def run_ocr(region: np.ndarray) -> List[dict]:
    """Run the PaddleOCR engine on a single image region and parse the result."""
    if region is None or region.size == 0:
        return []
    try:
        raw_result = ocr_engine.ocr(region)
    except Exception:
        logger.exception("PaddleOCR inference failed on a region; skipping it.")
        return []
    return parse_ocr_result(raw_result)


def build_detections(ocr_candidates: List[dict], box: Tuple[int, int, int, int]) -> List[DetectionResult]:
    """Filter and format raw OCR candidates into validated DetectionResult objects."""
    results: List[DetectionResult] = []
    for candidate in ocr_candidates:
        cleaned_text = clean_plate_text(candidate["text"])
        confidence = candidate["confidence"]
        if len(cleaned_text) >= MIN_PLATE_TEXT_LENGTH and confidence > MIN_OCR_CONFIDENCE:
            results.append(
                DetectionResult(
                    plate_number=cleaned_text,
                    confidence=round(confidence, 4),
                    bounding_box=list(box),
                )
            )
    return results


# =============================================================================
# API Endpoints
# =============================================================================
@app.post(
    "/api/v1/extract-plate",
    response_model=ExtractPlateResponse,
    summary="Detect vehicles and extract license plate text from an uploaded image",
)
async def extract_plate(file: UploadFile = File(...)) -> ExtractPlateResponse:
    """
    Pipeline:
      1. Validate the upload is a real JPEG/PNG image.
      2. Decode bytes in-memory (no disk writes) -> RGB PIL -> BGR OpenCV array.
      3. Run YOLOv11 to find vehicle bounding boxes; crop each safely.
      4. Run PaddleOCR on every crop; clean + filter the recognized text.
      5. If nothing survives filtering, fall back to OCR on the full frame.
      6. Rank all surviving detections by confidence and return the top one
         as `primary_plate_number`, alongside the full ranked list.
    """
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Unsupported content type '{file.content_type}'. "
                "Only image/jpeg and image/png uploads are accepted."
            ),
        )

    try:
        raw_bytes = await file.read()
        if not raw_bytes:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")

        try:
            pil_image = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
        except UnidentifiedImageError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File content could not be decoded as a valid image.",
            ) from exc

        bgr_frame = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        frame_height, frame_width = bgr_frame.shape[:2]

        if yolo_model is None:
            raise RuntimeError("YOLO model is not loaded.")

        candidate_regions: List[Tuple[np.ndarray, Tuple[int, int, int, int]]] = []
        yolo_results = yolo_model.predict(bgr_frame, conf=YOLO_CONFIDENCE_THRESHOLD, verbose=False)

        for result in yolo_results:
            boxes = result.boxes
            if boxes is None:
                continue
            for box in boxes:
                class_id = int(box.cls[0])
                if class_id not in VEHICLE_CLASS_IDS:
                    continue
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                cropped, clamped_box = safe_crop(bgr_frame, x1, y1, x2, y2)
                if cropped.size > 0:
                    candidate_regions.append((cropped, clamped_box))

        if ocr_engine is None:
            raise RuntimeError("PaddleOCR engine is not loaded.")

        all_detections: List[DetectionResult] = []
        for cropped_region, box_coords in candidate_regions:
            ocr_candidates = run_ocr(cropped_region)
            all_detections.extend(build_detections(ocr_candidates, box_coords))

        if not all_detections:
            logger.info("No plate text found in vehicle crops; falling back to full-frame OCR.")
            fallback_candidates = run_ocr(bgr_frame)
            full_frame_box = (0, 0, frame_width, frame_height)
            all_detections.extend(build_detections(fallback_candidates, full_frame_box))

        all_detections.sort(key=lambda detection: detection.confidence, reverse=True)
        primary_plate_number = all_detections[0].plate_number if all_detections else None

        return ExtractPlateResponse(
            success=True,
            filename=file.filename or "unknown",
            primary_plate_number=primary_plate_number,
            total_detections=len(all_detections),
            all_detections=all_detections,
        )

    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001 - convert anything unexpected into a clean 500
        logger.exception("Unhandled exception while processing '%s'.", file.filename)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal processing error: {exc}",
        ) from exc


@app.get("/health", summary="Service health & model-readiness check")
def health_check() -> dict:
    """Lightweight endpoint for load balancers / uptime monitors."""
    return {
        "status": "ok",
        "yolo_loaded": yolo_model is not None,
        "ocr_loaded": ocr_engine is not None,
    }


# =============================================================================
# Local dev entrypoint (production should use `uvicorn main:app` directly)
# =============================================================================
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)