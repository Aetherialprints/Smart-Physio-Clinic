'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/authService';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, login, setLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        login(user, token, refresh || '');
      } catch {
        localStorage.clear();
        router.push('/login');
      }
    } else {
      setLoading(false);
      if (!pathname.includes('/login') && !pathname.includes('/register')) {
        router.push('/login');
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && isMounted) {
      if (!pathname.includes('/login') && !pathname.includes('/register')) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, isMounted]);

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg font-medium">Smart Physio Clinic</p>
          <p className="text-blue-200 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64">
        <Header />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
