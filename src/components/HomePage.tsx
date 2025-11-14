import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Shield, Award, Sparkles, MessageCircle, ChevronLeft, ChevronRight, Car } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../contexts/LanguageContext';
import { carsData, collections } from '../data/carsData';
import { SEO } from './SEO';
import { StructuredData, createLocalBusinessSchema, createOrganizationSchema, createServiceSchema } from './StructuredData';
import { FAQ } from './FAQ';
import { gtmPush } from './GoogleTagManager';
import { trackWhatsAppClick, trackFleetView } from './MetaPixel';

const testimonials = [
  {
    id: 1,
    quote: "The Range Rover Vogue exceeded all expectations. Flawless service from start to finish. VELO Luxury is the only choice for discerning clients.",
    quoteAr: "رينج روفر فوج تجاوزت كل التوقعات. خدمة لا تشوبها شائبة من البداية إلى النهاية. ڤيلو لوكشري هو الخيار الوحيد للعملاء المميزين.",
    name: "Dato' A******* R.",
    rating: 5,
  },
  {
    id: 2,
    quote: "Impeccable attention to detail. The Lamborghini Huracán made our wedding unforgettable. Truly a world-class experience.",
    quoteAr: "اهتمام لا تشوبه شائبة بالتفاصيل. لامبورغيني هوراكان جعلت زفافنا لا ينسى. تجربة عالمية المستوى حقًا.",
    name: "Mr. J*** T.",
    rating: 5,
  },
  {
    id: 3,
    quote: "Professional, luxurious, and seamless. VELO Luxury understands what high-end service means. We'll be back.",
    quoteAr: "احتراف��ة، فاخرة، وسلسة. ڤيلو لوكشري تفهم معنى الخدمة الراقية. سنعود بالتأكيد.",
    name: "Ms. S**** L.",
    rating: 5,
  },
];

