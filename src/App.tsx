import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { DataSeeder } from "./components/DataSeeder";
import { HomePage } from "./components/HomePage";
import { FleetPage } from "./components/FleetPage";
import { CarDetailPage } from "./components/CarDetailPage";
import { BookingFlow } from "./components/BookingFlow";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";
import { OffersPage } from "./components/OffersPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { GoogleTagManager } from "./components/GoogleTagManager";
import { MetaPixel } from "./components/MetaPixel";
import { ScrollToTop } from "./components/ScrollToTop";

export default function App() {
  return (
    <LanguageProvider>
      <GoogleTagManager />
      <MetaPixel />
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/preview_page.html"
                element={<Navigate to="/" replace />}
              />
              <Route path="/fleet" element={<FleetPage />} />
              <Route path="/car/:id" element={<CarDetailPage />} />
              <Route path="/booking" element={<BookingFlow />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/special-offers" element={<OffersPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
          <DataSeeder />
        </div>
      </Router>
    </LanguageProvider>
  );
}
