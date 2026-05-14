import { Download, Trash2, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface HistoryItem {
  id: number;
  date: string;
  disease: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface ScanHistoryProps {
  language: 'tr' | 'en';
}

export function ScanHistory({ language }: ScanHistoryProps) {
  const mockHistory: HistoryItem[] = [
    { id: 1, date: '30 Nisan', disease: 'Septoria Leaf Blotch', confidence: 96.8, riskLevel: 'high' },
    { id: 2, date: '28 Nisan', disease: 'Healthy Wheat', confidence: 99.2, riskLevel: 'low' },
    { id: 3, date: '25 Nisan', disease: 'Fusarium Head Blight', confidence: 92.1, riskLevel: 'medium' },
    { id: 4, date: '20 Nisan', disease: 'Powdery Mildew', confidence: 88.5, riskLevel: 'medium' },
    { id: 5, date: '15 Nisan', disease: 'Healthy Wheat', confidence: 99.5, riskLevel: 'low' },
  ];

  const riskIcons = {
    low: '✅',
    medium: '⚠️',
    high: '🔴',
  };

  const riskTexts = {
    low: language === 'tr' ? 'NORMAL' : 'NORMAL',
    medium: language === 'tr' ? 'ORTA' : 'MEDIUM',
    high: language === 'tr' ? 'YÜKSEK' : 'HIGH',
  };

  return (
    <div className="py-20 bg-white" id="history-section">
      <div className="max-w-5xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-gray-800"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          📊 {language === 'tr' ? 'TARAMA TARİHÇESİ' : 'SCAN HISTORY'}
        </motion.h2>

        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <h3
              className="text-xl font-bold mb-6 text-[#1B7A4E]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {language === 'tr' ? 'SON 10 TARAMA:' : 'LAST 10 SCANS:'}
            </h3>

            <div className="space-y-4">
              {mockHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-[#20A85B] hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-2xl">{riskIcons[item.riskLevel]}</div>
                    <div>
                      <p
                        className="font-bold text-gray-800"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {item.id}. [{item.date}] {item.disease}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.confidence}% • {riskTexts[item.riskLevel]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title={language === 'tr' ? 'Detay' : 'Details'}
                    >
                      <FileText className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-4 justify-center">
            <button
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-md"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <Download className="w-5 h-5" />
              {language === 'tr' ? 'PDF RAPOR OLUŞTUR' : 'CREATE PDF REPORT'}
            </button>

            <button
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2 shadow-md"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <Download className="w-5 h-5" />
              {language === 'tr' ? 'CSV DIŞA AKTAR' : 'EXPORT CSV'}
            </button>

            <button
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2 shadow-md"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <Trash2 className="w-5 h-5" />
              {language === 'tr' ? 'SİL' : 'DELETE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
