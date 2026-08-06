import { useCallback, useRef, useState } from "react";
import Label from "./Label";

export default function MediaUpload({ files, onFiles }) {
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
  const removeFile = (idx) => onFiles((prev) => prev.filter((_, i) => i !== idx));
  const formatSize = (b) =>
    b < 1024 * 1024 ? (b / 1024).toFixed(0) + " KB" : (b / (1024 * 1024)).toFixed(1) + " MB";
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
        className={[
          "rounded-[10px] border-2 border-dashed p-[clamp(1.2rem,3vw,2rem)] text-center transition-colors duration-200",
          dragOver
            ? "border-white/50 bg-white/[0.04]"
            : "border-[rgba(120,120,130,0.3)] bg-white/[0.02]",
        ].join(" ")}
      >
        <div className="mb-3 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06]">
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

        <p className="mb-3 font-grotesk text-[clamp(0.78rem,1.3vw,0.88rem)] text-gray-400">
          Drag & drop images or videos here, or
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer font-display items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.08] px-4 py-[0.45rem] font-['Inter',sans-serif] text-[clamp(0.72rem,1.2vw,0.8rem)] font-semibold text-gray-200 transition-all duration-200 hover:opacity-80 active:scale-95"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
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
            className="flex cursor-pointer font-display items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.08] px-4 py-[0.45rem] font-['Inter',sans-serif] text-[clamp(0.72rem,1.2vw,0.8rem)] font-semibold text-gray-200 transition-all duration-200 hover:opacity-80 active:scale-95"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 4.5C1 3.7 1.7 3 2.5 3H3.5L4.5 1.5H9.5L10.5 3H11.5C12.3 3 13 3.7 13 4.5V11C13 11.8 12.3 12.5 11.5 12.5H2.5C1.7 12.5 1 11.8 1 11V4.5Z"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <circle cx="7" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.4" />
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
                  className="group relative aspect-square overflow-hidden rounded-lg bg-[#111]"
                >
                  {isVideo(file) ? (
                    <video src={url} muted className="h-full w-full object-cover" />
                  ) : (
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="flex h-[26px] w-[26px] items-center justify-center rounded-full border-none bg-red-500 text-white"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
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
                    <div className="absolute bottom-1 left-1 rounded bg-black/70 px-[5px] py-px font-['Inter',sans-serif] text-[0.6rem] text-gray-200">
                      VIDEO
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 rounded bg-black/60 px-[5px] py-px font-['Inter',sans-serif] text-[0.6rem] text-gray-400">
                    {formatSize(file.size)}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-2 font-['Inter',sans-serif] text-[0.72rem] text-gray-500">
            {files.length} file{files.length > 1 ? "s" : ""} selected · Hover to remove
          </p>
        </>
      )}
    </div>
  );
}