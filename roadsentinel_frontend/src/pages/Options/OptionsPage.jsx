// OptionsPage.jsx
// Dependencies: React, Tailwind CSS, GSAP (npm install gsap)
// 4 vehicle options: Bike, Car, Auto, Commercial
// Row on desktop, column on mobile. GSAP stagger from bottom on load.

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// ── SVG Icons ─────────────────────────────────────────────────

function BikeIcon() {
  return (
    <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Rear wheel */}
      <circle cx="16" cy="34" r="12" stroke="currentColor" strokeWidth="3" fill="none"/>
      {/* Front wheel */}
      <circle cx="64" cy="34" r="12" stroke="currentColor" strokeWidth="3" fill="none"/>
      {/* Frame */}
      <line x1="16" y1="34" x2="36" y2="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="36" y1="14" x2="64" y2="34" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="36" y1="14" x2="44" y2="34" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="44" y1="34" x2="16" y2="34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Handlebar */}
      <line x1="60" y1="14" x2="68" y2="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="64" y1="14" x2="64" y2="22" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      {/* Seat */}
      <line x1="32" y1="12" x2="42" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function CarIcon() {
  return (
    <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Body */}
      <rect x="4" y="22" width="72" height="18" rx="4" stroke="currentColor" strokeWidth="3" fill="none"/>
      {/* Roof */}
      <path d="M18 22 L24 10 L56 10 L62 22" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="none"/>
      {/* Windows */}
      <path d="M26 22 L30 13 L50 13 L54 22" stroke="currentColor" strokeWidth="2" fill="none"/>
      {/* Wheels */}
      <circle cx="20" cy="40" r="6" stroke="currentColor" strokeWidth="3" fill="none"/>
      <circle cx="60" cy="40" r="6" stroke="currentColor" strokeWidth="3" fill="none"/>
      {/* Wheel hubs */}
      <circle cx="20" cy="40" r="2" fill="currentColor"/>
      <circle cx="60" cy="40" r="2" fill="currentColor"/>
      {/* Headlight */}
      <line x1="70" y1="28" x2="75" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Taillight */}
      <line x1="5" y1="28" x2="10" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function AutoIcon() {
  return (
    <svg viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Body */}
      <path d="M10 30 L10 44 Q10 48 14 48 L66 48 Q70 48 70 44 L70 30 L60 18 L20 18 Z"
        stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round"/>
      {/* Windshield */}
      <path d="M22 18 L18 30 L62 30 L58 18 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      {/* Open side (auto/rickshaw) */}
      <line x1="10" y1="30" x2="10" y2="48" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      {/* Wheels */}
      <circle cx="22" cy="48" r="7" stroke="currentColor" strokeWidth="3" fill="none"/>
      <circle cx="58" cy="48" r="7" stroke="currentColor" strokeWidth="3" fill="none"/>
      <circle cx="22" cy="48" r="2.5" fill="currentColor"/>
      <circle cx="58" cy="48" r="2.5" fill="currentColor"/>
      {/* Canopy top detail */}
      <line x1="20" y1="18" x2="60" y2="18" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      {/* Headlight */}
      <circle cx="68" cy="35" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 80 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Cargo box */}
      <rect x="4" y="10" width="44" height="30" rx="2" stroke="currentColor" strokeWidth="3" fill="none"/>
      {/* Cab */}
      <path d="M48 24 L48 40 L76 40 L76 28 L68 18 L48 18 Z"
        stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round"/>
      {/* Cab window */}
      <path d="M52 18 L52 27 L72 27 L66 18 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      {/* Wheels */}
      <circle cx="18" cy="40" r="7" stroke="currentColor" strokeWidth="3" fill="none"/>
      <circle cx="36" cy="40" r="7" stroke="currentColor" strokeWidth="3" fill="none"/>
      <circle cx="63" cy="40" r="7" stroke="currentColor" strokeWidth="3" fill="none"/>
      <circle cx="18" cy="40" r="2.5" fill="currentColor"/>
      <circle cx="36" cy="40" r="2.5" fill="currentColor"/>
      <circle cx="63" cy="40" r="2.5" fill="currentColor"/>
      {/* Headlight */}
      <circle cx="74" cy="32" r="2.5" stroke="currentColor" strokeWidth="2" fill="none"/>
      {/* Cargo lines */}
      <line x1="16" y1="10" x2="16" y2="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
      <line x1="28" y1="10" x2="28" y2="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
    </svg>
  );
}

