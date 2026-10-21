export type OrderType = 'delivery' | 'pickup';

export type OrderStatus =
  | 'confirmed'
  | 'preparing'
  | 'assigned'
  | 'accepted'
  | 'picked_up'
  | 'out_for_delivery'
  | 'ready_for_pickup'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  id?: string;
  name: string;
  price: number; // in paise
  quantity: number;
  image_url?: string;
  is_veg?: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  type: OrderType;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  tax_amount: number;
  total_amount: number;
  payment_method: string;
  payment_status?: string;
  delivery_address?: {
    line1: string;
    landmark?: string;
    pincode: string;
    city: string;
  };
  items: OrderItem[];
  notes?: string;
  created_at: string;
  updated_at?: string;
  // Rider assignments (DELIVERY ONLY)
  rider_id?: string;
  rider_name?: string;
  rider_phone?: string;
  assigned_at?: string;
  accepted_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle_number: string;
  is_available: boolean;
}

export const INITIAL_RIDERS: Rider[] = [
  {
    id: 'usr-rider-1',
    name: 'Rajesh Kumar',
    phone: '+91 98201 12345',
    email: 'rider@nukkadnasta.in',
    vehicle_number: 'MH-01-AB-1234 (Honda Activa)',
    is_available: true,
  },
  {
    id: 'usr-rider-2',
    name: 'Amit Singh',
    phone: '+91 98202 67890',
    email: 'amit.rider@nukkadnasta.in',
    vehicle_number: 'MH-02-CD-5678 (TVS Jupiter)',
    is_available: true,
  },
  {
    id: 'usr-rider-3',
    name: 'Sunil Patil',
    phone: '+91 98203 45678',
    email: 'sunil.rider@nukkadnasta.in',
    vehicle_number: 'MH-01-EF-9012 (Hero Splendor)',
    is_available: true,
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-seed-1',
    order_number: 'NN-892341',
    user_id: 'usr-customer-1',
    customer_name: 'Aarav Mehta',
    customer_phone: '+91 98111 22334',
    customer_email: 'customer@nukkadnasta.in',
    type: 'delivery',
    status: 'assigned',
    subtotal: 32700,
    delivery_fee: 2900,
    tax_amount: 1635,
    total_amount: 37235,
    payment_method: 'cod',
    payment_status: 'pending',
    delivery_address: {
      line1: 'Flat 402, Prism Tower, Sector 44',
      landmark: 'Opposite Wave Mall',
      pincode: '201303',
      city: 'Noida',
    },
    items: [
      { name: 'Vada Pav', price: 6900, quantity: 2, is_veg: true },
      { name: 'Special Pav Bhaji', price: 18900, quantity: 1, is_veg: true },
    ],
    notes: 'Please bring change for ₹500',
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    rider_id: 'usr-rider-1',
    rider_name: 'Rajesh Kumar',
    rider_phone: '+91 98201 12345',
    assigned_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-seed-2',
    order_number: 'NN-654129',
    user_id: 'usr-customer-2',
    customer_name: 'Priya Sharma',
    customer_phone: '+91 98222 33445',
    customer_email: 'priya@example.com',
    type: 'pickup',
    status: 'ready_for_pickup',
    subtotal: 33800,
    delivery_fee: 0,
    tax_amount: 1690,
    total_amount: 35490,
    payment_method: 'upi',
    payment_status: 'paid',
    items: [
      { name: 'Mysore Masala Dosa', price: 16900, quantity: 2, is_veg: true },
    ],
    notes: 'Extra coconut chutney please',
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    // NOTE: Pickup orders NEVER have rider_id assigned!
  },
  {
    id: 'ord-seed-3',
    order_number: 'NN-542109',
    user_id: 'usr-customer-1',
    customer_name: 'Aarav Mehta',
    customer_phone: '+91 98111 22334',
    customer_email: 'customer@nukkadnasta.in',
    type: 'delivery',
    status: 'delivered',
    subtotal: 32900,
    delivery_fee: 0,
    tax_amount: 1645,
    total_amount: 34545,
    payment_method: 'online',
    payment_status: 'paid',
    delivery_address: {
      line1: 'Flat 402, Prism Tower, Sector 44',
      landmark: 'Opposite Wave Mall',
      pincode: '201303',
      city: 'Noida',
    },
    items: [
      { name: 'Chicken Dum Biryani', price: 32900, quantity: 1, is_veg: false },
    ],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    rider_id: 'usr-rider-1',
    rider_name: 'Rajesh Kumar',
    rider_phone: '+91 98201 12345',
    delivered_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000).toISOString(),
  },
];

const ORDERS_STORAGE_KEY = 'nukkad_orders_v2';
const RIDERS_STORAGE_KEY = 'nukkad_riders_v1';

export function getLiveOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveLiveOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('orders_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save orders:', err);
  }
}

export function getLiveRiders(): Rider[] {
  if (typeof window === 'undefined') return INITIAL_RIDERS;
  try {
    const raw = localStorage.getItem(RIDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(RIDERS_STORAGE_KEY, JSON.stringify(INITIAL_RIDERS));
      return INITIAL_RIDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_RIDERS;
  } catch {
    return INITIAL_RIDERS;
  }
}

export function saveLiveRiders(riders: Rider[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RIDERS_STORAGE_KEY, JSON.stringify(riders));
    window.dispatchEvent(new Event('riders_updated'));
  } catch (err) {
    console.error('Failed to save riders:', err);
  }
}

export function assignRiderToOrder(orderId: string, rider: Rider): Order[] {
  const orders = getLiveOrders();
  const updated = orders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        rider_id: rider.id,
        rider_name: rider.name,
        rider_phone: rider.phone,
        status: 'assigned' as OrderStatus,
        assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    return order;
  });
  saveLiveOrders(updated);
  return updated;
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus, extra?: Partial<Order>): Order[] {
  const orders = getLiveOrders();
  const updated = orders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        ...extra,
        status: newStatus,
        updated_at: new Date().toISOString(),
      };
    }
    return order;
  });
  saveLiveOrders(updated);
  return updated;
}
