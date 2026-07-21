import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../auth/store";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useAuth((state) => state.authStatus);
  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate 
        to="/" 
        state={{ from: location, triggerLogin: true }} 
        replace 
      />
    );
  }

  return children;
};

export default ProtectedRoute;