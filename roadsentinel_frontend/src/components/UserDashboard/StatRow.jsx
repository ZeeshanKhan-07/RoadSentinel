export default function StatRow({ icon, label, value, valueColor }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">{icon}</span>
        <span className="font-grotesk text-white text-xs">{label}</span>
      </div>
      <span
        style={{ color: valueColor || "#fff" }}
        className="font-sans text-[clamp(0.75rem,1.3vw,0.85rem)] font-bold"
      >
        {value}
      </span>
    </div>
  );
}