export function HomePage() {
  const { language, t } = useLanguage();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedCollection, setSelectedCollection] = useState<string>('all');

  const whatsappNumber = '+60123456789';
  const whatsappMessage = encodeURIComponent(
    language === 'en' 
      ? 'Hi VELO Luxury, I would like to inquire about your luxury car rental services.'
      : 'مرحبًا VELO Luxury، أود الاستفسار عن خدمات تأجير السيارات الفاخرة.'
  );

  // Filter cars based on selected collection
  const filteredCars = selectedCollection === 'all' 
    ? carsData.slice(0, 6) // Show 6 cars when "All" is selected
    : carsData.filter(car => car.collection === selectedCollection);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleWhatsAppClick = (source: string) => {
    gtmPush('whatsapp_click', {
      button_location: source,
    });
    trackWhatsAppClick(source);
  };

  return (
    <>
      <SEO
        title="Premium Luxury Car Rental in Kuala Lumpur | VELO Luxury"
        description="VELO Luxury offers premium car rental services in Kuala Lumpur, Malaysia. Rent luxury vehicles including Mercedes-Benz, BMW, Lamborghini, Range Rover, and more. Book via WhatsApp today. Free delivery in KL."
        keywords="luxury car rental Kuala Lumpur, premium car rental Malaysia, luxury vehicle rental KL, car hire Kuala Lumpur, VELO Luxury, Mercedes rental KL, BMW rental Malaysia, Lamborghini rental"
        image="https://images.unsplash.com/photo-1659596513612-23f9db4984aa?auto=format&fit=crop&w=1200"
        url="/"
      />
      <StructuredData type="LocalBusiness" data={createLocalBusinessSchema()} />
      <StructuredData type="Organization" data={createOrganizationSchema()} />
      <StructuredData type="Service" data={createServiceSchema()} />
      <div className={`min-h-screen ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1659596513612-23f9db4984aa?auto=format&fit=crop&w=2000"
            alt="Luxury Car"
            className="w-full h-full object-cover"
          />
          {/* Strong overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/70" />
          {/* Gold accent overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-gold/10" />
        </div>

        {/* Parallax effect decoration */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 text-white leading-tight drop-shadow-2xl" style={{ fontWeight: 800, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              {t('hero.title')}
              <br />
              <span className="text-gold inline-block" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.7)' }}>{t('hero.subtitle')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleWhatsAppClick('Homepage Hero')}
              >
                <Button className="bg-gold text-white px-10 py-7 rounded-xl hover:shadow-2xl hover:shadow-gold/50 transition-all duration-300 hover:scale-105 group" style={{ fontWeight: 700, fontSize: '1.125rem' }}>
                  <MessageCircle size={24} className="mr-2 group-hover:rotate-12 transition-transform" />
                  {t('hero.bookNow')}
                </Button>
              </a>
              <Link to="/fleet">
                <Button variant="outline" className="border-2 border-gold text-gold px-10 py-7 rounded-xl hover:bg-gold hover:text-white transition-all duration-300 hover:scale-105" style={{ fontWeight: 700, fontSize: '1.125rem' }}>
                  {t('hero.viewFleet')}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center pt-2">
              <div className="w-1 h-3 bg-gold rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fleet Filter Preview Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-6xl text-navy mb-4" style={{ fontWeight: 800 }}>
              {language === 'ar' ? 'أسطولنا' : 'Our Luxury'} <span className="text-gold">{language === 'ar' ? 'الفاخر' : 'Fleet'}</span>
            </h2>
            <p className="text-xl text-charcoal max-w-2xl mx-auto mb-6">
              {language === 'ar' 
                ? 'اختر مجموعتك واكتشف القيادة المثالية'
                : 'Choose your collection and discover your perfect drive'}
            </p>
            <div className="w-24 h-1 bg-gold mx-auto" />
          </motion.div>

          {/* Horizontal Pill Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            <button
              onClick={() => setSelectedCollection('all')}
              className={`px-8 py-3 rounded-full transition-all duration-300 ${
                selectedCollection === 'all'
                  ? 'bg-gold text-white shadow-lg shadow-gold/30'
                  : 'bg-beige text-navy hover:bg-gold/20 border border-gold/30'
              }`}
              style={{ fontWeight: 600 }}
            >
              {language === 'ar' ? 'الكل' : 'All'}
            </button>
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => setSelectedCollection(collection.id)}
                className={`px-8 py-3 rounded-full transition-all duration-300 ${
                  selectedCollection === collection.id
                    ? 'bg-gold text-white shadow-lg shadow-gold/30'
                    : 'bg-beige text-navy hover:bg-gold/20 border border-gold/30'
                }`}
                style={{ fontWeight: 600 }}
              >
                {language === 'ar' ? collection.titleAr : collection.title}
              </button>
            ))}
          </motion.div>

          {/* Cars Grid - Dynamic */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Car Image */}
                <div className="relative h-64 overflow-hidden">
                  <Link to={`/car/${car.id}`}>
                    <ImageWithFallback
                      src={car.image}
                      alt={language === 'ar' ? car.nameAr : car.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </Link>
                  {/* Collection Badge */}
                  <div className="absolute top-4 right-4 bg-gold/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm" style={{ fontWeight: 600 }}>
                    {language === 'ar' ? car.collectionNameAr : car.collectionName}
                  </div>
                  {/* Year Badge */}
                  <div className="absolute top-4 left-4 bg-navy/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm" style={{ fontWeight: 600 }}>
                    {car.year}
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <Link to={`/car/${car.id}`}>
                      <Button variant="outline" className="border-2 border-gold text-gold hover:bg-gold hover:text-white">
                        {t('car.viewDetails')}
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Car Details */}
                <div className="p-6">
                  <Link to={`/car/${car.id}`}>
                    <h3 className="text-2xl text-navy mb-2 group-hover:text-gold transition-colors duration-300" style={{ fontWeight: 700 }}>
                      {language === 'ar' ? car.nameAr : car.name}
                    </h3>
                  </Link>

                  {/* Quick Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Car size={16} className="text-gold mr-1" />
                      {car.transmission}
                    </span>
                    <span>•</span>
                    <span>{car.power}</span>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <span className="text-3xl text-navy" style={{ fontWeight: 800 }}>
                        RM{car.price}
                      </span>
                      <span className="text-gray-500">{t('car.perDay')}</span>
                    </div>
                    <Link to={`/car/${car.id}`}>
                      <Button className="bg-gold text-white hover:bg-gold-light transition-all duration-300 hover:scale-105">
                        {language === 'ar' ? 'احجز' : 'Book'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Fleet CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link to="/fleet">
              <Button 
                variant="outline" 
                className="border-2 border-navy text-navy hover:bg-navy hover:text-white px-10 py-6 rounded-xl transition-all duration-300 hover:scale-105"
                style={{ fontWeight: 700, fontSize: '1.125rem' }}
              >
                {language === 'ar' ? 'عرض الأسطول الكامل' : 'View Complete Fleet'}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose VELO */}
      <section className="py-24 px-4 bg-beige">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl text-navy mb-4" style={{ fontWeight: 800 }}>
              {t('why.title')} <span className="text-gold">{t('why.titleHighlight')}</span>
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Star, title: t('why.prestige.title'), description: t('why.prestige.desc') },
              { icon: Award, title: t('why.excellence.title'), description: t('why.excellence.desc') },
              { icon: Sparkles, title: t('why.experience.title'), description: t('why.experience.desc') },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl text-center hover:shadow-2xl transition-all duration-300 group hover:scale-105"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gold rounded-full mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-xl">
                  <item.icon size={36} className="text-white" />
                </div>
                <h3 className="text-2xl text-navy mb-4" style={{ fontWeight: 700 }}>{item.title}</h3>
                <p className="text-charcoal leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-navy px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl text-white mb-4" style={{ fontWeight: 800 }}>
              {t('testimonials.title')} <span className="text-gold">{t('testimonials.titleHighlight')}</span>
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto mt-6" />
          </motion.div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 min-h-80 flex items-center">
              <div className="text-center w-full">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} size={24} className="text-gold fill-gold" />
                  ))}
                </div>
                <motion.p
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl md:text-2xl text-white mb-8 leading-relaxed italic"
                >
                  "{language === 'ar' ? testimonials[currentTestimonial].quoteAr : testimonials[currentTestimonial].quote}"
                </motion.p>
                <p className="text-gold text-lg" style={{ fontWeight: 700 }}>
                  {testimonials[currentTestimonial].name}
                </p>
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-gold rounded-full flex items-center justify-center hover:bg-gold-light transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-gold rounded-full flex items-center justify-center hover:bg-gold-light transition-all duration-300 hover:scale-110"
            >
              <ChevronRight size={24} className="text-white" />
            </button>

            {/* Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-gold w-8' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-gold via-gold-light to-gold relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl text-navy mb-6" style={{ fontWeight: 800 }}>
              {language === 'ar' ? 'جاهز للقيادة؟' : 'Ready to Drive?'}
            </h2>
            <p className="text-xl text-navy/80 mb-10 leading-relaxed">
              {language === 'ar' 
                ? 'احجز تجربة الفخامة الخاصة بك اليوم عبر واتساب' 
                : 'Book your luxury experience today via WhatsApp'}
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleWhatsAppClick('Homepage CTA')}
            >
              <Button className="bg-navy text-white px-12 py-7 rounded-xl hover:shadow-2xl hover:shadow-navy/50 transition-all duration-300 hover:scale-105 group" style={{ fontWeight: 700, fontSize: '1.25rem' }}>
                <MessageCircle size={28} className="mr-3 group-hover:rotate-12 transition-transform" />
                {t('hero.bookNow')}
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}
