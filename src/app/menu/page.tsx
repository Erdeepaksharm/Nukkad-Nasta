'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Plus, Check, Search, Utensils, ShieldCheck, Edit3, Sparkles } from 'lucide-react';
import { MenuItem, CATEGORIES_LIST, getLiveMenu } from '@/lib/menu-data';

export default function MenuPage() {
  const { isAdmin } = useAuth();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [vegOnly, setVegOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [addedIds, setAddedIds] = useState<Record<string, number>>({});

  useEffect(() => {
    setMenu(getLiveMenu());
    const handleStorage = () => setMenu(getLiveMenu());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const filtered = menu.filter(item => {
    if (selectedCat !== 'all' && item.category !== selectedCat) return false;
    if (vegOnly && !item.is_veg) return false;
    if (
      search &&
      !item.name.toLowerCase().includes(search.toLowerCase()) &&
      !item.description.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const addToCart = (item: MenuItem) => {
    try {
      const stored = localStorage.getItem('nukkad_cart');
      const cart = stored ? JSON.parse(stored) : [];
      const existing = cart.find((i: any) => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: item.id,
          name: item.name,
          price: item.price,
          is_veg: item.is_veg,
          image_url: item.image_url,
          quantity: 1,
        });
      }
      localStorage.setItem('nukkad_cart', JSON.stringify(cart));
      setAddedIds(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Admin Quick Controller */}
      {isAdmin && (
        <div className="mb-8 p-4 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border-2 border-amber-500/40 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-amber-500 text-stone-950 rounded-xl font-bold shadow-md">
              <ShieldCheck size={22} />
            </span>
            <div>
              <div className="font-bold text-amber-300 text-sm">Restaurant Owner: Menu Controller</div>
              <div className="text-xs text-stone-400">Add dishes with pictures, modify prices, or mark dishes sold out.</div>
            </div>
          </div>
          <Link
            href="/admin/menu"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold px-4 py-2 rounded-xl text-xs transition-all shadow-md"
          >
            <Edit3 size={15} />
            <span>Open Menu Manager</span>
          </Link>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
          Handcrafted Fresh Daily
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-2 tracking-tight">
          Our Street <span className="text-amber-400">Flavours</span>
        </h1>
        <p className="text-stone-400 text-sm">
          Fresh Noida street specialties cooked to order with authentic regional spices
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Vada Pav, Pav Bhaji, Biryani..."
            className="input pl-10 py-2.5 text-sm"
          />
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              vegOnly
                ? 'bg-green-600 text-white border-green-500 shadow-lg shadow-green-900/30'
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
            }`}
          >
            <span>🟢</span>
            <span>Pure Veg Only</span>
          </button>
          <Link href="/cart" className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 font-bold">
            <span>🛒 View Cart</span>
          </Link>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {CATEGORIES_LIST.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCat === cat.id
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Modern High-End Food Cards with High-Res Pictures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            className="card p-0 overflow-hidden flex flex-col justify-between group hover:border-amber-500/50 transition-all hover:shadow-2xl hover:shadow-amber-500/10 relative"
          >
            {/* Dish Photo Container */}
            <div className="relative h-48 w-full overflow-hidden bg-stone-950">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={e => {
                  (e.target as any).src = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-black/30" />

              {/* Diet & Bestseller Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className={item.is_veg ? 'badge-veg bg-black/60 backdrop-blur-md' : 'badge-nonveg bg-black/60 backdrop-blur-md'}>
                  {item.is_veg ? '🟢 Veg' : '🔴 Non-Veg'}
                </span>
                {item.is_bestseller && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 shadow-md">
                    ⭐ Bestseller
                  </span>
                )}
              </div>

              {/* Admin Quick Edit Button on Card */}
              {isAdmin && (
                <div className="absolute top-3 right-3 z-10">
                  <Link
                    href="/admin/menu"
                    className="bg-black/80 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/50 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-md transition-all"
                  >
                    <Edit3 size={11} />
                    <span>Edit Dish</span>
                  </Link>
                </div>
              )}

              {/* Price Tag Over Image */}
              <div className="absolute bottom-3 left-4">
                <span className="text-2xl font-black text-amber-400 drop-shadow-md">
                  ₹{Math.round(item.price / 100)}
                </span>
              </div>
            </div>

            {/* Dish Info & Description */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h3>
                  {item.spice_level > 0 && (
                    <span className="text-xs" title={`Spice Level ${item.spice_level}`}>
                      {'🌶️'.repeat(item.spice_level)}
                    </span>
                  )}
                </div>

                <p className="text-stone-400 text-xs line-clamp-2 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between">
                <span className={`text-[11px] font-bold ${item.is_available ? 'text-green-400' : 'text-red-400'}`}>
                  {item.is_available ? '● Available' : '○ Currently Sold Out'}
                </span>

                <button
                  onClick={() => addToCart(item)}
                  disabled={!item.is_available}
                  className={`flex items-center gap-1.5 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md active:scale-95 ${
                    item.is_available
                      ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  {addedIds[item.id] ? (
                    <>
                      <Check size={14} className="stroke-[3]" />
                      <span>Added ({addedIds[item.id]})</span>
                    </>
                  ) : (
                    <>
                      <Plus size={14} className="stroke-[3]" />
                      <span>{item.is_available ? 'Add to Cart' : 'Sold Out'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-stone-500">
          <Utensils size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg font-bold text-white">No dishes found</p>
          <p className="text-xs mt-1">Try resetting your category or search query</p>
        </div>
      )}
    </div>
  );
}
