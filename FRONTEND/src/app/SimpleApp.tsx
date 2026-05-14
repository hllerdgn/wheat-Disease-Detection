import { useState } from 'react';
import { SimpleHero } from './components/simple/SimpleHero';
import { UploadZone } from './components/simple/UploadZone';
import { LoadingSpinner } from './components/simple/LoadingSpinner';
import { ResultsPanel } from './components/simple/ResultsPanel';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

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

export default function SimpleApp() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analiz başarısız oldu');
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      toast.success('Analiz tamamlandı!');
    } catch (error) {
      console.error('Analiz hatası:', error);
      toast.error('Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.');

      // Demo mode: Mock response for development
      setTimeout(() => {
        const mockResult: AnalysisResult = {
          classification: {
            predicted_class: 'Yellow Rust',
            confidence: 0.9821,
            is_certain: true,
            top3_predictions: [
              { class: 'Yellow Rust', score: 0.9821 },
              { class: 'Brown Rust', score: 0.0125 },
              { class: 'Healthy', score: 0.0054 },
            ],
          },
          quality: {
            is_valid: true,
            blur_score: 145.6,
            warnings: [],
          },
          meta: {
            processing_time_ms: 125.4,
          },
        };
        setResult(mockResult);
        toast.info('Demo modu: Örnek sonuç gösteriliyor');
      }, 1500);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-50">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto py-12 space-y-12">
        <SimpleHero />

        <div className="space-y-8">
          {!result ? (
            <>
              <UploadZone
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
                onClear={handleReset}
                isAnalyzing={isAnalyzing}
              />

              {selectedFile && !isAnalyzing && (
                <div className="flex justify-center">
                  <button
                    onClick={handleAnalyze}
                    className="group relative px-12 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center gap-3">
                      🔬 Görüntüyü Analiz Et
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
                  </button>
                </div>
              )}

              {isAnalyzing && <LoadingSpinner />}
            </>
          ) : (
            <>
              <ResultsPanel result={result} imagePreview={URL.createObjectURL(selectedFile!)} />

              <div className="flex justify-center">
                <button
                  onClick={handleReset}
                  className="px-8 py-4 bg-white text-emerald-700 border-2 border-emerald-300 font-semibold text-lg rounded-xl hover:bg-emerald-50 hover:border-emerald-500 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <RefreshCw className="w-5 h-5" />
                  Yeni Analiz Yap
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer Info */}
        <footer className="text-center py-8 px-6">
          <div className="max-w-2xl mx-auto p-4 bg-white/60 backdrop-blur-md rounded-xl shadow-md border border-gray-200">
            <p className="text-sm text-gray-700">
              🔐 <strong>Gizlilik:</strong> Fotoğraflarınız analiz sonrası otomatik silinir.
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Powered by Swin-T • %98+ Doğruluk
          </p>
        </footer>
      </div>
    </div>
  );
}
