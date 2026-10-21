'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag, CalendarDays,
  Bike, Settings, LogOut, ChevronLeft, Menu, X, Home, Users
} from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { href: '/admin',              icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/menu',         icon: UtensilsCrossed,  label: 'Menu' },
  { href: '/admin/orders',       icon: ShoppingBag,       label: 'Orders' },
  { href: '/admin/users',        icon: Users,             label: 'Users & Riders' },
  { href: '/admin/reservations', icon: CalendarDays,      label: 'Reservations' },
  { href: '/admin/delivery',     icon: Bike,              label: 'Delivery Zones' },
  { href: '/admin/settings',     icon: Settings,          label: 'Settings' },
];

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-stone-800">
        <div className="text-amber-400 font-bold text-lg">🍴 Nukkad Nasta</div>
        <div className="text-stone-500 text-xs mt-0.5">Admin Panel</div>
        <div className="text-stone-400 text-sm mt-2 truncate">{adminName}</div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div className="p-4 border-t border-stone-800 space-y-1">
        {/* Back to customer site — KEY FIX: opens in same tab, keeps admin session */}
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-all"
        >
          <Home size={18} />
          View Customer Site
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-stone-900 border-r border-stone-800 fixed h-full z-30">
        {sidebarContent}
      </aside>

      {/* Mobile burger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-stone-900 border-b border-stone-800 flex items-center px-4 h-14">
        <button onClick={() => setOpen(!open)} className="text-stone-300 mr-3">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="text-amber-400 font-bold">🍴 Nukkad Nasta Admin</span>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-stone-900 h-full mt-14">{sidebarContent}</div>
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
