import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useLanguage } from '../contexts/LanguageContext';
import { leadsAPI } from '../utils/api';
import { SEO } from './SEO';
import { StructuredData, createLocalBusinessSchema } from './StructuredData';
import { gtmPush } from './GoogleTagManager';
import { trackContactFormSubmit } from './MetaPixel';

export function ContactPage() {
  const { language, t } = useLanguage();
  
  const whatsappNumber = '+60123456789';
  const whatsappMessage = encodeURIComponent(
    language === 'en' 
      ? 'Hi VELO Luxury, I would like to get in touch with your team.'
      : 'مرحبًا VELO Luxury، أود التواصل مع فريقكم.'
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Save lead to Supabase
    try {
      await leadsAPI.create({
        type: 'contact_form',
        name,
        email,
        phone,
        subject,
        message,
        language,
        source: 'Contact Page',
      });
      console.log('Lead saved to Supabase successfully');
    } catch (error) {
      console.error('Failed to save lead to Supabase:', error);
    }

    // Track conversion events
    gtmPush('form_submission', {
      form_name: 'Contact Form',
      form_location: 'Contact Page',
    });
    trackContactFormSubmit();

    const whatsappMessage = encodeURIComponent(
      language === 'en'
        ? `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`
        : `نموذج اتصال جديد\n\nالاسم: ${name}\nالبريد الإلكتروني: ${email}\nالهاتف: ${phone}\nالموضوع: ${subject}\nالرسالة: ${message}`
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
  };

  return (
    <>
      <SEO
        title="Contact VELO Luxury | Car Rental Kuala Lumpur"
        description="Contact VELO Luxury for premium car rental services in Kuala Lumpur. Visit us at 3 Towers Ampang, call +60 12-345 6789, or book via WhatsApp. Open Monday-Sunday."
        keywords="contact VELO Luxury, luxury car rental contact KL, car rental Kuala Lumpur phone, VELO Luxury address, luxury vehicle rental contact Malaysia"
        image="https://images.unsplash.com/photo-1599912027667-755b68b4dd3b?auto=format&fit=crop&w=1200"
        url="/contact"
      />
      <StructuredData type="LocalBusiness" data={createLocalBusinessSchema()} />
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
            <h1 className="text-5xl md:text-6xl text-white mb-6" style={{ fontWeight: 700, textShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
              {t('contact.title').split(' ')[0]} <span className="text-gold">{t('contact.title').split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl text-navy mb-8" style={{ fontWeight: 700 }}>
                Contact <span className="text-gold">Information</span>
              </h2>

              <div className="space-y-8 mb-12">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-navy" />
                  </div>
                  <div>
                    <h3 className="text-xl text-navy mb-2" style={{ fontWeight: 600 }}>Our Location</h3>
                    <p className="text-gray-600">
                      3 Towers Ampang<br />
                      Jalan Ampang<br />
                      50450 Kuala Lumpur, Malaysia
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-navy" />
                  </div>
                  <div>
                    <h3 className="text-xl text-navy mb-2" style={{ fontWeight: 600 }}>Phone</h3>
                    <p className="text-gray-600">+60 12-345 6789</p>
                    <p className="text-gray-600">+60 3-2161 0000</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-navy" />
                  </div>
                  <div>
                    <h3 className="text-xl text-navy mb-2" style={{ fontWeight: 600 }}>Email</h3>
                    <p className="text-gray-600">hello@veloluxury.my</p>
                    <p className="text-gray-600">bookings@veloluxury.my</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={24} className="text-navy" />
                  </div>
                  <div>
                    <h3 className="text-xl text-navy mb-2" style={{ fontWeight: 600 }}>Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 8:00 PM</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Sunday: By Appointment</p>
                    <p className="text-gold mt-2" style={{ fontWeight: 600 }}>24/7 WhatsApp Support</p>
                  </div>
                </div>
              </div>

              {/* Google Map Placeholder */}
              <div className="bg-gray-light rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-video bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={48} className="text-navy mx-auto mb-4" />
                    <p className="text-navy" style={{ fontWeight: 600 }}>3 Towers Ampang</p>
                    <p className="text-gray-600 text-sm">Kuala Lumpur</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h3 className="text-3xl text-navy mb-8" style={{ fontWeight: 700 }}>
                  Send us a <span className="text-gold">Message</span>
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Dato' Ahmad Rahman"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="ahmad@example.com"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+60 12-345 6789"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="Vehicle Inquiry"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your luxury car rental needs..."
                      required
                      className="mt-2 min-h-[150px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-gold to-gold-light text-navy py-6 rounded-lg hover:shadow-xl transition-all duration-300 group"
                    style={{ fontWeight: 600, fontSize: '1.125rem' }}
                  >
                    <Send size={20} className="mr-2 group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    We typically respond within 24 hours during business days
                  </p>
                </form>
              </div>

              {/* Quick Contact Options */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <a
                  href="https://wa.me/60123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <MessageCircle size={32} className="mx-auto mb-2" />
                  <p style={{ fontWeight: 600 }}>WhatsApp Us</p>
                </a>
                <a
                  href="tel:+60123456789"
                  className="bg-gradient-to-br from-gold to-gold-light text-navy p-6 rounded-xl text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Phone size={32} className="mx-auto mb-2" />
                  <p style={{ fontWeight: 600 }}>Call Us Now</p>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ or Additional Info */}
      <section className="py-24 bg-gray-light px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl text-navy mb-6" style={{ fontWeight: 700 }}>
              Prefer to Visit <span className="text-gold">In Person?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Our showroom at 3 Towers Ampang is open for private viewings. Schedule an appointment to experience our fleet firsthand with personalized attention from our concierge team.
            </p>
            <Button className="bg-gradient-to-r from-gold to-gold-light text-navy px-8 py-6 rounded-lg hover:shadow-xl transition-all duration-300" style={{ fontWeight: 600, fontSize: '1.125rem' }}>
              Schedule a Showroom Visit
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}