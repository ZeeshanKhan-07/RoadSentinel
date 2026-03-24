// StorePage.jsx
// Shows all products in a grid. Click → modal with details + Buy Now.
// Dependencies: React, Tailwind CSS, GSAP, productService

import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { getAllProducts } from "../../services/ProductService"

// Images are stored in the frontend project root under /uploads/productImages/
// Vite serves everything in the project root as static files at localhost:5173
// So /uploads/productImages/filename.jpg → http://localhost:5173/uploads/productImages/filename.jpg
const BASE_URL = "";

// ── Gender badge ──────────────────────────────────────────────
function GenderBadge({ gender }) {
  const cfg = {
    MALE:   { label: "Men",   color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.25)"  },
    FEMALE: { label: "Women", color: "#f9a8d4", bg: "rgba(249,168,212,0.1)", border: "rgba(249,168,212,0.25)" },
    UNISEX: { label: "Unisex",color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)" },
  }[gender] || { label: gender || "All", color: "#9ca3af", bg: "rgba(156,163,175,0.1)", border: "rgba(156,163,175,0.25)" };

  return (
    <span style={{
      fontFamily: "'Inter',sans-serif", fontSize: "0.62rem", fontWeight: 700,
      letterSpacing: "0.1em", textTransform: "uppercase",
      padding: "0.2rem 0.55rem", borderRadius: 20,
      background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
      whiteSpace: "nowrap",
    }}>
      {cfg.label}
    </span>
  );
}

