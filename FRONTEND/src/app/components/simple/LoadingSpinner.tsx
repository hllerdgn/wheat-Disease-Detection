import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function LoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 space-y-6"
    >
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-30 blur-2xl animate-pulse"></div>

        {/* Main spinner */}
        <div className="relative p-10 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-emerald-200">
          <Loader2 className="w-20 h-20 text-emerald-600 animate-spin" />
        </div>

        {/* Sparkle accent */}
        <div className="absolute -top-2 -right-2 p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-xl animate-bounce">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-800">Analiz Ediliyor...</h3>
        <p className="text-gray-600">Yapay zeka modelimiz fotoğrafınızı inceliyor</p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          ></div>
        ))}
      </div>
    </motion.div>
  );
}
