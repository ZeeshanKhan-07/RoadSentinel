import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import useAuth from "../../auth/store";
import apiClient from "../../config/ApiClient";

// ─────────────────────────────────────────────────────────────
// Label
// ─────────────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label
      className="block font-semibold mb-1.5"
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "clamp(0.72rem, 1.3vw, 0.82rem)",
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: "#9ca3af",
      }}
    >
      {children}
      {required && <span style={{ color: "#f87171", marginLeft: 3 }}>*</span>}
    </label>
  );
}

// ─────────────────────────────────────────────────────────────
// Text / Textarea Field
// ─────────────────────────────────────────────────────────────
function Field({ label, required, textarea, error, ...props }) {
  const [focused, setFocused] = useState(false);
  const base = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: error
      ? "1.5px solid #f87171"
      : focused
        ? "1.5px solid rgba(255,255,255,0.45)"
        : "1.5px solid rgba(120,120,130,0.3)",
    borderRadius: "8px",
    color: "#f3f4f6",
    fontFamily: "'Inter', sans-serif",
    fontSize: "clamp(0.82rem, 1.4vw, 0.95rem)",
    outline: "none",
    transition: "border-color 0.2s",
    padding: "clamp(0.55rem, 1.2vw, 0.75rem) clamp(0.75rem, 1.5vw, 1rem)",
    resize: "none",
  };
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      {textarea ? (
        <textarea
          rows={4}
          style={base}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      ) : (
        <input
          style={base}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      )}
      {error && (
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.72rem",
            color: "#f87171",
            marginTop: "0.3rem",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Select Field
// ─────────────────────────────────────────────────────────────
function SelectField({
  label,
  required,
  options,
  value,
  onChange,
  disabled,
  error,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            appearance: "none",
            background: disabled
              ? "rgba(255,255,255,0.02)"
              : "rgba(255,255,255,0.04)",
            border: error
              ? "1.5px solid #f87171"
              : focused
                ? "1.5px solid rgba(255,255,255,0.45)"
                : "1.5px solid rgba(120,120,130,0.3)",
            borderRadius: "8px",
            color: disabled ? "#6b7280" : "#f3f4f6",
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.82rem, 1.4vw, 0.95rem)",
            outline: "none",
            transition: "border-color 0.2s",
            padding:
              "clamp(0.55rem, 1.2vw, 0.75rem) clamp(0.75rem, 1.5vw, 1rem)",
            paddingRight: "2.5rem",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {options.map((o) => (
            <option
              key={o.value}
              value={o.value}
              style={{ background: "#111" }}
            >
              {o.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3 5L7 9L11 5"
            stroke="#6b7280"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {error && (
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.72rem",
            color: "#f87171",
            marginTop: "0.3rem",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Media Upload
// ─────────────────────────────────────────────────────────────
function MediaUpload({ files, onFiles }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback(
    (incoming) => {
      const arr = Array.from(incoming);
      onFiles((prev) => {
        const existing = new Set(prev.map((f) => f.name + f.size));
        return [...prev, ...arr.filter((f) => !existing.has(f.name + f.size))];
      });
    },
    [onFiles],
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };
  const removeFile = (idx) =>
    onFiles((prev) => prev.filter((_, i) => i !== idx));
  const formatSize = (b) =>
    b < 1024 * 1024
      ? (b / 1024).toFixed(0) + " KB"
      : (b / (1024 * 1024)).toFixed(1) + " MB";
  const isVideo = (f) => f.type.startsWith("video/");

  return (
    <div>
      <Label>Upload Media</Label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: dragOver
            ? "2px dashed rgba(255,255,255,0.5)"
            : "2px dashed rgba(120,120,130,0.3)",
          borderRadius: "10px",
          background: dragOver
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.02)",
          transition: "border-color 0.2s, background 0.2s",
          padding: "clamp(1.2rem, 3vw, 2rem)",
          textAlign: "center",
        }}
      >
        <div className="flex justify-center mb-3">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M11 14V4M11 4L7 8M11 4L15 8"
                stroke="#9ca3af"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 16V18C3 19.1 3.9 20 5 20H17C18.1 20 19 19.1 19 18V16"
                stroke="#9ca3af"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.78rem, 1.3vw, 0.88rem)",
            color: "#9ca3af",
            marginBottom: "0.75rem",
          }}
        >
          Drag & drop images or videos here, or
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 transition-all duration-200 hover:opacity-80 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "6px",
              color: "#e5e7eb",
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.72rem, 1.2vw, 0.8rem)",
              fontWeight: 600,
              padding: "0.45rem 1rem",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect
                x="1"
                y="1"
                width="12"
                height="12"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="4.5" cy="4.5" r="1" fill="currentColor" />
              <path
                d="M1 9L4 6L7 9L9.5 6.5L13 10"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Gallery / Files
          </button>
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center gap-1.5 transition-all duration-200 hover:opacity-80 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "6px",
              color: "#e5e7eb",
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.72rem, 1.2vw, 0.8rem)",
              fontWeight: 600,
              padding: "0.45rem 1rem",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 4.5C1 3.7 1.7 3 2.5 3H3.5L4.5 1.5H9.5L10.5 3H11.5C12.3 3 13 3.7 13 4.5V11C13 11.8 12.3 12.5 11.5 12.5H2.5C1.7 12.5 1 11.8 1 11V4.5Z"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <circle
                cx="7"
                cy="7.5"
                r="2"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
            Take Photo
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {files.map((file, idx) => {
              const url = URL.createObjectURL(file);
              return (
                <div
                  key={idx}
                  className="relative group"
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    aspectRatio: "1",
                    background: "#111",
                  }}
                >
                  {isVideo(file) ? (
                    <video
                      src={url}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      muted
                    />
                  ) : (
                    <img
                      src={url}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "rgba(0,0,0,0.6)" }}
                  >
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      style={{
                        background: "#ef4444",
                        border: "none",
                        borderRadius: "50%",
                        width: 26,
                        height: 26,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#fff",
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 2L10 10M10 2L2 10"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                  {isVideo(file) && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 4,
                        left: 4,
                        background: "rgba(0,0,0,0.7)",
                        borderRadius: 4,
                        padding: "1px 5px",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.6rem",
                        color: "#e5e7eb",
                      }}
                    >
                      VIDEO
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 4,
                      right: 4,
                      background: "rgba(0,0,0,0.6)",
                      borderRadius: 4,
                      padding: "1px 5px",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.6rem",
                      color: "#9ca3af",
                    }}
                  >
                    {formatSize(file.size)}
                  </div>
                </div>
              );
            })}
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.72rem",
              color: "#6b7280",
              marginTop: "0.5rem",
            }}
          >
            {files.length} file{files.length > 1 ? "s" : ""} selected · Hover to
            remove
          </p>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section wrapper
