import axios from "axios";
import useAdminAuth from "../../auth/Useadminauth"; // Adjust path if needed

const ADMIN_PRODUCT_ORDERS_URL = "http://localhost:8080/api/admin/product/orders";

// Helper to construct headers with Bearer token
const getAuthHeaders = () => {
  const { accessToken } = useAdminAuth.getState();
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };
};

export const adminOrderService = {
  // 1. Get all product orders
  getAllOrders: async () => {
    try {
      const response = await axios.get(`${ADMIN_PRODUCT_ORDERS_URL}/all`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error fetching admin orders:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Failed to load orders list.");
    }
  },

  // 2. Update product order status (PATCH /api/admin/product/orders/{orderId}/status?status=...)
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const response = await axios.patch(
        `${ADMIN_PRODUCT_ORDERS_URL}/${orderId}/status?status=${newStatus}`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Failed to update order status.");
    }
  },
};