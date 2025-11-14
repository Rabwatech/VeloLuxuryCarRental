import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import logoImage from 'figma:asset/842671c072bdc4368c49973871bff724718e748f.png';

export function Footer() {
  const { language, t } = useLanguage();

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: MessageCircle, href: 'https://wa.me/+60123456789', label: 'WhatsApp' },
  ];

  const quickLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/fleet', label: t('nav.fleet') },
    { path: '/offers', label: t('nav.offers') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <footer className="bg-navy text-white pt-16 pb-8 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/95 to-black/90" />
      
      {/* Gold accent divider */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
          {/* Brand Column */}
          <div>
            <div className="mb-6">
              <img 
                src={logoImage} 
                alt="VELO Car Rental" 
                className="h-16 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gold hover:text-navy transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold mb-6 text-lg" style={{ fontWeight: 700 }}>
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-gold transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-gold group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gold mb-6 text-lg" style={{ fontWeight: 700 }}>
              {t('footer.contact')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start text-gray-400">
                <MapPin size={20} className="text-gold mr-3 mt-1 flex-shrink-0" />
                <span className="leading-relaxed">
                  {language === 'ar' 
                    ? 'كوالالمبور، ماليزيا'
                    : 'Kuala Lumpur, Malaysia'}
                </span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone size={20} className="text-gold mr-3 flex-shrink-0" />
                <a href="tel:+60123456789" className="hover:text-gold transition-colors duration-300">
                  +60 12 345 6789
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail size={20} className="text-gold mr-3 flex-shrink-0" />
                <a href="mailto:info@veloluxury.my" className="hover:text-gold transition-colors duration-300">
                  info@veloluxury.my
                </a>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-gold mb-6 text-lg" style={{ fontWeight: 700 }}>
              {language === 'ar' ? 'ساعات العمل' : 'Operating Hours'}
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex justify-between">
                <span>{language === 'ar' ? 'الاثنين - الجمعة' : 'Monday - Friday'}</span>
                <span className="text-white" style={{ fontWeight: 600 }}>9AM - 7PM</span>
              </li>
              <li className="flex justify-between">
                <span>{language === 'ar' ? 'السبت' : 'Saturday'}</span>
                <span className="text-white" style={{ fontWeight: 600 }}>10AM - 6PM</span>
              </li>
              <li className="flex justify-between">
                <span>{language === 'ar' ? 'الأحد' : 'Sunday'}</span>
                <span className="text-white" style={{ fontWeight: 600 }}>10AM - 4PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gold/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-gold transition-colors duration-300">
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </Link>
              <Link to="/terms" className="hover:text-gold transition-colors duration-300">
                {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
    </footer>
  );
}
