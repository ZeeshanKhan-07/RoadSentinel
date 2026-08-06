// components/ReviewCard.jsx

import { forwardRef } from "react";

const Star = () => (
  <svg
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

const ReviewCard = forwardRef(function ReviewCard(
  { review, side, floatRef },
  ref
) {
  const isRight = side === "right";

  return (
    <div
      ref={ref}
      data-scroll-card
      className={[
        // Mobile (< md): Normal block flow, clean auto margins, full width relative to padding
        "relative mx-auto w-full max-w-sm sm:max-w-md",
        // Desktop (md+): Absolute positioning on the pinned stage grid
        "md:absolute md:left-1/2 md:top-1/2 md:w-[min(38vw,460px)] md:-translate-x-1/2 md:-translate-y-1/2 md:mx-0",
        isRight ? "md:ml-[16vw]" : "md:-ml-[16vw]",
      ].join(" ")}
      style={{ willChange: "transform, filter, opacity" }}
    >
      <div
        ref={floatRef}
        data-float-card
        className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-white/[0.045] p-5 sm:p-7 md:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl"
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="font-serif text-xs sm:text-sm italic text-white/30">
            ({review.id})
          </span>
          <div className="flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} />
            ))}
          </div>
        </div>

        <p className="text-sm font-display sm:text-base md:text-lg leading-relaxed text-white/80">
          "{review.quote}"
        </p>

        <p className="mt-4 sm:mt-6 text-xs font-grotesk sm:text-sm tracking-wide text-white/40">
          — {review.name}, {review.location}
        </p>
      </div>
    </div>
  );
});

export default ReviewCard;