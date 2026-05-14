import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';

interface TestimonialsProps {
  language: 'tr' | 'en';
}

export function Testimonials({ language }: TestimonialsProps) {
  const texts = {
    tr: {
      title: 'ÇIFTÇILERIMIZ NE SÖYLÜYOR?',
      subtitle: 'Binlerce çiftçi WheatGuard AI ile verimini artırdı',
      testimonials: [
        {
          name: 'Mehmet Yılmaz',
          role: 'Çiftçi - Konya',
          avatar: '👨‍🌾',
          rating: 5,
          text: 'WheatGuard sayesinde hastalıkları erken tespit edip müdahale ediyorum. Verimim %30 arttı!',
        },
        {
          name: 'Ayşe Demir',
          role: 'Tarım Mühendisi - Ankara',
          avatar: '👩‍🔬',
          rating: 5,
          text: 'Müşterilerime hızlı ve doğru teşhis koyabiliyorum. Harika bir araç, kesinlikle öneriyorum.',
        },
        {
          name: 'Ali Kaya',
          role: 'Çiftlik Sahibi - Eskişehir',
          avatar: '👨‍🌾',
          rating: 5,
          text: 'Mobil uyumlu olması çok pratik. Tarlada bile anında kontrol yapabiliyorum.',
        },
      ],
    },
    en: {
      title: 'WHAT OUR FARMERS SAY?',
      subtitle: 'Thousands of farmers increased their yield with WheatGuard AI',
      testimonials: [
        {
          name: 'Mehmet Yılmaz',
          role: 'Farmer - Konya',
          avatar: '👨‍🌾',
          rating: 5,
          text: 'Thanks to WheatGuard, I detect diseases early and intervene. My yield increased by 30%!',
        },
        {
          name: 'Ayşe Demir',
          role: 'Agricultural Engineer - Ankara',
          avatar: '👩‍🔬',
          rating: 5,
          text: 'I can diagnose my clients quickly and accurately. Great tool, definitely recommend.',
        },
        {
          name: 'Ali Kaya',
          role: 'Farm Owner - Eskişehir',
          avatar: '👨‍🌾',
          rating: 5,
          text: 'Mobile compatibility is very practical. I can check instantly even in the field.',
        },
      ],
    },
  };

  const t = texts[language];

  return (
    <div className="py-20 bg-gradient-to-br from-emerald-50 via-white to-amber-50/30 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-amber-200/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-16 h-16 text-[#20A85B]" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p
                className="text-gray-700 mb-6 leading-relaxed italic"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p
                    className="font-bold text-gray-800"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              {/* Hover Accent */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#1B7A4E] via-[#20A85B] to-[#3CCB7F] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
