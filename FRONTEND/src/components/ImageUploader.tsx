import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
}

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp"];
const MAX_BYTES = 25 * 1024 * 1024;

export default function ImageUploader({ onFileSelect }: ImageUploaderProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  function validate(file: File): string | null {
    if (!ACCEPTED.includes(file.type)) {
      return "Lütfen geçerli bir resim formatı yükleyin (JPG, PNG, WEBP).";
    }
    if (file.size > MAX_BYTES) {
      return "Görsel boyutu çok büyük (Maksimum 25 MB).";
    }
    return null;
  }

  function handleFile(file: File) {
    const err = validate(file);
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError(null);
    onFileSelect(file);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload wheat image"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          relative flex flex-col items-center justify-center gap-5
          border-2 border-dashed rounded-2xl cursor-pointer
          px-8 py-16 text-center transition-all duration-200
          ${
            isDragging
              ? "border-emerald-500 bg-emerald-950/30"
              : "border-white/[0.1] hover:border-white/[0.2] bg-white/[0.02] hover:bg-white/[0.04]"
          }
        `}
      >
        <UploadIcon />

        <div>
          <p className="text-white font-medium text-[16px] mb-1">
            {isDragging ? t.uploadDragActive : t.uploadTitle}
          </p>
          <p className="text-[13px] text-[#5a7a64]">{t.uploadSubtitle}</p>
        </div>

        <p className="text-[12px] text-[#4a6a54] max-w-xs">{t.uploadLimits}</p>

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.bmp"
          className="sr-only"
          onChange={onInputChange}
          aria-label="File upload"
        />
      </div>

      {validationError && (
        <p role="alert" className="mt-3 text-[13px] text-red-400 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" />
            <path
              d="M7 4.5V7.5M7 9.5V9.6"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          {validationError}
        </p>
      )}
    </div>
  );
}

function UploadIcon() {
  return (
    <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M11 15V4M11 4L7 8M11 4L15 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 14V17C3 17.5523 3.44772 18 4 18H18C18.5523 18 19 17.5523 19 17V14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
