import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const nukkadRole = cookieStore.get('nukkad_role')?.value;

  // 1. Fast path: If cookie specifically indicates admin, allow through immediately!
  if (nukkadRole === 'admin') {
    return (
      <div className="flex min-h-screen bg-stone-950">
        <AdminSidebar adminName="Restaurant Owner (Admin)" />
        <main className="flex-1 ml-0 md:ml-64 p-6">
          {children}
        </main>
      </div>
    );
  }

  // 2. Otherwise verify via Supabase session safely
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect('/login?next=/admin');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name, email')
      .eq('id', user.id)
      .single();

    const role = profile?.role;
    const isAdminEmail =
      user.email === 'itengineer914082@gmail.com' ||
      user.email === 'admin@nukkadnasta.in' ||
      user.email === 'owner@nukkadnasta.in' ||
      user.email?.includes('admin');

    if (role !== 'admin' && !isAdminEmail) {
      redirect('/?error=Access denied. Admin only.');
    }

    return (
      <div className="flex min-h-screen bg-stone-950">
        <AdminSidebar adminName={profile?.full_name || user.email || 'Admin'} />
        <main className="flex-1 ml-0 md:ml-64 p-6">
          {children}
        </main>
      </div>
    );
  } catch (err: any) {
    if (err?.digest?.includes('NEXT_REDIRECT')) {
      throw err;
    }
    // Fallback: If Supabase connection is down, redirect to login
    redirect('/login?next=/admin');
  }
}
