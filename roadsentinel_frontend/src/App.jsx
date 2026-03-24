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

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        {/* Public Routes - No Popup ever triggered here */}
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/order" element={<OrderForm/>} />

        {/* Protected Routes - These WILL trigger the popup if not logged in */}
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
                <ComplaintsPage/>
              </ProtectedRoute>
            }
        />
      </Routes>
    </>
  );
}

export default App;
