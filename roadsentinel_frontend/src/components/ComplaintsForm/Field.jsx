import { useState } from "react";
import Label from "./Label";

export default function Field({ label, required, textarea, error, ...props }) {
  const [focused, setFocused] = useState(false);

  const borderClass = error
    ? "border-red-400"
    : focused
      ? "border-white/45"
      : "border-[rgba(120,120,130,0.3)]";

  const sharedClass = [
    "w-full resize-none rounded-lg border-[1.5px] bg-white/[0.04]",
    "px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.55rem,1.2vw,0.75rem)]",
    "font-['Inter',sans-serif] text-[clamp(0.82rem,1.4vw,0.95rem)] text-gray-100",
    "outline-none transition-colors duration-200",
    borderClass,
  ].join(" ");

  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      {textarea ? (
        <textarea
          rows={4}
          className={sharedClass}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      ) : (
        <input
          className={sharedClass}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      )}
      {error && (
        <p className="mt-[0.3rem] font-['Inter',sans-serif] text-[0.72rem] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}