'use client';

import { useState, useEffect } from 'react';
import {
  Settings, Save, CheckCircle2, Store, Clock, Phone, Mail,
  AlertTriangle, Power, Sparkles, Copy, Calendar
} from 'lucide-react';
import {
  RestaurantSettings, DayOfWeek, DAYS_ORDER,
  DEFAULT_SETTINGS, getLiveSettings, saveLiveSettings,
  formatTime12, checkRestaurantOpenStatus
} from '@/lib/restaurant-settings';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'schedule' | 'brand' | 'taxes'>('schedule');

  useEffect(() => {
    setSettings(getLiveSettings());
  }, []);

  const handleDayChange = (
    day: DayOfWeek,
    field: 'open' | 'close' | 'isClosed',
    value: string | boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [field]: value,
        },
      },
    }));
  };

  const applyPresetAllDays = (open: string, close: string) => {
    setSettings(prev => {
      const updatedHours = { ...prev.hours };
      DAYS_ORDER.forEach(({ key }) => {
        updatedHours[key] = { open, close, isClosed: false };
      });
      return { ...prev, hours: updatedHours };
    });
  };

  const applyPresetStandard = () => {
    setSettings(prev => ({
      ...prev,
      hours: {
        monday:    { open: '08:00', close: '22:30', isClosed: false },
        tuesday:   { open: '08:00', close: '22:30', isClosed: false },
        wednesday: { open: '08:00', close: '22:30', isClosed: false },
        thursday:  { open: '08:00', close: '22:30', isClosed: false },
        friday:    { open: '08:00', close: '23:30', isClosed: false },
        saturday:  { open: '08:00', close: '23:30', isClosed: false },
        sunday:    { open: '09:00', close: '22:00', isClosed: false },
      },
    }));
  };

  const copyMondayToWeekdays = () => {
    const mondayHours = settings.hours.monday;
    setSettings(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        tuesday:   { ...mondayHours },
        wednesday: { ...mondayHours },
        thursday:  { ...mondayHours },
        friday:    { ...mondayHours },
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveLiveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const liveStatus = checkRestaurantOpenStatus(settings);

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="text-amber-400" />
            <span>Restaurant Schedule & Settings</span>
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            Configure daily opening/closing hours, instant open/close override, brand profile and taxes
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 ${liveStatus.badgeColor}`}>
            <span className={`w-2 h-2 rounded-full ${liveStatus.isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span>{liveStatus.statusText}</span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {saved && (
        <div className="p-4 bg-green-500/10 border border-green-500/40 text-green-300 text-sm rounded-xl flex items-center gap-2.5 animate-fade-in shadow-lg">
          <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
          <span className="font-medium">Restaurant schedule & settings saved and updated live!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-stone-800 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('schedule')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'schedule'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Clock size={16} />
          <span>Operating Hours (Daily & Day-Wise)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('brand')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'brand'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Store size={16} />
          <span>Brand & Address Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('taxes')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'taxes'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Settings size={16} />
          <span>Taxes & Order Limits</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: OPERATING HOURS & DAY-WISE SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            {/* Master Open / Close Emergency Override */}
            <div className={`card p-5 border transition-all ${
              settings.isStoreOpenManual
                ? 'border-stone-800 bg-stone-900/60'
                : 'border-red-500/40 bg-red-950/20'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Power size={18} className={settings.isStoreOpenManual ? 'text-green-400' : 'text-red-400'} />
                    <span className="font-bold text-white text-sm">
                      Master Restaurant Status: {settings.isStoreOpenManual ? 'Accepting Orders' : 'Store Temporarily Paused'}
                    </span>
                  </div>
                  <p className="text-stone-400 text-xs">
                    Quickly pause all incoming online orders and table bookings (e.g. rush hours, kitchen maintenance)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, isStoreOpenManual: !prev.isStoreOpenManual }))}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                    settings.isStoreOpenManual
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                      : 'bg-green-500 text-stone-950 font-extrabold hover:bg-green-400'
                  }`}
                >
                  {settings.isStoreOpenManual ? 'Pause Restaurant Now' : 'Reopen Restaurant Now'}
                </button>
              </div>

              {!settings.isStoreOpenManual && (
                <div className="mt-4 pt-4 border-t border-stone-800">
                  <label className="block text-xs font-medium text-red-300 mb-1">
                    Temporary Closure Notice for Customers (Optional)
                  </label>
                  <input
                    type="text"
                    value={settings.emergencyNotice}
                    onChange={e => setSettings(prev => ({ ...prev, emergencyNotice: e.target.value }))}
                    placeholder="e.g. Kitchen deep-cleaning in progress. We resume orders at 6:00 PM today."
                    className="input py-2 text-xs text-red-200 border-red-500/30 bg-red-950/30"
                  />
                </div>
              )}
            </div>

            {/* Quick Presets */}
            <div className="card p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" />
                  <span className="text-xs font-bold text-white">Quick Schedule Presets</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={applyPresetStandard}
                    className="px-3 py-1.5 rounded-lg text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                  >
                    Standard (Weekdays 8am–10:30pm, Weekends 8am–11:30pm)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetAllDays('08:00', '23:00')}
                    className="px-3 py-1.5 rounded-lg text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                  >
                    All Days 8:00 AM – 11:00 PM
                  </button>
                  <button
                    type="button"
                    onClick={copyMondayToWeekdays}
                    className="px-3 py-1.5 rounded-lg text-xs bg-stone-800 hover:bg-stone-700 text-amber-400 transition-colors flex items-center gap-1"
                  >
                    <Copy size={12} />
                    <span>Copy Mon to All Weekdays</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Day-Wise Schedule Grid */}
            <div className="card space-y-3 p-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-amber-400" />
                  <span className="font-bold text-white text-sm">7-Day Weekly Schedule</span>
                </div>
                <span className="text-[11px] text-stone-400">Times in 24-hr format (HH:mm)</span>
              </div>

              <div className="space-y-2.5">
                {DAYS_ORDER.map(({ key, label }) => {
                  const dayData = settings.hours[key] || { open: '08:00', close: '22:30', isClosed: false };
                  const isClosed = dayData.isClosed;

                  return (
                    <div
                      key={key}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                        isClosed
                          ? 'bg-stone-900/30 border-stone-800/60 opacity-60'
                          : 'bg-stone-900/80 border-stone-800 hover:border-amber-500/30'
                      }`}
                    >
                      {/* Day Label & Open/Closed Status */}
                      <div className="flex items-center gap-3 w-44">
                        <button
                          type="button"
                          onClick={() => handleDayChange(key, 'isClosed', !isClosed)}
                          className={`w-9 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                            !isClosed ? 'bg-amber-500 justify-end' : 'bg-stone-700 justify-start'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-stone-950 block" />
                        </button>
                        <div>
                          <div className="font-bold text-white text-sm">{label}</div>
                          <div className={`text-[11px] font-semibold ${!isClosed ? 'text-green-400' : 'text-stone-500'}`}>
                            {!isClosed ? 'Open for Business' : 'Closed'}
                          </div>
                        </div>
                      </div>

                      {/* Time Controls */}
                      {!isClosed ? (
                        <div className="flex flex-wrap items-center gap-4 flex-1 justify-end">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-400">Open:</span>
                            <input
                              type="time"
                              value={dayData.open}
                              onChange={e => handleDayChange(key, 'open', e.target.value)}
                              className="input py-1 px-2.5 text-xs w-28 text-white font-mono"
                              required
                            />
                            <span className="text-[11px] font-semibold text-amber-400 bg-stone-950 px-2 py-1 rounded border border-stone-800">
                              {formatTime12(dayData.open)}
                            </span>
                          </div>

                          <span className="text-stone-600 hidden sm:inline">→</span>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-400">Close:</span>
                            <input
                              type="time"
                              value={dayData.close}
                              onChange={e => handleDayChange(key, 'close', e.target.value)}
                              className="input py-1 px-2.5 text-xs w-28 text-white font-mono"
                              required
                            />
                            <span className="text-[11px] font-semibold text-amber-400 bg-stone-950 px-2 py-1 rounded border border-stone-800">
                              {formatTime12(dayData.close)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-stone-500 italic py-1 text-right flex-1">
                          Restaurant will remain closed all day on {label}s
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BRAND & CONTACT */}
        {activeTab === 'brand' && (
          <div className="space-y-6">
            <div className="card space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Store size={18} className="text-amber-400" />
                <span>Restaurant Identity</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Restaurant Name *</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={e => setSettings(prev => ({ ...prev, name: e.target.value }))}
                    className="input py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Brand Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={e => setSettings(prev => ({ ...prev, tagline: e.target.value }))}
                    className="input py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="card space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Phone size={18} className="text-amber-400" />
                <span>Contact & Location</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Customer Helpline (Phone) *</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={e => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                    className="input py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Official Email *</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={e => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    className="input py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-300 mb-1">Physical Street Address *</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={e => setSettings(prev => ({ ...prev, address: e.target.value }))}
                    className="input py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Pincode *</label>
                  <input
                    type="text"
                    value={settings.pincode}
                    onChange={e => setSettings(prev => ({ ...prev, pincode: e.target.value }))}
                    className="input py-2 text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TAXES & FINANCIALS */}
        {activeTab === 'taxes' && (
          <div className="card space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Settings size={18} className="text-amber-400" />
              <span>Tax Percentage & Minimum Order</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">GST Tax Percentage (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={settings.taxPercentage}
                  onChange={e => setSettings(prev => ({ ...prev, taxPercentage: parseFloat(e.target.value || '0') }))}
                  className="input py-2 text-sm"
                  required
                />
                <span className="text-[11px] text-stone-400 mt-1 block">Default for restaurant food in India is 5%</span>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  value={Math.round(settings.minOrderPaise / 100)}
                  onChange={e => setSettings(prev => ({ ...prev, minOrderPaise: Math.round(parseFloat(e.target.value || '0') * 100) }))}
                  className="input py-2 text-sm font-bold text-amber-400"
                  required
                />
                <span className="text-[11px] text-stone-400 mt-1 block">Orders below this amount cannot proceed to checkout</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center gap-4 pt-4 border-t border-stone-800">
          <button
            type="submit"
            className="btn-primary py-3 px-8 font-bold text-sm flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
          >
            <Save size={16} />
            <span>Save All Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
