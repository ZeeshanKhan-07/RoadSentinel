import useAuth from "../auth/store";
import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
    timeout: 10000,
});

//for every requests
apiClient.interceptors.request.use((config) => {
    const accessToken = useAuth.getState().accessToken;
    if(accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config;
});

export default apiClient;