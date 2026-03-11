import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/auth";

export const loginUser = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data, {
    withCredentials: true,
  });

  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post(`${API_URL}/logout`);

  return response.data;
};
