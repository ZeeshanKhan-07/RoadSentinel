export default function QuoteBanner({ name }) {
  const first = (name || "there").split(" ")[0];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-400 rounded-2xl p-[clamp(1.4rem,3vw,2rem)] min-h-[140px]">
      <div className="absolute -right-7 -top-7 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute right-15 -bottom-10 w-28 h-28 rounded-full bg-white/[0.06] pointer-events-none" />
      
      <svg className="absolute right-[8%] bottom-0 opacity-13 pointer-events-none" width="90" height="70" viewBox="0 0 90 70">
        <polygon points="45,0 90,70 0,70" fill="white" />
      </svg>
      <svg className="absolute right-[20%] bottom-2 opacity-8 pointer-events-none" width="55" height="45" viewBox="0 0 55 45">
        <polygon points="27,0 55,45 0,45" fill="white" />
      </svg>
      
      <div className="absolute right-[clamp(1rem,6vw,5rem)] top-1/2 -translate-y-1/2 opacity-25 pointer-events-none">
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
          <circle cx="45" cy="45" r="40" stroke="white" strokeWidth="3" fill="none" />
          <path d="M45 45 L65 25" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <circle cx="45" cy="45" r="5" fill="white" />
          <path d="M15 60 A35 35 0 0 1 75 60" stroke="white" strokeWidth="2.5" fill="none" strokeDasharray="4 3" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[65%]">
        <h2 className="font-sans font-extrabold text-[clamp(1rem,2.5vw,1.4rem)] text-[#0f0f0f] leading-snug mb-2">
          Welcome back, {first}! Let's report violations and make roads safer today.
        </h2>
        <p className="font-grotesk text-black/80 text-sm">
          Every report you file brings us one step closer to safer roads for everyone.
        </p>
      </div>
    </div>
  );
}