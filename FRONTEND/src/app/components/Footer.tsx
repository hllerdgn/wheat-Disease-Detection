import { Mail, Phone, Globe, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';

interface FooterProps {
  language: 'tr' | 'en';
}

export function Footer({ language }: FooterProps) {
  const texts = {
    tr: {
      about: 'HAKKIMIZDA',
      aboutLinks: ['Hakkında', 'Ekip', 'İletişim'],
      useful: 'YARARLI LİNKLER',
      usefulLinks: ['Hastalıklar', 'Blog', 'Rehber', 'SSS'],
      legal: 'YASAL',
      legalLinks: ['Gizlilik Politikası', 'Kullanım Şartları', 'İletişim', 'Tercihler'],
      social: 'SOSYAL:',
      contact: 'BİZE ULAŞIN:',
      privacy: 'Gizlilik: Fotoğraflarınız analiz sonrası silinir.',
      copyright: '© 2026 WheatGuard AI. Tüm hakları saklıdır.',
    },
    en: {
      about: 'ABOUT US',
      aboutLinks: ['About', 'Team', 'Contact'],
      useful: 'USEFUL LINKS',
      usefulLinks: ['Diseases', 'Blog', 'Guide', 'FAQ'],
      legal: 'LEGAL',
      legalLinks: ['Privacy Policy', 'Terms of Use', 'Contact', 'Preferences'],
      social: 'SOCIAL:',
      contact: 'CONTACT US:',
      privacy: 'Privacy: Your photos are deleted after analysis.',
      copyright: '© 2026 WheatGuard AI. All rights reserved.',
    },
  };

  const t = texts[language];

  return (
    <footer className="relative bg-[#1B7A4E] text-white pt-16 pb-8 overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 opacity-10"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 100 Q25 80 50 100 T100 100\' fill=\'none\' stroke=\'white\' stroke-width=\'2\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Us */}
          <div>
            <h3
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <span className="text-2xl">🌾</span>
              {t.about}
            </h3>
            <ul className="space-y-2">
              {t.aboutLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors text-sm"
                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                  >
                    • {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3
              className="text-lg font-bold mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t.useful}
            </h3>
            <ul className="space-y-2">
              {t.usefulLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors text-sm"
                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                  >
                    • {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              className="text-lg font-bold mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t.legal}
            </h3>
            <ul className="space-y-2">
              {t.legalLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors text-sm"
                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                  >
                    • {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3
              className="text-lg font-bold mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t.contact}
            </h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@wheatguard.ai" className="hover:underline">
                  info@wheatguard.ai
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                <a href="tel:+90XXXXXXXXX" className="hover:underline">
                  +90 XXX XXX XXXX
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4" />
                <a href="https://wheatguard.ai" className="hover:underline">
                  www.wheatguard.ai
                </a>
              </li>
            </ul>

            <h3
              className="text-lg font-bold mb-3"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t.social}
            </h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/20 text-center space-y-4">
          <p
            className="text-sm flex items-center justify-center gap-2"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <span className="text-xl">🔐</span>
            {t.privacy}
          </p>
          <p
            className="text-xs text-white/60"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
