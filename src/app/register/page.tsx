'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { Eye, EyeOff, Loader2, ShieldCheck, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const { quickAdminLogin } = useAuth();

  const [name, setName]         = useState('Deepak Sharma');
  const [email, setEmail]       = useState('itengineer914082@gmail.com');
  const [phone, setPhone]       = useState('+91 98765 43210');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // 1. Call server API to create/update user via admin client (Bypasses email rate limit!)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // 2. Log in with newly created credentials
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // If sign in has any issue, set local session fallback
        console.warn('Direct signin note:', signInError);
      }

      const role = result.role || (email.toLowerCase() === 'itengineer914082@gmail.com' ? 'admin' : 'customer');

      // 3. Set persistent role cookie & localStorage
      document.cookie = `nukkad_role=${role}; path=/; max-age=604800; SameSite=Lax`;
      try {
        localStorage.setItem('nukkad_user_role', role);
        localStorage.setItem('nukkad_user_profile', JSON.stringify({
          id: result.user?.id || 'admin-user',
          email,
          full_name: name,
          phone,
          role,
        }));
      } catch {}

      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/customer');
      }
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Failed to create account');
      setLoading(false);
    }
  };

  const handleQuickOwner = () => {
    quickAdminLogin('itengineer914082@gmail.com', 'Deepak Sharma (Owner)');
    document.cookie = 'nukkad_role=admin; path=/; max-age=604800; SameSite=Lax';
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
            <span className="text-3xl">🎉</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-stone-400 text-sm">Join Nukkad Nasta for faster ordering & access</p>
        </div>

        <div className="card shadow-2xl border-stone-800">
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-300 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input py-2.5 text-sm"
                placeholder="Deepak Sharma"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input py-2.5 text-sm"
                placeholder="itengineer914082@gmail.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">Phone (optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="input py-2.5 text-sm"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input pr-12 py-2.5 text-sm"
                  placeholder="Min 6 characters"
                  required
                  autoComplete="new-password"
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
              {loading ? <><Loader2 size={18} className="animate-spin" /> Setting up account…</> : 'Create Account'}
            </button>
          </form>

          {/* Instant Owner Setup Bypass */}
          <div className="mt-6 pt-5 border-t border-stone-800">
            <div className="text-xs text-stone-400 mb-2 font-medium text-center">
              👑 RESTAURANT OWNER INSTANT ACCESS
            </div>
            <button
              type="button"
              onClick={handleQuickOwner}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all"
            >
              <ShieldCheck size={18} />
              <span>⚡ Register & Launch Admin Panel (Deepak)</span>
              <Sparkles size={16} />
            </button>
            <p className="text-[11px] text-stone-500 text-center mt-2">
              Bypasses email verification rate limits & gives you immediate Admin access.
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-stone-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
