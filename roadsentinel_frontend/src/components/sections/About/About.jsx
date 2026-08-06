import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    index: "01",
    label: "THE REALITY",
    icon: "◆",
    title: "Unchecked roads",
    eyebrow: "THE LIMITS OF PHYSICAL POLICING",
    body:
      "Thousands of road accidents happen daily due to reckless behaviors like riding without a helmet, overspeeding, or using mobile phones while driving. Traffic police cannot be present at every road and intersection at all times. This creates a dangerous habit: drivers follow rules only when an officer is in sight, reverting to careless violations the moment the uniform disappears.",
    status: "CRITICAL FOCUS",
  },
  {
    index: "02",
    label: "THE PLATFORM",
    icon: "))",
    title: "Community power",
    eyebrow: "DECENTRALIZING TRAFFIC ACCOUNTABILITY",
    body:
      "RoadSentinel shifts the responsibility of road safety back to the community, turning passive bystanders into active guardians. By empowering law-abiding citizens to securely report witnessed violations with evidence, we establish a continuous network of accountability. When anyone nearby could be a reporter, compliance naturally becomes the standard choice for every driver.",
    status: "LIVE PLATFORM",
  },
  {
    index: "03",
    label: "THE ENGINE",
    icon: "~~",
    title: "Report, verify, earn",
    eyebrow: "THE INCENTIVIZED SAFETY ECOSYSTEM",
    body:
      "The platform creates a direct link between vigilant citizens and traffic authorities. Once a user submits a challan request with proof, the data is directly forwarded to local enforcement for official verification. Every successfully processed violation rewards the reporter with dedicated points, which can be seamlessly redeemed for items in the RoadSentinel Store.",
    status: "ACTIVE INTEGRATION",
  },
  {
    index: "04",
    label: "THE MISSION",
    icon: "[→]",
    title: "A win-win ecosystem",
    eyebrow: "SAFER ROADS THROUGH RIPPLE EFFECTS",
    body:
      "True systemic change starts with a single step. By providing the police with critical community support and rewarding citizens for taking action, we build a safer city for everyone. Your one report doesn't just catch a violation—it acts as a powerful deterrent that prevents the next accident, fosters a safer driving culture, and actively saves lives.",
    status: "THE AIM",
  },
];

export default function About() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      if (cards.length < 4) return;

      const card1 = cards[0];
      const card2 = cards[1];
      const card3 = cards[2];
      const card4 = cards[3];

      const icons = cards.map((c) => c.querySelector("[data-icon]"));
      const contents = cards.map((c) =>
        c.querySelectorAll(
          "[data-eyebrow-row], [data-title], [data-caption], [data-body], [data-status]"
        )
      );

      // Set initial off-screen positions with spacing gaps
      gsap.set([card1, card2], { x: "-140%", opacity: 0 });
      gsap.set([card3, card4], { x: "140%", opacity: 0 });
      gsap.set(icons, { scale: 0, opacity: 0 });
      gsap.set(contents, { y: 20, opacity: 0 });

      // Master scrubbed sequence timeline
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "top 20%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. First Pair (Cards 01 & 02) slide in from Left -> Right & Merge
      mainTl
        .to(
          [card1, card2],
          {
            x: "0%",
            opacity: 1,
            duration: 1,
            stagger: 0.15, // Slight gap delay between card 1 and 2
            ease: "power3.out",
          },
          0
        )
        .to(
          [contents[0], contents[1]],
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.3
        )

        // 2. Second Pair (Cards 03 & 04) slide in from Right -> Left & Merge
        .to(
          [card4, card3], // Reverse order for outer-to-inner merging feel
          {
            x: "0%",
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
          },
          0.5
        )
        .to(
          [contents[2], contents[3]],
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.8
        )

        // 3. Final Pop: Icons pop up when all 4 blocks are fully merged
        .to(
          icons,
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(2.2)",
          },
          1.2
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full bg-[#05070a] text-neutral-900 overflow-hidden"
    >
      <div className="border-t border-neutral-800" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card, i) => (
          <div
            key={card.index}
            ref={(el) => (cardsRef.current[i] = el)}
            className={`
              relative px-8 py-14 sm:px-9 sm:py-16 lg:px-10 lg:py-20
              border-neutral-800
              border-b sm:border-b-0
              ${i !== CARDS.length - 1 ? "lg:border-r" : ""}
              ${i % 2 === 0 ? "sm:border-r" : ""}
              lg:[&:nth-child(2n)]:border-r
            `}
          >
            {/* eyebrow row: index + section label */}
            <div
              data-eyebrow-row
              className="flex items-center justify-between mb-12 sm:mb-16"
            >
              <span className="font-mono text-sm tracking-widest text-neutral-500">
                {card.index}
              </span>
              <span className="font-display text-sm tracking-widest text-neutral-500">
                {card.label}
              </span>
            </div>

            {/* icon (Pops up when merged) */}
            <div
              data-icon
              className="text-4xl text-white sm:text-5xl font-serif mb-8 leading-none select-none origin-center"
            >
              {card.icon}
            </div>

            {/* title */}
            <h3
              data-title
              className="font-display text-white text-3xl sm:text-[2rem] leading-tight mb-4"
            >
              {card.title}
            </h3>

            {/* eyebrow caption under title */}
            <p
              data-caption
              className="font-display text-xs sm:text-sm tracking-wide text-neutral-400 mb-6 leading-relaxed uppercase"
            >
              {card.eyebrow}
            </p>

            {/* body copy */}
            <p
              data-body
              className="font-grotesk text-sm sm:text-[0.92rem] leading-relaxed text-neutral-400 mb-10"
            >
              {card.body}
            </p>

            {/* status */}
            <div data-status className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent,#3DFFB0)] inline-block" />
              <span className="font-display text-xs sm:text-sm tracking-widest text-neutral-300">
                {card.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-b border-neutral-800" />
    </section>
  );
}