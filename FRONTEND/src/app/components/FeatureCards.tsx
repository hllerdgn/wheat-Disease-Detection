import { Microscope, Zap, Wheat, Lock } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    icon: Microscope,
    title: '15 Hastalığı Tanı',
    detail: 'Fusarium, Septoria, Powdery Mildew ve daha fazlası',
    color: '#1B7A4E',
    delay: 0.1,
  },
  {
    icon: Zap,
    title: 'Anında Sonuç',
    detail: '2-3 saniyede analiz, hiçbir bekleme yok',
    color: '#20A85B',
    delay: 0.2,
  },
  {
    icon: Wheat,
    title: 'Tarım Önerileri',
    detail: 'Hastalığa özel tedavi, ilaçlama ve önleme yöntemleri',
    color: '#3CCB7F',
    delay: 0.3,
  },
  {
    icon: Lock,
    title: 'Gizlilik & Güvenlik',
    detail: 'Fotoğraflar sunucuda saklanmaz, inceleme sonrası silinir',
    color: '#27AE60',
    delay: 0.4,
  },
];

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-6">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: feature.delay }}
            className="group relative p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50"
          >
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{ backgroundColor: feature.color }}
            ></div>

            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-md"
              style={{ backgroundColor: feature.color }}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>

            <h3
              className="text-lg font-bold mb-2"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                color: feature.color,
              }}
            >
              {feature.title}
            </h3>

            <p
              className="text-sm text-gray-600 leading-relaxed"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              {feature.detail}
            </p>

            <div
              className="absolute bottom-0 left-0 w-full h-1 rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              style={{ backgroundColor: feature.color }}
            ></div>
          </motion.div>
        );
      })}
    </div>
  );
}
