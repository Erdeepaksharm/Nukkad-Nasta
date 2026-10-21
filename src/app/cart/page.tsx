'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface CartItem {
  id: string;
  name: string;
  price: number; // in paise
  is_veg: boolean;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nukkad_cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];

    setCart(updated);
    localStorage.setItem('nukkad_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (id: string) => {
    const updated = cart.filter(i => i.id !== id);
    setCart(updated);
    localStorage.setItem('nukkad_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('nukkad_cart');
    window.dispatchEvent(new Event('storage'));
  };

  // Calculations (all in paise)
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 30000 || appliedCoupon === 'FREEDEL' ? 0 : 2900;
  const gst = Math.round(subtotal * 0.05);
  const finalDiscount = couponDiscount;
  const total = Math.max(0, subtotal + deliveryFee + gst - finalDiscount);

  const applyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME50') {
      const disc = Math.min(Math.round(subtotal * 0.5), 15000); // 50% max ₹150
      setCouponDiscount(disc);
      setAppliedCoupon('WELCOME50');
    } else if (code === 'FLAT99') {
      if (subtotal < 49900) {
        setCouponError('Minimum order of ₹499 required for FLAT99');
        return;
      }
      setCouponDiscount(9900);
      setAppliedCoupon('FLAT99');
    } else if (code === 'FREEDEL') {
      setCouponDiscount(0);
      setAppliedCoupon('FREEDEL');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME50 or FLAT99');
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Shopping Cart</h1>
          <p className="text-stone-400 text-sm mt-1">Review your selected street dishes</p>
        </div>
        {cart.length > 0 && (
          <button onClick={clearCart} className="text-xs text-stone-500 hover:text-red-400">
            Clear Cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="card text-center py-20">
          <ShoppingBag size={48} className="mx-auto mb-4 text-stone-600" />
          <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-stone-400 text-sm mb-6">Discover our delicious street delicacies and add items to begin</p>
          <Link href="/menu" className="btn-primary py-3 px-8 text-sm">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="card p-4 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={item.is_veg ? 'badge-veg' : 'badge-nonveg'}>
                      {item.is_veg ? '🟢 Veg' : '🔴 Non-Veg'}
                    </span>
                    <h3 className="font-semibold text-white text-base">{item.name}</h3>
                  </div>
                  <div className="text-amber-400 font-bold text-sm">
                    ₹{Math.round(item.price / 100)} each
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-stone-800 rounded-xl border border-stone-700 px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="text-stone-300 hover:text-amber-400 p-1"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="text-stone-300 hover:text-amber-400 p-1"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span className="w-20 text-right font-extrabold text-white text-base">
                    ₹{Math.round((item.price * item.quantity) / 100)}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-stone-500 hover:text-red-400 p-1.5 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* Quick Add More Link */}
            <div className="pt-2">
              <Link href="/menu" className="text-amber-400 hover:text-amber-300 text-sm font-medium">
                + Add more items from the menu
              </Link>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24 space-y-5">
              <h2 className="text-lg font-bold text-white border-b border-stone-800 pb-3">
                Order Summary
              </h2>

              {/* Coupon Code Input */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Have a Promo Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="e.g. WELCOME50"
                    className="input py-2 text-xs uppercase"
                  />
                  <button
                    onClick={applyCoupon}
                    className="btn-secondary py-2 px-3 text-xs font-bold"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="text-green-400 text-xs mt-1.5 flex items-center gap-1 font-medium">
                    <Tag size={12} /> Coupon &ldquo;{appliedCoupon}&rdquo; applied!
                  </div>
                )}
                {couponError && (
                  <div className="text-red-400 text-xs mt-1.5">{couponError}</div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-sm text-stone-300 border-t border-stone-800 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">₹{Math.round(subtotal / 100)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-white">
                    {deliveryFee === 0 ? <span className="text-green-400 font-bold">FREE</span> : `₹${Math.round(deliveryFee / 100)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-white">₹{Math.round(gst / 100)}</span>
                </div>

                {finalDiscount > 0 && (
                  <div className="flex justify-between text-green-400 font-medium">
                    <span>Discount</span>
                    <span>-₹{Math.round(finalDiscount / 100)}</span>
                  </div>
                )}

                <div className="border-t border-stone-800 pt-3 flex justify-between text-base font-extrabold text-white">
                  <span>Total Payable</span>
                  <span className="text-amber-400 text-xl">₹{Math.round(total / 100)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 font-bold text-sm shadow-xl"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>

              <div className="text-[11px] text-stone-500 text-center">
                🔒 Safe & encrypted checkout. Cash on Delivery & UPI supported.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