// ── Option data ───────────────────────────────────────────────
const OPTIONS = [
  {
    id: "bike",
    label: "Bike",
    sublabel: "Two Wheelers",
    description: "Motorcycles, scooters & mopeds",
    icon: BikeIcon,
    accent: "#60a5fa",
  },
  {
    id: "car",
    label: "Car",
    sublabel: "Four Wheelers",
    description: "Sedans, SUVs & hatchbacks",
    icon: CarIcon,
    accent: "#34d399",
  },
  {
    id: "auto",
    label: "Auto",
    sublabel: "Three Wheelers",
    description: "Rickshaws & auto-taxis",
    icon: AutoIcon,
    accent: "#f59e0b",
  },
  {
    id: "commercial",
    label: "Commercial",
    sublabel: "Heavy Vehicles",
    description: "Trucks, buses & freight",
    icon: TruckIcon,
    accent: "#f87171",
  },
];

// ── Single Option Card ────────────────────────────────────────
function OptionCard({ option, isSelected, onClick, cardRef }) {
  const [hovered, setHovered] = useState(false);
  const Icon = option.icon;
  const active = isSelected || hovered;

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(option.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col items-center justify-center cursor-pointer select-none"
      style={{
        // Row on desktop: flex-1 up to 220px; column on mobile: full width capped
        flex: "1 1 0",
        minWidth: 0,
        maxWidth: "220px",
        padding: "clamp(1.6rem, 3vw, 2.2rem) clamp(1rem, 2vw, 1.6rem)",
        border: isSelected
          ? `1.5px solid ${option.accent}`
          : "1.5px solid rgba(120,120,130,0.35)",
        borderRadius: "14px",
        background: isSelected
          ? `rgba(${hexToRgb(option.accent)}, 0.07)`
          : hovered
          ? "rgba(255,255,255,0.03)"
          : "rgba(255,255,255,0.015)",
        transition: "border-color 0.25s, background 0.25s, transform 0.2s, box-shadow 0.25s",
        transform: active ? "translateY(-4px)" : "none",
        boxShadow: isSelected
          ? `0 0 28px rgba(${hexToRgb(option.accent)}, 0.15)`
          : hovered
          ? "0 8px 32px rgba(0,0,0,0.4)"
          : "none",
      }}
    >
      {/* Selected indicator dot */}
      {isSelected && (
        <div
          className="absolute top-3 right-3 w-2 h-2 rounded-full"
          style={{ background: option.accent }}
        />
      )}

      {/* Icon container */}
      <div
        className="mb-5"
        style={{
          width: "clamp(56px, 8vw, 72px)",
          height: "clamp(36px, 5vw, 46px)",
          color: isSelected ? option.accent : hovered ? "#e5e7eb" : "#9ca3af",
          transition: "color 0.25s",
        }}
      >
        <Icon />
      </div>

      {/* Label */}
      <span
        className="font-bold tracking-tight leading-none mb-1"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
          color: isSelected ? "#ffffff" : hovered ? "#f3f4f6" : "#d1d5db",
          transition: "color 0.25s",
        }}
      >
        {option.label}
      </span>

      {/* Sublabel */}
      <span
        className="font-medium mb-3"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(0.65rem, 1.1vw, 0.75rem)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: isSelected ? option.accent : "#6b7280",
          transition: "color 0.25s",
        }}
      >
        {option.sublabel}
      </span>

      {/* Description */}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(0.7rem, 1vw, 0.8rem)",
          color: "#6b7280",
          textAlign: "center",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {option.description}
      </p>
    </div>
  );
}

