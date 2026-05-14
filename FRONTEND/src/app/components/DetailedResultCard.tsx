import { CheckCircle2, AlertTriangle, Lightbulb, TrendingUp, Share2, Download, Mail } from 'lucide-react';
import * as Progress from '@radix-ui/react-progress';
import { motion } from 'motion/react';

interface DetailedResultData {
  status: string;
  disease: string;
  confidence: number;
  scientificName: string;
  turkishName: string;
  symptoms: string[];
  treatments: string[];
  prevention: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

interface DetailedResultCardProps {
  result: DetailedResultData;
  imagePreview: string;
  onNewAnalysis: () => void;
}

export function DetailedResultCard({ result, imagePreview, onNewAnalysis }: DetailedResultCardProps) {
  const isHealthy = result.riskLevel === 'low';

  const riskColors = {
    low: { bg: '#27AE60', text: 'DÜŞÜK', icon: '✅' },
    medium: { bg: '#F39C12', text: 'ORTA', icon: '⚠️' },
    high: { bg: '#E74C3C', text: 'YÜKSEK', icon: '🔴' },
  };

  const riskInfo = riskColors[result.riskLevel];

  const handleShare = (platform: string) => {
    const message = `Buğday Hastalık Analizi: ${result.disease} (${result.confidence.toFixed(1)}% güven)`;
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    };
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  const handleDownloadPDF = () => {
    alert('📄 PDF raporu oluşturuluyor... (Bu özellik yakında eklenecek)');
  };

  const handleSendEmail = () => {
    const subject = `Buğday Hastalık Analiz Raporu - ${result.disease}`;
    const body = `Hastalık: ${result.disease}\nGüven: ${result.confidence.toFixed(1)}%\nRisk: ${riskInfo.text}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
      className="w-full max-w-6xl mx-auto px-6"
    >
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1B7A4E] to-[#20A85B] p-6">
          <h2
            className="text-3xl font-bold text-white flex items-center gap-3"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <CheckCircle2 className="w-8 h-8" />
            ANALİZ TAMAMLANDI
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 p-8">
          {/* Left: Image */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3
                className="text-lg font-bold mb-4 text-[#1B7A4E]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                📷 YÜKLENEN FOTOĞRAF
              </h3>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-xl ring-4 ring-gray-200">
                <img src={imagePreview} alt="Analyzed wheat" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>

          {/* Right: Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-2 space-y-6"
          >
            {/* Diagnosis */}
            <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border-2 border-red-200">
              <h3
                className="text-xl font-bold mb-3 text-red-800 flex items-center gap-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {riskInfo.icon} TEŞHIS SONUCU
              </h3>
              <p
                className="text-3xl font-extrabold text-gray-900 mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {result.disease}
              </p>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#20A85B]" />
                  <span className="text-sm font-semibold text-gray-700">Güven Skoru</span>
                </div>
                <span className="text-2xl font-bold text-[#20A85B]">
                  {result.confidence.toFixed(1)}%
                </span>
              </div>
              <Progress.Root
                className="relative h-4 w-full overflow-hidden rounded-full bg-white shadow-inner"
                value={result.confidence}
              >
                <Progress.Indicator
                  className="h-full transition-all duration-1000 ease-out rounded-full"
                  style={{
                    width: `${result.confidence}%`,
                    background: 'linear-gradient(90deg, #20A85B 0%, #3CCB7F 100%)',
                  }}
                />
              </Progress.Root>
            </div>

            {/* Disease Info */}
            <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
              <h3
                className="text-lg font-bold mb-3 text-blue-900"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                📋 HASTALLIK HAKKINDA
              </h3>
              <div className="space-y-2 text-sm" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                <p>
                  <strong>Bilimsel Adı:</strong> {result.scientificName}
                </p>
                <p>
                  <strong>Türkçe Adı:</strong> {result.turkishName}
                </p>
              </div>
            </div>

            {/* Symptoms */}
            <div className="p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
              <h3
                className="text-lg font-bold mb-3 text-yellow-900 flex items-center gap-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <AlertTriangle className="w-5 h-5" />
                BELİRTİLER
              </h3>
              <ul className="space-y-2 text-sm" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                {result.symptoms.map((symptom, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-yellow-900">
                    <span className="text-yellow-600 font-bold">•</span>
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatments */}
            <div className="p-6 bg-purple-50 rounded-2xl border-2 border-purple-200">
              <h3
                className="text-lg font-bold mb-3 text-purple-900"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                💊 TEDAVİ YÖNTEMLERİ
              </h3>
              <ul className="space-y-2 text-sm" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                {result.treatments.map((treatment, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-purple-900">
                    <span className="text-purple-600 font-bold">•</span>
                    {treatment}
                  </li>
                ))}
              </ul>
            </div>

            {/* Prevention */}
            <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-200">
              <h3
                className="text-lg font-bold mb-3 text-emerald-900 flex items-center gap-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <Lightbulb className="w-5 h-5" />
                ÖNLEME YOLLARI
              </h3>
              <ul className="space-y-2 text-sm" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                {result.prevention.map((prev, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-emerald-900">
                    <span className="text-emerald-600 font-bold">•</span>
                    {prev}
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Level */}
            <div
              className="p-6 rounded-2xl border-2 text-white"
              style={{
                backgroundColor: riskInfo.bg,
                borderColor: riskInfo.bg,
              }}
            >
              <h3
                className="text-xl font-bold flex items-center gap-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {riskInfo.icon} RİSK SEVİYESİ: {riskInfo.text}
              </h3>
              <p className="text-sm mt-2" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                {result.riskLevel === 'high'
                  ? 'Hızlı müdahale gereklidir.'
                  : result.riskLevel === 'medium'
                  ? 'Takip edin ve önlem alın.'
                  : 'Bitkileriniz sağlıklı görünüyor.'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={onNewAnalysis}
              className="px-6 py-3 bg-gradient-to-r from-[#20A85B] to-[#1B7A4E] text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              🔄 Başka Fotoğraf Yükle
            </button>

            <button
              onClick={handleDownloadPDF}
              className="px-6 py-3 bg-white border-2 border-blue-500 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 flex items-center gap-2"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <Download className="w-5 h-5" />
              Detaylı Rapor (PDF)
            </button>

            <button
              onClick={handleSendEmail}
              className="px-6 py-3 bg-white border-2 border-gray-400 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <Mail className="w-5 h-5" />
              Email Gönder
            </button>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => handleShare('whatsapp')}
              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300 hover:scale-110"
              title="WhatsApp'ta Paylaş"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-all duration-300 hover:scale-110"
              title="Twitter'da Paylaş"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 hover:scale-110"
              title="Facebook'ta Paylaş"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
