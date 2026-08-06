import apiClient from "../config/ApiClient";

export async function getTotalComplaints(userId) {
  try {
    // Prefix with /api/ (or /api/v1/ depending on your controller mapping)
    const response = await apiClient.get(`/api/v1/complaint/${userId}/totalComplaints`);
    return { total: response.data ?? 0, error: null };
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch total complaints.";
    return { total: 0, error: message };
  }
}

export async function getSuccessedComplaints(userId) {
  try {
    const response = await apiClient.get(
      `/api/v1/complaint/${userId}/successedComplaints`
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