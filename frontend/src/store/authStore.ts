'use client';

import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  role_display: string;
  phone?: string;
  photo?: string;
  specialization?: string;
  is_verified: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setTokens: (access: string, refresh: string) => void;
  login: (user: User, access: string, refresh: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || 'null')
    : null,
  accessToken: typeof window !== 'undefined'
    ? localStorage.getItem('access_token')
    : null,
  refreshToken: typeof window !== 'undefined'
    ? localStorage.getItem('refresh_token')
    : null,
  isAuthenticated: typeof window !== 'undefined'
    ? !!localStorage.getItem('access_token')
    : false,
  isLoading: true,
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },
  setTokens: (access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
  },
  login: (user, access, refresh) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    set({ user, accessToken: access, refreshToken: refresh, isAuthenticated: true, isLoading: false });
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
  setLoading: (loading) => set({ isLoading: loading }),
}));
