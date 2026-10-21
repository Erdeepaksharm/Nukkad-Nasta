'use client';

import { useState, useEffect } from 'react';
import {
  Users, Bike, UserPlus, ShieldCheck, Phone, Mail, CheckCircle2,
  Search, Edit3, Trash2, ShieldAlert
} from 'lucide-react';
import { UserRole, AppUser, DEMO_USERS } from '@/lib/roles';
import { Rider, getLiveRiders, saveLiveRiders } from '@/lib/order-store';

const SEED_USERS: AppUser[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@nukkadnasta.in',
    full_name: 'Deepak Sharma',
    phone: '+91 98765 43210',
    role: 'admin',
    created_at: '2026-01-10',
  },
  {
    id: 'usr-rider-1',
    email: 'rider@nukkadnasta.in',
    full_name: 'Rajesh Kumar',
    phone: '+91 98201 12345',
    role: 'rider',
    vehicle_number: 'MH-01-AB-1234 (Honda Activa)',
    created_at: '2026-02-15',
  },
  {
    id: 'usr-rider-2',
    email: 'amit.rider@nukkadnasta.in',
    full_name: 'Amit Singh',
    phone: '+91 98202 67890',
    role: 'rider',
    vehicle_number: 'MH-02-CD-5678 (TVS Jupiter)',
    created_at: '2026-03-01',
  },
  {
    id: 'usr-rider-3',
    email: 'sunil.rider@nukkadnasta.in',
    full_name: 'Sunil Patil',
    phone: '+91 98203 45678',
    role: 'rider',
    vehicle_number: 'MH-01-EF-9012 (Hero Splendor)',
    created_at: '2026-03-12',
  },
  {
    id: 'usr-customer-1',
    email: 'customer@nukkadnasta.in',
    full_name: 'Aarav Mehta',
    phone: '+91 98111 22334',
    role: 'customer',
    created_at: '2026-03-20',
  },
  {
    id: 'usr-customer-2',
    email: 'priya@example.com',
    full_name: 'Priya Sharma',
    phone: '+91 98222 33445',
    role: 'customer',
    created_at: '2026-03-22',
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice] = useState('');

  // Add Rider form
  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');
  const [riderEmail, setRiderEmail] = useState('');
  const [riderVehicle, setRiderVehicle] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nukkad_all_users_v1');
      if (stored) {
        setUsers(JSON.parse(stored));
      } else {
        setUsers(SEED_USERS);
        localStorage.setItem('nukkad_all_users_v1', JSON.stringify(SEED_USERS));
      }
    } catch {
      setUsers(SEED_USERS);
    }
  }, []);

  const saveUsers = (newUsers: AppUser[]) => {
    setUsers(newUsers);
    try {
      localStorage.setItem('nukkad_all_users_v1', JSON.stringify(newUsers));
    } catch {}
  };

  const handleAddRider = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `usr-rider-${Date.now()}`;
    const newUser: AppUser = {
      id: newId,
      full_name: riderName,
      phone: riderPhone,
      email: riderEmail,
      vehicle_number: riderVehicle,
      role: 'rider',
      created_at: new Date().toISOString().split('T')[0],
    };

    const updated = [newUser, ...users];
    saveUsers(updated);

    // Also add to active rider store so Admin can immediately assign them to deliveries!
    const currentRiders = getLiveRiders();
    const newRider: Rider = {
      id: newId,
      name: riderName,
      phone: riderPhone,
      email: riderEmail,
      vehicle_number: riderVehicle,
      is_available: true,
    };
    saveLiveRiders([newRider, ...currentRiders]);

    setIsModalOpen(false);
    setRiderName('');
    setRiderPhone('');
    setRiderEmail('');
    setRiderVehicle('');
    setNotice(`Rider ${riderName} successfully added and ready for delivery runs!`);
    setTimeout(() => setNotice(''), 3500);
  };

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    const updated = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    saveUsers(updated);
    setNotice(`Updated user role to ${newRole}`);
    setTimeout(() => setNotice(''), 3000);
  };

  const filtered = users.filter(u => {
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone && u.phone.includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-amber-400" />
            <span>Customer & Rider Accounts</span>
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            Manage user roles and register official delivery riders for Nukkad Nasta
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-1.5 shadow-lg bg-cyan-500 hover:bg-cyan-400 text-stone-950 border-cyan-400"
        >
          <UserPlus size={15} />
          <span>Add New Rider Account</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 bg-green-500/10 border border-green-500/40 text-green-300 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="text-green-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="input pl-9 py-2 text-xs"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {(['all', 'customer', 'rider', 'admin'] as const).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setFilterRole(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filterRole === r
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {r === 'all' ? 'All Roles' : `${r}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/80 text-stone-400 border-b border-stone-800">
              <tr>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Vehicle Details</th>
                <th className="p-3.5 text-right">Role Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-white text-sm">{u.full_name}</div>
                    <div className="text-stone-400 text-[11px]">{u.email}</div>
                  </td>
                  <td className="p-3.5 text-stone-300">
                    <div>{u.phone || '—'}</div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        u.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : u.role === 'rider'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-stone-800 text-stone-300 border border-stone-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-stone-400 text-xs">
                    {u.vehicle_number || (u.role === 'rider' ? 'Standard Bike' : 'N/A')}
                  </td>
                  <td className="p-3.5 text-right">
                    <select
                      value={u.role}
                      onChange={e => handleChangeRole(u.id, e.target.value as UserRole)}
                      className="input py-1 px-2 text-[11px] bg-stone-950 border-stone-700 w-28"
                    >
                      <option value="customer">Customer</option>
                      <option value="rider">Rider</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Rider Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-6 space-y-4 border-cyan-500/40">
            <div className="flex justify-between items-center pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Bike className="text-cyan-400" />
                <h2 className="text-base font-bold text-white">Register New Delivery Rider</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRider} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Rider Full Name *</label>
                <input
                  type="text"
                  value={riderName}
                  onChange={e => setRiderName(e.target.value)}
                  className="input py-2 text-xs"
                  placeholder="e.g. Ramesh Varma"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Phone Number (Calling) *</label>
                <input
                  type="tel"
                  value={riderPhone}
                  onChange={e => setRiderPhone(e.target.value)}
                  className="input py-2 text-xs"
                  placeholder="+91 98200 11223"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Rider Login Email *</label>
                <input
                  type="email"
                  value={riderEmail}
                  onChange={e => setRiderEmail(e.target.value)}
                  className="input py-2 text-xs"
                  placeholder="ramesh.rider@nukkadnasta.in"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Vehicle Plate & Model *</label>
                <input
                  type="text"
                  value={riderVehicle}
                  onChange={e => setRiderVehicle(e.target.value)}
                  className="input py-2 text-xs"
                  placeholder="MH-01-XY-9999 (Honda Shine)"
                  required
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-stone-950 border-cyan-400"
                >
                  Save & Activate Rider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
