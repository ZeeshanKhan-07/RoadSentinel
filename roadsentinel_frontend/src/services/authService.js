import apiClient from "../config/ApiClient";

export const loginUser = async (data) => {
  const response = await apiClient.post("/api/v1/auth/login", data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post("/api/v1/auth/logout");
  return response.data;
};