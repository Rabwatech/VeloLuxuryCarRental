import { BarChart3 } from 'lucide-react';

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy">Analytics & Reports</h1>
        <p className="text-gray-600 mt-1">View business insights and performance metrics</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <BarChart3 size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-navy mb-2">Analytics Coming Soon</h2>
        <p className="text-gray-600">
          Track revenue, conversion rates, popular vehicles, and customer insights.
        </p>
      </div>
    </div>
  );
}
