'use client';

import { useState, useEffect } from 'react';
import { notificationsApi, type Notification } from '@/services/notificationService';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationsApi.list();
      setNotifications(data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated with clinic activities</p>
        </div>
        <Button variant="secondary" size="sm" onClick={markAllRead}>
          <CheckCheck className="w-4 h-4" /> Mark all read
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Bell className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map(n => (
              <div key={n.id} className={`flex items-start gap-4 p-5 hover:bg-gray-50 transition-colors ${!n.is_read ? 'bg-blue-50/30' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  n.type === 'appointment' ? 'bg-blue-100 text-blue-600' :
                  n.type === 'payment' ? 'bg-emerald-100 text-emerald-600' :
                  n.type === 'reminder' ? 'bg-amber-100 text-amber-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${!n.is_read ? 'text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                    {!n.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                </div>
                {!n.is_read && (
                  <button
                    onClick={async () => { await notificationsApi.markRead(n.id); loadNotifications(); }}
                    className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
