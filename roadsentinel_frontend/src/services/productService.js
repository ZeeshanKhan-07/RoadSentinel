import apiClient from "../config/ApiClient";

export async function getAllProducts() {
  try {
    const response = await apiClient.get("/api/products/allProducts");
    return { data: response.data || [], error: null };
  } catch (err) {
    return {
      data: [],
      error: err?.response?.data?.message || err?.message || "Failed to fetch products.",
    };
  }
}

export async function placeOrder(payload) {
  try {
    const response = await apiClient.post("/api/order/placeOrder", payload);
    if (response.status === 200 || response.status === 201) {
      return { success: true, data: response.data, error: null };
    }
    return { success: false, data: null, error: "Unexpected response." };
  } catch (err) {
    return {
      success: false,
      data: null,
      error: err?.response?.data?.message || err?.message || "Failed to place order.",
    };
  }
}