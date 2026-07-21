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
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        const icon = card.querySelector("[data-icon]");
        const eyebrowLabel = card.querySelector("[data-eyebrow-label]");
        const title = card.querySelector("[data-title]");
        const caption = card.querySelector("[data-caption]");
        const body = card.querySelector("[data-body]");
        const status = card.querySelector("[data-status]");

        gsap.set(card, { opacity: 0, y: 40 });
        gsap.set([icon, eyebrowLabel, title, caption, body, status], {
          opacity: 0,
          y: 16,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.12,
        });

        tl.to(card, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
          .to(
            icon,
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            "-=0.35"
          )
          .to(
            eyebrowLabel,
            { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
            "-=0.25"
          )
          .to(
            title,
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            "-=0.2"
          )
          .to(
            caption,
            { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
            "-=0.2"
          )
          .to(
            body,
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            "-=0.2"
          )
          .to(
            status,
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
            "-=0.15"
          );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full bg-black text-neutral-900"
    >
      <div className="border-t border-neutral-500" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card, i) => (
          <div
            key={card.index}
            ref={(el) => (cardsRef.current[i] = el)}
            className={`
              relative px-8 py-14 sm:px-9 sm:py-16 lg:px-10 lg:py-20
              border-neutral-500
              border-b sm:border-b-0
              ${i !== CARDS.length - 1 ? "lg:border-r" : ""}
              ${i % 2 === 0 ? "sm:border-r" : ""}
              lg:[&:nth-child(2n)]:border-r
            `}
          >
            {/* eyebrow row: index + section label */}
            <div className="flex items-center justify-between mb-16 sm:mb-20">
              <span className="font-mono text-sm tracking-widest text-neutral-500">
                {card.index}
              </span>
              <span className="font-mono text-sm tracking-widest text-neutral-500">
                {card.label}
              </span>
            </div>

            {/* icon */}
            <div
              data-icon
              className="text-4xl text-white sm:text-5xl font-serif mb-8 leading-none select-none"
            >
              {card.icon}
            </div>

            {/* title */}
            <h3
              data-title
              className="font-serif text-white text-3xl sm:text-[2rem] leading-tight mb-4"
            >
              {card.title}
            </h3>

            {/* eyebrow caption under title */}
            <p
              data-eyebrow-label
              data-caption
              className="font-mono text-xs sm:text-sm tracking-wide text-neutral-500 mb-6 leading-relaxed"
            >
              {card.eyebrow}
            </p>

            {/* body copy */}
            <p
              data-body
              className="font-mono text-sm sm:text-[0.95rem] leading-relaxed text-neutral-700 mb-10"
            >
              {card.body}
            </p>

            {/* status */}
            <div data-status className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 inline-block" />
              <span className="font-mono text-xs sm:text-sm tracking-widest text-neutral-600">
                {card.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-b border-neutral-300" />
    </section>
  );
}