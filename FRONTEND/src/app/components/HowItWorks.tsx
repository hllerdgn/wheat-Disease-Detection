import { Upload, Zap, FileCheck, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

interface HowItWorksProps {
  language: 'tr' | 'en';
}

export function HowItWorks({ language }: HowItWorksProps) {
  const texts = {
    tr: {
      title: 'NASIL ÇALIŞIR?',
      subtitle: '4 basit adımda buğday sağlığınızı kontrol edin',
      steps: [
        {
          icon: Upload,
          title: '1. Fotoğraf Yükleyin',
          description: 'Buğday yapraklarınızın net bir fotoğrafını yükleyin veya sürükle-bırak yapın',
          color: '#1B7A4E',
        },
        {
          icon: Zap,
          title: '2. AI Analiz Eder',
          description: 'EfficientNet-B3 modelimiz 2-3 saniyede yaprakları analiz eder',
          color: '#20A85B',
        },
        {
          icon: FileCheck,
          title: '3. Sonuç Alın',
          description: 'Hastalık tespiti, güven skoru ve risk seviyesi anında gösterilir',
          color: '#3CCB7F',
        },
        {
          icon: Lightbulb,
          title: '4. Harekete Geçin',
          description: 'Tedavi önerileri ve önleme yöntemleriyle bitkilerinizi koruyun',
          color: '#27AE60',
        },
      ],
    },
    en: {
      title: 'HOW IT WORKS?',
      subtitle: 'Check your wheat health in 4 simple steps',
      steps: [
        {
          icon: Upload,
          title: '1. Upload Photo',
          description: 'Upload or drag-drop a clear photo of your wheat leaves',
          color: '#1B7A4E',
        },
        {
          icon: Zap,
          title: '2. AI Analyzes',
          description: 'Our EfficientNet-B3 model analyzes leaves in 2-3 seconds',
          color: '#20A85B',
        },
        {
          icon: FileCheck,
          title: '3. Get Results',
          description: 'Disease detection, confidence score and risk level shown instantly',
          color: '#3CCB7F',
        },
        {
          icon: Lightbulb,
          title: '4. Take Action',
          description: 'Protect your plants with treatment suggestions and prevention methods',
          color: '#27AE60',
        },
      ],
    },
  };

  const t = texts[language];

  return (
    <div className="py-20 bg-gradient-to-b from-white via-emerald-50/30 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {t.title}
          </h2>
          <p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Connecting Line */}
                {index < t.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-emerald-300 to-transparent z-0"></div>
                )}

                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 group hover:-translate-y-2" style={{ borderTopColor: step.color }}>
                  {/* Icon */}
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg mx-auto group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: step.color }}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-xl font-bold mb-3 text-center"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      color: step.color,
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-gray-600 text-center leading-relaxed text-sm"
                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                  >
                    {step.description}
                  </p>

                  {/* Bottom accent */}
                  <div
                    className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"
                    style={{ backgroundColor: step.color }}
                  ></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
