export default function Label({ children, required }) {
  return (
    <label className="mb-1.5 block font-['Inter',sans-serif] text-[clamp(0.72rem,1.3vw,0.82rem)] font-semibold uppercase tracking-[0.07em] text-gray-400">
      {children}
      {required && <span className="ml-[3px] text-red-400">*</span>}
    </label>
  );
}