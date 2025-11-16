import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { leadsAPI, statsAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { Users, Mail, Phone, Calendar, TrendingUp, LogOut } from 'lucide-react';

export function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [leadsResult, statsResult] = await Promise.all([
        leadsAPI.getAll(),
        statsAPI.get(),
      ]);
      setLeads(leadsResult.data || []);
      setStats(statsResult.data || {});
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      await leadsAPI.updateStatus(leadId, status);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'converted': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <p className="text-2xl text-navy">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto py-12">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl text-navy mb-2" style={{ fontWeight: 700 }}>
              Admin <span className="text-gold">Dashboard</span>
            </h1>
            <p className="text-gray-600">Manage your leads and monitor statistics</p>
            {user && (
              <p className="text-sm text-gray-500 mt-2">
                Logged in as: <span className="font-medium">{user.email}</span>
              </p>
            )}
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Sign Out
          </Button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-navy"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Vehicles</p>
                  <p className="text-3xl text-navy" style={{ fontWeight: 700 }}>{stats.totalVehicles}</p>
                </div>
                <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} className="text-navy" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gold"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Offers</p>
                  <p className="text-3xl text-navy" style={{ fontWeight: 700 }}>{stats.totalOffers}</p>
                </div>
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} className="text-gold" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Leads</p>
                  <p className="text-3xl text-navy" style={{ fontWeight: 700 }}>{stats.totalLeads}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-blue-500" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">New Leads</p>
                  <p className="text-3xl text-navy" style={{ fontWeight: 700 }}>{stats.newLeads}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} className="text-green-500" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl text-navy" style={{ fontWeight: 700 }}>Recent Leads</h2>
          </div>

          {leads.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No leads yet. They will appear here when customers submit the contact form.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Contact</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Type</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Status</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Date</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-navy" style={{ fontWeight: 600 }}>{lead.name}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail size={14} />
                              {lead.email}
                            </span>
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone size={14} />
                              {lead.phone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="capitalize">
                          {lead.type?.replace('_', ' ') || 'General'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${getStatusColor(lead.status)} text-white capitalize`}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(lead.timestamp).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedLead(lead)}
                          >
                            View
                          </Button>
                          {lead.status === 'new' && (
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => updateLeadStatus(lead.id, 'contacted')}
                            >
                              Mark Contacted
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedLead(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl text-navy" style={{ fontWeight: 700 }}>Lead Details</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-lg text-navy" style={{ fontWeight: 600 }}>{selectedLead.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-lg text-navy">{selectedLead.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-lg text-navy">{selectedLead.phone}</p>
                </div>
                
                {selectedLead.subject && (
                  <div>
                    <p className="text-sm text-gray-600">Subject</p>
                    <p className="text-lg text-navy">{selectedLead.subject}</p>
                  </div>
                )}
                
                {selectedLead.message && (
                  <div>
                    <p className="text-sm text-gray-600">Message</p>
                    <p className="text-navy">{selectedLead.message}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <Badge variant="outline" className="capitalize mt-1">
                      {selectedLead.type?.replace('_', ' ') || 'General'}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className={`${getStatusColor(selectedLead.status)} text-white capitalize mt-1`}>
                      {selectedLead.status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Source</p>
                  <p className="text-navy">{selectedLead.source}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Language</p>
                  <p className="text-navy">{selectedLead.language === 'ar' ? 'Arabic' : 'English'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="text-navy">{new Date(selectedLead.timestamp).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <Button
                  className="flex-1 bg-navy text-white hover:bg-navy/90"
                  onClick={() => setSelectedLead(null)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => {
                    const whatsappMessage = encodeURIComponent(`Hi ${selectedLead.name}, this is VELO Luxury following up on your inquiry.`);
                    window.open(`https://wa.me/${selectedLead.phone?.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`, '_blank');
                  }}
                >
                  Contact via WhatsApp
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
