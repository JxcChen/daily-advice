'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { Loading } from '@/components/ui';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isAuthenticated) {
      router.push('/quote');
    } else {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading size="lg" text="加载中..." />
    </div>
  );
}
