import { Navigate } from "react-router-dom";
import useAdminAuth from "../auth/adminAuthStore";

const AdminRoleProtectedRoute = ({ children, allowedRoles }) => {
  const admin = useAdminAuth((state) => state.admin);
  const isLoggedIn = useAdminAuth(
    (state) => state.isAdminLoggedIn
  );

  if (!isLoggedIn) {
    return <Navigate to="/admin/auth/login" replace />;
  }

  const hasAccess = admin?.roles?.some((role) =>
    allowedRoles.includes(role.name)
  );

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AdminRoleProtectedRoute;