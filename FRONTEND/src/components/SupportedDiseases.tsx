import { DISEASE_KNOWLEDGE, SEVERITY_CONFIG } from "@/data/diseases";
import { useLanguage } from "@/context/LanguageContext";

const DISEASES_ORDER = [
  "healthy",
  "yellow rust",
  "brown rust",
  "black rust",
  "fusarium head blight",
  "mildew",
  "septoria",
  "smut",
  "blast",
  "leaf blight",
  "common root rot",
  "tan spot",
  "aphid",
  "mite",
  "stem fly",
];

const TR_DISEASE_NAMES: Record<string, string> = {
  healthy: "Sağlıklı Doku (Healthy)",
  "yellow rust": "Sarı Pas / Çizgi Pası (Yellow Rust)",
  "brown rust": "Kahverengi Pas (Brown Rust)",
  "black rust": "Kara Pas / Gövde Pası (Black Rust)",
  "fusarium head blight": "Fusarium Başak Yanıklığı (FHB)",
  mildew: "Külleme (Powdery Mildew)",
  septoria: "Septorya Yaprak Lekesi (Septoria)",
  smut: "Rastık (Smut)",
  blast: "Buğday Yanıklığı (Wheat Blast)",
  "leaf blight": "Yaprak Yanıklığı (Leaf Blight)",
  "common root rot": "Kök ve Kök Boğazı Çürüklüğü",
  "tan spot": "Sarı Leke Hastalığı (Tan Spot)",
  aphid: "Yaprak Biti / Afid (Aphid)",
  mite: "Kırmızı Örümcek / Akar (Mite)",
  "stem fly": "Ekin Sap Arısı / Sap Sineği",
};

export default function SupportedDiseases() {
  const { language, t } = useLanguage();

  return (
    <section id="diseases" className="py-20 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-5">
        <div className="mb-10">
          <p className="text-[11px] font-mono text-[#4a6a54] uppercase tracking-widest mb-2">
            {t.supportedBadge}
          </p>
          <h2 className="font-display text-[28px] font-semibold text-white tracking-tight">
            {t.supportedTitle}
          </h2>
          <p className="mt-2 text-[15px] text-[#5a7a64] max-w-xl">
            {t.supportedDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DISEASES_ORDER.map((key) => {
            const d = DISEASE_KNOWLEDGE[key];
            if (!d) return null;
            const sev = SEVERITY_CONFIG[d.severity];
            const title = language === "tr" ? TR_DISEASE_NAMES[key] || d.displayName : d.displayName;

            return (
              <div
                key={key}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] p-4 flex items-start gap-3 transition-colors"
              >
                <span
                  className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                    d.severity === "healthy"
                      ? "bg-emerald-400"
                      : d.severity === "warning"
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-[14px] text-white font-medium leading-tight">{title}</p>
                  {d.shortDesc && (
                    <p className="text-[11px] font-mono text-[#4a6a54] mt-0.5 italic">{d.shortDesc}</p>
                  )}
                  <span
                    className={`mt-1.5 inline-block text-[10px] font-mono uppercase tracking-wide ${sev.color}`}
                  >
                    {language === "tr"
                      ? d.severity === "healthy"
                        ? "Sağlıklı"
                        : d.severity === "warning"
                        ? "Zararlı / Kök"
                        : "Fungal Hastalık"
                      : sev.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-5 text-[12px] text-[#5a7a64]">
          {[
            { dot: "bg-emerald-400", label: language === "tr" ? "Sağlıklı Bitki" : "Healthy" },
            { dot: "bg-amber-400", label: language === "tr" ? "Zararlı / Akar / Kök" : "Pest / Root Condition" },
            { dot: "bg-red-400", label: language === "tr" ? "Mantar / Fungal Hastalık" : "Fungal Disease" },
          ].map((l) => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${l.dot}`} />
              {l.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
