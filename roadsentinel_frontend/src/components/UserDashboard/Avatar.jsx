import { useState } from "react";

const BASE_URL = "http://localhost:8080";

export default function Avatar({ src, name, size = 72 }) {
  const [imgError, setImgError] = useState(false);
  const initials = (name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src && !imgError) {
    return (
      <img
        src={src.startsWith("http") ? src : `${BASE_URL}${src}`}
        alt={name}
        onError={() => setImgError(true)}
        style={{ width: `${size}px`, height: `${size}px` }}
        className="rounded-full object-cover border-[2.5px] border-white/10 shrink-0"
      />
    );
  }

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.35}px` }}
      className="rounded-full shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 border-[2.5px] border-white/10 flex items-center justify-center font-sans font-extrabold text-white tracking-wide"
    >
      {initials}
    </div>
  );
}