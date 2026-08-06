export default function SuccessScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#080808] px-6 text-center font-['Inter',sans-serif]">
      <style>{`@keyframes popIn { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }`}</style>

      <div className="mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-emerald-400 bg-emerald-400/10 [animation:popIn_0.5s_ease_forwards]">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M7 16L13 22L25 10"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className="mb-[0.6rem] text-[clamp(1.5rem,3.5vw,2.2rem)] font-extrabold tracking-[-0.02em] text-white">
        Complaint Submitted!
      </h2>
      <p className="mb-[2.2rem] max-w-[360px] text-[clamp(0.82rem,1.5vw,1rem)] leading-[1.6] text-gray-500">
        Your report has been received and is under review. You'll be notified of
        updates.
      </p>

      <button
        onClick={() => (window.location.href = "/complaints")}
        className="flex items-center gap-2 rounded-lg border-none bg-white px-[clamp(1.4rem,3vw,2rem)] py-[clamp(0.65rem,1.5vw,0.85rem)] text-[clamp(0.78rem,1.3vw,0.9rem)] font-bold uppercase tracking-[0.07em] text-black transition-all duration-200 hover:opacity-90 active:scale-95"
      >
        See All Complaints
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path
            d="M2.5 7.5H12.5M12.5 7.5L8.5 3.5M12.5 7.5L8.5 11.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}