import axios from "axios";
import useAuth from "../auth/store";

const apiClient = axios.create({
  baseURL: "http://localhost:8080", // Base server URL
  withCredentials: true,             // Ensures HttpOnly refresh cookie is sent
});

// 1. Request Interceptor: Attach access token to every outgoing request
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuth.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Handle 401s and refresh tokens silently
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle expired access token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't attempt to refresh if the login or refresh endpoint itself failed
      if (
        originalRequest.url.includes("/api/v1/auth/login") ||
        originalRequest.url.includes("/api/v1/auth/refresh")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue concurrent requests while token refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Post to backend refresh endpoint
        const response = await axios.post(
          "http://localhost:8080/api/v1/auth/refresh",
          {},
          { withCredentials: true }
        );

        const { accessToken, user } = response.data;

        // Update Zustand store with fresh credentials
        useAuth.getState().changeLocalLoginData(accessToken, user, true);

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Refresh token expired or revoked -> log out
        useAuth.getState().logout(true);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;