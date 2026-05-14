import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface NewHeroSectionProps {
  onScrollToUpload: () => void;
}

export function NewHeroSection({ onScrollToUpload }: NewHeroSectionProps) {
  return (
    <div className="relative text-center space-y-8 max-w-5xl mx-auto px-6 pt-16 pb-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#1B7A4E] to-[#20A85B] shadow-xl shadow-emerald-500/30"
      >
        <Sparkles className="w-5 h-5 text-white animate-pulse" />
        <span
          className="text-sm text-white font-bold tracking-wide"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          EfficientNet-B3 AI Model • %95+ Doğruluk
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-5xl md:text-7xl font-extrabold leading-tight"
        style={{
          fontFamily: 'Montserrat, sans-serif',
          background: 'linear-gradient(135deg, #1B7A4E 0%, #20A85B 50%, #3CCB7F 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Buğday Sağlığınızı
        <br />
        AI ile Koruyun
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      >
        EfficientNet-B3 ile <span className="font-bold text-[#1B7A4E]">%95+ doğrulukta</span> hastalık
        teşhisi. Yapraklarınızı analiz edin, anında sonuç alın ve bilinçli kararlar verin.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="pt-6"
      >
        <button
          onClick={onScrollToUpload}
          className="group relative px-10 py-5 bg-gradient-to-r from-[#20A85B] to-[#1B7A4E] text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#3CCB7F] to-[#20A85B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative flex items-center gap-3">
            📸 Fotoğraf Yükleyin
            <svg
              className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>

          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-2xl animate-ping opacity-20 bg-white"></div>
        </button>
      </motion.div>
    </div>
  );
}
