import { api } from '@/lib/api';

export interface Appointment {
  id: string;
  patient: string;
  patient_name: string;
  patient_phone: string;
  physiotherapist: string;
  physiotherapist_name: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  status_display: string;
  treatment_type: string;
  notes: string;
  reminder_sent: boolean;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  status: string;
}

export const appointmentsApi = {
  list: (params?: { date?: string; start_date?: string; end_date?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.date) q.set('date', params.date);
    if (params?.start_date) q.set('start_date', params.start_date);
    if (params?.end_date) q.set('end_date', params.end_date);
    if (params?.status) q.set('status', params.status);
    const query = q.toString() ? `?${q.toString()}` : '';
    return api.get<{ results: Appointment[]; count: number }>(`/appointments/${query}`);
  },

  get: (id: string) => api.get<Appointment>(`/appointments/${id}/`),

  create: (data: Partial<Appointment>) => api.post<Appointment>('/appointments/', data),

  update: (id: string, data: Partial<Appointment>) => api.put<Appointment>(`/appointments/${id}/`, data),

  delete: (id: string) => api.delete(`/appointments/${id}/`),

  today: () => api.get<Appointment[]>('/appointments/today/'),

  upcoming: () => api.get<Appointment[]>('/appointments/upcoming/'),

  calendarEvents: (start: string, end: string) =>
    api.get<CalendarEvent[]>(`/appointments/calendar/events/?start=${start}&end=${end}`),
};
