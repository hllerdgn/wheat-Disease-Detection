import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

export function SimpleHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-16 px-6"
    >
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Leaf className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
          Wheat AI
        </h1>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        Buğday Hastalıklarını Anında Tespit Edin
      </h2>

      <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Yapay zeka destekli sistemimiz, buğday yapraklarınızdaki hastalıkları{' '}
        <span className="text-emerald-600 font-semibold">%98+ doğrulukla</span> tespit eder.
        Hızlı, güvenilir ve kolay kullanım.
      </p>
    </motion.div>
  );
}
