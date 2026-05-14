import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Dialog from '@radix-ui/react-dialog';

interface Disease {
  id: number;
  name: string;
  scientificName: string;
  riskLevel: 'low' | 'medium' | 'high';
  symptoms: string[];
  treatments: string[];
}

interface DiseaseDatabaseProps {
  language: 'tr' | 'en';
}

export function DiseaseDatabase({ language }: DiseaseDatabaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);

  const diseases: Disease[] = [
    {
      id: 1,
      name: 'SEPTORIA',
      scientificName: 'Zymoseptoria tritici',
      riskLevel: 'high',
      symptoms: ['Yaprakta gri-kahve lekeler', 'Siyah piknidler', 'Yaprak ölümü'],
      treatments: ['Fungisit uygulaması', 'Enfekte yaprakları çıkarın', 'Bitki kalıntılarını temizleyin'],
    },
    {
      id: 2,
      name: 'FUSARIUM',
      scientificName: 'Fusarium spp',
      riskLevel: 'medium',
      symptoms: ['Başakta pembemsi küf', 'Tane küçülmesi', 'Mikotoksin oluşumu'],
      treatments: ['Fungisit', 'Ekim nöbeti', 'Dayanıklı çeşit'],
    },
    {
      id: 3,
      name: 'POWDERY MILDEW',
      scientificName: 'Blumeria graminis',
      riskLevel: 'medium',
      symptoms: ['Beyaz pudra görünümü', 'Yaprak sararması', 'Gelişme geriliği'],
      treatments: ['Kükürt bazlı fungisit', 'İyi havalandırma', 'Azotlu gübreyi azalt'],
    },
    {
      id: 4,
      name: 'YELLOW RUST',
      scientificName: 'Puccinia striiformis',
      riskLevel: 'high',
      symptoms: ['Sarı çizgiler', 'Püstüller', 'Hızlı yayılma'],
      treatments: ['Triazol fungisit', 'Erken müdahale', 'Dayanıklı çeşit'],
    },
    {
      id: 5,
      name: 'BROWN RUST',
      scientificName: 'Puccinia triticina',
      riskLevel: 'medium',
      symptoms: ['Kahverengi püstüller', 'Rastgele dağılım', 'Yaprak kuruması'],
      treatments: ['Fungisit', 'Azot dengesi', 'Bitki kalıntısı yönetimi'],
    },
    {
      id: 6,
      name: 'HEALTHY WHEAT',
      scientificName: 'Triticum aestivum',
      riskLevel: 'low',
      symptoms: ['Yeşil yapraklar', 'Normal gelişim', 'Hastalık yok'],
      treatments: ['Düzenli bakım', 'Koruyucu ilaçlama', 'İyi tarım pratikleri'],
    },
  ];

  const filteredDiseases = diseases.filter((disease) =>
    disease.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const riskColors = {
    low: { bg: '#27AE60', border: '#27AE60', text: 'DÜŞÜK' },
    medium: { bg: '#F39C12', border: '#F39C12', text: 'ORTA' },
    high: { bg: '#E74C3C', border: '#E74C3C', text: 'YÜKSEK' },
  };

  return (
    <div className="py-20 bg-gradient-to-b from-white to-gray-50" id="diseases-section">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-gray-800"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          🗂️ {language === 'tr' ? 'HASTALIK VERİTABANI' : 'DISEASE DATABASE'}
        </motion.h2>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'tr' ? 'Hastalık ara...' : 'Search disease...'}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#20A85B] focus:outline-none transition-colors"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            />
          </div>
        </div>

        {/* Disease Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiseases.map((disease, index) => {
            const riskInfo = riskColors[disease.riskLevel];
            return (
              <motion.div
                key={disease.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 cursor-pointer"
                style={{ borderLeftColor: riskInfo.border }}
                onClick={() => setSelectedDisease(disease)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3
                    className="text-xl font-bold text-gray-800"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {index + 1}️⃣ {disease.name}
                  </h3>
                  <span
                    className="px-3 py-1 rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: riskInfo.bg }}
                  >
                    {riskInfo.text}
                  </span>
                </div>

                <p
                  className="text-sm text-gray-600 italic mb-4"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  {disease.scientificName}
                </p>

                <button
                  className="w-full px-4 py-2 bg-[#20A85B] text-white font-semibold rounded-lg hover:bg-[#1B7A4E] transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {language === 'tr' ? 'DETAY' : 'DETAILS'}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Disease Detail Modal */}
      <Dialog.Root open={!!selectedDisease} onOpenChange={() => setSelectedDisease(null)}>
        <AnimatePresence>
          {selectedDisease && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-50 p-8"
                >
                  <div className="flex items-start justify-between mb-6">
                    <Dialog.Title asChild>
                      <h2
                        className="text-3xl font-bold text-gray-800"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {selectedDisease.name}
                      </h2>
                    </Dialog.Title>

                    <Dialog.Close asChild>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-6 h-6 text-gray-600" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <Dialog.Description asChild>
                    <p
                      className="text-lg text-gray-600 italic mb-6"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                      {selectedDisease.scientificName}
                    </p>
                  </Dialog.Description>

                  <div className="space-y-6">
                    <div>
                      <h3
                        className="text-xl font-bold mb-3 text-[#1B7A4E]"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        📌 {language === 'tr' ? 'Belirtiler' : 'Symptoms'}
                      </h3>
                      <ul className="space-y-2">
                        {selectedDisease.symptoms.map((symptom, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-gray-700"
                            style={{ fontFamily: 'Open Sans, sans-serif' }}
                          >
                            <span className="text-[#20A85B] font-bold">•</span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3
                        className="text-xl font-bold mb-3 text-[#1B7A4E]"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        💊 {language === 'tr' ? 'Tedavi Yöntemleri' : 'Treatments'}
                      </h3>
                      <ul className="space-y-2">
                        {selectedDisease.treatments.map((treatment, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-gray-700"
                            style={{ fontFamily: 'Open Sans, sans-serif' }}
                          >
                            <span className="text-[#20A85B] font-bold">•</span>
                            {treatment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
}
