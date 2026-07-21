import axios from "axios";

const API_URL = "http://localhost:8080/admin/auth";

/**
 * Step 1 — email + password.
 */
export const adminLogin = async ({ email, password }) => {
  const response = await axios.post(
    `${API_URL}/login`,
    { email, password },
    { withCredentials: true }
  );

  return response.data;
};

/**
 * Step 2 — email + verificationCode.
 */
export const verifyAdminLoginOtp = async ({
  email,
  verificationCode,
}) => {
  const response = await axios.post(
    `${API_URL}/verify-login`,
    { email, verificationCode },
    { withCredentials: true }
  );

  return response.data;
};