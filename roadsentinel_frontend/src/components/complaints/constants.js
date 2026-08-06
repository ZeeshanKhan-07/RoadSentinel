// src/components/complaints/constants.js

export const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    bg: "bg-amber-400/10",
    border: "border-amber-400/40",
    text: "text-amber-400",
  },
  APPROVED: {
    label: "Approved",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/40",
    text: "text-emerald-400",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-red-400/10",
    border: "border-red-400/40",
    text: "text-red-400",
  },
  IN_REVIEW: {
    label: "In Review",
    bg: "bg-blue-400/10",
    border: "border-blue-400/40",
    text: "text-blue-400",
  },
};

export const DEFAULT_STATUS = {
  bg: "bg-gray-500/10",
  border: "border-gray-500/40",
  text: "text-gray-500",
};