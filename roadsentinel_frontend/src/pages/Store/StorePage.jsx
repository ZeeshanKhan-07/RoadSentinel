// StorePage.jsx
// Dependencies: React, Tailwind CSS, GSAP, productService, useAuth
// Images are served from Cloudinary — full https:// URLs in the API response.

import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { getAllProducts } from "../../services/productService";
import useAuth from "../../auth/store"; // Access wallet balance store

// Resolve any image URL — Cloudinary (https://...) or legacy relative path
const getImgSrc = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `http://localhost:8080${url}`;   // fallback for old local paths
};

// ── Gender badge ──────────────────────────────────────────────
function GenderBadge({ gender }) {
  const cfg = {
    MALE:   { label: "Men",   color: "text-blue-400",    bg: "bg-blue-400/10",    border: "border-blue-400/25" },
    FEMALE: { label: "Women", color: "text-pink-300",    bg: "bg-pink-300/10",    border: "border-pink-300/25" },
    UNISEX: { label: "Unisex", color: "text-purple-400",  bg: "bg-purple-400/10",  border: "border-purple-400/25" },
  }[gender] || { label: gender || "All", color: "text-gray-400", bg: "bg-gray-400/10", border: "border-gray-400/25" };

  return (
    <span
      className={`font-sans text-[0.62rem] font-bold tracking-[0.1em] uppercase py-[0.2rem] px-[0.55rem] rounded-full border whitespace-nowrap ${cfg.bg} ${cfg.border} ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
}

// ── Placeholder when no image / load error ────────────────────
function ImgPlaceholder({ size = 36 }) {
  return (
    <div className="w-full h-full flex items-center justify-center text-gray-700">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect x="4" y="8" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="14" cy="17" r="3" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M4 28L13 20L19 26L25 21L36 30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ── Image carousel (modal) ────────────────────────────────────
function ImageCarousel({ images, name }) {
  const [idx, setIdx] = useState(0);
  const [errors, setErrors] = useState({});

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);
  const src  = getImgSrc(images[idx]);

  return (
    <div className="relative aspect-square rounded-[12px] overflow-hidden bg-[#111]">
      {src && !errors[idx] ? (
        <img
          key={idx}
          src={src}
          alt={`${name} ${idx + 1}`}
          onError={() => setErrors((p) => ({ ...p, [idx]: true }))}
          className="w-full h-full object-cover"
        />
      ) : (
        <ImgPlaceholder size={40} />
      )}

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all hover:scale-110 cursor-pointer w-[30px] h-[30px] rounded-full bg-black/60 border-none"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6L8 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all hover:scale-110 cursor-pointer w-[30px] h-[30px] rounded-full bg-black/60 border-none"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2L8 6L4 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <div
                key={i}
                onClick={() => setIdx(i)}
                className={`h-[6px] rounded-[3px] transition-all duration-200 cursor-pointer ${
                  i === idx ? "w-[16px] bg-white" : "w-[6px] bg-white/35"
                }`}
              />
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
  const [imgErr,  setImgErr]  = useState(false);
  const thumb = getImgSrc(product.images?.[0]);

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col cursor-pointer select-none rounded-[14px] overflow-hidden transition-[transform,border-color,background-color,box-shadow] duration-[220ms] border-[1.5px] bg-white/[0.025] border-[rgba(120,120,130,0.2)] hover:bg-white/[0.045] hover:border-[rgba(120,120,130,0.45)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
    >
      {/* Thumbnail */}
      <div className="aspect-square bg-[#111] overflow-hidden">
        {thumb && !imgErr ? (
          <img
            src={thumb}
            alt={product.name}
            onError={() => setImgErr(true)}
            className={`w-full h-full object-cover transition-transform duration-350 ${
              hovered ? "scale-[1.06]" : "scale-100"
            }`}
          />
        ) : (
          <ImgPlaceholder size={36} />
        )}
      </div>

      {/* Info */}
      <div className="p-[clamp(0.75rem,1.8vw,1rem)]">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-sans font-display text-[clamp(0.82rem,1.5vw,0.95rem)] text-[#f3f4f6] leading-[1.3] flex-1">
            {product.name}
          </h3>
          <GenderBadge gender={product.productGenderCategory} />
        </div>
        <p className="font-grotesk text-[clamp(0.7rem,1.2vw,0.78rem)] text-gray-500 leading-[1.5] mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-sans font-extrabold text-[clamp(1rem,2vw,1.15rem)] text-emerald-400">
            ₹{product.price?.toLocaleString("en-IN")}
          </span>
          <span
            className={`font-grotesk text-[0.7rem] ${
              product.quantity > 0 ? "text-gray-600" : "text-red-400"
            }`}
          >
            {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Product modal ─────────────────────────────────────────────
function ProductModal({ product, onClose, onBuy, walletBalance }) {
  const modalRef = useRef(null);

  const isOutOfStock = product.quantity === 0;
  const isInsufficientBalance = walletBalance < (product.price || 0);
  const isBuyDisabled = isOutOfStock || isInsufficientBalance;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.93, y: 24 },
      { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power3.out" }
    );
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 12,
      duration: 0.22,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full flex flex-col sm:flex-row gap-5 overflow-y-auto max-w-[700px] max-h-[92vh] bg-[#0f0f0f] border-[1.5px] border-[rgba(120,120,130,0.22)] rounded-[18px] p-[clamp(1.2rem,3vw,1.8rem)]"
      >
        {/* Carousel */}
        <div className="w-full sm:w-60 shrink-0">
          <ImageCarousel images={product.images || []} name={product.name} />

          {/* Thumbnail strip */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {product.images.map((img, i) => {
                const s = getImgSrc(img);
                return (
                  <div
                    key={i}
                    className="w-[40px] h-[40px] rounded-[6px] overflow-hidden border border-white/10 bg-[#111]"
                  >
                    {s && <img src={s} alt="" className="w-full h-full object-cover" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Close btn */}
          <div className="flex justify-end mb-2">
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/35 transition-all cursor-pointer bg-white/5 text-[0.85rem]"
            >
              ✕
            </button>
          </div>

          {/* Name + badge */}
          <div className="flex items-start gap-2 mb-2 flex-wrap">
            <h2 className="font-display font-extrabold text-[clamp(1rem,2.5vw,1.3rem)] text-white tracking-[-0.01em] leading-[1.3]">
              {product.name}
            </h2>
            <GenderBadge gender={product.productGenderCategory} />
          </div>

          {/* Price + stock */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="font-sans font-extrabold text-[clamp(1.3rem,3vw,1.7rem)] text-emerald-400">
              ₹{product.price?.toLocaleString("en-IN")}
            </span>
            <span
              className={`font-grotesk text-[0.75rem] font-semibold rounded-[6px] py-[0.2rem] px-[0.55rem] border ${
                product.quantity > 0
                  ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/25"
                  : "text-red-400 bg-red-400/10 border-red-400/25"
              }`}
            >
              {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="h-[1px] bg-white/[0.07] mb-[0.85rem]" />

          {/* Description */}
          <p className="font-grotesk text-[clamp(0.78rem,1.4vw,0.88rem)] text-gray-400 leading-[1.75] mb-4 flex-1">
            {product.description}
          </p>

          {product.productVehicleCategory && (
            <div className="mb-3">
              <span className="font-sans text-[0.72rem] text-gray-600 font-bold tracking-[0.08em] uppercase">
                Vehicle:{" "}
              </span>
              <span className="font-sans text-[0.82rem] text-gray-400">
                {product.productVehicleCategory}
              </span>
            </div>
          )}

          {/* Wallet insufficiency warning banner */}
          {isInsufficientBalance && !isOutOfStock && (
            <div className="mb-3 p-2.5 rounded-lg flex items-center gap-2 bg-red-400/10 border border-red-400/25">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#f87171" strokeWidth="1.5" />
                <path d="M8 5V9M8 11.5H8.01" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="font-sans text-[0.75rem] text-red-400 font-semibold">
                Insufficient wallet balance (₹{walletBalance.toLocaleString("en-IN")} available)
              </span>
            </div>
          )}

          {/* Buy Now Button */}
          <button
            onClick={() => onBuy(product)}
            disabled={isBuyDisabled}
            className={`flex items-center justify-center gap-2 font-display uppercase tracking-[0.07em] transition-all duration-200 hover:opacity-90 active:scale-95 mt-auto border-none rounded-[9px] font-sans text-[clamp(0.78rem,1.3vw,0.88rem)] py-[clamp(0.65rem,1.5vw,0.8rem)] px-8 w-full ${
              isBuyDisabled
                ? "bg-white/[0.07] text-gray-600 cursor-not-allowed"
                : "bg-white text-black cursor-pointer"
            }`}
          >
            {isOutOfStock ? (
              "Out of Stock"
            ) : isInsufficientBalance ? (
              "Insufficient Wallet Balance"
            ) : (
              <>
                Buy Now
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
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="shimmer rounded-[14px] h-[300px] border-[1.5px] border-[rgba(120,120,130,0.1)]" />
  );
}

// ── Main StorePage ────────────────────────────────────────────
export default function StorePage() {
  const navigate   = useNavigate();
  const wrapperRef = useRef(null);
  const headerRef  = useRef(null);
  const cardRefs   = useRef([]);

  // Extract totalReward and fetchBalance from Zustand store
  const { totalReward, fetchBalance } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [fetchErr, setFetchErr] = useState(null);
  const [selected, setSelected] = useState(null);

  // Fetch balance and products on page load
  useEffect(() => {
    (async () => {
      setLoading(true);
      fetchBalance(); // Refresh wallet balance
      const { data, error } = await getAllProducts();
      setProducts(data || []);
      setFetchErr(error);
      setLoading(false);
    })();
  }, [fetchBalance]);

  // GSAP entrance after data loads
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(headerRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length) {
        tl.fromTo(
          cards,
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
      className="min-h-screen w-full bg-[#05070a] font-sans pt-[60px]"
    >
      <style>{`
        @keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
        .shimmer{background:linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.07) 50%,rgba(255,255,255,0.03) 75%);background-size:600px 100%;animation:shimmer 1.5s infinite;}
      `}</style>

      {/* Body */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1200px] mx-auto">
        {/* Error state */}
        {!loading && fetchErr && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-[56px] h-[56px] rounded-full bg-red-400/[0.08] border-[1.5px] border-red-400/30 flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 7L17 17M17 7L7 17" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-red-400 text-[0.9rem] font-semibold mb-[0.3rem]">
              Failed to load products
            </p>
            <p className="text-gray-500 text-[0.8rem] mb-4">{fetchErr}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-white/[0.06] border border-white/10 rounded-[7px] text-gray-400 font-sans text-[0.78rem] font-semibold py-[0.45rem] px-[1.1rem] cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Product grid — always minimum 2 columns */}
        {!loading && !fetchErr && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

        {/* Empty state */}
        {!loading && !fetchErr && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-gray-500 text-[0.9rem]">No products available right now.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onBuy={handleBuy}
          walletBalance={totalReward || 0}
        />
      )}
    </div>
  );
}