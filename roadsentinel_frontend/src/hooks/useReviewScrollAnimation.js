// hooks/useReviewScrollAnimation.js
//
// All scroll-driven behaviour for the testimonial stage lives here, kept out
// of the component so ReviewSection.jsx stays declarative.
//
// Desktop (>= 768px):
//   - The stage is pinned. One continuous scrubbed timeline reveals cards
//     one at a time; each new entrance nudges the previous 1-2 cards into a
//     dimmed "background" state rather than yanking them away instantly.
//   - Every card also runs an independent, very slow float loop on an inner
//     node, so the section never feels static even mid-scroll.
//
// Mobile (< 768px):
//   - Pinning is disabled entirely (gsap.matchMedia). Cards sit in normal
//     document flow and each does a simple, cheap fade/slide reveal.
//
// Cleanup: everything is created inside gsap.context() scoped to the
// section root, so a single ctx.revert() on unmount (or React Strict Mode's
// mount->unmount->mount) tears down every tween and ScrollTrigger cleanly.

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PX_PER_CARD = 900; // scroll distance "spent" revealing each card

export default function useReviewScrollAnimation({
  sectionRef,
  stageRef,
  watermarkRef,
  cardRefs,
  floatRefs,
  dotRefs,
  count,
}) {
  const activeIndexRef = useRef(-1);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // Ambient float loop — desktop only, skipped for reduced motion.
      // Runs independently of the scroll timeline on a separate DOM node
      // (data-float-card) so it never fights the scroll-driven transform.
      const startFloat = () => {
        if (reduceMotion) return [];
        return floatRefs.current.filter(Boolean).map((el) =>
          gsap.to(el, {
            y: gsap.utils.random(-10, -16),
            rotate: gsap.utils.random(-1.4, 1.4),
            duration: gsap.utils.random(4.5, 6.5),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: gsap.utils.random(0, 1.2),
          })
        );
      };

      const mm = gsap.matchMedia();

      // ---------------------------------------------------------------
      // DESKTOP / TABLET: pinned, one-review-per-scroll storytelling
      // ---------------------------------------------------------------
      mm.add("(min-width: 768px)", () => {
        const floatTweens = startFloat();

        const cards = cardRefs.current;
        const total = count;

        // Initial state for every card: hidden, blurred, offset, subtly
        // rotated toward its side so the entrance reads as "arriving".
        cards.forEach((card, i) => {
          if (!card) return;
          const side = i % 2 === 0 ? -1 : 1;
          gsap.set(card, {
            opacity: 0,
            scale: 0.92,
            y: 120,
            x: side * 24,
            rotate: side * 3,
            filter: "blur(12px)",
          });
        });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out", duration: 1 },
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top top",
            end: `+=${PX_PER_CARD * (total + 1)}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers: false,
            onUpdate: (self) => {
              const idx = Math.min(
                total - 1,
                Math.floor(self.progress * (total + 0.001))
              );
              if (idx !== activeIndexRef.current) {
                activeIndexRef.current = idx;
                const dots = dotRefs.current;
                dots.forEach((dot, i) => {
                  if (!dot) return;
                  dot.style.backgroundColor =
                    i === idx ? "#c6a567" : "rgba(255,255,255,0.15)";
                  dot.style.transform = i === idx ? "scale(1.4)" : "scale(1)";
                });
              }
              // gentle parallax on the watermark, tied directly to progress
              if (watermarkRef.current) {
                gsap.set(watermarkRef.current, {
                  opacity: 0.05 + self.progress * 0.05,
                  scale: 1 + self.progress * 0.05,
                });
              }
            },
          },
        });

        cards.forEach((card, i) => {
          if (!card) return;

          // Entrance of card i
          tl.to(
            card,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              x: 0,
              rotate: (i % 2 === 0 ? -1 : 1) * 0.6,
              filter: "blur(0px)",
            },
            i
          );

          // Previous card recedes into the background instead of vanishing
          const prev = cards[i - 1];
          if (prev) {
            tl.to(
              prev,
              { y: -46, scale: 0.94, opacity: 0.32, filter: "blur(2px)" },
              i
            );
          }

          // Two-back card fully retires
          const prev2 = cards[i - 2];
          if (prev2) {
            tl.to(
              prev2,
              { y: -96, scale: 0.85, opacity: 0, filter: "blur(6px)" },
              i
            );
          }
        });

        return () => {
          floatTweens.forEach((t) => t.kill());
        };
      });

      // ---------------------------------------------------------------
      // MOBILE: no pinning, simple per-card fade/slide in normal flow
      // ---------------------------------------------------------------
      mm.add("(max-width: 767px)", () => {
        const cards = cardRefs.current;

        cards.forEach((card) => {
          if (!card) return;
          gsap.fromTo(
            card,
            { opacity: 0, y: 40, filter: "blur(6px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      });
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);
}
