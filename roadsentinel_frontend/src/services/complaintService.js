import apiClient from "../config/ApiClient";

export async function getUserComplaints(userId) {
  try {
    const response = await apiClient.get(`/complaint/${userId}/complaints`);
    // Sort newest first by raisedAt
    const sorted = (response.data || []).sort(
      (a, b) => new Date(b.raisedAt) - new Date(a.raisedAt)
    );
    return { data: sorted, error: null };
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch complaints.";
    return { data: [], error: message };
  }
}
