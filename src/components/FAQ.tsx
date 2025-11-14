import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { StructuredData } from './StructuredData';

interface FAQItem {
  question: string;
  questionAr: string;
  answer: string;
  answerAr: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What areas do you serve in Kuala Lumpur?',
    questionAr: 'ما هي المناطق التي تخدمونها في كوالالمبور؟',
    answer: 'We provide free delivery and pickup throughout Kuala Lumpur, including KLCC, Bukit Bintang, Mont Kiara, Bangsar, and surrounding areas. We also serve Petaling Jaya, Subang Jaya, and Putrajaya.',
    answerAr: 'نوفر التوصيل والاستلام المجاني في جميع أنحاء كوالالمبور، بما في ذلك KLCC، بوكيت بينتانغ، مونت كيارا، بانغسار، والمناطق المحيطة. نخدم أيضًا بيتالينغ جايا، سوبانغ جايا، وبوتراجايا.',
  },
  {
    question: 'What is included in the rental price?',
    questionAr: 'ما الذي يشمله سعر التأجير؟',
    answer: 'Our rental prices include comprehensive insurance coverage, free delivery and pickup within Kuala Lumpur, 24/7 roadside assistance, and a full tank of fuel. Additional services like chauffeur service are available at extra cost.',
    answerAr: 'أسعار التأجير لدينا تشمل تأمين شامل، توصيل واستلام مجاني داخل كوالالمبور، مساعدة على الطريق على مدار الساعة، وخزان وقود كامل. الخدمات الإضافية مثل خدمة السائق متاحة بتكلفة إضافية.',
  },
  {
    question: 'Do you offer chauffeur services?',
    questionAr: 'هل تقدمون خدمات السائق؟',
    answer: 'Yes, we offer professional chauffeur services for all our vehicles. Our experienced chauffeurs are trained in luxury service standards and are available for hourly, daily, or event-based bookings. Please inquire via WhatsApp for pricing.',
    answerAr: 'نعم، نقدم خدمات السائق المحترف لجميع سياراتنا. سائقونا ذوو الخبرة مدربون على معايير الخدمة الفاخرة ومتاحون للحجوزات بالساعة أو اليومية أو القائمة على الأحداث. يرجى الاستفسار عبر واتساب للأسعار.',
  },
  {
    question: 'What are your rental terms and requirements?',
    questionAr: 'ما هي شروط ومتطلبات التأجير؟',
    answer: 'Renters must be at least 25 years old with a valid driving license. We require a security deposit and valid identification. Minimum rental period is 24 hours. All vehicles are subject to our terms and conditions which will be provided upon booking.',
    answerAr: 'يجب أن يكون المستأجرون بعمر 25 عامًا على الأقل مع رخصة قيادة سارية. نحتاج إلى وديعة أمنية وهوية سارية. الحد الأدنى لفترة التأجير هو 24 ساعة. جميع المركبات تخضع لشروطنا وأحكامنا التي سيتم توفيرها عند الحجز.',
  },
  {
    question: 'How do I book a luxury car?',
    questionAr: 'كيف أحجز سيارة فاخرة؟',
    answer: 'Booking is simple! Contact us via WhatsApp, browse our fleet online, or visit our showroom at 3 Towers Ampang. Our concierge team will assist you with vehicle selection, pricing, and availability. We recommend booking in advance, especially for special events.',
    answerAr: 'الحجز بسيط! اتصل بنا عبر واتساب، تصفح أسطولنا عبر الإنترنت، أو زر معرضنا في 3 Towers Ampang. فريق الـكونسيرج لدينا سيساعدك في اختيار المركبة والأسعار والتوفر. نوصي بالحجز مسبقًا، خاصة للأحداث الخاصة.',
  },
  {
    question: 'What happens if the car is damaged during rental?',
    questionAr: 'ماذا يحدث إذا تعرضت السيارة لأضرار أثناء التأجير؟',
    answer: 'All our vehicles are covered by comprehensive insurance. In case of damage, please contact us immediately. The security deposit may be used to cover any excess charges as per our insurance policy. We provide full details of coverage and excess amounts before rental.',
    answerAr: 'جميع مركباتنا مغطاة بتأمين شامل. في حالة حدوث ضرر، يرجى الاتصال بنا فورًا. قد تُستخدم الوديعة الأمنية لتغطية أي رسوم زائدة وفقًا لسياسة التأمين الخاصة بنا. نقدم تفاصيل كاملة عن التغطية والمبالغ الزائدة قبل التأجير.',
  },
  {
    question: 'Can I extend my rental period?',
    questionAr: 'هل يمكنني تمديد فترة التأجير؟',
    answer: 'Yes, rental extensions are possible subject to vehicle availability. Please contact us at least 24 hours before your scheduled return time to arrange an extension. Additional charges will apply for extended periods.',
    answerAr: 'نعم، تمديدات التأجير ممكنة حسب توفر المركبة. يرجى الاتصال بنا قبل 24 ساعة على الأقل من وقت الإرجاع المقرر لترتيب التمديد. ستطبق رسوم إضافية للفترات الممتدة.',
  },
  {
    question: 'Do you offer corporate or long-term rental packages?',
    questionAr: 'هل تقدمون حزم تأجير للشركات أو طويلة الأجل؟',
    answer: 'Absolutely! We offer customized corporate packages with dedicated account management, priority booking, flexible terms, and volume discounts. Monthly and long-term rentals are available with special rates. Contact our corporate team via WhatsApp for a tailored quote.',
    answerAr: 'بالتأكيد! نقدم حزمًا مخصصة للشركات مع إدارة حسابات مخصصة، حجز ذو أولوية، شروط مرنة، وخصومات على الكميات. تأجيرات شهرية وطويلة الأجل متاحة بأسعار خاصة. اتصل بفريق الشركات لدينا عبر واتساب للحصول على عرض مخصص.',
  },
];

