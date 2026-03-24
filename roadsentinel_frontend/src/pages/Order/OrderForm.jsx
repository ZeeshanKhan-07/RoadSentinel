import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import useAuth from "../../auth/store";
import { placeOrder } from "../../services/ProductService";

const BASE_URL = "http://localhost:8080";

// ── Field label ───────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label className="block font-semibold mb-1.5" style={{
      fontFamily: "'Inter',sans-serif",
      fontSize: "clamp(0.72rem,1.3vw,0.82rem)",
      letterSpacing: "0.07em",
      textTransform: "uppercase",
      color: "#9ca3af",
    }}>
      {children}
      {required && <span style={{ color:"#f87171", marginLeft:3 }}>*</span>}
    </label>
  );
}

// ── Input field ───────────────────────────────────────────────
function Field({ label, required, error, textarea, ...props }) {
  const [focused, setFocused] = useState(false);
  const base = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: error
      ? "1.5px solid #f87171"
      : focused
      ? "1.5px solid rgba(255,255,255,0.45)"
      : "1.5px solid rgba(120,120,130,0.3)",
    borderRadius: "8px",
    color: "#f3f4f6",
    fontFamily: "'Inter',sans-serif",
    fontSize: "clamp(0.82rem,1.4vw,0.95rem)",
    outline: "none",
    transition: "border-color 0.2s",
    padding: "clamp(0.55rem,1.2vw,0.75rem) clamp(0.75rem,1.5vw,1rem)",
    resize: "none",
  };
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      {textarea
        ? <textarea rows={3} style={base} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} {...props}/>
        : <input style={base} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} {...props}/>
      }
      {error && <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.72rem", color:"#f87171", marginTop:"0.3rem" }}>{error}</p>}
    </div>
  );
}

// ── Section divider ───────────────────────────────────────────
function Section({ title, children, sRef }) {
  return (
    <div ref={sRef} className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.65rem,1.1vw,0.72rem)", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#4b5563" }}>
          {title}
        </span>
        <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }}/>
      </div>
      {children}
    </div>
  );
}

