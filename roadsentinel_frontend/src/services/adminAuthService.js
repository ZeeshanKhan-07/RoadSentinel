import apiClient from "../config/ApiClient";

export const adminLogin = async ({ email, password }) => {
  const response = await apiClient.post("/admin/auth/login", {
    email,
    password,
  });
  return response.data;
};


export const verifyAdminLoginOtp = async ({ email, verificationCode }) => {
  const response = await apiClient.post("/admin/auth/verify-login", {
    email,
    verificationCode,
  });
  return response.data;
};