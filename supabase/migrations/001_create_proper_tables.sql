-- ============================================
-- VELO Luxury Car Rental Database Migration
-- From KV Store to Proper Tables
-- ============================================

-- Drop existing KV store table if migrating
-- DROP TABLE IF EXISTS kv_store_749ca9a4;

-- ============================================
-- VEHICLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT,
  year INTEGER,
  price_per_day DECIMAL NOT NULL,
  image TEXT NOT NULL,
  images TEXT[], -- Array of image URLs
  collection TEXT,
  collection_name TEXT,
  collection_name_ar TEXT,
  description TEXT,
  description_ar TEXT,
  specs JSONB, -- { engine, transmission, seats, power, topSpeed, acceleration }
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OFFERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT,
  description_ar TEXT,
  discount TEXT,
  discount_percent INTEGER,
  valid_until DATE,
  image TEXT,
  terms TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT,
  message TEXT,
  type TEXT DEFAULT 'general', -- 'contact', 'booking', 'quote', 'general'
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'converted', 'closed'
  source TEXT, -- 'Contact Page', 'Booking Flow', etc.
  language TEXT DEFAULT 'en',
  vehicle_id TEXT REFERENCES vehicles(id),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_vehicles_collection ON vehicles(collection);
CREATE INDEX IF NOT EXISTS idx_vehicles_available ON vehicles(available);
CREATE INDEX IF NOT EXISTS idx_offers_active ON offers(active);
CREATE INDEX IF NOT EXISTS idx_offers_valid_until ON offers(valid_until);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_type ON leads(type);
CREATE INDEX IF NOT EXISTS idx_leads_timestamp ON leads(timestamp DESC);

-- ============================================
-- TRIGGER: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VEHICLES POLICIES
-- ============================================

-- Public: Read all available vehicles
CREATE POLICY "Public can view available vehicles"
ON vehicles
FOR SELECT
USING (available = true);

-- Authenticated: Full access to vehicles
CREATE POLICY "Authenticated users can manage vehicles"
ON vehicles
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- OFFERS POLICIES
-- ============================================

-- Public: Read active offers
CREATE POLICY "Public can view active offers"
ON offers
FOR SELECT
USING (active = true);

-- Authenticated: Full access to offers
CREATE POLICY "Authenticated users can manage offers"
ON offers
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- LEADS POLICIES
-- ============================================

-- Public: Can only create leads (contact form submissions)
CREATE POLICY "Public can create leads"
ON leads
FOR INSERT
WITH CHECK (true);

-- Authenticated: Full access to leads
CREATE POLICY "Authenticated users can manage leads"
ON leads
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- COMMENTS for Documentation
-- ============================================

COMMENT ON TABLE vehicles IS 'Stores the luxury vehicle fleet';
COMMENT ON TABLE offers IS 'Stores special offers and promotions';
COMMENT ON TABLE leads IS 'Stores customer inquiries and contact form submissions';

COMMENT ON COLUMN vehicles.specs IS 'JSON object containing: engine, transmission, seats, power, topSpeed, acceleration';
COMMENT ON COLUMN leads.type IS 'Type of lead: contact, booking, quote, general';
COMMENT ON COLUMN leads.status IS 'Lead status: new, contacted, converted, closed';
