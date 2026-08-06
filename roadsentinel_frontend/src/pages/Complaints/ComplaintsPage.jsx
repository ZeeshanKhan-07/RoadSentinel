// src/components/complaints/ComplaintsPage.jsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import useAuth from "../../auth/store";
import { getUserComplaints } from "../../services/complaintService";
import ComplaintCard from "../../components/complaints/ComplaintCard";
import EmptyState from "../../components/complaints/EmptyState";

export default function ComplaintsPage({ onRaise }) {
  const userId = useAuth((state) => state.user?.id);

  const wrapperRef = useRef(null);
  const cardRefs = useRef([]);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const handleRaiseClick = onRaise || (() => (window.location.href = "/raiseChallanRequestOptions"));

  // Fetch complaints on mount
  useEffect(() => {
    if (!userId) return;

    let isMounted = true;
    (async () => {
      setLoading(true);
      const { data, error } = await getUserComplaints(userId);
      if (isMounted) {
        setComplaints(data || []);
        setFetchError(error);
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // GSAP entrance animation
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.1, ease: "power3.out" }
        );
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, [loading]);

  return (
    <div
      ref={wrapperRef}
      className="min-h-screen w-full flex flex-col items-center bg-[#05070a] font-sans pt-14"
    >
      <div className="w-full max-w-[780px] px-4 sm:px-6 py-6 flex flex-col gap-3">
        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[90px] rounded-2xl bg-white/[0.03] border border-gray-400/15 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Fetch error */}
        {!loading && fetchError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-red-400/10 border border-red-400/30 flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 7L17 17M17 7L7 17" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-red-400 text-sm font-semibold mb-1.5">Failed to load complaints</p>
            <p className="text-gray-500 text-xs">{fetchError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 font-sans text-xs font-semibold px-4 py-2 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !fetchError && complaints.length === 0 && (
          <EmptyState onRaise={handleRaiseClick} />
        )}

        {/* Complaint cards */}
        {!loading &&
          !fetchError &&
          complaints.map((complaint, i) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              index={i}
              cardRef={(el) => (cardRefs.current[i] = el)}
            />
          ))}
      </div>

      {/* Floating Action Button */}
      {!loading && !fetchError && complaints.length > 0 && (
        <div className="fixed bottom-6 right-6 z-20">
          <button
            onClick={handleRaiseClick}
            className="flex items-center gap-2 font-display text-black bg-white px-5 py-3 hover:px-6 hover:py-4 rounded-xl uppercase tracking-wider shadow-2xl transition-all hover:opacity-90 active:scale-95 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Complaint
          </button>
        </div>
      )}
    </div>
  );
}