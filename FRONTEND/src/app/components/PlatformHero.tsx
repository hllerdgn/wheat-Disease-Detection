import { motion } from 'motion/react';
import { Play } from 'lucide-react';

interface PlatformHeroProps {
  onScrollToUpload: () => void;
  language: 'tr' | 'en';
}

export function PlatformHero({ onScrollToUpload, language }: PlatformHeroProps) {
  const texts = {
    tr: {
      title: 'BUĞDAY SAĞLIĞI, AI İLE KORUNUN',
      subtitle:
        'Tarımınızı tehdit eden hastalıkları saniye içinde tespit edin. EfficientNet-B3 teknolojisi, %96 doğruluk oranı, 15 farklı hastalık tanısı.',
      stat1: '25,000+ Analiz',
      stat2: '98.9% Memnuniyet',
      stat3: 'Türk AI',
      cta1: 'HEMEN BAŞLA',
      cta2: 'NASIL ÇALIŞIR',
    },
    en: {
      title: 'PROTECT YOUR WHEAT WITH AI',
      subtitle:
        'Detect diseases threatening your crops in seconds. EfficientNet-B3 technology, 96% accuracy, 15 different disease diagnoses.',
      stat1: '25,000+ Analyses',
      stat2: '98.9% Satisfaction',
      stat3: 'Turkish AI',
      cta1: 'GET STARTED',
      cta2: 'HOW IT WORKS',
    },
  };

  const t = texts[language];

  return (
    <div
      className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(27, 122, 78, 0.85) 0%, rgba(32, 168, 91, 0.7) 100%)',
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px) brightness(0.65)',
        }}
      ></div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 z-5 bg-gradient-to-br from-[#1B7A4E]/80 via-[#20A85B]/70 to-transparent animate-pulse" style={{ animationDuration: '4s' }}></div>

      {/* Animated Particles */}
      <div className="absolute inset-0 z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          {/* Title */}
          <h1
            className="text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-2xl"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            🌾 {t.title}
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            {t.subtitle}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            {[
              { icon: '⭐', label: t.stat1 },
              { icon: '📊', label: t.stat2 },
              { icon: '🏆', label: t.stat3 },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl"
              >
                <p
                  className="text-white font-bold flex items-center gap-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <span className="text-2xl">{stat.icon}</span>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onScrollToUpload}
              className="px-10 py-5 bg-white text-[#1B7A4E] font-bold text-lg rounded-2xl shadow-2xl hover:shadow-white/30 transition-all duration-300 flex items-center gap-3 relative overflow-hidden group"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative">🚀 {t.cta1}</span>

              {/* Pulsing effect */}
              <span className="absolute inset-0 rounded-2xl animate-ping bg-white/30"></span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-transparent text-white font-bold text-lg rounded-2xl border-2 border-white hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <Play className="w-6 h-6" />
              {t.cta2}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Diagonal */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
    </div>
  );
}
