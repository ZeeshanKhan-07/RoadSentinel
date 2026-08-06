import axios from "axios";
import useAuth from "../auth/store";
import useAdminAuth from "../auth/Useadminauth"; // Adjust import path if needed

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // Ensures HttpOnly refresh cookie is sent
});

// ============================================================================
// 1. REQUEST INTERCEPTOR: Strictly routes Admin vs User tokens
// ============================================================================
apiClient.interceptors.request.use(
  (config) => {
    const adminToken = useAdminAuth.getState().accessToken;
    const userToken = useAuth.getState().accessToken;

    // Check if the target route is an admin endpoint
    const isAdminEndpoint = config.url?.includes("/admin");

    if (isAdminEndpoint) {
      // Admin endpoints strictly receive Admin Token
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      // User endpoints strictly receive User Token (NO fallback to adminToken!)
      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================================
// 2. RESPONSE INTERCEPTOR: Silent Token Refresh & 401 Queueing
// ============================================================================
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent refresh loops on auth routes
      if (
        originalRequest.url.includes("/auth/login") ||
        originalRequest.url.includes("/auth/refresh") ||
        originalRequest.url.includes("/admin/auth")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
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
        // Call backend refresh endpoint
        const response = await axios.post(
          "http://localhost:8080/api/v1/auth/refresh",
          {},
          { withCredentials: true }
        );

        const { accessToken, refreshToken, user } = response.data;

        // Determine which session to update based on request path or active role
        const isAdminSession = originalRequest.url.includes("/admin");

        if (isAdminSession) {
          useAdminAuth.setState({
            accessToken,
            refreshToken,
            admin: user,
            isAdminLoggedIn: true,
          });
        } else {
          useAuth.getState().changeLocalLoginData(accessToken, user, true);
        }

        processQueue(null, accessToken);

        // Retry failed request with new access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear respective store on failed refresh
        if (originalRequest.url.includes("/admin")) {
          useAdminAuth.getState().logoutAdmin();
        } else {
          useAuth.getState().logout(true);
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;