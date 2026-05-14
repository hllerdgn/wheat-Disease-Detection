import { Microscope, Zap, Target, Lock, History, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

interface EnhancedFeatureCardsProps {
  language: 'tr' | 'en';
}

export function EnhancedFeatureCards({ language }: EnhancedFeatureCardsProps) {
  const texts = {
    tr: {
      title: 'NEDEN WHEATGUARD AI?',
      features: [
        {
          icon: Microscope,
          title: '15 HASTALIK',
          description: 'Fusarium, Septoria, Powdery Mildew ve daha fazlası',
          color: '#1B7A4E',
        },
        {
          icon: Zap,
          title: 'ANINDA SONUÇ',
          description: '2-3 saniye içinde analiz tamamlanır',
          color: '#20A85B',
        },
        {
          icon: Target,
          title: '%96 DOĞRULUK',
          description: 'EfficientNet B3 AI Model ile yapay zeka destekli analiz',
          color: '#3CCB7F',
        },
        {
          icon: Lock,
          title: 'GÜVENLİK & GİZLİLİK',
          description: 'Verileriniz saklanmaz, analiz sonrası otomatik silinir',
          color: '#27AE60',
        },
        {
          icon: History,
          title: 'TARİHÇE & RAPOR',
          description: 'Önceki taramalarınızı takip edin, PDF rapor alın',
          color: '#1B7A4E',
        },
        {
          icon: Smartphone,
          title: 'MOBİL UYUMLU',
          description: 'Cep telefonunuzdan kolayca kullanın, her yerden erişin',
          color: '#20A85B',
        },
      ],
    },
    en: {
      title: 'WHY WHEATGUARD AI?',
      features: [
        {
          icon: Microscope,
          title: '15 DISEASES',
          description: 'Fusarium, Septoria, Powdery Mildew and more',
          color: '#1B7A4E',
        },
        {
          icon: Zap,
          title: 'INSTANT RESULT',
          description: 'Analysis completes in 2-3 seconds',
          color: '#20A85B',
        },
        {
          icon: Target,
          title: '96% ACCURACY',
          description: 'AI-powered analysis with EfficientNet B3 model',
          color: '#3CCB7F',
        },
        {
          icon: Lock,
          title: 'SECURITY & PRIVACY',
          description: 'Your data is not stored, deleted after analysis',
          color: '#27AE60',
        },
        {
          icon: History,
          title: 'HISTORY & REPORTS',
          description: 'Track previous scans, download PDF reports',
          color: '#1B7A4E',
        },
        {
          icon: Smartphone,
          title: 'MOBILE FRIENDLY',
          description: 'Use easily from your phone, access anywhere',
          color: '#20A85B',
        },
      ],
    },
  };

  const t = texts[language];

  return (
    <div
      className="py-20 relative"
      style={{
        background: 'linear-gradient(180deg, #F8FCF7 0%, #FFFFFF 100%)',
      }}
    >
      {/* Subtle Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'url(https://www.transparenttextures.com/patterns/asfalt-light.png)',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-gray-800"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {t.title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 overflow-hidden"
                style={{
                  borderTopColor: feature.color,
                }}
              >
                {/* Hover Background Effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                  style={{ backgroundColor: feature.color }}
                ></div>

                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-md"
                  style={{ backgroundColor: feature.color }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-bold mb-3"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    color: feature.color,
                  }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-gray-600 leading-relaxed"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  {feature.description}
                </p>

                {/* Bottom Accent Line */}
                <div
                  className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300 rounded-b-2xl"
                  style={{ backgroundColor: feature.color }}
                ></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
