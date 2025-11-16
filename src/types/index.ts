import { z } from 'zod';
import { VALIDATION, LEAD_STATUS, LEAD_TYPE } from '../constants';

// ============================================
// ADMIN TYPES
// ============================================

export const AdminSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password_hash: z.string().optional(), // Not exposed in API responses
  full_name: z.string(),
  role: z.enum(['super_admin', 'admin', 'manager', 'staff']),
  phone: z.string().optional(),
  is_active: z.boolean().default(true),
  last_login_at: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Admin = z.infer<typeof AdminSchema>;

export interface AdminLoginCredentials {
  email: string;
  password: string;
}

// ============================================
// VEHICLE TYPES
// ============================================

export const VehicleSchema = z.object({
  id: z.string().min(1, 'Vehicle ID is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  name: z.string().min(1, 'Name is required'),
  name_ar: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 2).optional(),

  // Pricing
  price_per_day: z.number().positive('Daily price must be positive'),
  price_per_week: z.number().positive().optional(),
  price_per_month: z.number().positive().optional(),
  weekend_price: z.number().positive().optional(),

  // Media
  primary_image: z.string().url('Invalid image URL'),

  // Classification
  collection: z.string().optional(),
  collection_name: z.string().optional(),
  collection_name_ar: z.string().optional(),
  category: z.string().optional(),

  // Description
  description: z.string().optional(),
  description_ar: z.string().optional(),

  // Specifications
  specs: z.record(z.any()).optional(),

  // Features & Status
  is_featured: z.boolean().default(false),
  is_available: z.boolean().default(true),

  // Metadata
  created_by: z.string().uuid().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Vehicle = z.infer<typeof VehicleSchema>;

// ============================================
// VEHICLE IMAGE TYPES
// ============================================

export const VehicleImageSchema = z.object({
  id: z.number().optional(),
  vehicle_id: z.string(),
  image_url: z.string().url(),
  display_order: z.number().default(0),
  is_primary: z.boolean().default(false),
  caption: z.string().optional(),
  created_at: z.string().optional(),
});

export type VehicleImage = z.infer<typeof VehicleImageSchema>;

// ============================================
// VEHICLE MAINTENANCE TYPES
// ============================================

export const VehicleMaintenanceSchema = z.object({
  id: z.number().optional(),
  vehicle_id: z.string(),
  maintenance_type: z.enum(['service', 'repair', 'inspection', 'cleaning']),
  description: z.string(),
  cost: z.number().optional(),
  performed_by: z.string().optional(),
  performed_at: z.string(),
  next_service_date: z.string().optional(),
  notes: z.string().optional(),
  created_by: z.string().uuid().optional(),
  created_at: z.string().optional(),
});

export type VehicleMaintenance = z.infer<typeof VehicleMaintenanceSchema>;

// ============================================
// OFFER TYPES
// ============================================

export const OfferSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, 'Title is required'),
  title_ar: z.string().optional(),
  description: z.string().optional(),
  description_ar: z.string().optional(),

  // Discount
  discount_text: z.string().optional(),
  discount_percent: z.number().min(0).max(100).optional(),
  discount_amount: z.number().optional(),

  // Offer Code
  offer_code: z.string().optional(),

  // Validity
  valid_from: z.string().optional(),
  valid_until: z.string().optional(),

  // Applicability
  applies_to: z.enum(['all', 'category', 'specific_vehicles']).default('all'),
  applicable_categories: z.array(z.string()).optional(),
  applicable_vehicle_ids: z.array(z.string()).optional(),

  // Limits
  usage_limit: z.number().optional(),
  usage_count: z.number().default(0),

  // Display
  image_url: z.string().optional(),
  terms: z.string().optional(),
  is_active: z.boolean().default(true),

  // Metadata
  created_by: z.string().uuid().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Offer = z.infer<typeof OfferSchema>;

// ============================================
// OFFER REDEMPTION TYPES
// ============================================

export const OfferRedemptionSchema = z.object({
  id: z.number().optional(),
  offer_id: z.number(),
  offer_code: z.string().optional(),
  lead_id: z.string().optional(),
  customer_name: z.string().optional(),
  customer_email: z.string().optional(),
  customer_phone: z.string().optional(),
  redeemed_at: z.string().optional(),
});

export type OfferRedemption = z.infer<typeof OfferRedemptionSchema>;

// ============================================
// LEAD TYPES
// ============================================

export const LeadSchema = z.object({
  id: z.string().optional(),
  name: z.string()
    .min(VALIDATION.MIN_NAME_LENGTH, `Name must be at least ${VALIDATION.MIN_NAME_LENGTH} characters`)
    .max(VALIDATION.MAX_NAME_LENGTH, `Name must be less than ${VALIDATION.MAX_NAME_LENGTH} characters`),
  email: z.string()
    .email('Invalid email address')
    .regex(VALIDATION.EMAIL_REGEX, 'Invalid email format'),
  phone: z.string()
    .regex(VALIDATION.PHONE_REGEX, 'Invalid phone number format'),
  subject: z.string().optional(),
  message: z.string()
    .min(VALIDATION.MIN_MESSAGE_LENGTH, `Message must be at least ${VALIDATION.MIN_MESSAGE_LENGTH} characters`)
    .max(VALIDATION.MAX_MESSAGE_LENGTH, `Message must be less than ${VALIDATION.MAX_MESSAGE_LENGTH} characters`)
    .optional(),

  // Classification
  type: z.enum([LEAD_TYPE.CONTACT, LEAD_TYPE.BOOKING, LEAD_TYPE.QUOTE, LEAD_TYPE.GENERAL]).default(LEAD_TYPE.GENERAL),
  status: z.enum([LEAD_STATUS.NEW, LEAD_STATUS.CONTACTED, LEAD_STATUS.CONVERTED, LEAD_STATUS.CLOSED]).default(LEAD_STATUS.NEW),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),

  // Assignment
  assigned_to: z.string().uuid().optional(),

  // Source
  source: z.string().optional(),
  language: z.string().default('en'),

  // Vehicle Interest
  vehicle_id: z.string().optional(),
  offer_code: z.string().optional(),

  // Metadata
  timestamp: z.string().optional(),
  last_contacted_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Lead = z.infer<typeof LeadSchema>;

// ============================================
// LEAD NOTE TYPES
// ============================================

export const LeadNoteSchema = z.object({
  id: z.number().optional(),
  lead_id: z.string(),
  note: z.string().min(1, 'Note cannot be empty'),
  note_type: z.enum(['comment', 'call', 'email', 'meeting', 'whatsapp']).default('comment'),
  created_by: z.string().uuid().optional(),
  created_at: z.string().optional(),
});

export type LeadNote = z.infer<typeof LeadNoteSchema>;

// ============================================
// LEAD REMINDER TYPES
// ============================================

export const LeadReminderSchema = z.object({
  id: z.number().optional(),
  lead_id: z.string(),
  reminder_date: z.string(),
  reminder_note: z.string().optional(),
  is_completed: z.boolean().default(false),
  completed_at: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
  created_by: z.string().uuid().optional(),
  created_at: z.string().optional(),
});

export type LeadReminder = z.infer<typeof LeadReminderSchema>;

// ============================================
// CONTACT FORM TYPES
// ============================================

export const ContactFormSchema = z.object({
  name: z.string()
    .min(VALIDATION.MIN_NAME_LENGTH, `Name must be at least ${VALIDATION.MIN_NAME_LENGTH} characters`)
    .max(VALIDATION.MAX_NAME_LENGTH),
  email: z.string()
    .email('Invalid email address')
    .regex(VALIDATION.EMAIL_REGEX, 'Invalid email format'),
  phone: z.string()
    .regex(VALIDATION.PHONE_REGEX, 'Invalid phone number'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').optional(),
  message: z.string()
    .min(VALIDATION.MIN_MESSAGE_LENGTH, `Message must be at least ${VALIDATION.MIN_MESSAGE_LENGTH} characters`)
    .max(VALIDATION.MAX_MESSAGE_LENGTH),
});

export type ContactForm = z.infer<typeof ContactFormSchema>;

// ============================================
// AUTHENTICATION TYPES
// ============================================

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginCredentials = z.infer<typeof LoginSchema>;

// ============================================
// STATISTICS TYPES
// ============================================

export interface Stats {
  totalVehicles: number;
  availableVehicles: number;
  featuredVehicles: number;
  totalOffers: number;
  activeOffers: number;
  totalLeads: number;
  newLeads: number;
  highPriorityLeads: number;
  convertedLeads: number;
  totalRevenue?: number;
  maintenanceDue: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

// ============================================
// ERROR TYPES
// ============================================

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  field?: string;
}

// ============================================
// EXPORT/FILTER TYPES
// ============================================

export interface LeadFilters {
  status?: string[];
  type?: string[];
  priority?: string[];
  assigned_to?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface VehicleFilters {
  category?: string[];
  collection?: string[];
  is_available?: boolean;
  is_featured?: boolean;
  price_min?: number;
  price_max?: number;
}
