import { TrendingUp, Users, Award, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface StatsProps {
  language: 'tr' | 'en';
}

function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      setCount(Math.floor(end * percentage));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export function Stats({ language }: StatsProps) {
  const texts = {
    tr: {
      stats: [
        { icon: Users, value: 25000, label: 'Aktif Kullanıcı', suffix: '+', color: '#1B7A4E' },
        { icon: TrendingUp, value: 98.9, label: 'Memnuniyet Oranı', suffix: '%', color: '#20A85B' },
        { icon: Zap, value: 50000, label: 'Analiz Yapıldı', suffix: '+', color: '#3CCB7F' },
        { icon: Award, value: 96, label: 'Doğruluk Oranı', suffix: '%', color: '#27AE60' },
      ],
    },
    en: {
      stats: [
        { icon: Users, value: 25000, label: 'Active Users', suffix: '+', color: '#1B7A4E' },
        { icon: TrendingUp, value: 98.9, label: 'Satisfaction Rate', suffix: '%', color: '#20A85B' },
        { icon: Zap, value: 50000, label: 'Analyses Completed', suffix: '+', color: '#3CCB7F' },
        { icon: Award, value: 96, label: 'Accuracy Rate', suffix: '%', color: '#27AE60' },
      ],
    },
  };

  const t = texts[language];

  return (
    <div className="py-20 bg-gradient-to-r from-[#1B7A4E] to-[#20A85B] relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div
                    className="text-5xl font-extrabold text-white mb-2"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <CountUp end={stat.value} />
                    {stat.suffix}
                  </div>

                  <p
                    className="text-white/90 font-medium"
                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                  >
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
