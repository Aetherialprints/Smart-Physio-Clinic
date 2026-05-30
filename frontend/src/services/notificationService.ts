import { api } from '@/lib/api';

export interface Notification {
  id: string;
  recipient: string;
  patient: string | null;
  type: string;
  channel: string;
  title: string;
  message: string;
  is_read: boolean;
  sent_at: string | null;
  created_at: string;
}

export const notificationsApi = {
  list: () => api.get<{ results: Notification[] }>('/notifications/'),

  unread: () => api.get<Notification[]>('/notifications/unread/'),

  markRead: (id: string) => api.post(`/notifications/${id}/read/`, {}),

  markAllRead: () => api.post('/notifications/mark-all-read/', {}),
};
