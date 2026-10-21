'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  ShieldCheck, LayoutDashboard, UtensilsCrossed, ShoppingBag,
  CalendarDays, ChefHat, Bike, LogOut, ArrowRight, X
} from 'lucide-react';
import { useState } from 'react';

export default function AdminBar() {
  const { isAdmin, profile, signOut } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Don't show admin bar inside the admin dashboard itself (it has its own sidebar)
  const isDashboard = pathname.startsWith('/admin') || pathname.startsWith('/kitchen') || pathname.startsWith('/delivery');
  if (!isAdmin || isDashboard) return null;

  if (collapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-full shadow-2xl border-2 border-amber-300 animate-bounce transition-all"
        >
          <ShieldCheck size={18} />
          <span>👑 Admin Mode</span>
        </button>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-stone-950 via-amber-950/90 to-stone-950 border-b-2 border-amber-500 shadow-xl text-amber-100 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Admin Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <ShieldCheck size={16} />
            <span>ADMIN MODE ACTIVE</span>
          </div>
          <span className="hidden sm:inline text-stone-400">|</span>
          <span className="hidden sm:inline text-stone-300 truncate max-w-[200px]">
            {profile?.full_name || profile?.email || 'Owner'}
          </span>
        </div>

        {/* Center: Quick Action Jump Links */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <Link
            href="/admin"
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-2.5 py-1 rounded-md transition-all whitespace-nowrap shadow-sm"
          >
            <LayoutDashboard size={13} />
            <span>Dashboard</span>
            <ArrowRight size={12} />
          </Link>
          <Link
            href="/admin/menu"
            className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-amber-200 px-2.5 py-1 rounded-md transition-all whitespace-nowrap border border-stone-700"
          >
            <UtensilsCrossed size={13} />
            <span>Menu Editor</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-amber-200 px-2.5 py-1 rounded-md transition-all whitespace-nowrap border border-stone-700"
          >
            <ShoppingBag size={13} />
            <span>Live Orders</span>
          </Link>
          <Link
            href="/admin/reservations"
            className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-amber-200 px-2.5 py-1 rounded-md transition-all whitespace-nowrap border border-stone-700"
          >
            <CalendarDays size={13} />
            <span>Tables</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-amber-200 px-2.5 py-1 rounded-md transition-all whitespace-nowrap border border-stone-700"
          >
            <span>👥 Users & Riders</span>
          </Link>
          <Link
            href="/rider"
            className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-cyan-300 px-2.5 py-1 rounded-md transition-all whitespace-nowrap border border-stone-700"
          >
            <Bike size={13} />
            <span>Rider App</span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(true)}
            title="Minimize Bar"
            className="text-stone-400 hover:text-white p-1 rounded"
          >
            <X size={14} />
          </button>
          <button
            onClick={signOut}
            title="Sign Out"
            className="flex items-center gap-1 text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 px-2 py-0.5 rounded text-[11px]"
          >
            <LogOut size={12} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
