// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { gsap } from "gsap";
// import { verifyAdminOtp } from "../../../services/adminAuthService";
// import otpVerificationImage from "../../../assets/images/Admin/otpVerificationImages.png";
// import useAdminAuth from "../../../auth/adminAuthStore";
// const OTP_LENGTH = 6;
// const RESEND_SECONDS = 41;

// export default function AdminOtpVerification() {
//   const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [countdown, setCountdown] = useState(RESEND_SECONDS);

//   const inputsRef = useRef([]);
//   const leftRef = useRef(null);
//   const rightRef = useRef(null);
//   const cardRef = useRef(null);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const email = location.state?.email || "";

//   const loginAdmin = useAdminAuth((state) => state.loginAdmin);

//   // Entrance animation
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         leftRef.current,
//         { x: -60, opacity: 0 },
//         { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
//       );
//       gsap.fromTo(
//         rightRef.current,
//         { x: 60, opacity: 0 },
//         { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.15 },
//       );
//       gsap.fromTo(
//         cardRef.current?.children,
//         { y: 20, opacity: 0 },
//         {
//           y: 0,
//           opacity: 1,
//           stagger: 0.08,
//           duration: 0.55,
//           ease: "power2.out",
//           delay: 0.3,
//         },
//       );
//     });
//     return () => ctx.revert();
//   }, []);

//   // Countdown timer
//   useEffect(() => {
//     if (countdown <= 0) return;
//     const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [countdown]);

//   // Animate a single OTP input bubble on fill
//   const animateBubble = (index) => {
//     gsap.fromTo(
//       inputsRef.current[index],
//       { scale: 1.25 },
//       { scale: 1, duration: 0.35, ease: "back.out(2)" },
//     );
//   };

//   const handleChange = (value, index) => {
//     if (!/^[0-9]?$/.test(value)) return;
//     const updated = [...otp];
//     updated[index] = value;
//     setOtp(updated);
//     if (value && index < OTP_LENGTH - 1) {
//       inputsRef.current[index + 1]?.focus();
//     }
//     if (value) animateBubble(index);
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputsRef.current[index - 1]?.focus();
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pasted = e.clipboardData
//       .getData("text")
//       .replace(/\D/g, "")
//       .slice(0, OTP_LENGTH);
//     const updated = Array(OTP_LENGTH).fill("");
//     pasted.split("").forEach((char, i) => {
//       updated[i] = char;
//     });
//     setOtp(updated);
//     inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
//   };

//   const handleConfirm = async () => {
//     const code = otp.join("");
//     if (code.length < OTP_LENGTH) {
//       setError("Please enter the complete 6-digit code.");
//       gsap.fromTo(
//         cardRef.current,
//         { x: -8 },
//         { x: 0, duration: 0.4, ease: "elastic.out(1,0.3)" },
//       );
//       return;
//     }
//     setError("");
//     setLoading(true);

//     try {
//       const data = await verifyAdminOtp(email, code);
//       loginAdmin(data);

//       const role = data.user.roles?.[0]?.name;

//       switch (role) {
//         case "ROLE_PRODUCT_ADMIN":
//           navigate("/admin/product/dashboard");
//           break;

//         case "ROLE_OFFICER":
//           navigate("/admin/officer/dashboard");
//           break;

//         case "ROLE_ORDER_ADMIN":
//           navigate("/admin/order/dashboard");
//           break;

//         default:
//           navigate("/admin/dashboard");
//       }

//       gsap.to(cardRef.current, {
//         scale: 1.02,
//         duration: 0.2,
//         yoyo: true,
//         repeat: 1,
//       });
//     } catch (err) {
//       setError(err.message);
//       gsap.fromTo(
//         cardRef.current,
//         { x: -10 },
//         { x: 0, duration: 0.45, ease: "elastic.out(1,0.3)" },
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = () => {
//     if (countdown > 0) return;
//     setCountdown(RESEND_SECONDS);
//     setOtp(Array(OTP_LENGTH).fill(""));
//     setError("");
//   };

//   const maskedEmail = email
//     ? email.replace(/(.{2}).+(@.+)/, "$1****$2")
//     : "your email";

//   const pad = (n) => String(n).padStart(2, "0");

//   return (
//     <div className="min-h-screen bg-white flex">
//       {/* ── LEFT PANEL ── */}
//       <div
//         ref={leftRef}
//         className="flex flex-col justify-center items-center px-10 md:px-16 lg:px-24 w-full md:w-1/2"
//       >
//         <div ref={cardRef} className="w-full max-w-sm space-y-6">
//           {/* Heading */}
//           <div className="text-center">
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">
//               Check your email
//             </h1>
//             <p className="text-sm text-gray-500 leading-relaxed">
//               Please enter the six digit verification code we sent to
//             </p>
//             <p className="text-sm font-semibold text-gray-800 mt-0.5">
//               {maskedEmail}
//             </p>
//           </div>

//           {/* OTP Inputs */}
//           <div className="flex justify-center gap-3" onPaste={handlePaste}>
//             {otp.map((digit, i) => (
//               <input
//                 key={i}
//                 ref={(el) => (inputsRef.current[i] = el)}
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) => handleChange(e.target.value, i)}
//                 onKeyDown={(e) => handleKeyDown(e, i)}
//                 className={`
//                   w-11 h-11 rounded-full border-2 text-center text-base font-semibold outline-none
//                   transition-all duration-200
//                   ${
//                     digit
//                       ? "border-violet-500 bg-violet-50 text-violet-700"
//                       : "border-gray-200 bg-gray-50 text-gray-700"
//                   }
//                   focus:border-violet-500 focus:ring-2 focus:ring-violet-100
//                 `}
//               />
//             ))}
//           </div>

//           {/* Error */}
//           {error && <p className="text-red-500 text-xs text-center">{error}</p>}

//           {/* Confirm button */}
//           <button
//             onClick={handleConfirm}
//             disabled={loading}
//             className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-semibold py-3 rounded-full text-sm tracking-wide transition-colors duration-200"
//           >
//             {loading ? "Verifying..." : "Confirm"}
//           </button>

//           {/* Resend */}
//           <p className="text-center text-sm text-gray-500">
//             Didn't get the email?{" "}
//             {countdown > 0 ? (
//               <span className="text-gray-400">
//                 Resent in {pad(Math.floor(countdown / 60))}:
//                 {pad(countdown % 60)}
//               </span>
//             ) : (
//               <button
//                 onClick={handleResend}
//                 className="text-violet-500 hover:text-violet-700 font-medium transition-colors"
//               >
//                 Resend now
//               </button>
//             )}
//           </p>

//           {/* Back */}
//           <button
//             onClick={() => navigate("/admin/auth/login")}
//             className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mx-auto transition-colors"
//           >
//             <svg
//               width="16"
//               height="16"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.8"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M19 12H5M12 5l-7 7 7 7"
//               />
//             </svg>
//             back
//           </button>
//         </div>
//       </div>

//       {/* ── RIGHT PANEL ── */}
//       <div
//         ref={rightRef}
//         className="hidden md:flex w-1/2 items-center justify-center bg-white"
//       >
//         <img
//           src={otpVerificationImage}
//           alt="OTP Verification"
//           className="w-full h-full object-contain max-w-lg"
//           onError={(e) => {
//             e.currentTarget.style.opacity = "0.15";
//           }}
//         />
//       </div>
//     </div>
//   );
// }
