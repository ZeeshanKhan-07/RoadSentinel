import { useEffect, useRef } from "react";
import gsap from "gsap";
import { visualsByKey } from "./visuals";

export default function ImageStack({ steps, activeIndex }) {
  const slideRefs = useRef([]);
  const prevIndexRef = useRef(activeIndex);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const prevIndex = prevIndexRef.current;
    if (prevIndex === activeIndex) return;

    const direction = activeIndex > prevIndex ? 1 : -1;
    const incoming = slideRefs.current[activeIndex];
    const outgoing = slideRefs.current[prevIndex];

    if (prefersReducedMotion.current) {
      gsap.set(outgoing, { autoAlpha: 0 });
      gsap.set(incoming, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", y: 0, scale: 1 });
      prevIndexRef.current = activeIndex;
      return;
    }

    const tl = gsap.timeline({
      defaults: { duration: 0.9, ease: "power3.out" },
      onComplete: () => {
        prevIndexRef.current = activeIndex;
      },
    });

    // Outgoing slide animation
    tl.to(
      outgoing,
      {
        autoAlpha: 0,
        scale: 0.96,
        y: direction * -24,
        filter: "blur(6px)",
        duration: 0.6,
        ease: "power2.inOut",
      },
      0
    );

    // Incoming slide animation
    gsap.set(incoming, {
      autoAlpha: 1,
      y: direction * 32,
      scale: 1.02,
      filter: "blur(4px)",
      clipPath:
        direction === 1
          ? "inset(100% 0% 0% 0%)"
          : "inset(0% 0% 100% 0%)",
    });
    tl.to(
      incoming,
      {
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.9,
        ease: "power3.out",
      },
      0.15
    );
  }, [activeIndex]);

  return (
    <div
      className="relative w-full aspect-[4/3] max-w-[560px] rounded-3xl overflow-hidden
                 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]
                 ring-1 ring-white/[0.08]"
    >
      {steps.map((step, i) => {
        const Visual = visualsByKey[step.visual];
        const isActive = i === activeIndex;
        return (
          <div
            key={step.id}
            ref={(el) => (slideRefs.current[i] = el)}
            className="absolute inset-0" // Removed p-3 so the 4:3 PNG fills the box completely
            style={{
              visibility: isActive ? "visible" : "hidden",
              opacity: isActive ? 1 : 0,
            }}
            aria-hidden={!isActive}
          >
            <Visual />
          </div>
        );
      })}
    </div>
  );
}