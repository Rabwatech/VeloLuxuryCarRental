-- ============================================
-- FIX ADMINS RLS POLICIES
-- Remove infinite recursion caused by policies querying admins table
-- ============================================

-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Authenticated admins can read admins" ON admins;
DROP POLICY IF EXISTS "Super admins can manage admins" ON admins;

-- Since we're using custom authentication (not Supabase Auth),
-- the policies that check auth.uid() won't work.
-- We'll handle admin security in the application layer.

-- Allow SELECT for login purposes (checking email/password)
-- This allows the login API to query admins by email without recursion
CREATE POLICY "Allow admin login check"
ON admins
FOR SELECT
USING (true);

-- For INSERT/UPDATE/DELETE, we'll rely on application-level security
-- In production, these should be done via service role key or Edge Functions
-- For now, we'll allow them but they should be restricted in the application
CREATE POLICY "Allow admin management"
ON admins
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- NOTE: Other table policies also reference admins table
-- They won't cause recursion (since they're not on admins table),
-- but they won't work with custom auth since auth.uid() will be null.
-- 
-- For production, you should:
-- 1. Use service role key (server-side only) for admin operations
-- 2. Or create Supabase Edge Functions for admin management  
-- 3. Or implement proper JWT-based authentication with Supabase Auth
-- 4. Or disable RLS on admin-managed tables and handle security in app layer
--
-- The current setup allows login to work and relies on application-level
-- security for admin operations. Public read access still works via
-- the public policies.
-- ============================================

