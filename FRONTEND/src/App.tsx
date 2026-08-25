import { useEffect, useState, useRef } from "react";
import { checkHealth } from "@/services/api";
import { usePrediction } from "@/hooks/usePrediction";
import { useLanguage } from "@/context/LanguageContext";
import type { ApiStatus } from "@/types/prediction";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ImageUploader from "@/components/ImageUploader";
import ImagePreview from "@/components/ImagePreview";
import AnalysisLoader from "@/components/AnalysisLoader";
import PredictionResult from "@/components/PredictionResult";
import SupportedDiseases from "@/components/SupportedDiseases";
import HowItWorks from "@/components/HowItWorks";
import TechStack from "@/components/TechStack";
import Footer from "@/components/Footer";

export default function App() {
  const { t } = useLanguage();
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const detectionRef = useRef<HTMLDivElement>(null);

  const {
    appState,
    file,
    previewUrl,
    result,
    error,
    analysisStep,
    analysisSteps,
    selectFile,
    analyze,
    reset,
    changeImage,
  } = usePrediction();

  // Poll API health
  useEffect(() => {
    let mounted = true;
    async function ping() {
      try {
        const h = await checkHealth();
        if (mounted) setApiStatus(h.status === "ok" && h.pipeline_ready ? "online" : "offline");
      } catch {
        if (mounted) setApiStatus("offline");
      }
    }
    ping();
    const id = setInterval(ping, 30_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  function scrollToDetection() {
    detectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-[#080e0a] text-[#e2e8e4]">
      <Header apiStatus={apiStatus} onAnalyzeClick={scrollToDetection} />

      <main>
        <Hero onAnalyzeClick={scrollToDetection} />

        {/* Detection section */}
        <section id="detection" ref={detectionRef} className="py-16 border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-5">
            <div className="mb-8">
              <p className="text-[11px] font-mono text-[#4a6a54] uppercase tracking-widest mb-2">
                {t.secDetectionBadge}
              </p>
              <h2 className="font-display text-[28px] font-semibold text-white tracking-tight">
                {t.secDetectionTitle}
              </h2>
              <p className="mt-1 text-[14px] text-[#5a7a64] max-w-xl">
                {t.secDetectionDesc}
              </p>
            </div>

            <div className="max-w-2xl">
              {appState === "idle" && <ImageUploader onFileSelect={selectFile} />}

              {appState === "preview" && file && previewUrl && (
                <ImagePreview
                  file={file}
                  previewUrl={previewUrl}
                  onAnalyze={analyze}
                  onChangeImage={changeImage}
                />
              )}

              {appState === "analyzing" && (
                <AnalysisLoader steps={analysisSteps} currentStep={analysisStep} />
              )}

              {appState === "result" && result && previewUrl && (
                <PredictionResult result={result} previewUrl={previewUrl} onReset={reset} />
              )}

              {appState === "error" && (
                <div className="animate-fadeIn rounded-2xl border border-red-800/40 bg-red-950/20 p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-950 border border-red-800/50 flex items-center justify-center mx-auto">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-red-400">
                      <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.4" />
                      <path
                        d="M10 6V10.5M10 13V13.1"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-[15px] mb-1">{t.errorTitle}</p>
                    <p className="text-[13px] text-[#c08080]">{error}</p>
                  </div>
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-white/20 text-[#8aaa94] hover:text-white rounded-lg text-[14px] transition-colors"
                  >
                    {t.errorTryAgain}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <HowItWorks />
        <SupportedDiseases />
        <TechStack />
      </main>

      <Footer />
    </div>
  );
}
