import { Tag, Plus } from 'lucide-react';
import { Button } from '../ui/button';

export function OffersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Offer Management</h1>
          <p className="text-gray-600 mt-1">Create and manage promotional offers</p>
        </div>
        <Button className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-navy">
          <Plus size={20} />
          Create Offer
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <Tag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-navy mb-2">Offer Management Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          Create promotional offers with discount codes, expiration dates, and usage limits.
        </p>
      </div>
    </div>
  );
}
