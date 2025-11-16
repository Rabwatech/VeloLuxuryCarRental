-- ============================================
-- CLEANUP: Drop old tables before migration
-- Run this BEFORE 001_create_complete_schema.sql
-- ============================================

-- This script safely removes old tables to ensure clean migration
-- CAUTION: This will delete all existing data!
-- Make sure to backup any important data before running this.

-- Drop tables in reverse order of dependencies (children first, then parents)
DROP TABLE IF EXISTS lead_reminders CASCADE;
DROP TABLE IF EXISTS lead_notes CASCADE;
DROP TABLE IF EXISTS offer_redemptions CASCADE;
DROP TABLE IF EXISTS vehicle_maintenance CASCADE;
DROP TABLE IF EXISTS vehicle_images CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Drop old KV store table (if it exists)
-- Uncomment the line below if you want to remove the old KV store
-- DROP TABLE IF EXISTS kv_store_749ca9a4 CASCADE;

-- Drop any old triggers
DROP TRIGGER IF EXISTS update_admins_updated_at ON admins CASCADE;
DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles CASCADE;
DROP TRIGGER IF EXISTS update_offers_updated_at ON offers CASCADE;
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads CASCADE;
DROP TRIGGER IF EXISTS increment_offer_usage_trigger ON offer_redemptions CASCADE;

-- Drop old functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS increment_offer_usage() CASCADE;

-- Verify cleanup
SELECT 'Cleanup completed. Old tables dropped.' AS status;
