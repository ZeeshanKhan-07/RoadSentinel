// Points at your local plate-recognition service.
// Move this to an env var (e.g. import.meta.env.VITE_PLATE_API_URL) once you
// have a real deployment URL.
const PLATE_EXTRACTION_URL = "http://127.0.0.1:8000/api/v1/extract-plate";

/**
 * Sends a single image file to the plate-extraction API.
 * @param {File} file
 * @returns {Promise<{
 *   success: boolean,
 *   filename: string,
 *   primary_plate_number: string,
 *   total_detections: number,
 *   all_detections: Array<{ plate_number: string, confidence: number, bounding_box: number[] }>
 * }>}
 */
export async function extractPlateNumber(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(PLATE_EXTRACTION_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Plate extraction failed (status ${res.status}).`);
  }

  const data = await res.json();

  if (!data.success || !data.primary_plate_number) {
    throw new Error("No number plate detected in the uploaded image.");
  }

  return data;
}

/**
 * Tries each image in order (skips videos) and returns on the first
 * successful detection. Useful when the user has uploaded multiple photos
 * and the first one doesn't clearly show the plate.
 * @param {File[]} files
 */
export async function extractPlateFromFiles(files) {
  const images = files.filter((f) => f.type.startsWith("image/"));

  if (images.length === 0) {
    throw new Error("Upload at least one image to auto-detect the plate.");
  }

  let lastError = null;
  for (const image of images) {
    try {
      return await extractPlateNumber(image);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error("Could not detect a plate in the uploaded images.");
}