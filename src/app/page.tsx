'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Utensils, Calendar, Clock, Star, Flame, Sparkles, ArrowRight,
  ShieldCheck, Bike, HeartHandshake, CheckCircle2, ChevronRight
} from 'lucide-react';
import { MenuItem, INITIAL_MENU, getLiveMenu, CATEGORIES_LIST } from '@/lib/menu-data';
import {
  RestaurantSettings, DEFAULT_SETTINGS, getLiveSettings,
  checkRestaurantOpenStatus, formatTime12
} from '@/lib/restaurant-settings';

export default function HomePage() {
  const [bestsellers, setBestsellers] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);
  const [status, setStatus] = useState({
    isOpen: true,
    statusText: 'Open Now • Closes at 10:30 PM',
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    todayScheduleText: '8:00 AM – 10:30 PM',
  });

  useEffect(() => {
    const liveItems = getLiveMenu();
    const popular = liveItems.filter(i => i.is_bestseller).slice(0, 6);
    setBestsellers(popular.length > 0 ? popular : liveItems.slice(0, 6));

    const s = getLiveSettings();
    setSettings(s);
    setStatus(checkRestaurantOpenStatus(s));

    const handleUpdate = () => {
      const updatedS = getLiveSettings();
      setSettings(updatedS);
      setStatus(checkRestaurantOpenStatus(updatedS));
      const updatedM = getLiveMenu();
      const updatedPop = updatedM.filter(i => i.is_bestseller).slice(0, 6);
      setBestsellers(updatedPop.length > 0 ? updatedPop : updatedM.slice(0, 6));
    };

    window.addEventListener('restaurant_settings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('restaurant_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 px-6 py-20">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 40%, #f59e0b 0%, transparent 65%)',
          }}
        />

        <div className="relative text-center max-w-4xl mx-auto space-y-6">
          {/* Live Open/Closed Status Badge */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold shadow-md ${status.badgeColor}`}>
              <span className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span>{status.statusText}</span>
            </div>

            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Sparkles size={13} className="text-amber-400" />
              <span>Noida&apos;s Iconic Flavours</span>
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
            Nukkad <span className="text-amber-400 underline decoration-amber-500/40 decoration-wavy">Nasta</span>
          </h1>

          <p className="text-lg sm:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed">
            {settings.tagline || 'Authentic street food from the heart of Noida — Vada Pav, Pani Puri, Biryani & more. Fresh, fast, delivered to your doorstep.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Link
              href="/menu"
              className="btn-primary text-base py-3.5 px-8 inline-flex items-center justify-center gap-2.5 font-bold shadow-xl hover:scale-105 transition-all w-full sm:w-auto"
            >
              <Utensils size={18} />
              <span>Explore Food Menu</span>
            </Link>

            <Link
              href="/reservations"
              className="btn-outline text-base py-3.5 px-8 inline-flex items-center justify-center gap-2.5 font-semibold hover:bg-stone-800 transition-all w-full sm:w-auto"
            >
              <Calendar size={18} />
              <span>Book a Table</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 max-w-3xl mx-auto">
            {[
              { label: 'Dishes Available', value: '25+', sub: 'Fresh Everyday' },
              { label: 'Customer Rating', value: '4.8 ★', sub: 'Over 2,400+ reviews' },
              { label: 'Fast Delivery', value: '25-40 min', sub: 'Hot & Sealed' },
              { label: 'Min Order', value: `₹${Math.round(settings.minOrderPaise / 100)}`, sub: 'No hidden surge' },
            ].map(item => (
              <div key={item.label} className="card p-3.5 text-center bg-stone-900/60 border-stone-800 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-extrabold text-amber-400">{item.value}</div>
                <div className="text-white text-xs font-bold mt-0.5">{item.label}</div>
                <div className="text-[10px] text-stone-400">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Promo Coupon Strip */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="card p-6 bg-gradient-to-r from-amber-500/20 via-stone-900 to-amber-900/30 border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl flex-shrink-0">
              🏷️
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">
                FLAT 50% OFF ON YOUR FIRST ORDER
              </div>
              <div className="text-xs text-stone-300">
                Use code <span className="font-mono font-bold text-amber-400 bg-stone-950 px-2 py-0.5 rounded border border-amber-500/30">WELCOME50</span> at checkout (Min. order ₹150)
              </div>
            </div>
          </div>
          <Link href="/menu" className="btn-primary text-xs py-2.5 px-5 font-bold whitespace-nowrap">
            Order Now & Save →
          </Link>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <span>Browse by Category</span>
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              From morning breakfast and piping chai to authentic street chaats and biryanis
            </p>
          </div>
          <Link href="/menu" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
            <span>View All</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES_LIST.filter(c => c.id !== 'all').map(cat => (
            <Link
              key={cat.id}
              href={`/menu#${cat.id}`}
              className="card p-3 text-center hover:border-amber-500/50 hover:bg-stone-800/80 transition-all group flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-xs font-semibold text-stone-300 group-hover:text-amber-400 transition-colors line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Picks (Advanced Food Cards with mouth-watering photography) */}
      <section className="bg-stone-950/80 py-12 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1 uppercase tracking-wider">
                <Flame size={14} />
                <span>Customer Favourites</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Most Loved & Bestsellers
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm mt-1">
                Prepared fresh with authentic spices and delivered hot
              </p>
            </div>

            <Link href="/menu" className="btn-secondary text-xs py-2 px-4 self-start sm:self-auto font-semibold">
              See Entire Menu ({INITIAL_MENU.length}+ dishes) →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestsellers.map(dish => (
              <div
                key={dish.id}
                className="card overflow-hidden group hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all flex flex-col"
              >
                {/* Food Image with Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                  <img
                    src={dish.image_url}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />

                  {/* Veg / Non-Veg Pill */}
                  <div className="absolute top-3 left-3">
                    <span className={dish.is_veg ? 'badge-veg' : 'badge-nonveg'}>
                      {dish.is_veg ? '🟢 Veg' : '🔴 Non-Veg'}
                    </span>
                  </div>

                  {/* Bestseller Badge */}
                  {dish.is_bestseller && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                      <Star size={10} className="fill-stone-950" />
                      <span>BESTSELLER</span>
                    </div>
                  )}

                  {/* Price Tag in Photo */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-xl font-extrabold text-amber-400 drop-shadow">
                      ₹{Math.round(dish.price / 100)}
                    </span>
                  </div>
                </div>

                {/* Dish Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-stone-400 text-xs line-clamp-2 mt-1">
                      {dish.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
                    <span className="text-stone-400 text-[11px] capitalize">
                      {dish.category.replace(/-/g, ' ')}
                    </span>

                    <Link
                      href="/menu"
                      className="btn-primary py-1.5 px-3.5 text-xs font-bold inline-flex items-center gap-1 shadow-md"
                    >
                      <span>Order</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operating Hours & Restaurant Info Banner */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="card p-6 sm:p-8 bg-stone-900/60 border-stone-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <Clock size={20} />
                <h3 className="font-bold text-white text-lg">Operating Hours</h3>
              </div>
              <p className="text-stone-400 text-xs">
                {settings.name} welcomes you every day with freshly prepared delicacies
              </p>
              <div className="text-sm font-bold text-white pt-1">
                Today: <span className="text-amber-400">{status.todayScheduleText}</span>
              </div>
            </div>

            <div className="text-xs text-stone-300 space-y-1.5 border-y md:border-y-0 md:border-x border-stone-800 py-4 md:py-0 md:px-6">
              <div className="flex justify-between">
                <span>Mon – Thu:</span>
                <span className="font-mono font-bold text-white">
                  {formatTime12(settings.hours.monday.open)} – {formatTime12(settings.hours.monday.close)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Fri – Sat:</span>
                <span className="font-mono font-bold text-white">
                  {formatTime12(settings.hours.friday.open)} – {formatTime12(settings.hours.friday.close)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-mono font-bold text-white">
                  {formatTime12(settings.hours.sunday.open)} – {formatTime12(settings.hours.sunday.close)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 justify-center items-start md:items-end">
              <div className="text-xs text-stone-400">
                📍 {settings.address}
              </div>
              <div className="text-xs text-stone-400">
                📞 {settings.phone}
              </div>
              <Link href="/reservations" className="btn-outline text-xs py-2 px-4 font-bold">
                Book a Table for Tonight →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Features */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Bike size={28} className="text-amber-400" />,
              title: 'Fast Zone Delivery',
              desc: 'Dispatched immediately in insulated food-grade packaging. Average delivery within 25–40 minutes.',
            },
            {
              icon: <ShieldCheck size={28} className="text-amber-400" />,
              title: '100% Quality Ingredients',
              desc: 'Freshly churned butter, organic spices, authentic local ingredients, and no artificial flavor enhancers.',
            },
            {
              icon: <HeartHandshake size={28} className="text-amber-400" />,
              title: 'Hygienic & Fresh',
              desc: 'Cooked fresh on order in our sanitized kitchen adhering to stringent FSSAI safety protocols.',
            },
          ].map(f => (
            <div key={f.title} className="card p-6 text-center space-y-3 hover:border-amber-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-stone-800 flex items-center justify-center mx-auto">
                {f.icon}
              </div>
              <h3 className="font-bold text-white text-base">{f.title}</h3>
              <p className="text-stone-400 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
