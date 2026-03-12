// Hero.jsx
// Dependencies: React, Tailwind CSS, GSAP (npm install gsap)
// Usage: import Hero from './Hero'

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import useAuth from "../../auth/store";
import { useNavigate } from "react-router-dom";

export default function Hero({openAuth}) {
  const titleRef    = useRef(null);
  const phrase1Ref  = useRef(null);
  const phrase2Ref  = useRef(null);
  const phrase3Ref  = useRef(null);
  const divider1Ref = useRef(null);
  const divider2Ref = useRef(null);
  const btnRef      = useRef(null);
  const navigate = useNavigate();

  const isLoggedIn = useAuth((state) => state.authStatus);

  const handleGetStarted = () => {
  if (isLoggedIn) {
    navigate("/raiseChallanRequestOptions");
  } else {
    openAuth("login");
  }
};

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Title - bold slam from below
      tl.fromTo(
        titleRef.current,
        { y: 60, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 0.85 }
      );

      // Divider 1 - expand from center
      tl.fromTo(
        divider1Ref.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.4, ease: "power2.inOut" },
        "-=0.1"
      );

      // "See It." — 0.5s after title
      tl.fromTo(
        phrase1Ref.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55 },
        "+=0.5"
      );

      // "Report It." — 0.5s after See It.
      tl.fromTo(
        phrase2Ref.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55 },
        "+=0.5"
      );

      // "Make Roads Safer." — 0.5s after Report It.
      tl.fromTo(
        phrase3Ref.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55 },
        "+=0.5"
      );

      // Divider 2
      tl.fromTo(
        divider2Ref.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.45, ease: "power2.inOut" },
        "-=0.15"
      );

      // Get Started button — fade + rise
      tl.fromTo(
        btnRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "+=0.2"
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Subtle vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center w-full px-4 sm:px-6 select-none">

        {/* ── TITLE (reduced size) ── */}
        <h1
          ref={titleRef}
          className="font-black text-white uppercase leading-none mx-auto"
          style={{
            fontFamily: "'Inter', 'Arial Black', sans-serif",
            fontSize: "clamp(2.2rem, 6.5vw, 5.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            opacity: 0,
            maxWidth: "860px",
          }}
        >
          ROADSENTINEL
        </h1>

        {/* ── DIVIDER 1 ── */}
        <div
          ref={divider1Ref}
          className="mx-auto my-5"
          style={{
            height: "1px",
            width: "min(100%, 560px)",
            background: "rgba(255,255,255,0.12)",
            transformOrigin: "center",
            opacity: 0,
          }}
        />

        {/* ── TAGLINE PHRASES — single responsive row ── */}
        <div
          className="flex items-baseline justify-center flex-wrap"
          style={{
            fontFamily: "'Inter', sans-serif",
            gap: "clamp(0.5rem, 2vw, 1.4rem)",
          }}
        >
          {/* See It. */}
          <span
            ref={phrase1Ref}
            className="text-white font-bold uppercase"
            style={{
              fontSize: "clamp(1rem, 2.8vw, 2.2rem)",
              letterSpacing: "-0.02em",
              opacity: 0,
            }}
          >
            See It.
          </span>

          {/* Report It. */}
          <span
            ref={phrase2Ref}
            className="text-white font-bold uppercase"
            style={{
              fontSize: "clamp(1rem, 2.8vw, 2.2rem)",
              letterSpacing: "-0.02em",
              opacity: 0,
            }}
          >
            Report It.
          </span>

          {/* Make Roads Safer. — ghosted italic like "DARK SIDE" */}
          <span
            ref={phrase3Ref}
            className="font-black italic uppercase"
            style={{
              fontSize: "clamp(1rem, 2.8vw, 2.2rem)",
              letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.28)",
              opacity: 0,
            }}
          >
            Make Roads Safer.
          </span>
        </div>

        {/* ── DIVIDER 2 ── */}
        <div
          ref={divider2Ref}
          className="mx-auto mt-5"
          style={{
            height: "1px",
            width: "min(100%, 560px)",
            background: "rgba(255,255,255,0.12)",
            transformOrigin: "center",
            opacity: 0,
          }}
        />

        {/* ── GET STARTED BUTTON ── */}
        <div ref={btnRef} className="mt-7 flex justify-center" style={{ opacity: 0 }}>
          <button
            onClick={handleGetStarted}
            className="group flex items-center gap-2 font-bold tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              fontFamily: "'Inter', sans-serif",
              background: "#ffffff",
              color: "#000000",
              padding: "clamp(0.5rem, 1.4vw, 0.75rem) clamp(1.1rem, 2.8vw, 1.8rem)",
              fontSize: "clamp(0.7rem, 1.3vw, 0.9rem)",
              letterSpacing: "0.07em",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Get Started
            {/* Arrow */}
            <svg
              className="transition-transform duration-200 group-hover:translate-x-1"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 7.5H12.5M12.5 7.5L8.5 3.5M12.5 7.5L8.5 11.5"
                stroke="#000000"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}