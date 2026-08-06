// Hero.jsx
// Dependencies: React, Tailwind CSS, GSAP (npm install gsap)
// Usage: import Hero from './Hero'

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import useAuth from "../../../auth/store";
import { useNavigate } from "react-router-dom";
import hero_background from "../../../assets/videos/hero_background.mov";

export default function Hero({ openAuth }) {
  const titleRef = useRef(null);
  const phrase1Ref = useRef(null);
  const phrase2Ref = useRef(null);
  const phrase3Ref = useRef(null);
  const divider1Ref = useRef(null);
  const divider2Ref = useRef(null);
  const btnRef = useRef(null);
  const videoRef = useRef(null);
  const blurOverlayRef = useRef(null);

  const navigate = useNavigate();
  const isLoggedIn = useAuth((state) => state.authStatus);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/raiseChallanRequestOptions");
    } else {
      openAuth("login");
    }
  };

  // ---------- Text intro timeline ----------
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        titleRef.current,
        { y: 60, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 0.85 }
      );

      tl.fromTo(
        divider1Ref.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.4, ease: "power2.inOut" },
        "-=0.1"
      );

      tl.fromTo(
        phrase1Ref.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55 },
        "+=0.5"
      );

      tl.fromTo(
        phrase2Ref.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55 },
        "+=0.5"
      );

      tl.fromTo(
        phrase3Ref.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55 },
        "+=0.5"
      );

      tl.fromTo(
        divider2Ref.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.45, ease: "power2.inOut" },
        "-=0.15"
      );

      tl.fromTo(
        btnRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "+=0.2"
      );
    });

    return () => ctx.revert();
  }, []);

  // ---------- Background video & End effect ----------
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Silently handle autoplay restrictions if blocked
      });
    }

    let blurTriggered = false;

    // Trigger blur slightly before the end, hold it, and fade to #05070a
    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 0.8 && !blurTriggered) {
        blurTriggered = true;

        const tl = gsap.timeline();

        // 1. Smoothly ramp up the blur while video finishes playing
        tl.to(blurOverlayRef.current, {
          backdropFilter: "blur(16px)",
          webkitBackdropFilter: "blur(16px)",
          backgroundColor: "rgba(5, 7, 10, 0.4)",
          duration: 0.8,
          ease: "power1.out",
        })
        // 2. Hold the full blur on the final frame
        .to({}, { duration: 1.5 })
        // 3. Fade out the video and blur layer to expose the solid bg-[#05070a]
        .to([videoRef.current, blurOverlayRef.current], {
          opacity: 0,
          duration: 1.0,
          ease: "power2.inOut",
        });
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#05070a]"
      style={{ backgroundColor: "#05070a" }}
    >
      {/* ── VIDEO BACKGROUND ── */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={hero_background}
        muted
        playsInline
        autoPlay
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
      />

      {/* ── BLUR OVERLAY (Animates near video completion) ── */}
      <div
        ref={blurOverlayRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backdropFilter: "blur(0px)",
          WebkitBackdropFilter: "blur(0px)",
        }}
      />

      {/* Subtle vignette overlay tuned to #05070a tone */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(5,7,10,0.3) 30%, rgba(5,7,10,0.85) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center w-full px-4 sm:px-6 select-none">
        {/* ── TITLE ── */}
        <h1
          ref={titleRef}
          className="font-display text-white leading-none mx-auto"
          style={{
            fontFamily: "'Inter', 'Arial Black', sans-serif",
            fontSize: "clamp(2.2rem, 6.5vw, 5.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            opacity: 0,
            maxWidth: "860px",
          }}
        >
          RoadSentinel
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

        {/* ── TAGLINE PHRASES ── */}
        <div
          className="flex items-baseline justify-center bg-white/10 backdrop-blur-md rounded-lg py-2 px-6 mx-auto max-w-fit flex-wrap"
          style={{
            fontFamily: "'Inter', sans-serif",
            gap: "clamp(0.5rem, 2vw, 1.4rem)",
          }}
        >
          <span
            ref={phrase1Ref}
            className="text-white font-display"
            style={{
              fontSize: "clamp(1rem, 2.8vw, 2.2rem)",
              letterSpacing: "-0.02em",
              opacity: 0,
            }}
          >
            See It.
          </span>

          <span
            ref={phrase2Ref}
            className="text-white font-display"
            style={{
              fontSize: "clamp(1rem, 2.8vw, 2.2rem)",
              letterSpacing: "-0.02em",
              opacity: 0,
            }}
          >
            Report It.
          </span>

          <span
            ref={phrase3Ref}
            className="font-black font-bold italic uppercase"
            style={{
              fontSize: "clamp(1rem, 2.8vw, 2.2rem)",
              letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.4)",
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
            className="group flex items-center gap-2 font-display bg-white text-black px-7 py-2.5 hover:px-8 hover:py-3.5 text-sm tracking-[0.07em] rounded cursor-pointer border-0 transition-all duration-200 hover:opacity-90 active:scale-95"
          >
            Get Started
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