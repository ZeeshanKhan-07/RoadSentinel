import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../auth/store";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  //have to make this file
  const login = useAuth((state) => state.login);

  const handleInputChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loginData.email.trim() === "") {
      toast.error("Input is required !!");
      return;
    }
    if (loginData.password.trim() === "") {
      toast.error("Input is required !!");
      return;
    }

    try {
      setLoading(true);
      await login(loginData);
      toast.success("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error !!");
      if (error?.status == 400) {
        setError(error);
      } else {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Login to access your authentication app
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-6 flex items-center gap-2 bg-red-100 text-red-700 p-3 rounded-lg">
            <span>
              {error?.response
                ? error?.response?.data?.message
                : error?.message}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>

            <div className="relative">

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                name="email"
                value={loginData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>

            <div className="relative">

              <input
                id="password"
                type="password"
                placeholder="••••••••"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Please wait..." : "Login"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-[1px] bg-gray-300"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
