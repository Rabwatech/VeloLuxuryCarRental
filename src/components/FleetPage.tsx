import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Car, Users, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { carsData, collections } from '../data/carsData';
import { SEO } from './SEO';

export function FleetPage() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const { language, t } = useLanguage();

  const filteredFleet = selectedCollection
    ? carsData.filter((car) => car.collection === selectedCollection)
    : carsData;

  return (
    <>
      <SEO
        title="Luxury Car Fleet Kuala Lumpur | Premium Vehicles | VELO Luxury"
        description="Explore our complete luxury car fleet in Kuala Lumpur. Choose from Mercedes-Benz, BMW, Lamborghini, Range Rover, and more. Premium vehicles available for rent. View all collections."
        keywords="luxury car fleet Kuala Lumpur, premium car collection KL, luxury vehicles Malaysia, Mercedes fleet KL, BMW rental fleet, luxury car rental collection"
        image="https://images.unsplash.com/photo-1599912027667-755b68b4dd3b?auto=format&fit=crop&w=1200"
        url="/fleet"
      />
      <div className={`min-h-screen pt-20 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Hero Banner */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1599912027667-755b68b4dd3b?auto=format&fit=crop&w=2000"
            alt="Luxury Car Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/90 to-navy/80" />
        </div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl text-white mb-4" style={{ fontWeight: 700, textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
              {language === 'ar' ? 'استكشف' : 'Explore Our'} <span className="text-gold">{language === 'ar' ? 'المجموعات' : 'Collections'}</span>
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
              {language === 'ar' 
                ? 'من الأعمال إلى الأدرينالين، لدينا القيادة المثالية'
                : 'From business to adrenaline, we have the perfect drive'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Horizontal Pill Filters */}
      <section className="py-12 px-4 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCollection(null)}
              className={`px-8 py-3 rounded-full transition-all duration-300 ${
                selectedCollection === null
                  ? 'bg-gold text-white shadow-lg shadow-gold/30'
                  : 'bg-beige text-navy hover:bg-gold/20 border border-gold/30'
              }`}
              style={{ fontWeight: 600 }}
            >
              {language === 'ar' ? 'الكل' : 'All Collections'}
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
          </div>
        </div>
      </section>

      {/* All Vehicles Grid */}
      <section className="py-24 px-4 bg-beige">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <h2 className="text-4xl text-navy mb-4 md:mb-0" style={{ fontWeight: 700 }}>
              {selectedCollection 
                ? `${language === 'ar' 
                    ? collections.find(c => c.id === selectedCollection)?.titleAr 
                    : collections.find(c => c.id === selectedCollection)?.title} ${language === 'ar' ? 'المجموعة' : 'Collection'}`
                : language === 'ar' ? 'جميع السيارات' : 'All Vehicles'}
            </h2>
            <p className="text-gray-600">
              {filteredFleet.length} {language === 'ar' ? 'سيارة' : 'vehicles'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFleet.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <Link to={`/car/${car.id}`}>
                    <ImageWithFallback
                      src={car.image}
                      alt={language === 'ar' ? car.nameAr : car.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </Link>
                  <div className="absolute top-4 right-4 bg-gold/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm" style={{ fontWeight: 600 }}>
                    {language === 'ar' ? car.collectionNameAr : car.collectionName}
                  </div>
                  <div className="absolute top-4 left-4 bg-navy/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm" style={{ fontWeight: 600 }}>
                    {car.year}
                  </div>
                </div>

                <div className="p-6">
                  <Link to={`/car/${car.id}`}>
                    <h3 className="text-2xl text-navy mb-4 group-hover:text-gold transition-colors duration-300" style={{ fontWeight: 600 }}>
                      {language === 'ar' ? car.nameAr : car.name}
                    </h3>
                  </Link>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users size={18} className="text-gold" />
                      <span>{car.seats} {language === 'ar' ? 'مقاعد' : 'Seats'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Car size={18} className="text-gold" />
                      <span>{language === 'ar' ? car.transmissionAr : car.transmission}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 col-span-2">
                      <Zap size={18} className="text-gold" />
                      <span>{car.power}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <span className="text-3xl text-navy" style={{ fontWeight: 700 }}>RM{car.price}</span>
                      <span className="text-gray-500">{t('car.perDay')}</span>
                    </div>
                    <Link to={`/car/${car.id}`}>
                      <Button className="bg-gradient-to-r from-gold to-gold-light text-white hover:shadow-xl transition-all duration-300">
                        {language === 'ar' ? 'احجز' : 'Book'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
