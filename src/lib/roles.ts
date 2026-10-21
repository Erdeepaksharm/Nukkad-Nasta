export type UserRole = 'admin' | 'customer' | 'rider';

export const ROLES = {
  ADMIN: 'admin' as UserRole,
  CUSTOMER: 'customer' as UserRole,
  RIDER: 'rider' as UserRole,
};

export function normalizeRole(rawRole?: string | null): UserRole {
  if (!rawRole) return 'customer';
  const r = rawRole.toLowerCase().trim();
  if (r === 'admin') return 'admin';
  if (r === 'rider' || r === 'delivery_staff' || r === 'driver') return 'rider';
  return 'customer';
}

export function getRoleDashboard(role?: UserRole | string | null): string {
  const normalized = normalizeRole(role);
  switch (normalized) {
    case 'admin':
      return '/admin';
    case 'rider':
      return '/rider';
    case 'customer':
    default:
      return '/customer';
  }
}

export interface AppUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  role: UserRole;
  avatar_url?: string | null;
  vehicle_number?: string;
  is_active?: boolean;
  created_at?: string;
}

export const DEMO_USERS: Record<UserRole, AppUser> = {
  admin: {
    id: 'usr-admin-1',
    email: 'admin@nukkadnasta.in',
    full_name: 'Deepak Sharma (Restaurant Owner)',
    phone: '+91 98765 43210',
    role: 'admin',
  },
  rider: {
    id: 'usr-rider-1',
    email: 'rider@nukkadnasta.in',
    full_name: 'Rajesh Kumar (Express Delivery Rider)',
    phone: '+91 98201 12345',
    role: 'rider',
    vehicle_number: 'MH-01-AB-1234 (Honda Activa)',
  },
  customer: {
    id: 'usr-customer-1',
    email: 'customer@nukkadnasta.in',
    full_name: 'Aarav Mehta',
    phone: '+91 98111 22334',
    role: 'customer',
  },
};
