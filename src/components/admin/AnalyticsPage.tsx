import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Car, DollarSign, Calendar } from 'lucide-react';
import { statsAPI, leadsAPI, vehiclesAPI, offersAPI } from '../../utils/api';

export function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsResult, leadsResult, vehiclesResult, offersResult] = await Promise.all([
        statsAPI.get(),
        leadsAPI.getAll(),
        vehiclesAPI.getAll(),
        offersAPI.getAllAdmin(),
      ]);

      setStats(statsResult.data);
      setLeads(leadsResult.data || []);
      setVehicles(vehiclesResult.data || []);
      setOffers(offersResult.data || []);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Calculate conversion rate
  const conversionRate = stats?.totalLeads > 0
    ? ((stats.convertedLeads / stats.totalLeads) * 100).toFixed(1)
    : '0';

  // Lead status breakdown
  const leadsByStatus = {
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
    closed: leads.filter(l => l.status === 'closed').length,
    lost: leads.filter(l => l.status === 'lost').length,
  };

  // Category breakdown
  const vehiclesByCategory = vehicles.reduce((acc, v) => {
    const cat = v.category || 'uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Recent activity (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentLeads = leads.filter(l => new Date(l.timestamp) >= thirtyDaysAgo);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy">Analytics & Reports</h1>
        <p className="text-gray-600 mt-1">Business insights and performance metrics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users size={32} className="opacity-80" />
            <TrendingUp size={20} className="opacity-60" />
          </div>
          <p className="text-sm opacity-80 mb-1">Conversion Rate</p>
          <p className="text-4xl font-bold">{conversionRate}%</p>
          <p className="text-xs opacity-60 mt-2">
            {stats?.convertedLeads} of {stats?.totalLeads} leads
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar size={32} className="opacity-80" />
            <TrendingUp size={20} className="opacity-60" />
          </div>
          <p className="text-sm opacity-80 mb-1">Last 30 Days</p>
          <p className="text-4xl font-bold">{recentLeads.length}</p>
          <p className="text-xs opacity-60 mt-2">New leads</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Car size={32} className="opacity-80" />
            <BarChart3 size={20} className="opacity-60" />
          </div>
          <p className="text-sm opacity-80 mb-1">Fleet Utilization</p>
          <p className="text-4xl font-bold">
            {stats?.availableVehicles > 0
              ? ((stats.availableVehicles / stats.totalVehicles) * 100).toFixed(0)
              : '0'}%
          </p>
          <p className="text-xs opacity-60 mt-2">
            {stats?.availableVehicles} available
          </p>
        </div>

        <div className="bg-gradient-to-br from-gold to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign size={32} className="opacity-80" />
            <TrendingUp size={20} className="opacity-60" />
          </div>
          <p className="text-sm opacity-80 mb-1">Active Offers</p>
          <p className="text-4xl font-bold">{stats?.activeOffers}</p>
          <p className="text-xs opacity-60 mt-2">
            {offers.reduce((sum, o) => sum + (o.usage_count || 0), 0)} redemptions
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-navy mb-6">Lead Status Breakdown</h2>
          <div className="space-y-4">
            {Object.entries(leadsByStatus).map(([status, count]) => {
              const percentage = stats?.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0;
              const colors: Record<string, string> = {
                new: 'bg-blue-500',
                contacted: 'bg-yellow-500',
                qualified: 'bg-purple-500',
                converted: 'bg-green-500',
                closed: 'bg-gray-500',
                lost: 'bg-red-500',
              };

              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                    <span className="text-sm font-bold text-navy">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${colors[status]} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vehicle Category Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-navy mb-6">Fleet by Category</h2>
          <div className="space-y-4">
            {Object.entries(vehiclesByCategory).map(([category, count], index) => {
              const percentage = stats?.totalVehicles > 0 ? (count / stats.totalVehicles) * 100 : 0;
              const colors = [
                'bg-navy',
                'bg-gold',
                'bg-blue-500',
                'bg-purple-500',
                'bg-green-500',
                'bg-red-500',
              ];

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm font-bold text-navy">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${colors[index % colors.length]} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">High Priority Leads</h3>
          <p className="text-3xl font-bold text-navy mb-1">{stats?.highPriorityLeads}</p>
          <p className="text-xs text-gray-500">
            {stats?.totalLeads > 0
              ? ((stats.highPriorityLeads / stats.totalLeads) * 100).toFixed(1)
              : '0'}% of total leads
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Featured Vehicles</h3>
          <p className="text-3xl font-bold text-navy mb-1">{stats?.featuredVehicles}</p>
          <p className="text-xs text-gray-500">
            {stats?.totalVehicles > 0
              ? ((stats.featuredVehicles / stats.totalVehicles) * 100).toFixed(1)
              : '0'}% of fleet
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Maintenance Due</h3>
          <p className="text-3xl font-bold text-navy mb-1">{stats?.maintenanceDue || 0}</p>
          <p className="text-xs text-gray-500">Next 30 days</p>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-navy to-navy/90 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Business Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">🎯 Performance Highlights</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• {conversionRate}% of leads are converting to customers</li>
              <li>• {recentLeads.length} new inquiries in the last 30 days</li>
              <li>• {stats?.activeOffers} active promotional offers running</li>
              <li>• {stats?.featuredVehicles} vehicles featured on homepage</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">💡 Recommendations</h3>
            <ul className="space-y-2 text-sm opacity-90">
              {stats?.highPriorityLeads > 0 && (
                <li>• Follow up on {stats.highPriorityLeads} high priority leads</li>
              )}
              {stats?.newLeads > 5 && (
                <li>• {stats.newLeads} new leads waiting for initial contact</li>
              )}
              {stats?.maintenanceDue > 0 && (
                <li>• Schedule maintenance for {stats.maintenanceDue} vehicles</li>
              )}
              {stats?.availableVehicles < stats?.totalVehicles / 2 && (
                <li>• Consider making more vehicles available for rental</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
