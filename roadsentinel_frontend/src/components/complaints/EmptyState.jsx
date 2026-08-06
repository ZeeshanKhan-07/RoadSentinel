// src/components/complaints/EmptyState.jsx

export default function EmptyState({ onRaise }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 8V14M14 18H14.01" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />
          <circle cx="14" cy="14" r="11" stroke="#4b5563" strokeWidth="1.8" />
        </svg>
      </div>
      <h3 className="text-white font-bold text-lg mb-2">No Complaints Yet</h3>
      <p className="text-gray-500 text-sm max-w-[300px] leading-relaxed mb-6">
        You haven't filed any complaints. Start by reporting a road violation.
      </p>
      <button
        onClick={onRaise}
        className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs px-6 py-2.5 bg-white text-black rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
      >
        Raise a Complaint
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}