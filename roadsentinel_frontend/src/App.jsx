import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/home/home";
import Dashboard from "./pages/dashboard/Dashboard";
import OptionsPage from "./pages/Options/OptionsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import StorePage from "./pages/Store/StorePage";
import ComplaintsPage from "./pages/Complaints/ComplaintsPage";
import OrderForm from "./pages/Order/OrderForm";
import AdminLoginPage from "./pages/Admins/Admin/AdminLoginPage";
import AdminRoleProtectedRoute from "./routes/AdminRoleProtectedRoute";
import AdminDashboard from "./pages/Admins/Admin/AdminDashboard";
import AppLayout from "./layout/AppLayout";
import ProductAdminPage from "./pages/Admins/Admin/ProductAdminPage";
function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/order" element={<OrderForm />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/raiseChallanRequestOptions"
            element={
              <ProtectedRoute>
                <OptionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/complaints"
            element={
              <ProtectedRoute>
                <ComplaintsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/auth/login" element={<AdminLoginPage />} />

        <Route
          path="/admin/product-admin/dashboard"
          element={
            <AdminRoleProtectedRoute
              allowedRoles={["ROLE_PRODUCT_ADMIN"]}
            >
              <AdminDashboard />
            </AdminRoleProtectedRoute>
          }
        />

        <Route path='/admin/product/dashboard' element={<ProductAdminPage />} />
      </Routes>
    </>
  );
}

export default App;