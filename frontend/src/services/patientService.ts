import { api } from '@/lib/api';

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  age: number;
  phone: string;
  email: string;
  address: string;
  photo: string | null;
  pathology: string;
  diagnosis: string;
  treatment_plan: string;
  total_sessions: number;
  completed_sessions?: number;
  session_price: number;
  total_amount: number;
  amount_paid: number;
  remaining_balance: number;
  medical_notes: string;
  physiotherapist: string;
  physiotherapist_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PatientFilters {
  search?: string;
  is_active?: boolean;
  pathology?: string;
  page?: number;
}

export const patientsApi = {
  list: (filters?: PatientFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.is_active !== undefined) params.set('is_active', String(filters.is_active));
    if (filters?.pathology) params.set('pathology', filters.pathology);
    if (filters?.page) params.set('page', String(filters.page));
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get<{ results: Patient[]; count: number }>(`/patients/${query}`);
  },

  get: (id: string) => api.get<Patient>(`/patients/${id}/`),

  create: (data: Partial<Patient>) => api.post<Patient>('/patients/', data),

  update: (id: string, data: Partial<Patient>) => api.put<Patient>(`/patients/${id}/`, data),

  delete: (id: string) => api.delete(`/patients/${id}/`),

  statistics: () => api.get<{
    total_patients: number;
    active_patients: number;
    new_this_month: number;
    by_gender: Record<string, number>;
    by_pathology: Record<string, number>;
    total_revenue: number;
    total_outstanding: number;
  }>('/patients/statistics/overview/'),
};
