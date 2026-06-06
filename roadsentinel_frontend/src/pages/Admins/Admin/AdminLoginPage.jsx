import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { adminLogin } from "../../../services/adminAuthService";
import loginPageImage from "../../../assets/images/Admin/loginPageImage.png";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left panel slides in from left
      gsap.fromTo(
        leftRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
      );

      // Right image fades + scales in
      gsap.fromTo(
        rightRef.current,
        { x: 60, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 0.15 }
      );

      // Stagger form children
      gsap.fromTo(
        formRef.current?.children,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.3,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Button press animation
    gsap.to(e.currentTarget.querySelector("button[type=submit]"), {
      scale: 0.96,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    try {
      const data = await adminLogin(email, password);
      if (data.requiresOtp) {
        navigate("/admin/verify-otp", { state: { email } });
      }
    } catch (err) {
      setError(err.message);
      // Shake the form on error
      gsap.fromTo(
        formRef.current,
        { x: -8 },
        { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* ── LEFT PANEL ── */}
      <div
        ref={leftRef}
        className="flex flex-col justify-center px-10 md:px-16 lg:px-24 w-full md:w-1/2 relative"
      >
        {/* Accent bar */}
        <div className="absolute top-12 left-10 md:left-16 lg:left-24 w-8 h-1 bg-violet-500 rounded-full" />

        <div className="mt-10">
          <h1 className="text-2xl font-semibold text-gray-800 mb-8 tracking-tight">
            Login as a Admin User
          </h1>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 max-w-sm">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder="johndoe@xyz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-full px-5 py-3 pr-12 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                </svg>
              </span>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-full px-5 py-3 pr-12 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-xs px-1">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-500 hover:bg-violet-600 disabled:bg-violet-300 text-white font-semibold tracking-widest text-sm rounded-full py-3 transition-colors duration-200"
            >
              {loading ? "Please wait..." : "LOGIN"}
            </button>

            {/* Forgot */}
            <div className="text-center pt-1">
              <p className="text-sm text-gray-500">Forget your password?</p>
              <a href="#" className="text-sm text-violet-500 hover:text-violet-700 font-medium transition-colors">
                Get help Signed in.
              </a>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="absolute bottom-8 left-10 md:left-16 lg:left-24 text-xs text-gray-400">
          Terms of use. Privacy policy
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        ref={rightRef}
        className="hidden md:flex w-1/2 items-center justify-center bg-white"
      >
        <img
          src={loginPageImage}
          alt="Admin Login"
          className="w-full h-full object-contain max-w-lg"
          onError={(e) => {
            // Fallback gracefully if image path not yet wired
            e.currentTarget.style.opacity = "0.15";
          }}
        />
      </div>
    </div>
  );
}