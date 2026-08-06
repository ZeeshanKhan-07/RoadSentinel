import Section from "./Section";
import MediaUpload from "./MediaUpload";

export default function EvidenceStep({
  sectionRef,
  files,
  setFiles,
  extracting,
  extractionError,
  onContinue,
}) {
  return (
    <>
      <Section title="Evidence / Media" sectionRef={sectionRef}>
        <MediaUpload files={files} onFiles={setFiles} />
        {extractionError && (
          <p className="font-['Inter',sans-serif] text-[0.72rem] text-red-400">
            ⚠ {extractionError} You can still continue and enter the vehicle
            number manually.
          </p>
        )}
      </Section>

      <div className="flex flex-col gap-2 pb-8 sm:flex-row">
        <button
          type="button"
          disabled={files.length === 0 || extracting}
          onClick={onContinue}
          className={[
            "flex flex-1 items-center justify-center gap-2 rounded-lg border-none px-8 py-[clamp(0.7rem,1.5vw,0.9rem)]",
            "font-display text-[clamp(0.78rem,1.3vw,0.9rem)] font-bold uppercase tracking-[0.07em] text-black",
            "transition-all duration-200 hover:opacity-90 active:scale-95",
            files.length === 0 || extracting
              ? "cursor-not-allowed bg-white/70"
              : "cursor-pointer bg-white",
          ].join(" ")}
        >
          {extracting ? (
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
              Reading number plate…
            </>
          ) : (
            <>
              Continue
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
      </div>
      {files.length === 0 && (
        <p className="-mt-4 pb-8 font-grotesk text-[0.72rem] text-gray-500">
          Upload at least one photo of the vehicle to continue — we'll try to
          read the number plate automatically.
        </p>
      )}
    </>
  );
}