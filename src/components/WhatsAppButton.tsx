import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { gtmPush } from './GoogleTagManager';
import { trackWhatsAppClick } from './MetaPixel';

export function WhatsAppButton() {
  const { language } = useLanguage();
  
  const whatsappNumber = '+60123456789'; // Replace with actual WhatsApp number
  const whatsappMessage = encodeURIComponent(
    language === 'en' 
      ? 'Hi VELO Luxury, I would like to inquire about your luxury car rental services.'
      : 'مرحبًا VELO Luxury، أود الاستفسار عن خدمات تأجير السيارات الفاخرة.'
  );

  const handleClick = () => {
    gtmPush('whatsapp_click', {
      button_location: 'Floating Button',
    });
    trackWhatsAppClick('Floating Button');
  };

  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:shadow-[#25D366]/50 transition-all duration-300 hover:scale-110 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ rotate: 10 }}
      whileTap={{ scale: 0.9 }}
    >
      <MessageCircle size={28} className="text-white" />
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-4 py-2 bg-navy text-white rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm" style={{ fontWeight: 600 }}>
        {language === 'en' ? 'Chat with us on WhatsApp' : 'تحدث معنا على واتساب'}
      </span>
    </motion.a>
  );
}
