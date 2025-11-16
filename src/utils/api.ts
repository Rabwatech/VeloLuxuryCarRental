import { supabase } from '../lib/supabase';
import type {
  Admin,
  AdminLoginCredentials,
  Vehicle,
  VehicleImage,
  VehicleMaintenance,
  Offer,
  OfferRedemption,
  Lead,
  LeadNote,
  LeadReminder,
  LeadFilters,
  VehicleFilters,
  Stats,
  ApiResponse,
} from '../types';

// ========================================
// ADMIN API (Authentication & Management)
// ========================================

export const adminAPI = {
  // Login admin user
  login: async (credentials: AdminLoginCredentials): Promise<ApiResponse<Admin>> => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', credentials.email)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Invalid credentials');

      // Note: In production, password verification should happen server-side
      // This is a placeholder - implement proper bcrypt comparison on backend

      // Update last login
      await supabase
        .from('admins')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', data.id);

      // Remove password_hash from response
      const { password_hash, ...adminData } = data;

      return {
        success: true,
        data: adminData as Admin,
      };
    } catch (error: any) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  },

  // Get all admins (super_admin only)
  getAll: async (): Promise<ApiResponse<Admin[]>> => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('id, email, full_name, role, phone, is_active, last_login_at, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error: any) {
      console.error('Failed to fetch admins:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch admins',
      };
    }
  },

  // Create admin (super_admin only)
  create: async (adminData: Partial<Admin>): Promise<ApiResponse<Admin>> => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .insert(adminData)
        .select('id, email, full_name, role, phone, is_active, last_login_at, created_at, updated_at')
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('Failed to create admin:', error);
      return {
        success: false,
        error: error.message || 'Failed to create admin',
      };
    }
  },

  // Update admin (super_admin only)
  update: async (id: string, adminData: Partial<Admin>): Promise<ApiResponse<Admin>> => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .update(adminData)
        .eq('id', id)
        .select('id, email, full_name, role, phone, is_active, last_login_at, created_at, updated_at')
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('Failed to update admin:', error);
      return {
        success: false,
        error: error.message || 'Failed to update admin',
      };
    }
  },

  // Deactivate admin (super_admin only)
  deactivate: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const { error } = await supabase
        .from('admins')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Admin deactivated successfully',
      };
    } catch (error: any) {
      console.error('Failed to deactivate admin:', error);
      return {
        success: false,
        error: error.message || 'Failed to deactivate admin',
      };
    }
  },
};

// ========================================
// VEHICLES API
// ========================================

export const vehiclesAPI = {
  // Get all vehicles (with optional filters)
  getAll: async (filters?: VehicleFilters): Promise<ApiResponse<Vehicle[]>> => {
    try {
      let query = supabase
        .from('vehicles')
        .select('*');

      // Apply filters
      if (filters?.is_available !== undefined) {
        query = query.eq('is_available', filters.is_available);
      }
      if (filters?.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }
      if (filters?.category && filters.category.length > 0) {
        query = query.in('category', filters.category);
      }
      if (filters?.collection && filters.collection.length > 0) {
        query = query.in('collection', filters.collection);
      }
      if (filters?.price_min !== undefined) {
        query = query.gte('price_per_day', filters.price_min);
      }
      if (filters?.price_max !== undefined) {
        query = query.lte('price_per_day', filters.price_max);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

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

  // Get single vehicle by ID (with images)
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

  // Toggle featured status
  toggleFeatured: async (id: string, is_featured: boolean): Promise<ApiResponse<Vehicle>> => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update({ is_featured })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Failed to toggle featured status ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to update featured status',
      };
    }
  },

  // Toggle availability
  toggleAvailability: async (id: string, is_available: boolean): Promise<ApiResponse<Vehicle>> => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update({ is_available })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Failed to toggle availability ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to update availability',
      };
    }
  },
};

// ========================================
// VEHICLE IMAGES API
// ========================================

