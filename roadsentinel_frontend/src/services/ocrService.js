import axios from "axios";

const OCR_API_URL = "http://127.0.0.1:8000/api/v1/extract-plate";

export function formatPlateNumber(rawPlate) {
  if (!rawPlate) return "";
  const cleaned = rawPlate.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  const bhMatch = cleaned.match(/^(\d{2})(BH)(\d{4})([A-Z]{1,2})$/);
  if (bhMatch) {
    return `${bhMatch[1]} ${bhMatch[2]} ${bhMatch[3]} ${bhMatch[4]}`;
  }

  const stdMatch = cleaned.match(/^([A-Z]{2})(\d{2})([A-Z]{1,3})(\d{4})$/);
  if (stdMatch) {
    return `${stdMatch[1]} ${stdMatch[2]} ${stdMatch[3]} ${stdMatch[4]}`;
  }

  return cleaned;
}

export async function extractPlateNumber(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(OCR_API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data && response.data.success) {
      const rawPlate = response.data.primary_plate_number || "";
      return {
        success: true,
        rawPlate,
        formattedPlate: formatPlateNumber(rawPlate),
        allDetections: response.data.all_detections || [],
      };
    }
    return { success: false, error: "No plate detected" };
  } catch (err) {
    console.error("OCR Extraction Error:", err);
    return {
      success: false,
      error: err.response?.data?.detail || "Failed to extract license plate.",
    };
  }
}