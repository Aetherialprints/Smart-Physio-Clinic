'use client';

import { useState, useEffect } from 'react';
import { appointmentsApi, type Appointment } from '@/services/appointmentService';
import { Modal, Button, Badge } from '@/components/ui/Button';
import {
  Calendar, Plus, Clock, Phone, User, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, AlertCircle,
} from 'lucide-react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from 'date-fns';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [view, setView] = useState<'week' | 'day'>('week');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => { loadAppointments(); }, [currentWeek, view]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentsApi.list();
      setAppointments(data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(a => isSameDay(new Date(a.date), date));
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-indigo-500" />;
      case 'no_show': return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500 mt-1">Schedule and manage appointments</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> New Appointment
        </Button>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </h2>
            <button onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${view === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Week
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${view === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Day
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => {
            const dayAppointments = getAppointmentsForDay(day);
            const isToday = isSameDay(day, new Date());
            return (
              <div key={day.toISOString()} className={`min-h-[140px] p-2 rounded-xl border ${isToday ? 'border-blue-300 bg-blue-50/50' : 'border-gray-100'}`}>
                <div className="text-center mb-2">
                  <p className="text-xs text-gray-400 font-medium">{format(day, 'EEE')}</p>
                  <p className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                    {format(day, 'd')}
                  </p>
                </div>
                <div className="space-y-1">
                  {dayAppointments.map(apt => (
                    <div
                      key={apt.id}
                      className="flex items-center gap-1.5 p-1.5 rounded-lg text-xs bg-white border border-gray-100 hover:shadow-sm transition-shadow cursor-pointer"
                    >
                      {statusIcon(apt.status)}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">{apt.patient_name}</p>
                        <p className="text-gray-400">{apt.start_time.slice(0, 5)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Schedule</h3>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {appointments
              .filter(a => isSameDay(new Date(a.date), new Date()))
              .length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <Calendar className="w-10 h-10 mb-2" />
                <p className="text-sm">No appointments today</p>
              </div>
            )}
            {appointments
              .filter(a => isSameDay(new Date(a.date), new Date()))
              .map(apt => (
                <div key={apt.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-bold text-gray-900">{apt.start_time.slice(0, 5)}</p>
                    <p className="text-xs text-gray-400">{apt.end_time.slice(0, 5)}</p>
                  </div>
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {apt.patient_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{apt.patient_name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {apt.patient_phone}
                      </span>
                      {apt.treatment_type && (
                        <span className="text-xs text-gray-400">{apt.treatment_type}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusIcon(apt.status)}
                    <Badge
                      variant={
                        apt.status === 'confirmed' ? 'success' :
                        apt.status === 'cancelled' ? 'danger' :
                        apt.status === 'completed' ? 'info' : 'default'
                      }
                    >
                      {apt.status_display}
                    </Badge>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}
