import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import useAuth from "../../auth/store";
// ^ adjust these two import paths to match wherever you drop this folder

import SuccessScreen from "../../components/ComplaintsForm/SuccessScreen";
import ErrorScreen from "../../components/ComplaintsForm/ErrorScreen";
import EvidenceStep from "../../components/ComplaintsForm/EvidenceSlide";
import DetailsStep from "../../components/ComplaintsForm/DetailsStep";
import useGeolocation from "../../hooks/useGeolocation";
import { extractPlateFromFiles } from "../../services/plateExtractionService"; 
import { registerComplaint, buildComplaintFormData } from "../../services/complaintService";

export default function ComplaintForm({ vehicleType = "car", onBack }) {
  const wrapperRef = useRef(null);
  const headerRef = useRef(null);
  const evidenceSectionRef = useRef(null);
  const detailSectionsRef = useRef([null, null, null]);

  const userId = useAuth((state) => state.user?.id);

  // "idle" | "submitting" | "success" | "error"
  const [status, setStatus] = useState("idle");
  const [step, setStep] = useState(1); // 1 = evidence, 2 = details
  const [files, setFiles] = useState([]);
  const [extracting, setExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState("");
  const [plateAutoFilled, setPlateAutoFilled] = useState(false);
  const [errors, setErrors] = useState({});

  const { loading: locationLoading, error: locationError, fetchLocation } = useGeolocation();

  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType,
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
    setErrors((p) => ({ ...p, [key]: "" }));
    if (key === "vehicleNumber") setPlateAutoFilled(false);
  };

  // ── GSAP entrance, re-runs whenever the visible step changes ──
  useEffect(() => {
    if (status !== "idle") return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(headerRef.current, { y: -28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 });

      const targets =
        step === 1
          ? [evidenceSectionRef.current].filter(Boolean)
          : [...detailSectionsRef.current].filter(Boolean);

      tl.fromTo(
        targets,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 },
        "-=0.2",
      );
    }, wrapperRef);
    return () => ctx.revert();
  }, [status, step]);

  // ── Step 1 -> Step 2: auto-extract plate, then advance ────────
  const handleContinueFromEvidence = async () => {
    setExtracting(true);
    setExtractionError("");
    try {
      const result = await extractPlateFromFiles(files);
      setForm((p) => ({ ...p, vehicleNumber: result.primary_plate_number }));
      setPlateAutoFilled(true);
      setStep(2);
    } catch (err) {
      // Log the real error so it's visible in devtools — a "Failed to fetch"
      // here almost always means the extraction API isn't sending CORS
      // headers back to the browser, not that the request failed server-side.
      console.error("Plate extraction failed:", err);
      setExtractionError(err.message || "Could not read the number plate automatically.");
      setPlateAutoFilled(false);
      // Stay on step 1 so the error is actually visible instead of silently
      // advancing to a step-2 form with an empty vehicle number field.
    } finally {
      setExtracting(false);
    }
  };

  const handleSkipExtraction = () => {
    setExtractionError("");
    setStep(2);
  };

  const handleUseMyLocation = async () => {
    try {
      const { address, city, state, latitude, longitude } = await fetchLocation();
      setForm((p) => ({ ...p, address, city, state, latitude, longitude }));
      setErrors((p) => ({ ...p, address: "", city: "", state: "" }));
    } catch {
      // error message is already surfaced by useGeolocation
    }
  };

  // ── Validation (step 2 fields) ─────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.vehicleNumber.trim()) e.vehicleNumber = "Vehicle number is required.";
    if (!form.violationType) e.violationType = "Please select a violation type.";
    if (!form.address.trim()) e.address = "Address is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.state.trim()) e.state = "State is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    return e;
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstKey = Object.keys(validationErrors)[0];
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("submitting");
    const formData = buildComplaintFormData({ form, files, userId });
    const { error } = await registerComplaint(formData);

    if (error) {
      console.error("Submission error details:", error);
      setStatus("error");
      return;
    }
    setStatus("success");
  };

  if (status === "success") return <SuccessScreen />;
  if (status === "error") return <ErrorScreen onRetry={() => setStatus("idle")} />;

  return (
    <div
      ref={wrapperRef}
      className="flex min-h-screen w-full flex-col items-center bg-[#080808] font-['Inter',sans-serif]"
    >
      {/* Body */}
      <div className="flex w-full max-w-[720px] flex-col gap-8 px-4 py-15 sm:px-6">
        {step === 1 ? (
          <EvidenceStep
            sectionRef={evidenceSectionRef}
            files={files}
            setFiles={setFiles}
            extracting={extracting}
            extractionError={extractionError}
            onContinue={handleContinueFromEvidence}
            onSkip={handleSkipExtraction}
          />
        ) : (
          <DetailsStep
            sectionRefs={[
              (el) => (detailSectionsRef.current[0] = el),
              (el) => (detailSectionsRef.current[1] = el),
              (el) => (detailSectionsRef.current[2] = el),
            ]}
            form={form}
            set={set}
            errors={errors}
            status={status}
            plateAutoFilled={plateAutoFilled}
            locationLoading={locationLoading}
            locationError={locationError}
            onUseMyLocation={handleUseMyLocation}
            onBackToEvidence={() => setStep(1)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}