// ─────────────────────────────────────────────────────────────
function Section({ title, children, sectionRef }) {
  return (
    <div ref={sectionRef} className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.65rem, 1.1vw, 0.72rem)",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#4b5563",
          }}
        >
          {title}
        </span>
        <div
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}
        />
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Form
// ─────────────────────────────────────────────────────────────
export default function ComplaintForm({ vehicleType = "car", onBack }) {
  const wrapperRef = useRef(null);
  const headerRef = useRef(null);
  const sectionsRef = useRef([]);
  const submitRef = useRef(null);

  const userId = useAuth((state) => state.user?.id);
  const accessToken = useAuth((state) => state?.accessToken);

  // "idle" | "submitting" | "success" | "error"
  const [status, setStatus] = useState("idle");
  const [files, setFiles] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType: vehicleType,
    violationType: "",
    description: "",
    address: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
  });

  const set = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    // Clear error for that field on change
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const VIOLATION_TYPES = [
    { value: "", label: "Select violation type…" },
    { value: "POTHOLE", label: "Pothole / Road Damage" },
    { value: "BROKEN_SIGNAL", label: "Broken Traffic Signal" },
    { value: "ILLEGAL_PARKING", label: "Illegal Parking" },
    { value: "WRONG_WAY_DRIVING", label: "Wrong Way Driving" },
    { value: "OVER_SPEEDING", label: "Over Speeding" },
    { value: "DRUNK_DRIVING", label: "Drunk Driving" },
    { value: "NO_HELMET", label: "No Helmet / Safety Gear" },
    { value: "ROAD_OBSTRUCTION", label: "Road Obstruction" },
    { value: "OTHER", label: "Other" },
  ];

  const VEHICLE_TYPES = [
    { value: "bike", label: "Bike — Two Wheeler" },
    { value: "car", label: "Car — Four Wheeler" },
    { value: "auto", label: "Auto — Three Wheeler" },
    { value: "commercial", label: "Commercial Vehicle" },
  ];

  // ── GSAP entrance ────────────────────────────────────────────
  useEffect(() => {
    if (status !== "idle") return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        headerRef.current,
        { y: -28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55 },
      );
      tl.fromTo(
        sectionsRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.14 },
        "-=0.2",
      );
      tl.fromTo(
        submitRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        "-=0.1",
      );
    }, wrapperRef);
    return () => ctx.revert();
  }, [status]);

  // ── Validation ───────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.vehicleNumber.trim())
      e.vehicleNumber = "Vehicle number is required.";
    if (!form.violationType)
      e.violationType = "Please select a violation type.";
    if (!form.address.trim()) e.address = "Address is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.state.trim()) e.state = "State is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    return e;
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstKey = Object.keys(validationErrors)[0];
      document
        .getElementById(`field-${firstKey}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("submitting");

    try {
      const formData = new FormData();

      // 2. Map fields to match your ComplaintDTO.java
      // Use the userId from your useAuth state
      formData.append("userId", userId);

      formData.append("address", form.address);
      formData.append("city", form.city);
      formData.append("state", form.state);
      formData.append("vehicleNumber", form.vehicleNumber);
      formData.append("vehicleType", form.vehicleType);
      formData.append("violationType", form.violationType);
      formData.append("description", form.description);

      // 3. Handle Numbers (Latitude/Longitude)
      // We send them as strings; Spring's @ModelAttribute will convert them to Double
      if (form.latitude) formData.append("latitude", form.latitude);
      if (form.longitude) formData.append("longitude", form.longitude);

      // 4. Append Media Files
      // Key "media" matches @RequestParam("media") in your Controller
      files.forEach((file) => {
        formData.append("media", file);
      });

      // 5. Send Request
      const res = await apiClient.post("/complaint/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201 || res.status === 200) {
        setStatus("success");
      }
    } catch (error) {
      console.error(
        "Submission error details:",
        error.response?.data || error.message,
      );
      setStatus("error");
    }
  };

  // ────────────────────────────────────────────────────────────
  // SUCCESS SCREEN
  // ────────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: "#080808", fontFamily: "'Inter', sans-serif" }}
      >
        <style>{`@keyframes popIn { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }`}</style>

        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "rgba(52,211,153,0.1)",
            border: "2px solid #34d399",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
            animation: "popIn 0.5s ease forwards",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M7 16L13 22L25 10"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
            letterSpacing: "-0.02em",
            marginBottom: "0.6rem",
          }}
        >
          Complaint Submitted!
        </h2>
        <p
          style={{
            color: "#6b7280",
            fontSize: "clamp(0.82rem, 1.5vw, 1rem)",
            maxWidth: 360,
            lineHeight: 1.6,
            marginBottom: "2.2rem",
          }}
        >
          Your report has been received and is under review. You'll be notified
          of updates.
        </p>

        <button
          //will declare the functionality to fetch all the complains by the current user id
          onClick={() => (window.location.href = "/complaints")}
          className="flex items-center gap-2 font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            background: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.78rem, 1.3vw, 0.9rem)",
            letterSpacing: "0.07em",
            padding: "clamp(0.65rem, 1.5vw, 0.85rem) clamp(1.4rem, 3vw, 2rem)",
            cursor: "pointer",
          }}
        >
          See All Complaints
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path
              d="M2.5 7.5H12.5M12.5 7.5L8.5 3.5M12.5 7.5L8.5 11.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────
  // ERROR SCREEN
  // ────────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: "#080808", fontFamily: "'Inter', sans-serif" }}
      >
        <style>{`@keyframes popIn { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }`}</style>

        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "rgba(248,113,113,0.1)",
            border: "2px solid #f87171",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
            animation: "popIn 0.5s ease forwards",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M10 10L22 22M22 10L10 22"
              stroke="#f87171"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h2
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
            letterSpacing: "-0.02em",
            marginBottom: "0.6rem",
          }}
        >
          Something Went Wrong
        </h2>
        <p
          style={{
            color: "#6b7280",
            fontSize: "clamp(0.82rem, 1.5vw, 1rem)",
            maxWidth: 360,
            lineHeight: 1.6,
            marginBottom: "2.2rem",
          }}
        >
          We couldn't submit your complaint. Please check your connection and
          try again.
        </p>

        <button
          onClick={() => (window.location.href = "/raiseChallanRequestOptions")}
          className="flex items-center gap-2 font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            background: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.78rem, 1.3vw, 0.9rem)",
            letterSpacing: "0.07em",
            padding: "clamp(0.65rem, 1.5vw, 0.85rem) clamp(1.4rem, 3vw, 2rem)",
            cursor: "pointer",
          }}
        >
          Try Again
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path
              d="M2 8C2 5.2 4.2 3 7 3C8.5 3 9.8 3.6 10.8 4.5M13 7C13 9.8 10.8 12 8 12C6.5 12 5.2 11.4 4.2 10.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M11 2V5H14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 13V10H1"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────
  // FORM
  // ────────────────────────────────────────────────────────────
  return (
    <div
      ref={wrapperRef}
      className="min-h-screen w-full flex flex-col items-center"
      style={{ background: "#080808", fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes popIn { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
      `}</style>

      {/* ── Sticky header — NO bottom border ── */}
      <div
        ref={headerRef}
        className="w-full sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6"
        style={{
          background: "rgba(8,8,8,0.95)",
          backdropFilter: "blur(12px)",
          height: "clamp(52px, 8vw, 64px)",
          opacity: 0,
          /* border-bottom intentionally removed */
        }}
      >
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 transition-opacity hover:opacity-70 cursor-pointer"
          style={{
            color: "#9ca3af",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 500,
            background: "none",
            border: "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>

        <h1
          style={{
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(0.9rem, 2vw, 1.15rem)",
            letterSpacing: "-0.01em",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          File a Complaint
        </h1>

        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.65rem, 1.2vw, 0.75rem)",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#34d399",
            background: "rgba(52,211,153,0.1)",
            border: "1px solid rgba(52,211,153,0.25)",
            borderRadius: 6,
            padding: "0.25rem 0.7rem",
          }}
        >
          {vehicleType}
        </span>
      </div>

      {/* ── Form body ── */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full flex flex-col gap-8 px-4 sm:px-6 py-8"
        style={{ maxWidth: "720px" }}
      >
        {/* 1. Vehicle Info */}
        <Section
          title="Vehicle Information"
          sectionRef={(el) => (sectionsRef.current[0] = el)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div id="field-vehicleNumber">
              <Field
                label="Vehicle Number"
                required
                placeholder="e.g. MH 12 AB 1234"
                value={form.vehicleNumber}
                onChange={set("vehicleNumber")}
                maxLength={15}
                error={errors.vehicleNumber}
              />
            </div>
            <SelectField
              label="Vehicle Type"
              required
              disabled
              options={VEHICLE_TYPES}
              value={form.vehicleType}
              onChange={set("vehicleType")}
            />
          </div>
          <div id="field-violationType">
            <SelectField
              label="Violation Type"
              required
              options={VIOLATION_TYPES}
              value={form.violationType}
              onChange={(e) => {
                set("violationType")(e);
                setErrors((p) => ({ ...p, violationType: "" }));
              }}
              error={errors.violationType}
            />
          </div>
        </Section>

        {/* 2. Location */}
        <Section
          title="Location Details"
          sectionRef={(el) => (sectionsRef.current[1] = el)}
        >
          <div id="field-address">
            <Field
              label="Full Address"
              required
              textarea
              rows={2}
              placeholder="Street, landmark, area…"
              value={form.address}
              onChange={set("address")}
              error={errors.address}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div id="field-city">
              <Field
                label="City"
                required
                placeholder="e.g. Mumbai"
                value={form.city}
                onChange={set("city")}
                error={errors.city}
              />
            </div>
            <div id="field-state">
              <Field
                label="State"
                required
                placeholder="e.g. Maharashtra"
                value={form.state}
                onChange={set("state")}
                error={errors.state}
              />
            </div>
          </div>

          {/* Use My Location */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={locationLoading}
              onClick={async () => {
                if (!navigator.geolocation) {
                  setLocationError("Geolocation not supported.");
                  return;
                }
                setLocationLoading(true);
                setLocationError("");
                navigator.geolocation.getCurrentPosition(
                  async ({ coords: { latitude, longitude } }) => {
                    try {
                      const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
                        { headers: { "Accept-Language": "en" } },
                      );
                      const data = await res.json();
                      const a = data.address || {};
                      const streetParts = [
                        a.house_number,
                        a.road || a.pedestrian || a.footway,
                        a.neighbourhood || a.suburb || a.quarter,
                      ].filter(Boolean);
                      const localityParts = [
                        a.village || a.town || a.city_district,
                        a.postcode,
                      ].filter(Boolean);
                      const fullAddress =
                        [...streetParts, ...localityParts].join(", ") ||
                        data.display_name;
                      const city =
                        a.city ||
                        a.town ||
                        a.village ||
                        a.county ||
                        a.state_district ||
                        "";
                      const state = a.state || "";
                      setForm((p) => ({
                        ...p,
                        address: fullAddress,
                        city,
                        state,
                        latitude: latitude.toFixed(6),
                        longitude: longitude.toFixed(6),
                      }));
                      setErrors((p) => ({
                        ...p,
                        address: "",
                        city: "",
                        state: "",
                      }));
                    } catch {
                      setLocationError(
                        "Could not fetch address. Fill manually.",
                      );
                    } finally {
                      setLocationLoading(false);
                    }
                  },
                  (err) => {
                    setLocationLoading(false);
                    setLocationError(
                      err.code === 1
                        ? "Location access denied. Please allow permission."
                        : "Unable to get location. Try again.",
                    );
                  },
                  { enableHighAccuracy: true, timeout: 10000 },
                );
              }}
              className="flex items-center gap-2 hover:opacity-75 cursor-pointer"
              style={{
                background: locationLoading
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 7,
                color: locationLoading ? "#4b5563" : "#9ca3af",
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(0.72rem, 1.2vw, 0.8rem)",
                fontWeight: 600,
                padding: "0.5rem 1rem",
                width: "fit-content",
                cursor: locationLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {locationLoading ? (
                <>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    style={{ animation: "spin 1s linear infinite" }}
                  >
                    <circle
                      cx="6.5"
                      cy="6.5"
                      r="5"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M6.5 1.5 A5 5 0 0 1 11.5 6.5"
                      stroke="#9ca3af"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Fetching location…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle
                      cx="6.5"
                      cy="6.5"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M6.5 1V3M6.5 10V12M1 6.5H3M10 6.5H12"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  Use My Location
                </>
              )}
            </button>
            {locationError && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.72rem",
                  color: "#f87171",
                  margin: 0,
                }}
              >
                ⚠ {locationError}
              </p>
            )}
            {!locationError && form.address && form.city && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.72rem",
                  color: "#34d399",
                  margin: 0,
                }}
              >
                ✓ Location filled from GPS — you can edit the fields above if
                needed
              </p>
            )}
          </div>
        </Section>

        {/* 3. Incident Details */}
        <Section
          title="Incident Details"
          sectionRef={(el) => (sectionsRef.current[2] = el)}
        >
          <div id="field-description">
            <Field
              label="Description"
              required
              textarea
              rows={4}
              placeholder="Describe what happened in detail…"
              value={form.description}
              onChange={set("description")}
              maxLength={1000}
              error={errors.description}
            />
          </div>
          <div className="flex justify-end">
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.7rem",
                color: "#4b5563",
              }}
            >
              {form.description.length} / 1000
            </span>
          </div>
        </Section>

        {/* 4. Evidence */}
        <Section
          title="Evidence / Media"
          sectionRef={(el) => (sectionsRef.current[3] = el)}
        >
          <MediaUpload files={files} onFiles={setFiles} />
        </Section>

        {/* Submit */}
        <div
          ref={submitRef}
          className="flex flex-col sm:flex-row gap-3 pb-8"
          style={{ opacity: 1 }} // ← always visible
        >
          <button
            type="submit"
            disabled={status === "submitting"}
            className="flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              flex: 1,
              background:
                status === "submitting" ? "rgba(255,255,255,0.7)" : "#ffffff",
              color: "#000000",
              border: "none",
              borderRadius: "8px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.78rem, 1.3vw, 0.9rem)",
              letterSpacing: "0.07em",
              padding: "clamp(0.7rem, 1.5vw, 0.9rem) 2rem",
              cursor: status === "submitting" ? "not-allowed" : "pointer",
            }}
          >
            {status === "submitting" ? (
              <>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  style={{ animation: "spin 1s linear infinite" }}
                >
                  <circle
                    cx="7.5"
                    cy="7.5"
                    r="6"
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="2"
                  />
                  <path
                    d="M7.5 1.5 A6 6 0 0 1 13.5 7.5"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Submitting…
              </>
            ) : (
              <>
                Submit Complaint
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path
                    d="M2.5 7.5H12.5M12.5 7.5L8.5 3.5M12.5 7.5L8.5 11.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-80 active:scale-95"
            style={{
              background: "transparent",
              color: "#6b7280",
              border: "1.5px solid rgba(120,120,130,0.3)",
              borderRadius: "8px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.78rem, 1.3vw, 0.9rem)",
              letterSpacing: "0.07em",
              padding: "clamp(0.7rem, 1.5vw, 0.9rem) 1.5rem",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
