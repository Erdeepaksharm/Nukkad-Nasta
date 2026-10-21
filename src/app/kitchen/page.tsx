'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChefHat, Clock, CheckCircle2, ArrowRight, Home, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function KitchenPage() {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('nukkad_orders') || '[]');
      if (stored.length > 0) {
        setOrders(stored);
      } else {
        // Seed some sample kitchen tickets for realistic pilot testing
        setOrders([
          {
            id: 'k-1',
            order_number: 'NN-104921',
            customer_name: 'Vikram Seth',
            type: 'delivery',
            status: 'confirmed',
            created_at: new Date(Date.now() - 5 * 60000).toISOString(),
            items: [
              { name: 'Pav Bhaji (Extra Butter)', quantity: 2 },
              { name: 'Masala Chai', quantity: 2 },
            ],
            notes: 'Make it spicy with extra lemon',
          },
          {
            id: 'k-2',
            order_number: 'NN-104922',
            customer_name: 'Ananya Roy',
            type: 'dine_in',
            status: 'preparing',
            created_at: new Date(Date.now() - 12 * 60000).toISOString(),
            items: [
              { name: 'Masala Dosa', quantity: 1 },
              { name: 'Sweet Lassi', quantity: 1 },
            ],
          },
        ]);
      }
    } catch {}
  }, []);

  const updateOrderStatus = (id: string, newStatus: string) => {
    const updated = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setOrders(updated);
    try {
      localStorage.setItem('nukkad_orders', JSON.stringify(updated));
    } catch {}
  };

  const activeOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready_for_pickup');

  return (
    <div className="min-h-screen bg-stone-950 text-white p-6">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-800 mb-8">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-orange-500 text-stone-950 rounded-2xl font-bold">
            <ChefHat size={26} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Kitchen Display System (KDS)</h1>
            <p className="text-xs text-stone-400">Live order queue for chefs & prep line</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-orange-500/20 text-orange-400 font-bold px-3 py-1.5 rounded-xl border border-orange-500/30">
            {activeOrders.length} ACTIVE TICKETS
          </span>
          <Link href="/" className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5">
            <Home size={14} /> View Site
          </Link>
          {isAdmin && (
            <Link href="/admin" className="btn-primary text-xs py-2 px-3 font-bold">
              👑 Admin Panel
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
          <span>🔥 Cooking Queue</span>
        </h2>

        {activeOrders.length === 0 ? (
          <div className="card text-center py-20 text-stone-500">
            <CheckCircle2 size={40} className="mx-auto mb-3 text-green-500/60" />
            <p className="text-lg font-bold text-white">All caught up!</p>
            <p className="text-xs mt-1">No active cooking tickets at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {activeOrders.map(order => (
              <div
                key={order.id}
                className={`card p-5 border-2 flex flex-col justify-between ${
                  order.status === 'preparing'
                    ? 'border-orange-500/80 bg-stone-900/90'
                    : 'border-yellow-500/40 bg-stone-900/50'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-mono font-extrabold text-amber-400 text-lg">
                        #{order.order_number}
                      </span>
                      <div className="text-xs text-stone-400 mt-0.5">{order.customer_name}</div>
                    </div>
                    <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                      {order.type}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 py-3 border-y border-stone-800 my-2">
                    {order.items?.map((it: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="font-bold text-white">
                          <span className="text-amber-400 mr-2">{it.quantity}x</span>
                          {it.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="text-xs bg-yellow-950/40 border border-yellow-700/50 text-yellow-200 p-2 rounded-lg mt-2">
                      ⚠️ Note: {order.notes}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-2">
                  {order.status === 'confirmed' ? (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="w-full bg-orange-500 hover:bg-orange-400 text-stone-950 font-extrabold py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>🔥 Start Cooking</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready_for_pickup')}
                      className="w-full bg-green-500 hover:bg-green-400 text-stone-950 font-extrabold py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={16} />
                      <span>Ready for Rider / Pickup</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ready orders list */}
        {readyOrders.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-green-400 mb-3 flex items-center gap-2">
              <span>✅ Ready for Pickup / Delivery ({readyOrders.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {readyOrders.map(order => (
                <div key={order.id} className="card p-3 border-green-500/30 flex justify-between items-center">
                  <div>
                    <div className="font-mono font-bold text-white text-sm">#{order.order_number}</div>
                    <div className="text-[11px] text-stone-400">{order.customer_name}</div>
                  </div>
                  <span className="text-xs text-green-400 font-bold">READY</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
