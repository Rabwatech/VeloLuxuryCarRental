import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Award, Shield, Users, Sparkles, Target, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SEO } from './SEO';
import { StructuredData, createOrganizationSchema } from './StructuredData';

const values = [
  {
    icon: Sparkles,
    title: 'Prestige',
    description: 'Every vehicle in our fleet represents the absolute pinnacle of automotive excellence. We curate only the finest luxury cars that command attention and respect.',
  },
  {
    icon: Shield,
    title: 'Excellence',
    description: 'Our commitment to flawless service is unwavering. From the moment you inquire to the moment you return, expect nothing less than perfection in every detail.',
  },
  {
    icon: Heart,
    title: 'Experience',
    description: "We don't just rent luxury cars—we create unforgettable journeys. Each rental is an opportunity to make a statement, celebrate a milestone, or simply indulge in excellence.",
  },
];

const reasons = [
  {
    icon: Award,
    title: 'Unmatched Personalization',
    description: 'Every client receives bespoke service tailored to their exact needs. From vehicle selection to delivery timing, we adapt to you.',
  },
  {
    icon: Target,
    title: 'Seamless Booking',
    description: 'Our intuitive platform makes reserving your dream car effortless. Book online in minutes or speak with our concierge team for personalized assistance.',
  },
  {
    icon: Users,
    title: 'Curated Fleet',
    description: 'Only the latest models from the world\'s most prestigious manufacturers. Meticulously maintained and presented in pristine condition.',
  },
];

export function AboutPage() {
  const { language, t } = useLanguage();
  
  return (
    <>
      <SEO
        title="About VELO Luxury | Premium Car Rental Kuala Lumpur"
        description="Learn about VELO Luxury, Malaysia's premier luxury car rental service in Kuala Lumpur. Discover our commitment to excellence, prestige, and creating unforgettable experiences."
        keywords="about VELO Luxury, luxury car rental company Kuala Lumpur, premium car rental Malaysia, VELO Luxury story, luxury vehicle rental service"
        image="https://images.unsplash.com/photo-1599912027667-755b68b4dd3b?auto=format&fit=crop&w=1200"
        url="/about"
      />
      <StructuredData type="Organization" data={createOrganizationSchema()} />
      <div className={`min-h-screen pt-20 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1599912027667-755b68b4dd3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjE0NzE2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Luxury Car Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl text-white mb-6" style={{ fontWeight: 700, textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
              {language === 'ar' ? 'ليس مجرد تأجير —' : 'Not Just Rentals —'}<br />
              <span className="text-gold">{language === 'ar' ? 'تجارب' : 'Experiences'}</span>
            </h1>
            <p className="text-xl text-white max-w-2xl" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
              {language === 'ar' 
                ? 'في ڤيلو لوكشري، نؤمن بأن كل رحلة يجب أن تكون استثنائية مثل الوجهة نفسها.'
                : 'At VELO Luxury, we believe that every journey should be as extraordinary as the destination itself.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl text-navy mb-6" style={{ fontWeight: 700 }}>
                Our <span className="text-gold">Story</span>
              </h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  Founded in the heart of Kuala Lumpur, VELO Luxury was born from a simple vision: to redefine what luxury car rental means in Malaysia.
                </p>
                <p>
                  We recognized that discerning clients don't just want a vehicle—they seek an experience that reflects their status, taste, and ambition. Every car we offer, every service we provide, is meticulously curated to exceed the highest expectations.
                </p>
                <p>
                  From executive business trips to milestone celebrations, from adrenaline-fueled weekends to elegant arrivals, VELO Luxury is more than transportation. We are your partner in making unforgettable impressions.
                </p>
                <p className="text-navy" style={{ fontWeight: 600 }}>
                  Prestige. Excellence. Experience. This is VELO Luxury.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1597535030108-7fa4d99b5530?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBlbGVnYW50fGVufDF8fHx8MTc2MTUwMzM0N3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Luxury Car"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gold/20 rounded-full blur-3xl" />
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-navy/20 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-gradient-to-b from-gray-light to-white px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-navy mb-4" style={{ fontWeight: 700 }}>
              Our <span className="text-gold">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three pillars that define everything we do at VELO Luxury
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold to-gold-light rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon size={32} className="text-navy" />
                </div>
                <h3 className="text-2xl text-navy mb-4" style={{ fontWeight: 600 }}>{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-navy mb-4" style={{ fontWeight: 700 }}>
              Why Choose <span className="text-gold">VELO Luxury</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-navy text-white p-8 rounded-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-all duration-500" />
                <div className="relative z-10">
                  <reason.icon size={40} className="text-gold mb-6" />
                  <h3 className="text-2xl mb-4" style={{ fontWeight: 600 }}>{reason.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{reason.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-navy to-navy/90 px-4 relative overflow-hidden">
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
            <h2 className="text-4xl md:text-5xl text-white mb-6" style={{ fontWeight: 700 }}>
              Ready to Experience <span className="text-gold">Excellence?</span>
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Join Malaysia's most discerning clients who trust VELO Luxury for their automotive needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/fleet">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-navy rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-gold/50"
                  style={{ fontWeight: 600, fontSize: '1.125rem' }}
                >
                  Explore Our Fleet
                </motion.button>
              </a>
              <a href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-gold text-gold rounded-lg transition-all duration-300 hover:bg-gold hover:text-navy"
                  style={{ fontWeight: 600, fontSize: '1.125rem' }}
                >
                  Contact Us
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}
