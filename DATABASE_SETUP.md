# Quick Database Setup Guide

## Step-by-Step Instructions

### 1. Access Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/kbcqytozzobqnabjizoa
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### 2. Create Tables

Copy and paste the contents of `supabase/migrations/001_create_proper_tables.sql` into the SQL editor and click "Run".

This creates:
- ✅ `vehicles` table
- ✅ `offers` table
- ✅ `leads` table
- ✅ Row Level Security policies
- ✅ Performance indexes
- ✅ Automatic timestamps

### 3. Verify Tables Were Created

Run this query to verify:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('vehicles', 'offers', 'leads');
```

You should see all three tables.

### 4. Seed Sample Data (Optional)

If you want to test with sample data, run `supabase/migrations/002_seed_data.sql`.

Or skip this and use the DataSeeder component in the app (development mode only).

### 5. Test the Application

```bash
npm run dev
```

The app will now use the new table structure automatically!

## Security Features

✅ **Row Level Security (RLS) is enabled** on all tables

**What this means:**
- Public users can read vehicles and offers
- Public users can create leads (contact form)
- Only authenticated admin users can modify data
- Data is protected by default

## Troubleshooting

**Error: "relation 'vehicles' does not exist"**
- Solution: Run the migration SQL again

**Error: "permission denied for table vehicles"**
- Solution: RLS is working! This is expected for unauthenticated users trying to modify data

**No data showing in app:**
- Check browser console for errors
- Verify data exists: `SELECT COUNT(*) FROM vehicles;`
- Ensure you're logged in for admin features

## Next Steps

1. ✅ Run the migration SQL
2. ✅ Test the app
3. ✅ Create an admin user (see SETUP.md)
4. ✅ Populate data using DataSeeder or manually
5. ✅ Deploy to production

Need more details? See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for the complete guide.
