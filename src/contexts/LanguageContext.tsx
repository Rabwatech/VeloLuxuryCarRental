import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.fleet': 'Fleet',
    'nav.offers': 'Offers',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'Command Attention.',
    'hero.subtitle': 'Arrive in Style.',
    'hero.description': 'Malaysia\'s premier luxury car rental experience. Elevate every journey with VELO.',
    'hero.bookNow': 'Book via WhatsApp',
    'hero.viewFleet': 'View Fleet',
    
    // Collections
    'collections.title': 'Our',
    'collections.titleHighlight': 'Collections',
    'collections.explore': 'Explore Collection',
    
    // Why Choose
    'why.title': 'Why Choose',
    'why.titleHighlight': 'VELO Luxury',
    'why.prestige.title': 'Prestige',
    'why.prestige.desc': 'Exclusive access to the world\'s most coveted luxury vehicles.',
    'why.excellence.title': 'Excellence',
    'why.excellence.desc': 'White-glove service that exceeds every expectation.',
    'why.experience.title': 'Experience',
    'why.experience.desc': 'More than a rental — it\'s your statement of power.',
    
    // Testimonials
    'testimonials.title': 'Client',
    'testimonials.titleHighlight': 'Experiences',
    
    // Car Details
    'car.bookViaWhatsApp': 'Book via WhatsApp',
    'car.specifications': 'Specifications',
    'car.highlights': 'Highlights',
    'car.chauffeur': 'Chauffeur Available',
    'car.delivery': 'Free Delivery in Kuala Lumpur',
    'car.insurance': 'Full Insurance Coverage',
    'car.experience': 'More than a drive — it\'s your statement of power.',
    'car.related': 'You May Also Like',
    'car.viewDetails': 'View Details',
    'car.perDay': '/day',
    
    // Fleet
    'fleet.title': 'Our Luxury Fleet',
    'fleet.subtitle': 'Choose Excellence',
    'fleet.showAll': 'Show All Collections',
    'fleet.year': 'Year',
    
    // Booking
    'booking.whatsappMessage': 'Hi VELO Luxury, I\'d like to inquire about renting the',
    'booking.whatsappMessageCollection': 'from your',
    'booking.whatsappMessageEnd': 'collection. Please share availability and pricing details.',
    
    // Footer
    'footer.tagline': 'Malaysia\'s premier luxury car rental experience. Command attention. Arrive in style.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact Us',
    'footer.followUs': 'Follow Us',
    'footer.copyright': '© 2025 VELO Luxury. All Rights Reserved.',
    
    // Contact
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Your Luxury Experience Awaits',
    'contact.name': 'Full Name',
    'contact.email': 'Email Address',
    'contact.phone': 'Phone Number',
    'contact.message': 'Your Message',
    'contact.send': 'Send Message',
    'contact.whatsapp': 'Message on WhatsApp',
    'contact.call': 'Call Us',
    'contact.email.label': 'Email Us',
    'contact.visit': 'Visit Us',
    
    // About
    'about.title': 'About VELO Luxury',
    'about.subtitle': 'Redefining Luxury Car Rental in Malaysia',
    
    // Offers
    'offers.title': 'Special Offers',
    'offers.subtitle': 'Exclusive Deals for Discerning Clients',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.fleet': 'الأسطول',
    'nav.offers': 'العروض',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    
    // Hero
    'hero.title': 'لفت الأنظار.',
    'hero.subtitle': 'تصل بأناقة.',
    'hero.description': 'تجربة استئجار السيارات الفاخرة الأولى في ماليزيا. ارتقِ بكل رحلة مع ڤيلو.',
    'hero.bookNow': 'احجز عبر واتساب',
    'hero.viewFleet': 'عرض الأسطول',
    
    // Collections
    'collections.title': 'مجموعاتنا',
    'collections.titleHighlight': 'الفاخرة',
    'collections.explore': 'استكشف المجموعة',
    
    // Why Choose
    'why.title': 'لماذا تختار',
    'why.titleHighlight': 'ڤيلو لوكشري',
    'why.prestige.title': 'الهيبة',
    'why.prestige.desc': 'وصول حصري إلى أفخم السيارات الفاخرة في العالم.',
    'why.excellence.title': 'التميز',
    'why.excellence.desc': 'خدمة راقية تتجاوز كل التوقعات.',
    'why.experience.title': 'التجربة',
    'why.experience.desc': 'أكثر من مجرد استئجار — إنها بيان قوتك.',
    
    // Testimonials
    'testimonials.title': 'تجارب',
    'testimonials.titleHighlight': 'العملاء',
    
    // Car Details
    'car.bookViaWhatsApp': 'احجز عبر واتساب',
    'car.specifications': 'المواصفات',
    'car.highlights': 'المميزات',
    'car.chauffeur': 'سائق خاص متاح',
    'car.delivery': 'توصيل مجاني في كوالالمبور',
    'car.insurance': 'تأمين شامل',
    'car.experience': 'أكثر من مجرد قيادة — إنها بيان قوتك.',
    'car.related': 'قد يعجبك أيضًا',
    'car.viewDetails': 'عرض التفاصيل',
    'car.perDay': '/يوم',
    
    // Fleet
    'fleet.title': 'أسطولنا الفاخر',
    'fleet.subtitle': 'اختر التميز',
    'fleet.showAll': 'عرض جميع المجموعات',
    'fleet.year': 'السنة',
    
    // Booking
    'booking.whatsappMessage': 'مرحبًا VELO Luxury، أود الاستفسار عن استئجار سيارة',
    'booking.whatsappMessageCollection': 'من مجموعة',
    'booking.whatsappMessageEnd': 'يرجى تزويدي بالتفاصيل والأسعار المتاحة.',
    
    // Footer
    'footer.tagline': 'تجربة استئجار السيارات الفاخرة الأولى في ماليزيا. لفت الأنظار. تصل بأناقة.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.contact': 'اتصل بنا',
    'footer.followUs': 'تابعنا',
    'footer.copyright': '© ٢٠٢٥ ڤيلو لوكشري. جميع الحقوق محفوظة.',
    
    // Contact
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'تجربتك الفاخرة بانتظارك',
    'contact.name': 'الاسم الكامل',
    'contact.email': 'البريد الإلكتروني',
    'contact.phone': 'رقم الهاتف',
    'contact.message': 'رسالتك',
    'contact.send': 'إرسال الرسالة',
    'contact.whatsapp': 'راسلنا على واتساب',
    'contact.call': 'اتصل بنا',
    'contact.email.label': 'راسلنا',
    'contact.visit': 'زُرنا',
    
    // About
    'about.title': 'عن ڤيلو لوكشري',
    'about.subtitle': 'إعادة تعريف استئجار السيارات الفاخرة في ماليزيا',
    
    // Offers
    'offers.title': 'العروض الخاصة',
    'offers.subtitle': 'صفقات حصرية للعملاء المميزين',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
    // Update document direction
    document.documentElement.dir = language === 'en' ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'en' ? 'ar' : 'en';
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
