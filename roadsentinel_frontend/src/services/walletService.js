import apiClient from "../config/ApiClient";

export async function amount(userId) {
  try {
    const response = await apiClient.post("/api/wallet/balance", { userId });
    return { amount: response.data ?? 0, error: null };
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch wallet balance.";
    return { amount: 0, error: message };
  }
}