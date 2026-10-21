'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import {
  RestaurantSettings, DEFAULT_SETTINGS, getLiveSettings,
  DAYS_ORDER, formatTime12
} from '@/lib/restaurant-settings';

export default function ContactPage() {
  const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setSettings(getLiveSettings());
  }, []);

  return (
    <div className="py-16 px-4 sm:px-6 max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">Get in Touch</h1>
        <p className="text-stone-400 text-sm">Have a question, feedback, or catering enquiry? We&apos;d love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="card space-y-4">
            <h2 className="text-lg font-bold text-white mb-2">Restaurant Address</h2>
            <div className="flex items-start gap-3 text-stone-300 text-sm">
              <MapPin size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{settings.address}, Pincode: {settings.pincode}</span>
            </div>
            <div className="flex items-center gap-3 text-stone-300 text-sm">
              <Phone size={18} className="text-amber-400 flex-shrink-0" />
              <span>{settings.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-stone-300 text-sm">
              <Mail size={18} className="text-amber-400 flex-shrink-0" />
              <span>{settings.email}</span>
            </div>
          </div>

          <div className="card space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-amber-400" />
              <span>Opening Hours (7 Days)</span>
            </h2>
            <div className="text-xs text-stone-300 space-y-1 divide-y divide-stone-800/60">
              {DAYS_ORDER.map(({ key, label }) => {
                const day = settings.hours[key];
                return (
                  <div key={key} className="flex justify-between py-1.5 first:pt-0">
                    <span className="font-medium text-stone-300">{label}</span>
                    <span className={`font-mono font-bold ${!day.isClosed ? 'text-amber-400' : 'text-stone-500'}`}>
                      {!day.isClosed ? `${formatTime12(day.open)} – ${formatTime12(day.close)}` : 'Closed'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="card">
          <h2 className="text-lg font-bold text-white mb-4">Send a Message</h2>
          {sent ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 size={36} className="text-green-400 mx-auto" />
              <div className="font-bold text-white text-base">Message Sent!</div>
              <p className="text-xs text-stone-400">Thank you for writing to us. Our manager will reply within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Your Name</label>
                <input type="text" required className="input py-2 text-sm" placeholder="Rohan Sharma" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Email or Phone</label>
                <input type="text" required className="input py-2 text-sm" placeholder="rohan@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Message</label>
                <textarea rows={4} required className="input py-2 text-sm" placeholder="How can we help?" />
              </div>
              <button type="submit" className="btn-primary w-full py-2.5 font-bold text-xs shadow-md">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
