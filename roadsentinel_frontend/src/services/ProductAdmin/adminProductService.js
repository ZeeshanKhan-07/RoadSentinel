import axios from "axios";
import useAdminAuth from "../../auth/useAdminAuth"; // Adjust path if needed

const PRODUCTS_URL = "http://localhost:8080/api/products";
const ADMIN_PRODUCT_URL = "http://localhost:8080/api/admin/product";

// Helper to construct headers with Bearer token
const getAuthHeaders = (isFormData = false) => {
  const { accessToken } = useAdminAuth.getState();
  
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  // Only set JSON explicitly. For FormData, let Axios set the boundary header automatically!
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return { headers };
};

export const productService = {
  // 1. Get All Products (Public/Customer Endpoint)
  getAllProducts: async () => {
    try {
      const response = await axios.get(`${PRODUCTS_URL}/allProducts`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Failed to load products catalog.");
    }
  },

  // 2. Add New Product (Hits /api/admin/product/addProduct)
  addProduct: async (productData, imageFiles) => {
    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("quantity", productData.quantity);
      formData.append("price", productData.price);
      
      if (productData.productVehicleCategory) {
        formData.append("productVehicleCategory", productData.productVehicleCategory);
      }
      if (productData.productGenderCategory) {
        formData.append("productGenderCategory", productData.productGenderCategory);
      }

      // Attach image files
      if (imageFiles && imageFiles.length > 0) {
        Array.from(imageFiles).forEach((file) => {
          formData.append("images", file);
        });
      }

      // FIXED: Using ADMIN_PRODUCT_URL (/api/admin/product/addProduct)
      const response = await axios.post(`${ADMIN_PRODUCT_URL}/addProduct`, formData, getAuthHeaders(true));
      return response.data;
    } catch (error) {
      console.error("Error adding product:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Failed to create new product.");
    }
  },

  // 3. Edit/Update Product (Hits /api/admin/product/{id})
  updateProduct: async (productId, updatedFields) => {
    try {
      const formData = new FormData();
      Object.keys(updatedFields).forEach((key) => {
        if (updatedFields[key] !== null && updatedFields[key] !== undefined) {
          formData.append(key, updatedFields[key]);
        }
      });

      const response = await axios.put(`${ADMIN_PRODUCT_URL}/${productId}`, formData, getAuthHeaders(true));
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Failed to update product.");
    }
  },

  // 4. Delete Product by ID (Hits /api/admin/product/{id})
  deleteProduct: async (productId) => {
    try {
      const response = await axios.delete(`${ADMIN_PRODUCT_URL}/${productId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || "Failed to delete product.");
    }
  },
};