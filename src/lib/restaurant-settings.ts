export interface DayHours {
  open: string;   // 'HH:mm' 24-hr format e.g. '08:00'
  close: string;  // 'HH:mm' 24-hr format e.g. '22:30'
  isClosed: boolean;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface RestaurantSettings {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  taxPercentage: number;
  minOrderPaise: number;
  isStoreOpenManual: boolean; // instant emergency toggle
  emergencyNotice: string;
  hours: Record<DayOfWeek, DayHours>;
}

export const DAYS_ORDER: { key: DayOfWeek; label: string; short: string }[] = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
];

export const DEFAULT_SETTINGS: RestaurantSettings = {
  name: 'Nukkad Nasta',
  tagline: 'Authentic Street Food, Delivered Fresh',
  phone: '+91 98765 43210',
  email: 'hello@nukkadnasta.in',
  address: '12, Food Street, Sector 18, Noida',
  pincode: '201301',
  taxPercentage: 5,
  minOrderPaise: 5000,
  isStoreOpenManual: true,
  emergencyNotice: '',
  hours: {
    monday:    { open: '08:00', close: '22:30', isClosed: false },
    tuesday:   { open: '08:00', close: '22:30', isClosed: false },
    wednesday: { open: '08:00', close: '22:30', isClosed: false },
    thursday:  { open: '08:00', close: '22:30', isClosed: false },
    friday:    { open: '08:00', close: '23:30', isClosed: false },
    saturday:  { open: '08:00', close: '23:30', isClosed: false },
    sunday:    { open: '09:00', close: '22:00', isClosed: false },
  },
};

const SETTINGS_KEY = 'nukkad_restaurant_settings_v1';

export function getLiveSettings(): RestaurantSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      hours: {
        ...DEFAULT_SETTINGS.hours,
        ...(parsed.hours || {}),
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveLiveSettings(settings: RestaurantSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('restaurant_settings_updated'));
  } catch (err) {
    console.error('Failed to save restaurant settings:', err);
  }
}

export function formatTime12(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

export function checkRestaurantOpenStatus(settings?: RestaurantSettings): {
  isOpen: boolean;
  statusText: string;
  badgeColor: string;
  todayScheduleText: string;
} {
  const currentSettings = settings || getLiveSettings();

  if (!currentSettings.isStoreOpenManual) {
    return {
      isOpen: false,
      statusText: currentSettings.emergencyNotice || 'Currently Paused (Manual Override)',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      todayScheduleText: 'Temporarily Closed',
    };
  }

  const now = new Date();
  const dayIndex = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  const dayMap: Record<number, DayOfWeek> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  };

  const todayKey = dayMap[dayIndex];
  const todayHours = currentSettings.hours[todayKey];

  if (!todayHours || todayHours.isClosed) {
    return {
      isOpen: false,
      statusText: 'Closed Today',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      todayScheduleText: 'Closed Today',
    };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = todayHours.open.split(':').map(Number);
  const [closeH, closeM] = todayHours.close.split(':').map(Number);

  const openMinutes = openH * 60 + openM;
  let closeMinutes = closeH * 60 + closeM;

  // Handle past midnight closing (e.g. 01:00 AM)
  if (closeMinutes <= openMinutes) {
    closeMinutes += 24 * 60;
  }

  const formattedOpen = formatTime12(todayHours.open);
  const formattedClose = formatTime12(todayHours.close);
  const todayScheduleText = `${formattedOpen} – ${formattedClose}`;

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      isOpen: true,
      statusText: `Open Now • Closes at ${formattedClose}`,
      badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      todayScheduleText,
    };
  } else if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      statusText: `Closed Now • Opens at ${formattedOpen}`,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      todayScheduleText,
    };
  } else {
    return {
      isOpen: false,
      statusText: `Closed for today • Opens tomorrow morning`,
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      todayScheduleText,
    };
  }
}
