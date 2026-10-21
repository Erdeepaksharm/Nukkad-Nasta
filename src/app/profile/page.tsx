'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getRoleDashboard } from '@/lib/roles';

export default function ProfilePage() {
  const router = useRouter();
  const { role } = useAuth();

  useEffect(() => {
    // Automatically route user to their specific role dashboard
    const target = getRoleDashboard(role);
    router.replace(target);
  }, [role, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center p-6">
      <div className="space-y-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-stone-400 text-sm">Redirecting to your personal dashboard…</p>
      </div>
    </div>
  );
}
