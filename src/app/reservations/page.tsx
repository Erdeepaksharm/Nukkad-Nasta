'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, CheckCircle2, Phone, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function ReservationsPage() {
  const { profile } = useAuth();
  const [name, setName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState('2');
  const [location, setLocation] = useState('Indoor');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingId(id);

    const booking = {
      id,
      customer_name: name,
      customer_phone: phone,
      date,
      start_time: time,
      guest_count: parseInt(guests, 10),
      location,
      special_requests: notes,
      status: 'confirmed',
      created_at: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('nukkad_reservations') || '[]');
      existing.unshift(booking);
      localStorage.setItem('nukkad_reservations', JSON.stringify(existing));
    } catch {}

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="py-20 px-4 max-w-lg mx-auto text-center">
        <div className="card py-10 space-y-4">
          <div className="inline-flex p-3 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 mb-2">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-2xl font-bold text-white">Table Reserved!</h1>
          <p className="text-amber-400 font-mono font-bold text-lg">{bookingId}</p>
          <div className="text-stone-300 text-sm space-y-1">
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Time:</strong> {time}</p>
            <p><strong>Guests:</strong> {guests} People ({location})</p>
            <p><strong>Reserved for:</strong> {name}</p>
          </div>
          <p className="text-xs text-stone-400 pt-2">
            A confirmation SMS will be sent to {phone}. We look forward to serving you!
          </p>
          <div className="pt-4 flex gap-3 justify-center">
            <button onClick={() => setSubmitted(false)} className="btn-secondary py-2 px-4 text-xs">
              Book Another Table
            </button>
            <Link href="/menu" className="btn-primary py-2 px-4 text-xs">
              Explore Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-2">
          <Sparkles size={20} />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Reserve a Dining Table</h1>
        <p className="text-stone-400 text-sm mt-1">Experience Noida street delights served fresh at our authentic corner</p>
      </div>

      <div className="card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Your Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input py-2.5 text-sm"
                placeholder="Pooja Mehta"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Phone Number *</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Date *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="input py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Time Slot *</label>
              <select
                value={time}
                onChange={e => setTime(e.target.value)}
                className="input py-2 text-sm"
              >
                <option value="12:00">12:00 PM (Lunch)</option>
                <option value="13:00">01:00 PM (Lunch)</option>
                <option value="14:00">02:00 PM (Lunch)</option>
                <option value="18:30">06:30 PM (Evening)</option>
                <option value="19:30">07:30 PM (Dinner)</option>
                <option value="20:30">08:30 PM (Dinner)</option>
                <option value="21:30">09:30 PM (Dinner)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Number of Guests *</label>
              <select
                value={guests}
                onChange={e => setGuests(e.target.value)}
                className="input py-2 text-sm"
              >
                <option value="1">1 Person</option>
                <option value="2">2 People</option>
                <option value="4">4 People</option>
                <option value="6">6 People</option>
                <option value="8">8+ People (Party)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Seating Preference</label>
            <div className="grid grid-cols-2 gap-3">
              {['Indoor (AC Dining)', 'Outdoor (Street Patio)'].map(loc => (
                <label
                  key={loc}
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    location === loc ? 'bg-amber-500/20 border-amber-500 text-white font-semibold' : 'bg-stone-800/60 border-stone-800 text-stone-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="location"
                    checked={location === loc}
                    onChange={() => setLocation(loc)}
                    className="accent-amber-500"
                  />
                  <span className="text-xs">{loc}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Special Occasion or Dietary Notes</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="input py-2 text-sm"
              placeholder="e.g. Birthday celebration, Jain food only"
            />
          </div>

          <button type="submit" className="btn-primary w-full py-3.5 font-bold text-sm shadow-xl">
            Confirm Table Reservation
          </button>
        </form>
      </div>
    </div>
  );
}
