export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const ROLES = {
  ADMIN: 'admin',
  PHYSIOTHERAPIST: 'physiotherapist',
  SECRETARY: 'secretary',
} as const;

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
} as const;

export const STATUS_COLORS: Record<string, string> = {
  scheduled: '#3B82F6',
  confirmed: '#10B981',
  in_progress: '#F59E0B',
  completed: '#6366F1',
  cancelled: '#EF4444',
  no_show: '#6B7280',
};

export const COLORS = {
  primary: '#1E40AF',
  primaryLight: '#3B82F6',
  secondary: '#059669',
  secondaryLight: '#10B981',
  accent: '#7C3AED',
  warning: '#F59E0B',
  danger: '#EF4444',
  success: '#10B981',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  darkBackground: '#0F172A',
  darkSurface: '#1E293B',
  text: '#1E293B',
  textLight: '#64748B',
  border: '#E2E8F0',
  darkBorder: '#334155',
};
