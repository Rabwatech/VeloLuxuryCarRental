// Application constants
export const APP_NAME = 'VELO Luxury Car Rental';
export const APP_DESCRIPTION = 'Premium luxury car rental services in Malaysia';

// Contact Information
export const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE || '+60123456789';
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '60123456789';
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'info@veloluxury.my';

// Supabase Configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Site Configuration
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://veloluxury.my';

// Lead Status
export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  CONVERTED: 'converted',
  CLOSED: 'closed',
} as const;

// Lead Types
export const LEAD_TYPE = {
  CONTACT: 'contact',
  BOOKING: 'booking',
  QUOTE: 'quote',
  GENERAL: 'general',
} as const;

// Date Formats
export const DATE_FORMAT = {
  SHORT: 'MM/DD/YYYY',
  LONG: 'MMMM DD, YYYY',
  FULL: 'dddd, MMMM DD, YYYY',
} as const;

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 1000,
} as const;
