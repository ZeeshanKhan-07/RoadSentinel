import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { adminLogin, verifyAdminLoginOtp } from "../../../services/adminAuthService";
import useAdminAuth, { getDashboardPath } from "../../../auth/useAdminAuth";
import workingAdminIllustration from "../../../assets/images/Admin/AdminWorking.svg";

const OTP_LENGTH = 6;

export default function AdminLogin() {
  const navigate = useNavigate();
  const loginAdmin = useAdminAuth((s) => s.loginAdmin);

  // "credentials" -> "otp"
  const [step, setStep] = useState("credentials");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const otpRefs = useRef([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const lineRef = useRef(null);
  const illustrationRef = useRef(null);
  const formRef = useRef(null);

  // ---- Page load-in animation: corner accent draws in, illustration
  // card settles into place, then gently floats (signature moment) ----
  useLayoutEffect(() => {
    const line = lineRef.current;
    const length = line.getTotalLength();
    gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      leftPanelRef.current,
      { autoAlpha: 0, x: -24 },
      { autoAlpha: 1, x: 0, duration: 0.6 }
    )
      .to(line, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 0.15)
      .fromTo(
        illustrationRef.current,
        { autoAlpha: 0, scale: 0.92, y: 16 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.4)" },
        0.3
      )
      .fromTo(
        rightPanelRef.current,
        { autoAlpha: 0, x: 24 },
        { autoAlpha: 1, x: 0, duration: 0.6 },
        0.1
      )
      .add(() => {
        // gentle idle float, kept subtle on purpose
        gsap.to(illustrationRef.current, {
          y: -10,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

    return () => tl.kill();
  }, []);

  // ---- Crossfade whenever the step changes (credentials <-> otp) ----
  useEffect(() => {
    if (!formRef.current) return;
    gsap.fromTo(
      formRef.current,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
  }, [step]);

  // ---- Resend cooldown ticker ----
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const shakeForm = () => {
    if (!formRef.current) return;
    gsap.fromTo(
      formRef.current,
      { x: -8 },
      { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" }
    );
  };

  // ---- Step 1: submit email + password ----
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      shakeForm();
      return;
    }

    setLoading(true);
    try {
      await adminLogin({ email, password });
      setStep("otp");
      setResendCooldown(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
      shakeForm();
    } finally {
      setLoading(false);
    }
  };

  // ---- OTP box handling ----
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted
      .slice(0, OTP_LENGTH)
      .split("")
      .forEach((d, i) => (next[i] = d));
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  // ---- Step 2: submit OTP, then role-based redirect ----
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const verificationCode = otp.join("");
    if (verificationCode.length !== OTP_LENGTH) {
      setError("Please enter the full 6-digit code.");
      shakeForm();
      return;
    }

    setLoading(true);
    try {
      const data = await verifyAdminLoginOtp({ email, verificationCode });
      loginAdmin(data);
      navigate(getDashboardPath(data.user), { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "That code didn't work. Please check and try again."
      );
      shakeForm();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    try {
      await adminLogin({ email, password });
      setResendCooldown(30);
    } catch (err) {
      setError("Couldn't resend the code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#4A4A4A] overflow-hidden">
      {/* ---------------- Left illustration panel ---------------- */}
      <div
        ref={leftPanelRef}
        className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden px-12 py-12"
      >
        {/* Short corner accent instead of a full-height diagonal */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 508 568"
          preserveAspectRatio="none"
        >
          <line
            ref={lineRef}
            x1="383"
            y1="90"
            x2="508"
            y2="0"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1.5"
          />
        </svg>

        <div
          ref={illustrationRef}
          className="relative z-10 flex w-full max-w-md items-center justify-center rounded-[32px] bg-[#6b6b6b] p-10 shadow-2xl"
        >
          <img
            src={workingAdminIllustration}
            alt="Illustration of an admin working at a desk"
            className="w-full max-w-xs"
          />
        </div>
      </div>

      {/* ---------------- Right form panel ---------------- */}
      <div
        ref={rightPanelRef}
        className="flex flex-1 items-center justify-center bg-[#555555] px-6 py-12 sm:px-12"
      >
        <div className="w-full max-w-md">
          <h2 className="text-center font-display text-4xl text-white">
            Admin Login
          </h2>
          <p className="mt-3 text-sm text-center font-grotesk text-gray-300">
            {step === "credentials"
              ? "Manage products, orders, and challans."
              : `Enter the 6-digit code we sent to ${email}.`}
          </p>

          {error && (
            <div className="mt-5 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* -------- Step 1: credentials -------- */}
          {step === "credentials" && (
            <form
              ref={formRef}
              onSubmit={handleCredentialsSubmit}
              className="mt-6"
            >
              <label className="mb-1.5 block font-display text-sm text-gray-200">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg bg-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 outline-none ring-0 transition focus:bg-white focus:ring-2 focus:ring-gray-900/20"
              />

              <label className="mb-1.5 mt-5 block font-display text-sm text-gray-200">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 outline-none ring-0 transition focus:bg-white focus:ring-2 focus:ring-gray-900/20"
              />

              {/* space + slight divider before the Sign In button */}
              <div className="mt-8 mb-6 h-px w-full bg-gray-400/30" />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black/70 py-3.5 text-sm font-display text-white transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          {/* -------- Step 2: OTP -------- */}
          {step === "otp" && (
            <form ref={formRef} onSubmit={handleOtpSubmit} className="mt-6">
              <label className="mb-3 block text-sm text-gray-200">
                Verification Code
              </label>
              <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    inputMode="numeric"
                    maxLength={1}
                    className="h-14 w-12 rounded-lg bg-gray-200 text-center text-lg font-semibold text-gray-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-gray-900/20 sm:w-14"
                  />
                ))}
              </div>

              <div className="mt-8 mb-6 h-px w-full bg-gray-400/30" />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black/70 py-3.5 text-sm font-medium text-white transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>

              <div className="mt-5 flex items-center justify-between text-sm text-gray-300">
                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setError("");
                    setOtp(Array(OTP_LENGTH).fill(""));
                  }}
                  className="hover:text-white"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="font-medium text-white hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
                >
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Resend code"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}