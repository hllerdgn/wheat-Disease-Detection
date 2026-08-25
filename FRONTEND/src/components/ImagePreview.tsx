import { useLanguage } from "@/context/LanguageContext";

interface ImagePreviewProps {
  file: File;
  previewUrl: string;
  onAnalyze: () => void;
  onChangeImage: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImagePreview({
  file,
  previewUrl,
  onAnalyze,
  onChangeImage,
}: ImagePreviewProps) {
  const { t } = useLanguage();

  return (
    <div className="animate-fadeIn">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
        {/* Image */}
        <div className="relative bg-[#0a120c]">
          <img
            src={previewUrl}
            alt="Wheat image ready for analysis"
            className="w-full max-h-[380px] object-contain block mx-auto"
          />
          <button
            onClick={onChangeImage}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/50 hover:bg-black/70 border border-white/10 text-[#8aaa94] hover:text-white transition-colors"
            aria-label={t.previewBtnChange}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 7C1 3.7 3.7 1 7 1C9.2 1 11.1 2.1 12.2 3.8"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M13 7C13 10.3 10.3 13 7 13C4.8 13 2.9 11.9 1.8 10.2"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M11 1L13 4L10 4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 13L1 10L4 10"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* File meta */}
        <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <p className="text-[13px] text-white font-medium truncate">{file.name}</p>
            <p className="text-[11px] font-mono text-[#5a7a64] mt-0.5">{formatBytes(file.size)}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onChangeImage}
              className="px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 text-[#8aaa94] hover:text-white text-[13px] transition-colors"
            >
              {t.previewBtnChange}
            </button>
            <button
              onClick={onAnalyze}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-medium transition-colors flex items-center gap-2"
            >
              {t.previewBtnRun}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7H12M12 7L8 3M12 7L8 11"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
