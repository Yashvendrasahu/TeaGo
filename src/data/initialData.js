/**
 * TeaGo - QR-Based Restaurant & Cafe Digital Ordering System
 * Authentic Cafe Menu, Tables, Real-time Orders & Rewards
 */

export const INITIAL_CATEGORIES = [
  { id: 'all', name: 'All Items', icon: 'Sparkles' },
  { id: 'tea', name: 'Artisanal Teas & Chai', icon: 'CupSoda' },
  { id: 'coffee', name: 'Hot & Cold Coffees', icon: 'Coffee' },
  { id: 'cold-beverages', name: 'Iced Brews & Shakes', icon: 'Ice' },
  { id: 'snacks', name: 'Quick Bites & Snacks', icon: 'Utensils' },
  { id: 'specials', name: 'Chef Special Combos', icon: 'Award' }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'tg-01',
    name: 'Special Kulhad Masala Chai',
    category: 'tea',
    categoryName: 'Artisanal Teas & Chai',
    price: 45,
    rating: 4.9,
    reviewsCount: 420,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    description: 'Slow-brewed Assam CTC leaves simmered with fresh crushed ginger, green cardamom, cloves, cinnamon, and fresh farm milk in an earthy clay kulhad.',
    tastingNotes: 'Rich spicy warmth, aromatic cardamom, creamy malt finish',
    origin: 'Assam & Malabar Spices',
    caffeineLevel: 'Medium',
    caffeineMg: 40,
    calories: 110,
    isBestseller: true,
    isNew: false,
    isAvailable: true,
    prepTime: '4-5 mins',
    dietaryTags: ['Vegetarian', 'Authentic Kulhad', 'Fresh Milk'],
    defaultOptions: {
      size: 'Regular (Kulhad)',
      sugar: 'Normal Sugar',
      temperature: 'Hot (Steaming)',
      addOns: []
    }
  },
  {
    id: 'tg-02',
    name: 'Adrak Elaichi Kadak Chai',
    category: 'tea',
    categoryName: 'Artisanal Teas & Chai',
    price: 40,
    rating: 4.85,
    reviewsCount: 310,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80',
    description: 'Double-boiled strong tea infused with freshly grated organic ginger roots and hand-crushed green cardamom pods.',
    tastingNotes: 'Sharp ginger zing, sweet cardamom aroma, strong robust body',
    origin: 'Darjeeling & Coorg Cardamom',
    caffeineLevel: 'High',
    caffeineMg: 55,
    calories: 95,
    isBestseller: true,
    isNew: false,
    isAvailable: true,
    prepTime: '3-4 mins',
    dietaryTags: ['Vegetarian', 'Immunity Booster'],
    defaultOptions: {
      size: 'Regular (150ml)',
      sugar: 'Normal Sugar',
      temperature: 'Hot (Steaming)',
      addOns: []
    }
  },
  {
    id: 'tg-03',
    name: 'Kashmiri Saffron Kahwa',
    category: 'tea',
    categoryName: 'Artisanal Teas & Chai',
    price: 75,
    rating: 4.95,
    reviewsCount: 180,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=600&q=80',
    description: 'Exquisite Kashmiri green tea steeped with pure Pampore saffron strands, cinnamon bark, and garnished with slivered almonds.',
    tastingNotes: 'Golden saffron nectar, toasted almond crunch, delicate floral spice',
    origin: 'Pampore, Kashmir',
    caffeineLevel: 'Low',
    caffeineMg: 20,
    calories: 60,
    isBestseller: false,
    isNew: true,
    isAvailable: true,
    prepTime: '5-6 mins',
    dietaryTags: ['Vegan', 'Dairy-Free', 'Royal Blend'],
    defaultOptions: {
      size: 'Regular (180ml)',
      sugar: 'Wild Blossom Honey',
      temperature: 'Hot (Steaming)',
      addOns: ['Extra Saffron Strands']
    }
  },
  {
    id: 'tg-04',
    name: 'Classic South Indian Filter Coffee',
    category: 'coffee',
    categoryName: 'Hot & Cold Coffees',
    price: 60,
    rating: 4.92,
    reviewsCount: 295,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    description: 'Traditional 80:20 Arabica-Chicory decoction freshly dripped through a brass filter, frothed with boiled whole milk in a traditional Davarah tumbler.',
    tastingNotes: 'Intense roasted cocoa, velvety froth, deep caramelized chicory',
    origin: 'Chikmagalur & Wayanad',
    caffeineLevel: 'High',
    caffeineMg: 75,
    calories: 120,
    isBestseller: true,
    isNew: false,
    isAvailable: true,
    prepTime: '4-5 mins',
    dietaryTags: ['Vegetarian', 'Brass Davarah Served'],
    defaultOptions: {
      size: 'Davarah Glass (160ml)',
      sugar: 'Normal Sugar',
      temperature: 'Hot (Steaming)',
      addOns: []
    }
  },
  {
    id: 'tg-05',
    name: 'Artisan Creamy Cappuccino',
    category: 'coffee',
    categoryName: 'Hot & Cold Coffees',
    price: 90,
    rating: 4.88,
    reviewsCount: 240,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
    description: 'Double shot of freshly ground dark-roast espresso topped with thick micro-foam steamed milk and dusted with Belgian dark cocoa.',
    tastingNotes: 'Bittersweet dark chocolate, nutty crema, silky milk foam',
    origin: 'Estate Arabica Beans',
    caffeineLevel: 'High',
    caffeineMg: 85,
    calories: 140,
    isBestseller: false,
    isNew: false,
    isAvailable: true,
    prepTime: '4 mins',
    dietaryTags: ['Vegetarian', 'Latte Art'],
    defaultOptions: {
      size: 'Medium (250ml)',
      sugar: 'Normal Sugar',
      temperature: 'Hot (Steaming)',
      addOns: []
    }
  },
  {
    id: 'tg-06',
    name: 'Signature Thick Cold Coffee',
    category: 'cold-beverages',
    categoryName: 'Iced Brews & Shakes',
    price: 110,
    rating: 4.94,
    reviewsCount: 380,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    description: 'Rich blended espresso shake with creamy vanilla bean gelato, chilled milk, and swirls of decadent chocolate fudge syrup.',
    tastingNotes: 'Creamy mocha, frozen vanilla, rich chocolate drizzle',
    origin: 'House Special Recipe',
    caffeineLevel: 'Medium',
    caffeineMg: 50,
    calories: 280,
    isBestseller: true,
    isNew: false,
    isAvailable: true,
    prepTime: '3-4 mins',
    dietaryTags: ['Vegetarian', 'Ice Cream Scoop'],
    defaultOptions: {
      size: 'Large (350ml)',
      sugar: 'Normal Sugar',
      temperature: 'Cold (Chilled)',
      addOns: ['Chocolate Drizzle']
    }
  },
  {
    id: 'tg-07',
    name: 'Fresh Lemon Mint Iced Tea',
    category: 'cold-beverages',
    categoryName: 'Iced Brews & Shakes',
    price: 80,
    rating: 4.8,
    reviewsCount: 165,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    description: 'Nilgiri cold-brewed black tea shaken over ice with fresh garden mint leaves, freshly squeezed yellow lemon juice, and pure cane syrup.',
    tastingNotes: 'Zesty citrus punch, cooling wild mint, crisp clean finish',
    origin: 'Nilgiri Hills',
    caffeineLevel: 'Low',
    caffeineMg: 25,
    calories: 85,
    isBestseller: false,
    isNew: true,
    isAvailable: true,
    prepTime: '3 mins',
    dietaryTags: ['Vegan', 'Dairy-Free', 'Refreshing'],
    defaultOptions: {
      size: 'Large (350ml)',
      sugar: 'Less Sugar',
      temperature: 'Cold (Chilled)',
      addOns: []
    }
  },
  {
    id: 'tg-08',
    name: 'Crispy Samosa with Mint Chutney (2 Pcs)',
    category: 'snacks',
    categoryName: 'Quick Bites & Snacks',
    price: 50,
    rating: 4.9,
    reviewsCount: 510,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    description: 'Golden-fried pastry pockets stuffed with spiced potatoes, green peas, roasted cashews, served with tangy tamarind and spicy mint coriander dip.',
    tastingNotes: 'Crispy flaky crust, savory cumin-coriander spiced filling',
    origin: 'Fresh Kitchen Fry',
    caffeineLevel: 'None',
    caffeineMg: 0,
    calories: 260,
    isBestseller: true,
    isNew: false,
    isAvailable: true,
    prepTime: '5-7 mins',
    dietaryTags: ['Vegetarian', 'Hot & Fresh', 'Chef Special'],
    defaultOptions: {
      size: 'Standard Plate (2 Pcs)',
      sugar: 'No Sugar',
      temperature: 'Hot (Crispy)',
      addOns: ['Extra Mint Chutney']
    }
  },
  {
    id: 'tg-09',
    name: 'Irani Maska Bun with Chai Dip',
    category: 'snacks',
    categoryName: 'Quick Bites & Snacks',
    price: 45,
    rating: 4.88,
    reviewsCount: 340,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80',
    description: 'Ultra-soft sweet bakery bun generously slathered with salted Amul butter and sweet tutti-frutti, toasted lightly to perfection.',
    tastingNotes: 'Melt-in-mouth soft bread, salted butter richness, subtle sweetness',
    origin: 'Artisan Bakery',
    caffeineLevel: 'None',
    caffeineMg: 0,
    calories: 210,
    isBestseller: true,
    isNew: false,
    isAvailable: true,
    prepTime: '2-3 mins',
    dietaryTags: ['Vegetarian', 'Comfort Classic'],
    defaultOptions: {
      size: '1 Bun (4 Slices)',
      sugar: 'Normal Sugar',
      temperature: 'Warm (Toasted)',
      addOns: []
    }
  },
  {
    id: 'tg-10',
    name: 'Grilled Cheese Corn Sandwich',
    category: 'snacks',
    categoryName: 'Quick Bites & Snacks',
    price: 110,
    rating: 4.86,
    reviewsCount: 220,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    description: 'Triple-layer jumbo bread filled with sweet American corn kernels, melted mozzarella, crunchy bell peppers, and signature herb seasoning.',
    tastingNotes: 'Gooey cheese pull, sweet crunchy corn, buttery toasted crust',
    origin: 'Fresh Cafe Grill',
    caffeineLevel: 'None',
    caffeineMg: 0,
    calories: 320,
    isBestseller: false,
    isNew: true,
    isAvailable: true,
    prepTime: '7-9 mins',
    dietaryTags: ['Vegetarian', 'Double Cheese'],
    defaultOptions: {
      size: 'Jumbo 4 Triangles',
      sugar: 'No Sugar',
      temperature: 'Hot (Grilled)',
      addOns: ['Extra Mozzarella Cheese']
    }
  },
  {
    id: 'tg-11',
    name: 'Crispy Paneer Pakoda Platter',
    category: 'snacks',
    categoryName: 'Quick Bites & Snacks',
    price: 95,
    rating: 4.82,
    reviewsCount: 190,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
    description: 'Fresh malai cottage cheese cubes marinated in ajwain and chaat masala, coated in seasoned chickpea batter and fried crisp.',
    tastingNotes: 'Soft paneer center, crunchy spiced batter, tangy chaat masala',
    origin: 'Fresh Kitchen Fry',
    caffeineLevel: 'None',
    caffeineMg: 0,
    calories: 290,
    isBestseller: false,
    isNew: false,
    isAvailable: true,
    prepTime: '6-8 mins',
    dietaryTags: ['Vegetarian', 'High Protein'],
    defaultOptions: {
      size: '6 Big Pieces',
      sugar: 'No Sugar',
      temperature: 'Hot (Crispy)',
      addOns: []
    }
  },
  {
    id: 'tg-12',
    name: 'Monsoon Chai & Pakoda Table Combo',
    category: 'specials',
    categoryName: 'Chef Special Combos',
    price: 130,
    rating: 4.96,
    reviewsCount: 310,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    description: '2 Cups of Special Kulhad Masala Chai + 1 Plate Hot Mix Pakodas (Paneer & Onion) + 2 Crispy Samosas with Chutney Trio.',
    tastingNotes: 'The ultimate Indian cafe dining experience to share at your table',
    origin: 'Signature Pairing',
    caffeineLevel: 'Medium',
    caffeineMg: 40,
    calories: 480,
    isBestseller: true,
    isNew: true,
    isAvailable: true,
    prepTime: '6-8 mins',
    dietaryTags: ['Vegetarian', 'Sharing Platter (2-3 Persons)', 'Value Combo'],
    defaultOptions: {
      size: 'Sharing Combo for 2',
      sugar: 'Normal Sugar',
      temperature: 'Hot (Freshly Prepared)',
      addOns: []
    }
  }
];

