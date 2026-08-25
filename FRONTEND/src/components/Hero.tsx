import { useLanguage } from "@/context/LanguageContext";

interface HeroProps {
  onAnalyzeClick: () => void;
}

export default function Hero({ onAnalyzeClick }: HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative pt-24 pb-20 overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,222,128,1) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5">
        <div className="max-w-2xl">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-800/60 bg-emerald-950/40 text-emerald-400 text-[11px] font-mono tracking-wider uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {t.heroBadge}
          </div>

          <h1 className="font-display text-[40px] sm:text-[50px] leading-[1.1] font-semibold tracking-tight text-white mb-5">
            {t.heroTitle1}{" "}
            <span className="text-emerald-400">{t.heroTitleHighlight}</span>{" "}
            {t.heroTitle2}
          </h1>

          <p className="text-[16px] sm:text-[17px] text-[#8aaa94] leading-relaxed max-w-xl mb-10">
            {t.heroDesc}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={onAnalyzeClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors text-[15px]"
            >
              {t.heroBtnStart}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <a
              href="#diseases"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-[#8aaa94] hover:text-white font-medium rounded-lg transition-colors text-[15px]"
            >
              {t.heroBtnDiseases}
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: "15", label: t.heroStatDiseasesDesc },
            { value: "Swin-T", label: "Model Backbone" },
            { value: t.heroStatLatency, label: t.heroStatLatencyDesc },
            { value: t.heroStatAccuracy, label: t.heroStatAccuracyDesc },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-mono text-xl font-semibold text-white mb-0.5">{stat.value}</div>
              <div className="text-[12px] text-[#5a7a64] uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
