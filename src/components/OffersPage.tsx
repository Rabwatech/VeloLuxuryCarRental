import { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, Car, Package, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { SEO } from './SEO';
import { OfferCard } from './OfferCard';
import {
  rangeRoverVelarOffers,
  bmw5SeriesOffers,
  comboPackages,
  firstTimeOffers,
} from '../data/offersData';
import { gtmPush } from './GoogleTagManager';
import { trackWhatsAppClick } from './MetaPixel';

type TabType = 'single' | 'combo' | 'first-time';

export function OffersPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('single');
  const whatsappNumber = '+60123456789';

  const singleOffers = [...rangeRoverVelarOffers, ...bmw5SeriesOffers];

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    gtmPush('offer_tab_change', {
      tab_type: tab,
    });
  };

  const handleWhatsAppClick = () => {
    gtmPush('whatsapp_click', {
      button_location: 'Offers Page CTA',
    });
    trackWhatsAppClick('Offers Page CTA');
    const message = language === 'en'
      ? 'Hi VELO Luxury, I\'d like to learn more about your custom packages and offers.'
      : 'مرحبًا VELO Luxury، أود معرفة المزيد عن حزمك وعروضك المخصصة.';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const tabs = [
    {
      id: 'single' as TabType,
      label: language === 'ar' ? 'عروض المركبات الفردية' : 'Single Vehicle Offers',
      icon: Car,
      count: singleOffers.length,
    },
    {
      id: 'combo' as TabType,
      label: language === 'ar' ? 'الحزم المركبة' : 'Combo Packages',
      icon: Package,
      count: comboPackages.length,
    },
    {
      id: 'first-time' as TabType,
      label: language === 'ar' ? 'عروض العملاء الجدد' : 'First-Time Offers',
      icon: Sparkles,
      count: firstTimeOffers.length,
    },
  ];

  const getActiveOffers = () => {
    switch (activeTab) {
      case 'single':
        return singleOffers;
      case 'combo':
        return comboPackages;
      case 'first-time':
        return firstTimeOffers;
      default:
        return [];
    }
  };

  return (
    <>
      <SEO
        title="Exclusive Offers | Luxury Car Rental Packages Kuala Lumpur | VELO Luxury"
        description="Discover exclusive luxury car rental offers in Kuala Lumpur. Daily, weekend, weekly, and monthly packages for Range Rover Velar and BMW 5-Series. Combo packages, wedding deals, and first-time customer specials available."
        keywords="luxury car rental offers Kuala Lumpur, car rental packages Malaysia, Range Rover Velar rental KL, BMW 5-Series rental, combo car packages, wedding car rental, monthly car subscription"
        image="https://images.unsplash.com/photo-1659596513612-23f9db4984aa?auto=format&fit=crop&w=1200"
        url="/offers"
      />
      <div className={`min-h-screen pt-20 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-navy to-navy/90 py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold to-gold-light rounded-full mb-6">
                <Gift size={40} className="text-navy" />
              </div>
              <h1 className="text-5xl md:text-6xl text-white mb-6" style={{ fontWeight: 700, textShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                {language === 'ar' ? 'عروضنا' : 'Our Exclusive'} <span className="text-gold">{language === 'ar' ? 'الحصرية' : 'Offers'}</span>
              </h1>
              <p className="text-xl text-white max-w-2xl mx-auto" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
                {language === 'ar'
                  ? 'اكتشف حزمنا المميزة لتأجير السيارات الفاخرة في كوالالمبور'
                  : 'Discover our premium luxury car rental packages in Kuala Lumpur'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <section className="py-8 px-4 bg-white shadow-md sticky top-20 z-30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-gold to-gold-light text-navy shadow-lg shadow-gold/30'
                        : 'bg-beige text-navy hover:bg-gold/20 border border-gold/30'
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      isActive ? 'bg-navy/20 text-navy' : 'bg-gold/20 text-navy'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Offers Grid */}
        <section className="py-24 px-4 bg-gray-light">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl text-navy mb-4" style={{ fontWeight: 700 }}>
                {activeTab === 'single' && (language === 'ar' ? 'عروض المركبات الفردية' : 'Single Vehicle Offers')}
                {activeTab === 'combo' && (language === 'ar' ? 'الحزم المركبة' : 'Combo Packages')}
                {activeTab === 'first-time' && (language === 'ar' ? 'عروض العملاء الجدد' : 'First-Time Customer Offers')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {activeTab === 'single' && (language === 'ar'
                  ? 'اختر من بين عروضنا اليومية والأسبوعية والشهرية'
                  : 'Choose from our daily, weekly, and monthly rental packages')}
                {activeTab === 'combo' && (language === 'ar'
                  ? 'حزم متميزة تجمع بين مركبتين فاخرتين'
                  : 'Premium packages combining two luxury vehicles')}
                {activeTab === 'first-time' && (language === 'ar'
                  ? 'عروض حصرية للعملاء الجدد'
                  : 'Exclusive offers for new customers')}
              </p>
              <div className="w-24 h-1 bg-gold mx-auto mt-6" />
            </motion.div>

            {/* Offers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getActiveOffers().map((offer, index) => (
                <OfferCard key={offer.id} offer={offer} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-navy px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Gift size={48} className="text-gold mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl text-white mb-6" style={{ fontWeight: 700 }}>
                {language === 'ar' ? 'تحتاج' : 'Need a'} <span className="text-gold">{language === 'ar' ? 'حزمة مخصصة؟' : 'Custom Package?'}</span>
              </h2>
              <p className="text-xl text-gray-200 mb-8">
                {language === 'ar'
                  ? 'اتصل بفريق الـكونسيرج لدينا لإنشاء عرض مخصص حسب احتياجاتك الخاصة. الفعاليات الشركات، الأعراس، أو التأجيرات الممتدة - سنصمم الحل المثالي.'
                  : 'Contact our concierge team to create a bespoke offer tailored to your specific needs. Corporate events, weddings, or extended rentals—we\'ll craft the perfect solution.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleWhatsAppClick}
                  className="bg-gradient-to-r from-gold to-gold-light text-navy px-8 py-6 rounded-lg hover:shadow-2xl transition-all duration-300"
                  style={{ fontWeight: 600, fontSize: '1.125rem' }}
                >
                  <MessageCircle size={20} className="mr-2" />
                  {language === 'ar' ? 'اتصل بالكونسيرج' : 'Contact Concierge'}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
