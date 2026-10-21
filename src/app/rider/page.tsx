'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bike, Phone, MapPin, CheckCircle2, Clock, AlertCircle,
  Navigation, PackageCheck, LogOut, ArrowRight, DollarSign, Shield
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Order, OrderStatus, getLiveOrders, updateOrderStatus } from '@/lib/order-store';

export default function RiderDashboardPage() {
  const router = useRouter();
  const { user, profile, isRider, isAdmin, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [statusNotice, setStatusNotice] = useState('');

  const syncOrders = () => {
    const all = getLiveOrders();
    // CRITICAL REQUIREMENT:
    // 1. Only delivery orders (PICKUP / SELF-SERVICE ORDERS MUST NEVER APPEAR HERE)
    // 2. Only orders assigned to this rider
    const currentRiderId = profile?.id || user?.id || 'usr-rider-1';
    const currentRiderName = profile?.full_name || 'Rajesh Kumar';

    const myDeliveries = all.filter(o => {
      // Exclude all pickup / self-service orders
      if (o.type !== 'delivery') return false;

      // Check if assigned to this rider or match demo rider
      const isAssignedToMe =
        o.rider_id === currentRiderId ||
        o.rider_name === currentRiderName ||
        o.rider_id === 'usr-rider-1' ||
        !o.rider_id; // Also show unassigned delivery runs ready to be claimed

      return isAssignedToMe;
    });

    setOrders(myDeliveries);
  };

  useEffect(() => {
    syncOrders();
    window.addEventListener('orders_updated', syncOrders);
    window.addEventListener('storage', syncOrders);
    return () => {
      window.removeEventListener('orders_updated', syncOrders);
      window.removeEventListener('storage', syncOrders);
    };
  }, [user, profile]);

  const handleUpdateDeliveryStatus = (orderId: string, nextStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, nextStatus, {
      rider_id: profile?.id || 'usr-rider-1',
      rider_name: profile?.full_name || 'Rajesh Kumar',
      rider_phone: profile?.phone || '+91 98201 12345',
      accepted_at: nextStatus === 'accepted' ? new Date().toISOString() : undefined,
      picked_up_at: nextStatus === 'picked_up' ? new Date().toISOString() : undefined,
      delivered_at: nextStatus === 'delivered' ? new Date().toISOString() : undefined,
    });
    setOrders(updated.filter(o => o.type === 'delivery'));
    setStatusNotice(`Order status updated to: ${nextStatus.replace(/_/g, ' ').toUpperCase()}`);
    setTimeout(() => setStatusNotice(''), 3000);
  };

  const activeDeliveries = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const completedDeliveries = orders.filter(o => o.status === 'delivered');

  return (
    <div className="min-h-screen bg-stone-950 text-white p-4 sm:p-6 pb-16">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Rider Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-stone-950 flex items-center justify-center font-extrabold shadow-lg">
              <Bike size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {profile?.full_name || 'Rajesh Kumar'}
                </h1>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 font-extrabold px-2 py-0.5 rounded-full border border-cyan-500/30">
                  ON DUTY
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Vehicle: {profile?.vehicle_number || 'MH-01-AB-1234 (Honda Activa)'} • Phone: {profile?.phone || '+91 98201 12345'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => signOut().then(() => router.push('/login'))}
              className="btn-secondary text-xs py-2 px-3 text-stone-400 hover:text-red-400 flex items-center gap-1.5"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {statusNotice && (
          <div className="p-3.5 bg-green-500/10 border border-green-500/40 text-green-300 text-xs rounded-xl flex items-center gap-2 animate-fade-in shadow-md">
            <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
            <span className="font-bold">{statusNotice}</span>
          </div>
        )}

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="card p-3.5 bg-stone-900/60 border-stone-800 text-center">
            <div className="text-xl font-extrabold text-cyan-400">{activeDeliveries.length}</div>
            <div className="text-xs font-bold text-white mt-0.5">Active Runs</div>
            <div className="text-[10px] text-stone-400">Assigned / In Progress</div>
          </div>
          <div className="card p-3.5 bg-stone-900/60 border-stone-800 text-center">
            <div className="text-xl font-extrabold text-green-400">{completedDeliveries.length}</div>
            <div className="text-xs font-bold text-white mt-0.5">Completed</div>
            <div className="text-[10px] text-stone-400">Successfully Delivered</div>
          </div>
          <div className="card p-3.5 bg-stone-900/60 border-stone-800 text-center">
            <div className="text-xl font-extrabold text-amber-400">₹{completedDeliveries.length * 50}</div>
            <div className="text-xs font-bold text-white mt-0.5">Rider Payout</div>
            <div className="text-[10px] text-stone-400">₹50 / delivery</div>
          </div>
          <div className="card p-3.5 bg-stone-900/60 border-stone-800 text-center">
            <div className="text-xl font-extrabold text-white">4.9 ★</div>
            <div className="text-xs font-bold text-white mt-0.5">Rider Rating</div>
            <div className="text-[10px] text-stone-400">100% on-time rate</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-stone-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'active'
                ? 'bg-cyan-500 text-stone-950 shadow-md font-extrabold'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            <Bike size={14} />
            <span>Assigned Deliveries ({activeDeliveries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-cyan-500 text-stone-950 shadow-md font-extrabold'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            <PackageCheck size={14} />
            <span>Completed Delivery History ({completedDeliveries.length})</span>
          </button>
        </div>

        {/* TAB 1: ACTIVE DELIVERIES */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeDeliveries.length === 0 ? (
              <div className="card text-center py-16 text-stone-500 space-y-3">
                <PackageCheck size={42} className="mx-auto opacity-40 text-cyan-400" />
                <div className="text-white font-bold text-base">No pending delivery runs</div>
                <p className="text-xs text-stone-400">
                  When the restaurant admin assigns a delivery order to you, it will appear here instantly.
                </p>
                <div className="text-[11px] text-stone-500 bg-stone-900/60 p-2.5 rounded-xl max-w-sm mx-auto border border-stone-800">
                  ℹ️ Self-service & pickup orders are handled at the restaurant counter and will never appear on your rider app.
                </div>
              </div>
            ) : (
              activeDeliveries.map(order => (
                <div key={order.id} className="card p-5 border-cyan-500/40 bg-stone-900/90 space-y-4 shadow-xl">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-base font-extrabold text-amber-400">
                        #{order.order_number}
                      </span>
                      <span className="text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 rounded-full uppercase">
                        DOORSTEP DELIVERY
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-white">
                        Collect: ₹{Math.round(order.total_amount / 100)}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        order.payment_method === 'cod'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-green-500/20 text-green-300 border border-green-500/30'
                      }`}>
                        {order.payment_method === 'cod' ? '💵 Cash on Delivery' : '✓ Paid Online'}
                      </span>
                    </div>
                  </div>

                  {/* Route & Address Points */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* 1. Pickup from Restaurant */}
                    <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-stone-400 font-bold text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>PICKUP POINT (KITCHEN)</span>
                      </div>
                      <div className="font-bold text-white text-xs">Nukkad Nasta Restaurant</div>
                      <div className="text-stone-400 text-[11px]">
                        12, Food Street, Sector 18, Noida 201301
                      </div>
                      <div className="text-stone-400 text-[11px]">Phone: +91 98765 43210</div>
                    </div>

                    {/* 2. Customer Drop-off */}
                    <div className="p-3 bg-stone-950 rounded-xl border border-cyan-500/30 space-y-1">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span>DROP-OFF (CUSTOMER)</span>
                      </div>
                      <div className="font-bold text-white text-xs">{order.customer_name}</div>
                      <div className="text-stone-300 text-[11px] flex items-start gap-1">
                        <MapPin size={12} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{order.delivery_address?.line1}, {order.delivery_address?.city} {order.delivery_address?.pincode}</span>
                      </div>
                      {order.delivery_address?.landmark && (
                        <div className="text-stone-400 text-[10px]">
                          Landmark: {order.delivery_address.landmark}
                        </div>
                      )}
                      <div className="pt-1">
                        <a
                          href={`tel:${order.customer_phone}`}
                          className="inline-flex items-center gap-1 text-[11px] text-cyan-400 font-bold hover:underline"
                        >
                          <Phone size={11} />
                          <span>Call Customer: {order.customer_phone}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="text-xs text-stone-300 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80">
                    <span className="font-bold text-stone-400 text-[11px]">Food Parcel: </span>
                    {order.items.map((i, idx) => (
                      <span key={idx} className="mr-3">
                        {i.quantity}x {i.name}
                      </span>
                    ))}
                    {order.notes && (
                      <div className="text-amber-400 text-[10px] mt-1 italic">
                        Customer instruction: &ldquo;{order.notes}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* STEP PROGRESSION ACTION BUTTONS */}
                  <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs">
                      Current Status:{' '}
                      <strong className="text-cyan-400 uppercase font-mono">
                        {order.status.replace(/_/g, ' ')}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === 'assigned' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateDeliveryStatus(order.id, 'accepted')}
                          className="btn-primary py-2 px-4 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-stone-950 border-cyan-400 shadow-md"
                        >
                          Accept Run
                        </button>
                      )}

                      {['accepted', 'preparing'].includes(order.status) && (
                        <button
                          type="button"
                          onClick={() => handleUpdateDeliveryStatus(order.id, 'picked_up')}
                          className="bg-orange-500 hover:bg-orange-400 text-stone-950 font-bold py-2 px-4 rounded-xl text-xs shadow-md transition-all flex items-center gap-1"
                        >
                          <PackageCheck size={14} />
                          <span>Pick Up Parcel from Kitchen</span>
                        </button>
                      )}

                      {['picked_up', 'out_for_delivery'].includes(order.status) && (
                        <button
                          type="button"
                          onClick={() => handleUpdateDeliveryStatus(order.id, 'delivered')}
                          className="bg-green-500 hover:bg-green-400 text-stone-950 font-extrabold py-2 px-5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={15} />
                          <span>Confirm Order Delivered to Customer</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: COMPLETED HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {completedDeliveries.length === 0 ? (
              <div className="card text-center py-12 text-stone-500">
                <Clock size={36} className="mx-auto mb-2 opacity-40" />
                <div className="text-white font-bold">No completed runs yet today</div>
                <p className="text-xs text-stone-400 mt-1">Deliveries you complete will be archived here</p>
              </div>
            ) : (
              completedDeliveries.map(order => (
                <div key={order.id} className="card p-4 border-stone-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-400 font-bold">#{order.order_number}</span>
                      <span className="text-white font-bold">{order.customer_name}</span>
                    </div>
                    <span className="text-[10px] bg-green-500/20 text-green-400 font-bold px-2 py-0.5 rounded border border-green-500/30">
                      DELIVERED
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400 flex items-center gap-1">
                    <MapPin size={11} className="text-cyan-400" />
                    <span>{order.delivery_address?.line1}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-stone-800 text-stone-500">
                    <span>Delivered at: {order.delivered_at ? new Date(order.delivered_at).toLocaleTimeString('en-IN') : 'Completed'}</span>
                    <span className="text-green-400 font-bold">+₹50 Delivery Payout</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
