// src/components/complaints/helpers.js
import { STATUS_CONFIG, DEFAULT_STATUS } from "./constants";

export function getStatus(status) {
  const cfg = STATUS_CONFIG[status];
  if (cfg) return cfg;
  
  return {
    label: status || "Unknown",
    ...DEFAULT_STATUS,
  };
}

export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function isVideoUrl(url) {
  if (!url) return false;
  const ext = url.split("?")[0].split(".").pop().toLowerCase();
  return ["mp4", "webm", "ogg", "mov", "avi"].includes(ext);
}