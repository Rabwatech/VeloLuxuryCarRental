-- ============================================
-- FIX: Update admin passwords for development
-- This sets placeholder password hashes since we're using
-- temporary client-side validation anyway
-- ============================================

-- Update existing admin records with placeholder password_hash
-- The actual password validation is done in the application code
-- using the temporary password check

UPDATE admins
SET password_hash = 'temp_Admin@123'
WHERE email = 'admin@veloluxury.my';

UPDATE admins
SET password_hash = 'temp_Manager@123'
WHERE email = 'manager@veloluxury.my';

-- Verify the update
SELECT email, password_hash, role, is_active
FROM admins
ORDER BY email;

-- Note: This is ONLY for development!
-- For production, you MUST implement proper bcrypt password hashing
-- on the server-side (Supabase Edge Function or backend API)
