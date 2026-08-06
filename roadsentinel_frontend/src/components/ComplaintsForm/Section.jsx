export default function Section({ title, children, sectionRef }) {
  return (
    <div ref={sectionRef} className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="font-['Inter',sans-serif] text-[clamp(0.65rem,1.1vw,0.72rem)] font-bold uppercase tracking-[0.12em] text-gray-600">
          {title}
        </span>
        <div className="h-px flex-1 bg-white/[0.07]" />
      </div>
      {children}
    </div>
  );
}