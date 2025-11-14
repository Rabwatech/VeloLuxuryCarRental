import { motion } from 'motion/react';
import { Check, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Offer } from '../data/offersData';
import { useLanguage } from '../contexts/LanguageContext';
import { gtmPush } from './GoogleTagManager';
import { trackWhatsAppClick } from './MetaPixel';

interface OfferCardProps {
  offer: Offer;
  index?: number;
}

const badgeColorMap = {
  gold: 'bg-gradient-to-r from-gold to-gold-light text-navy',
  green: 'bg-green-500 text-white',
  red: 'bg-red-500 text-white',
  blue: 'bg-blue-500 text-white',
};

export function OfferCard({ offer, index = 0 }: OfferCardProps) {
  const { language } = useLanguage();
  const whatsappNumber = '+60123456789';

  const title = language === 'ar' && offer.titleAr ? offer.titleAr : offer.title;
  const subtitle = language === 'ar' && offer.subtitleAr ? offer.subtitleAr : offer.subtitle;
  const description = language === 'ar' && offer.descriptionAr ? offer.descriptionAr : offer.description;
  const bestFor = language === 'ar' && offer.bestForAr ? offer.bestForAr : offer.bestFor;
  const specialNote = language === 'ar' && offer.specialNoteAr ? offer.specialNoteAr : offer.specialNote;
  const whatsappMessage = language === 'ar' && offer.whatsappMessageAr ? offer.whatsappMessageAr : offer.whatsappMessage;
  const ctaText = language === 'ar' && offer.ctaTextAr ? offer.ctaTextAr : (offer.ctaText || 'Book Now');

  const handleWhatsAppClick = () => {
    gtmPush('offer_click', {
      offer_id: offer.id,
      offer_type: offer.type,
      offer_title: title,
    });
    trackWhatsAppClick(`Offer: ${title}`);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
    >
      {/* Image */}
      {offer.image && (
        <div className="relative h-64 overflow-hidden">
          <ImageWithFallback
            src={offer.image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
          
          {/* Badge */}
          {offer.badge && (
            <div className={`absolute top-4 right-4 px-4 py-2 rounded-full ${badgeColorMap[offer.badgeColor || 'gold']}`} style={{ fontWeight: 700 }}>
              {offer.badge}
            </div>
          )}

          {/* Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl text-white mb-1" style={{ fontWeight: 700 }}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-gold">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Pricing Section */}
        <div className="mb-6">
          {offer.price > 0 ? (
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl text-navy" style={{ fontWeight: 800 }}>
                {formatPrice(offer.price)}
              </span>
              {offer.priceLabel && (
                <span className="text-gray-600 text-lg">
                  {offer.priceLabel}
                </span>
              )}
            </div>
          ) : (
            <div className="mb-2">
              <span className="text-3xl text-gold" style={{ fontWeight: 800 }}>
                {offer.savings && formatPrice(offer.savings)}
              </span>
              {offer.priceLabel && (
                <span className="text-gray-600 text-lg ml-2">
                  {offer.priceLabel}
                </span>
              )}
            </div>
          )}

          {/* Regular Price & Savings */}
          {offer.regularPrice && offer.price > 0 && (
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(offer.regularPrice)}
              </span>
              {offer.savings && (
                <Badge className="bg-green-500 text-white">
                  Save {formatPrice(offer.savings)}
                  {offer.savingsPercent && ` (${offer.savingsPercent}% off)`}
                </Badge>
              )}
            </div>
          )}

          {/* Duration */}
          <p className="text-gray-600 text-sm">
            {language === 'ar' && offer.durationAr ? offer.durationAr : offer.duration}
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>

        {/* What's Included */}
        <div className="mb-6">
          <h4 className="text-navy mb-3" style={{ fontWeight: 600 }}>
            {language === 'ar' ? 'ما المشمول:' : 'What\'s Included:'}
          </h4>
          <ul className="space-y-2">
            {offer.includes.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check size={18} className="text-gold flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">
                  {language === 'ar' && item.textAr ? item.textAr : item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Best For */}
        <div className="mb-4 p-3 bg-beige rounded-lg">
          <div className="flex items-start gap-2">
            <Sparkles size={18} className="text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-navy text-sm" style={{ fontWeight: 600 }}>
                {language === 'ar' ? 'الأفضل لـ:' : 'Best for:'}
              </p>
              <p className="text-gray-600 text-sm mt-1">{bestFor}</p>
            </div>
          </div>
        </div>

        {/* Special Note */}
        {specialNote && (
          <div className="mb-4 p-3 bg-gold/10 border border-gold/30 rounded-lg">
            <p className="text-navy text-sm" style={{ fontWeight: 600 }}>
              {language === 'ar' ? 'ملاحظة خاصة:' : 'Special Note:'}
            </p>
            <p className="text-gray-700 text-sm mt-1">{specialNote}</p>
          </div>
        )}

        {/* Vehicles (for combo packages) */}
        {offer.vehicles && offer.vehicles.length > 0 && (
          <div className="mb-4 p-3 bg-navy/5 rounded-lg">
            <p className="text-navy text-sm mb-2" style={{ fontWeight: 600 }}>
              {language === 'ar' ? 'المركبات:' : 'Vehicles:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {offer.vehicles.map((vehicle, idx) => (
                <Badge key={idx} variant="outline" className="border-gold text-gold">
                  {vehicle}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Button
          onClick={handleWhatsAppClick}
          className="w-full bg-gradient-to-r from-gold to-gold-light text-navy hover:shadow-xl transition-all duration-300 py-6 text-lg"
          style={{ fontWeight: 600 }}
        >
          <MessageCircle size={20} className="mr-2" />
          {ctaText}
        </Button>
      </div>
    </motion.div>
  );
}

