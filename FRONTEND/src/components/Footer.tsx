import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="text-[14px] text-white font-semibold mb-1">Wheat Disease Detection</p>
          <p className="text-[13px] text-[#4a6a54]">{t.footerDesc}</p>
          <p className="text-[11px] font-mono text-[#3a5a44] mt-2">
            PyTorch · Swin Transformer · FastAPI · {t.footerRights}
          </p>
        </div>

        <a
          href="https://github.com/hllerdgn/wheat-Disease-Detection"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 text-[#8aaa94] hover:text-white text-[13px] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7 0.5C3.41 0.5 0.5 3.41 0.5 7C0.5 9.87 2.32 12.3 4.88 13.19C5.2 13.25 5.32 13.06 5.32 12.9C5.32 12.75 5.31 12.26 5.31 11.73C3.75 12.09 3.38 11.12 3.38 11.12C3.08 10.35 2.66 10.14 2.66 10.14C2.08 9.75 2.7 9.75 2.7 9.75C3.33 9.8 3.67 10.41 3.67 10.41C4.25 11.4 5.19 11.12 5.35 10.96C5.41 10.54 5.58 10.27 5.77 10.11C4.38 9.95 2.93 9.41 2.93 7.04C2.93 6.31 3.19 5.71 3.67 5.24C3.6 5.08 3.37 4.39 3.74 3.46C3.74 3.46 4.28 3.29 5.31 4.17C5.79 4.04 6.29 3.97 6.8 3.97C7.31 3.97 7.82 4.04 8.3 4.17C9.33 3.28 9.87 3.46 9.87 3.46C10.24 4.39 10.01 5.08 9.94 5.24C10.43 5.71 10.69 6.31 10.69 7.04C10.69 9.41 9.23 9.95 7.83 10.11C8.07 10.31 8.29 10.71 8.29 11.33C8.29 12.22 8.28 12.74 8.28 12.9C8.28 13.06 8.4 13.25 8.72 13.19C11.28 12.3 13.1 9.87 13.1 7C13.5 3.41 10.59 0.5 7 0.5Z"
              fill="currentColor"
            />
          </svg>
          GitHub Repository
        </a>
      </div>
    </footer>
  );
}
