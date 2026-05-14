import { CheckCircle2, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import * as Progress from '@radix-ui/react-progress';
import { motion } from 'motion/react';

interface ResultData {
  status: string;
  disease: string;
  confidence: number;
  description: string;
  solution: string;
}

interface ResultCardProps {
  result: ResultData;
  imagePreview: string;
}

export function ResultCard({ result, imagePreview }: ResultCardProps) {
  const isHealthy = result.disease.toLowerCase().includes('sağlıklı') ||
                    result.disease.toLowerCase().includes('healthy');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
      className="w-full max-w-4xl mx-auto px-6"
    >
      <div
        className="rounded-3xl overflow-hidden shadow-2xl border border-white/40"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.85) 100%)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <div className="grid md:grid-cols-5 gap-8 p-10">
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl ring-2 ring-white/50"
            >
              <img
                src={imagePreview}
                alt="Analyzed wheat"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <div className={`p-3 backdrop-blur-md rounded-full shadow-2xl border-2 border-white/50 ${
                  isHealthy ? 'bg-emerald-500/90' : 'bg-amber-500/90'
                }`}>
                  {isHealthy ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-3 space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse shadow-lg`}></div>
                <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Tespit Sonucu</span>
              </div>

              <h2
                className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {result.disease}
              </h2>
            </div>

            <div className="space-y-4 p-5 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-2xl border border-emerald-200/50 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-xl shadow-md">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-base font-bold text-gray-800">Güven Skoru</span>
                </div>
                <span className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
                  {result.confidence.toFixed(1)}%
                </span>
              </div>

              <Progress.Root
                className="relative h-4 w-full overflow-hidden rounded-full bg-white shadow-inner border border-gray-200"
                value={result.confidence}
              >
                <Progress.Indicator
                  className="h-full transition-all duration-1000 ease-out rounded-full shadow-lg"
                  style={{
                    width: `${result.confidence}%`,
                    background: 'linear-gradient(90deg, #10b981 0%, #34d399 50%, #fbbf24 100%)',
                  }}
                />
              </Progress.Root>
            </div>

            <div className="pt-2 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="p-5 bg-blue-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/60 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex gap-4">
                  <div className="p-2.5 bg-blue-500 rounded-xl shadow-md flex-shrink-0 h-fit">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-blue-900">Açıklama</p>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      {result.description}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="p-5 bg-emerald-50/80 backdrop-blur-sm rounded-2xl border border-emerald-200/60 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex gap-4">
                  <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md flex-shrink-0 h-fit">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-emerald-900">Çözüm Önerisi</p>
                    <p className="text-sm text-emerald-800 leading-relaxed">
                      {result.solution}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
