// components/ReviewSection.jsx

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import reviews from "../../../data/reviews";
import ReviewCard from "./ReviewCard";
import useReviewScrollAnimation from "../../../hooks/useReviewScrollAnimation";

gsap.registerPlugin(ScrollTrigger);

const Star = ({ref}) => (
  <svg
    ref={ref}
    viewBox="0 0 24 24"
    className="h-4 w-4 shrink-0 drop-shadow-[0_0_6px_rgba(255,215,90,0.8)]"
  >
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF8C7" />
        <stop offset="25%" stopColor="#FFE27A" />
        <stop offset="55%" stopColor="#FFD54A" />
        <stop offset="100%" stopColor="#D49A00" />
      </linearGradient>

      <filter id="goldGlow">
        <feGaussianBlur stdDeviation="0.8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <path
      d="M12 1.5l3.1 6.8 7.4.8-5.5 5 1.5 7.3L12 18.2 5.5 21.4 7 14.1 1.5 9.1l7.4-.8L12 1.5z"
      fill="url(#goldGradient)"
      filter="url(#goldGlow)"
      stroke="#FFF5C3"
      strokeWidth="0.5"
    />
  </svg>
);

export default function ReviewSection() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const watermarkRef = useRef(null);
  const cardRefs = useRef([]);
  const floatRefs = useRef([]);
  const dotRefs = useRef([]);

  // Animated header refs
  const starRefs = useRef([]);
  const word1Ref = useRef(null);
  const word2Ref = useRef(null);
  const word3Ref = useRef(null);

  cardRefs.current = [];
  floatRefs.current = [];
  dotRefs.current = [];
  starRefs.current = [];

  // Pinned desktop scroll logic hook
  useReviewScrollAnimation({
    sectionRef,
    stageRef,
    watermarkRef,
    cardRefs,
    floatRefs,
    dotRefs,
    count: reviews.length,
  });

  // Header Scroll Animation (Desktop & Mobile safe)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const stars = starRefs.current.filter(Boolean);
      const words = [word1Ref.current, word2Ref.current, word3Ref.current].filter(Boolean);

      gsap.set(stars, { scale: 0, opacity: 0 });
      gsap.set(words, { y: 25, opacity: 0, filter: "blur(4px)" });

      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "top 40%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Pop stars
      headerTl.to(stars, {
        scale: 1,
        opacity: 1,
        stagger: 0.08,
        ease: "back.out(2)",
        duration: 0.6,
      });

      // Reveal header words
      headerTl.to(
        words,
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.12,
          ease: "power3.out",
          duration: 0.8,
        },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="reviews"
      ref={sectionRef}
      aria-label="Client testimonials"
      className="relative bg-[#05070a] overflow-hidden pt-16 pb-12 sm:pt-20 md:py-0"
    >
      {/* ---------------------------------------------------------- */}
      {/* Header Container                                           */}
      {/* ---------------------------------------------------------- */}
      <div className="relative z-10 text-center px-4 mb-8 md:mb-4 pt-4 md:pt-12">
        <div
          className="mb-3 flex items-center justify-center gap-1 sm:gap-1.5"
          aria-hidden="true"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} ref={(el) => (starRefs.current[i] = el)} />
          ))}
        </div>

        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-white/90 flex items-center justify-center gap-2 sm:gap-4 overflow-hidden py-1">
          <span ref={word1Ref} className="inline-block">
            What
          </span>
          <span ref={word2Ref} className="inline-block">
            People
          </span>
          <span ref={word3Ref} className="inline-block">
            Say?
          </span>
        </h2>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Review Cards Stage                                         */}
      {/* ---------------------------------------------------------- */}
      <div
        ref={stageRef}
        className="relative z-0 flex flex-col gap-6 px-4 pb-16 sm:px-6 md:h-[85vh] md:gap-0 md:overflow-hidden md:px-0 md:pb-0"
      >
        {reviews.map((review, i) => (
          <ReviewCard
            key={review.id}
            review={review}
            side={i % 2 === 0 ? "left" : "right"}
            ref={(el) => (cardRefs.current[i] = el)}
            floatRef={(el) => (floatRefs.current[i] = el)}
          />
        ))}
      </div>
    </section>
  );
}