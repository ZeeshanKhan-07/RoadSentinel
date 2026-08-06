import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/home/home";
import Dashboard from "./pages/UserDashboard/Dashboard";
import OptionsPage from "./pages/Options/OptionsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import StorePage from "./pages/Store/StorePage";
import ComplaintsPage from "./pages/Complaints/ComplaintsPage";
import OrderForm from "./pages/Order/OrderForm";
import AdminLoginPage from "./pages/Admins/ProductAdmin/AdminLoginPage";
import AdminRoleProtectedRoute from "./routes/AdminRoleProtectedRoute";
import AdminDashboard from "./pages/Admins/ProductAdmin/AdminDashboard";
import AppLayout from "./layout/AppLayout";
import ProductAdminPage from "./pages/Admins/ProductAdmin/ProductAdminPage";
import OfficerPage from "./pages/Admins/Officer/OfficerPage";
import FontTest from "./components/FontTest";
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
        <Route path='/admin/officer/dashboard' element={<OfficerPage />} />
        <Route path='/font-test' element={<FontTest />}/>
      </Routes>
    </>
  );
}

export default App;