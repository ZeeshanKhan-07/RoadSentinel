import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../auth/store";

/**
 * A wrapper component that checks if a user is authenticated.
 * If not, it redirects them to the Home page and sends a signal 
 * to the Navbar to open the login modal.
 */
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useAuth((state) => state.authStatus);
  const location = useLocation();

  if (!isLoggedIn) {
    // We redirect to "/" but pass the current location in 'state'
    // 'triggerLogin' tells the Navbar to show the popup
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