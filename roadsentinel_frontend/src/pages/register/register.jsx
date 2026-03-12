import { useState, useRef, useEffect } from "react";

const API_BASE = "http://localhost:8080/api/v1/auth";

const Register = ({ onClose, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [sliding, setSliding] = useState(false);

  const step1Ref = useRef(null);
  const step2Ref = useRef(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, enable: false }),
      });
      if (!res.ok) throw new Error(await res.text());
      // Animate step 1 sliding out, then show step 2
      setSliding(true);
      setTimeout(() => {
        setStep(2);
        setSliding(false);
      }, 400);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) document.getElementById(`rs-otp-${i + 1}`)?.focus();
  };

  const handleOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      document.getElementById(`rs-otp-${i - 1}`)?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, verificationCode: otp.join("") }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStep(3);
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/resend?email=${encodeURIComponent(form.email)}`, { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
    } catch (err) {
      setError(err.message || "Could not resend code");
    }
  };

  const otpFilled = otp.join("").length === 6;

  return (
    <div className="w-full max-w-sm mx-auto" style={{ overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .rs-reg-input {
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
          box-sizing: border-box;
        }
        .rs-reg-input::placeholder { color: rgba(255,255,255,0.25); }
        .rs-reg-input:focus {
          border-color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.07);
        }

        .rs-otp-input {
          width: 42px;
          height: 48px;
          text-align: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          color: #fff;
          font-size: 20px;
          font-weight: 600;
          outline: none;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          font-family: 'DM Mono', monospace;
          caret-color: transparent;
        }
        .rs-otp-input:focus {
          border-color: rgba(255,255,255,0.55);
          background: rgba(255,255,255,0.08);
          transform: scale(1.06);
        }
        .rs-otp-input.filled {
          border-color: rgba(255,255,255,0.35);
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
          transition: background 0.2s, transform 0.1s, opacity 0.2s;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
        }
        .rs-btn-primary:hover:not(:disabled) { background: #e8e8e8; }
        .rs-btn-primary:active:not(:disabled) { transform: scale(0.99); }
        .rs-btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }

        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-40px); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step-slide-out { animation: slideOutLeft 0.35s ease forwards; }
        .step-slide-in { animation: slideInRight 0.4s ease forwards; }
        .step-fade-in { animation: fadeInUp 0.5s ease forwards; }

        .otp-digit-anim {
          animation: fadeInUp 0.35s ease backwards;
        }
      `}</style>

      {/* Brand */}
      <p style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center", marginBottom: "20px", textTransform: "uppercase" }}>
        Road Sentinel
      </p>

      {/* Step Progress — 2 steps only */}
      {step < 3 && (
        <div style={{ display: "flex", alignItems: "center", marginBottom: "22px" }}>
          {/* Step 1 dot */}
          <div style={{
            width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: 600, fontFamily: "'DM Mono', monospace", flexShrink: 0,
            background: step > 1 ? "#fff" : step === 1 ? "#fff" : "transparent",
            color: step >= 1 ? "#000" : "rgba(255,255,255,0.25)",
            border: step >= 1 ? "none" : "1px solid rgba(255,255,255,0.15)",
            transition: "all 0.4s ease",
          }}>
            {step > 1 ? "✓" : "1"}
          </div>
          {/* Connector line */}
          <div style={{ flex: 1, height: "1px", background: step > 1 ? "#fff" : "rgba(255,255,255,0.1)", margin: "0 8px", transition: "background 0.5s ease" }} />
          {/* Step 2 dot */}
          <div style={{
            width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: 600, fontFamily: "'DM Mono', monospace", flexShrink: 0,
            background: step >= 2 ? "#fff" : "transparent",
            color: step >= 2 ? "#000" : "rgba(255,255,255,0.25)",
            border: step >= 2 ? "none" : "1px solid rgba(255,255,255,0.15)",
            transition: "all 0.4s ease",
          }}>
            {step > 2 ? "✓" : "2"}
          </div>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className={sliding ? "step-slide-out" : ""}>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>
            Create account
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "18px" }}>
            Fill in your details to get started.
          </p>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", padding: "10px 13px", marginBottom: "14px", fontSize: "13px", color: "#f87171", fontFamily: "'DM Sans', sans-serif" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div>
              <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.45)", marginBottom: "4px", letterSpacing: "0.04em" }}>FULL NAME</label>
              <input className="rs-reg-input" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.45)", marginBottom: "4px", letterSpacing: "0.04em" }}>EMAIL</label>
              <input className="rs-reg-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.45)", marginBottom: "4px", letterSpacing: "0.04em" }}>PASSWORD</label>
              <input className="rs-reg-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>

            <button className="rs-btn-primary" type="submit" disabled={loading} style={{ marginTop: "6px" }}>
              {loading ? "Creating account…" : "Continue →"}
            </button>
          </form>

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>Already have an account? </span>
            <button onClick={onSwitchToLogin} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
              Sign in
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 — OTP */}
      {step === 2 && (
        <div className="step-slide-in">
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>
            Verify your email
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>
            We sent a 6-digit code to
          </p>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "rgba(255,255,255,0.75)", marginBottom: "20px", background: "rgba(255,255,255,0.06)", display: "inline-block", padding: "4px 9px", borderRadius: "6px" }}>
            {form.email}
          </p>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", padding: "10px 13px", marginBottom: "20px", fontSize: "13px", color: "#f87171", fontFamily: "'DM Sans', sans-serif" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleVerify}>
            {/* OTP Boxes */}
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "16px" }}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`rs-otp-${i}`}
                  className={`rs-otp-input otp-digit-anim ${d ? "filled" : ""}`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKey(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {/* Visual fill indicator */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "16px", justifyContent: "center" }}>
              {otp.map((d, i) => (
                <div key={i} style={{ height: "2px", width: "32px", borderRadius: "2px", background: d ? "#fff" : "rgba(255,255,255,0.1)", transition: "background 0.2s" }} />
              ))}
            </div>

            <button className="rs-btn-primary" type="submit" disabled={loading || !otpFilled}>
              {loading ? "Verifying…" : "Verify & Continue"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "14px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
            Didn't get the code?{" "}
            <button onClick={handleResend} style={{ color: "rgba(255,255,255,0.65)", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", textDecoration: "underline", textUnderlineOffset: "3px" }}>
              Resend
            </button>
          </p>
        </div>
      )}

      {/* STEP 3 — Success */}
      {step === 3 && (
        <div className="step-fade-in" style={{ textAlign: "center", paddingTop: "4px" }}>
          <div style={{ width: "48px", height: "48px", background: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "20px" }}>
            ✓
          </div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "6px" }}>
            You're in.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>
            Your account has been verified and is ready to go.
          </p>
          <button
            className="rs-btn-primary"
            onClick={onSwitchToLogin}
          >
            Go to Login →
          </button>
        </div>
      )}
    </div>
  );
};

export default Register;