-- ============================================
-- SEED DATA for Development/Testing
-- Run this AFTER creating the tables
-- ============================================

-- Note: This is sample data. Replace with actual vehicle data.

-- Clear existing data (optional)
TRUNCATE vehicles, offers, leads CASCADE;

-- ============================================
-- SEED VEHICLES (Example)
-- ============================================
INSERT INTO vehicles (id, brand, model, name, name_ar, year, price_per_day, image, images, collection, collection_name, collection_name_ar, description, description_ar, specs, available) VALUES
(
  'mercedes-s-class',
  'Mercedes-Benz',
  'S-Class',
  'Mercedes-Benz S-Class',
  'مرسيدس بنز الفئة إس',
  2024,
  1200.00,
  'https://images.unsplash.com/photo-1617531653332-bd46c24f2068',
  ARRAY['https://images.unsplash.com/photo-1617531653332-bd46c24f2068'],
  'luxury-sedans',
  'Luxury Sedans',
  'السيارات الفاخرة',
  'Experience ultimate luxury with the Mercedes-Benz S-Class',
  'استمتع بالفخامة المطلقة مع مرسيدس بنز الفئة إس',
  '{
    "engine": "3.0L I6 Turbo",
    "engineAr": "محرك 6 سلندر 3.0 لتر تيربو",
    "transmission": "9-Speed Automatic",
    "transmissionAr": "أوتوماتيك 9 سرعات",
    "seats": "5",
    "power": "429 HP",
    "topSpeed": "250 km/h",
    "acceleration": "4.9s 0-100 km/h"
  }'::jsonb,
  true
);

-- Add more vehicles as needed...

-- ============================================
-- SEED OFFERS (Example)
-- ============================================
INSERT INTO offers (title, title_ar, description, description_ar, discount, discount_percent, valid_until, active) VALUES
(
  'Weekend Special',
  'عرض نهاية الأسبوع',
  'Get 20% off on weekend rentals',
  'احصل على خصم 20٪ على إيجارات نهاية الأسبوع',
  '20% OFF',
  20,
  CURRENT_DATE + INTERVAL '30 days',
  true
),
(
  'Monthly Rental Discount',
  'خصم الإيجار الشهري',
  'Save 30% on monthly rentals',
  'وفر 30٪ على الإيجارات الشهرية',
  '30% OFF',
  30,
  CURRENT_DATE + INTERVAL '60 days',
  true
);

-- ============================================
-- SEED TEST LEAD (Example)
-- ============================================
INSERT INTO leads (id, name, email, phone, subject, message, type, status, source, language) VALUES
(
  'lead_test_001',
  'John Doe',
  'john@example.com',
  '+60123456789',
  'Vehicle Inquiry',
  'I am interested in renting a Mercedes S-Class',
  'contact',
  'new',
  'Contact Page',
  'en'
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count records
SELECT 'Vehicles' as table_name, COUNT(*) as count FROM vehicles
UNION ALL
SELECT 'Offers', COUNT(*) FROM offers
UNION ALL
SELECT 'Leads', COUNT(*) FROM leads;
