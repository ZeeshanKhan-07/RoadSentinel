// src/components/complaints/icons.jsx

export function VehicleIcon({ type }) {
  const t = (type || "").toLowerCase();

  if (t === "bike" || t === "two wheeler") {
    return (
      <svg width="18" height="18" viewBox="0 0 80 48" fill="none">
        <circle cx="16" cy="34" r="12" stroke="currentColor" strokeWidth="3" fill="none" />
        <circle cx="64" cy="34" r="12" stroke="currentColor" strokeWidth="3" fill="none" />
        <line x1="16" y1="34" x2="36" y2="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="36" y1="14" x2="64" y2="34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="36" y1="14" x2="44" y2="34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="14" x2="68" y2="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="64" y1="14" x2="64" y2="22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="32" y1="12" x2="42" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (t === "car" || t === "four wheeler") {
    return (
      <svg width="18" height="18" viewBox="0 0 80 48" fill="none">
        <rect x="4" y="22" width="72" height="18" rx="4" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M18 22 L24 10 L56 10 L62 22" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="none" />
        <circle cx="20" cy="40" r="6" stroke="currentColor" strokeWidth="3" fill="none" />
        <circle cx="60" cy="40" r="6" stroke="currentColor" strokeWidth="3" fill="none" />
        <circle cx="20" cy="40" r="2" fill="currentColor" />
        <circle cx="60" cy="40" r="2" fill="currentColor" />
      </svg>
    );
  }

  if (t === "auto" || t === "three wheeler") {
    return (
      <svg width="18" height="18" viewBox="0 0 80 56" fill="none">
        <path d="M10 30 L10 44 Q10 48 14 48 L66 48 Q70 48 70 44 L70 30 L60 18 L20 18 Z" stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round" />
        <circle cx="22" cy="48" r="7" stroke="currentColor" strokeWidth="3" fill="none" />
        <circle cx="58" cy="48" r="7" stroke="currentColor" strokeWidth="3" fill="none" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 80 52" fill="none">
      <rect x="4" y="10" width="44" height="30" rx="2" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M48 24 L48 40 L76 40 L76 28 L68 18 L48 18 Z" stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round" />
      <circle cx="18" cy="40" r="7" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle cx="36" cy="40" r="7" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle cx="63" cy="40" r="7" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
  );
}