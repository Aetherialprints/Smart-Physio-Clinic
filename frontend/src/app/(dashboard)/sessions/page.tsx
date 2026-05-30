'use client';

import { Activity } from 'lucide-react';

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>
        <p className="text-gray-500 mt-1">Track treatment sessions and patient progress</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center text-gray-400">
        <Activity className="w-16 h-16 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Session Tracking</h3>
        <p className="text-sm mt-1">This module is coming soon. Track patient sessions, progress evaluations, and treatment notes.</p>
      </div>
    </div>
  );
}
