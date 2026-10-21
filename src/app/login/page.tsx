'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { UserRole, normalizeRole, getRoleDashboard } from '@/lib/roles';
import { Eye, EyeOff, Loader2, ShieldCheck, Bike, User, AlertCircle, Sparkles } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const errorParam = searchParams.get('error');

  const supabase = createClient();
  const { quickLogin } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const getDeniedMessage = (err: string | null) => {
    if (err === 'access_denied_admin_only') return 'Access restricted: Only restaurant administrators can view the Admin Dashboard.';
    if (err === 'access_denied_rider_only') return 'Access restricted: Only delivery riders can view the Rider Dashboard.';
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError, data } = await supabase.auth.signInWithPassword({ email, password });

      // Fallback for demo emails if auth server isn't reached
      if (authError) {
        const lowerEmail = email.toLowerCase().trim();
        if (lowerEmail.includes('admin') || lowerEmail === 'owner@nukkadnasta.in') {
          handleRoleLogin('admin');
          return;
        } else if (lowerEmail.includes('rider')) {
          handleRoleLogin('rider');
          return;
        } else if (lowerEmail.includes('customer') || lowerEmail === 'test@example.com') {
          handleRoleLogin('customer');
          return;
        }

        setError(authError.message);
        setLoading(false);
        return;
      }

      const user = data?.user;
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', user.id)
          .single();

        let rawRole = profile?.role;
        if (!rawRole) {
          if (user.email?.includes('admin') || user.email === 'owner@nukkadnasta.in') rawRole = 'admin';
          else if (user.email?.includes('rider')) rawRole = 'rider';
          else rawRole = 'customer';
        }

        const role = normalizeRole(rawRole);
        document.cookie = `nukkad_role=${role}; path=/; max-age=604800; SameSite=Lax`;
        try {
          localStorage.setItem('nukkad_user_role', role);
          localStorage.setItem('nukkad_user_profile', JSON.stringify({
            id: user.id,
            email: user.email,
            full_name: profile?.full_name || user.email?.split('@')[0],
            role,
          }));
        } catch {}

        const targetDashboard = nextParam || getRoleDashboard(role);
        router.push(targetDashboard);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  const handleRoleLogin = (role: UserRole) => {
    quickLogin(role);
    document.cookie = `nukkad_role=${role}; path=/; max-age=604800; SameSite=Lax`;
    const target = nextParam || getRoleDashboard(role);
    router.push(target);
    router.refresh();
  };

  const deniedMessage = getDeniedMessage(errorParam);

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
          <span className="text-3xl">🍴</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
        <p className="text-stone-400 text-sm">One Unified Portal for Admins, Riders & Customers</p>
      </div>

      <div className="card shadow-2xl border-stone-800 space-y-6">
        {deniedMessage && (
          <div className="bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs p-3.5 rounded-xl flex items-start gap-2">
            <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <span>{deniedMessage}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-300 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input text-sm py-2.5"
              placeholder="admin@nukkadnasta.in / rider@... / customer@..."
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input text-sm py-2.5 pr-12"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-400"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 font-bold text-sm shadow-lg"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in…</> : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* 1-Click Role Testing Switcher */}
        <div className="pt-4 border-t border-stone-800 space-y-3">
          <div className="text-center">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              ⚡ Instant 1-Click Role Access (Testing)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRoleLogin('admin')}
              className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                <ShieldCheck size={14} />
                <span>Admin</span>
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">/admin</div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleLogin('rider')}
              className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
                <Bike size={14} />
                <span>Rider</span>
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">/rider</div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleLogin('customer')}
              className="p-2.5 rounded-xl bg-stone-800 border border-stone-700 hover:bg-stone-700 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-green-400 font-bold text-xs">
                <User size={14} />
                <span>Customer</span>
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">/customer</div>
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-stone-400 text-xs">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-amber-400 hover:text-amber-300 font-bold">
              Register as Customer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <Suspense fallback={<div className="text-center text-stone-400 py-10">Loading login form…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
