# VELO Luxury Car Rental - Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (already configured)

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Update the `.env.local` file with your actual values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://kbcqytozzobqnabjizoa.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Analytics
VITE_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXX
VITE_META_PIXEL_ID=123456789

# Site Configuration
VITE_SITE_URL=https://veloluxury.my

# Contact
VITE_WHATSAPP_NUMBER=60123456789
VITE_CONTACT_PHONE=+60123456789
VITE_CONTACT_EMAIL=info@veloluxury.my
```

### 3. Create Admin User in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/kbcqytozzobqnabjizoa
2. Navigate to **Authentication** > **Users**
3. Click **Add User** > **Create new user**
4. Enter admin credentials:
   - Email: `admin@veloluxury.my` (or your preferred email)
   - Password: Strong password (min 6 characters)
   - Auto Confirm User: **Enable** (check the box)
5. Click **Create user**

### 4. Update CORS Configuration

Update the allowed origins in `src/supabase/functions/server/index.tsx`:

```typescript
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://your-production-domain.com',  // Update with your actual domain
  'https://www.your-production-domain.com',
];
```

## Development

### Run Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Access Admin Dashboard

1. Navigate to http://localhost:3000/login
2. Log in with the admin credentials you created in Supabase
3. You'll be redirected to the admin dashboard at http://localhost:3000/admin

### Seed Initial Data (Development Only)

The DataSeeder component is automatically available in development mode (bottom-right corner):
- Click "Seed Fleet Data" to populate vehicles
- Click "Seed Offers Data" to populate special offers

**Note:** This component is automatically hidden in production builds.

## Testing

### Run Tests

```bash
# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Check TypeScript types
npm run typecheck

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## Building for Production

### 1. Build the Application

```bash
npm run build
```

This will:
- Type-check all TypeScript files
- Bundle and minify the application
- Generate source maps
- Output to `dist/` directory

### 2. Preview Production Build

```bash
npm run preview
```

### 3. Deploy

The `dist/` folder contains the production-ready build. Deploy this to your hosting platform:

#### Vercel
```bash
vercel --prod
```

#### Netlify
```bash
netlify deploy --prod --dir=dist
```

#### Traditional Hosting
Upload the contents of the `dist/` folder to your web server.

## Security Checklist Before Production

- [ ] Update Supabase API keys (rotate exposed keys)
- [ ] Set up Row Level Security (RLS) policies in Supabase
- [ ] Update CORS allowed origins
- [ ] Configure environment variables on hosting platform
- [ ] Enable HTTPS/SSL on your domain
- [ ] Set up proper CSP headers
- [ ] Review and restrict Supabase permissions
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure monitoring and analytics
- [ ] Test authentication flow
- [ ] Test all forms with validation
- [ ] Verify admin dashboard security

## Supabase Configuration

### Required Tables

The application uses a single KV store table: `kv_store_749ca9a4`

### Authentication Setup

Supabase Auth is configured for email/password authentication. No additional configuration needed.

### Row Level Security (RLS)

**IMPORTANT:** Before production, enable RLS on the KV store table:

```sql
-- Enable RLS
ALTER TABLE kv_store_749ca9a4 ENABLE ROW LEVEL SECURITY;

-- Allow public read access for fleet and offers
CREATE POLICY "Public read access for fleet and offers"
ON kv_store_749ca9a4 FOR SELECT
USING (key LIKE 'fleet:%' OR key LIKE 'offer:%');

-- Allow public insert for leads
CREATE POLICY "Public insert for leads"
ON kv_store_749ca9a4 FOR INSERT
WITH CHECK (key LIKE 'lead:%');

-- Allow authenticated users full access (for admin dashboard)
CREATE POLICY "Authenticated users full access"
ON kv_store_749ca9a4 FOR ALL
USING (auth.role() = 'authenticated');
```

## Troubleshooting

### Build Errors

If you encounter TypeScript errors during build:
```bash
npm run typecheck
```

### Authentication Issues

- Verify Supabase URL and anon key in `.env.local`
- Check that user exists in Supabase dashboard
- Clear browser cookies and localStorage
- Check browser console for errors

### CORS Errors

- Update `ALLOWED_ORIGINS` in server configuration
- Verify your domain is in the allowed list
- Check browser console for specific CORS errors

## Support

For issues or questions:
- Check the main README.md
- Review error logs in browser console
- Check Supabase logs in dashboard
- Contact development team

## Next Steps

1. Set up production environment variables
2. Configure custom domain
3. Set up SSL certificate
4. Configure backup strategy
5. Set up monitoring and alerts
6. Create content and upload assets
7. Test all user flows
8. Launch! 🚀
