'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyDeliveryPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/rider');
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center p-6">
      <div className="space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-stone-400 text-sm">Opening Rider Delivery Dashboard…</p>
      </div>
    </div>
  );
}
