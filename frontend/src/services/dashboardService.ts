import { api } from '@/lib/api';

export interface DashboardKPI {
  total_patients: number;
  total_patients_all: number;
  today_appointments: number;
  active_patients: number;
  monthly_revenue: number;
  yearly_revenue: number;
  completed_sessions: number;
  outstanding_balance: number;
}

export interface DashboardData {
  kpi: DashboardKPI;
  charts: {
    patient_growth: { month: string; count: number }[];
    revenue_by_month: { month: string; revenue: number }[];
    pathology_distribution: { pathology: string; count: number }[];
    appointment_stats: Record<string, number>;
  };
  widgets: {
    upcoming_appointments: {
      id: string;
      patient: string;
      date: string;
      start_time: string;
      status: string;
      treatment_type: string;
    }[];
    recent_patients: {
      id: string;
      name: string;
      pathology: string;
      created_at: string;
    }[];
  };
}

export const dashboardApi = {
  overview: () => api.get<DashboardData>('/dashboard/overview/'),
};
