import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../auth/store";

const Login = ({ onClose, onSwitchToRegister }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Redirect to backend Google OAuth endpoint.
  // Your Spring Boot backend should have GET /api/v1/auth/oauth2/google
  // which triggers the OAuth2 flow and redirects back to your frontend on success.
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.email.trim()) { toast.error("Email is required"); return; }
    if (!loginData.password.trim()) { toast.error("Password is required"); return; }

    try {
      setLoading(true);
      await login(loginData);
      toast.success("Login Successful");
      onClose();
      navigate("/dashboard");
    } catch (err) {
      toast.error("Login failed");
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        .rs-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 14px;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .rs-input::placeholder { color: rgba(255,255,255,0.25); }
        .rs-input:focus {
          border-color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.07);
        }
        .rs-btn-primary {
          width: 100%;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 10px;
          padding: 13px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
        }
        .rs-btn-primary:hover:not(:disabled) { background: #e8e8e8; }
        .rs-btn-primary:active:not(:disabled) { transform: scale(0.99); }
        .rs-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
        .rs-btn-google {
          width: 100%;
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.1s;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .rs-btn-google:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.3); }
        .rs-btn-google:active { transform: scale(0.99); }
        .rs-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 14px 0;
        }
        .rs-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .rs-divider-text { font-family: 'DM Sans', sans-serif; font-size: 12px; color: rgba(255,255,255,0.25); white-space: nowrap; }
      `}</style>

      {/* Brand tag */}
      <p style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center", marginBottom: "20px", textTransform: "uppercase" }}>
        Road Sentinel
      </p>

      <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>
        Welcome back
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "18px" }}>
        Sign in to your account to continue.
      </p>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", padding: "9px 12px", marginBottom: "12px", fontSize: "13px", color: "#f87171", fontFamily: "'DM Sans', sans-serif" }}>
          {error?.response?.data?.message || error?.message || "Something went wrong"}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div>
          <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.45)", marginBottom: "4px", letterSpacing: "0.04em" }}>
            EMAIL
          </label>
          <input
            className="rs-input"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={loginData.email}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.45)", marginBottom: "4px", letterSpacing: "0.04em" }}>
            PASSWORD
          </label>
          <input
            className="rs-input"
            type="password"
            name="password"
            placeholder="••••••••"
            value={loginData.password}
            onChange={handleInputChange}
          />
        </div>

        <button className="rs-btn-primary" type="submit" disabled={loading} style={{ marginTop: "6px" }}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      {/* Divider */}
      <div className="rs-divider">
        <div className="rs-divider-line" />
        <span className="rs-divider-text">OR CONTINUE WITH</span>
        <div className="rs-divider-line" />
      </div>

      {/* Google OAuth Button */}
      <button className="rs-btn-google" onClick={handleGoogleLogin} type="button">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.64 9.2045C17.64 8.5663 17.5827 7.9527 17.4764 7.3636H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.2045Z" fill="#4285F4"/>
          <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
          <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.5931 3.68182 9C3.68182 8.4069 3.78409 7.83 3.96409 7.29V4.9582H0.957275C0.347727 6.1731 0 7.5477 0 9C0 10.4523 0.347727 11.8269 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
          <path d="M9 3.5795C10.3214 3.5795 11.5077 4.0336 12.4405 4.9255L15.0218 2.3441C13.4632 0.8918 11.4259 0 9 0C5.48182 0 2.43818 2.0168 0.957275 4.9582L3.96409 7.29C4.67182 5.1627 6.65591 3.5795 9 3.5795Z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
          Don't have an account?{" "}
        </span>
        <button
          onClick={onSwitchToRegister}
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          Create one
        </button>
      </div>
    </div>
  );
};

export default Login;