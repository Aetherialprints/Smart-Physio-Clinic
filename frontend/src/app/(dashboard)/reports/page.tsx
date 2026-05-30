'use client';

import { FileText } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-1">Generate invoices, receipts, and clinic reports</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center text-gray-400">
        <FileText className="w-16 h-16 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Reports & Invoicing</h3>
        <p className="text-sm mt-1">Generate PDF invoices, payment receipts, and detailed clinic reports.</p>
      </div>
    </div>
  );
}