// ── Main OrderForm ────────────────────────────────────────────
export default function OrderForm() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const product   = location.state?.product;
  const userId    = useAuth((state) => state.user?.id);

  const wrapperRef  = useRef(null);
  const headerRef   = useRef(null);
  const sectionsRef = useRef([]);
  const submitRef   = useRef(null);

  // "idle" | "submitting" | "success" | "error"
  const [status,   setStatus]   = useState("idle");
  const [errors,   setErrors]   = useState({});
  const [quantity, setQuantity] = useState(1);

  const [addr, setAddr] = useState({
    phone:    "", houseNo:  "", street:   "", locality: "",
    landmark: "", city:     "", state:    "", pincode:  "", country: "India",
  });

  const setA = (key) => (e) => {
    setAddr((p) => ({ ...p, [key]: e.target.value }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  // Redirect if no product passed
  useEffect(() => {
    if (!product) { navigate("/store"); }
  }, [product, navigate]);

  // GSAP entrance
  useEffect(() => {
    if (!product || status !== "idle") return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(headerRef.current,   { y:-28, opacity:0 }, { y:0, opacity:1, duration:0.5 });
      tl.fromTo(sectionsRef.current, { y:45,  opacity:0 }, { y:0, opacity:1, duration:0.5, stagger:0.12 }, "-=0.2");
      tl.fromTo(submitRef.current,   { y:20,  opacity:0 }, { y:0, opacity:1, duration:0.4 }, "-=0.1");
    }, wrapperRef);
    return () => ctx.revert();
  }, [product, status]);

  const validate = () => {
    const e = {};
    if (!addr.phone.trim())    e.phone    = "Phone is required.";
    if (!addr.houseNo.trim())  e.houseNo  = "House No. is required.";
    if (!addr.street.trim())   e.street   = "Street is required.";
    if (!addr.city.trim())     e.city     = "City is required.";
    if (!addr.state.trim())    e.state    = "State is required.";
    if (!addr.pincode.trim())  e.pincode  = "Pincode is required.";
    if (!addr.country.trim())  e.country  = "Country is required.";
    if (quantity < 1)          e.quantity = "Quantity must be at least 1.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length > 0) {
      setErrors(ve);
      const first = Object.keys(ve)[0];
      document.getElementById(`of-${first}`)?.scrollIntoView({ behavior:"smooth", block:"center" });
      return;
    }

    setStatus("submitting");

    const payload = {
      userId,
      items: [{ productId: product.id, quantity, size: "M" }],
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

  const thumb = product.images?.[0]
    ? (product.images[0].startsWith("http") ? product.images[0] : `${BASE_URL}${product.images[0]}`)
    : null;

  // ── Success ───────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background:"#080808", fontFamily:"'Inter',sans-serif" }}>
        <style>{`@keyframes popIn{0%{transform:scale(0.6);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}`}</style>
        <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(52,211,153,0.1)", border:"2px solid #34d399", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1.5rem", animation:"popIn 0.5s ease forwards" }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M7 16L13 22L25 10" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 style={{ color:"#fff", fontWeight:800, fontSize:"clamp(1.5rem,3.5vw,2.2rem)", letterSpacing:"-0.02em", marginBottom:"0.6rem" }}>
          Order Placed!
        </h2>
        <p style={{ color:"#6b7280", fontSize:"clamp(0.82rem,1.5vw,1rem)", maxWidth:340, lineHeight:1.6, marginBottom:"2.2rem" }}>
          Your order for <strong style={{ color:"#fff" }}>{product.name}</strong> has been placed successfully. We'll notify you with updates.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => navigate("/orders")}
            className="flex items-center gap-2 font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
            style={{ background:"#fff", color:"#000", border:"none", borderRadius:8, fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.78rem,1.3vw,0.9rem)", letterSpacing:"0.07em", padding:"clamp(0.65rem,1.5vw,0.85rem) clamp(1.4rem,3vw,2rem)", cursor:"pointer" }}>
            See My Orders
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={() => navigate("/store")}
            className="flex items-center gap-2 font-bold uppercase tracking-wider hover:opacity-80 active:scale-95 transition-all"
            style={{ background:"transparent", color:"#6b7280", border:"1.5px solid rgba(120,120,130,0.3)", borderRadius:8, fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.78rem,1.3vw,0.9rem)", letterSpacing:"0.07em", padding:"clamp(0.65rem,1.5vw,0.85rem) clamp(1.4rem,3vw,2rem)", cursor:"pointer" }}>
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background:"#080808", fontFamily:"'Inter',sans-serif" }}>
        <style>{`@keyframes popIn{0%{transform:scale(0.6);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}`}</style>
        <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(248,113,113,0.1)", border:"2px solid #f87171", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1.5rem", animation:"popIn 0.5s ease forwards" }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M10 10L22 22M22 10L10 22" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 style={{ color:"#fff", fontWeight:800, fontSize:"clamp(1.5rem,3.5vw,2.2rem)", letterSpacing:"-0.02em", marginBottom:"0.6rem" }}>
          Order Failed
        </h2>
        <p style={{ color:"#6b7280", fontSize:"clamp(0.82rem,1.5vw,1rem)", maxWidth:340, lineHeight:1.6, marginBottom:"2.2rem" }}>
          Something went wrong while placing your order. Please try again.
        </p>
        <button onClick={() => setStatus("idle")}
          className="flex items-center gap-2 font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
          style={{ background:"#fff", color:"#000", border:"none", borderRadius:8, fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.78rem,1.3vw,0.9rem)", letterSpacing:"0.07em", padding:"clamp(0.65rem,1.5vw,0.85rem) clamp(1.4rem,3vw,2rem)", cursor:"pointer" }}>
          Try Again
        </button>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────
  return (
    <div ref={wrapperRef} className="min-h-screen w-full flex flex-col items-center"
      style={{ background:"#080808", fontFamily:"'Inter',sans-serif" }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div ref={headerRef}
        className="w-full sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6"
        style={{ background:"rgba(8,8,8,0.95)", backdropFilter:"blur(12px)", height:"clamp(52px,8vw,64px)", opacity:0 }}>
        <button type="button" onClick={() => navigate(-1)}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
          style={{ color:"#9ca3af", fontFamily:"'Inter',sans-serif", fontSize:"0.85rem", fontWeight:500, background:"none", border:"none" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <h1 style={{ color:"#fff", fontFamily:"'Inter',sans-serif", fontWeight:800, fontSize:"clamp(0.9rem,2vw,1.15rem)", letterSpacing:"-0.01em", position:"absolute", left:"50%", transform:"translateX(-50%)" }}>
          Place Order
        </h1>
        <div style={{ width:60 }}/>
      </div>

      <form onSubmit={handleSubmit} noValidate
        className="w-full flex flex-col gap-8 px-4 sm:px-6 py-8"
        style={{ maxWidth:"720px" }}>

        {/* ── Product Summary ── */}
        <Section title="Order Summary" sRef={(el) => (sectionsRef.current[0] = el)}>
          <div className="flex items-center gap-4 p-4 rounded-xl"
            style={{ background:"rgba(255,255,255,0.03)", border:"1.5px solid rgba(120,120,130,0.2)" }}>
            {/* Thumbnail */}
            <div style={{ width:72, height:72, borderRadius:10, overflow:"hidden", flexShrink:0, background:"#111" }}>
              {thumb
                ? <img src={thumb} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                : <div className="w-full h-full flex items-center justify-center" style={{ color:"#374151" }}>
                    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                      <rect x="4" y="8" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:"clamp(0.88rem,1.6vw,1rem)", color:"#fff", marginBottom:"0.2rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {product.name}
              </p>
              <p style={{ fontFamily:"'Inter',sans-serif", fontWeight:800, fontSize:"clamp(1rem,2vw,1.2rem)", color:"#34d399" }}>
                ₹{product.price?.toLocaleString("en-IN")}
              </p>
            </div>
            {/* Quantity stepper */}
            <div className="flex items-center gap-2" id="of-quantity">
              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{ width:30, height:30, borderRadius:8, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
              <span style={{ fontFamily:"'Inter',sans-serif", fontWeight:700, color:"#fff", fontSize:"0.95rem", minWidth:20, textAlign:"center" }}>{quantity}</span>
              <button type="button" onClick={() => setQuantity((q) => Math.min(product.quantity || 99, q + 1))}
                style={{ width:30, height:30, borderRadius:8, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
          {/* Total */}
          <div className="flex items-center justify-between px-1">
            <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.82rem", color:"#6b7280" }}>Total Amount</span>
            <span style={{ fontFamily:"'Inter',sans-serif", fontWeight:800, fontSize:"clamp(1rem,2vw,1.2rem)", color:"#34d399" }}>
              ₹{((product.price || 0) * quantity).toLocaleString("en-IN")}
            </span>
          </div>
          {errors.quantity && <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.72rem", color:"#f87171" }}>{errors.quantity}</p>}
        </Section>

        {/* ── Delivery Address ── */}
        <Section title="Delivery Address" sRef={(el) => (sectionsRef.current[1] = el)}>
          <div id="of-phone">
            <Field label="Phone Number" required placeholder="e.g. 9876543210" value={addr.phone} onChange={setA("phone")} maxLength={15} error={errors.phone}/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div id="of-houseNo">
              <Field label="House No." required placeholder="e.g. 12B" value={addr.houseNo} onChange={setA("houseNo")} error={errors.houseNo}/>
            </div>
            <div id="of-street">
              <Field label="Street" required placeholder="e.g. MG Road" value={addr.street} onChange={setA("street")} error={errors.street}/>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Locality" placeholder="e.g. Kankarbagh" value={addr.locality} onChange={setA("locality")}/>
            <Field label="Landmark" placeholder="e.g. Near SBI Bank" value={addr.landmark} onChange={setA("landmark")}/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div id="of-city">
              <Field label="City" required placeholder="e.g. Patna" value={addr.city} onChange={setA("city")} error={errors.city}/>
            </div>
            <div id="of-state">
              <Field label="State" required placeholder="e.g. Bihar" value={addr.state} onChange={setA("state")} error={errors.state}/>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div id="of-pincode">
              <Field label="Pincode" required placeholder="e.g. 800020" value={addr.pincode} onChange={setA("pincode")} maxLength={10} error={errors.pincode}/>
            </div>
            <div id="of-country">
              <Field label="Country" required placeholder="e.g. India" value={addr.country} onChange={setA("country")} error={errors.country}/>
            </div>
          </div>
        </Section>

        {/* ── Submit ── */}
        <div ref={submitRef} className="flex flex-col sm:flex-row gap-3 pb-8" style={{ opacity:0 }}>
          <button type="submit" disabled={status === "submitting"}
            className="flex items-center justify-center gap-2 font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
            style={{
              flex:1, background: status === "submitting" ? "rgba(255,255,255,0.7)" : "#ffffff",
              color:"#000", border:"none", borderRadius:8, fontFamily:"'Inter',sans-serif",
              fontSize:"clamp(0.78rem,1.3vw,0.9rem)", letterSpacing:"0.07em",
              padding:"clamp(0.7rem,1.5vw,0.9rem) 2rem",
              cursor: status === "submitting" ? "not-allowed" : "pointer",
            }}>
            {status === "submitting" ? (
              <>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ animation:"spin 1s linear infinite" }}>
                  <circle cx="7.5" cy="7.5" r="6" stroke="rgba(0,0,0,0.2)" strokeWidth="2"/>
                  <path d="M7.5 1.5 A6 6 0 0 1 13.5 7.5" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Placing Order…
              </>
            ) : (
              <>
                Confirm Order
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
          <button type="button" onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 font-bold uppercase tracking-wider hover:opacity-80 active:scale-95 transition-all"
            style={{ background:"transparent", color:"#6b7280", border:"1.5px solid rgba(120,120,130,0.3)", borderRadius:8, fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.78rem,1.3vw,0.9rem)", letterSpacing:"0.07em", padding:"clamp(0.7rem,1.5vw,0.9rem) 1.5rem", cursor:"pointer" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}