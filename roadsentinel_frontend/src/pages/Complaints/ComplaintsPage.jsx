// ComplaintsPage.jsx
// Shows all complaints raised by the logged-in user.
// Newest complaint first. Images are viewable in a lightbox.
// Dependencies: React, Tailwind CSS, GSAP, useAuth, complaintService

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import useAuth from "../../auth/store";
import { getUserComplaints } from "../../services/complaintService";

// ── Base URL for attachment images ────────────────────────────
const BASE_URL = "http://localhost:8080";

// ── Status badge config ───────────────────────────────────────
const STATUS_CONFIG = {
  PENDING:   { label: "Pending",   bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.4)",  color: "#fbbf24" },
  RESOLVED:  { label: "Resolved",  bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.4)",  color: "#34d399" },
  REJECTED:  { label: "Rejected",  bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.4)", color: "#f87171" },
  IN_REVIEW: { label: "In Review", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.4)",  color: "#60a5fa" },
};

function getStatus(status) {
  return STATUS_CONFIG[status] || {
    label: status || "Unknown",
    bg: "rgba(107,114,128,0.12)",
    border: "rgba(107,114,128,0.4)",
    color: "#6b7280",
  };
}

// ── Format date ───────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

// ── Vehicle icon (inline SVG) ─────────────────────────────────
function VehicleIcon({ type }) {
  const t = (type || "").toLowerCase();
  if (t === "bike" || t === "two wheeler") return (
    <svg width="18" height="18" viewBox="0 0 80 48" fill="none">
      <circle cx="16" cy="34" r="12" stroke="currentColor" strokeWidth="3" fill="none"/>
      <circle cx="64" cy="34" r="12" stroke="currentColor" strokeWidth="3" fill="none"/>
      <line x1="16" y1="34" x2="36" y2="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="36" y1="14" x2="64" y2="34" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="36" y1="14" x2="44" y2="34" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="60" y1="14" x2="68" y2="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="64" y1="14" x2="64" y2="22" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="32" y1="12" x2="42" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
  if (t === "car" || t === "four wheeler") return (
    <svg width="18" height="18" viewBox="0 0 80 48" fill="none">
      <rect x="4" y="22" width="72" height="18" rx="4" stroke="currentColor" strokeWidth="3" fill="none"/>
      <path d="M18 22 L24 10 L56 10 L62 22" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="none"/>
      <circle cx="20" cy="40" r="6" stroke="currentColor" strokeWidth="3" fill="none"/>
      <circle cx="60" cy="40" r="6" stroke="currentColor" strokeWidth="3" fill="none"/>
      <circle cx="20" cy="40" r="2" fill="currentColor"/>
      <circle cx="60" cy="40" r="2" fill="currentColor"/>
    </svg>
  );
  if (t === "auto" || t === "three wheeler") return (
    <svg width="18" height="18" viewBox="0 0 80 56" fill="none">
      <path d="M10 30 L10 44 Q10 48 14 48 L66 48 Q70 48 70 44 L70 30 L60 18 L20 18 Z" stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round"/>
      <circle cx="22" cy="48" r="7" stroke="currentColor" strokeWidth="3" fill="none"/>
      <circle cx="58" cy="48" r="7" stroke="currentColor" strokeWidth="3" fill="none"/>
    </svg>
  );
  return (
    <svg width="18" height="18" viewBox="0 0 80 52" fill="none">
      <rect x="4" y="10" width="44" height="30" rx="2" stroke="currentColor" strokeWidth="3" fill="none"/>
      <path d="M48 24 L48 40 L76 40 L76 28 L68 18 L48 18 Z" stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round"/>
      <circle cx="18" cy="40" r="7" stroke="currentColor" strokeWidth="3" fill="none"/>
      <circle cx="36" cy="40" r="7" stroke="currentColor" strokeWidth="3" fill="none"/>
      <circle cx="63" cy="40" r="7" stroke="currentColor" strokeWidth="3" fill="none"/>
    </svg>
  );
}

// ── Lightbox ──────────────────────────────────────────────────
function Lightbox({ src, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white/60 hover:text-white transition-colors cursor-pointer"
        style={{ background: "rgba(255,255,255,0.07)", fontSize: "1.1rem" }}
      >✕</button>
      <img
        src={src}
        alt="Complaint attachment"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 8, boxShadow: "0 0 60px rgba(0,0,0,0.8)" }}
      />
    </div>
  );
}

