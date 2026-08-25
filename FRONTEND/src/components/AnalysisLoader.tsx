import { useLanguage } from "@/context/LanguageContext";

interface AnalysisLoaderProps {
  steps: string[];
  currentStep: number;
}

export default function AnalysisLoader({ steps, currentStep }: AnalysisLoaderProps) {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-14 gap-8 animate-fadeIn">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <svg className="animate-spin w-16 h-16" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" stroke="rgba(74,222,128,0.1)" strokeWidth="4" />
          <path
            d="M32 4C32 4 48 8 56 20"
            stroke="#4ade80"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-emerald-400">
            <rect x="3" y="3" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.6" />
            <rect x="11" y="3" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.4" />
            <rect x="3" y="11" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.4" />
            <rect x="11" y="11" width="6" height="6" rx="1" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className="text-center">
        <p className="text-white font-medium text-[16px] mb-1">
          {language === "tr" ? "Buğday görseli analiz ediliyor..." : "Analyzing wheat image..."}
        </p>
        <p className="text-[13px] font-mono text-emerald-400">{steps[currentStep]}</p>
      </div>

      {/* Step progress */}
      <div className="w-full max-w-xs flex flex-col gap-2">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-500 ${
                i < currentStep
                  ? "bg-emerald-600 border-emerald-600"
                  : i === currentStep
                  ? "border-emerald-400 bg-emerald-950"
                  : "border-white/10 bg-transparent"
              }`}
            >
              {i < currentStep && (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path
                    d="M1.5 4L3 5.5L6.5 2.5"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {i === currentStep && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </div>
            <span
              className={`text-[12px] transition-colors duration-300 ${
                i <= currentStep ? "text-[#8aaa94]" : "text-[#3a5a44]"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
