import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../auth/store";
import toast from "react-hot-toast";
const Navbar = () => {
  const navigate = useNavigate();

    const isLoggedIn = useAuth((state) => state.authStatus);
  const user = useAuth((state)=> state.user);
  const logout = useAuth((state)=> state.logout);


  const handleLogOut = () => {
    toast.success("Successfully logged out!!");
    logout();
  }

  return (
    <nav className="w-full bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">

        {/* Logo */}
        <h1 className="text-xl font-bold">Road Sentinel</h1>

        {/* Buttons */}
        <div className="flex gap-4">

          {!isLoggedIn && (
            <>
              <Link
                to="/"
                className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-gray-200"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-gray-200"
              >
                Register
              </Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <Link
                to="/dashboard"
                className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-gray-200"
              >
                {user?.name}
              </Link>

              <button
                onClick={handleLogOut}
                className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-gray-200"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;