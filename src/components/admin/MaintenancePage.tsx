import { useState, useEffect } from 'react';
import { Wrench, Plus, Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { vehicleMaintenanceAPI, vehiclesAPI } from '../../utils/api';
import type { VehicleMaintenance, Vehicle } from '../../types';

export function MaintenancePage() {
  const [maintenanceRecords, setMaintenanceRecords] = useState<VehicleMaintenance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState<VehicleMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vehiclesResult, upcomingResult] = await Promise.all([
        vehiclesAPI.getAll(),
        vehicleMaintenanceAPI.getUpcoming(30),
      ]);

      setVehicles(vehiclesResult.data || []);
      setUpcomingMaintenance(upcomingResult.data || []);

      // Load all maintenance records
      const allRecords: VehicleMaintenance[] = [];
      for (const vehicle of vehiclesResult.data || []) {
        const result = await vehicleMaintenanceAPI.getByVehicleId(vehicle.id);
        allRecords.push(...(result.data || []));
      }
      setMaintenanceRecords(allRecords.sort((a, b) =>
        new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime()
      ));
    } catch (error) {
      console.error('Failed to load maintenance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = selectedVehicle === 'all'
    ? maintenanceRecords
    : maintenanceRecords.filter(r => r.vehicle_id === selectedVehicle);

  const totalCost = filteredRecords.reduce((sum, record) => sum + (record.cost || 0), 0);

  const getMaintenanceTypeColor = (type: string) => {
    switch (type) {
      case 'service': return 'bg-blue-500';
      case 'repair': return 'bg-red-500';
      case 'inspection': return 'bg-green-500';
      case 'cleaning': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.name : vehicleId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Maintenance Tracking</h1>
          <p className="text-gray-600 mt-1">Track vehicle service and maintenance history</p>
        </div>
        <Button className="flex items-center gap-2 bg-navy hover:bg-navy/90">
          <Plus size={20} />
          Add Maintenance Record
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-navy">
          <p className="text-gray-600 text-sm">Total Records</p>
          <p className="text-3xl font-bold text-navy">{filteredRecords.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={20} className="text-orange-500" />
            <p className="text-gray-600 text-sm">Upcoming</p>
          </div>
          <p className="text-3xl font-bold text-navy">{upcomingMaintenance.length}</p>
          <p className="text-xs text-gray-500 mt-1">Next 30 days</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">This Month</p>
          <p className="text-3xl font-bold text-navy">
            {filteredRecords.filter(r => {
              const date = new Date(r.performed_at);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-blue-500" />
            <p className="text-gray-600 text-sm">Total Cost</p>
          </div>
          <p className="text-3xl font-bold text-navy">RM {totalCost.toFixed(2)}</p>
        </div>
      </div>

      {/* Upcoming Maintenance Alert */}
      {upcomingMaintenance.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle size={24} className="text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-navy mb-2">Upcoming Maintenance Required</h3>
              <p className="text-sm text-gray-600 mb-3">
                {upcomingMaintenance.length} vehicle{upcomingMaintenance.length > 1 ? 's' : ''} require maintenance in the next 30 days.
              </p>
              <div className="space-y-2">
                {upcomingMaintenance.slice(0, 3).map((record) => (
                  <div key={record.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div>
                      <p className="font-medium text-navy">{getVehicleName(record.vehicle_id)}</p>
                      <p className="text-sm text-gray-600">{record.description}</p>
                    </div>
                    <p className="text-sm font-medium text-orange-600">
                      {new Date(record.next_service_date!).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Vehicle:</label>
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
          >
            <option value="all">All Vehicles</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Maintenance Records */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Loading maintenance records...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Wrench size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No maintenance records found.</p>
          <Button className="mt-4">Add First Record</Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Next Service</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-navy">{getVehicleName(record.vehicle_id)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getMaintenanceTypeColor(record.maintenance_type)}>
                        {record.maintenance_type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{record.description}</p>
                      {record.performed_by && (
                        <p className="text-xs text-gray-500">by {record.performed_by}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(record.performed_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {record.cost ? (
                        <p className="font-medium text-navy">RM {record.cost.toFixed(2)}</p>
                      ) : (
                        <p className="text-gray-400">-</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {record.next_service_date ? (
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <p className="text-sm text-gray-600">
                            {new Date(record.next_service_date).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-400">-</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