// ── Image carousel (in modal) ─────────────────────────────────
function ImageCarousel({ images, name }) {
  const [idx, setIdx] = useState(0);
  const [err, setErr] = useState({});

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  const src = images[idx]
    ? (images[idx].startsWith("http") ? images[idx] : `${BASE_URL}${images[idx]}`)
    : null;

  return (
    <div className="relative" style={{ aspectRatio: "1", borderRadius: 12, overflow: "hidden", background: "#111" }}>
      {src && !err[idx] ? (
        <img
          key={idx}
          src={src}
          alt={`${name} ${idx + 1}`}
          onError={() => setErr((p) => ({ ...p, [idx]: true }))}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.2s" }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{ color: "#374151" }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="4" y="8" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="14" cy="17" r="3" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M4 28L13 20L19 26L25 21L36 30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            style={{ width:30, height:30, borderRadius:"50%", background:"rgba(0,0,0,0.55)", border:"none", color:"#fff" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6L8 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            style={{ width:30, height:30, borderRadius:"50%", background:"rgba(0,0,0,0.55)", border:"none", color:"#fff" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2L8 6L4 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <div key={i} onClick={() => setIdx(i)} style={{
                width: i === idx ? 16 : 6, height: 6, borderRadius: 3,
                background: i === idx ? "#fff" : "rgba(255,255,255,0.4)",
                transition: "all 0.2s", cursor: "pointer",
              }}/>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Product card ──────────────────────────────────────────────
function ProductCard({ product, onClick, cardRef }) {
  const [hovered, setHovered] = useState(false);
  const [imgErr, setImgErr]   = useState(false);
  const thumb = product.images?.[0]
    ? (product.images[0].startsWith("http") ? product.images[0] : `${BASE_URL}${product.images[0]}`)
    : null;

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col cursor-pointer select-none"
      style={{
        background: hovered ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.025)",
        border: hovered ? "1.5px solid rgba(120,120,130,0.45)" : "1.5px solid rgba(120,120,130,0.2)",
        borderRadius: 14,
        overflow: "hidden",
        transition: "transform 0.2s, border-color 0.2s, background 0.2s, box-shadow 0.2s",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.45)" : "none",
      }}
    >
      {/* Thumbnail */}
      <div style={{ aspectRatio: "1", background: "#111", overflow: "hidden" }}>
        {thumb && !imgErr ? (
          <img src={thumb} alt={product.name} onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover",
              transition: "transform 0.35s", transform: hovered ? "scale(1.05)" : "scale(1)" }}/>
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ color: "#374151" }}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <rect x="4" y="8" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="14" cy="17" r="3" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M4 28L13 20L19 26L25 21L36 30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "clamp(0.75rem,1.8vw,1rem)" }}>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 style={{ fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:"clamp(0.82rem,1.5vw,0.95rem)", color:"#f3f4f6", lineHeight:1.3, flex:1 }}>
            {product.name}
          </h3>
          <GenderBadge gender={product.productGenderCategory} />
        </div>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.7rem,1.2vw,0.78rem)", color:"#6b7280", lineHeight:1.5, marginBottom:"0.75rem",
          display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span style={{ fontFamily:"'Inter',sans-serif", fontWeight:800, fontSize:"clamp(1rem,2vw,1.15rem)", color:"#34d399" }}>
            ₹{product.price?.toLocaleString("en-IN")}
          </span>
          <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.7rem", color:"#4b5563" }}>
            {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Product modal ─────────────────────────────────────────────
function ProductModal({ product, onClose, onBuy }) {
  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    gsap.fromTo(modalRef.current,
      { opacity: 0, scale: 0.94, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power3.out" }
    );
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  const handleClose = () => {
    gsap.to(modalRef.current, { opacity: 0, scale: 0.95, y: 10, duration: 0.22, ease: "power2.in", onComplete: onClose });
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full flex flex-col sm:flex-row gap-5 overflow-y-auto"
        style={{
          maxWidth: 680, maxHeight: "90vh",
          background: "#0f0f0f",
          border: "1.5px solid rgba(120,120,130,0.25)",
          borderRadius: 18,
          padding: "clamp(1.2rem,3vw,1.8rem)",
        }}
      >
        {/* Left: image carousel */}
        <div className="w-full sm:w-56 shrink-0">
          <ImageCarousel images={product.images || []} name={product.name} />
        </div>

        {/* Right: details */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Close */}
          <div className="flex justify-end mb-2">
            <button onClick={handleClose}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/35 transition-all cursor-pointer"
              style={{ background: "rgba(255,255,255,0.05)", fontSize: "0.85rem" }}>✕</button>
          </div>

          {/* Name + badge */}
          <div className="flex items-start gap-2 mb-2 flex-wrap">
            <h2 style={{ fontFamily:"'Inter',sans-serif", fontWeight:800, fontSize:"clamp(1rem,2.5vw,1.3rem)", color:"#fff", letterSpacing:"-0.01em", lineHeight:1.3 }}>
              {product.name}
            </h2>
            <GenderBadge gender={product.productGenderCategory} />
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-3">
            <span style={{ fontFamily:"'Inter',sans-serif", fontWeight:800, fontSize:"clamp(1.3rem,3vw,1.7rem)", color:"#34d399" }}>
              ₹{product.price?.toLocaleString("en-IN")}
            </span>
            <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.75rem", color: product.quantity > 0 ? "#34d399" : "#f87171",
              background: product.quantity > 0 ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
              border: `1px solid ${product.quantity > 0 ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.25)"}`,
              borderRadius: 6, padding: "0.2rem 0.55rem", fontWeight: 600 }}>
              {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Divider */}
          <div style={{ height:1, background:"rgba(255,255,255,0.07)", marginBottom:"0.85rem" }}/>

          {/* Description */}
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.78rem,1.4vw,0.88rem)", color:"#9ca3af", lineHeight:1.7, marginBottom:"1rem", flex:1 }}>
            {product.description}
          </p>

          {/* Meta */}
          {product.productVehicleCategory && (
            <div className="mb-3">
              <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.72rem", color:"#4b5563", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>
                Vehicle Type
              </span>
              <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.82rem", color:"#9ca3af", marginLeft:"0.5rem" }}>
                {product.productVehicleCategory}
              </span>
            </div>
          )}

          {/* Buy Now */}
          <button
            onClick={() => onBuy(product)}
            disabled={product.quantity === 0}
            className="flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90 active:scale-95 mt-auto"
            style={{
              background: product.quantity === 0 ? "rgba(255,255,255,0.08)" : "#fff",
              color: product.quantity === 0 ? "#4b5563" : "#000",
              border: "none", borderRadius: 8,
              fontFamily: "'Inter',sans-serif",
              fontSize: "clamp(0.78rem,1.3vw,0.88rem)",
              letterSpacing: "0.07em",
              padding: "clamp(0.65rem,1.5vw,0.8rem) 2rem",
              cursor: product.quantity === 0 ? "not-allowed" : "pointer",
              width: "100%",
            }}
          >
            {product.quantity === 0 ? "Out of Stock" : (
              <>
                Buy Now
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton card ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="shimmer" style={{ borderRadius:14, height:280, border:"1.5px solid rgba(120,120,130,0.12)" }}/>
  );
}

// ── Main StorePage ────────────────────────────────────────────
export default function StorePage() {
  const navigate   = useNavigate();
  const wrapperRef = useRef(null);
  const headerRef  = useRef(null);
  const cardRefs   = useRef([]);

  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [fetchErr,  setFetchErr]  = useState(null);
  const [selected,  setSelected]  = useState(null); // product for modal

  // ── Fetch ───────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await getAllProducts();
      setProducts(data);
      setFetchErr(error);
      setLoading(false);
    })();
  }, []);

  // ── GSAP on load ────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(headerRef.current, { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
      if (cardRefs.current.filter(Boolean).length) {
        tl.fromTo(
          cardRefs.current.filter(Boolean),
          { y: 50, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 },
          "-=0.2"
        );
      }
    }, wrapperRef);
    return () => ctx.revert();
  }, [loading]);

  const handleBuy = useCallback((product) => {
    setSelected(null);
    navigate("/order", { state: { product } });
  }, [navigate]);

  return (
    <div
      ref={wrapperRef}
      className="min-h-screen w-full"
      style={{ background: "#080808", fontFamily: "'Inter',sans-serif" }}
    >
      <style>{`
        @keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
        .shimmer{background:linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.07) 50%,rgba(255,255,255,0.03) 75%);background-size:600px 100%;animation:shimmer 1.5s infinite;}
      `}</style>

      {/* ── Header ── */}
      <div
        ref={headerRef}
        className="w-full sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8"
        style={{ background: "rgba(8,8,8,0.95)", backdropFilter: "blur(14px)", height: "clamp(52px,8vw,62px)", opacity: 0 }}
      >
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
          style={{ color:"#9ca3af", fontFamily:"'Inter',sans-serif", fontSize:"0.85rem", fontWeight:500, background:"none", border:"none" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        <h1 style={{ color:"#fff", fontWeight:800, fontSize:"clamp(0.9rem,2vw,1.15rem)", letterSpacing:"-0.01em", position:"absolute", left:"50%", transform:"translateX(-50%)" }}>
          Store
        </h1>

        <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.72rem", fontWeight:700, color:"#6b7280",
          background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"0.22rem 0.65rem" }}>
          {loading ? "…" : `${products.length} items`}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6" style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Section heading */}
        <div className="mb-6">
          <h2 style={{ fontFamily:"'Inter',sans-serif", fontWeight:800, fontSize:"clamp(1.2rem,3vw,1.8rem)", color:"#fff", letterSpacing:"-0.02em", marginBottom:"0.25rem" }}>
            Safety Gear
          </h2>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.78rem,1.4vw,0.9rem)", color:"#6b7280" }}>
            Browse certified road safety products for every rider
          </p>
        </div>

        {/* Error */}
        {!loading && fetchErr && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(248,113,113,0.08)", border:"1.5px solid rgba(248,113,113,0.3)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1rem" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 7L17 17M17 7L7 17" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p style={{ color:"#f87171", fontSize:"0.9rem", fontWeight:600, marginBottom:"0.3rem" }}>Failed to load products</p>
            <p style={{ color:"#6b7280", fontSize:"0.8rem", marginBottom:"1rem" }}>{fetchErr}</p>
            <button onClick={() => window.location.reload()}
              style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:7, color:"#9ca3af", fontFamily:"'Inter',sans-serif", fontSize:"0.78rem", fontWeight:600, padding:"0.45rem 1.1rem", cursor:"pointer" }}>
              Retry
            </button>
          </div>
        )}

        {/* Skeleton grid */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i}/>)}
          </div>
        )}

        {/* Products grid — min 2 columns always */}
        {!loading && !fetchErr && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={setSelected}
                cardRef={(el) => (cardRefs.current[i] = el)}
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !fetchErr && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p style={{ color:"#6b7280", fontSize:"0.9rem" }}>No products available right now.</p>
          </div>
        )}
      </div>

      {/* ── Product Modal ── */}
      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onBuy={handleBuy}
        />
      )}
    </div>
  );
}