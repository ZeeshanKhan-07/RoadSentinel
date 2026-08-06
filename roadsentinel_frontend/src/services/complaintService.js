import apiClient from "../config/ApiClient";

// Base API route for complaints
const COMPLAINT_BASE_URL = "/api/v1/complaint";

/**
 * Builds the multipart FormData payload expected by the backend's
 * ComplaintDTO — one field per key, plus a "media" entry per file.
 * @param {{
 *   form: {
 *     vehicleNumber: string, vehicleType: string, violationType: string,
 *     description: string, address: string, city: string, state: string,
 *     latitude?: string, longitude?: string
 *   },
 *   files: File[],
 *   userId: string | number
 * }} params
 * @returns {FormData}
 */
export function buildComplaintFormData({ form, files, userId }) {
  const formData = new FormData();

  formData.append("userId", userId);
  formData.append("address", form.address);
  formData.append("city", form.city);
  formData.append("state", form.state);
  formData.append("vehicleNumber", form.vehicleNumber);
  formData.append("vehicleType", form.vehicleType);
  formData.append("violationType", form.violationType);
  formData.append("description", form.description);

  if (form.latitude) formData.append("latitude", form.latitude);
  if (form.longitude) formData.append("longitude", form.longitude);

  files.forEach((file) => {
    formData.append("media", file);
  });

  return formData;
}

// 1. Register a new complaint
export async function registerComplaint(formData) {
  try {
    const response = await apiClient.post(
      `${COMPLAINT_BASE_URL}/register`,
      formData,
    );
    return { data: response.data, error: null };
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to submit complaint.";
    return { data: null, error: message };
  }
}

// 2. Get user complaints list
export async function getUserComplaints(userId) {
  try {
    const response = await apiClient.get(
      `${COMPLAINT_BASE_URL}/${userId}/complaints`,
    );

    const complaints = Array.isArray(response.data) ? response.data : [];

    // Sort newest first by raisedAt
    const sorted = complaints.sort((a, b) => {
      const dateA = a?.raisedAt ? new Date(a.raisedAt).getTime() : 0;
      const dateB = b?.raisedAt ? new Date(b.raisedAt).getTime() : 0;
      return dateB - dateA;
    });

    return { data: sorted, error: null };
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch complaints.";
    return { data: [], error: message };
  }
}

// 3. Get total complaints count
export async function getTotalComplaints(userId) {
  try {
    const response = await apiClient.get(
      `${COMPLAINT_BASE_URL}/${userId}/totalComplaints`,
    );
    return { total: response.data ?? 0, error: null };
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch total complaints.";
    return { total: 0, error: message };
  }
}

// 4. Get successful complaints count
export async function getSuccessedComplaints(userId) {
  try {
    const response = await apiClient.get(
      `${COMPLAINT_BASE_URL}/${userId}/successedComplaints`,
    );
    return { total: response.data ?? 0, error: null };
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch successed complaints.";
    return { total: 0, error: message };
  }
}