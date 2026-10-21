'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  CheckCircle2, Clock, ChefHat, Bike, Home, Phone, ArrowLeft,
  ShieldCheck, RefreshCw, Store, MapPin
} from 'lucide-react';
import { Order, getLiveOrders, updateOrderStatus } from '@/lib/order-store';

function OrderTrackingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params?.id as string;
  const orderNumber = searchParams.get('number') || 'NN-892341';

  const { isAdmin } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>('confirmed');

  useEffect(() => {
    const orders = getLiveOrders();
    const found = orders.find(o => o.id === orderId || o.order_number === orderNumber);
    if (found) {
      setOrder(found);
      setCurrentStatus(found.status || 'confirmed');
    } else {
      setOrder({
        id: orderId || 'demo-order',
        order_number: orderNumber,
        customer_name: 'Customer',
        customer_phone: '+91 98111 22334',
        type: 'delivery',
        status: 'confirmed',
        subtotal: 32700,
        delivery_fee: 2900,
        tax_amount: 1635,
        total_amount: 37235,
        payment_method: 'cod',
        created_at: new Date().toISOString(),
        items: [
          { name: 'Vada Pav', quantity: 2, price: 6900, is_veg: true },
          { name: 'Special Pav Bhaji', quantity: 1, price: 18900, is_veg: true },
        ],
      });
    }
  }, [orderId, orderNumber]);

  const updateStatus = (newStatus: any) => {
    setCurrentStatus(newStatus);
    if (order) {
      updateOrderStatus(order.id, newStatus);
    }
  };

  const isDelivery = order?.type === 'delivery';

  const deliveryStages = [
    { key: 'confirmed', label: 'Order Confirmed', desc: 'Received by Nukkad Nasta kitchen' },
    { key: 'preparing', label: 'Cooking Fresh', desc: 'Chefs preparing your food' },
    { key: 'assigned', label: order?.rider_name ? `Rider Assigned (${order.rider_name})` : 'Rider Assigned', desc: 'Rider reaching restaurant' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider is on the way to your doorstep' },
    { key: 'delivered', label: 'Delivered', desc: 'Order delivered successfully. Enjoy your meal!' },
  ];

  const pickupStages = [
    { key: 'confirmed', label: 'Order Confirmed', desc: 'Received by Nukkad Nasta' },
    { key: 'preparing', label: 'Cooking in Kitchen', desc: 'Chefs preparing your fresh food' },
    { key: 'ready_for_pickup', label: 'Ready for Pickup', desc: 'Collect fresh at 12, Food Street counter' },
    { key: 'completed', label: 'Order Collected', desc: 'Collected by customer. Enjoy!' },
  ];

  const stages = isDelivery ? deliveryStages : pickupStages;

  const getStageIndex = (status: string) => {
    if (status === 'picked_up') return 3;
    if (status === 'accepted') return 2;
    const idx = stages.findIndex(s => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  const currentIdx = getStageIndex(currentStatus);

  return (
    <div className="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
      {/* Admin Quick Control Banner */}
      {isAdmin && (
        <div className="p-4 bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
            <ShieldCheck size={16} />
            <span>Admin Live Order Control:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stages.map(s => (
              <button
                key={s.key}
                onClick={() => updateStatus(s.key)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentStatus === s.key
                    ? 'bg-amber-500 text-stone-950 shadow'
                    : 'bg-stone-800 text-stone-300 hover:text-white border border-stone-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="card text-center py-8 relative overflow-hidden bg-gradient-to-b from-stone-900 to-stone-950 space-y-3">
        <div className="inline-flex p-3 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 animate-pulse">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Order Tracking</h1>
        <p className="text-amber-400 font-mono font-bold text-lg">
          #{order?.order_number || orderNumber}
        </p>

        <div className="flex justify-center items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
            isDelivery
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          }`}>
            {isDelivery ? <Bike size={14} /> : <Store size={14} />}
            <span>{isDelivery ? 'DOORSTEP DELIVERY' : 'SELF-SERVICE / COUNTER PICKUP'}</span>
          </span>
        </div>

        <p className="text-stone-400 text-xs">
          {isDelivery
            ? 'Estimated delivery in 25–35 minutes'
            : 'Estimated ready for collection in 15–20 minutes at restaurant counter'}
        </p>
      </div>

      {/* Live Timeline Tracker */}
      <div className="card p-6 space-y-6">
        <h2 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Live Order Progress</span>
          <span className="text-xs text-amber-400 font-mono uppercase">
            Status: {currentStatus.replace(/_/g, ' ')}
          </span>
        </h2>

        <div className="space-y-6">
          {stages.map((stage, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={stage.key} className="flex items-start gap-4 relative">
                {idx < stages.length - 1 && (
                  <div className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-[1px] transition-all ${
                    idx < currentIdx ? 'bg-green-500' : 'bg-stone-800'
                  }`} />
                )}

                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 z-10 transition-all ${
                  isCompleted
                    ? 'bg-green-500 text-stone-950 shadow-lg shadow-green-500/20'
                    : 'bg-stone-800 text-stone-500 border border-stone-700'
                }`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>

                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${isCurrent ? 'text-amber-400' : isCompleted ? 'text-white' : 'text-stone-500'}`}>
                      {stage.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30 animate-pulse">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-stone-400 text-xs mt-0.5">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fulfillment Information Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fulfillment Point */}
        <div className="card space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
            {isDelivery ? <Bike size={16} className="text-cyan-400" /> : <Store size={16} className="text-amber-400" />}
            <span>{isDelivery ? 'Delivery Destination' : 'Pickup Location'}</span>
          </h3>

          {isDelivery ? (
            <div className="text-xs text-stone-300 space-y-1">
              <div className="text-white font-semibold">{order?.customer_name}</div>
              <div className="flex items-start gap-1 text-stone-400">
                <MapPin size={13} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>{order?.delivery_address?.line1 || 'Sector 18, Noida'}, {order?.delivery_address?.pincode || '201301'}</span>
              </div>
              {order?.rider_name && (
                <div className="pt-2">
                  <div className="bg-cyan-950/40 border border-cyan-800/60 p-2.5 rounded-xl text-cyan-300 text-[11px] flex items-center gap-2">
                    <Bike size={15} />
                    <span>Rider: <strong>{order.rider_name}</strong> • <a href={`tel:${order.rider_phone}`} className="underline font-mono">{order.rider_phone}</a></span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-stone-300 space-y-1 bg-amber-950/20 p-3 rounded-xl border border-amber-500/30">
              <div className="text-amber-400 font-bold">Nukkad Nasta Restaurant Counter</div>
              <div className="text-stone-300">12, Food Street, Sector 18, Noida 201301</div>
              <div className="text-stone-400 text-[11px] pt-1">
                Collect directly at counter. Show order #<strong>{order?.order_number}</strong> to staff.
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="card space-y-3">
          <h3 className="font-bold text-white text-sm">Order Summary</h3>
          <div className="text-xs space-y-1 text-stone-300">
            {order?.items.map((i, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{i.quantity}x {i.name}</span>
                <span className="font-mono text-stone-400">₹{Math.round((i.price * i.quantity) / 100)}</span>
              </div>
            ))}
            <div className="border-t border-stone-800 pt-2 flex justify-between font-bold text-white">
              <span>Total Paid</span>
              <span className="text-amber-400 font-mono text-sm">
                ₹{Math.round((order?.total_amount || 0) / 100)}
              </span>
            </div>
          </div>
          <div className="pt-2 flex gap-3">
            <Link href="/customer" className="btn-secondary flex-1 py-2 text-center text-xs font-semibold">
              View All Orders
            </Link>
            <Link href="/menu" className="btn-primary flex-1 py-2 text-center text-xs font-bold">
              Order More Food
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="text-center text-stone-400 py-20">Loading order status…</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
