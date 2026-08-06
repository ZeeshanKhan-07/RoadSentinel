// src/components/HowItWorksCard.jsx

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AlertTriangle,
  Camera,
  FileText,
  ShieldCheck,
  Receipt,
  Award,
  Plug,
  Workflow,
  Activity,
  Rocket,
  BarChart3,
  Globe,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Complete icon mapping matching all steps (RoadSentinel & Relay workflows)
const ICONS = {
  // RoadSentinel Steps
  violation: AlertTriangle,
  capture: Camera,
  report: FileText,
  verify: ShieldCheck,
  challan: Receipt,
  reward: Award,
  
  // Relay / Pipeline Steps
  connect: Plug,
  automate: Workflow,
  monitor: Activity,
  ship: Rocket,
  analyze: BarChart3,
  scale: Globe,
};

export default function HowItWorksCard({ step, isActive, variant = "pinned" }) {
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);

  // Fallback to AlertTriangle if visual key isn't matched
  const Icon = ICONS[step?.visual] ?? AlertTriangle;

  // ---- Pinned (desktop) entrance/exit ----
  useLayoutEffect(() => {
    if (variant !== "pinned") return;

    const ctx = gsap.context(() => {
      const els = [
        iconRef.current,
        eyebrowRef.current,
        headingRef.current,
        descRef.current,
      ].filter(Boolean);

      if (isActive) {
        gsap.set(cardRef.current, { display: "block", pointerEvents: "auto" });

        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo(
            els,
            { opacity: 0, y: 18, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06 }
          );
      } else {
        gsap.to(els, {
          opacity: 0,
          y: -10,
          duration: 0.25,
          ease: "power2.inOut",
          onComplete: () => {
            if (cardRef.current) gsap.set(cardRef.current, { pointerEvents: "none" });
          },
        });
      }
    }, cardRef);

    return () => ctx.revert();
  }, [isActive, variant]);

  // ---- Stacked (mobile) reveal on scroll ----
  useLayoutEffect(() => {
    if (variant !== "stacked") return;

    const ctx = gsap.context(() => {
      const els = [
        iconRef.current,
        eyebrowRef.current,
        headingRef.current,
        descRef.current,
      ].filter(Boolean);

      gsap.set(els, { opacity: 0, y: 22 });

      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(els, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
          });
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [variant]);

  return (
    <div
      ref={cardRef}
      className={
        variant === "pinned"
          ? "min-h-[70vh] md:min-h-0 flex flex-col justify-center items-center text-center md:items-start md:text-left py-10 md:py-0"
          : "flex flex-col justify-center items-center text-center md:items-start md:text-left py-12"
      }
    >
      {/* Icon: White Background with Black Icon */}
      <div
        ref={iconRef}
        className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center mb-5"
      >
        <Icon size={22} className="text-black" strokeWidth={2.2} />
      </div>

      {/* Step Number: Larger, Extra Bold */}
      <p
        ref={eyebrowRef}
        className="font-mono text-xs sm:text-sm font-display tracking-widest uppercase text-white/80 mb-3"
      >
        {step?.eyebrow ?? ""}
      </p>

      {/* Title */}
      <h3
        ref={headingRef}
        className="text-2xl sm:text-3xl md:text-[2.25rem] font-display tracking-tight text-white leading-[1.15] mb-4"
      >
        {step?.title ?? ""}
      </h3>

      {/* Description */}
      <p
        ref={descRef}
        className="text-sm font-grotesk sm:text-base md:text-lg text-white/60 leading-relaxed max-w-md"
      >
        {step?.description ?? ""}
      </p>
    </div>
  );
}