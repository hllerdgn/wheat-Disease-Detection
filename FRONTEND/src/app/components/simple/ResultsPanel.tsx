import { CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import * as Progress from '@radix-ui/react-progress';

interface AnalysisResult {
  classification: {
    predicted_class: string;
    confidence: number;
    is_certain: boolean;
    top3_predictions: Array<{
      class: string;
      score: number;
    }>;
  };
  quality: {
    is_valid: boolean;
    blur_score: number;
    warnings: string[];
  };
  meta: {
    processing_time_ms: number;
  };
}

interface ResultsPanelProps {
  result: AnalysisResult;
  imagePreview: string;
}

export function ResultsPanel({ result, imagePreview }: ResultsPanelProps) {
  const { classification, quality, meta } = result;

  const getDiseaseColor = (diseaseName: string) => {
    const lowerName = diseaseName.toLowerCase();
    if (lowerName.includes('healthy') || lowerName.includes('sağlıklı')) {
      return { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200' };
    } else if (lowerName.includes('rust') || lowerName.includes('pas')) {
      return { bg: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-200' };
    } else {
      return { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-200' };
    }
  };

  const colors = getDiseaseColor(classification.predicted_class);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring' }}
      className="w-full max-w-5xl mx-auto px-6"
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6">
          <div className="flex items-center gap-3 text-white">
            <CheckCircle className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Analiz Tamamlandı</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-8 p-8">
          {/* Left: Image Preview */}
          <div className="md:col-span-2">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl ring-4 ring-gray-200">
              <img src={imagePreview} alt="Analyzed" className="w-full h-full object-cover" />
            </div>

            {/* Quality Info */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  İşlem Süresi:
                </span>
                <span className="font-semibold text-gray-800">
                  {meta.processing_time_ms.toFixed(1)}ms
                </span>
              </div>

              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Netlik Skoru:
                </span>
                <span className="font-semibold text-gray-800">{quality.blur_score.toFixed(1)}</span>
              </div>

              {!quality.is_valid && (
                <div className="mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-xs text-yellow-800 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Fotoğraf kalitesi düşük olabilir
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Results */}
          <div className="md:col-span-3 space-y-6">
            {/* Main Prediction */}
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Tespit Edilen Hastalık
              </p>

              <div
                className={`p-6 rounded-2xl border-2 ${colors.border} bg-gradient-to-br from-white to-gray-50`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className={`text-3xl font-extrabold ${colors.text}`}>
                    {classification.predicted_class}
                  </h3>

                  <div
                    className={`${colors.bg} text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2`}
                  >
                    <span className="text-2xl font-bold">
                      {(classification.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Güven Seviyesi</span>
                    <span className="font-semibold text-gray-800">
                      {classification.is_certain ? 'Kesin ✓' : 'Belirsiz'}
                    </span>
                  </div>

                  <Progress.Root
                    className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200"
                    value={classification.confidence * 100}
                  >
                    <Progress.Indicator
                      className={`h-full transition-all duration-1000 ease-out ${colors.bg}`}
                      style={{ width: `${classification.confidence * 100}%` }}
                    />
                  </Progress.Root>
                </div>
              </div>
            </div>

            {/* Top 3 Predictions */}
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Diğer İhtimaller
              </p>

              <div className="space-y-3">
                {classification.top3_predictions.map((pred, idx) => {
                  const predColors = getDiseaseColor(pred.class);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold ${predColors.text}`}>{pred.class}</span>
                        <span className="text-sm font-bold text-gray-700">
                          {(pred.score * 100).toFixed(2)}%
                        </span>
                      </div>

                      <Progress.Root
                        className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100"
                        value={pred.score * 100}
                      >
                        <Progress.Indicator
                          className={`h-full transition-all duration-700 ${predColors.bg}`}
                          style={{ width: `${pred.score * 100}%` }}
                        />
                      </Progress.Root>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Warnings */}
            {quality.warnings.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Uyarılar
                </p>
                <ul className="space-y-1">
                  {quality.warnings.map((warning, idx) => (
                    <li key={idx} className="text-sm text-yellow-700">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
