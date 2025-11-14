import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import logoImage from "figma:asset/842671c072bdc4368c49973871bff724718e748f.png";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: t("nav.home") },
    { path: "/fleet", label: t("nav.fleet") },
    { path: "/offers", label: t("nav.offers") },
    { path: "/about", label: t("nav.about") },
    { path: "/contact", label: t("nav.contact") },
  ];

  const whatsappNumber = "+60123456789"; // Replace with actual WhatsApp number
  const whatsappMessage = encodeURIComponent(
    language === "en"
      ? "Hi VELO Luxury, I would like to inquire about your luxury car rental services."
      : "مرحبًا VELO Luxury، أود الاستفسار عن خدمات تأجير السيارات الفاخرة.",
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-navy/98 backdrop-blur-lg shadow-lg transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center z-10">
            <img
              src={logoImage}
              alt="VELO Car Rental"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center space-x-8 bg-[rgba(0,0,0,0)]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative transition-colors duration-300 ${
                  location.pathname === link.path
                    ? "text-gold"
                    : "text-navy hover:text-gold"
                }`}
                style={{ fontWeight: 500 }}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side: Language Toggle + WhatsApp + CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gold/30 text-[rgb(0,0,0)] hover:bg-gold/10 transition-all duration-300"
            >
              <Globe size={18} />
              <span
                className="text-sm"
                style={{ fontWeight: 600 }}
              >
                {language === "en" ? "AR" : "EN"}
              </span>
            </button>

            {/* WhatsApp Icon */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[#25D366] text-white hover:bg-[#20BA5A] transition-all duration-300 hover:scale-110"
              title={
                language === "en"
                  ? "Chat on WhatsApp"
                  : "محادثة على واتساب"
              }
            >
              <MessageCircle size={20} />
            </a>

            {/* CTA Button */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gold text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gold/50 hover:scale-105 gold-shimmer"
              style={{ fontWeight: 600 }}
            >
              {t("hero.bookNow")}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() =>
              setIsMobileMenuOpen(!isMobileMenuOpen)
            }
            className="lg:hidden text-white p-2 z-10"
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy/98 backdrop-blur-lg border-t border-gold/20"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 transition-colors duration-300 ${
                    location.pathname === link.path
                      ? "text-gold"
                      : "text-white hover:text-gold"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Language Toggle */}
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border border-gold/30 text-white hover:bg-gold/10 transition-all duration-300"
              >
                <Globe size={18} />
                <span style={{ fontWeight: 600 }}>
                  {language === "en" ? "العربية" : "English"}
                </span>
              </button>

              {/* Mobile WhatsApp CTA */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full px-6 py-3 bg-gold text-white rounded-lg text-center transition-all duration-300 hover:shadow-lg"
                style={{ fontWeight: 600 }}
              >
                {t("hero.bookNow")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}