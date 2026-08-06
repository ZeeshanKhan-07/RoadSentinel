import apiClient from "../config/ApiClient"; // Adjust relative path as needed

export const dashboardService = {
  // 1. Get Circular Metrics (Order Status)
  getCircularMetrics: async () => {
    try {
      const response = await apiClient.get("/api/admin/product/charts/circular-metrics");
      return response.data;
    } catch (error) {
      console.error("Error fetching circular metrics:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Failed to load circular metrics.");
    }
  },

  // 2. Get Top 3 Dashboard Metrics
  getDashboardMetrics: async () => {
    try {
      const response = await apiClient.get("/api/admin/product/dashboard-metrics");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Failed to load dashboard metrics.");
    }
  },

  // 3. Get Bar Metrics (Product Quantity)
  getBarMetrics: async () => {
    try {
      const response = await apiClient.get("/api/admin/product/charts/bar-metrics");
      return response.data;
    } catch (error) {
      console.error("Error fetching bar metrics:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Failed to load product bar metrics.");
    }
  },
};