import { createClient } from '@supabase/supabase-js';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_TABLES,
  INITIAL_CUSTOMERS,
  INITIAL_SETTINGS,
  INITIAL_USER
} from '../src/data/initialData.js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false
      }
    })
  : null;

// In-memory fallback database for fast and reliable operation
const memoryDb = {
  products: [...INITIAL_PRODUCTS],
  orders: [...INITIAL_ORDERS],
  tables: [...INITIAL_TABLES],
  customers: [...INITIAL_CUSTOMERS],
  settings: { ...INITIAL_SETTINGS },
  users: [
    {
      id: INITIAL_USER.id || 'usr-default',
      email: INITIAL_USER.email || 'diner@teago.com',
      name: INITIAL_USER.name || 'Aarav Sharma',
      phone: INITIAL_USER.phone || '+91 98765 43210',
      role: 'customer',
      loyaltyTier: INITIAL_USER.loyaltyTier || 'Silver Member',
      completedOrdersCount: INITIAL_USER.completedOrdersCount || 8,
      unlockedRewards: INITIAL_USER.unlockedRewards || [],
      favoriteProductIds: INITIAL_USER.favoriteProductIds || ['tg-01', 'tg-04']
    },
    {
      id: 'usr-admin-01',
      email: 'admin@teago.com',
      name: 'Restaurant Chef & Admin',
      phone: '+91 98000 11122',
      role: 'admin',
      loyaltyTier: 'Kitchen Staff',
      completedOrdersCount: 99,
      unlockedRewards: [],
      favoriteProductIds: []
    }
  ],
  storage: {} // in-memory storage fallback
};

export const SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- TeaGo Artisanal Boba & Tea Bar - Supabase Database, Auth & Storage Schema
-- ==============================================================================

-- 1. Create Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT DEFAULT 'Tea Lover',
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer',
  loyalty_tier TEXT DEFAULT 'Silver Member',
  completed_orders_count INTEGER DEFAULT 0,
  unlocked_rewards JSONB DEFAULT '[]',
  favorite_product_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone, role, loyalty_tier, completed_orders_count, unlocked_rewards, favorite_product_ids)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    'Silver Member',
    0,
    '[{"id":"rew-welcome","title":"₹10 Welcome Voucher","discountAmount":10,"code":"WELCOME10","isUnlocked":true,"isRedeemed":false,"desc":"Welcome Gift for table orders!"}]'::jsonb,
    '{}'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_name TEXT,
  price NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  is_veg BOOLEAN DEFAULT true,
  image TEXT,
  description TEXT,
  tasting_notes TEXT,
  origin TEXT,
  caffeine_level TEXT,
  caffeine_mg INTEGER,
  calories INTEGER,
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  prep_time TEXT DEFAULT '4-5 mins',
  dietary_tags TEXT[] DEFAULT '{}',
  default_options JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  table_number TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  order_type TEXT DEFAULT 'Dine-in',
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'placed',
  estimated_prep_time TEXT DEFAULT '4-5 minutes',
  kitchen_notes TEXT,
  timeline JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Restaurant Tables Table
