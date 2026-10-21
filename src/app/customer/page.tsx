'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, ShoppingBag, Bike, Store, Clock, Phone, MapPin,
  Calendar, CheckCircle2, ChevronRight, ArrowRight, RotateCcw,
  LogOut, ShieldCheck, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Order, getLiveOrders } from '@/lib/order-store';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, profile, isCustomer, isAdmin, isRider, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'profile'>('active');
  const [phoneInput, setPhoneInput] = useState(profile?.phone || '+91 98111 22334');
  const [nameInput, setNameInput] = useState(profile?.full_name || 'Customer');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    // Read live orders
    const all = getLiveOrders();
    // Filter strictly to this customer to preserve complete privacy
    const userEmail = profile?.email || user?.email || 'customer@nukkadnasta.in';
    const myOrders = all.filter(o =>
      (user && o.user_id === user.id) ||
      o.customer_email === userEmail ||
      (profile?.phone && o.customer_phone === profile.phone)
    );
    // If none matched, show the customer demo orders
    if (myOrders.length === 0) {
      setOrders(all.filter(o => o.user_id === 'usr-customer-1' || o.customer_name === 'Aarav Mehta'));
    } else {
      setOrders(myOrders);
    }

    if (profile?.full_name) setNameInput(profile.full_name);
    if (profile?.phone) setPhoneInput(profile.phone);
  }, [user, profile]);

  const activeOrders = orders.filter(o => !['delivered', 'completed', 'cancelled'].includes(o.status));
  const pastOrders = orders.filter(o => ['delivered', 'completed', 'cancelled'].includes(o.status));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      const updated = { ...profile, full_name: nameInput, phone: phoneInput };
      try {
        localStorage.setItem('nukkad_user_profile', JSON.stringify(updated));
      } catch {}
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleReorder = (order: Order) => {
    try {
      const cart = order.items.map(item => ({
        id: `item-${Date.now()}-${Math.random()}`,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        is_veg: item.is_veg ?? true,
      }));
      localStorage.setItem('nukkad_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
      router.push('/cart');
    } catch {}
  };

  const renderTimeline = (order: Order) => {
    const isDelivery = order.type === 'delivery';

    if (isDelivery) {
      const steps = [
        { key: 'placed', label: 'Order Placed', done: true },
        { key: 'prep', label: 'Kitchen Preparing', done: ['preparing', 'assigned', 'accepted', 'picked_up', 'out_for_delivery', 'delivered'].includes(order.status) },
        { key: 'rider', label: order.rider_name ? `Rider Assigned (${order.rider_name})` : 'Assigning Rider', done: ['assigned', 'accepted', 'picked_up', 'out_for_delivery', 'delivered'].includes(order.status) },
        { key: 'out', label: 'Out for Delivery', done: ['picked_up', 'out_for_delivery', 'delivered'].includes(order.status) },
        { key: 'delivered', label: 'Delivered', done: order.status === 'delivered' },
      ];

      return (
        <div className="pt-3 pb-1">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-stone-800 w-full z-0" />
            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  step.done ? 'bg-cyan-500 text-stone-950 font-extrabold shadow' : 'bg-stone-800 text-stone-500'
                }`}>
                  {step.done ? '✓' : idx + 1}
                </div>
                <span className={`text-[10px] mt-1.5 text-center hidden sm:block max-w-[70px] ${
                  step.done ? 'text-cyan-300 font-semibold' : 'text-stone-500'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      // SELF-SERVICE / PICKUP WORKFLOW
      const steps = [
        { label: 'Order Placed', done: true },
        { label: 'Cooking in Kitchen', done: ['preparing', 'ready_for_pickup', 'completed'].includes(order.status) },
        { label: 'Ready at Counter', done: ['ready_for_pickup', 'completed'].includes(order.status) },
        { label: 'Collected by You', done: order.status === 'completed' },
      ];

      return (
        <div className="pt-3 pb-1">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-stone-800 w-full z-0" />
            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  step.done ? 'bg-amber-500 text-stone-950 font-extrabold shadow' : 'bg-stone-800 text-stone-500'
                }`}>
                  {step.done ? '✓' : idx + 1}
                </div>
                <span className={`text-[10px] mt-1.5 text-center hidden sm:block max-w-[80px] ${
                  step.done ? 'text-amber-300 font-semibold' : 'text-stone-500'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full border border-amber-500/30">
            👤 Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Welcome back, {profile?.full_name || 'Foodie'}!
          </h1>
          <p className="text-stone-400 text-xs mt-0.5">
            Manage your orders, food fulfillment preferences, and personal profile
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/menu" className="btn-primary text-xs py-2 px-4 font-bold shadow-lg flex items-center gap-1.5">
            <ShoppingBag size={14} />
            <span>Order Food Now</span>
          </Link>
          <button
            onClick={() => signOut().then(() => router.push('/login'))}
            className="btn-secondary text-xs py-2 px-3 text-stone-400 hover:text-red-400 flex items-center gap-1"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/menu" className="card p-4 hover:border-amber-500/50 hover:bg-stone-800/80 transition-all group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍲</span>
            <div>
              <div className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">Food Menu</div>
              <div className="text-stone-400 text-[11px]">Street chaat, biryani, dosas</div>
            </div>
          </div>
          <ChevronRight size={16} className="text-stone-500 group-hover:text-amber-400" />
        </Link>

        <Link href="/cart" className="card p-4 hover:border-amber-500/50 hover:bg-stone-800/80 transition-all group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛒</span>
            <div>
              <div className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">My Cart</div>
              <div className="text-stone-400 text-[11px]">Review items & checkout</div>
            </div>
          </div>
          <ChevronRight size={16} className="text-stone-500 group-hover:text-amber-400" />
        </Link>

        <Link href="/reservations" className="card p-4 hover:border-amber-500/50 hover:bg-stone-800/80 transition-all group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📅</span>
            <div>
              <div className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">Book a Table</div>
              <div className="text-stone-400 text-[11px]">Dine-in at Sector 18, Noida</div>
            </div>
          </div>
          <ChevronRight size={16} className="text-stone-500 group-hover:text-amber-400" />
        </Link>
      </div>

      {/* Fulfillment Explainer Strip */}
      <div className="card p-4 bg-stone-900/60 border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex-shrink-0">
            <Bike size={20} />
          </div>
          <div className="space-y-0.5">
            <div className="font-bold text-white text-xs">Fulfillment Option A: Delivery</div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Provide your address. Our restaurant assigns a rider who picks up your sealed meal and delivers it hot to your doorstep.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">
            <Store size={20} />
          </div>
          <div className="space-y-0.5">
            <div className="font-bold text-white text-xs">Fulfillment Option B: Self-Service / Pickup</div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              No delivery charges, no rider wait. Pick up fresh at our restaurant counter: <strong>12, Food Street, Sector 18, Noida 201301</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'active'
              ? 'bg-amber-500 text-stone-950 shadow'
              : 'bg-stone-900 text-stone-400 hover:text-white'
          }`}
        >
          Active Orders ({activeOrders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-amber-500 text-stone-950 shadow'
              : 'bg-stone-900 text-stone-400 hover:text-white'
          }`}
        >
          Past Orders ({pastOrders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-amber-500 text-stone-950 shadow'
              : 'bg-stone-900 text-stone-400 hover:text-white'
          }`}
        >
          My Profile & Details
        </button>
      </div>

      {/* TAB 1: ACTIVE ORDERS */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeOrders.length === 0 ? (
            <div className="card text-center py-16 text-stone-500 space-y-3">
              <ShoppingBag size={42} className="mx-auto opacity-40 text-amber-400" />
              <div className="text-white font-bold text-base">No active orders right now</div>
              <p className="text-xs text-stone-400">Hungry? Explore our authentic Noida street food delicacies</p>
              <Link href="/menu" className="btn-primary text-xs py-2.5 px-5 font-bold inline-block mt-2">
                Browse Menu →
              </Link>
            </div>
          ) : (
            activeOrders.map(order => {
              const isDelivery = order.type === 'delivery';

              return (
                <div
                  key={order.id}
                  className={`card p-6 border space-y-4 ${
                    isDelivery ? 'border-cyan-500/40' : 'border-amber-500/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-extrabold text-amber-400">
                          #{order.order_number}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isDelivery
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {isDelivery ? <Bike size={11} /> : <Store size={11} />}
                          <span>{isDelivery ? 'DELIVERY ORDER' : 'SELF-SERVICE PICKUP'}</span>
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-1">
                        Ordered at {new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-base font-extrabold text-white">
                        ₹{Math.round(order.total_amount / 100)}
                      </div>
                      <div className="text-[11px] text-green-400 font-semibold">
                        Payment: {order.payment_method.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Visual Timeline Tracker */}
                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                    <div className="text-xs font-bold text-stone-300 mb-2 flex items-center justify-between">
                      <span>Order Progress</span>
                      <span className="text-amber-400 uppercase tracking-wider text-[10px]">
                        Status: {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {renderTimeline(order)}

                    {/* Dynamic Fulfillment guidance */}
                    <div className="mt-3 pt-3 border-t border-stone-800/60 text-xs">
                      {isDelivery ? (
                        order.rider_name ? (
                          <div className="flex items-center gap-2 text-cyan-300">
                            <Bike size={14} className="flex-shrink-0" />
                            <span>
                              Assigned Rider: <strong>{order.rider_name}</strong> • Phone: <a href={`tel:${order.rider_phone}`} className="underline font-mono">{order.rider_phone}</a>
                            </span>
                          </div>
                        ) : (
                          <div className="text-stone-400 text-[11px]">
                            ⏳ Kitchen is preparing your order. Our team will assign a delivery rider shortly.
                          </div>
                        )
                      ) : (
                        <div className="flex items-center gap-2 text-amber-300">
                          <Store size={14} className="flex-shrink-0" />
                          <span>
                            {order.status === 'ready_for_pickup'
                              ? '🎉 Your food is hot and READY for pickup at the counter! Please show your order number # ' + order.order_number
                              : 'Chef is preparing your fresh order. We will notify you when it is ready for collection.'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-1.5 text-xs text-stone-300 pt-1">
                    <div className="font-semibold text-stone-400">Items in this order:</div>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-mono text-stone-400">₹{Math.round((item.price * item.quantity) / 100)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: ORDER HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {pastOrders.length === 0 ? (
            <div className="card text-center py-12 text-stone-500">
              <Clock size={36} className="mx-auto mb-2 opacity-40" />
              <div className="text-white font-bold">No past orders yet</div>
              <p className="text-xs text-stone-400 mt-1">Completed orders will be archived here for easy reordering</p>
            </div>
          ) : (
            pastOrders.map(order => (
              <div key={order.id} className="card p-5 border-stone-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-amber-400 font-bold text-sm">#{order.order_number}</span>
                    <span className="text-stone-400 text-xs ml-2">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="ml-2 text-[10px] uppercase font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/30">
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-white text-sm">₹{Math.round(order.total_amount / 100)}</span>
                    <button
                      type="button"
                      onClick={() => handleReorder(order)}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 font-bold hover:text-amber-400"
                    >
                      <RotateCcw size={12} />
                      <span>Re-order</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-stone-400 space-y-1">
                  {order.items.map((i, idx) => (
                    <span key={idx} className="mr-3 inline-block">
                      {i.quantity}x {i.name}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: PROFILE */}
      {activeTab === 'profile' && (
        <div className="card p-6 max-w-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-800">
            <User size={18} className="text-amber-400" />
            <h2 className="text-base font-bold text-white">Customer Profile Details</h2>
          </div>

          {profileSaved && (
            <div className="p-3 bg-green-500/10 border border-green-500/40 text-green-300 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-400" />
              <span>Profile details saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="input py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Contact Phone (for delivery)</label>
              <input
                type="tel"
                value={phoneInput}
                onChange={e => setPhoneInput(e.target.value)}
                className="input py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Account Email</label>
              <input
                type="email"
                value={profile?.email || 'customer@nukkadnasta.in'}
                disabled
                className="input py-2 text-sm opacity-60 cursor-not-allowed"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">Account role: Customer</span>
            </div>

            <button type="submit" className="btn-primary py-2.5 px-6 font-bold text-xs shadow-md">
              Save Profile Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
