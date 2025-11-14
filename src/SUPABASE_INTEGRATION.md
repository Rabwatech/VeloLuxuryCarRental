# VELO Luxury - Supabase Integration Guide

## Overview

This document describes the Supabase backend integration for VELO Luxury car rental website. The backend stores and manages:
- **Fleet** - All luxury vehicles across collections
- **Offers** - Special promotions and deals
- **Leads** - Contact form submissions and booking inquiries

## Architecture

```
Frontend (React) → API Layer (/utils/api.ts) → Supabase Edge Function (Hono Server) → KV Store (Supabase Database)
```

## Backend API Routes

All routes are prefixed with `/make-server-749ca9a4`

### Fleet Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/fleet` | Get all vehicles |
| GET | `/fleet/:id` | Get single vehicle by ID |
| POST | `/fleet` | Add or update a vehicle |
| DELETE | `/fleet/:id` | Delete a vehicle |
| POST | `/fleet/bulk` | Bulk add vehicles (for seeding) |

### Offers Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/offers` | Get all offers |
| GET | `/offers/:id` | Get single offer by ID |
| POST | `/offers` | Add or update an offer |
| DELETE | `/offers/:id` | Delete an offer |
| POST | `/offers/bulk` | Bulk add offers (for seeding) |

### Leads Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leads` | Get all leads (sorted by newest first) |
| GET | `/leads/:id` | Get single lead by ID |
| POST | `/leads` | Create a new lead |
| PUT | `/leads/:id/status` | Update lead status |
| DELETE | `/leads/:id` | Delete a lead |

### Statistics Route

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Get overall statistics (total vehicles, offers, leads) |

## Frontend API Usage

### Import the API

```typescript
import { fleetAPI, offersAPI, leadsAPI, statsAPI } from './utils/api';
```

### Fleet API Examples

```typescript
// Get all vehicles
const { data: vehicles } = await fleetAPI.getAll();

// Get single vehicle
const { data: vehicle } = await fleetAPI.getById('mercedes-cla-45-amg');

// Save a vehicle
const { data: savedVehicle } = await fleetAPI.save({
  id: 'new-vehicle-id',
  name: 'Vehicle Name',
  // ... other vehicle properties
});

// Delete a vehicle
await fleetAPI.delete('vehicle-id');

// Bulk seed vehicles
await fleetAPI.bulkSave(arrayOfVehicles);
```

### Offers API Examples

```typescript
// Get all offers
const { data: offers } = await offersAPI.getAll();

// Get single offer
const { data: offer } = await offersAPI.getById('1');

// Save an offer
await offersAPI.save({
  id: 1,
  title: 'Special Offer',
  // ... other offer properties
});

// Bulk seed offers
await offersAPI.bulkSave(arrayOfOffers);
```

### Leads API Examples

```typescript
// Create a lead (e.g., from contact form)
await leadsAPI.create({
  type: 'contact_form',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+60123456789',
  message: 'I am interested in renting a car',
  language: 'en',
  source: 'Contact Page'
});

// Get all leads
const { data: leads } = await leadsAPI.getAll();

// Update lead status
await leadsAPI.updateStatus('lead-id', 'contacted');
```

### Statistics Example

```typescript
const { data: stats } = await statsAPI.get();
// Returns: { totalVehicles, totalOffers, totalLeads, newLeads }
```

## Initial Database Setup

### Step 1: Seed the Database

A `DataSeeder` component is included in the app (bottom-right corner). Use it to populate the database with initial data:

1. Click **"Seed Fleet Data"** - Adds 10 luxury vehicles
2. Click **"Seed Offers Data"** - Adds 6 special offers
3. Or click **"Seed All Data"** - Seeds everything at once

### Step 2: Remove the DataSeeder

After seeding, remove the DataSeeder component from `/App.tsx`:

```typescript
// Remove this line from App.tsx
<DataSeeder />
```

## Data Storage Structure

Data is stored in Supabase's KV Store with prefixed keys:

- **Fleet**: `fleet:vehicle-id` → Vehicle object
- **Offers**: `offer:offer-id` → Offer object
- **Leads**: `lead:lead-id` → Lead object

## Lead Data Structure

When creating leads, include these fields:

```typescript
{
  type: 'contact_form' | 'booking_inquiry' | 'general',
  name: string,
  email: string,
  phone: string,
  message: string,
  subject?: string,
  language: 'en' | 'ar',
  source: string, // e.g., 'Contact Page', 'Booking Flow'
  status: 'new' | 'contacted' | 'converted' | 'closed',
  timestamp: ISO date string,
  // ... any other relevant fields
}
```

## Integration Points

### ContactPage
- Saves contact form submissions as leads
- Opens WhatsApp with form data
- Lead type: `contact_form`

### BookingFlow (Future)
- Should save booking requests as leads
- Lead type: `booking_inquiry`

### HomePage, FleetPage, CarDetailPage (Future)
- Can be updated to fetch fleet data from Supabase instead of local data
- Use `fleetAPI.getAll()` to fetch vehicles

### OffersPage (Future)
- Can be updated to fetch offers from Supabase
- Use `offersAPI.getAll()` to fetch offers

## Environment Variables

The following environment variables are automatically configured:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

Access them in the frontend:
```typescript
import { projectId, publicAnonKey } from './utils/supabase/info';
```

## Error Handling

All API calls include error handling:

```typescript
try {
  const result = await fleetAPI.getAll();
  console.log('Success:', result);
} catch (error) {
  console.error('API Error:', error);
  // Handle error appropriately
}
```

## Next Steps

1. ✅ Backend API implemented
2. ✅ Frontend API utility created
3. ✅ Contact form integrated with leads
4. ✅ Data seeder component added
5. 🔲 Update fleet pages to fetch from Supabase (optional)
6. 🔲 Update offers page to fetch from Supabase (optional)
7. 🔲 Integrate booking flow with leads
8. 🔲 Create admin dashboard to manage leads

## Notes

- The KV Store is flexible and suitable for prototyping
- No database migrations needed - data is stored as key-value pairs
- All API endpoints use proper error logging for debugging
- CORS is enabled for all origins
- Authorization uses Supabase's public anon key

## Testing

Test the integration using the browser console:

```javascript
// Test fleet API
const result = await fetch('https://[project-id].supabase.co/functions/v1/make-server-749ca9a4/fleet', {
  headers: { 'Authorization': 'Bearer [anon-key]' }
});
console.log(await result.json());
```

## Support

For questions or issues with the Supabase integration, check:
1. Browser console for error messages
2. Server logs in Supabase dashboard
3. Network tab for failed requests
