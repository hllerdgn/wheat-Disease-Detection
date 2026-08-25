import { AnalyzeResponse } from "@/types/prediction";
import { getDiseaseInfo, SEVERITY_CONFIG } from "@/data/diseases";
import { useLanguage } from "@/context/LanguageContext";

interface PredictionResultProps {
  result: AnalyzeResponse;
  previewUrl: string;
  onReset: () => void;
}

function ConfidenceRing({ value, label }: { value: number; label: string }) {
  const pct = Math.round(value * 100);
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke={pct > 80 ? "#4ade80" : pct > 50 ? "#fbbf24" : "#f87171"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-lg font-semibold text-white leading-none">{pct}%</span>
        <span className="text-[9px] text-[#5a7a64] mt-0.5 uppercase tracking-wide">{label}</span>
      </div>
    </div>
  );
}

export default function PredictionResult({ result, previewUrl, onReset }: PredictionResultProps) {
  const { language, t } = useLanguage();
  const fallbackDisease = getDiseaseInfo(result.classification.predicted_class);
  const backendInfo = result.disease_info;

  // Dil seçimine göre isim ve başlık ayarı
  let displayName = "";
  if (language === "tr") {
    displayName = backendInfo
      ? `${backendInfo.name_tr} (${backendInfo.name})`
      : fallbackDisease.displayName;
  } else {
    displayName = backendInfo
      ? `${backendInfo.name} (${backendInfo.scientific_name})`
      : fallbackDisease.displayName;
  }

  if (!result.classification.is_certain && backendInfo) {
    displayName += language === "tr" ? " — Şüpheli / Düşük Kesinlik" : " — Uncertain / Suspicious";
  }

  const scientificName = backendInfo?.scientific_name || fallbackDisease.shortDesc;
  const description =
    language === "tr"
      ? backendInfo?.description || fallbackDisease.description
      : fallbackDisease.description || backendInfo?.description;

  const severityCategory = backendInfo?.severity || fallbackDisease.severity;
  const sev = SEVERITY_CONFIG[severityCategory] || SEVERITY_CONFIG.disease;
  const processingMs = result.meta.processing_time_ms.toFixed(0);

  const symptoms = backendInfo?.symptoms || [];
  const culturalTreatments = backendInfo?.cultural_treatment || [];
  const chemicalTreatments = backendInfo?.chemical_treatment || [];
  const fallbackSolutionSteps = fallbackDisease.solution
    ? fallbackDisease.solution.split("\n").filter((s) => s.trim())
    : [];

  const statusBadgeText =
    severityCategory === "healthy"
      ? t.resultHealthyBadge
      : !result.classification.is_certain
      ? t.resultUncertainBadge
      : t.resultCertainBadge;

  return (
    <div className="animate-fadeIn space-y-5">
      {/* Main result card */}
      <div className={`rounded-2xl border ${sev.border} ${sev.bg} overflow-hidden`}>
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Image thumbnail */}
            <div className="sm:w-48 shrink-0">
              <img
                src={previewUrl}
                alt="Analyzed wheat image"
                className="w-full sm:w-48 h-40 sm:h-full object-cover rounded-xl"
              />
            </div>

            {/* Prediction info */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              {/* Status badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${sev.border} ${sev.bg} w-fit`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    severityCategory === "healthy"
                      ? "bg-emerald-400"
                      : severityCategory === "warning"
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                />
                <span className={`text-[11px] font-mono uppercase tracking-wider ${sev.color}`}>
                  {statusBadgeText}
                  {backendInfo?.risk_level && severityCategory !== "healthy"
                    ? ` · ${backendInfo.risk_level.toUpperCase()} RISK`
                    : ""}
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight">
                  {displayName}
                </h2>
                {scientificName && (
                  <p className="text-[13px] font-mono text-[#5a7a64] mt-1 italic">
                    {scientificName}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-6">
                <ConfidenceRing
                  value={result.classification.confidence}
                  label={t.resultConfidence}
                />
                <div className="space-y-1.5">
                  {!result.classification.is_certain && (
                    <p className="text-[12px] text-amber-400 flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1L11 10H1L6 1Z" stroke="currentColor" strokeWidth="1.1" />
                        <path
                          d="M6 5V7M6 8.5V8.6"
                          stroke="currentColor"
                          strokeWidth="1.1"
                          strokeLinecap="round"
                        />
                      </svg>
                      {t.resultUncertainWarn}
                    </p>
                  )}
                  {result.quality.warnings.length > 0 && (
                    <p className="text-[12px] text-amber-400">{result.quality.warnings[0]}</p>
                  )}
                  <p className="text-[11px] font-mono text-[#4a6a54]">
                    {t.resultAnalysisTime}: {processingMs} ms
                  </p>
                </div>
              </div>

              {/* Top3 */}
              {result.classification.top3_predictions?.length > 0 && (
                <div className="pt-3 border-t border-white/[0.06]">
                  <p className="text-[11px] text-[#4a6a54] uppercase tracking-wide mb-2">
                    {t.resultTopPredictions}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.classification.top3_predictions.map((p) => {
                      const scoreVal = p.score ?? (p as any).confidence ?? 0;
                      return (
                        <span
                          key={p.class}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-[11px] font-mono text-[#8aaa94]"
                        >
                          {p.class} · {(scoreVal * 100).toFixed(1)}%
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Semptomlar (Eğer varsa) */}
      {symptoms.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
          <h3 className="text-[13px] text-[#5a7a64] uppercase tracking-wider font-mono mb-3">
            {t.resultSymptomsTitle}
          </h3>
          <ul className="grid sm:grid-cols-2 gap-2 text-[14px] text-[#c0d4c8]">
            {symptoms.map((sym, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{sym}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* About disease */}
      {description && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
          <h3 className="text-[13px] text-[#5a7a64] uppercase tracking-wider font-mono mb-3">
            {t.resultAboutTitle}
          </h3>
          <p className="text-[15px] text-[#c0d4c8] leading-relaxed">{description}</p>
        </div>
      )}

      {/* Recommended action + solution */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Kültürel Önlemler */}
        {(culturalTreatments.length > 0 || fallbackDisease.action) && (
          <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-950 border border-amber-800/50 flex items-center justify-center shrink-0">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="text-amber-400">
                  <path d="M6.5 1L12 11H1L6.5 1Z" stroke="currentColor" strokeWidth="1.2" />
                  <path
                    d="M6.5 5V7.5M6.5 9V9.1"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-[13px] text-amber-400 font-medium">
                {t.resultCulturalTitle}
              </h3>
            </div>
            {culturalTreatments.length > 0 ? (
              <ul className="space-y-1.5 text-[13px] text-[#c0a44a] leading-relaxed">
                {culturalTreatments.map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-mono text-amber-500 shrink-0">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[14px] text-[#c0a44a] leading-relaxed">{fallbackDisease.action}</p>
            )}
          </div>
        )}

        {/* Kimyasal / Fungisit Mücadele */}
        {(chemicalTreatments.length > 0 || fallbackSolutionSteps.length > 0) && (
          <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800/50 flex items-center justify-center shrink-0">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="text-emerald-400">
                  <path
                    d="M2 7.5L5 10.5L11 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-[13px] text-emerald-400 font-medium">
                {t.resultChemicalTitle}
              </h3>
            </div>
            {chemicalTreatments.length > 0 ? (
              <ul className="space-y-1.5 text-[13px] text-[#7aaa84] leading-relaxed">
                {chemicalTreatments.map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-mono text-emerald-500 shrink-0">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ol className="space-y-1.5 text-[13px] text-[#7aaa84] leading-relaxed">
                {fallbackSolutionSteps.map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-mono text-emerald-700 shrink-0">{i + 1}.</span>
                    <span>{step.replace(/^\d+\.\s*/, "")}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>

      {/* Analyze another */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-[#8aaa94] hover:text-white rounded-lg text-[14px] transition-colors"
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
          </svg>
          {t.resultBtnNewAnalysis}
        </button>
      </div>
    </div>
  );
}