// ── Single Complaint Card ─────────────────────────────────────
function ComplaintCard({ complaint, index, cardRef }) {
  const [expanded, setExpanded] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const statusCfg = getStatus(complaint.status);
  const reward = complaint.rewardAmount ?? 0;
  const hasAttachments = complaint.attachments?.length > 0;

  return (
    <>
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
      <div
        ref={cardRef}
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1.5px solid rgba(120,120,130,0.2)",
          borderRadius: 14,
          overflow: "hidden",
          fontFamily: "'Inter', sans-serif",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(120,120,130,0.4)"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(120,120,130,0.2)"}
      >
        {/* ── Card Header ── */}
        <div
          className="flex items-start justify-between gap-3 px-5 py-4 cursor-pointer"
          onClick={() => setExpanded((v) => !v)}
        >
          {/* Left: number + vehicle + violation */}
          <div className="flex items-start gap-3 min-w-0">
            {/* Index badge */}
            <div style={{
              width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.7rem", fontWeight: 700, color: "#6b7280",
            }}>
              {index + 1}
            </div>

            <div className="min-w-0">
              {/* Vehicle number */}
              <div className="flex items-center gap-2 flex-wrap">
                <span style={{ color: "#fff", fontWeight: 700, fontSize: "clamp(0.88rem, 1.6vw, 1rem)", letterSpacing: "0.03em" }}>
                  {complaint.vehicleNumber || "—"}
                </span>
                {/* Status pill */}
                <span style={{
                  fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", padding: "0.2rem 0.6rem",
                  borderRadius: 20, background: statusCfg.bg,
                  border: `1px solid ${statusCfg.border}`, color: statusCfg.color,
                  whiteSpace: "nowrap",
                }}>
                  {statusCfg.label}
                </span>
              </div>

              {/* Vehicle type + violation */}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#9ca3af", fontSize: "0.78rem" }}>
                  <VehicleIcon type={complaint.vehicleType} />
                  {complaint.vehicleType || "—"}
                </span>
                <span style={{ color: "#374151", fontSize: "0.7rem" }}>·</span>
                <span style={{ color: "#6b7280", fontSize: "0.78rem" }}>{complaint.violationType || "—"}</span>
              </div>

              {/* Location */}
              {(complaint.city || complaint.state) && (
                <div className="flex items-center gap-1 mt-1">
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M5.5 1C3.6 1 2 2.6 2 4.5C2 7 5.5 10 5.5 10C5.5 10 9 7 9 4.5C9 2.6 7.4 1 5.5 1Z" stroke="#6b7280" strokeWidth="1.2"/>
                    <circle cx="5.5" cy="4.5" r="1.2" stroke="#6b7280" strokeWidth="1.2"/>
                  </svg>
                  <span style={{ color: "#6b7280", fontSize: "0.73rem" }}>
                    {[complaint.city, complaint.state].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: reward + date + chevron */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              background: reward > 0 ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${reward > 0 ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 6, padding: "0.2rem 0.55rem",
            }}>
              <span style={{ fontSize: "0.72rem", color: reward > 0 ? "#34d399" : "#6b7280", fontWeight: 700 }}>
                ₹{reward}
              </span>
            </div>
            <span style={{ fontSize: "0.65rem", color: "#4b5563", whiteSpace: "nowrap" }}>
              {formatDate(complaint.raisedAt)}
            </span>
            {/* Chevron */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
              style={{ transition: "transform 0.25s", transform: expanded ? "rotate(180deg)" : "none", marginTop: 2 }}>
              <path d="M3 5L7 9L11 5" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* ── Expandable Details ── */}
        <div style={{
          maxHeight: expanded ? "600px" : "0",
          overflow: "hidden",
          transition: "max-height 0.35s ease",
        }}>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "1rem 1.25rem 1.25rem" }}>

            {/* Address */}
            {complaint.address && (
              <div className="mb-3">
                <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4b5563" }}>Address</span>
                <p style={{ fontSize: "0.82rem", color: "#9ca3af", marginTop: "0.25rem", lineHeight: 1.6 }}>{complaint.address}</p>
              </div>
            )}

            {/* Description */}
            {complaint.description && (
              <div className="mb-3">
                <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4b5563" }}>Description</span>
                <p style={{ fontSize: "0.82rem", color: "#9ca3af", marginTop: "0.25rem", lineHeight: 1.6 }}>{complaint.description}</p>
              </div>
            )}

            {/* Complaint ID */}
            <div className="mb-3">
              <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4b5563" }}>Complaint ID</span>
              <p style={{ fontSize: "0.72rem", color: "#374151", marginTop: "0.2rem", fontFamily: "monospace", wordBreak: "break-all" }}>{complaint.id}</p>
            </div>

            {/* Attachments */}
            {hasAttachments && (
              <div>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4b5563" }}>
                  Evidence ({complaint.attachments.length})
                </span>
                <div className="grid grid-cols-3 gap-2 mt-2 sm:grid-cols-4 md:grid-cols-5">
                  {complaint.attachments.map((att) => {
                    const isVideo = att.fileType?.startsWith("video/");
                    const src = `${BASE_URL}${att.fileUrl}`;
                    return (
                      <div
                        key={att.id}
                        onClick={() => !isVideo && setLightboxSrc(src)}
                        className="relative group"
                        style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "1", background: "#111", cursor: isVideo ? "default" : "pointer" }}
                      >
                        {isVideo ? (
                          <video src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted controls />
                        ) : (
                          <img
                            src={src}
                            alt="Attachment"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23111'/%3E%3Ctext x='50%25' y='55%25' font-size='18' text-anchor='middle' fill='%23444'%3E?%3C/text%3E%3C/svg%3E"; }}
                          />
                        )}
                        {/* Zoom overlay for images */}
                        {!isVideo && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{ background: "rgba(0,0,0,0.5)" }}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <circle cx="9" cy="9" r="6" stroke="white" strokeWidth="1.8"/>
                              <path d="M13.5 13.5L17 17" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                              <path d="M9 6V12M6 9H12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                        )}
                        {isVideo && (
                          <div style={{ position: "absolute", top: 4, left: 4, background: "rgba(0,0,0,0.7)", borderRadius: 4, padding: "1px 5px", fontSize: "0.58rem", color: "#e5e7eb" }}>VIDEO</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!hasAttachments && (
              <p style={{ fontSize: "0.75rem", color: "#374151", fontStyle: "italic" }}>No media attached.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Empty state ───────────────────────────────────────────────
function EmptyState({ onRaise }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 8V14M14 18H14.01" stroke="#4b5563" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="14" cy="14" r="11" stroke="#4b5563" strokeWidth="1.8"/>
        </svg>
      </div>
      <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>No Complaints Yet</h3>
      <p style={{ color: "#6b7280", fontSize: "0.85rem", maxWidth: 300, lineHeight: 1.6, marginBottom: "1.5rem" }}>You haven't filed any complaints. Start by reporting a road violation.</p>
      <button onClick={onRaise}
        className="flex items-center gap-2 font-bold uppercase tracking-wider transition-all hover:opacity-90 active:scale-95"
        style={{ background: "#fff", color: "#000", border: "none", borderRadius: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", letterSpacing: "0.07em", padding: "0.65rem 1.6rem", cursor: "pointer" }}>
        Raise a Complaint
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function ComplaintsPage({ onRaise }) {
  const userId = useAuth((state) => state.user?.id);

  const wrapperRef = useRef(null);
  const headerRef  = useRef(null);
  const listRef    = useRef(null);
  const cardRefs   = useRef([]);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // ── Fetch on mount ──────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoading(true);
      const { data, error } = await getUserComplaints(userId);
      setComplaints(data);
      setFetchError(error);
      setLoading(false);
    })();
  }, [userId]);

  // ── GSAP entrance ───────────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(headerRef.current, { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
      if (cardRefs.current.length > 0) {
        tl.fromTo(
          cardRefs.current.filter(Boolean),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.1 },
          "-=0.15"
        );
      }
    }, wrapperRef);
    return () => ctx.revert();
  }, [loading]);

  return (
    <div
      ref={wrapperRef}
      className="min-h-screen w-full flex flex-col items-center"
      style={{ background: "#080808", fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>

      {/* ── Sticky header ── */}
      <div
        ref={headerRef}
        className="w-full sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6"
        style={{
          background: "rgba(8,8,8,0.95)",
          backdropFilter: "blur(12px)",
          height: "clamp(52px, 8vw, 64px)",
          opacity: 0,
        }}
      >
        {/* Back / navigate */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
          style={{ color: "#9ca3af", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500, background: "none", border: "none" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(0.9rem, 2vw, 1.15rem)", letterSpacing: "-0.01em", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          My Complaints
        </h1>

        {/* Count badge */}
        {!loading && !fetchError && (
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 700,
            letterSpacing: "0.06em", color: "#6b7280",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6, padding: "0.22rem 0.65rem",
          }}>
            {complaints.length} total
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div ref={listRef} className="w-full px-4 sm:px-6 py-6 flex flex-col gap-3" style={{ maxWidth: 780 }}>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-3 mt-4">
            {[1,2,3].map((i) => (
              <div key={i} style={{ height: 90, borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(120,120,130,0.15)", animation: "pulse 1.5s ease-in-out infinite" }}>
                <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
              </div>
            ))}
          </div>
        )}

        {/* Fetch error */}
        {!loading && fetchError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(248,113,113,0.08)", border: "1.5px solid rgba(248,113,113,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 7L17 17M17 7L7 17" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p style={{ color: "#f87171", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.4rem" }}>Failed to load complaints</p>
            <p style={{ color: "#6b7280", fontSize: "0.8rem" }}>{fetchError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, color: "#9ca3af", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 600, padding: "0.45rem 1.1rem" }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !fetchError && complaints.length === 0 && (
          <EmptyState onRaise={onRaise || (() => window.location.href = "/raiseChallanRequestOptions")} />
        )}

        {/* Complaint cards */}
        {!loading && !fetchError && complaints.map((complaint, i) => (
          <ComplaintCard
            key={complaint.id}
            complaint={complaint}
            index={i}
            cardRef={(el) => (cardRefs.current[i] = el)}
          />
        ))}
      </div>

      {/* Raise new complaint button (floating, only if has complaints) */}
      {!loading && !fetchError && complaints.length > 0 && (
        <div className="fixed bottom-6 right-6 z-20">
          <button
            onClick={onRaise || (() => window.location.href = "/raiseChallanRequestOptions")}
            className="flex items-center gap-2 font-bold uppercase tracking-wider shadow-2xl transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "#fff", color: "#000", border: "none", borderRadius: 10,
              fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.72rem, 1.2vw, 0.82rem)",
              letterSpacing: "0.07em", padding: "0.7rem 1.4rem", cursor: "pointer",
              boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Complaint
          </button>
        </div>
      )}
    </div>
  );
}