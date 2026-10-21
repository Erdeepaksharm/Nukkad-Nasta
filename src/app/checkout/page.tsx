'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { MapPin, Phone, User, CreditCard, Banknote, ShieldCheck, ArrowRight, Loader2, Clock } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const [cart, setCart] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('201301');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup' | 'dine_in'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('cod');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nukkad_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length === 0) {
          router.push('/menu');
        }
        setCart(parsed);
      } else {
        router.push('/menu');
      }

      if (profile) {
        if (profile.full_name) setName(profile.full_name);
        if (profile.phone) setPhone(profile.phone);
        if (profile.email) setEmail(profile.email);
      }
    } catch {}
  }, [profile, router]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = orderType === 'delivery' ? (subtotal > 30000 ? 0 : 2900) : 0;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + gst;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your full name'); return; }
    if (!phone.trim()) { setError('Please enter your phone number'); return; }
    if (orderType === 'delivery' && !address.trim()) { setError('Please enter your delivery address'); return; }

    setLoading(true);
    setError('');

    const orderNumber = `NN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      customer_name: name,
      customer_phone: phone,
      customer_email: email || 'guest@nukkadnasta.in',
      type: orderType,
      status: 'confirmed',
      subtotal,
      delivery_fee: deliveryFee,
      tax_amount: gst,
      total_amount: total,
      payment_method: paymentMethod,
      delivery_address: { line1: address, landmark, pincode, city: 'Noida' },
      items: cart,
      notes: instructions,
      created_at: new Date().toISOString(),
      estimated_delivery_min: 30,
    };

    try {
      // 1. Save order to localStorage for immediate live tracking in Admin, Customer & Rider apps
      const existingOrders = JSON.parse(localStorage.getItem('nukkad_orders_v2') || localStorage.getItem('nukkad_orders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('nukkad_orders_v2', JSON.stringify(existingOrders));
      localStorage.setItem('nukkad_orders', JSON.stringify(existingOrders));
      window.dispatchEvent(new Event('orders_updated'));

      // 2. Clear cart
      localStorage.removeItem('nukkad_cart');
      window.dispatchEvent(new Event('storage'));

      // 3. Post to API in background if online
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      }).catch(err => console.log('API save note:', err));

      // 4. Redirect to tracking page
      router.push(`/orders/${newOrder.id}?number=${orderNumber}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Checkout</h1>
        <p className="text-stone-400 text-sm mt-1">Provide your delivery details & complete your order</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Order Details Form */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-300 text-sm p-4 rounded-xl">
              {error}
            </div>
          )}

          {/* 1. Order Type Selection */}
          <div className="card space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>1. Order Type</span>
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'delivery', label: '🛵 Delivery', desc: 'To your doorstep' },
                { id: 'pickup', label: '🥡 Takeaway', desc: 'Pick up at store' },
                { id: 'dine_in', label: '🍽️ Dine-In', desc: 'Eat at restaurant' },
              ].map(t => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setOrderType(t.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    orderType === t.id
                      ? 'bg-amber-500/20 border-amber-500 text-white'
                      : 'bg-stone-800/60 border-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-sm text-amber-300">{t.label}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Contact Information */}
          <div className="card space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <User size={18} className="text-amber-400" />
              <span>2. Contact Details</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input py-2.5 text-sm"
                  placeholder="Rahul Sharma"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Phone Number (Calling) *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="input py-2.5 text-sm"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Email for Receipt (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input py-2.5 text-sm"
                placeholder="rahul@example.com"
              />
            </div>
          </div>

          {/* 3. Delivery Address (if Delivery) */}
          {orderType === 'delivery' && (
            <div className="card space-y-4 animate-fade-in">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin size={18} className="text-amber-400" />
                <span>3. Delivery Address</span>
              </h2>
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Flat / Building / Street Address *</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="input py-2 text-sm"
                  placeholder="Flat 402, Tower 3, Sector 18, Noida"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Landmark</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={e => setLandmark(e.target.value)}
                    className="input py-2 text-sm"
                    placeholder="Near Wave Silver Tower"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="input py-2 text-sm"
                    placeholder="201301"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Payment Method */}
          <div className="card space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard size={18} className="text-amber-400" />
              <span>4. Payment Method</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                paymentMethod === 'cod' ? 'bg-amber-500/20 border-amber-500' : 'bg-stone-800/60 border-stone-800'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-amber-500 h-4 w-4"
                />
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Banknote size={16} className="text-amber-400" /> Cash on Delivery (COD)
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">Pay with cash or UPI on delivery</div>
                </div>
              </label>

              <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                paymentMethod === 'razorpay' ? 'bg-amber-500/20 border-amber-500' : 'bg-stone-800/60 border-stone-800'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="accent-amber-500 h-4 w-4"
                />
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <CreditCard size={16} className="text-amber-400" /> Online Payment (UPI / Cards)
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">Instant confirmation via Razorpay</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Col: Summary & Submit */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24 space-y-5">
            <h2 className="font-bold text-white text-lg border-b border-stone-800 pb-3">
              Order Review
            </h2>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <span className="text-stone-300">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium text-white">
                    ₹{Math.round((item.price * item.quantity) / 100)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-stone-300 border-t border-stone-800 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-semibold">₹{Math.round(subtotal / 100)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="text-white font-semibold">
                  {deliveryFee === 0 ? <span className="text-green-400">FREE</span> : `₹${Math.round(deliveryFee / 100)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="text-white font-semibold">₹{Math.round(gst / 100)}</span>
              </div>
              <div className="border-t border-stone-800 pt-2 flex justify-between text-sm font-extrabold text-white">
                <span>Final Payable</span>
                <span className="text-amber-400 text-lg">₹{Math.round(total / 100)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30">
              <Clock size={16} />
              <span>Est. Preparation & Delivery: ~25-35 mins</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 font-bold text-sm shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Confirming Order…</span>
                </>
              ) : (
                <>
                  <span>Place Order (₹{Math.round(total / 100)})</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