export function FAQ() {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Create FAQPage schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: language === 'ar' ? item.questionAr : item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: language === 'ar' ? item.answerAr : item.answer,
      },
    })),
  };

  return (
    <>
      <StructuredData type="FAQPage" data={faqSchema} />
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl text-navy mb-4" style={{ fontWeight: 800 }}>
              {language === 'ar' ? 'أسئلة' : 'Frequently Asked'} <span className="text-gold">{language === 'ar' ? 'شائعة' : 'Questions'}</span>
            </h2>
            <p className="text-xl text-charcoal max-w-2xl mx-auto">
              {language === 'ar'
                ? 'كل ما تحتاج معرفته عن تأجير السيارات الفاخرة في كوالالمبور'
                : 'Everything you need to know about luxury car rental in Kuala Lumpur'}
            </p>
            <div className="w-24 h-1 bg-gold mx-auto mt-6" />
          </motion.div>

          <div className="space-y-4">
            {faqData.map((item, index) => {
              const isOpen = openIndex === index;
              const question = language === 'ar' ? item.questionAr : item.question;
              const answer = language === 'ar' ? item.answerAr : item.answer;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-beige rounded-xl overflow-hidden border border-gold/20"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gold/10 transition-colors duration-300"
                  >
                    <h3 className="text-lg md:text-xl text-navy pr-4" style={{ fontWeight: 600 }}>
                      {question}
                    </h3>
                    <ChevronDown
                      size={24}
                      className={`text-gold flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-0">
                      <p className="text-charcoal leading-relaxed">{answer}</p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-charcoal mb-4">
              {language === 'ar'
                ? 'لا تجد إجابة لسؤالك؟'
                : "Can't find the answer you're looking for?"}
            </p>
            <a
              href="https://wa.me/60123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gold text-navy px-8 py-4 rounded-xl hover:bg-gold-light transition-all duration-300 hover:scale-105"
              style={{ fontWeight: 600 }}
            >
              {language === 'ar' ? 'تواصل معنا عبر واتساب' : 'Contact Us via WhatsApp'}
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}

