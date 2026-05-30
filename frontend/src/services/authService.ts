import { api } from '@/lib/api';
import type { User } from '@/store/authStore';

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  role?: string;
  phone?: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/token/', { email, password }, { requiresAuth: false }),

  register: (data: RegisterData) =>
    api.post<{ user: User; message: string }>('/auth/register/', data, { requiresAuth: false }),

  refreshToken: (refresh: string) =>
    api.post<{ access: string; refresh: string }>('/auth/token/refresh/', { refresh }, { requiresAuth: false }),

  getProfile: () => api.get<User>('/auth/profile/'),

  changePassword: (oldPassword: string, newPassword: string) =>
    api.put('/auth/change-password/', { old_password: oldPassword, new_password: newPassword }),
};
