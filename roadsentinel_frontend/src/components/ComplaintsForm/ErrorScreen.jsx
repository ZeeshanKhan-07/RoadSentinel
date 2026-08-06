export default function ErrorScreen({ onRetry }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#080808] px-6 text-center font-['Inter',sans-serif]">
      <style>{`@keyframes popIn { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }`}</style>

      <div className="mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-red-400 bg-red-400/10 [animation:popIn_0.5s_ease_forwards]">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M10 10L22 22M22 10L10 22" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      <h2 className="mb-[0.6rem] text-[clamp(1.5rem,3.5vw,2.2rem)] font-extrabold tracking-[-0.02em] text-white">
        Something Went Wrong
      </h2>
      <p className="mb-[2.2rem] max-w-[360px] text-[clamp(0.82rem,1.5vw,1rem)] leading-[1.6] text-gray-500">
        We couldn't submit your complaint. Please check your connection and try
        again.
      </p>

      <button
        onClick={onRetry}
        className="flex items-center gap-2 rounded-lg border-none bg-white px-[clamp(1.4rem,3vw,2rem)] py-[clamp(0.65rem,1.5vw,0.85rem)] text-[clamp(0.78rem,1.3vw,0.9rem)] font-bold uppercase tracking-[0.07em] text-black transition-all duration-200 hover:opacity-90 active:scale-95"
      >
        Try Again
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path
            d="M2 8C2 5.2 4.2 3 7 3C8.5 3 9.8 3.6 10.8 4.5M13 7C13 9.8 10.8 12 8 12C6.5 12 5.2 11.4 4.2 10.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path d="M11 2V5H14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 13V10H1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}