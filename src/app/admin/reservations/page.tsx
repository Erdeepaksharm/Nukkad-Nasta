import { createClient } from '@/lib/supabase/server';

export default async function AdminReservationsPage() {
  const supabase = await createClient();
  const { data: reservations } = await supabase
    .from('reservations')
    .select('id, customer_name, customer_phone, date, start_time, guest_count, status, special_requests')
    .order('date', { ascending: false })
    .order('start_time', { ascending: false })
    .limit(50);

  const statusColor: Record<string, string> = {
    pending:   'bg-yellow-500/20 text-yellow-400',
    confirmed: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
    completed: 'bg-blue-500/20 text-blue-400',
    no_show:   'bg-stone-600 text-stone-400',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Reservations</h1>
        <p className="text-stone-400">Manage table bookings</p>
      </div>

      <div className="card overflow-x-auto">
        {(!reservations || reservations.length === 0) ? (
          <div className="text-center py-16 text-stone-500">
            <p className="text-4xl mb-3">📅</p>
            <p>No reservations yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400">
                <th className="text-left py-3 pr-4">Customer</th>
                <th className="text-left py-3 pr-4">Date & Time</th>
                <th className="text-left py-3 pr-4">Guests</th>
                <th className="text-left py-3 pr-4">Status</th>
                <th className="text-left py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(r => (
                <tr key={r.id} className="border-b border-stone-800/60 hover:bg-stone-800/40">
                  <td className="py-3 pr-4">
                    <div className="text-white">{r.customer_name}</div>
                    <div className="text-stone-500 text-xs">{r.customer_phone}</div>
                  </td>
                  <td className="py-3 pr-4 text-stone-300">
                    {r.date} at {r.start_time?.slice(0, 5)}
                  </td>
                  <td className="py-3 pr-4 text-stone-300">{r.guest_count} pax</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[r.status] ?? ''}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 text-stone-500 text-xs">{r.special_requests || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
