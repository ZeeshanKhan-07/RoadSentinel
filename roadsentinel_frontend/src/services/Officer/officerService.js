import axios from "axios";
import useAdminAuth from "../../auth/useAdminAuth"; 

const BASE_OFFICER_URL = "http://localhost:8080/api/admin/officer";

const getAuthHeaders = () => {
  const { accessToken } = useAdminAuth.getState();
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };
};

export const officerService = {
  // 1. Get Dashboard Summary Data
  getDashboardSummary: async () => {
    try {
      const response = await axios.get(
        `${BASE_OFFICER_URL}/admin/dashboard-summary`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching officer dashboard summary:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Failed to load dashboard metrics.");
    }
  },

  // 2. Fetch All Complaints
  getAllComplaints: async () => {
    try {
      const response = await axios.get(
        `${BASE_OFFICER_URL}/all`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching officer complaints:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Failed to load complaints catalog.");
    }
  },

  // 3. Fetch Complainant Details by Complaint ID
  getUserByComplaintId: async (complaintId) => {
    try {
      const response = await axios.get(
        `${BASE_OFFICER_URL}/${complaintId}/user`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user by complaint ID:", error?.response?.data || error.message);
      return null;
    }
  },

  // 4. Update Complaint Status (APPROVED, REJECTED, PENDING, UNDER_REVIEW)
  updateComplaintStatus: async (complaintId, status) => {
    try {
      const response = await axios.patch(
        `${BASE_OFFICER_URL}/${complaintId}/status?status=${status}`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error updating complaint status:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Failed to update complaint status.");
    }
  },

  // 5. Assign Reward Amount (PATCH /api/admin/officer/{complaintId}/reward?rewardAmount=50)
  assignReward: async (complaintId, rewardAmount) => {
    try {
      const response = await axios.patch(
        `${BASE_OFFICER_URL}/${complaintId}/reward?rewardAmount=${rewardAmount}`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error assigning reward:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Failed to assign reward amount.");
    }
  },
};