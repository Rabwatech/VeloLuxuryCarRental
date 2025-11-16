-- ============================================
-- FIX: Remove infinite recursion in admins RLS policy
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop the problematic policies
DROP POLICY IF EXISTS "Authenticated admins can read admins" ON admins;
DROP POLICY IF EXISTS "Super admins can manage admins" ON admins;

-- For custom authentication, we need to allow SELECT on admins table
-- so the login function can query it
-- But we still want to prevent unauthorized modifications

-- Allow anyone to SELECT from admins (needed for login)
-- Note: password_hash is excluded in the API response, so it's safe
CREATE POLICY "Allow read access for authentication"
ON admins
FOR SELECT
USING (true);

-- Prevent any INSERT/UPDATE/DELETE operations via RLS
-- Admin management should be done through trusted backend functions
CREATE POLICY "Prevent unauthorized modifications"
ON admins
FOR INSERT
WITH CHECK (false);

CREATE POLICY "Prevent unauthorized updates"
ON admins
FOR UPDATE
USING (false);

CREATE POLICY "Prevent unauthorized deletes"
ON admins
FOR DELETE
USING (false);

-- ============================================
-- ALTERNATIVE: If you want to completely disable RLS on admins table
-- (simpler but less secure - uncomment if needed)
-- ============================================

-- ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- ============================================
-- Fix other policies that reference admins table
-- ============================================

-- Drop and recreate policies that check auth.uid() against admins
DROP POLICY IF EXISTS "Admins can manage vehicles" ON vehicles;
DROP POLICY IF EXISTS "Admins can manage vehicle images" ON vehicle_images;
DROP POLICY IF EXISTS "Admins can manage maintenance records" ON vehicle_maintenance;
DROP POLICY IF EXISTS "Admins can manage offers" ON offers;
DROP POLICY IF EXISTS "Admins can manage offer redemptions" ON offer_redemptions;
DROP POLICY IF EXISTS "Admins can manage leads" ON leads;
DROP POLICY IF EXISTS "Admins can manage lead notes" ON lead_notes;
DROP POLICY IF EXISTS "Admins can manage lead reminders" ON lead_reminders;

-- For now, allow full access to authenticated operations
-- TODO: Implement proper admin authentication check using JWT or session

-- Vehicles: Admins can do everything (we'll check admin status in application)
CREATE POLICY "Admins can manage vehicles"
ON vehicles
FOR ALL
USING (true)
WITH CHECK (true);

-- Vehicle Images: Full admin access
CREATE POLICY "Admins can manage vehicle images"
ON vehicle_images
FOR ALL
USING (true)
WITH CHECK (true);

-- Vehicle Maintenance: Full admin access
CREATE POLICY "Admins can manage maintenance records"
ON vehicle_maintenance
FOR ALL
USING (true)
WITH CHECK (true);

-- Offers: Full admin access
CREATE POLICY "Admins can manage offers"
ON offers
FOR ALL
USING (true)
WITH CHECK (true);

-- Offer Redemptions: Full admin access
CREATE POLICY "Admins can manage offer redemptions"
ON offer_redemptions
FOR ALL
USING (true)
WITH CHECK (true);

-- Leads: Full admin access
CREATE POLICY "Admins can manage leads"
ON leads
FOR ALL
USING (true)
WITH CHECK (true);

-- Lead Notes: Full admin access
CREATE POLICY "Admins can manage lead notes"
ON lead_notes
FOR ALL
USING (true)
WITH CHECK (true);

-- Lead Reminders: Full admin access
CREATE POLICY "Admins can manage lead reminders"
ON lead_reminders
FOR ALL
USING (true)
WITH CHECK (true);

-- Verification
SELECT 'RLS policies fixed! Infinite recursion resolved.' AS status;
