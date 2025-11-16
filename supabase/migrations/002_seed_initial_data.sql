-- ============================================
-- SEED DATA for Development/Testing
-- Run this AFTER creating the tables
-- ============================================

-- Clear existing data (optional - use with caution in production!)
-- TRUNCATE admins, vehicles, vehicle_images, vehicle_maintenance, offers, offer_redemptions, leads, lead_notes, lead_reminders CASCADE;

-- ============================================
-- SEED ADMINS
-- ============================================
-- Password: "Admin@123" (hashed with bcrypt)
-- You should change these passwords immediately after setup!

INSERT INTO admins (id, email, password_hash, full_name, role, phone, is_active) VALUES
(
  gen_random_uuid(),
  'admin@veloluxury.my',
  '$2b$10$thnI5sMqCUT4HDjCyMhjE.qpnSNHgMqm15yWBrCJemffr/XX.sZAS',
  'Super Admin',
  'super_admin',
  '+60123456789',
  true
),
(
  gen_random_uuid(),
  'manager@veloluxury.my',
  '$2b$10$thnI5sMqCUT4HDjCyMhjE.qpnSNHgMqm15yWBrCJemffr/XX.sZAS',
  'Fleet Manager',
  'manager',
  '+60123456790',
  true
);

-- ============================================
-- SEED VEHICLES (Example)
-- ============================================

INSERT INTO vehicles (
  id, brand, model, name, name_ar, year,
  price_per_day, price_per_week, price_per_month, weekend_price,
  primary_image, collection, collection_name, collection_name_ar,
  category, description, description_ar, specs,
  is_featured, is_available
) VALUES
(
  'mercedes-s-class',
  'Mercedes-Benz',
  'S-Class',
  'Mercedes-Benz S-Class',
  'مرسيدس بنز الفئة إس',
  2024,
  1200.00,
  7500.00,
  25000.00,
  1500.00,
  'https://images.unsplash.com/photo-1617531653332-bd46c24f2068',
  'luxury-sedans',
  'Luxury Sedans',
  'السيارات الفاخرة',
  'luxury-sedan',
  'Experience ultimate luxury and comfort with the Mercedes-Benz S-Class',
  'استمتع بالفخامة والراحة المطلقة مع مرسيدس بنز الفئة إس',
  '{
    "engine": "3.0L I6 Turbo",
    "engineAr": "محرك 6 سلندر 3.0 لتر تيربو",
    "transmission": "9-Speed Automatic",
    "transmissionAr": "أوتوماتيك 9 سرعات",
    "seats": "5",
    "power": "429 HP",
    "topSpeed": "250 km/h",
    "acceleration": "4.9s 0-100 km/h",
    "fuelType": "Petrol",
    "driveType": "AWD"
  }'::jsonb,
  true,
  true
),
(
  'range-rover-sport',
  'Land Rover',
  'Range Rover Sport',
  'Range Rover Sport',
  'رينج روفر سبورت',
  2024,
  1500.00,
  9500.00,
  32000.00,
  1800.00,
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6',
  'luxury-suvs',
  'Luxury SUVs',
  'سيارات الدفع الرباعي الفاخرة',
  'suv',
  'Powerful performance meets refined luxury in the Range Rover Sport',
  'الأداء القوي يلتقي بالفخامة الراقية في رينج روفر سبورت',
  '{
    "engine": "3.0L I6 Turbo",
    "engineAr": "محرك 6 سلندر 3.0 لتر تيربو",
    "transmission": "8-Speed Automatic",
    "transmissionAr": "أوتوماتيك 8 سرعات",
    "seats": "5",
    "power": "395 HP",
    "topSpeed": "225 km/h",
    "acceleration": "6.2s 0-100 km/h",
    "fuelType": "Petrol",
    "driveType": "AWD"
  }'::jsonb,
  true,
  true
);

-- ============================================
-- SEED VEHICLE IMAGES
-- ============================================

INSERT INTO vehicle_images (vehicle_id, image_url, display_order, is_primary, caption) VALUES
('mercedes-s-class', 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068', 1, true, 'Front View'),
('mercedes-s-class', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8', 2, false, 'Interior'),
('mercedes-s-class', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738', 3, false, 'Side View'),
('range-rover-sport', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6', 1, true, 'Front View'),
('range-rover-sport', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b', 2, false, 'Interior');

-- ============================================
-- SEED OFFERS
-- ============================================

INSERT INTO offers (
  title, title_ar, description, description_ar,
  discount_text, discount_percent, offer_code,
  valid_from, valid_until,
  applies_to, applicable_categories,
  usage_limit, is_active
) VALUES
(
  'Weekend Special',
  'عرض نهاية الأسبوع',
  'Get 20% off on weekend rentals (Friday-Sunday)',
  'احصل على خصم 20٪ على إيجارات نهاية الأسبوع',
  '20% OFF',
  20,
  'WEEKEND20',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  'all',
  NULL,
  100,
  true
),
(
  'Monthly Luxury Deal',
  'عرض الإيجار الشهري',
  'Save 30% on monthly rentals of luxury sedans',
  'وفر 30٪ على الإيجارات الشهرية للسيارات الفاخرة',
  '30% OFF',
  30,
  'MONTHLY30',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '60 days',
  'category',
  ARRAY['luxury-sedan'],
  50,
  true
),
(
  'First Time Customer',
  'عرض العملاء الجدد',
  'Special discount for first-time customers',
  'خصم خاص للعملاء الجدد',
  '15% OFF',
  15,
  'FIRST15',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '90 days',
  'all',
  NULL,
  NULL, -- No limit
  true
);

-- ============================================
-- SEED TEST LEAD
-- ============================================

INSERT INTO leads (
  id, name, email, phone, subject, message,
  type, status, priority, source, language
) VALUES
(
  'lead_test_001',
  'Ahmad Hassan',
  'ahmad@example.com',
  '+60123456789',
  'Interested in Mercedes S-Class',
  'I would like to rent the Mercedes S-Class for a weekend. Please contact me.',
  'contact',
  'new',
  'high',
  'Contact Page',
  'en'
);

-- ============================================
-- SEED VEHICLE MAINTENANCE (Example)
-- ============================================

INSERT INTO vehicle_maintenance (
  vehicle_id, maintenance_type, description, cost,
  performed_by, performed_at, next_service_date, notes
) VALUES
(
  'mercedes-s-class',
  'service',
  'Regular 10,000 km service - Oil change, filter replacement',
  850.00,
  'Mercedes Service Center KL',
  NOW() - INTERVAL '15 days',
  CURRENT_DATE + INTERVAL '90 days',
  'All systems checked and functioning normally'
),
(
  'range-rover-sport',
  'inspection',
  'Pre-rental inspection and detailing',
  350.00,
  'VELO Maintenance Team',
  NOW() - INTERVAL '2 days',
  NULL,
  'Vehicle ready for rental'
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count all records
SELECT 'Admins' as table_name, COUNT(*) as count FROM admins
UNION ALL
SELECT 'Vehicles', COUNT(*) FROM vehicles
UNION ALL
SELECT 'Vehicle Images', COUNT(*) FROM vehicle_images
UNION ALL
SELECT 'Maintenance Records', COUNT(*) FROM vehicle_maintenance
UNION ALL
SELECT 'Offers', COUNT(*) FROM offers
UNION ALL
SELECT 'Leads', COUNT(*) FROM leads;
