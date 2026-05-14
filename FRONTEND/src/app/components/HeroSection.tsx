import { Sparkles, Zap, Target, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

export function HeroSection() {
  return (
    <div className="text-center space-y-8 max-w-4xl mx-auto px-6 pt-12 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 border border-emerald-400/50"
      >
        <Sparkles className="w-4 h-4 text-white animate-pulse" />
        <span className="text-sm text-white font-semibold tracking-wide">Yapay Zeka Destekli Analiz</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent leading-tight"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        Buğday Hastalık Tespiti
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed"
      >
        EfficientNet-B3 tabanlı yapay zeka modelimiz, buğday yapraklarındaki hastalıkları
        <span className="text-emerald-600 font-bold"> %95+ doğrulukla</span> tespit eder.
        Hızlı, güvenilir ve kolay kullanım.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap gap-4 justify-center pt-6"
      >
        <div className="group px-5 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:scale-105">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-800">15 Farklı Hastalık</span>
          </div>
        </div>

        <div className="group px-5 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:scale-105">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-md">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-800">Anında Sonuç</span>
          </div>
        </div>

        <div className="group px-5 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:scale-105">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-800">Çözüm Önerileri</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
