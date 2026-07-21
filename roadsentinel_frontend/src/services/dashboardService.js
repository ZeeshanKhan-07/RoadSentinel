import axios from "axios";
import useAdminAuth from "../auth/useAdminAuth"; // Adjust path as needed

const BASE_URL = "http://localhost:8080/api/admin/product";

// Helper to get headers with Bearer token
const getAuthHeaders = () => {
  const { accessToken } = useAdminAuth.getState();
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };
};

export const dashboardService = {
  // 1. Get Circular Metrics (Order Status)
  getCircularMetrics: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/charts/circular-metrics`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error fetching circular metrics:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Failed to load circular metrics.");
    }
  },

  // 2. Get Top 3 Dashboard Metrics
  getDashboardMetrics: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/dashboard-metrics`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Failed to load dashboard metrics.");
    }
  },

  // 3. Get Bar Metrics (Product Quantity)
  getBarMetrics: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/charts/bar-metrics`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error fetching bar metrics:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Failed to load product bar metrics.");
    }
  },
};