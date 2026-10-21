'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Users, TrendingUp, CalendarDays, Bike,
  Store, Clock, ArrowRight, ShieldCheck, Settings, UtensilsCrossed
} from 'lucide-react';
import { Order, getLiveOrders, getLiveRiders, Rider } from '@/lib/order-store';
import { getLiveMenu } from '@/lib/menu-data';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [dishesCount, setDishesCount] = useState(0);

  useEffect(() => {
    setOrders(getLiveOrders());
    setRiders(getLiveRiders());
    setDishesCount(getLiveMenu().length);

    const handleSync = () => {
      setOrders(getLiveOrders());
      setRiders(getLiveRiders());
      setDishesCount(getLiveMenu().length);
    };

    window.addEventListener('orders_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('orders_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const totalRevenue = orders
    .filter(o => !['cancelled'].includes(o.status))
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const deliveryOrders = orders.filter(o => o.type === 'delivery');
  const pickupOrders = orders.filter(o => o.type === 'pickup');
  const activeDeliveries = deliveryOrders.filter(o => ['assigned', 'accepted', 'picked_up', 'out_for_delivery'].includes(o.status));

  const stats = [
    {
      label: "Total Sales",
      value: `₹${Math.round(totalRevenue / 100)}`,
      sub: `${orders.length} orders total`,
      icon: TrendingUp,
      color: 'bg-green-500/20 text-green-400 border-green-500/30',
    },
    {
      label: "Delivery Orders",
      value: deliveryOrders.length,
      sub: `${activeDeliveries.length} currently on road`,
      icon: Bike,
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    {
      label: "Self-Service / Pickup",
      value: pickupOrders.length,
      sub: "No rider required",
      icon: Store,
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    {
      label: "Active Delivery Riders",
      value: riders.length,
      sub: "Registered couriers",
      icon: Users,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    {
      label: "Active Menu Dishes",
      value: dishesCount,
      sub: "Street food & specials",
      icon: UtensilsCrossed,
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="text-amber-400" />
            <span>Admin Executive Dashboard</span>
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            Overview of live orders, rider assignments, revenue, and restaurant management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/orders" className="btn-primary text-xs py-2 px-3.5 font-bold shadow-md">
            Manage All Orders →
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(s => (
          <div key={s.label} className="card p-4 space-y-2">
            <div className={`inline-flex p-2 rounded-xl border ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div className="text-2xl font-extrabold text-white">{s.value}</div>
            <div className="text-xs font-bold text-stone-200">{s.label}</div>
            <div className="text-[10px] text-stone-400">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Sections: Recent Orders & Quick Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Orders Stream */}
        <div className="lg:col-span-2 card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingBag size={16} className="text-amber-400" />
              <span>Recent Orders (Live)</span>
            </h2>
            <Link href="/admin/orders" className="text-xs text-amber-400 hover:underline">
              View All ({orders.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 6).map(order => {
              const isDelivery = order.type === 'delivery';

              return (
                <div
                  key={order.id}
                  className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400">#{order.order_number}</span>
                      <span className="font-semibold text-white">{order.customer_name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.2 rounded-full flex items-center gap-1 ${
                          isDelivery
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {isDelivery ? <Bike size={10} /> : <Store size={10} />}
                        <span>{isDelivery ? 'Delivery' : 'Pickup'}</span>
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-400">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>

                    {isDelivery && (
                      <div className="text-[10px] text-stone-500">
                        {order.rider_name ? (
                          <span className="text-cyan-400 font-medium">Assigned Rider: {order.rider_name}</span>
                        ) : (
                          <span className="text-orange-400 font-bold">⚠️ Needs Rider Assignment</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="font-bold text-white">₹{Math.round(order.total_amount / 100)}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-800 text-stone-300 uppercase">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Quick Action Cards */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
            Admin Management Shortcuts
          </div>

          {[
            {
              title: 'Food Menu & Pricing',
              desc: 'Add dishes with photos & update ₹ prices',
              href: '/admin/menu',
              icon: UtensilsCrossed,
              color: 'text-amber-400',
            },
            {
              title: 'Orders & Rider Assignment',
              desc: 'Manage kitchen queue & assign deliveries',
              href: '/admin/orders',
              icon: ShoppingBag,
              color: 'text-cyan-400',
            },
            {
              title: 'Customer & Rider Accounts',
              desc: 'Manage roles and register delivery riders',
              href: '/admin/users',
              icon: Users,
              color: 'text-purple-400',
            },
            {
              title: 'Day-Wise Operating Hours',
              desc: 'Monday–Sunday schedule & store pause',
              href: '/admin/settings',
              icon: Clock,
              color: 'text-green-400',
            },
            {
              title: 'Delivery Coverage Zones',
              desc: 'Configure pincodes, fees, & ETAs',
              href: '/admin/delivery',
              icon: Bike,
              color: 'text-blue-400',
            },
            {
              title: 'Table Reservations',
              desc: 'Manage dine-in seating bookings',
              href: '/admin/reservations',
              icon: CalendarDays,
              color: 'text-pink-400',
            },
          ].map(action => (
            <Link
              key={action.href}
              href={action.href}
              className="card p-3.5 hover:border-amber-500/50 hover:bg-stone-800/80 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <action.icon size={20} className={action.color} />
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-amber-400 transition-colors">
                    {action.title}
                  </div>
                  <div className="text-stone-400 text-[11px]">{action.desc}</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-stone-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
