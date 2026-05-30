'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        router.push('/dashboard');
      }
    }
  }, [router]);

  return <>{children}</>;
}
