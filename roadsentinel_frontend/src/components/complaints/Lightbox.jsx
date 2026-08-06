// src/components/complaints/Lightbox.jsx
import { useEffect } from "react";

export default function Lightbox({ src, onClose }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer text-lg"
      >
        ✕
      </button>
      <img
        src={src}
        alt="Complaint attachment"
        onClick={(e) => e.stopPropagation()}
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-[0_0_60px_rgba(0,0,0,0.8)]"
      />
    </div>
  );
}