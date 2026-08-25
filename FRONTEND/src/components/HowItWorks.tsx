import { useLanguage } from "@/context/LanguageContext";

export default function HowItWorks() {
  const { t } = useLanguage();

  const STEPS = [
    {
      num: "01",
      title: t.step1Title,
      desc: t.step1Desc,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-emerald-400">
          <path
            d="M10 13V3M10 3L6 7M10 3L14 7"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 15V17C3 17.6 3.4 18 4 18H16C16.6 18 17 17.6 17 17V15"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      num: "02",
      title: t.step2Title,
      desc: t.step2Desc,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-emerald-400">
          <rect x="2" y="2" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
          <rect x="11" y="2" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
          <rect x="2" y="11" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
          <rect x="11" y="11" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      ),
    },
    {
      num: "03",
      title: t.step3Title,
      desc: t.step3Desc,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-emerald-400">
          <path
            d="M4 10.5L8 14.5L16 6.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-5">
        <div className="mb-12">
          <p className="text-[11px] font-mono text-[#4a6a54] uppercase tracking-widest mb-2">
            {t.howItWorksBadge}
          </p>
          <h2 className="font-display text-[28px] font-semibold text-white tracking-tight">
            {t.howItWorksTitle}
          </h2>
          <p className="mt-2 text-[15px] text-[#5a7a64] max-w-xl">{t.howItWorksDesc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-7 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-white/[0.06]" />

          {STEPS.map((step) => (
            <div key={step.num} className="relative">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center mb-5">
                {step.icon}
              </div>
              <div className="font-mono text-[11px] text-emerald-600 uppercase tracking-widest mb-2">
                {step.num}
              </div>
              <h3 className="text-[18px] font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-[14px] text-[#5a7a64] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
