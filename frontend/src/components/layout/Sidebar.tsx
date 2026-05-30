'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard, Users, Calendar, Activity, Dumbbell,
  FileText, Bell, Settings, LogOut, HeartPulse,
} from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'physiotherapist', 'secretary'] },
  { href: '/patients', label: 'Patients', icon: Users, roles: ['admin', 'physiotherapist', 'secretary'] },
  { href: '/appointments', label: 'Appointments', icon: Calendar, roles: ['admin', 'physiotherapist', 'secretary'] },
  { href: '/sessions', label: 'Sessions', icon: Activity, roles: ['admin', 'physiotherapist'] },
  { href: '/exercises', label: 'Exercises', icon: Dumbbell, roles: ['admin', 'physiotherapist'] },
  { href: '/reports', label: 'Reports', icon: FileText, roles: ['admin', 'physiotherapist'] },
  { href: '/notifications', label: 'Notifications', icon: Bell, roles: ['admin', 'physiotherapist', 'secretary'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const filteredNav = NAV_ITEMS.filter(item =>
    item.roles.includes(user?.role || '')
  );

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 z-40 hidden lg:flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Smart Physio</h1>
            <p className="text-xs text-gray-400">Clinic Management</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNav.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={clsx('w-5 h-5', isActive ? 'text-blue-600' : 'text-gray-400')} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 mb-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.full_name}</p>
            <p className="text-xs text-gray-400 truncate capitalize">{user?.role_display}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); window.location.href = '/login'; }}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
