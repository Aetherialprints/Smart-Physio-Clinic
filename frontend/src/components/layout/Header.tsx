'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Bell, Menu, Search, X } from 'lucide-react';
import { notificationsApi } from '@/services/notificationService';

export default function Header() {
  const { user } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<import('@/services/notificationService').Notification[]>([]);

  useEffect(() => {
    loadUnread();
  }, []);

  const loadUnread = async () => {
    try {
      const data = await notificationsApi.unread();
      setNotifications(data);
      setUnreadCount(data.length);
    } catch { /* ignore */ }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Search */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50">
                <div className="p-4 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-900">Notifications</h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-gray-400 text-center">No new notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
                        <p className="text-sm font-medium text-gray-900">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User avatar */}
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role_display}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
