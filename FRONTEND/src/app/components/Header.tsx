import { useState } from 'react';
import { Menu, X, Moon, Sun, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: 'tr' | 'en';
  toggleLanguage: () => void;
  onNavigate: (section: string) => void;
}

export function Header({ darkMode, toggleDarkMode, language, toggleLanguage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: language === 'tr' ? 'Ana Sayfa' : 'Home', section: 'home' },
    { label: language === 'tr' ? 'Nasıl Çalışır' : 'How It Works', section: 'how' },
    { label: language === 'tr' ? 'Hastalıklar' : 'Diseases', section: 'diseases' },
    { label: language === 'tr' ? 'Hakkımızda' : 'About', section: 'about' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-12 h-12 bg-gradient-to-br from-[#1B7A4E] to-[#20A85B] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🌾</span>
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-[#1B7A4E]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                WheatGuard AI
              </h1>
              <p className="text-xs text-gray-500">AI-Powered Diagnosis</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.section}
                onClick={() => onNavigate(item.section)}
                className="text-gray-700 hover:text-[#20A85B] font-medium transition-colors duration-200 relative group"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#20A85B] group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç'}
            >
              <Globe className="w-5 h-5 text-gray-600" />
              <span className="ml-1 text-sm font-semibold text-gray-700">
                {language.toUpperCase()}
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Login Button */}
            <button
              className="px-5 py-2 bg-gradient-to-r from-[#20A85B] to-[#1B7A4E] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {language === 'tr' ? 'Giriş Yap' : 'Login'}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pt-4 border-t border-gray-200"
            >
              <nav className="flex flex-col gap-4">
                {menuItems.map((item) => (
                  <button
                    key={item.section}
                    onClick={() => {
                      onNavigate(item.section);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-[#20A85B] font-medium py-2"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {item.label}
                  </button>
                ))}

                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg"
                  >
                    <Globe className="w-5 h-5" />
                    <span className="text-sm font-semibold">{language.toUpperCase()}</span>
                  </button>

                  <button
                    onClick={toggleDarkMode}
                    className="p-2 bg-gray-100 rounded-lg"
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>

                <button
                  className="w-full px-5 py-3 bg-gradient-to-r from-[#20A85B] to-[#1B7A4E] text-white font-semibold rounded-lg mt-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {language === 'tr' ? 'Giriş Yap' : 'Login'}
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
