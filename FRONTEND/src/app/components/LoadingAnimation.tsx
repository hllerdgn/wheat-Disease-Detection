import { Loader2, ScanLine } from 'lucide-react';
import { motion } from 'motion/react';

export function LoadingAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 space-y-6"
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 opacity-30 blur-2xl animate-pulse"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-l from-emerald-400 to-amber-400 opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative p-10 bg-white/80 backdrop-blur-xl rounded-full shadow-2xl border border-white/50">
          <Loader2 className="w-20 h-20 text-emerald-600 animate-spin" />
        </div>

        <div className="absolute -bottom-3 -right-3 p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-2xl animate-bounce border-4 border-white">
          <ScanLine className="w-7 h-7 text-white" />
        </div>
      </div>

      <div className="text-center space-y-3 pt-4">
        <p className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Analiz Ediliyor...
        </p>
        <p className="text-base text-gray-600 font-medium">
          Yapay zeka modelimiz fotoğrafınızı inceliyor
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }}></div>
      </div>
    </motion.div>
  );
}
