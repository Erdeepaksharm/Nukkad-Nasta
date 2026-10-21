'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingBag, Bike, Store, User, Phone, MapPin, CheckCircle2,
  Clock, ArrowRight, ShieldCheck, ChevronDown, Filter, AlertCircle
} from 'lucide-react';
import {
  Order, Rider, OrderStatus, OrderType,
  getLiveOrders, saveLiveOrders, getLiveRiders,
  assignRiderToOrder, updateOrderStatus
} from '@/lib/order-store';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'delivery' | 'pickup'>('all');
  const [selectedOrderForRider, setSelectedOrderForRider] = useState<Order | null>(null);
  const [assigningRiderId, setAssigningRiderId] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  useEffect(() => {
    setOrders(getLiveOrders());
    setRiders(getLiveRiders());

    const handleSync = () => {
      setOrders(getLiveOrders());
      setRiders(getLiveRiders());
    };
    window.addEventListener('orders_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('orders_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, newStatus);
    setOrders(updated);
    setSuccessBanner(`Order #${orders.find(o => o.id === orderId)?.order_number} status updated to ${newStatus.replace(/_/g, ' ')}`);
    setTimeout(() => setSuccessBanner(''), 3000);
  };

  const handleAssignRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForRider || !assigningRiderId) return;

    const chosenRider = riders.find(r => r.id === assigningRiderId);
    if (!chosenRider) return;

    const updated = assignRiderToOrder(selectedOrderForRider.id, chosenRider);
    setOrders(updated);
    setSelectedOrderForRider(null);
    setAssigningRiderId('');
    setSuccessBanner(`Assigned Rider ${chosenRider.name} to order #${selectedOrderForRider.order_number}`);
    setTimeout(() => setSuccessBanner(''), 3500);
  };

  const filtered = orders.filter(o => {
    if (filterType === 'all') return true;
    return o.type === filterType;
  });

  const deliveryOrdersCount = orders.filter(o => o.type === 'delivery').length;
  const pickupOrdersCount = orders.filter(o => o.type === 'pickup').length;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="text-amber-400" />
            <span>Order Management & Fulfillment</span>
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            Track kitchen preparation, manage pickup collection, and assign riders for delivery orders
          </p>
        </div>

        {/* Quick Stats Summary */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300">
            🛵 Delivery: <strong className="text-cyan-400">{deliveryOrdersCount}</strong>
          </span>
          <span className="px-3 py-1 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300">
            🥡 Self-Service / Pickup: <strong className="text-amber-400">{pickupOrdersCount}</strong>
          </span>
        </div>
      </div>

      {successBanner && (
        <div className="p-3.5 bg-green-500/10 border border-green-500/40 text-green-300 text-xs rounded-xl flex items-center gap-2 animate-fade-in shadow-md">
          <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
          <span className="font-semibold">{successBanner}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-stone-800 pb-2">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            filterType === 'all'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'bg-stone-900 text-stone-400 hover:text-white'
          }`}
        >
          All Orders ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('delivery')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
            filterType === 'delivery'
              ? 'bg-cyan-500 text-stone-950 shadow-md'
              : 'bg-stone-900 text-stone-400 hover:text-white'
          }`}
        >
          <Bike size={14} />
          <span>Delivery Orders ({deliveryOrdersCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setFilterType('pickup')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
            filterType === 'pickup'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'bg-stone-900 text-stone-400 hover:text-white'
          }`}
        >
          <Store size={14} />
          <span>Self-Service / Pickup ({pickupOrdersCount})</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="card text-center py-16 text-stone-500">
            <ShoppingBag size={42} className="mx-auto mb-3 opacity-40 text-amber-400" />
            <p className="text-white font-bold text-base">No orders found in this view</p>
            <p className="text-xs text-stone-400 mt-1">New customer orders will appear here automatically</p>
          </div>
        ) : (
          filtered.map(order => {
            const isDelivery = order.type === 'delivery';

            return (
              <div
                key={order.id}
                className={`card p-5 border transition-all ${
                  isDelivery
                    ? 'border-cyan-500/30 hover:border-cyan-500/60'
                    : 'border-amber-500/30 hover:border-amber-500/60'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-extrabold text-amber-400">
                      #{order.order_number}
                    </span>

                    {/* Order Type Badge */}
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isDelivery
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {isDelivery ? <Bike size={12} /> : <Store size={12} />}
                      <span>{isDelivery ? 'DOORSTEP DELIVERY' : 'SELF-SERVICE PICKUP'}</span>
                    </span>

                    {/* Status Badge */}
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 capitalize">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-white">
                      ₹{Math.round(order.total_amount / 100)}
                    </div>
                    <div className="text-[10px] text-stone-400 uppercase">
                      {order.payment_method} • {order.payment_status || 'paid'}
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                  {/* Customer Info */}
                  <div className="space-y-1">
                    <div className="text-stone-400 font-medium">Customer Details</div>
                    <div className="text-white font-bold text-sm">{order.customer_name}</div>
                    <div className="text-stone-300 flex items-center gap-1">
                      <Phone size={12} className="text-amber-400" />
                      <span>{order.customer_phone}</span>
                    </div>
                    {order.customer_email && (
                      <div className="text-stone-400">{order.customer_email}</div>
                    )}
                  </div>

                  {/* Fulfillment Details */}
                  <div className="space-y-1">
                    <div className="text-stone-400 font-medium">Fulfillment Info</div>
                    {isDelivery ? (
                      <>
                        <div className="text-stone-200 flex items-start gap-1">
                          <MapPin size={13} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>
                            {order.delivery_address?.line1}, {order.delivery_address?.pincode}
                          </span>
                        </div>
                        {order.delivery_address?.landmark && (
                          <div className="text-stone-400 text-[11px]">
                            Landmark: {order.delivery_address.landmark}
                          </div>
                        )}
                        <div className="pt-1">
                          {order.rider_name ? (
                            <div className="inline-flex items-center gap-1 text-[11px] bg-cyan-950/60 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-md">
                              <Bike size={11} />
                              <span>Assigned Rider: <strong>{order.rider_name}</strong> ({order.rider_phone})</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-orange-400 font-bold">
                              ⚠️ No Rider Assigned Yet
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="bg-amber-950/20 border border-amber-500/20 p-2 rounded-lg text-amber-300 space-y-0.5">
                        <div className="font-bold flex items-center gap-1">
                          <Store size={13} />
                          <span>Restaurant Counter Pickup</span>
                        </div>
                        <div className="text-[11px] text-stone-400">
                          Customer will pick up at store. No rider assignment needed.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="space-y-1">
                    <div className="text-stone-400 font-medium">Order Items</div>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-stone-300">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-mono text-stone-400">₹{Math.round((item.price * item.quantity) / 100)}</span>
                        </div>
                      ))}
                    </div>
                    {order.notes && (
                      <div className="text-amber-400 text-[11px] italic pt-1">
                        Note: &ldquo;{order.notes}&rdquo;
                      </div>
                    )}
                  </div>
                </div>

                {/* Workflow Actions Footer */}
                <div className="mt-4 pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-stone-400">
                    Ordered: {new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Common Kitchen Workflow */}
                    {order.status === 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(order.id, 'preparing')}
                        className="btn-secondary text-xs py-1.5 px-3 hover:text-orange-400"
                      >
                        Start Cooking (Preparing)
                      </button>
                    )}

                    {/* DELIVERY WORKFLOW */}
                    {isDelivery && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrderForRider(order);
                            setAssigningRiderId(order.rider_id || (riders[0]?.id ?? ''));
                          }}
                          className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 font-bold shadow"
                        >
                          <Bike size={13} />
                          <span>{order.rider_id ? 'Reassign Rider' : 'Assign Rider'}</span>
                        </button>

                        {order.status === 'assigned' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(order.id, 'out_for_delivery')}
                            className="bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-bold text-xs py-1.5 px-3 rounded-xl transition-all"
                          >
                            Mark Out for Delivery
                          </button>
                        )}

                        {order.status === 'out_for_delivery' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(order.id, 'delivered')}
                            className="bg-green-600 hover:bg-green-500 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition-all flex items-center gap-1"
                          >
                            <CheckCircle2 size={13} />
                            <span>Mark Delivered</span>
                          </button>
                        )}
                      </>
                    )}

                    {/* SELF-SERVICE / PICKUP WORKFLOW */}
                    {!isDelivery && (
                      <>
                        {['confirmed', 'preparing'].includes(order.status) && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(order.id, 'ready_for_pickup')}
                            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs py-1.5 px-3 rounded-xl transition-all flex items-center gap-1 shadow-md"
                          >
                            <Store size={13} />
                            <span>Mark Ready for Pickup</span>
                          </button>
                        )}

                        {order.status === 'ready_for_pickup' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(order.id, 'completed')}
                            className="bg-green-600 hover:bg-green-500 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition-all flex items-center gap-1 shadow-md"
                          >
                            <CheckCircle2 size={13} />
                            <span>Customer Collected (Completed)</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Assign Rider Modal */}
      {selectedOrderForRider && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-6 space-y-5 border-cyan-500/40">
            <div className="flex justify-between items-center pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Bike className="text-cyan-400" />
                <h2 className="text-base font-bold text-white">
                  Assign Delivery Rider
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForRider(null)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-stone-400">Order: <strong className="text-amber-400">#{selectedOrderForRider.order_number}</strong></div>
              <div className="text-stone-400">Customer: <strong className="text-white">{selectedOrderForRider.customer_name}</strong> ({selectedOrderForRider.customer_phone})</div>
              <div className="text-stone-400">Address: <strong className="text-stone-200">{selectedOrderForRider.delivery_address?.line1}</strong></div>
            </div>

            <form onSubmit={handleAssignRider} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Select Available Rider *
                </label>
                <select
                  value={assigningRiderId}
                  onChange={e => setAssigningRiderId(e.target.value)}
                  className="input py-2 text-xs"
                  required
                >
                  <option value="">-- Choose Rider --</option>
                  {riders.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} • {r.phone} • {r.vehicle_number}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForRider(null)}
                  className="btn-secondary flex-1 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-stone-950 border-cyan-400"
                >
                  Confirm Rider Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
