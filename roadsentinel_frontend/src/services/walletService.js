import apiClient from "../config/ApiClient";

export const getUserBalance = async () => {
  const response = await apiClient.get("/api/wallet/balance");
  return response.data;
};