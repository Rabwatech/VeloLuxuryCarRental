import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { leadsAPI, statsAPI } from '../../utils/api';
import { Users, Car, Tag, TrendingUp, AlertCircle, Clock } from 'lucide-react';

export function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsResult, leadsResult] = await Promise.all([
        statsAPI.get(),
        leadsAPI.getAll(),
      ]);
      setStats(statsResult.data || {});
      // Get only the 5 most recent leads
      setRecentLeads((leadsResult.data || []).slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Vehicles',
      value: stats?.totalVehicles || 0,
      icon: Car,
      color: 'navy',
      bgColor: 'bg-navy/10',
      borderColor: 'border-navy',
    },
    {
      title: 'Available',
      value: stats?.availableVehicles || 0,
      icon: Car,
      color: 'green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500',
    },
    {
      title: 'Active Offers',
      value: stats?.activeOffers || 0,
      icon: Tag,
      color: 'gold',
      bgColor: 'bg-gold/10',
      borderColor: 'border-gold',
    },
    {
      title: 'Total Leads',
      value: stats?.totalLeads || 0,
      icon: Users,
      color: 'blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500',
    },
    {
      title: 'New Leads',
      value: stats?.newLeads || 0,
      icon: TrendingUp,
      color: 'purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500',
    },
    {
      title: 'High Priority',
      value: stats?.highPriorityLeads || 0,
      icon: AlertCircle,
      color: 'red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500',
    },
    {
      title: 'Converted Leads',
      value: stats?.convertedLeads || 0,
      icon: TrendingUp,
      color: 'green-600',
      bgColor: 'bg-green-600/10',
      borderColor: 'border-green-600',
    },
    {
      title: 'Maintenance Due',
      value: stats?.maintenanceDue || 0,
      icon: Clock,
      color: 'orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-navy to-navy/90 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome Back! 👋</h1>
        <p className="text-gray-200">Here's what's happening with your luxury car rental business today.</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${stat.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-navy">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon size={24} className={`text-${stat.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-navy to-navy/90">
            <h2 className="text-xl font-bold text-white">Recent Leads</h2>
          </div>
          <div className="p-6">
            {recentLeads.length === 0 ? (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No recent leads</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users size={20} className="text-navy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy truncate">{lead.name}</p>
                      <p className="text-sm text-gray-600 truncate">{lead.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(lead.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`
                      px-2 py-1 text-xs rounded-full font-medium
                      ${lead.status === 'new' ? 'bg-blue-100 text-blue-700' : ''}
                      ${lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${lead.status === 'converted' ? 'bg-green-100 text-green-700' : ''}
                    `}>
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gold to-gold/90">
            <h2 className="text-xl font-bold text-navy">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border-2 border-navy/20 rounded-lg hover:border-navy hover:bg-navy/5 transition-all group">
                <Car className="mx-auto mb-2 text-navy" size={24} />
                <p className="text-sm font-medium text-navy">Add Vehicle</p>
              </button>
              <button className="p-4 border-2 border-gold/20 rounded-lg hover:border-gold hover:bg-gold/5 transition-all group">
                <Tag className="mx-auto mb-2 text-gold" size={24} />
                <p className="text-sm font-medium text-navy">Create Offer</p>
              </button>
              <button className="p-4 border-2 border-blue-500/20 rounded-lg hover:border-blue-500 hover:bg-blue-500/5 transition-all group">
                <Users className="mx-auto mb-2 text-blue-500" size={24} />
                <p className="text-sm font-medium text-navy">View Leads</p>
              </button>
              <button className="p-4 border-2 border-purple-500/20 rounded-lg hover:border-purple-500 hover:bg-purple-500/5 transition-all group">
                <TrendingUp className="mx-auto mb-2 text-purple-500" size={24} />
                <p className="text-sm font-medium text-navy">Analytics</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
