export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number; // in paise (e.g. 6900 = ₹69)
  description: string;
  image_url: string;
  is_veg: boolean;
  spice_level: number; // 0, 1, 2, 3
  is_bestseller?: boolean;
  is_available: boolean;
}

export const INITIAL_MENU: MenuItem[] = [
  // Chaat & Street Food
  {
    id: 'm-1',
    name: 'Vada Pav',
    slug: 'vada-pav',
    category: 'chaat-street-food',
    price: 6900,
    description: 'Golden spiced batata vada inside butter-toasted pav with dry garlic chutney & fried green chillies',
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    is_veg: true,
    spice_level: 2,
    is_bestseller: true,
    is_available: true,
  },
  {
    id: 'm-2',
    name: 'Special Pav Bhaji',
    slug: 'pav-bhaji',
    category: 'chaat-street-food',
    price: 18900,
    description: 'Slow-cooked mashed vegetable curry blended with aromatic spices, topped with Amul butter & toasted pav',
    image_url: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80',
    is_veg: true,
    spice_level: 1,
    is_bestseller: true,
    is_available: true,
  },
  {
    id: 'm-3',
    name: 'Kolkata Pani Puri (Puchka)',
    slug: 'pani-puri',
    category: 'chaat-street-food',
    price: 9900,
    description: 'Eight crispy puris filled with spiced potato-chickpea masala, tangy mint jaljeera & sweet tamarind chutney',
    image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
    is_veg: true,
    spice_level: 2,
    is_bestseller: true,
    is_available: true,
  },
  {
    id: 'm-4',
    name: 'Dahi Sev Puri',
    slug: 'dahi-puri',
    category: 'chaat-street-food',
    price: 11900,
    description: 'Crisp puris layered with potatoes, chilled sweet curd, date-tamarind chutney, and roasted cumin powder',
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    is_veg: true,
    spice_level: 0,
    is_bestseller: false,
    is_available: true,
  },

  // Biryani & Rice
  {
    id: 'm-5',
    name: 'Hyderabadi Chicken Dum Biryani',
    slug: 'chicken-biryani',
    category: 'biryani-rice',
    price: 32900,
    description: 'Succulent marinated chicken dum-cooked with fragrant long-grain basmati rice, saffron, and fried onions',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    is_veg: false,
    spice_level: 2,
    is_bestseller: true,
    is_available: true,
  },
  {
    id: 'm-6',
    name: 'Royal Veg Dum Biryani',
    slug: 'veg-biryani',
    category: 'biryani-rice',
    price: 24900,
    description: 'Slow-simmered basmati rice with paneer cubes, garden vegetables, fresh mint and aromatic whole spices',
    image_url: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=800&q=80',
    is_veg: true,
    spice_level: 1,
    is_bestseller: false,
    is_available: true,
  },

  // South Indian & Breakfast
  {
    id: 'm-7',
    name: 'Crispy Butter Masala Dosa',
    slug: 'masala-dosa',
    category: 'dosas-idlis',
    price: 16900,
    description: 'Golden fermented rice-lentil crepe smeared with red chutney, stuffed with spiced mashed potato bhaji',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    is_veg: true,
    spice_level: 1,
    is_bestseller: true,
    is_available: true,
  },
  {
    id: 'm-8',
    name: 'Indori Kanda Poha',
    slug: 'indori-poha',
    category: 'breakfast-nashta',
    price: 8900,
    description: 'Light steamed flattened rice tossed with onions, crunchy peanuts, mustard seeds, and fresh lemon',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    is_veg: true,
    spice_level: 0,
    is_bestseller: true,
    is_available: true,
  },
  {
    id: 'm-9',
    name: 'Medu Vada with Sambar & Chutney',
    slug: 'medu-vada',
    category: 'breakfast-nashta',
    price: 12900,
    description: 'Crisp-on-the-outside, fluffy-on-the-inside black gram fritters served with piping hot drumstick sambar',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    is_veg: true,
    spice_level: 0,
    is_bestseller: false,
    is_available: true,
  },

  // Sandwiches & Wraps
  {
    id: 'm-10',
    name: 'Bombay Grilled Club Sandwich',
    slug: 'bombay-sandwich',
    category: 'sandwiches-wraps',
    price: 14900,
    description: 'Triple-decker toasted sandwich with beetroot, cucumber, tomato, spiced potato slice, and melted cheese',
    image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    is_veg: true,
    spice_level: 1,
    is_bestseller: true,
    is_available: true,
  },

  // Curries & Sabzis
  {
    id: 'm-11',
    name: 'Paneer Butter Masala',
    slug: 'paneer-butter-masala',
    category: 'curries-sabzis',
    price: 22900,
    description: 'Velvety cottage cheese cubes simmered in a luscious tomato-cashew cream gravy with dried fenugreek',
    image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    is_veg: true,
    spice_level: 1,
    is_bestseller: true,
    is_available: true,
  },
  {
    id: 'm-12',
    name: 'Dal Makhani',
    slug: 'dal-makhani',
    category: 'curries-sabzis',
    price: 19900,
    description: 'Whole black lentils and kidney beans slow-cooked overnight with country butter, ginger, and garlic',
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    is_veg: true,
    spice_level: 1,
    is_bestseller: false,
    is_available: true,
  },

  // Beverages & Coolers
  {
    id: 'm-13',
    name: 'Special Masala Cutting Chai',
    slug: 'masala-chai',
    category: 'beverages',
    price: 3900,
    description: 'Piping hot Indian tea infused with fresh crushed ginger, green cardamom, cinnamon, and whole milk',
    image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    is_veg: true,
    spice_level: 0,
    is_bestseller: true,
    is_available: true,
  },
  {
    id: 'm-14',
    name: 'Thick Punjabi Sweet Lassi',
    slug: 'sweet-lassi',
    category: 'beverages',
    price: 9900,
    description: 'Traditional churned fresh yogurt drink topped with a generous dollop of malai and cardamom essence',
    image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    is_veg: true,
    spice_level: 0,
    is_bestseller: true,
    is_available: true,
  },

  // Desserts
  {
    id: 'm-15',
    name: 'Hot Gulab Jamun (2 Pcs)',
    slug: 'gulab-jamun',
    category: 'desserts-sweets',
    price: 7900,
    description: 'Golden fried khoya dumplings soaked in fragrant rose-cardamom sugar syrup, served warm',
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    is_veg: true,
    spice_level: 0,
    is_bestseller: true,
    is_available: true,
  },
];

export const CATEGORIES_LIST = [
  { id: 'all', name: 'All Dishes', icon: '🍽️' },
  { id: 'breakfast-nashta', name: 'Breakfast & Nashta', icon: '🌅' },
  { id: 'chaat-street-food', name: 'Chaat & Street Food', icon: '🥙' },
  { id: 'sandwiches-wraps', name: 'Sandwiches & Wraps', icon: '🥪' },
  { id: 'dosas-idlis', name: 'Dosas & Idlis', icon: '🫓' },
  { id: 'biryani-rice', name: 'Biryani & Rice', icon: '🍚' },
  { id: 'curries-sabzis', name: 'Curries & Sabzis', icon: '🍛' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' },
  { id: 'desserts-sweets', name: 'Desserts & Sweets', icon: '🍮' },
];

export function getLiveMenu(): MenuItem[] {
  if (typeof window === 'undefined') return INITIAL_MENU;
  try {
    const custom = localStorage.getItem('nukkad_menu_custom');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_MENU;
}

export function saveLiveMenu(menu: MenuItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('nukkad_menu_custom', JSON.stringify(menu));
    window.dispatchEvent(new Event('storage'));
  } catch {}
}
