import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-749ca9a4`;

interface ApiOptions {
  method?: string;
  body?: any;
}

async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', body } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error (${endpoint}):`, data);
      throw new Error(data.error || `API request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`Network Error (${endpoint}):`, error);
    throw error;
  }
}

// ========================================
// FLEET API
// ========================================

export const fleetAPI = {
  // Get all vehicles
  getAll: async () => {
    return apiCall('/fleet');
  },

  // Get single vehicle by ID
  getById: async (id: string) => {
    return apiCall(`/fleet/${id}`);
  },

  // Add or update a vehicle
  save: async (vehicle: any) => {
    return apiCall('/fleet', { method: 'POST', body: vehicle });
  },

  // Delete a vehicle
  delete: async (id: string) => {
    return apiCall(`/fleet/${id}`, { method: 'DELETE' });
  },

  // Bulk add vehicles (for initial seeding)
  bulkSave: async (vehicles: any[]) => {
    return apiCall('/fleet/bulk', { method: 'POST', body: vehicles });
  },
};

// ========================================
// OFFERS API
// ========================================

export const offersAPI = {
  // Get all offers
  getAll: async () => {
    return apiCall('/offers');
  },

  // Get single offer by ID
  getById: async (id: string) => {
    return apiCall(`/offers/${id}`);
  },

  // Add or update an offer
  save: async (offer: any) => {
    return apiCall('/offers', { method: 'POST', body: offer });
  },

  // Delete an offer
  delete: async (id: string) => {
    return apiCall(`/offers/${id}`, { method: 'DELETE' });
  },

  // Bulk add offers (for initial seeding)
  bulkSave: async (offers: any[]) => {
    return apiCall('/offers/bulk', { method: 'POST', body: offers });
  },
};

// ========================================
// LEADS API
// ========================================

export const leadsAPI = {
  // Get all leads
  getAll: async () => {
    return apiCall('/leads');
  },

  // Get single lead by ID
  getById: async (id: string) => {
    return apiCall(`/leads/${id}`);
  },

  // Create a new lead
  create: async (leadData: any) => {
    return apiCall('/leads', { method: 'POST', body: leadData });
  },

  // Update lead status
  updateStatus: async (id: string, status: string) => {
    return apiCall(`/leads/${id}/status`, { method: 'PUT', body: { status } });
  },

  // Delete a lead
  delete: async (id: string) => {
    return apiCall(`/leads/${id}`, { method: 'DELETE' });
  },
};

// ========================================
// STATISTICS API
// ========================================

export const statsAPI = {
  // Get overall statistics
  get: async () => {
    return apiCall('/stats');
  },
};
