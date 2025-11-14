import { useState } from 'react';
import { Button } from './ui/button';
import { Alert } from './ui/alert';
import { fleetAPI, offersAPI } from '../utils/api';
import { carsData } from '../data/carsData';

// Offers data from OffersPage
const offersData = [
  {
    id: 1,
    title: 'Hari Raya Special',
    subtitle: 'Celebrate in Style',
    description: 'Get 25% off on all Executive Collection vehicles during Hari Raya season. Make a statement at your family gatherings.',
    discount: '25% OFF',
    validUntil: '2025-04-15',
    image: 'https://images.unsplash.com/photo-1659596513612-23f9db4984aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYW5nZSUyMHJvdmVyJTIwdm9ndWV8ZW58MXx8fHwxNzYxNTAzMzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    code: 'RAYA2025',
    category: 'Seasonal',
  },
  {
    id: 2,
    title: 'Wedding Package',
    subtitle: 'Your Perfect Day',
    description: 'Book any 3 vehicles for your wedding convoy and receive the 4th vehicle free. Includes professional chauffeurs and decorations.',
    discount: 'Buy 3 Get 1 Free',
    validUntil: '2025-12-31',
    image: 'https://images.unsplash.com/photo-1597535030108-7fa4d99b5530?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBlbGVnYW50fGVufDF8fHx8MTc2MTUwMzM0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    code: 'WEDDING2025',
    category: 'Events',
  },
  {
    id: 3,
    title: 'Corporate Long-Term',
    subtitle: 'For Business Excellence',
    description: 'Monthly rentals starting from RM25,000. Dedicated account manager, priority booking, and flexible terms for corporate clients.',
    discount: 'Up to 30% OFF',
    validUntil: '2025-12-31',
    image: 'https://images.unsplash.com/photo-1610099610040-ab19f3a5ec35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXJjZWRlcyUyMHMlMjBjbGFzc3xlbnwxfHx8fDE3NjE1MDMzNDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    code: 'CORPORATE2025',
    category: 'Corporate',
  },
  {
    id: 4,
    title: 'Weekend Adrenaline',
    subtitle: 'Unleash the Beast',
    description: 'Friday to Monday rentals on Adrenaline Collection at special weekend rates. Experience supercar thrills without weekday prices.',
    discount: '20% OFF',
    validUntil: '2025-11-30',
    image: 'https://images.unsplash.com/photo-1687296331978-025ad9d6be1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW1ib3JnaGluaSUyMHN1cGVyY2FyfGVufDF8fHx8MTc2MTQ5MTE4NXww&ixlib=rb-4.1.0&q=80&w=1080',
    code: 'WEEKEND2025',
    category: 'Special',
  },
  {
    id: 5,
    title: 'Early Bird Booking',
    subtitle: 'Plan Ahead & Save',
    description: 'Book 30 days or more in advance and receive an automatic 15% discount on all collections. Secure your preferred vehicle now.',
    discount: '15% OFF',
    validUntil: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1731142582229-e0ee70302c02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibXclMjBsdXh1cnklMjBzZWRhbnxlbnwxfHx8fDE3NjE1MDMzNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    code: 'EARLYBIRD',
    category: 'Ongoing',
  },
  {
    id: 6,
    title: 'Loyalty Rewards',
    subtitle: 'For Our Valued Clients',
    description: 'Your 5th rental is on us! Join our loyalty program and earn points with every booking. Exclusive access to new vehicles.',
    discount: '5th Rental Free',
    validUntil: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1672598581887-f3986de71ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3JzY2hlJTIwc3BvcnRzJTIwY2FyfGVufDF8fHx8MTc2MTQwMjI0Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    code: 'LOYALTY',
    category: 'Loyalty',
  },
];

export function DataSeeder() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const seedFleet = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const result = await fleetAPI.bulkSave(carsData);
      setStatus({ 
        type: 'success', 
        message: `Successfully seeded ${result.count} vehicles to Supabase!` 
      });
      console.log('Fleet seeded:', result);
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: `Failed to seed fleet: ${error}` 
      });
      console.error('Failed to seed fleet:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedOffers = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const result = await offersAPI.bulkSave(offersData);
      setStatus({ 
        type: 'success', 
        message: `Successfully seeded ${result.count} offers to Supabase!` 
      });
      console.log('Offers seeded:', result);
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: `Failed to seed offers: ${error}` 
      });
      console.error('Failed to seed offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedAll = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const [fleetResult, offersResult] = await Promise.all([
        fleetAPI.bulkSave(carsData),
        offersAPI.bulkSave(offersData)
      ]);
      setStatus({ 
        type: 'success', 
        message: `Successfully seeded ${fleetResult.count} vehicles and ${offersResult.count} offers to Supabase!` 
      });
      console.log('All data seeded:', { fleetResult, offersResult });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: `Failed to seed data: ${error}` 
      });
      console.error('Failed to seed data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-2xl rounded-lg p-6 border-2 border-gold max-w-md z-50">
      <h3 className="text-xl text-navy mb-4" style={{ fontWeight: 700 }}>
        Database Seeder
      </h3>
      
      {status && (
        <Alert className={`mb-4 ${status.type === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
          <p className={status.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {status.message}
          </p>
        </Alert>
      )}
      
      <div className="space-y-3">
        <Button
          onClick={seedFleet}
          disabled={loading}
          className="w-full bg-navy text-white hover:bg-navy/90"
        >
          {loading ? 'Seeding...' : 'Seed Fleet Data'}
        </Button>
        
        <Button
          onClick={seedOffers}
          disabled={loading}
          className="w-full bg-gold text-navy hover:bg-gold/90"
        >
          {loading ? 'Seeding...' : 'Seed Offers Data'}
        </Button>
        
        <Button
          onClick={seedAll}
          disabled={loading}
          className="w-full bg-gradient-to-r from-gold to-gold-light text-navy hover:shadow-lg"
          style={{ fontWeight: 600 }}
        >
          {loading ? 'Seeding...' : 'Seed All Data'}
        </Button>
      </div>
      
      <p className="text-xs text-gray-500 mt-4">
        Use this once to populate your Supabase database with fleet and offers data. 
        Remove this component after seeding.
      </p>
    </div>
  );
}
