export default function Tile({ icon, label, sub, accent, onClick, tileRef }) {
  return (
    <div
      ref={tileRef}
      onClick={onClick}
      style={{
        "--accent": accent,
        "--accent-bg": `${accent}1a`,
        "--accent-border": `${accent}33`,
        "--accent-hover": `${accent}55`,
      }}
      className="group flex flex-col justify-between cursor-pointer select-none bg-white/[0.03] hover:bg-white/[0.055] border border-[rgba(120,120,130,0.2)] hover:border-[var(--accent-hover)] rounded-[14px] p-[clamp(1rem,2.5vw,1.4rem)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.4)] min-h-[130px]"
    >
      <div className="w-11 h-11 rounded-full bg-[var(--accent-bg)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)] mb-auto">
        {icon}
      </div>
      <div className="mt-5">
        <div className="font-display text-white">{sub}</div>
        <div className="font-grotesk text-gray-500 text-sm">{label}</div>
      </div>
    </div>
  );
}