export const PRESET_FOOD_IMAGES = [
  { name: 'Kulhad Masala Chai', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', category: 'tea' },
  { name: 'Adrak Kadak Chai', url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80', category: 'tea' },
  { name: 'Saffron Kahwa', url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=600&q=80', category: 'tea' },
  { name: 'Green Tea Kettle', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', category: 'tea' },
  { name: 'Matcha Latte', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80', category: 'tea' },
  { name: 'South Indian Filter Coffee', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', category: 'coffee' },
  { name: 'Hot Cappuccino', url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80', category: 'coffee' },
  { name: 'Dark Espresso', url: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80', category: 'coffee' },
  { name: 'Creamy Cold Coffee', url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80', category: 'cold-beverages' },
  { name: 'Lemon Mint Iced Tea', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80', category: 'cold-beverages' },
  { name: 'Mango Smoothie Shake', url: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80', category: 'cold-beverages' },
  { name: 'Crispy Samosa Plate', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', category: 'snacks' },
  { name: 'Irani Maska Bun', url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80', category: 'snacks' },
  { name: 'Grilled Cheese Sandwich', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', category: 'snacks' },
  { name: 'Crispy Paneer Pakoda', url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80', category: 'snacks' },
  { name: 'Chai & Snacks Combo', url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80', category: 'specials' }
];

export const CUSTOMIZATION_OPTIONS = {
  sizes: [
    { name: 'Regular Cup', price: 0, volume: '150ml - 200ml' },
    { name: 'Large Mug', price: 20, volume: '300ml - 350ml' },
    { name: 'Table Kettle (Serves 3)', price: 60, volume: '600ml Sharing Pot' }
  ],
  sugars: [
    { name: 'No Sugar (Sugar-Free)', price: 0 },
    { name: 'Less Sugar (30%)', price: 0 },
    { name: 'Normal Sugar (Standard)', price: 0 },
    { name: 'Extra Sugar (100%)', price: 0 },
    { name: 'Organic Jaggery (Gur)', price: 10 },
    { name: 'Wild Blossom Honey', price: 15 }
  ],
  temperatures: [
    { name: 'Hot (Steaming Cup)', icon: 'Flame' },
    { name: 'Warm (Comfort Drink)', icon: 'Sun' },
    { name: 'Cold (Chilled over Ice)', icon: 'Snowflake' }
  ],
  milkTypes: [
    { name: 'Fresh Full Cream Milk', price: 0 },
    { name: 'Cow Toned Milk (Light)', price: 0 },
    { name: 'Oat Milk (Plant-based)', price: 25 },
    { name: 'Black (No Milk Brew)', price: 0 }
  ],
  addOns: [
    { id: 'add-1', name: 'Extra Crushed Ginger (Adrak)', price: 5 },
    { id: 'add-2', name: 'Extra Green Cardamom (Elaichi)', price: 5 },
    { id: 'add-3', name: 'Extra Malai Cream Layer', price: 10 },
    { id: 'add-4', name: 'Extra Mozzarella Cheese', price: 25 },
    { id: 'add-5', name: 'Extra Mint & Tamarind Chutney', price: 10 },
    { id: 'add-6', name: 'Single Scoop Vanilla Gelato', price: 30 }
  ]
};

export const INITIAL_TABLES = [
  { id: '01', number: '01', capacity: 2, status: 'available', activeOrderId: null, section: 'Window Corner' },
  { id: '02', number: '02', capacity: 2, status: 'occupied', activeOrderId: null, section: 'Window Corner' },
  { id: '03', number: '03', capacity: 4, status: 'order_active', activeOrderId: 'TG-1021', section: 'Main Hall' },
  { id: '04', number: '04', capacity: 4, status: 'available', activeOrderId: null, section: 'Main Hall' },
  { id: '05', number: '05', capacity: 6, status: 'available', activeOrderId: null, section: 'Family Booth' },
  { id: '06', number: '06', capacity: 2, status: 'occupied', activeOrderId: null, section: 'Garden Terrace' },
  { id: '07', number: '07', capacity: 4, status: 'order_active', activeOrderId: 'TG-1024', section: 'Garden Terrace' },
  { id: '08', number: '08', capacity: 4, status: 'available', activeOrderId: null, section: 'Main Hall' },
  { id: '09', number: '09', capacity: 6, status: 'available', activeOrderId: null, section: 'Family Booth' },
  { id: '10', number: '10', capacity: 2, status: 'available', activeOrderId: null, section: 'Bar Counter' },
  { id: '11', number: '11', capacity: 2, status: 'available', activeOrderId: null, section: 'Bar Counter' },
  { id: '12', number: '12', capacity: 4, status: 'available', activeOrderId: null, section: 'Main Hall' },
  { id: '13', number: '13', capacity: 4, status: 'available', activeOrderId: null, section: 'Main Hall' },
  { id: '14', number: '14', capacity: 8, status: 'available', activeOrderId: null, section: 'Private Lounge' },
  { id: '15', number: '15', capacity: 4, status: 'available', activeOrderId: null, section: 'Garden Terrace' },
  { id: '16', number: '16', capacity: 2, status: 'available', activeOrderId: null, section: 'Garden Terrace' },
  { id: '17', number: '17', capacity: 4, status: 'available', activeOrderId: null, section: 'Main Hall' },
  { id: '18', number: '18', capacity: 4, status: 'available', activeOrderId: null, section: 'Main Hall' },
  { id: '19', number: '19', capacity: 6, status: 'available', activeOrderId: null, section: 'Family Booth' },
  { id: '20', number: '20', capacity: 4, status: 'available', activeOrderId: null, section: 'Main Hall' }
];

export const INITIAL_ORDERS = [
  {
    id: 'TG-1024',
    tableNumber: '07',
    date: '2026-10-04T08:30:00.000Z',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98765 43210',
    orderType: 'Dine-in (Table 07)',
    items: [
      {
        id: 'tg-01',
        name: 'Special Kulhad Masala Chai',
        price: 45,
        quantity: 2,
        options: {
          size: 'Regular (Kulhad)',
          sugar: 'Normal Sugar',
          temperature: 'Hot (Steaming)',
          addOns: ['Extra Crushed Ginger (Adrak)']
        },
        itemTotal: 100
      },
      {
        id: 'tg-08',
        name: 'Crispy Samosa with Mint Chutney (2 Pcs)',
        price: 50,
        quantity: 1,
        options: {
          size: 'Standard Plate (2 Pcs)',
          sugar: 'No Sugar',
          temperature: 'Hot (Crispy)',
          addOns: []
        },
        itemTotal: 50
      },
      {
        id: 'tg-05',
        name: 'Artisan Creamy Cappuccino',
        price: 90,
        quantity: 1,
        options: {
          size: 'Medium (250ml)',
          sugar: 'Normal Sugar',
          temperature: 'Hot (Steaming)',
          addOns: []
        },
        itemTotal: 90
      }
    ],
    subtotal: 240,
    tax: 12,
    discount: 0,
    total: 252,
    status: 'preparing', // 'placed' -> 'accepted' -> 'preparing' -> 'ready' -> 'delivered' -> 'cancelled'
    estimatedPrepTime: '4–5 minutes',
    kitchenNotes: 'Please serve tea extra hot in fresh clay kulhads.',
    timeline: [
      { status: 'placed', title: 'Order Placed from Table 07', time: '8:30 AM', completed: true },
      { status: 'accepted', title: 'Order Accepted by Kitchen', time: '8:31 AM', completed: true },
      { status: 'preparing', title: 'Master Brewer Steeping & Frying', time: '8:33 AM', completed: true },
      { status: 'ready', title: 'Ready on Kitchen Counter', time: 'Est. 8:36 AM', completed: false },
      { status: 'delivered', title: 'Delivered to Table 07 by Staff', time: 'Est. 8:37 AM', completed: false }
    ]
  },
  {
    id: 'TG-1021',
    tableNumber: '03',
    date: '2026-10-04T08:15:00.000Z',
    customerName: 'Pooja Verma',
    customerPhone: '+91 98111 22334',
    orderType: 'Dine-in (Table 03)',
    items: [
      {
        id: 'tg-06',
        name: 'Signature Thick Cold Coffee',
        price: 110,
        quantity: 2,
        options: {
          size: 'Large (350ml)',
          sugar: 'Normal Sugar',
          temperature: 'Cold (Chilled)',
          addOns: []
        },
        itemTotal: 220
      },
      {
        id: 'tg-10',
        name: 'Grilled Cheese Corn Sandwich',
        price: 110,
        quantity: 1,
        options: {
          size: 'Jumbo 4 Triangles',
          sugar: 'No Sugar',
          temperature: 'Hot (Grilled)',
          addOns: ['Extra Mozzarella Cheese']
        },
        itemTotal: 135
      }
    ],
    subtotal: 355,
    tax: 17.75,
    discount: 10, // Applied ₹10 completed order reward
    total: 362.75,
    status: 'ready',
    estimatedPrepTime: '1-2 minutes',
    kitchenNotes: 'Extra crispy sandwich please.',
    timeline: [
      { status: 'placed', title: 'Order Placed from Table 03', time: '8:15 AM', completed: true },
      { status: 'accepted', title: 'Accepted by Kitchen', time: '8:16 AM', completed: true },
      { status: 'preparing', title: 'Grilled & Blended', time: '8:18 AM', completed: true },
      { status: 'ready', title: 'Ready! Staff bringing to Table 03', time: '8:23 AM', completed: true },
      { status: 'delivered', title: 'Delivered to Table 03', time: 'Pending Delivery', completed: false }
    ]
  },
  {
    id: 'TG-1015',
    tableNumber: '07',
    date: '2026-10-02T16:20:00.000Z',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98765 43210',
    orderType: 'Dine-in (Table 07)',
    items: [
      {
        id: 'tg-02',
        name: 'Adrak Elaichi Kadak Chai',
        price: 40,
        quantity: 2,
        options: { size: 'Regular (150ml)', sugar: 'Normal Sugar', temperature: 'Hot', addOns: [] },
        itemTotal: 80
      },
      {
        id: 'tg-09',
        name: 'Irani Maska Bun with Chai Dip',
        price: 45,
        quantity: 2,
        options: { size: '1 Bun', sugar: 'Normal', temperature: 'Warm', addOns: [] },
        itemTotal: 90
      }
    ],
    subtotal: 170,
    tax: 8.5,
    discount: 0,
    total: 178.5,
    status: 'delivered',
    estimatedPrepTime: 'Delivered',
    timeline: [
      { status: 'placed', title: 'Order Placed', time: '4:20 PM', completed: true },
      { status: 'accepted', title: 'Accepted', time: '4:21 PM', completed: true },
      { status: 'preparing', title: 'Prepared', time: '4:23 PM', completed: true },
      { status: 'ready', title: 'Ready', time: '4:26 PM', completed: true },
      { status: 'delivered', title: 'Delivered to Table 07', time: '4:28 PM', completed: true }
    ]
  }
];

export const INITIAL_USER = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  phone: '+91 98765 43210',
  currentTable: '07',
  completedOrdersCount: 7, // 7 out of 10 completed towards free ₹10 reward
  requiredOrdersForReward: 10,
  unlockedRewards: [
    {
      id: 'rew-1',
      title: '₹10 FREE ORDER REWARD',
      discountAmount: 10,
      code: 'TABLE10FREE',
      isUnlocked: true,
      isRedeemed: false,
      desc: 'Valid on your current or next dining table order'
    }
  ],
  favoriteProductIds: ['tg-01', 'tg-04', 'tg-08', 'tg-06']
};

export const INITIAL_CUSTOMERS = [
  { id: 'c-1', name: 'Aarav Sharma', phone: '+91 98765 43210', visitsCount: 8, completedOrders: 7, totalSpent: 1240, lastTable: 'Table 07', tier: 'Regular Diner' },
  { id: 'c-2', name: 'Pooja Verma', phone: '+91 98111 22334', visitsCount: 14, completedOrders: 13, totalSpent: 2890, lastTable: 'Table 03', tier: 'Chai Connoisseur' },
  { id: 'c-3', name: 'Rohan Gupta', phone: '+91 97654 32109', visitsCount: 5, completedOrders: 5, totalSpent: 850, lastTable: 'Table 12', tier: 'Cafe Explorer' },
  { id: 'c-4', name: 'Ananya Iyer', phone: '+91 98222 33445', visitsCount: 22, completedOrders: 20, totalSpent: 4320, lastTable: 'Table 05', tier: 'VIP Patron' }
];

export const INITIAL_SETTINGS = {
  restaurantName: 'TeaGo Cafe & Artisanal Roastery',
  tagline: 'Scan. Order. Relax.',
  currencySymbol: '₹',
  avgPreparationMinutes: 5,
  taxRatePercent: 5.0, // 5% GST for restaurant dining
  isAcceptingOrders: true,
  autoAcceptOrders: false,
  announcementText: '☕ Fresh Kulhad Chai, Filter Coffee & Hot Samosas prepared to order at your table.',
  wifiName: 'TeaGo_Guest_HighSpeed',
  wifiPassword: 'teagocafeguest'
};