export const vehicleImagesAPI = {
  // Get all images for a vehicle
  getByVehicleId: async (vehicleId: string): Promise<ApiResponse<VehicleImage[]>> => {
    try {
      const { data, error } = await supabase
        .from('vehicle_images')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('display_order', { ascending: true });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error: any) {
      console.error(`Failed to fetch images for vehicle ${vehicleId}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to fetch vehicle images',
      };
    }
  },

  // Add image to vehicle
  add: async (image: Partial<VehicleImage>): Promise<ApiResponse<VehicleImage>> => {
    try {
      const { data, error } = await supabase
        .from('vehicle_images')
        .insert(image)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('Failed to add vehicle image:', error);
      return {
        success: false,
        error: error.message || 'Failed to add vehicle image',
      };
    }
  },

  // Update image (reorder, caption, etc.)
  update: async (id: number, imageData: Partial<VehicleImage>): Promise<ApiResponse<VehicleImage>> => {
    try {
      const { data, error } = await supabase
        .from('vehicle_images')
        .update(imageData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Failed to update vehicle image ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to update vehicle image',
      };
    }
  },

  // Delete image
  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const { error } = await supabase
        .from('vehicle_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Image deleted successfully',
      };
    } catch (error: any) {
      console.error(`Failed to delete vehicle image ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to delete vehicle image',
      };
    }
  },

  // Set primary image
  setPrimary: async (vehicleId: string, imageId: number): Promise<ApiResponse<void>> => {
    try {
      // First, unset all primary images for this vehicle
      await supabase
        .from('vehicle_images')
        .update({ is_primary: false })
        .eq('vehicle_id', vehicleId);

      // Then set the new primary image
      const { error } = await supabase
        .from('vehicle_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      if (error) throw error;

      return {
        success: true,
        message: 'Primary image set successfully',
      };
    } catch (error: any) {
      console.error('Failed to set primary image:', error);
      return {
        success: false,
        error: error.message || 'Failed to set primary image',
      };
    }
  },
};

// ========================================
// VEHICLE MAINTENANCE API
// ========================================

export const vehicleMaintenanceAPI = {
  // Get maintenance history for a vehicle
  getByVehicleId: async (vehicleId: string): Promise<ApiResponse<VehicleMaintenance[]>> => {
    try {
      const { data, error } = await supabase
        .from('vehicle_maintenance')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('performed_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error: any) {
      console.error(`Failed to fetch maintenance for vehicle ${vehicleId}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to fetch maintenance history',
      };
    }
  },

  // Get upcoming maintenance (vehicles with next_service_date approaching)
  getUpcoming: async (daysAhead = 30): Promise<ApiResponse<VehicleMaintenance[]>> => {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const { data, error } = await supabase
        .from('vehicle_maintenance')
        .select('*')
        .lte('next_service_date', futureDate.toISOString().split('T')[0])
        .order('next_service_date', { ascending: true });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error: any) {
      console.error('Failed to fetch upcoming maintenance:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch upcoming maintenance',
      };
    }
  },

  // Add maintenance record
  add: async (maintenance: Partial<VehicleMaintenance>): Promise<ApiResponse<VehicleMaintenance>> => {
    try {
      const { data, error } = await supabase
        .from('vehicle_maintenance')
        .insert(maintenance)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('Failed to add maintenance record:', error);
      return {
        success: false,
        error: error.message || 'Failed to add maintenance record',
      };
    }
  },

  // Update maintenance record
  update: async (id: number, maintenanceData: Partial<VehicleMaintenance>): Promise<ApiResponse<VehicleMaintenance>> => {
    try {
      const { data, error } = await supabase
        .from('vehicle_maintenance')
        .update(maintenanceData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Failed to update maintenance record ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to update maintenance record',
      };
    }
  },

  // Delete maintenance record
  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const { error } = await supabase
        .from('vehicle_maintenance')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Maintenance record deleted successfully',
      };
    } catch (error: any) {
      console.error(`Failed to delete maintenance record ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to delete maintenance record',
      };
    }
  },
};

// ========================================
// OFFERS API
// ========================================

export const offersAPI = {
  // Get all active offers (public)
  getAll: async (): Promise<ApiResponse<Offer[]>> => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('is_active', true)
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

  // Get all offers (admin - including inactive)
  getAllAdmin: async (): Promise<ApiResponse<Offer[]>> => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
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

  // Get offer by code (for validation)
  getByCode: async (code: string): Promise<ApiResponse<Offer>> => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('offer_code', code)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      // Check if offer is still valid (not expired)
      if (data.valid_until) {
        const expiryDate = new Date(data.valid_until);
        if (expiryDate < new Date()) {
          throw new Error('Offer has expired');
        }
      }

      // Check usage limit
      if (data.usage_limit && data.usage_count >= data.usage_limit) {
        throw new Error('Offer usage limit reached');
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Failed to fetch offer with code ${code}:`, error);
      return {
        success: false,
        error: error.message || 'Invalid offer code',
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

  // Toggle offer active status
  toggleActive: async (id: number, is_active: boolean): Promise<ApiResponse<Offer>> => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Failed to toggle offer status ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to update offer status',
      };
    }
  },
};

// ========================================
// OFFER REDEMPTIONS API
// ========================================

export const offerRedemptionsAPI = {
  // Get redemptions for an offer
  getByOfferId: async (offerId: number): Promise<ApiResponse<OfferRedemption[]>> => {
    try {
      const { data, error } = await supabase
        .from('offer_redemptions')
        .select('*')
        .eq('offer_id', offerId)
        .order('redeemed_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error: any) {
      console.error(`Failed to fetch redemptions for offer ${offerId}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to fetch offer redemptions',
      };
    }
  },

  // Record offer redemption
  redeem: async (redemption: Partial<OfferRedemption>): Promise<ApiResponse<OfferRedemption>> => {
    try {
      const { data, error } = await supabase
        .from('offer_redemptions')
        .insert(redemption)
        .select()
        .single();

      if (error) throw error;

      // Note: usage_count is automatically incremented by database trigger

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('Failed to record offer redemption:', error);
      return {
        success: false,
        error: error.message || 'Failed to record offer redemption',
      };
    }
  },
};