// ── Helper: hex → "r,g,b" for rgba() ─────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ── Main Page ─────────────────────────────────────────────────
import ComplaintForm from "../Forms/Complaintform";

export default function OptionsPage() {
  const [selected, setSelected]   = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const cardRefs    = useRef([]);
  const titleRef    = useRef(null);
  const subtitleRef = useRef(null);
  const btnRef      = useRef(null);

  // GSAP: cards fly up from bottom one by one on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Title fades down from above
      tl.fromTo(titleRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );
      tl.fromTo(subtitleRef.current,
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.3"
      );

      // Cards stagger up from bottom
      tl.fromTo(
        cardRefs.current,
        { y: 80, opacity: 0, scale: 0.94 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
        },
        "-=0.1"
      );

      // Continue button
      tl.fromTo(btnRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45 },
        "-=0.1"
      );
    });

    return () => ctx.revert();
  }, []);

  const handleSelect = (id) => {
    setSelected((prev) => (prev === id ? null : id));
  };

  // ── Show form when Continue is clicked ───────────────────────
  if (showForm) {
    return (
      <ComplaintForm
        vehicleType={selected}
        onBack={() => setShowForm(false)}
      />
    );
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-16"
      style={{
        background: "#080808",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Heading */}
      <div className="text-center mb-10">
        <h2
          ref={titleRef}
          className="font-black text-white uppercase leading-tight"
          style={{
            fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
            letterSpacing: "-0.02em",
            opacity: 0,
          }}
        >
          Select Vehicle Type
        </h2>
        <p
          ref={subtitleRef}
          className="mt-2"
          style={{
            fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
            color: "#6b7280",
            opacity: 0,
          }}
        >
          Choose the category that best describes your vehicle
        </p>
      </div>

      {/* Cards grid:
          — Desktop (md+): single row, all 4 side by side
          — Mobile (<md): 2 columns
          — Extra small (<sm): 1 column                   */}
      <div
        className="
          w-full
          flex flex-col items-center gap-4
          sm:grid sm:grid-cols-2 sm:items-stretch
          md:flex md:flex-row md:justify-center md:items-stretch
        "
        style={{ maxWidth: "960px", gap: "clamp(0.75rem, 2vw, 1.25rem)" }}
      >
        {OPTIONS.map((option, i) => (
          <OptionCard
            key={option.id}
            option={option}
            isSelected={selected === option.id}
            onClick={handleSelect}
            cardRef={(el) => (cardRefs.current[i] = el)}
          />
        ))}
      </div>

      {/* Continue button */}
      <div ref={btnRef} className="mt-10" style={{ opacity: 0 }}>
        <button
          onClick={() => selected && setShowForm(true)}
          className="flex items-center gap-2 font-bold uppercase tracking-wider transition-all duration-200 active:scale-95"
          style={{
            background: selected ? "#ffffff" : "rgba(255,255,255,0.08)",
            color: selected ? "#000000" : "#4b5563",
            border: selected ? "none" : "1.5px solid rgba(255,255,255,0.1)",
            padding: "clamp(0.55rem, 1.5vw, 0.75rem) clamp(1.4rem, 3vw, 2.2rem)",
            fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)",
            borderRadius: "8px",
            cursor: selected ? "pointer" : "not-allowed",
            transition: "background 0.3s, color 0.3s, border 0.3s",
          }}
        >
          Continue
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            style={{
              transition: "transform 0.2s",
              transform: selected ? "translateX(2px)" : "none",
            }}
          >
            <path
              d="M3 8H13M13 8L9 4M13 8L9 12"
              stroke="currentColor" strokeWidth="1.7"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Selected label */}
      {selected && (
        <p
          className="mt-4 text-sm"
          style={{ color: OPTIONS.find((o) => o.id === selected)?.accent }}
        >
          ✓ {OPTIONS.find((o) => o.id === selected)?.label} selected
        </p>
      )}
    </div>
  );
}