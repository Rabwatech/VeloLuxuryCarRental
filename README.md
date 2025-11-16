# VELO Luxury Car Rental Website

A modern, production-ready luxury car rental website built with React, TypeScript, and Supabase.

## Features

### User-Facing Features
- 🚗 Fleet browsing with detailed car information
- 💰 Special offers and promotions
- 📱 Responsive design for all devices
- 🌐 Multi-language support (English/Arabic)
- 📞 Integrated WhatsApp contact
- 🔍 SEO optimized with structured data
- 📊 Google Analytics & Meta Pixel integration

### Admin Features
- 🔐 Secure authentication with Supabase Auth
- 📊 Dashboard with statistics
- 📝 Lead management system
- 🚀 Real-time data updates
- 📱 Mobile-friendly admin interface

### Technical Features
- ⚛️ React 18 with TypeScript
- 🎨 Tailwind CSS + Radix UI components
- ✅ Input validation with Zod schemas
- 🛡️ Error boundaries for graceful error handling
- 🔔 Toast notifications for user feedback
- 📱 PWA-ready architecture
- 🧪 Testing with Vitest
- 📦 Optimized production builds
- 🔒 Security best practices

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Radix UI
- **Backend:** Supabase (Auth, Database)
- **Server:** Hono.js (Supabase Edge Functions)
- **Validation:** Zod
- **Testing:** Vitest, React Testing Library
- **Code Quality:** ESLint, Prettier, TypeScript
- **Analytics:** Google Tag Manager, Meta Pixel

## Quick Start

### 1. Installation

```bash
# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
```

### 3. Create Admin User

See [SETUP.md](./SETUP.md) for detailed instructions on creating an admin user in Supabase.

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run preview      # Preview production build
```

### Building
```bash
npm run build        # Build for production (includes type checking)
npm run typecheck    # Run TypeScript compiler (no emit)
```

### Testing
```bash
npm run test         # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

### Code Quality
```bash
npm run lint         # Lint code
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## Documentation

- [SETUP.md](./SETUP.md) - Detailed setup and deployment guide
- [.env.example](./.env.example) - Environment variables template

## Environment Variables

Required environment variables (see `.env.example`):

```env
# Supabase
VITE_SUPABASE_URL=          # Supabase project URL
VITE_SUPABASE_ANON_KEY=     # Supabase anonymous key

# Analytics
VITE_GOOGLE_TAG_MANAGER_ID= # Google Tag Manager ID
VITE_META_PIXEL_ID=         # Meta Pixel ID

# Site
VITE_SITE_URL=              # Production site URL

# Contact
VITE_WHATSAPP_NUMBER=       # WhatsApp number (no +)
VITE_CONTACT_PHONE=         # Phone number (with +)
VITE_CONTACT_EMAIL=         # Contact email
```

## Production Checklist

Before going live, ensure:

- [ ] All environment variables configured
- [ ] Admin user created in Supabase
- [ ] CORS origins updated for production domain
- [ ] Row Level Security enabled in Supabase
- [ ] API keys rotated (if exposed in git history)
- [ ] SSL/HTTPS enabled
- [ ] Error tracking configured
- [ ] Analytics configured and tested
- [ ] All forms tested and validated
- [ ] Mobile responsiveness verified

See [SETUP.md](./SETUP.md) for the complete checklist.

## Deployment

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

See [SETUP.md](./SETUP.md#building-for-production) for detailed deployment instructions.

## Support

For detailed setup instructions and troubleshooting, see [SETUP.md](./SETUP.md).

---

**Original Design:** https://www.figma.com/design/BJm5n9jLChJyf1RzwWo7MY/Luxury-Car-Rental-Website

Built with ❤️ for VELO Luxury Car Rental
