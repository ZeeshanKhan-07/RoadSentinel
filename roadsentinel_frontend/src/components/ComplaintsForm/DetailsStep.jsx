import Section from "./Section";
import Field from "./Field";
import SelectField from "./SelectField";
import { VIOLATION_TYPES, VEHICLE_TYPES } from "../../constants/complaintOptions";
export default function DetailsStep({
  sectionRefs, // [vehicleSectionRef, locationSectionRef, incidentSectionRef]
  form,
  set,
  errors,
  status,
  plateAutoFilled,
  locationLoading,
  locationError,
  onUseMyLocation,
  onBackToEvidence,
  onSubmit,
}) {
  const [vehicleSectionRef, locationSectionRef, incidentSectionRef] = sectionRefs;

  return (
    <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-8">
      {/* 1. Vehicle Info */}
      <Section title="Vehicle Information" sectionRef={vehicleSectionRef}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            {plateAutoFilled && (
              <p className="mt-[0.3rem] font-['Inter',sans-serif] text-[0.72rem] text-emerald-400">
                ✓ Auto-filled from your photo — edit if it's not quite right
              </p>
            )}
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
            onChange={set("violationType")}
            error={errors.violationType}
          />
        </div>
      </Section>

      {/* 2. Location */}
      <Section title="Location Details" sectionRef={locationSectionRef}>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={locationLoading}
            onClick={onUseMyLocation}
            className={[
              "flex w-fit items-center gap-2 rounded-[7px] border border-white/10 px-4 py-2",
              "font-['Inter',sans-serif] text-[clamp(0.72rem,1.2vw,0.8rem)] font-semibold transition-all duration-200",
              locationLoading
                ? "cursor-not-allowed bg-white/[0.02] text-gray-600"
                : "cursor-pointer bg-white/[0.04] text-gray-400 hover:opacity-75",
            ].join(" ")}
          >
            {locationLoading ? (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  className="animate-spin"
                >
                  <circle cx="6.5" cy="6.5" r="5" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
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
                  <circle cx="6.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.4" />
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
            <p className="m-0 font-['Inter',sans-serif] text-[0.72rem] text-red-400">
              ⚠ {locationError}
            </p>
          )}
          {!locationError && form.address && form.city && (
            <p className="m-0 font-['Inter',sans-serif] text-[0.72rem] text-emerald-400">
              ✓ Location filled from GPS — you can edit the fields above if
              needed
            </p>
          )}
        </div>
      </Section>

      {/* 3. Incident Details */}
      <Section title="Incident Details" sectionRef={incidentSectionRef}>
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
          <span className="font-['Inter',sans-serif] text-[0.7rem] text-gray-600">
            {form.description.length} / 1000
          </span>
        </div>
      </Section>

      {/* Submit */}
      <div className="flex flex-col gap-3 pb-8 sm:flex-row">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={[
            "flex flex-1 items-center justify-center gap-2 rounded-lg border-none px-8 py-[clamp(0.7rem,1.5vw,0.9rem)]",
            "font-['Inter',sans-serif] text-[clamp(0.78rem,1.3vw,0.9rem)] font-bold uppercase tracking-[0.07em] text-black",
            "transition-all duration-200 hover:opacity-90 active:scale-95",
            status === "submitting" ? "cursor-not-allowed bg-white/70" : "cursor-pointer bg-white",
          ].join(" ")}
        >
          {status === "submitting" ? (
            <>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                className="animate-spin"
              >
                <circle cx="7.5" cy="7.5" r="6" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
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
          onClick={onBackToEvidence}
          className="flex items-center justify-center gap-2 rounded-lg border-[1.5px] border-[rgba(120,120,130,0.3)] bg-transparent px-6 py-[clamp(0.7rem,1.5vw,0.9rem)] font-['Inter',sans-serif] text-[clamp(0.78rem,1.3vw,0.9rem)] font-bold uppercase tracking-[0.07em] text-gray-500 transition-all duration-200 hover:opacity-80 active:scale-95"
        >
          Back to Evidence
        </button>
      </div>
    </form>
  );
}