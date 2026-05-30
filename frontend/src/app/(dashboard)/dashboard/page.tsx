'use client';

import { useEffect, useState } from 'react';
import { KPICard } from '@/components/ui/KPICard';
import { dashboardApi, type DashboardData } from '@/services/dashboardService';
import {
  Users, Calendar, Activity, DollarSign, TrendingUp,
  Clock, AlertCircle, UserCheck,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const result = await dashboardApi.overview();
      setData(result);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { kpi, charts, widgets } = data;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your clinic performance</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Patients"
          value={kpi.total_patients}
          subtitle={`${kpi.active_patients} active`}
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          title="Today's Appointments"
          value={kpi.today_appointments}
          icon={<Calendar className="w-5 h-5" />}
          color="green"
        />
        <KPICard
          title="Monthly Revenue"
          value={`$${kpi.monthly_revenue.toLocaleString()}`}
          subtitle={`$${kpi.yearly_revenue.toLocaleString()} yearly`}
          icon={<DollarSign className="w-5 h-5" />}
          color="purple"
        />
        <KPICard
          title="Sessions Completed"
          value={kpi.completed_sessions}
          icon={<Activity className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
              <p className="text-sm text-gray-400">Last 6 months</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={charts.revenue_by_month}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Area
                type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Growth */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Patient Growth</h3>
              <p className="text-sm text-gray-400">New patients per month</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <UserCheck className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={charts.patient_growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pathology Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pathologies</h3>
          {charts.pathology_distribution.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={charts.pathology_distribution}
                    dataKey="count"
                    nameKey="pathology"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                  >
                    {charts.pathology_distribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {charts.pathology_distribution.slice(0, 5).map((item, i) => (
                  <div key={item.pathology} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <span className="text-gray-600 truncate max-w-[140px]">{item.pathology}</span>
                    </div>
                    <span className="font-medium text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              No data yet
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            {widgets.upcoming_appointments.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                No upcoming appointments
              </div>
            ) : (
              widgets.upcoming_appointments.slice(0, 5).map(apt => (
                <div key={apt.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">
                    {apt.start_time.slice(0, 5)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{apt.patient}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {' · '}{apt.treatment_type || 'Session'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Patients</h3>
          <div className="space-y-3">
            {widgets.recent_patients.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                No patients yet
              </div>
            ) : (
              widgets.recent_patients.map(patient => (
                <div key={patient.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{patient.name}</p>
                    <p className="text-xs text-gray-400 truncate">{patient.pathology}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(patient.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
