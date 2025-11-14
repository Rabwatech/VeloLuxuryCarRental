import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Users, Zap, Gauge, Car as CarIcon, Shield, MapPin, UserCheck, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { carsData } from '../data/carsData';
import { SEO } from './SEO';
import { StructuredData, createProductSchema } from './StructuredData';
import { gtmPush } from './GoogleTagManager';
import { trackCarView, trackWhatsAppClick, trackBookingInquiry } from './MetaPixel';

export function CarDetailPage() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const car = carsData.find((c) => c.id === id);

  if (!car) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl text-navy mb-4">Car not found</h2>
          <Link to="/fleet">
            <Button>Back to Fleet</Button>
          </Link>
        </div>
      </div>
    );
  }

  const carName = language === 'ar' ? car.nameAr : car.name;
  const collectionName = language === 'ar' ? car.collectionNameAr : car.collectionName;
  const description = language === 'ar' ? car.descriptionAr : car.description;

  const whatsappNumber = '+60123456789';
  const whatsappMessage = encodeURIComponent(
    language === 'en'
      ? `Hi VELO Luxury, I'd like to inquire about renting the ${car.name} from your ${car.collectionName} collection. Please share availability and pricing details.`
      : `مرحبًا VELO Luxury، أود الاستفسار عن استئجار سيارة ${car.nameAr} من مجموعة ${car.collectionNameAr}. يرجى تزويدي بالتفاصيل والأسعار المتاحة.`
  );

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  const relatedCars = carsData.filter((c) => c.id !== id && c.collection === car.collection).slice(0, 3);

  const highlights = [
    {
      icon: UserCheck,
      title: language === 'ar' ? 'سائق خاص متاح' : 'Chauffeur Available',
    },
    {
      icon: MapPin,
      title: language === 'ar' ? 'توصيل مجاني في كوالالمبور' : 'Free Delivery in Kuala Lumpur',
    },
    {
      icon: Shield,
      title: language === 'ar' ? 'تأمين شامل' : 'Full Insurance Coverage',
    },
  ];

  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const carUrl = `${siteUrl}/car/${car.id}`;
  const brand = car.name.split(' ')[0]; // Extract brand from car name (e.g., "Mercedes-Benz" from "Mercedes-Benz S-Class")
  const productSchema = createProductSchema(
    carName,
    description,
    car.images.length > 0 ? car.images : [car.image],
    car.price,
    brand,
    carUrl
  );

  // Track car view on page load
  useEffect(() => {
    if (car) {
      gtmPush('car_view', {
        car_id: car.id,
        car_name: carName,
        car_collection: car.collection,
        car_price: car.price,
      });
      trackCarView(carName);
    }
  }, [car, carName]);

  const handleWhatsAppClick = () => {
    gtmPush('whatsapp_click', {
      button_location: 'Car Detail Page',
      car_id: car.id,
      car_name: carName,
    });
    trackWhatsAppClick('Car Detail Page');
    trackBookingInquiry(carName);
  };

  return (
    <>
      <SEO
        title={`${carName} Rental Kuala Lumpur | RM${car.price}/day | VELO Luxury`}
        description={`Rent ${carName} in Kuala Lumpur from VELO Luxury. ${description} Starting at RM${car.price}/day. Free delivery in KL. Chauffeur available. Book via WhatsApp.`}
        keywords={`${carName} rental Kuala Lumpur, ${brand} rental KL, luxury ${carName} hire Malaysia, ${car.collectionName} collection, VELO Luxury`}
        image={car.images.length > 0 ? car.images[0] : car.image}
        url={`/car/${car.id}`}
      />
      <StructuredData type="Product" data={productSchema} />
      <div className={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Hero Gallery */}
      <section className="relative h-screen bg-navy overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <ImageWithFallback
              src={car.images[currentImageIndex]}
              alt={`${carName} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/80 to-navy/40" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10 w-14 h-14 bg-white/10 backdrop-blur-md hover:bg-gold transition-all duration-300 rounded-full flex items-center justify-center group"
        >
          <ChevronLeft size={28} className="text-white group-hover:text-navy" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10 w-14 h-14 bg-white/10 backdrop-blur-md hover:bg-gold transition-all duration-300 rounded-full flex items-center justify-center group"
        >
          <ChevronRight size={28} className="text-white group-hover:text-navy" />
        </button>

        {/* Car Name Overlay */}
        <div className="absolute bottom-20 left-0 right-0 z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="inline-block bg-gold text-navy px-6 py-2 rounded-full mb-4 shadow-xl" style={{ fontWeight: 600 }}>
              {car.year}
            </div>
            <h1 className="text-5xl md:text-7xl text-white mb-4" style={{ fontWeight: 800, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              {carName}
            </h1>
            <p className="text-gold text-xl md:text-2xl" style={{ fontWeight: 600, textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
              {collectionName}
            </p>
          </motion.div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {car.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-gold w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Car Overview Section */}
      <section className="py-24 px-4 bg-beige">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image Carousel Thumbnails */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                {car.images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
                      index === currentImageIndex ? 'ring-4 ring-gold' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${carName} view ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Details & WhatsApp CTA */}
            <motion.div
              initial={{ opacity: 0, x: language === 'ar' ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-4xl md:text-5xl text-navy mb-4" style={{ fontWeight: 800 }}>
                  {carName}
                </h2>
                <p className="text-gold text-xl mb-2" style={{ fontWeight: 600 }}>
                  {collectionName} • {car.year}
                </p>
              </div>

              <p className="text-charcoal text-lg leading-relaxed">
                {description}
              </p>

              {/* Price */}
              <div className="py-6 border-y border-gold/20">
                <div className="flex items-baseline">
                  <span className="text-5xl text-navy" style={{ fontWeight: 800 }}>
                    RM{car.price}
                  </span>
                  <span className="text-gray-600 text-xl ml-2">{t('car.perDay')}</span>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="block"
              >
                <Button className="w-full bg-gold text-white py-6 rounded-xl hover:shadow-2xl hover:shadow-gold/50 transition-all duration-300 hover:scale-105 text-lg group">
                  <MessageCircle size={24} className="mr-2 group-hover:rotate-12 transition-transform" />
                  {t('car.bookViaWhatsApp')}
                </Button>
              </a>

              <p className="text-sm text-gray-600 text-center">
                {language === 'ar' 
                  ? 'احجز الآن واحصل على تجربة VIP كاملة'
                  : 'Book now and get a complete VIP experience'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl text-navy mb-12 text-center"
            style={{ fontWeight: 800 }}
          >
            {t('car.specifications')}
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-beige p-6 rounded-xl text-center hover:shadow-xl transition-shadow duration-300"
            >
              <CarIcon size={32} className="text-gold mx-auto mb-3" />
              <p className="text-gray-600 mb-2 text-sm">{language === 'ar' ? 'المحرك' : 'Engine'}</p>
              <p className="text-navy text-lg" style={{ fontWeight: 700 }}>
                {language === 'ar' ? car.specs.engineAr : car.specs.engine}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-beige p-6 rounded-xl text-center hover:shadow-xl transition-shadow duration-300"
            >
              <Gauge size={32} className="text-gold mx-auto mb-3" />
              <p className="text-gray-600 mb-2 text-sm">{language === 'ar' ? 'ناقل الحركة' : 'Transmission'}</p>
              <p className="text-navy text-lg" style={{ fontWeight: 700 }}>
                {language === 'ar' ? car.specs.transmissionAr : car.specs.transmission}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-beige p-6 rounded-xl text-center hover:shadow-xl transition-shadow duration-300"
            >
              <Users size={32} className="text-gold mx-auto mb-3" />
              <p className="text-gray-600 mb-2 text-sm">{language === 'ar' ? 'المقاعد' : 'Seats'}</p>
              <p className="text-navy text-lg" style={{ fontWeight: 700 }}>
                {car.specs.seats}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-beige p-6 rounded-xl text-center hover:shadow-xl transition-shadow duration-300"
            >
              <Zap size={32} className="text-gold mx-auto mb-3" />
              <p className="text-gray-600 mb-2 text-sm">{language === 'ar' ? 'القوة' : 'Power'}</p>
              <p className="text-navy text-lg" style={{ fontWeight: 700 }}>
                {car.specs.power}
              </p>
            </motion.div>
          </div>

          {/* Performance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-navy to-navy/90 p-8 rounded-2xl text-white text-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Gauge size={40} className="text-gold mx-auto mb-3" />
                <p className="text-gold mb-2" style={{ fontWeight: 600 }}>
                  {language === 'ar' ? 'السرعة القصوى' : 'Top Speed'}
                </p>
                <p className="text-3xl" style={{ fontWeight: 800 }}>
                  {car.specs.topSpeed}
                </p>
              </div>
              <div>
                <Zap size={40} className="text-gold mx-auto mb-3" />
                <p className="text-gold mb-2" style={{ fontWeight: 600 }}>
                  {language === 'ar' ? 'التسارع' : 'Acceleration'}
                </p>
                <p className="text-3xl" style={{ fontWeight: 800 }}>
                  {car.specs.acceleration}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 px-4 bg-beige">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl text-navy mb-12 text-center"
            style={{ fontWeight: 800 }}
          >
            {t('car.highlights')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gold rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <highlight.icon size={36} className="text-white" />
                </div>
                <p className="text-navy text-xl" style={{ fontWeight: 700 }}>
                  {highlight.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Statement */}
      <section className="py-24 px-4 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl text-white mb-8 leading-relaxed"
            style={{ fontWeight: 800 }}
          >
            {t('car.experience')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-1 w-32 bg-gold mx-auto"
          />
        </div>
      </section>

      {/* Related Cars */}
      {relatedCars.length > 0 && (
        <section className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl text-navy mb-12 text-center"
              style={{ fontWeight: 800 }}
            >
              {t('car.related')}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedCars.map((relatedCar, index) => (
                <motion.div
                  key={relatedCar.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/car/${relatedCar.id}`} className="group block">
                    <div className="relative overflow-hidden rounded-2xl shadow-xl">
                      <ImageWithFallback
                        src={relatedCar.image}
                        alt={language === 'ar' ? relatedCar.nameAr : relatedCar.name}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl mb-2" style={{ fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
                          {language === 'ar' ? relatedCar.nameAr : relatedCar.name}
                        </h3>
                        <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
                          {t('car.viewDetails')}
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl text-navy" style={{ fontWeight: 700 }}>
                        {language === 'ar' ? relatedCar.nameAr : relatedCar.name}
                      </h3>
                      <p className="text-gold" style={{ fontWeight: 600 }}>
                        RM{relatedCar.price}{t('car.perDay')}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
    </>
  );
}
