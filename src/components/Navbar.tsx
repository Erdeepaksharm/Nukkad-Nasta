'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { ShoppingCart, Menu, X, LayoutDashboard, ChefHat, Bike, LogOut, User, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user, profile, isAdmin, isCustomer, isRider, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide standard navbar on admin or rider dashboards
  const isStaffPage = pathname.startsWith('/admin') || pathname.startsWith('/rider');
  if (isStaffPage) return null;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/reservations', label: 'Reserve Table' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const userDashboardHref = isAdmin ? '/admin' : isRider ? '/rider' : '/customer';

  return (
    <nav className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-amber-400 font-bold text-xl tracking-tight">
            <span className="text-2xl">🍴</span>
            <span>Nukkad <span className="text-amber-500">Nasta</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === l.href ? 'text-amber-400 font-semibold' : 'text-stone-300 hover:text-amber-300'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Admin Portal Button */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 px-3.5 py-1.5 rounded-lg shadow-md hover:shadow-amber-500/20 transition-all border border-amber-300"
              >
                <ShieldCheck size={14} />
                <span>👑 Admin Portal</span>
              </Link>
            )}

            {/* Rider Dashboard Button */}
            {isRider && (
              <Link
                href="/rider"
                className="flex items-center gap-1.5 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-stone-950 px-3.5 py-1.5 rounded-lg shadow-md transition-all border border-cyan-300"
              >
                <Bike size={14} />
                <span>🛵 Rider App</span>
              </Link>
            )}

            {/* Customer Portal Button */}
            {isCustomer && user && (
              <Link
                href="/customer"
                className="flex items-center gap-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-lg transition-colors border border-stone-700"
              >
                <User size={14} className="text-amber-400" />
                <span>My Dashboard</span>
              </Link>
            )}

            <Link href="/cart" className="relative p-2 text-stone-300 hover:text-amber-400 transition-colors">
              <ShoppingCart size={20} />
            </Link>

            {user || isAdmin || isRider ? (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-800">
                <Link
                  href={userDashboardHref}
                  className="flex items-center gap-2 text-stone-300 hover:text-amber-400 transition-colors"
                >
                  <User size={17} className={isAdmin ? 'text-amber-400' : isRider ? 'text-cyan-400' : ''} />
                  <span className="text-sm font-medium">
                    {profile?.full_name?.split(' ')[0] || (isAdmin ? 'Admin' : isRider ? 'Rider' : 'Account')}
                    {isAdmin && <span className="ml-1 text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold border border-amber-500/30">ADMIN</span>}
                    {isRider && <span className="ml-1 text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-bold border border-cyan-500/30">RIDER</span>}
                  </span>
                </Link>
                <button
                  onClick={signOut}
                  title="Sign Out"
                  className="flex items-center p-1.5 text-stone-400 hover:text-red-400 transition-colors rounded-lg hover:bg-stone-900"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm text-stone-300 hover:text-amber-400 font-medium px-3 py-1.5 transition-colors">Login</Link>
                <Link href="/register" className="btn-primary text-sm py-1.5 px-4">Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-stone-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-stone-950 border-t border-stone-800 px-4 py-4 space-y-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center justify-between bg-amber-500/20 border border-amber-500/50 text-amber-300 px-3 py-2 rounded-xl text-sm font-bold"
              onClick={() => setMobileOpen(false)}
            >
              <span className="flex items-center gap-2"><LayoutDashboard size={18} /> Open Admin Dashboard</span>
              <span>➔</span>
            </Link>
          )}

          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-2 ${pathname === l.href ? 'text-amber-400' : 'text-stone-300'}`}
            >
              {l.label}
            </Link>
          ))}
          <hr className="border-stone-800" />
          <Link href="/cart" className="flex items-center gap-2 text-stone-300 text-sm py-2" onClick={() => setMobileOpen(false)}>
            <ShoppingCart size={16} /> Cart
          </Link>

          {user || isAdmin ? (
            <>
              <Link href={isAdmin ? "/admin" : "/profile"} className="flex items-center gap-2 text-stone-300 text-sm py-2" onClick={() => setMobileOpen(false)}>
                <User size={16} /> {profile?.full_name || 'My Profile'} {isAdmin && '(Admin)'}
              </Link>
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="flex items-center gap-2 text-red-400 text-sm py-2 w-full text-left"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="btn-secondary flex-1 text-center text-sm py-2" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link href="/register" className="btn-primary flex-1 text-center text-sm py-2" onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