CREATE TABLE IF NOT EXISTS public.restaurant_tables (
  number TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  seats INTEGER DEFAULT 4,
  zone TEXT DEFAULT 'Indoor Lounge',
  status TEXT DEFAULT 'available',
  active_order_id TEXT,
  qr_code_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Settings Table
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  restaurant_name TEXT DEFAULT 'TeaGo Artisanal Cafe',
  tagline TEXT DEFAULT 'Authentic Kadak Chai, Handcrafted Coffees & Quick Bites',
  announcement_text TEXT DEFAULT '✨ Welcome to TeaGo! Complete 10 orders to unlock ₹10 FREE ORDER Reward!',
  currency TEXT DEFAULT '₹',
  tax_rate_percent NUMERIC DEFAULT 5.0,
  service_charge_percent NUMERIC DEFAULT 0,
  opening_time TEXT DEFAULT '08:00 AM',
  closing_time TEXT DEFAULT '11:00 PM',
  is_accepting_orders BOOLEAN DEFAULT true,
  auto_accept_orders BOOLEAN DEFAULT true,
  kitchen_printer_connected BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  total_orders INTEGER DEFAULT 1,
  total_spent NUMERIC DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'Silver',
  favorite_drink TEXT,
  last_visit TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- SUPABASE STORAGE BUCKET CREATION & POLICIES ('menu-images')
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-images',
  'menu-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for menu-images
DROP POLICY IF EXISTS "Public Access to Menu Images" ON storage.objects;
CREATE POLICY "Public Access to Menu Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Allow Upload to Menu Images" ON storage.objects;
CREATE POLICY "Allow Upload to Menu Images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Allow Update to Menu Images" ON storage.objects;
CREATE POLICY "Allow Update to Menu Images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Allow Delete from Menu Images" ON storage.objects;
CREATE POLICY "Allow Delete from Menu Images"
ON storage.objects FOR DELETE
USING (bucket_id = 'menu-images');

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow public all products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow public all orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow public all tables" ON public.restaurant_tables FOR ALL USING (true);
CREATE POLICY "Allow public all settings" ON public.restaurant_settings FOR ALL USING (true);
CREATE POLICY "Allow public all customers" ON public.customers FOR ALL USING (true);
`;

// Helper data access methods
export const db = {
  // SUPABASE STORAGE
  async uploadImage(base64Data, originalName = 'product-image.jpg', bucketName = 'menu-images') {
    const timestamp = Date.now();
    const cleanFileName = `${timestamp}-${(originalName || 'image.jpg').replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    if (supabase) {
      try {
        // Ensure bucket exists or handle upload
        const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let mimeType = 'image/jpeg';
        let buffer;

        if (matches && matches.length === 3) {
          mimeType = matches[1];
          buffer = Buffer.from(matches[2], 'base64');
        } else {
          buffer = Buffer.from(base64Data, 'base64');
        }

        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(cleanFileName, buffer, {
            contentType: mimeType,
            upsert: true
          });

        if (!error && data) {
          const { data: publicData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(cleanFileName);

          return {
            success: true,
            url: publicData?.publicUrl || base64Data,
            fileName: cleanFileName,
            storageType: 'supabase-bucket'
          };
        } else {
          console.warn('Supabase storage upload error:', error?.message);
        }
      } catch (err) {
        console.warn('Storage upload exception:', err.message);
      }
    }

    // Resilient fallback: store in memory and return data URI
    memoryDb.storage[cleanFileName] = base64Data;
    return {
      success: true,
      url: base64Data,
      fileName: cleanFileName,
      storageType: 'memory-fallback'
    };
  },

  // AUTHENTICATION & PROFILES
  async signUp({ email, password, name, phone }) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = name || cleanEmail.split('@')[0] || 'Tea Lover';
    const cleanPhone = phone || '';

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { name: cleanName, phone: cleanPhone, role: 'customer' }
          }
        });

        if (!error && data?.user) {
          // Ensure profile exists in profiles table
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              email: cleanEmail,
              name: cleanName,
              phone: cleanPhone,
              role: 'customer',
              loyalty_tier: 'Silver Member',
              completed_orders_count: 0,
              unlocked_rewards: [
                {
                  id: `rew-${Date.now()}`,
                  title: '₹10 Welcome Gift',
                  discountAmount: 10,
                  code: 'WELCOME10',
                  isUnlocked: true,
                  isRedeemed: false,
                  desc: 'Welcome voucher for your first self-order!'
                }
              ],
              favorite_product_ids: []
            });
          } catch (profErr) {
            console.warn('Profile upsert warning:', profErr.message);
          }

          return {
            success: true,
            user: {
              id: data.user.id,
              email: data.user.email,
              name: cleanName,
              phone: cleanPhone,
              role: 'customer',
              loyaltyTier: 'Silver Member',
              completedOrdersCount: 0,
              unlockedRewards: [
                {
                  id: `rew-${Date.now()}`,
                  title: '₹10 Welcome Gift',
                  discountAmount: 10,
                  code: 'WELCOME10',
                  isUnlocked: true,
                  isRedeemed: false,
                  desc: 'Welcome voucher for your first self-order!'
                }
              ],
              favoriteProductIds: []
            },
            session: data.session
          };
        }

        // If email rate limit is exceeded or email confirmation is pending
        if (error && (error.message?.includes('rate limit') || error.message?.includes('email'))) {
          console.warn('Supabase email rate limit triggered, creating direct customer profile:', error.message);
          const fallbackId = `usr-${Date.now()}`;
          const fallbackUser = {
            id: fallbackId,
            email: cleanEmail,
            name: cleanName,
            phone: cleanPhone,
            role: 'customer',
            loyaltyTier: 'Silver Member',
            completedOrdersCount: 0,
            unlockedRewards: [
              {
                id: `rew-${Date.now()}`,
                title: '₹10 Welcome Gift',
                discountAmount: 10,
                code: 'WELCOME10',
                isUnlocked: true,
                isRedeemed: false,
                desc: 'Welcome voucher for your first self-order!'
              }
            ],
            favoriteProductIds: []
          };

          // Save to memory
          memoryDb.users.push(fallbackUser);

          return {
            success: true,
            user: fallbackUser,
            session: { token: `mem-token-${Date.now()}` }
          };
        }

        return { success: false, error: error?.message || 'Sign up failed' };
      } catch (err) {
        console.warn('Supabase auth signUp exception:', err.message);
        
        // Handle rate limit exception gracefully
        if (err.message?.includes('rate limit') || err.message?.includes('email')) {
          const fallbackUser = {
            id: `usr-${Date.now()}`,
            email: cleanEmail,
            name: cleanName,
            phone: cleanPhone,
            role: 'customer',
            loyaltyTier: 'Silver Member',
            completedOrdersCount: 0,
            unlockedRewards: [
              {
                id: `rew-${Date.now()}`,
                title: '₹10 Welcome Gift',
                discountAmount: 10,
                code: 'WELCOME10',
                isUnlocked: true,
                isRedeemed: false,
                desc: 'Welcome voucher for your first self-order!'
              }
            ],
            favoriteProductIds: []
          };
          memoryDb.users.push(fallbackUser);
          return {
            success: true,
            user: fallbackUser,
            session: { token: `mem-token-${Date.now()}` }
          };
        }

        return { success: false, error: err.message };
      }
    }

    // In-memory fallback auth
    const newUser = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      name: cleanName,
      phone: cleanPhone,
      role: 'customer',
      loyaltyTier: 'Silver Member',
      completedOrdersCount: 0,
      unlockedRewards: [
        {
          id: `rew-${Date.now()}`,
          title: '₹10 Welcome Gift',
          discountAmount: 10,
          code: 'WELCOME10',
          isUnlocked: true,
          isRedeemed: false,
          desc: 'Welcome voucher for your first self-order!'
        }
      ],
      favoriteProductIds: []
    };
    memoryDb.users.push(newUser);
    return { success: true, user: newUser, session: { token: `mem-token-${Date.now()}` } };
  },

  async signIn({ email, password }) {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (error) {
          return {
            success: false,
            error: error.message === 'Invalid login credentials'
              ? 'Invalid email or password. Please verify your credentials or register a new customer account.'
              : error.message
          };
        }

        if (data?.user) {
          // Fetch user profile to get role and loyalty details
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const userProfile = {
            id: data.user.id,
            email: data.user.email,
            name: prof?.name || data.user.user_metadata?.name || 'Tea Lover',
            phone: prof?.phone || data.user.user_metadata?.phone || '',
            avatarUrl: prof?.avatar_url || '',
            role: prof?.role || data.user.user_metadata?.role || (cleanEmail.includes('admin') ? 'admin' : 'customer'),
            loyaltyTier: prof?.loyalty_tier || (prof?.role === 'admin' ? 'Staff Admin' : 'Silver Member'),
            completedOrdersCount: prof?.completed_orders_count || 0,
            unlockedRewards: prof?.unlocked_rewards || [],
            favoriteProductIds: prof?.favorite_product_ids || []
          };

          return {
            success: true,
            user: userProfile,
            session: data.session
          };
        }
      } catch (err) {
        console.warn('Supabase auth signIn error:', err.message);
        return {
          success: false,
          error: err.message === 'Invalid login credentials'
            ? 'Invalid email or password.'
            : err.message
        };
      }
    }

    const found = memoryDb.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (found) {
      return { success: true, user: found, session: { token: `mem-token-${Date.now()}` } };
    }

    return {
      success: false,
      error: 'Account not found. Please verify your credentials or create an account.'
    };
  },

  // PRODUCTS
  async getProducts() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            categoryName: p.category_name,
            price: Number(p.price),
            rating: Number(p.rating || 5.0),
            reviewsCount: p.reviews_count || 0,
            isVeg: p.is_veg !== false,
            image: p.image,
            description: p.description,
            tastingNotes: p.tasting_notes,
            origin: p.origin,
            caffeineLevel: p.caffeine_level,
            caffeineMg: p.caffeine_mg,
            calories: p.calories,
            isBestseller: p.is_bestseller,
            isNew: p.is_new,
            isAvailable: p.is_available !== false,
            prepTime: p.prep_time,
            dietaryTags: p.dietary_tags || [],
            defaultOptions: p.default_options || {}
          }));
        }
      } catch (err) {
        console.warn('Supabase products fetch failed, using memory DB:', err.message);
      }
    }
    return memoryDb.products;
  },

  async addProduct(product) {
    const newProd = {
      ...product,
      id: product.id || `tg-${Math.floor(20 + Math.random() * 80)}`,
      rating: product.rating || 5.0,
      reviewsCount: product.reviewsCount || 1,
      isAvailable: product.isAvailable !== false
    };

    memoryDb.products.unshift(newProd);

    if (supabase) {
      try {
        await supabase.from('products').insert({
          id: newProd.id,
          name: newProd.name,
          category: newProd.category,
          category_name: newProd.categoryName,
          price: newProd.price,
          rating: newProd.rating,
          reviews_count: newProd.reviewsCount,
          is_veg: newProd.isVeg,
          image: newProd.image,
          description: newProd.description,
          tasting_notes: newProd.tastingNotes,
          origin: newProd.origin,
          caffeine_level: newProd.caffeineLevel,
          caffeine_mg: newProd.caffeineMg,
          calories: newProd.calories,
          is_bestseller: newProd.isBestseller,
          is_new: newProd.isNew,
          is_available: newProd.isAvailable,
          prep_time: newProd.prepTime,
          dietary_tags: newProd.dietaryTags,
          default_options: newProd.defaultOptions
        });
      } catch (err) {
        console.warn('Supabase product insert error:', err.message);
      }
    }

    return newProd;
  },

  async updateProduct(id, updates) {
    const index = memoryDb.products.findIndex(p => p.id === id);
    if (index > -1) {
      memoryDb.products[index] = { ...memoryDb.products[index], ...updates };
    }

    if (supabase) {
      try {
        const mapped = {};
        if (updates.name !== undefined) mapped.name = updates.name;
        if (updates.price !== undefined) mapped.price = updates.price;
        if (updates.category !== undefined) mapped.category = updates.category;
        if (updates.categoryName !== undefined) mapped.category_name = updates.categoryName;
        if (updates.image !== undefined) mapped.image = updates.image;
        if (updates.description !== undefined) mapped.description = updates.description;
        if (updates.isAvailable !== undefined) mapped.is_available = updates.isAvailable;
        if (updates.isVeg !== undefined) mapped.is_veg = updates.isVeg;

        await supabase.from('products').update(mapped).eq('id', id);
      } catch (err) {
        console.warn('Supabase product update error:', err.message);
      }
    }

    return memoryDb.products.find(p => p.id === id);
  },

  async deleteProduct(id) {
    memoryDb.products = memoryDb.products.filter(p => p.id !== id);
    if (supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase product delete error:', err.message);
      }
    }
    return { success: true, id };
  },

  // ORDERS
  async getOrders() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(o => ({
            id: o.id,
            tableNumber: o.table_number,
            date: o.created_at,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            orderType: o.order_type,
            items: o.items || [],
            subtotal: Number(o.subtotal),
            tax: Number(o.tax),
            discount: Number(o.discount),
            total: Number(o.total),
            status: o.status,
            estimatedPrepTime: o.estimated_prep_time,
            kitchenNotes: o.kitchen_notes,
            timeline: o.timeline || []
          }));
        }
      } catch (err) {
        console.warn('Supabase orders fetch error, using memory DB:', err.message);
      }
    }
    return memoryDb.orders;
  },

  async createOrder(order) {
    const newOrder = {
      ...order,
      id: order.id || `TG-${Math.floor(1025 + Math.random() * 8975)}`,
      date: order.date || new Date().toISOString(),
      status: order.status || 'placed'
    };

    memoryDb.orders.unshift(newOrder);

    // Update table status in memory
    const tableIndex = memoryDb.tables.findIndex(t => t.number === newOrder.tableNumber);
    if (tableIndex > -1) {
      memoryDb.tables[tableIndex].status = 'order_active';
      memoryDb.tables[tableIndex].activeOrderId = newOrder.id;
    }

    if (supabase) {
      try {
        await supabase.from('orders').insert({
          id: newOrder.id,
          table_number: newOrder.tableNumber,
          customer_name: newOrder.customerName,
          customer_phone: newOrder.customerPhone,
          order_type: newOrder.orderType,
          items: newOrder.items,
          subtotal: newOrder.subtotal,
          tax: newOrder.tax,
          discount: newOrder.discount,
          total: newOrder.total,
          status: newOrder.status,
          estimated_prep_time: newOrder.estimatedPrepTime,
          kitchen_notes: newOrder.kitchenNotes,
          timeline: newOrder.timeline
        });

        await supabase.from('restaurant_tables')
          .update({ status: 'order_active', active_order_id: newOrder.id })
          .eq('number', newOrder.tableNumber);
      } catch (err) {
        console.warn('Supabase order insert error:', err.message);
      }
    }

    return newOrder;
  },

  async updateOrderStatus(id, status, timeline) {
    const orderIndex = memoryDb.orders.findIndex(o => o.id === id);
    if (orderIndex > -1) {
      memoryDb.orders[orderIndex].status = status;
      if (timeline) {
        memoryDb.orders[orderIndex].timeline = timeline;
      }
    }

    if (supabase) {
      try {
        const updateData = { status, updated_at: new Date().toISOString() };
        if (timeline) updateData.timeline = timeline;
        await supabase.from('orders').update(updateData).eq('id', id);
      } catch (err) {
        console.warn('Supabase order update error:', err.message);
      }
    }

    return memoryDb.orders.find(o => o.id === id);
  },

  // TABLES
  async getTables() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('restaurant_tables').select('*').order('number', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map(t => ({
            number: t.number,
            name: t.name,
            seats: t.seats,
            zone: t.zone,
            status: t.status,
            activeOrderId: t.active_order_id,
            qrCodeId: t.qr_code_id
          }));
        }
      } catch (err) {
        console.warn('Supabase tables fetch error, using memory DB:', err.message);
      }
    }
    return memoryDb.tables;
  },

  async updateTableStatus(tableNumber, status) {
    const tableIndex = memoryDb.tables.findIndex(t => t.number === tableNumber);
    if (tableIndex > -1) {
      memoryDb.tables[tableIndex].status = status;
      if (status === 'available') {
        memoryDb.tables[tableIndex].activeOrderId = null;
      }
    }

    if (supabase) {
      try {
        const updateData = { status };
        if (status === 'available') updateData.active_order_id = null;
        await supabase.from('restaurant_tables').update(updateData).eq('number', tableNumber);
      } catch (err) {
        console.warn('Supabase table update error:', err.message);
      }
    }

    return memoryDb.tables.find(t => t.number === tableNumber);
  },

  // CUSTOMERS
  async getCustomers() {
    return memoryDb.customers;
  },

  // SETTINGS
  async getSettings() {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('restaurant_settings').select('*').limit(1).single();
        if (!error && data) {
          return {
            restaurantName: data.restaurant_name,
            tagline: data.tagline,
            announcementText: data.announcement_text,
            currency: data.currency,
            taxRatePercent: Number(data.tax_rate_percent),
            serviceChargePercent: Number(data.service_charge_percent),
            openingTime: data.opening_time,
            closingTime: data.closing_time,
            isAcceptingOrders: data.is_accepting_orders,
            autoAcceptOrders: data.auto_accept_orders,
            kitchenPrinterConnected: data.kitchen_printer_connected
          };
        }
      } catch (err) {
        console.warn('Supabase settings fetch error, using memory DB:', err.message);
      }
    }
    return memoryDb.settings;
  },

  async updateSettings(updates) {
    memoryDb.settings = { ...memoryDb.settings, ...updates };

    if (supabase) {
      try {
        await supabase.from('restaurant_settings').upsert({
          id: 'current',
          restaurant_name: memoryDb.settings.restaurantName,
          tagline: memoryDb.settings.tagline,
          announcement_text: memoryDb.settings.announcementText,
          currency: memoryDb.settings.currency,
          tax_rate_percent: memoryDb.settings.taxRatePercent,
          service_charge_percent: memoryDb.settings.serviceChargePercent,
          opening_time: memoryDb.settings.openingTime,
          closing_time: memoryDb.settings.closingTime,
          is_accepting_orders: memoryDb.settings.isAcceptingOrders,
          auto_accept_orders: memoryDb.settings.autoAcceptOrders,
          kitchen_printer_connected: memoryDb.settings.kitchenPrinterConnected
        });
      } catch (err) {
        console.warn('Supabase settings update error:', err.message);
      }
    }

    return memoryDb.settings;
  }
};
