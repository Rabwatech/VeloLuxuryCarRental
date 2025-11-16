import { z } from 'zod';
import { VALIDATION, LEAD_STATUS, LEAD_TYPE } from '../constants';

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
  price_per_day: z.number().positive('Price must be positive'),
  image: z.string().url('Invalid image URL'),
  images: z.array(z.string()).optional(),
  collection: z.string().optional(),
  collection_name: z.string().optional(),
  collection_name_ar: z.string().optional(),
  description: z.string().optional(),
  description_ar: z.string().optional(),
  specs: z.record(z.any()).optional(),
  available: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Vehicle = z.infer<typeof VehicleSchema>;

// ============================================
// OFFER TYPES
// ============================================

export const OfferSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, 'Title is required'),
  title_ar: z.string().optional(),
  description: z.string().optional(),
  description_ar: z.string().optional(),
  discount: z.string().optional(),
  discount_percent: z.number().min(0).max(100).optional(),
  valid_until: z.string().optional(),
  image: z.string().optional(),
  terms: z.string().optional(),
  active: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Offer = z.infer<typeof OfferSchema>;

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
  type: z.enum([LEAD_TYPE.CONTACT, LEAD_TYPE.BOOKING, LEAD_TYPE.QUOTE, LEAD_TYPE.GENERAL]).default(LEAD_TYPE.GENERAL),
  status: z.enum([LEAD_STATUS.NEW, LEAD_STATUS.CONTACTED, LEAD_STATUS.CONVERTED, LEAD_STATUS.CLOSED]).default(LEAD_STATUS.NEW),
  source: z.string().optional(),
  language: z.string().default('en'),
  vehicle_id: z.string().optional(),
  timestamp: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Lead = z.infer<typeof LeadSchema>;

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
// STATS TYPES
// ============================================

export interface Stats {
  totalVehicles: number;
  totalOffers: number;
  totalLeads: number;
  newLeads: number;
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
