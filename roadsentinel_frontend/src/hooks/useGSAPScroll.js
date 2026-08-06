import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGSAPScroll({
  containerRef,
  stepCount,
  onStepChange,
  scrollDistancePerStep = 1,
}) {
  const onStepChangeRef = useRef(onStepChange);
  onStepChangeRef.current = onStepChange;

  const activeIndexRef = useRef(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ---- Desktop / tablet: pinned, scrubbed storytelling ----
      mm.add("(min-width: 768px)", () => {
        const trigger = ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: () => `+=${window.innerHeight * scrollDistancePerStep * stepCount}`,
          pin: true,
          pinSpacing: true, // Prevents elements from collapsing/jumping at the end
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Smooth step mapping across progress
            const rawIndex = self.progress * stepCount;
            const clampedIndex = Math.min(stepCount - 1, Math.floor(rawIndex));
            
            if (clampedIndex !== activeIndexRef.current) {
              activeIndexRef.current = clampedIndex;
              onStepChangeRef.current(clampedIndex);
            }
          },
          onLeave: () => {
            // Ensure final step remains cleanly active when exiting into the next section
            if (activeIndexRef.current !== stepCount - 1) {
              activeIndexRef.current = stepCount - 1;
              onStepChangeRef.current(stepCount - 1);
            }
          },
          onLeaveBack: () => {
            // Reset to step 0 if scrolled back up above this section
            if (activeIndexRef.current !== 0) {
              activeIndexRef.current = 0;
              onStepChangeRef.current(0);
            }
          },
        });

        return () => trigger.kill();
      });

      // ---- Mobile: unpinned ----
      mm.add("(max-width: 767px)", () => {
        onStepChangeRef.current(0);
        return () => {};
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef, stepCount, scrollDistancePerStep]);
}