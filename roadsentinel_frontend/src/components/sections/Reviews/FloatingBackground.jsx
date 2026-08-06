// components/FloatingBackground.jsx
//
// Purely decorative, purely CSS. Two soft radial glows drift very slowly —
// no GSAP needed here, which keeps the scroll-critical animation budget
// (see useReviewScrollAnimation) free of unrelated work.

export default function FloatingBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* base wash */}
      <div className="absolute inset-0 bg-[#05070a]" />

      {/* noise texture */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* slow-drifting glows */}
      <div className="drift-a absolute -top-1/4 -left-1/4 h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(56,80,110,0.18)_0%,rgba(56,80,110,0)_70%)] blur-3xl" />
      <div className="drift-b absolute -bottom-1/3 -right-1/4 h-[55vw] w-[55vw] rounded-full bg-[radial-gradient(circle,rgba(120,96,58,0.12)_0%,rgba(120,96,58,0)_70%)] blur-3xl" />
      <div className="drift-c absolute top-1/3 left-1/2 h-[40vw] w-[40vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_70%)] blur-3xl" />

      {/* vignette so edges stay dark and cards feel embedded */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.55)_100%)]" />

      <style>{`
        @keyframes drift-a { 0%,100% { transform: translate(0,0) } 50% { transform: translate(4%, 6%) } }
        @keyframes drift-b { 0%,100% { transform: translate(0,0) } 50% { transform: translate(-5%, -4%) } }
        @keyframes drift-c { 0%,100% { transform: translate(-50%,0) } 50% { transform: translate(-46%, 3%) } }
        .drift-a { animation: drift-a 22s ease-in-out infinite; }
        .drift-b { animation: drift-b 26s ease-in-out infinite; }
        .drift-c { animation: drift-c 30s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .drift-a, .drift-b, .drift-c { animation: none; }
        }
      `}</style>
    </div>
  );
}
