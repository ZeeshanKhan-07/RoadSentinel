import { useState } from "react";
import Label from "./Label";

export default function SelectField({
  label,
  required,
  options,
  value,
  onChange,
  disabled,
  error,
}) {
  const [focused, setFocused] = useState(false);

  const borderClass = error
    ? "border-red-400"
    : focused
      ? "border-white/45"
      : "border-[rgba(120,120,130,0.3)]";

  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={[
            "w-full appearance-none rounded-lg border-[1.5px]",
            disabled ? "bg-white/[0.02] text-gray-500" : "bg-white/[0.04] text-gray-100",
            "px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.55rem,1.2vw,0.75rem)] pr-10",
            "font-['Inter',sans-serif] text-[clamp(0.82rem,1.4vw,0.95rem)]",
            "outline-none transition-colors duration-200",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
            borderClass,
          ].join(" ")}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#111]">
              {o.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3 5L7 9L11 5"
            stroke="#6b7280"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {error && (
        <p className="mt-[0.3rem] font-['Inter',sans-serif] text-[0.72rem] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}