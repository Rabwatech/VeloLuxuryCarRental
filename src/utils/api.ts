import { supabase } from '../lib/supabase';
import type { Vehicle, Offer, Lead, Stats, ApiResponse } from '../types';

// ========================================
// FLEET API
// ========================================

export const fleetAPI = {
  // Get all vehicles
  getAll: async (): Promise<ApiResponse<Vehicle[]>> => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error: any) {
      console.error('Failed to fetch vehicles:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch vehicles',
      };
    }
  },

  // Get single vehicle by ID
  getById: async (id: string): Promise<ApiResponse<Vehicle>> => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Failed to fetch vehicle ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to fetch vehicle',
      };
    }
  },

  // Add or update a vehicle (admin only)
  save: async (vehicle: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .upsert(vehicle)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('Failed to save vehicle:', error);
      return {
        success: false,
        error: error.message || 'Failed to save vehicle',
      };
    }
  },

  // Delete a vehicle (admin only)
  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Vehicle deleted successfully',
      };
    } catch (error: any) {
      console.error(`Failed to delete vehicle ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to delete vehicle',
      };
    }
  },

  // Bulk add vehicles (for initial seeding)
  bulkSave: async (vehicles: Partial<Vehicle>[]): Promise<ApiResponse<Vehicle[]>> => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .upsert(vehicles)
        .select();

      if (error) throw error;

      return {
        success: true,
        data: data || [],
        count: data?.length,
      };
    } catch (error: any) {
      console.error('Failed to bulk save vehicles:', error);
      return {
        success: false,
        error: error.message || 'Failed to bulk save vehicles',
      };
    }
  },
};

// ========================================
// OFFERS API
// ========================================

export const offersAPI = {
  // Get all active offers
  getAll: async (): Promise<ApiResponse<Offer[]>> => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error: any) {
      console.error('Failed to fetch offers:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch offers',
      };
    }
  },

  // Get single offer by ID
  getById: async (id: number): Promise<ApiResponse<Offer>> => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Failed to fetch offer ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to fetch offer',
      };
    }
  },

  // Add or update an offer (admin only)
  save: async (offer: Partial<Offer>): Promise<ApiResponse<Offer>> => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .upsert(offer)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('Failed to save offer:', error);
      return {
        success: false,
        error: error.message || 'Failed to save offer',
      };
    }
  },

  // Delete an offer (admin only)
  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Offer deleted successfully',
      };
    } catch (error: any) {
      console.error(`Failed to delete offer ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to delete offer',
      };
    }
  },

  // Bulk add offers (for initial seeding)
  bulkSave: async (offers: Partial<Offer>[]): Promise<ApiResponse<Offer[]>> => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .upsert(offers)
        .select();

      if (error) throw error;

      return {
        success: true,
        data: data || [],
        count: data?.length,
      };
    } catch (error: any) {
      console.error('Failed to bulk save offers:', error);
      return {
        success: false,
        error: error.message || 'Failed to bulk save offers',
      };
    }
  },
};

// ========================================
// LEADS API
// ========================================

export const leadsAPI = {
  // Get all leads (admin only)
  getAll: async (): Promise<ApiResponse<Lead[]>> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error: any) {
      console.error('Failed to fetch leads:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch leads',
      };
    }
  },

  // Get single lead by ID (admin only)
  getById: async (id: string): Promise<ApiResponse<Lead>> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Failed to fetch lead ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to fetch lead',
      };
    }
  },

  // Create a new lead (public - contact form)
  create: async (leadData: Partial<Lead>): Promise<ApiResponse<Lead>> => {
    try {
      // Generate ID if not provided
      const id = leadData.id || `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const lead = {
        ...leadData,
        id,
        timestamp: new Date().toISOString(),
        status: leadData.status || 'new',
      };

      const { data, error } = await supabase
        .from('leads')
        .insert(lead)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('Failed to create lead:', error);
      return {
        success: false,
        error: error.message || 'Failed to create lead',
      };
    }
  },

  // Update lead status (admin only)
  updateStatus: async (id: string, status: string): Promise<ApiResponse<Lead>> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Failed to update lead status ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to update lead status',
      };
    }
  },

  // Delete a lead (admin only)
  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Lead deleted successfully',
      };
    } catch (error: any) {
      console.error(`Failed to delete lead ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to delete lead',
      };
    }
  },
};

// ========================================
// STATISTICS API
// ========================================

export const statsAPI = {
  // Get overall statistics (admin only)
  get: async (): Promise<ApiResponse<Stats>> => {
    try {
      // Run parallel queries for better performance
      const [vehiclesResult, offersResult, leadsResult, newLeadsResult] = await Promise.all([
        supabase.from('vehicles').select('id', { count: 'exact', head: true }),
        supabase.from('offers').select('id', { count: 'exact', head: true }).eq('active', true),
        supabase.from('leads').select('id', { count: 'exact', head: true }),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      ]);

      const stats: Stats = {
        totalVehicles: vehiclesResult.count || 0,
        totalOffers: offersResult.count || 0,
        totalLeads: leadsResult.count || 0,
        newLeads: newLeadsResult.count || 0,
      };

      return {
        success: true,
        data: stats,
      };
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch statistics',
      };
    }
  },
};