// ========================================
// LEADS API
// ========================================

export const leadsAPI = {
  // Get all leads (admin only, with filters)
  getAll: async (filters?: LeadFilters): Promise<ApiResponse<Lead[]>> => {
    try {
      let query = supabase
        .from('leads')
        .select('*');

      // Apply filters
      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      if (filters?.type && filters.type.length > 0) {
        query = query.in('type', filters.type);
      }
      if (filters?.priority && filters.priority.length > 0) {
        query = query.in('priority', filters.priority);
      }
      if (filters?.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }
      if (filters?.date_from) {
        query = query.gte('timestamp', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('timestamp', filters.date_to);
      }
      if (filters?.search) {
        // Search in name, email, phone, subject, message
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,subject.ilike.%${filters.search}%,message.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('timestamp', { ascending: false });

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
        priority: leadData.priority || 'normal',
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

  // Update lead (admin only)
  update: async (id: string, leadData: Partial<Lead>): Promise<ApiResponse<Lead>> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ ...leadData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Failed to update lead ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to update lead',
      };
    }
  },

  // Update lead status (admin only)
  updateStatus: async (id: string, status: string): Promise<ApiResponse<Lead>> => {
    try {
      const updateData: any = { status, updated_at: new Date().toISOString() };

      // If status is being changed to 'contacted', update last_contacted_at
      if (status === 'contacted') {
        updateData.last_contacted_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('leads')
        .update(updateData)
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

  // Assign lead to admin (admin only)
  assign: async (id: string, adminId: string): Promise<ApiResponse<Lead>> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ assigned_to: adminId, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Failed to assign lead ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to assign lead',
      };
    }
  },

  // Set lead priority (admin only)
  setPriority: async (id: string, priority: string): Promise<ApiResponse<Lead>> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ priority, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Failed to set lead priority ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to set lead priority',
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

  // Export leads to CSV format
  exportToCSV: async (filters?: LeadFilters): Promise<ApiResponse<string>> => {
    try {
      const result = await leadsAPI.getAll(filters);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch leads');
      }

      const leads = result.data;

      // CSV headers
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Type', 'Status', 'Priority', 'Assigned To', 'Vehicle ID', 'Offer Code', 'Source', 'Language', 'Timestamp'];

      // CSV rows
      const rows = leads.map(lead => [
        lead.id,
        lead.name,
        lead.email,
        lead.phone,
        lead.subject || '',
        lead.message || '',
        lead.type,
        lead.status,
        lead.priority,
        lead.assigned_to || '',
        lead.vehicle_id || '',
        lead.offer_code || '',
        lead.source || '',
        lead.language,
        lead.timestamp || '',
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      return {
        success: true,
        data: csvContent,
      };
    } catch (error: any) {
      console.error('Failed to export leads:', error);
      return {
        success: false,
        error: error.message || 'Failed to export leads',
      };
    }
  },
};

// ========================================
// LEAD NOTES API
// ========================================

export const leadNotesAPI = {
  // Get all notes for a lead
  getByLeadId: async (leadId: string): Promise<ApiResponse<LeadNote[]>> => {
    try {
      const { data, error } = await supabase
        .from('lead_notes')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error: any) {
      console.error(`Failed to fetch notes for lead ${leadId}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to fetch lead notes',
      };
    }
  },

  // Add note to lead
  add: async (note: Partial<LeadNote>): Promise<ApiResponse<LeadNote>> => {
    try {
      const { data, error } = await supabase
        .from('lead_notes')
        .insert(note)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('Failed to add lead note:', error);
      return {
        success: false,
        error: error.message || 'Failed to add lead note',
      };
    }
  },

  // Update note
  update: async (id: number, noteData: Partial<LeadNote>): Promise<ApiResponse<LeadNote>> => {
    try {
      const { data, error } = await supabase
        .from('lead_notes')
        .update(noteData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Failed to update lead note ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to update lead note',
      };
    }
  },

  // Delete note
  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const { error } = await supabase
        .from('lead_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Note deleted successfully',
      };
    } catch (error: any) {
      console.error(`Failed to delete lead note ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to delete lead note',
      };
    }
  },
};

// ========================================
// LEAD REMINDERS API
// ========================================

export const leadRemindersAPI = {
  // Get all reminders for a lead
  getByLeadId: async (leadId: string): Promise<ApiResponse<LeadReminder[]>> => {
    try {
      const { data, error } = await supabase
        .from('lead_reminders')
        .select('*')
        .eq('lead_id', leadId)
        .order('reminder_date', { ascending: true });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error: any) {
      console.error(`Failed to fetch reminders for lead ${leadId}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to fetch lead reminders',
      };
    }
  },

  // Get upcoming reminders (for dashboard)
  getUpcoming: async (daysAhead = 7): Promise<ApiResponse<LeadReminder[]>> => {
    try {
      const now = new Date().toISOString();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const { data, error } = await supabase
        .from('lead_reminders')
        .select('*')
        .eq('is_completed', false)
        .gte('reminder_date', now)
        .lte('reminder_date', futureDate.toISOString())
        .order('reminder_date', { ascending: true });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error: any) {
      console.error('Failed to fetch upcoming reminders:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch upcoming reminders',
      };
    }
  },

  // Add reminder
  add: async (reminder: Partial<LeadReminder>): Promise<ApiResponse<LeadReminder>> => {
    try {
      const { data, error } = await supabase
        .from('lead_reminders')
        .insert(reminder)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('Failed to add lead reminder:', error);
      return {
        success: false,
        error: error.message || 'Failed to add lead reminder',
      };
    }
  },

  // Update reminder
  update: async (id: number, reminderData: Partial<LeadReminder>): Promise<ApiResponse<LeadReminder>> => {
    try {
      const { data, error } = await supabase
        .from('lead_reminders')
        .update(reminderData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Failed to update lead reminder ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to update lead reminder',
      };
    }
  },

  // Complete reminder
  complete: async (id: number): Promise<ApiResponse<LeadReminder>> => {
    try {
      const { data, error } = await supabase
        .from('lead_reminders')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Failed to complete lead reminder ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to complete lead reminder',
      };
    }
  },

  // Delete reminder
  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const { error } = await supabase
        .from('lead_reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: 'Reminder deleted successfully',
      };
    } catch (error: any) {
      console.error(`Failed to delete lead reminder ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to delete lead reminder',
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
      const [
        vehiclesResult,
        availableVehiclesResult,
        featuredVehiclesResult,
        offersResult,
        activeOffersResult,
        leadsResult,
        newLeadsResult,
        highPriorityLeadsResult,
        convertedLeadsResult,
        maintenanceDueResult,
      ] = await Promise.all([
        supabase.from('vehicles').select('id', { count: 'exact', head: true }),
        supabase.from('vehicles').select('id', { count: 'exact', head: true }).eq('is_available', true),
        supabase.from('vehicles').select('id', { count: 'exact', head: true }).eq('is_featured', true),
        supabase.from('offers').select('id', { count: 'exact', head: true }),
        supabase.from('offers').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('leads').select('id', { count: 'exact', head: true }),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('leads').select('id', { count: 'exact', head: true }).in('priority', ['high', 'urgent']),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'converted'),
        // Maintenance due in next 30 days
        supabase.from('vehicle_maintenance')
          .select('id', { count: 'exact', head: true })
          .not('next_service_date', 'is', null)
          .lte('next_service_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
      ]);

      const stats: Stats = {
        totalVehicles: vehiclesResult.count || 0,
        availableVehicles: availableVehiclesResult.count || 0,
        featuredVehicles: featuredVehiclesResult.count || 0,
        totalOffers: offersResult.count || 0,
        activeOffers: activeOffersResult.count || 0,
        totalLeads: leadsResult.count || 0,
        newLeads: newLeadsResult.count || 0,
        highPriorityLeads: highPriorityLeadsResult.count || 0,
        convertedLeads: convertedLeadsResult.count || 0,
        maintenanceDue: maintenanceDueResult.count || 0,
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

// ========================================
// LEGACY EXPORTS (for backward compatibility)
// ========================================

export const fleetAPI = vehiclesAPI; // Alias for backward compatibility
