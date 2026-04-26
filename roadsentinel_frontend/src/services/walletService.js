import axios from "axios";
import useAuth from "../auth/store";

const API_URL = "http://localhost:8080/api/wallet";

export const getUserBalance = async () => {
  const token = useAuth.getState().accessToken;

  const response = await axios.get(`${API_URL}/balance`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};