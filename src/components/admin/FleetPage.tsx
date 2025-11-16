import { useState, useEffect } from 'react';
import { Car, Plus, Search, Filter, Edit, Trash2, Eye, Star, Check, X, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { vehiclesAPI, vehicleImagesAPI } from '../../utils/api';
import type { Vehicle } from '../../types';

export function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const result = await vehiclesAPI.getAll();
      setVehicles(result.data || []);
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await vehiclesAPI.toggleFeatured(id, !currentStatus);
      await loadVehicles();
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      await vehiclesAPI.toggleAvailability(id, !currentStatus);
      await loadVehicles();
    } catch (error) {
      console.error('Failed to toggle availability:', error);
    }
  };

  const deleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      await vehiclesAPI.delete(id);
      await loadVehicles();
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || vehicle.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(vehicles.map(v => v.category).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Fleet Management</h1>
          <p className="text-gray-600 mt-1">Manage your luxury vehicle fleet</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-navy hover:bg-navy/90"
        >
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
              placeholder="Search vehicles by name, brand, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-navy">
          <p className="text-gray-600 text-sm">Total Vehicles</p>
          <p className="text-3xl font-bold text-navy">{vehicles.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Available</p>
          <p className="text-3xl font-bold text-navy">
            {vehicles.filter(v => v.is_available).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gold">
          <p className="text-gray-600 text-sm">Featured</p>
          <p className="text-3xl font-bold text-navy">
            {vehicles.filter(v => v.is_featured).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Unavailable</p>
          <p className="text-3xl font-bold text-navy">
            {vehicles.filter(v => !v.is_available).length}
          </p>
        </div>
      </div>

      {/* Vehicles Grid */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Car size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No vehicles found. Add your first vehicle to get started.</p>
          <Button
            onClick={() => setShowAddModal(true)}
            className="mt-4"
          >
            Add Vehicle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Vehicle Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={vehicle.primary_image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                {vehicle.is_featured && (
                  <div className="absolute top-3 right-3 bg-gold text-navy px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star size={14} />
                    Featured
                  </div>
                )}
              </div>

              {/* Vehicle Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-navy">{vehicle.name}</h3>
                    <p className="text-sm text-gray-600">{vehicle.brand} {vehicle.model} • {vehicle.year}</p>
                  </div>
                  <Badge className={vehicle.is_available ? 'bg-green-500' : 'bg-red-500'}>
                    {vehicle.is_available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>

                {/* Pricing */}
                <div className="mb-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Daily:</span>
                    <span className="font-bold text-navy">RM {vehicle.price_per_day}/day</span>
                  </div>
                  {vehicle.price_per_week && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Weekly:</span>
                      <span className="font-bold text-navy">RM {vehicle.price_per_week}/week</span>
                    </div>
                  )}
                </div>

                {/* Category */}
                {vehicle.category && (
                  <Badge variant="outline" className="mb-4">{vehicle.category}</Badge>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeatured(vehicle.id, vehicle.is_featured)}
                    className="flex-1"
                  >
                    <Star size={16} className={vehicle.is_featured ? 'fill-gold text-gold' : ''} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAvailability(vehicle.id, vehicle.is_available)}
                    className="flex-1"
                  >
                    {vehicle.is_available ? <Check size={16} /> : <X size={16} />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingVehicle(vehicle)}
                    className="flex-1"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteVehicle(vehicle.id)}
                    className="flex-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal - Coming Soon */}
      {(showAddModal || editingVehicle) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-navy">
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
            </div>
            <div className="p-6">
              <p className="text-center text-gray-600 py-8">
                Vehicle form coming soon. For now, you can toggle featured/availability and delete vehicles.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingVehicle(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
