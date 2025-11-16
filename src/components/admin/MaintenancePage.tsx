import { Wrench } from 'lucide-react';

export function MaintenancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy">Maintenance Tracking</h1>
        <p className="text-gray-600 mt-1">Track vehicle service and maintenance history</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <Wrench size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-navy mb-2">Maintenance Tracking Coming Soon</h2>
        <p className="text-gray-600">
          Track service records, schedule maintenance, and get alerts for upcoming services.
        </p>
      </div>
    </div>
  );
}
