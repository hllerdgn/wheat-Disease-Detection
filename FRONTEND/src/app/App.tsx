import { useState } from 'react';
import { Header } from './components/Header';
import { PlatformHero } from './components/PlatformHero';
import { Stats } from './components/Stats';
import { EnhancedFeatureCards } from './components/EnhancedFeatureCards';
import { HowItWorks } from './components/HowItWorks';
import { EnhancedUploadArea } from './components/EnhancedUploadArea';
import { LoadingAnimation } from './components/LoadingAnimation';
import { DetailedResultCard } from './components/DetailedResultCard';
import { DiseaseDatabase } from './components/DiseaseDatabase';
import { Testimonials } from './components/Testimonials';
import { ScanHistory } from './components/ScanHistory';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';

interface DetailedAnalysisResult {
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

export default function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetailedAnalysisResult | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');

  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigate = (section: string) => {
    const sectionMap: { [key: string]: string } = {
      home: 'hero-section',
      how: 'upload-section',
      diseases: 'diseases-section',
      about: 'history-section',
    };

    const targetId = sectionMap[section];
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setResult(null);

    // Mock API call - Gerçek backend eklendiğinde değiştirilecek
    setTimeout(() => {
      const mockResults: DetailedAnalysisResult[] = [
        {
          status: 'success',
          disease: 'SEPTORIA LEAF BLOTCH',
          confidence: 96.8,
          scientificName: 'Zymoseptoria tritici',
          turkishName: 'Septorya Yaprak Lekesi',
          symptoms: [
            'Yaprakta gri-kahverengi lekeler',
            'Lekelerin merkezinde siyah noktalar (piknidler)',
            'Enfeksiyonla beraber yaprak sarısı ve ölümü',
            'Alt yapraklarda önce görülür, yukarı doğru yayılır',
          ],
          treatments: [
            'Fungisit uygulaması (Mancozeb, Azoxystrobin)',
            'Enfekte bitkileri tarladan çıkarın',
            '10-14 gün aralıklarla 2-3 defa ilaçlama yapın',
            'En uygun sıcaklık: 15-20°C',
          ],
          prevention: [
            'Hastalık dirençli buğday çeşidi seçin',
            'Bitki kalıntılarını tarlamdan temizleyin',
            'Ekim dönemini uygun zamanlayın',
            'Yoğun sulama yapmaktan kaçının',
            'Alet ve makineleri düzenli dezenfekte edin',
          ],
          riskLevel: 'high',
        },
        {
          status: 'success',
          disease: 'YELLOW RUST (STRIPE RUST)',
          confidence: 94.5,
          scientificName: 'Puccinia striiformis f. sp. tritici',
          turkishName: 'Sarı Pas',
          symptoms: [
            'Yaprak damarlarına paralel sarı-turuncu çizgiler',
            'Püstüller çizgi şeklinde dizilir',
            'Soğuk ve nemli havalarda hızla yayılır',
            'Yaprak kloroz ve nekroz',
          ],
          treatments: [
            'Triazol grubu fungisitler (Tebuconazole, Propiconazole)',
            'Erken dönemde müdahale edin',
            'Hava sıcaklığı 10-15°C arası risk en yüksek',
            'Kombine ilaçlama programı uygulayın',
          ],
          prevention: [
            'Dayanıklı çeşit kullanın',
            'Bitki sıklığını azaltın',
            'Azotlu gübre miktarını dengeleyin',
            'Ekim zamanını geciktirin',
            'Tohum ilaçlaması yapın',
          ],
          riskLevel: 'high',
        },
        {
          status: 'success',
          disease: 'SAĞLIKLI BUĞDAY',
          confidence: 98.8,
          scientificName: 'Triticum aestivum (Healthy)',
          turkishName: 'Sağlıklı Buğday',
          symptoms: [
            'Yapraklar parlak yeşil renkte',
            'Herhangi bir leke veya deformasyon yok',
            'Bitki gelişimi normal',
            'Hastalık belirtisi tespit edilmedi',
          ],
          treatments: [
            'Tedavi gerekmemektedir',
            'Düzenli takip yapın',
            'Koruyucu ilaçlama yapabilirsiniz',
          ],
          prevention: [
            'Düzenli sulama ve gübreleme yapın',
            'Bitki sağlığını periyodik kontrol edin',
            'Ekim nöbeti uygulayın',
            'İyi tarım pratiklerini sürdürün',
          ],
          riskLevel: 'low',
        },
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(randomResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setIsAnalyzing(false);
    scrollToUpload();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Dark mode implementasyonu (CSS sınıfları) ileride eklenebilir
  };

  const toggleLanguage = () => {
    setLanguage(language === 'tr' ? 'en' : 'tr');
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: 'Open Sans, sans-serif' }}
    >
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        language={language}
        toggleLanguage={toggleLanguage}
        onNavigate={handleNavigate}
      />

      <div id="hero-section">
        <PlatformHero onScrollToUpload={scrollToUpload} language={language} />
      </div>

      <Stats language={language} />

      <EnhancedFeatureCards language={language} />

      <HowItWorks language={language} />

      <div className="py-20 bg-gradient-to-b from-white to-gray-50" id="upload-section">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center px-6">
            <h2
              className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {language === 'tr' ? 'BUĞDAY FOTOĞRAFINI YÜKLE' : 'UPLOAD WHEAT PHOTO'}
            </h2>
            <p
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              {language === 'tr'
                ? 'Buğday yapraklarınızın fotoğrafını yükleyin, AI anında analiz etsin'
                : 'Upload a photo of your wheat leaves, let AI analyze instantly'}
            </p>
          </div>

          {!result ? (
            <>
              <EnhancedUploadArea
                onImageSelect={setSelectedImage}
                selectedImage={selectedImage}
                onClear={handleReset}
                disabled={isAnalyzing}
              />

              {selectedImage && !isAnalyzing && (
                <div className="flex justify-center">
                  <button
                    onClick={handleAnalyze}
                    className="group relative px-12 py-6 rounded-2xl font-bold text-white text-xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-emerald-500/50"
                    style={{
                      background: 'linear-gradient(135deg, #20A85B 0%, #1B7A4E 100%)',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3CCB7F] to-[#20A85B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute inset-0 bg-white rounded-full blur-2xl scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                    </div>
                    <span className="relative flex items-center gap-3">
                      🔬 {language === 'tr' ? 'Analiz Başlat' : 'Start Analysis'}
                      <svg
                        className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300"
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

              {isAnalyzing && <LoadingAnimation />}
            </>
          ) : (
            <DetailedResultCard
              result={result}
              imagePreview={URL.createObjectURL(selectedImage!)}
              onNewAnalysis={handleReset}
            />
          )}
        </div>
      </div>

      <DiseaseDatabase language={language} />

      <Testimonials language={language} />

      <ScanHistory language={language} />

      <CTASection language={language} onScrollToUpload={scrollToUpload} />

      <Footer language={language} />
    </div>
  );
}
