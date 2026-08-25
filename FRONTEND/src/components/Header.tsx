import { ApiStatus } from "@/types/prediction";
import { useLanguage } from "@/context/LanguageContext";

interface HeaderProps {
  apiStatus: ApiStatus;
  onAnalyzeClick: () => void;
}

export default function Header({ apiStatus, onAnalyzeClick }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();

  const STATUS_CONFIG = {
    checking: { dot: "bg-amber-400 animate-pulse", label: t.statusConnecting },
    online: { dot: "bg-emerald-400", label: t.statusOnline },
    offline: { dot: "bg-red-400", label: t.statusOffline },
  };

  const status = STATUS_CONFIG[apiStatus];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080e0a]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-4 sm:gap-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 shrink-0">
          <WheatIcon />
          <span className="font-display font-semibold text-[15px] tracking-tight text-white">
            Wheat<span className="text-emerald-400">AI</span>
          </span>
        </a>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] text-[#8aaa94]">
          <a href="#detection" className="hover:text-white transition-colors">
            {t.navDetection}
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            {t.navHowItWorks}
          </a>
          <a href="#diseases" className="hover:text-white transition-colors">
            {t.navDiseases}
          </a>
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-3 shrink-0">
          {/* TR / EN Language Switcher */}
          <div className="flex items-center bg-white/[0.06] p-0.5 rounded-lg border border-white/[0.1] text-[12px] font-mono">
            <button
              onClick={() => setLanguage("tr")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                language === "tr"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-[#8aaa94] hover:text-white"
              }`}
              title="Türkçe"
            >
              <span>🇹🇷</span>
              <span>TR</span>
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                language === "en"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-[#8aaa94] hover:text-white"
              }`}
              title="English"
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>

          {/* Status pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] font-mono text-[#8aaa94]">
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </div>

          <button
            onClick={onAnalyzeClick}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-medium transition-colors"
          >
            {t.btnAnalyzeImage}
          </button>
        </div>
      </div>
    </header>
  );
}

function WheatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="shrink-0">
      <path d="M11 20V8" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M11 8C11 8 8 6.5 8 4.5C8 2.5 11 1 11 1C11 1 14 2.5 14 4.5C14 6.5 11 8 11 8Z"
        fill="#4ade80"
        fillOpacity="0.3"
        stroke="#4ade80"
        strokeWidth="1.2"
      />
      <path
        d="M11 12C11 12 8.5 10.5 7 11.5C5.5 12.5 6 15 6 15C6 15 8.5 14.5 10 13"
        stroke="#4ade80"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M11 12C11 12 13.5 10.5 15 11.5C16.5 12.5 16 15 16 15C16 15 13.5 14.5 12 13"
        stroke="#4ade80"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M11 16C11 16 8.5 14.5 7 15.5" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M11 16C11 16 13.5 14.5 15 15.5" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
