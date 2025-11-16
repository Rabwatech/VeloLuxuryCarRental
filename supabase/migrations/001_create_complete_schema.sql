-- ============================================
-- VELO Luxury Car Rental - Complete Database Schema
-- Production-Ready with Admin Management
-- ============================================

-- ============================================
-- ADMINS TABLE - Separate auth for admin users
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin', -- 'super_admin', 'admin', 'manager', 'staff'
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VEHICLES TABLE - Enhanced with pricing & features
-- ============================================
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT,
  year INTEGER,

  -- Pricing
  price_per_day DECIMAL NOT NULL,
  price_per_week DECIMAL,
  price_per_month DECIMAL,
  weekend_price DECIMAL, -- Friday-Sunday pricing

  -- Media
  primary_image TEXT NOT NULL,

  -- Classification
  collection TEXT,
  collection_name TEXT,
  collection_name_ar TEXT,
  category TEXT, -- 'luxury-sedan', 'suv', 'sports', 'convertible'

  -- Description
  description TEXT,
  description_ar TEXT,

  -- Specifications
  specs JSONB, -- { engine, transmission, seats, power, topSpeed, acceleration, fuelType, etc. }

  -- Features & Status
  is_featured BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,

  -- Metadata
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VEHICLE IMAGES - Multiple images per vehicle
-- ============================================
CREATE TABLE IF NOT EXISTS vehicle_images (
  id SERIAL PRIMARY KEY,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VEHICLE MAINTENANCE - Service history
-- ============================================
CREATE TABLE IF NOT EXISTS vehicle_maintenance (
  id SERIAL PRIMARY KEY,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL, -- 'service', 'repair', 'inspection', 'cleaning'
  description TEXT NOT NULL,
  cost DECIMAL,
  performed_by TEXT, -- Vendor/mechanic name
  performed_at TIMESTAMPTZ NOT NULL,
  next_service_date DATE,
  notes TEXT,
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OFFERS TABLE - Enhanced with codes & tracking
-- ============================================
CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT,
  description_ar TEXT,

  -- Discount
  discount_text TEXT, -- "20% OFF"
  discount_percent INTEGER,
  discount_amount DECIMAL,

  -- Offer Code
  offer_code TEXT UNIQUE, -- Coupon code like "SUMMER2024"

  -- Validity
  valid_from DATE,
  valid_until DATE,

  -- Applicability
  applies_to TEXT, -- 'all', 'category', 'specific_vehicles'
  applicable_categories TEXT[], -- ['luxury-sedan', 'suv']
  applicable_vehicle_ids TEXT[], -- Specific vehicle IDs

  -- Limits
  usage_limit INTEGER, -- Max number of times offer can be used
  usage_count INTEGER DEFAULT 0, -- Current usage count

  -- Display
  image_url TEXT,
  terms TEXT,
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEADS TABLE - Enhanced with more fields
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT,
  message TEXT,

  -- Classification
  type TEXT DEFAULT 'general', -- 'contact', 'quote', 'general'
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'closed', 'lost'
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'

  -- Assignment
  assigned_to UUID REFERENCES admins(id),

  -- Source
  source TEXT, -- 'Contact Page', 'WhatsApp', 'Phone', 'Email'
  language TEXT DEFAULT 'en',

  -- Vehicle Interest
  vehicle_id TEXT REFERENCES vehicles(id),
  offer_code TEXT, -- If they mentioned an offer

  -- Metadata
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  last_contacted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OFFER REDEMPTIONS - Track offer usage
-- ============================================
CREATE TABLE IF NOT EXISTS offer_redemptions (
  id SERIAL PRIMARY KEY,
  offer_id INTEGER NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  offer_code TEXT,
  lead_id TEXT REFERENCES leads(id), -- Link to customer who used it
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  redeemed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEAD NOTES - Comments/notes on leads
-- ============================================
CREATE TABLE IF NOT EXISTS lead_notes (
  id SERIAL PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  note_type TEXT DEFAULT 'comment', -- 'comment', 'call', 'email', 'meeting', 'whatsapp'
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEAD REMINDERS - Follow-up reminders
-- ============================================
CREATE TABLE IF NOT EXISTS lead_reminders (
  id SERIAL PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  reminder_date TIMESTAMPTZ NOT NULL,
  reminder_note TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  assigned_to UUID REFERENCES admins(id),
  created_by UUID REFERENCES admins(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================

-- Admins
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);
CREATE INDEX IF NOT EXISTS idx_admins_is_active ON admins(is_active);

-- Vehicles
CREATE INDEX IF NOT EXISTS idx_vehicles_collection ON vehicles(collection);
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_available ON vehicles(is_available);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_featured ON vehicles(is_featured);

-- Vehicle Images
CREATE INDEX IF NOT EXISTS idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_images_is_primary ON vehicle_images(is_primary);

-- Vehicle Maintenance
CREATE INDEX IF NOT EXISTS idx_vehicle_maintenance_vehicle_id ON vehicle_maintenance(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_maintenance_type ON vehicle_maintenance(maintenance_type);
CREATE INDEX IF NOT EXISTS idx_vehicle_maintenance_date ON vehicle_maintenance(performed_at DESC);

-- Offers
CREATE INDEX IF NOT EXISTS idx_offers_is_active ON offers(is_active);
CREATE INDEX IF NOT EXISTS idx_offers_valid_until ON offers(valid_until);
CREATE INDEX IF NOT EXISTS idx_offers_code ON offers(offer_code);

-- Offer Redemptions
CREATE INDEX IF NOT EXISTS idx_offer_redemptions_offer_id ON offer_redemptions(offer_id);
CREATE INDEX IF NOT EXISTS idx_offer_redemptions_lead_id ON offer_redemptions(lead_id);

-- Leads
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_type ON leads(type);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_timestamp ON leads(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_leads_vehicle_id ON leads(vehicle_id);

-- Lead Notes
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_created_at ON lead_notes(created_at DESC);

-- Lead Reminders
CREATE INDEX IF NOT EXISTS idx_lead_reminders_lead_id ON lead_reminders(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_reminders_date ON lead_reminders(reminder_date);
CREATE INDEX IF NOT EXISTS idx_lead_reminders_assigned_to ON lead_reminders(assigned_to);
CREATE INDEX IF NOT EXISTS idx_lead_reminders_is_completed ON lead_reminders(is_completed);

-- ============================================
-- TRIGGERS: Auto-update updated_at timestamp
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGER: Update offer usage count
-- ============================================

CREATE OR REPLACE FUNCTION increment_offer_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE offers
  SET usage_count = usage_count + 1
  WHERE id = NEW.offer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_offer_usage_count
  AFTER INSERT ON offer_redemptions
  FOR EACH ROW
  EXECUTE FUNCTION increment_offer_usage();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_reminders ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ADMINS POLICIES
-- ============================================

-- Only authenticated admins can read admin records
CREATE POLICY "Authenticated admins can read admins"
ON admins
FOR SELECT
USING (auth.uid() IN (SELECT id FROM admins WHERE is_active = true));

-- Only super admins can manage other admins
CREATE POLICY "Super admins can manage admins"
ON admins
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE id = auth.uid()
    AND role = 'super_admin'
    AND is_active = true
  )
);

-- ============================================
-- VEHICLES POLICIES
-- ============================================

-- Public: Read available vehicles
CREATE POLICY "Public can view available vehicles"
ON vehicles
FOR SELECT
USING (is_available = true);

-- Authenticated admins: Full access
CREATE POLICY "Admins can manage vehicles"
ON vehicles
FOR ALL
USING (auth.uid() IN (SELECT id FROM admins WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT id FROM admins WHERE is_active = true));

-- ============================================
-- VEHICLE IMAGES POLICIES
-- ============================================

-- Public: Read images for available vehicles
CREATE POLICY "Public can view vehicle images"
ON vehicle_images
FOR SELECT
USING (
  vehicle_id IN (SELECT id FROM vehicles WHERE is_available = true)
);

-- Admins: Full access
CREATE POLICY "Admins can manage vehicle images"
ON vehicle_images
FOR ALL
USING (auth.uid() IN (SELECT id FROM admins WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT id FROM admins WHERE is_active = true));

-- ============================================
-- VEHICLE MAINTENANCE POLICIES
-- ============================================

-- Admins only: Full access
CREATE POLICY "Admins can manage maintenance records"
ON vehicle_maintenance
FOR ALL
USING (auth.uid() IN (SELECT id FROM admins WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT id FROM admins WHERE is_active = true));

-- ============================================
-- OFFERS POLICIES
-- ============================================

-- Public: Read active offers
CREATE POLICY "Public can view active offers"
ON offers
FOR SELECT
USING (is_active = true AND (valid_until IS NULL OR valid_until >= CURRENT_DATE));

-- Admins: Full access
CREATE POLICY "Admins can manage offers"
ON offers
FOR ALL
USING (auth.uid() IN (SELECT id FROM admins WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT id FROM admins WHERE is_active = true));

-- ============================================
-- OFFER REDEMPTIONS POLICIES
-- ============================================

-- Public can create redemptions (when using offer code)
CREATE POLICY "Public can redeem offers"
ON offer_redemptions
FOR INSERT
WITH CHECK (true);

-- Admins can read all redemptions
CREATE POLICY "Admins can view redemptions"
ON offer_redemptions
FOR SELECT
USING (auth.uid() IN (SELECT id FROM admins WHERE is_active = true));

-- ============================================
-- LEADS POLICIES
-- ============================================

-- Public: Can create leads (contact form)
CREATE POLICY "Public can create leads"
ON leads
FOR INSERT
WITH CHECK (true);

-- Admins: Full access
CREATE POLICY "Admins can manage leads"
ON leads
FOR ALL
USING (auth.uid() IN (SELECT id FROM admins WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT id FROM admins WHERE is_active = true));

-- ============================================
-- LEAD NOTES POLICIES
-- ============================================

-- Admins only
CREATE POLICY "Admins can manage lead notes"
ON lead_notes
FOR ALL
USING (auth.uid() IN (SELECT id FROM admins WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT id FROM admins WHERE is_active = true));

-- ============================================
-- LEAD REMINDERS POLICIES
-- ============================================

-- Admins only
CREATE POLICY "Admins can manage lead reminders"
ON lead_reminders
FOR ALL
USING (auth.uid() IN (SELECT id FROM admins WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT id FROM admins WHERE is_active = true));

-- ============================================
-- COMMENTS for Documentation
-- ============================================

COMMENT ON TABLE admins IS 'Admin users with role-based access';
COMMENT ON TABLE vehicles IS 'Luxury vehicle fleet with dynamic pricing';
COMMENT ON TABLE vehicle_images IS 'Multiple images per vehicle';
COMMENT ON TABLE vehicle_maintenance IS 'Service and maintenance history';
COMMENT ON TABLE offers IS 'Promotions with codes and tracking';
COMMENT ON TABLE offer_redemptions IS 'Track offer usage by customers';
COMMENT ON TABLE leads IS 'Customer inquiries and lead management';
COMMENT ON TABLE lead_notes IS 'Comments and notes on leads';
COMMENT ON TABLE lead_reminders IS 'Follow-up reminders for leads';

COMMENT ON COLUMN vehicles.price_per_day IS 'Standard daily rate';
COMMENT ON COLUMN vehicles.price_per_week IS 'Weekly rate (7 days)';
COMMENT ON COLUMN vehicles.price_per_month IS 'Monthly rate (30 days)';
COMMENT ON COLUMN vehicles.weekend_price IS 'Friday-Sunday premium rate';
COMMENT ON COLUMN offers.applies_to IS 'Scope: all, category, or specific vehicles';
COMMENT ON COLUMN leads.priority IS 'Lead priority: low, normal, high, urgent';
