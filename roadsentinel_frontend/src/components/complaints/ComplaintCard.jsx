// src/components/complaints/ComplaintCard.jsx
import { useState } from "react";
import Lightbox from "./Lightbox";
import { VehicleIcon } from "./icons";
import { getStatus, formatDate, isVideoUrl } from "./helpers";

export default function ComplaintCard({ complaint, index, cardRef }) {
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
        className="bg-white/[0.025] border border-gray-400/20 rounded-xl overflow-hidden font-sans transition-colors hover:border-gray-400/40"
      >
        {/* Header */}
        <div
          className="flex items-start justify-between gap-3 px-5 py-4 cursor-pointer"
          onClick={() => setExpanded((v) => !v)}
        >
          {/* Left Details */}
          <div className="flex items-start gap-3 min-w-0">
            {/* Index badge */}
            <div className="w-8 h-8 rounded-full shrink-0 bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-500">
              {index + 1}
            </div>

            <div className="min-w-0">
              {/* Vehicle number & Status */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-display text-[clamp(0.88rem,1.6vw,1rem)] tracking-wider">
                  {complaint.vehicleNumber || "—"}
                </span>
                <span
                  className={`text-[0.65rem] font-display tracking-widest uppercase px-2.5 py-1 rounded-full border whitespace-nowrap ${statusCfg.bg} ${statusCfg.border} ${statusCfg.text}`}
                >
                  {statusCfg.label}
                </span>
              </div>

              {/* Vehicle type & Violation */}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="flex items-center gap-1 font-display text-gray-400 text-xs">
                  <VehicleIcon type={complaint.vehicleType} />
                  {complaint.vehicleType || "—"}
                </span>
                <span className="text-gray-700 text-xs">·</span>
                <span className="text-gray-500 font-grotesk text-xs">{complaint.violationType || "—"}</span>
              </div>

              {/* Location */}
              {(complaint.city || complaint.state) && (
                <div className="flex items-center gap-1 mt-1">
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M5.5 1C3.6 1 2 2.6 2 4.5C2 7 5.5 10 5.5 10C5.5 10 9 7 9 4.5C9 2.6 7.4 1 5.5 1Z" stroke="#6b7280" strokeWidth="1.2" />
                    <circle cx="5.5" cy="4.5" r="1.2" stroke="#6b7280" strokeWidth="1.2" />
                  </svg>
                  <span className="text-gray-500 font-grotesk text-[0.73rem]">
                    {[complaint.city, complaint.state].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Details */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded border ${
                reward > 0
                  ? "bg-emerald-400/10 border-emerald-400/25 text-emerald-400"
                  : "bg-white/5 border-white/10 text-gray-500"
              }`}
            >
              <span className="text-xs font-bold">₹{reward}</span>
            </div>
            <span className="text-[0.65rem] text-gray-600 whitespace-nowrap">
              {formatDate(complaint.raisedAt)}
            </span>
            {/* Chevron */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className={`transition-transform duration-300 mt-0.5 ${expanded ? "rotate-180" : ""}`}
            >
              <path d="M3 5L7 9L11 5" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Expandable Panel */}
        <div className={`overflow-hidden transition-[max-height] duration-350 ease-in-out ${expanded ? "max-h-[600px]" : "max-h-0"}`}>
          <div className="border-t border-white/5 p-5 pt-4">
            {/* Address */}
            {complaint.address && (
              <div className="mb-3">
                <span className="text-[0.68rem] font-display tracking-widest uppercase text-gray-300 block mb-1">
                  Address
                </span>
                <p className="text-xs text-gray-400 font-grotesk leading-relaxed">{complaint.address}</p>
              </div>
            )}

            {/* Description */}
            {complaint.description && (
              <div className="mb-3">
                <span className="text-[0.68rem] font-display tracking-widest uppercase text-gray-300 block mb-1">
                  Description
                </span>
                <p className="text-xs text-gray-400 font-grotesk leading-relaxed">{complaint.description}</p>
              </div>
            )}

            {/* Complaint ID */}
            <div className="mb-3">
              <span className="text-[0.68rem] font-display tracking-widest uppercase text-gray-300 block mb-1">
                Complaint ID
              </span>
              <p className="text-[0.72rem] text-gray-700 font-mono break-all">{complaint.id}</p>
            </div>

            {/* Media Evidence */}
            {hasAttachments ? (
              <div>
                <span className="text-[0.68rem] font-display tracking-widest uppercase text-gray-600 block mb-2">
                  Evidence ({complaint.attachments.length})
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {complaint.attachments.map((att) => {
                    const src = att.imageUrl;
                    const isVideo = isVideoUrl(src);

                    return (
                      <div
                        key={att.id}
                        onClick={() => !isVideo && setLightboxSrc(src)}
                        className={`relative group rounded-lg overflow-hidden aspect-square bg-neutral-900 ${
                          isVideo ? "cursor-default" : "cursor-pointer"
                        }`}
                      >
                        {isVideo ? (
                          <video src={src} className="w-full h-full object-cover" autoPlay muted loop controls />
                        ) : (
                          <img
                            src={src}
                            alt="Attachment"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23111'/%3E%3Ctext x='50%25' y='55%25' font-size='18' text-anchor='middle' fill='%23444'%3E?%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        )}

                        {/* Image overlay */}
                        {!isVideo && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <circle cx="9" cy="9" r="6" stroke="white" strokeWidth="1.8" />
                              <path d="M13.5 13.5L17 17" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                              <path d="M9 6V12M6 9H12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </div>
                        )}

                        {/* Video Badge */}
                        {isVideo && (
                          <div className="absolute top-1 left-1 bg-black/70 rounded px-1.5 py-0.5 text-[0.58rem] text-gray-200">
                            VIDEO
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-700 italic">No media attached.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}