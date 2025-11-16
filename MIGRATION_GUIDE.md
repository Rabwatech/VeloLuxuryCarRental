# Database Migration Guide
## From KV Store to Proper Tables

This guide will help you migrate from the KV store structure to proper PostgreSQL tables.

## Prerequisites

- Access to Supabase Dashboard
- Admin access to your Supabase project
- Current project ID: `kbcqytozzobqnabjizoa`

## Migration Steps

### Step 1: Backup Current Data (Optional)

If you have production data in the KV store, export it first:

```sql
-- Run in Supabase SQL Editor
SELECT * FROM kv_store_749ca9a4;
```

Save the results as a backup.

### Step 2: Create New Tables

1. Go to Supabase Dashboard → SQL Editor
2. Open `supabase/migrations/001_create_proper_tables.sql`
3. Copy and paste the entire SQL script
4. Click "Run" to execute

This will create:
- `vehicles` table
- `offers` table
- `leads` table
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for `updated_at` timestamps

### Step 3: Verify Tables Created

Run this query to verify:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('vehicles', 'offers', 'leads');
```

You should see all three tables listed.

### Step 4: Seed Initial Data (Optional)

If you want to add sample data for testing:

1. Open `supabase/migrations/002_seed_data.sql`
2. Customize the sample data or use your own
3. Copy and paste into SQL Editor
4. Click "Run"

### Step 5: Update Application Code

The application code has already been updated to use the new tables:

- ✅ `src/utils/api.ts` - Now uses Supabase client directly
- ✅ `src/types/index.ts` - Type definitions match new schema
- ✅ RLS policies ensure security

### Step 6: Test the Application

1. **Test Public Access** (not logged in):
   ```bash
   npm run dev
   ```
   - Browse fleet page - should show vehicles
   - View offers page - should show active offers
   - Submit contact form - should create a lead

2. **Test Admin Access** (logged in):
   - Login at `/login`
   - Access dashboard at `/admin`
   - View leads, statistics
   - Try updating lead status

### Step 7: Migrate Existing Data (If Applicable)

If you have existing data in the KV store, run this migration script:

```sql
-- Migrate vehicles from KV store
INSERT INTO vehicles (
  id, brand, model, name, year, price_per_day, image,
  specs, available
)
SELECT
  value->>'id' as id,
  value->>'brand' as brand,
  value->>'model' as model,
  value->>'name' as name,
  (value->>'year')::integer as year,
  (value->>'pricePerDay')::decimal as price_per_day,
  value->>'image' as image,
  value->'specs' as specs,
  COALESCE((value->>'available')::boolean, true) as available
FROM kv_store_749ca9a4
WHERE key LIKE 'fleet:%';

-- Migrate offers from KV store
INSERT INTO offers (
  title, description, discount, active
)
SELECT
  value->>'title' as title,
  value->>'description' as description,
  value->>'discount' as discount,
  COALESCE((value->>'active')::boolean, true) as active
FROM kv_store_749ca9a4
WHERE key LIKE 'offer:%';

-- Migrate leads from KV store
INSERT INTO leads (
  id, name, email, phone, subject, message,
  type, status, source, language, timestamp
)
SELECT
  value->>'id' as id,
  value->>'name' as name,
  value->>'email' as email,
  value->>'phone' as phone,
  value->>'subject' as subject,
  value->>'message' as message,
  COALESCE(value->>'type', 'general') as type,
  COALESCE(value->>'status', 'new') as status,
  value->>'source' as source,
  COALESCE(value->>'language', 'en') as language,
  COALESCE(
    (value->>'timestamp')::timestamptz,
    NOW()
  ) as timestamp
FROM kv_store_749ca9a4
WHERE key LIKE 'lead:%';
```

### Step 8: Verify Migration

```sql
-- Check record counts
SELECT 'Vehicles' as table_name, COUNT(*) as count FROM vehicles
UNION ALL
SELECT 'Offers', COUNT(*) FROM offers
UNION ALL
SELECT 'Leads', COUNT(*) FROM leads;

-- Verify RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('vehicles', 'offers', 'leads');
```

All tables should show `rowsecurity = true`.

### Step 9: Remove Old KV Store (Optional)

⚠️ **ONLY DO THIS AFTER VERIFYING EVERYTHING WORKS**

```sql
-- Backup first!
CREATE TABLE kv_store_749ca9a4_backup AS
SELECT * FROM kv_store_749ca9a4;

-- Then drop
DROP TABLE kv_store_749ca9a4;
```

### Step 10: Remove Edge Function (Optional)

The edge function (`src/supabase/functions/server/`) is no longer needed since we're using Supabase client directly. You can:

1. Keep it for backward compatibility
2. Or delete it if you're sure you don't need it

## Security Features

### Row Level Security (RLS) Policies

**Vehicles:**
- ✅ Public can read available vehicles
- ✅ Authenticated users (admins) can manage all vehicles

**Offers:**
- ✅ Public can read active offers
- ✅ Authenticated users (admins) can manage all offers

**Leads:**
- ✅ Public can create leads (contact form)
- ✅ Authenticated users (admins) can read/update/delete leads

### Database Features

- ✅ Automatic `updated_at` timestamps
- ✅ Indexes for performance
- ✅ Foreign key constraints
- ✅ Data validation at database level

## Troubleshooting

### Issue: "permission denied for table vehicles"

**Solution:** RLS is blocking access. Check your policies:

```sql
SELECT * FROM pg_policies WHERE tablename = 'vehicles';
```

### Issue: "Could not insert row"

**Solution:** Check RLS policies. Unauthenticated users can only insert leads.

### Issue: "Columns don't exist"

**Solution:** Make sure you ran the migration SQL. Check:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'vehicles';
```

### Issue: No data showing in app

**Solution:**
1. Check browser console for errors
2. Verify data exists: `SELECT COUNT(*) FROM vehicles;`
3. Check RLS policies are correct
4. Ensure `available = true` for vehicles

## Performance Tips

1. **Use indexes** - Already created for common queries
2. **Limit results** - Add `.limit(100)` to large queries
3. **Select specific columns** - Don't use `SELECT *` in production
4. **Use caching** - Consider React Query for client-side caching

## Next Steps

After successful migration:

1. ✅ Test all features thoroughly
2. ✅ Monitor Supabase logs for errors
3. ✅ Set up database backups in Supabase dashboard
4. ✅ Configure database connection pooling (if needed)
5. ✅ Set up monitoring and alerts

## Rollback Plan

If something goes wrong:

```sql
-- Restore from backup
INSERT INTO kv_store_749ca9a4
SELECT * FROM kv_store_749ca9a4_backup;

-- Or restore from Supabase backup (Dashboard → Database → Backups)
```

## Support

If you encounter issues:

1. Check Supabase logs in Dashboard
2. Check browser console for errors
3. Verify RLS policies are correct
4. Check this migration guide
5. Review the table schema

## Summary

✅ Modern PostgreSQL tables instead of KV store
✅ Row Level Security for data protection
✅ Better performance with indexes
✅ Type-safe with proper schema
✅ Easier to query and manage
✅ Production-ready architecture

The migration is complete! Your application now uses a proper relational database structure.
