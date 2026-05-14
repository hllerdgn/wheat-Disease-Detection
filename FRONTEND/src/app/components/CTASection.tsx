import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CTASectionProps {
  language: 'tr' | 'en';
  onScrollToUpload: () => void;
}

export function CTASection({ language, onScrollToUpload }: CTASectionProps) {
  const texts = {
    tr: {
      title: 'Hemen Başlayın!',
      subtitle: 'Buğday sağlığınızı AI ile kontrol edin. Ücretsiz, hızlı ve güvenilir.',
      cta: 'Analiz Başlat',
    },
    en: {
      title: 'Get Started Now!',
      subtitle: 'Check your wheat health with AI. Free, fast and reliable.',
      cta: 'Start Analysis',
    },
  };

  const t = texts[language];

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#1B7A4E] to-[#20A85B] rounded-3xl p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2
              className="text-4xl md:text-5xl font-extrabold text-white mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t.title}
            </h2>

            <p
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              {t.subtitle}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onScrollToUpload}
              className="px-12 py-5 bg-white text-[#1B7A4E] font-bold text-xl rounded-2xl shadow-2xl hover:shadow-white/30 transition-all duration-300 inline-flex items-center gap-3"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              🚀 {t.cta}
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
