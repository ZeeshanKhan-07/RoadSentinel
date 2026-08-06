// src/components/HowItWorks.jsx

import { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAPScroll } from "../../../hooks/useGSAPScroll";
import HowItWorksCard from "./HowItWorksCard";
import ImageStack from "./ImageStack";
import { visualsByKey } from "./visuals";
import { steps } from "../../../data/steps";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const containerRef = useRef(null);
  const leftColumnRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Pinning & step progression management
  useGSAPScroll({
    containerRef,
    stepCount: steps.length,
    onStepChange: setActiveIndex,
  });

  // Entrance & exit scrub animation linked directly to scroll
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Timeline linked directly to scroll progress into the section
        const entranceTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",     // Starts animating when section enters view
            end: "top top",       // Fully settled right as section reaches top/pins
            scrub: 1,             // Scrub handles reverse movement when scrolling back up
            invalidateOnRefresh: true,
          },
        });

        // 1. Initial off-screen states
        gsap.set(leftColumnRef.current, { x: "-120%", opacity: 0, scale: 0.95 });
        gsap.set(imageWrapperRef.current, { x: "120%", opacity: 0, scale: 0.95 });

        // 2. Animate into position with pop up & down overshoot
        entranceTl
          // Text box: Left -> Right with pop-up effect
          .to(
            leftColumnRef.current,
            {
              x: "0%",
              opacity: 1,
              ease: "back.out(1.4)", // 'back.out' creates the subtle pop/overshoot & down effect
              duration: 1,
            },
            0
          )
          // Image box: Right -> Left with pop-up effect
          .to(
            imageWrapperRef.current,
            {
              x: "0%",
              opacity: 1,
              ease: "back.out(1.4)",
              duration: 1,
            },
            0
          );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-to-use"
      ref={containerRef}
      aria-label="How it works"
      className="relative bg-[#05070a] [--accent:#3DFFB0] overflow-hidden"
    >
      {/* ============ DESKTOP / TABLET: pinned split-screen ============ */}
      <div className="hidden md:grid grid-cols-2 gap-16 max-w-6xl mx-auto px-8 h-screen items-center">
        {/* Left Column (Text) */}
        <div ref={leftColumnRef} className="grid">
          {steps.map((step, i) => (
            <div key={step?.id || i} style={{ gridArea: "1 / 1" }} aria-hidden={i !== activeIndex}>
              <HowItWorksCard step={step} isActive={i === activeIndex} variant="pinned" />
            </div>
          ))}
        </div>

        {/* Right Column (Image Stack) */}
        <div ref={imageWrapperRef} className="h-full flex items-center justify-center">
          <ImageStack steps={steps} activeIndex={activeIndex} />
        </div>
      </div>

      {/* ============ MOBILE: stacked layout ============ */}
      <div className="md:hidden max-w-lg mx-auto px-6">
        {steps.map((step, i) => {
          const Visual =
            visualsByKey[step?.visual] || (() => <div className="w-full h-full bg-[#0E1210]" />);

          return (
            <div key={step?.id || i} className="border-b border-white/[0.06] last:border-none">
              <HowItWorksCard step={step} isActive variant="stacked" />
              <div className="pb-14">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-white/[0.06]">
                  <div className="absolute inset-0">
                    <Visual />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}