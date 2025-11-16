import { Car, Plus, Search, Filter } from 'lucide-react';
import { Button } from '../ui/button';

export function FleetPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Fleet Management</h1>
          <p className="text-gray-600 mt-1">Manage your luxury vehicle fleet</p>
        </div>
        <Button className="flex items-center gap-2 bg-navy hover:bg-navy/90">
          <Plus size={20} />
          Add Vehicle
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search vehicles..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={20} />
            Filters
          </Button>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <Car size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-navy mb-2">Fleet Management Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          This section will allow you to manage your vehicle fleet, add new vehicles,
          upload images, track maintenance, and set pricing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-navy mb-2">✓ Add/Edit Vehicles</h3>
            <p className="text-sm text-gray-600">Manage vehicle details, specs, and pricing</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-navy mb-2">✓ Image Gallery</h3>
            <p className="text-sm text-gray-600">Upload and manage multiple images</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-navy mb-2">✓ Availability</h3>
            <p className="text-sm text-gray-600">Set featured vehicles and availability</p>
          </div>
        </div>
      </div>
    </div>
  );
}
