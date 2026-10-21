'use client';

import { createClient } from '@/lib/supabase/client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserRole, normalizeRole, DEMO_USERS, getRoleDashboard } from '@/lib/roles';

export { type UserRole } from '@/lib/roles';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  avatar_url?: string | null;
  vehicle_number?: string;
}

interface AuthContextValue {
  user: any | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  isRider: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  quickLogin: (role: UserRole) => void;
  quickAdminLogin: (email?: string, name?: string) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  isAdmin: false,
  isCustomer: true,
  isRider: false,
  signOut: async () => {},
  refreshProfile: async () => {},
  switchRole: () => {},
  quickLogin: () => {},
  quickAdminLogin: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser]       = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync cookie with role so SSR / Next.js edge-safe middleware has immediate access
  const setRoleCookie = (role: string | null) => {
    if (typeof document === 'undefined') return;
    if (role) {
      document.cookie = `nukkad_role=${role}; path=/; max-age=604800; SameSite=Lax`;
    } else {
      document.cookie = 'nukkad_role=; path=/; max-age=0';
    }
  };

  const fetchProfile = useCallback(async (userId: string, userEmail?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, role, avatar_url')
        .eq('id', userId)
        .single();

      if (data && !error) {
        const normalizedRole = normalizeRole(data.role);
        const resolved: Profile = {
          ...data,
          role: normalizedRole,
        };
        setProfile(resolved);
        setRoleCookie(normalizedRole);
        try {
          localStorage.setItem('nukkad_user_profile', JSON.stringify(resolved));
          localStorage.setItem('nukkad_user_role', normalizedRole);
        } catch {}
        return;
      }
    } catch (e) {
      console.warn('Could not fetch remote profile:', e);
    }

    // Fallback: check cached profile in localStorage
    try {
      const cached = localStorage.getItem('nukkad_user_profile');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.id === userId) {
          const normalized = normalizeRole(parsed.role);
          const p = { ...parsed, role: normalized };
          setProfile(p);
          setRoleCookie(normalized);
          return;
        }
      }
    } catch {}

    // Check if email indicates role
    const email = userEmail || '';
    let resolvedRole: UserRole = 'customer';
    if (email === 'admin@nukkadnasta.in' || email === 'owner@nukkadnasta.in' || email.includes('admin')) {
      resolvedRole = 'admin';
    } else if (email === 'rider@nukkadnasta.in' || email.includes('rider')) {
      resolvedRole = 'rider';
    }

    const fallbackProfile: Profile = {
      id: userId,
      email: email,
      full_name: email.split('@')[0] || 'User',
      phone: null,
      role: resolvedRole,
      avatar_url: null,
    };
    setProfile(fallbackProfile);
    setRoleCookie(resolvedRole);
  }, [supabase]);

  useEffect(() => {
    // 1. Instant check from localStorage to eliminate UI flicker
    try {
      const cachedRole = localStorage.getItem('nukkad_user_role');
      const cachedProfile = localStorage.getItem('nukkad_user_profile');
      if (cachedProfile) {
        const parsed = JSON.parse(cachedProfile);
        const normalized = normalizeRole(parsed.role || cachedRole);
        setProfile({ ...parsed, role: normalized });
        setRoleCookie(normalized);
      }
    } catch {}

    // 2. Query Supabase auth session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetchProfile(user.id, user.email).finally(() => setLoading(false));
      } else {
        // If no supabase user, check if we have a local active session
        try {
          const cachedProfile = localStorage.getItem('nukkad_user_profile');
          if (cachedProfile) {
            const parsed = JSON.parse(cachedProfile);
            setUser({ id: parsed.id, email: parsed.email });
          }
        } catch {}
        setLoading(false);
      }
    });

    // 3. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        fetchProfile(u.id, u.email);
      } else {
        const cached = localStorage.getItem('nukkad_user_profile');
        if (!cached) {
          setProfile(null);
          setRoleCookie(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, supabase]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    setProfile(null);
    setRoleCookie(null);
    try {
      localStorage.removeItem('nukkad_user_profile');
      localStorage.removeItem('nukkad_user_role');
    } catch {}
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id, user.email);
  };

  const quickLogin = (role: UserRole) => {
    const demo = DEMO_USERS[role];
    const newProfile: Profile = {
      id: demo.id,
      email: demo.email,
      full_name: demo.full_name,
      phone: demo.phone || null,
      role: demo.role,
      vehicle_number: demo.vehicle_number,
    };
    setUser({ id: demo.id, email: demo.email });
    setProfile(newProfile);
    setRoleCookie(demo.role);
    try {
      localStorage.setItem('nukkad_user_profile', JSON.stringify(newProfile));
      localStorage.setItem('nukkad_user_role', demo.role);
    } catch {}
  };

  const switchRole = (newRole: UserRole) => {
    quickLogin(newRole);
  };

  const role: UserRole = profile?.role ? normalizeRole(profile.role) : 'customer';
  const isAdmin = role === 'admin';
  const isRider = role === 'rider';
  const isCustomer = role === 'customer';

  return (
    <AuthContext.Provider value={{
      user, profile, role: profile ? role : null, loading,
      isAdmin,
      isCustomer,
      isRider,
      signOut,
      refreshProfile,
      switchRole,
      quickLogin,
      quickAdminLogin: () => quickLogin('admin'),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
