// OrderForm.jsx
// Order placement form. Receives `product` via React Router location.state.
// Dependencies: React, React Router, Tailwind CSS, GSAP, react-hot-toast

import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import useAuth from "../../auth/store";
import { placeOrder } from "../../services/productService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Resolve any image URL — Cloudinary (https://...) or backend relative path
const getImgSrc = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE_URL}${url}`;
};

// ── Field Label Component ─────────────────────────────────────
function Label({ children, required, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block font-semibold mb-1.5 text-[clamp(0.72rem,1.3vw,0.82rem)] tracking-[0.07em] uppercase text-gray-400 font-sans"
    >
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
}

// ── Input Field Component ─────────────────────────────────────
function Field({ id, label, required, error, textarea, ...props }) {
  const [focused, setFocused] = useState(false);

  const baseClasses = `
    w-full bg-white/5 rounded-lg text-gray-100 font-sans text-[clamp(0.82rem,1.4vw,0.95rem)]
    outline-none transition-colors duration-200 px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.55rem,1.2vw,0.75rem)] resize-none
    ${
      error
        ? "border-[1.5px] border-red-400"
        : focused
        ? "border-[1.5px] border-white/45"
        : "border-[1.5px] border-neutral-600/30"
    }
  `;

  return (
    <div>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      {textarea ? (
        <textarea
          id={id}
          rows={3}
          className={baseClasses}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={!!error}
          {...props}
        />
      ) : (
        <input
          id={id}
          className={baseClasses}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={!!error}
          {...props}
        />
      )}
      {error && (
        <p className="font-sans text-[0.72rem] text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}

// ── Section Divider Component ─────────────────────────────────
function Section({ title, children, sRef }) {
  return (
    <div ref={sRef} className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="font-sans text-[clamp(0.65rem,1.1vw,0.72rem)] font-bold tracking-[0.12em] uppercase text-gray-600">
          {title}
        </span>
        <div className="flex-1 h-[1px] bg-white/10" />
      </div>
      {children}
    </div>
  );
}

// ── Main OrderForm Component ──────────────────────────────────
export default function OrderForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;
  const userId = useAuth((state) => state.user?.id);

  const wrapperRef = useRef(null);
  const headerRef = useRef(null);
  const sectionsRef = useRef([]);
  const submitRef = useRef(null);

  // "idle" | "submitting" | "success" | "error"
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");

  const [addr, setAddr] = useState({
    phone: "",
    houseNo: "",
    street: "",
    locality: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const setA = (key) => (e) => {
    setAddr((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // Redirect if no product present
  useEffect(() => {
    if (!product) {
      navigate("/store");
    }
  }, [product, navigate]);

  // GSAP Entrance Animations
  useEffect(() => {
    if (!product || status !== "idle") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        headerRef.current,
        { y: -28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 }
      );
      tl.fromTo(
        sectionsRef.current.filter(Boolean),
        { y: 45, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 },
        "-=0.2"
      );
      tl.fromTo(
        submitRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        "-=0.1"
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, [product, status]);

  const validate = () => {
    const errs = {};
    if (!addr.phone.trim()) errs.phone = "Phone is required.";
    if (!addr.houseNo.trim()) errs.houseNo = "House No. is required.";
    if (!addr.street.trim()) errs.street = "Street is required.";
    if (!addr.city.trim()) errs.city = "City is required.";
    if (!addr.state.trim()) errs.state = "State is required.";
    if (!addr.pincode.trim()) errs.pincode = "Pincode is required.";
    if (!addr.country.trim()) errs.country = "Country is required.";
    if (quantity < 1) errs.quantity = "Quantity must be at least 1.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      document
        .getElementById(`of-${firstErrorKey}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("submitting");

    const payload = {
      userId,
      items: [
        {
          productId: product.id,
          quantity,
          size: product.sizes ? selectedSize : undefined,
        },
      ],
      address: { ...addr, phone: addr.phone.trim() },
    };

    const { success, error } = await placeOrder(payload);

    if (success) {
      setStatus("success");
    } else {
      toast.error(error || "Order failed. Please try again.");
      setStatus("error");
    }
  };

  if (!product) return null;

  const thumb = getImgSrc(product.images?.[0]);

  // ── Success View ───────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#080808] font-sans">
        <div className="w-[72px] h-[72px] rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center mb-6 animate-[popIn_0.5s_ease_forwards]">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M7 16L13 22L25 10"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-white font-extrabold text-[clamp(1.5rem,3.5vw,2.2rem)] tracking-tight mb-2">
          Order Placed!
        </h2>
        <p className="text-gray-500 text-[clamp(0.82rem,1.5vw,1rem)] max-w-[340px] leading-relaxed mb-9">
          Your order for <strong className="text-white">{product.name}</strong>{" "}
          has been placed successfully. We'll notify you with updates.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 font-bold uppercase tracking-wider text-black bg-white rounded-lg text-[clamp(0.78rem,1.3vw,0.9rem)] px-[clamp(1.4rem,3vw,2rem)] py-[clamp(0.65rem,1.5vw,0.85rem)] hover:opacity-90 active:scale-95 transition-all"
          >
            See My Orders
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7H12M12 7L8 3M12 7L8 11"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 font-bold uppercase tracking-wider text-gray-500 bg-transparent border-[1.5px] border-neutral-600/30 rounded-lg text-[clamp(0.78rem,1.3vw,0.9rem)] px-[clamp(1.4rem,3vw,2rem)] py-[clamp(0.65rem,1.5vw,0.85rem)] hover:opacity-80 active:scale-95 transition-all"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  // ── Error View ────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#080808] font-sans">
        <div className="w-[72px] h-[72px] rounded-full bg-red-500/10 border-2 border-red-400 flex items-center justify-center mb-6 animate-[popIn_0.5s_ease_forwards]">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M10 10L22 22M22 10L10 22"
              stroke="#f87171"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2 className="text-white font-extrabold text-[clamp(1.5rem,3.5vw,2.2rem)] tracking-tight mb-2">
          Order Failed
        </h2>
        <p className="text-gray-500 text-[clamp(0.82rem,1.5vw,1rem)] max-w-[340px] leading-relaxed mb-9">
          Something went wrong while placing your order. Please try again.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="flex items-center gap-2 font-bold uppercase tracking-wider text-black bg-white rounded-lg text-[clamp(0.78rem,1.3vw,0.9rem)] px-[clamp(1.4rem,3vw,2rem)] py-[clamp(0.65rem,1.5vw,0.85rem)] hover:opacity-90 active:scale-95 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── Form View ─────────────────────────────────────────────
  return (
    <div
      ref={wrapperRef}
      className="min-h-screen w-full flex flex-col items-center bg-[#080808] font-sans pt-[30px]"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full flex flex-col gap-8 px-4 sm:px-6 py-8 max-w-[720px]"
      >
        {/* Order Summary Section */}
        <Section title="Order Summary" sRef={(el) => (sectionsRef.current[0] = el)}>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border-[1.5px] border-neutral-600/20">
            <div className="w-[72px] h-[72px] rounded-lg overflow-hidden shrink-0 bg-neutral-900 flex items-center justify-center">
              {thumb ? (
                <img
                  src={thumb}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-700">
                  <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                    <rect
                      x="4"
                      y="8"
                      width="32"
                      height="24"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-[clamp(0.88rem,1.6vw,1rem)] text-white mb-1 truncate">
                {product.name}
              </p>
              <p className="font-extrabold text-[clamp(1rem,2vw,1.2rem)] text-emerald-400">
                ₹{product.price?.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-2" id="of-quantity">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-[30px] h-[30px] rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center active:scale-95 transition-transform"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6H10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <span className="font-bold text-white text-[0.95rem] min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min(product.quantity || 99, q + 1))
                }
                className="w-[30px] h-[30px] rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center active:scale-95 transition-transform"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M6 2V10M2 6H10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Size Selector (Renders only if options exist) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center justify-between px-1">
              <span className="text-[0.82rem] text-gray-500">Select Size</span>
              <div className="flex gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      selectedSize === sz
                        ? "bg-white text-black"
                        : "bg-white/5 text-gray-400 border border-white/10"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[0.82rem] font-display text-white">Total Amount</span>
            <span className="font-extrabold text-[clamp(1rem,2vw,1.2rem)] text-emerald-400">
              ₹{((product.price || 0) * quantity).toLocaleString("en-IN")}
            </span>
          </div>
          {errors.quantity && (
            <p className="text-[0.72rem] text-red-400">{errors.quantity}</p>
          )}
        </Section>

        {/* Delivery Address Section */}
        <Section title="Delivery Address" sRef={(el) => (sectionsRef.current[1] = el)}>
          <div id="of-phone">
            <Field
              id="phone-input"
              label="Phone Number"
              required
              placeholder="e.g. 9876543210"
              value={addr.phone}
              onChange={setA("phone")}
              maxLength={15}
              error={errors.phone}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div id="of-houseNo">
              <Field
                id="houseNo-input"
                label="House No."
                required
                placeholder="e.g. 12B"
                value={addr.houseNo}
                onChange={setA("houseNo")}
                error={errors.houseNo}
              />
            </div>
            <div id="of-street">
              <Field
                id="street-input"
                label="Street"
                required
                placeholder="e.g. MG Road"
                value={addr.street}
                onChange={setA("street")}
                error={errors.street}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              id="locality-input"
              label="Locality"
              placeholder="e.g. Kankarbagh"
              value={addr.locality}
              onChange={setA("locality")}
            />
            <Field
              id="landmark-input"
              label="Landmark"
              placeholder="e.g. Near SBI Bank"
              value={addr.landmark}
              onChange={setA("landmark")}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div id="of-city">
              <Field
                id="city-input"
                label="City"
                required
                placeholder="e.g. Patna"
                value={addr.city}
                onChange={setA("city")}
                error={errors.city}
              />
            </div>
            <div id="of-state">
              <Field
                id="state-input"
                label="State"
                required
                placeholder="e.g. Bihar"
                value={addr.state}
                onChange={setA("state")}
                error={errors.state}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div id="of-pincode">
              <Field
                id="pincode-input"
                label="Pincode"
                required
                placeholder="e.g. 800020"
                value={addr.pincode}
                onChange={setA("pincode")}
                maxLength={10}
                error={errors.pincode}
              />
            </div>
            <div id="of-country">
              <Field
                id="country-input"
                label="Country"
                required
                placeholder="e.g. India"
                value={addr.country}
                onChange={setA("country")}
                error={errors.country}
              />
            </div>
          </div>
        </Section>

        {/* Submit Actions */}
        <div ref={submitRef} className="flex flex-col sm:flex-row gap-3 pb-8 opacity-0">
          <button
            type="submit"
            disabled={status === "submitting"}
            className={`flex-1 flex items-center justify-center gap-2 font-display uppercase tracking-wider text-black bg-white rounded-lg text-[clamp(0.78rem,1.3vw,0.9rem)] py-[clamp(0.7rem,1.5vw,0.9rem)] px-8 transition-all ${
              status === "submitting"
                ? "opacity-70 cursor-not-allowed"
                : "hover:opacity-90 active:scale-95"
            }`}
          >
            {status === "submitting" ? (
              <>
                <svg
                  className="animate-spin w-[15px] h-[15px]"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <circle
                    cx="7.5"
                    cy="7.5"
                    r="6"
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="2"
                  />
                  <path
                    d="M7.5 1.5 A6 6 0 0 1 13.5 7.5"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Placing Order…
              </>
            ) : (
              <>
                Confirm Order
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7H12M12 7L8 3M12 7L8 11"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 font-display uppercase tracking-wider text-gray-500 bg-transparent border-[1.5px] border-neutral-600/30 rounded-lg text-[clamp(0.78rem,1.3vw,0.9rem)] py-[clamp(0.7rem,1.5vw,0.9rem)] px-6 hover:opacity-80 active:scale-95 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}