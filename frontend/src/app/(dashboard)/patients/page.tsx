'use client';

import { useEffect, useState, useRef } from 'react';
import { patientsApi, type Patient } from '@/services/patientService';
import { Modal, Button, Badge } from '@/components/ui/Button';
import {
  Users, Plus, Search, Edit2, Trash2, Eye, Phone, Mail,
  Calendar, DollarSign, Activity, X, User, MapPin,
} from 'lucide-react';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Patient | null>(null);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', gender: 'male', date_of_birth: '',
    phone: '', email: '', address: '', pathology: '', diagnosis: '',
    treatment_plan: '', total_sessions: 0, session_price: 0, medical_notes: '',
  });

  const searchRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => { loadPatients(); }, 300);
    return () => { if (searchRef.current) clearTimeout(searchRef.current); };
  }, [search]);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await patientsApi.list({ search: search || undefined });
      setPatients(data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await patientsApi.update(editing.id, formData);
      } else {
        await patientsApi.create(formData);
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadPatients();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '', last_name: '', gender: 'male', date_of_birth: '',
      phone: '', email: '', address: '', pathology: '', diagnosis: '',
      treatment_plan: '', total_sessions: 0, session_price: 0, medical_notes: '',
    });
  };

  const openEdit = (patient: Patient) => {
    setEditing(patient);
    setFormData({
      first_name: patient.first_name, last_name: patient.last_name,
      gender: patient.gender, date_of_birth: patient.date_of_birth,
      phone: patient.phone, email: patient.email, address: patient.address,
      pathology: patient.pathology, diagnosis: patient.diagnosis,
      treatment_plan: patient.treatment_plan, total_sessions: patient.total_sessions,
      session_price: patient.session_price, medical_notes: patient.medical_notes,
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-500 mt-1">Manage your patients and their records</p>
        </div>
        <Button onClick={() => { resetForm(); setEditing(null); setShowModal(true); }}>
          <Plus className="w-4 h-4" /> Add Patient
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Users className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">No patients found</p>
            <p className="text-sm">Add your first patient to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pathology</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sessions</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {patients.map(patient => (
                  <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {patient.first_name[0]}{patient.last_name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{patient.full_name}</p>
                          <p className="text-xs text-gray-400">{patient.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{patient.pathology}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {patient.completed_sessions || 0} / {patient.total_sessions}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${patient.remaining_balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        ${patient.remaining_balance.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={patient.is_active ? 'success' : 'default'}>
                        {patient.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setShowDetail(patient)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEdit(patient)}
                          className="p-2 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditing(null); resetForm(); }}
        title={editing ? 'Edit Patient' : 'Add New Patient'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">First Name *</label>
                <input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Last Name *</label>
                <input required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth *</label>
                <input type="date" required value={formData.date_of_birth} onChange={e => setFormData({...formData, date_of_birth: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Phone *</label>
                <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
            </div>
          </div>

          {/* Medical Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Medical Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Pathology *</label>
                <input required value={formData.pathology} onChange={e => setFormData({...formData, pathology: e.target.value})}
                  placeholder="e.g., Low Back Pain, Neck Pain"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Diagnosis</label>
                <textarea value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Treatment Plan</label>
                <textarea value={formData.treatment_plan} onChange={e => setFormData({...formData, treatment_plan: e.target.value})} rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Total Sessions</label>
                <input type="number" min={0} value={formData.total_sessions} onChange={e => setFormData({...formData, total_sessions: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Session Price ($)</label>
                <input type="number" min={0} step={0.01} value={formData.session_price} onChange={e => setFormData({...formData, session_price: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Medical Notes</label>
                <textarea value={formData.medical_notes} onChange={e => setFormData({...formData, medical_notes: e.target.value})} rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditing(null); }}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Create'} Patient</Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      {showDetail && (
        <Modal isOpen={!!showDetail} onClose={() => setShowDetail(null)} title="Patient Details" size="lg">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-xl font-bold">
                {showDetail.first_name[0]}{showDetail.last_name[0]}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{showDetail.full_name}</h3>
                <p className="text-sm text-gray-400">{showDetail.age} years old · {showDetail.gender}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Phone</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" /> {showDetail.phone}
                </p>
              </div>
              {showDetail.email && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" /> {showDetail.email}
                  </p>
                </div>
              )}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Pathology</p>
                <p className="text-sm font-medium text-gray-900">{showDetail.pathology}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Sessions</p>
                <p className="text-sm font-medium text-gray-900">
                  {showDetail.completed_sessions || 0} / {showDetail.total_sessions}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <p className="text-xs text-blue-400">Total</p>
                <p className="text-lg font-bold text-blue-700">${showDetail.total_amount.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl text-center">
                <p className="text-xs text-emerald-400">Paid</p>
                <p className="text-lg font-bold text-emerald-700">${showDetail.amount_paid.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-xl text-center">
                <p className="text-xs text-red-400">Remaining</p>
                <p className="text-lg font-bold text-red-700">${showDetail.remaining_balance.toFixed(2)}</p>
              </div>
            </div>

            {showDetail.address && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <p className="text-gray-600">{showDetail.address}</p>
              </div>
            )}
            {showDetail.diagnosis && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-2">Diagnosis</p>
                <p className="text-sm text-gray-700">{showDetail.diagnosis}</p>
              </div>
            )}
            {showDetail.medical_notes && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-2">Medical Notes</p>
                <p className="text-sm text-gray-700">{showDetail.medical_notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
