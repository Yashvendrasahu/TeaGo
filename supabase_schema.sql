-- ==============================================================================
-- TeaGo Artisanal Cafe - Supabase Complete Setup (Tables, Auth, Storage & Seed)
-- ==============================================================================

-- 1. PROFILES TABLE (Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT DEFAULT 'Tea Lover',
  phone TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  role TEXT DEFAULT 'customer',
  loyalty_tier TEXT DEFAULT 'Silver Member',
  completed_orders_count INTEGER DEFAULT 0,
  unlocked_rewards JSONB DEFAULT '[]'::jsonb,
  favorite_product_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for auto profile creation on user signup
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
    ARRAY[]::TEXT[]
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. PRODUCTS TABLE
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
  caffeine_level TEXT DEFAULT 'Medium',
  caffeine_mg INTEGER DEFAULT 40,
  calories INTEGER DEFAULT 100,
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  prep_time TEXT DEFAULT '4-5 mins',
  dietary_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  default_options JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  table_number TEXT NOT NULL,
  customer_name TEXT DEFAULT 'Diner',
  customer_phone TEXT DEFAULT '',
  order_type TEXT DEFAULT 'Dine-in',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'placed',
  estimated_prep_time TEXT DEFAULT '4-5 minutes',
  kitchen_notes TEXT DEFAULT '',
  timeline JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RESTAURANT TABLES TABLE
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

-- 5. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  restaurant_name TEXT DEFAULT 'TeaGo Artisanal Cafe',
  tagline TEXT DEFAULT 'Authentic Kadak Chai, Handcrafted Coffees & Quick Bites',
  announcement_text TEXT DEFAULT '✨ Welcome to TeaGo! Complete 10 orders to unlock ₹10 FREE ORDER Reward!',
  currency TEXT DEFAULT '₹',
  tax_rate_percent NUMERIC DEFAULT 5.0,
  service_charge_percent NUMERIC DEFAULT 0,
  avg_preparation_minutes INTEGER DEFAULT 5,
  wifi_name TEXT DEFAULT 'TeaGo_Guest_HighSpeed',
  wifi_password TEXT DEFAULT 'KadakChai2026',
  opening_time TEXT DEFAULT '08:00 AM',
  closing_time TEXT DEFAULT '11:00 PM',
  is_accepting_orders BOOLEAN DEFAULT true,
  auto_accept_orders BOOLEAN DEFAULT true,
  kitchen_printer_connected BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CUSTOMERS TABLE
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
-- 7. STORAGE BUCKET ('menu-images')
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-images',
  'menu-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access to Menu Images" ON storage.objects;
CREATE POLICY "Public Access to Menu Images" ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Allow Upload to Menu Images" ON storage.objects;
CREATE POLICY "Allow Upload to Menu Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Allow Update to Menu Images" ON storage.objects;
CREATE POLICY "Allow Update to Menu Images" ON storage.objects FOR UPDATE USING (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Allow Delete from Menu Images" ON storage.objects;
CREATE POLICY "Allow Delete from Menu Images" ON storage.objects FOR DELETE USING (bucket_id = 'menu-images');

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all profiles" ON public.profiles;
CREATE POLICY "Allow public all profiles" ON public.profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all products" ON public.products;
CREATE POLICY "Allow public all products" ON public.products FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all orders" ON public.orders;
CREATE POLICY "Allow public all orders" ON public.orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all tables" ON public.restaurant_tables;
CREATE POLICY "Allow public all tables" ON public.restaurant_tables FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all settings" ON public.restaurant_settings;
CREATE POLICY "Allow public all settings" ON public.restaurant_settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all customers" ON public.customers;
CREATE POLICY "Allow public all customers" ON public.customers FOR ALL USING (true);

-- ==============================================================================
-- 9. SEED PRODUCTS
-- ==============================================================================

INSERT INTO public.products (
  id, name, category, category_name, price, rating, reviews_count, is_veg, image,
  description, tasting_notes, origin, caffeine_level, caffeine_mg, calories,
  is_bestseller, is_new, is_available, prep_time, dietary_tags, default_options
) VALUES
('tg-01', 'Special Kulhad Masala Chai', 'tea', 'Artisanal Teas & Chai', 45, 4.9, 420, true, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', 'Slow-brewed Assam CTC leaves simmered with fresh crushed ginger, green cardamom, cloves, cinnamon, and fresh farm milk in an earthy clay kulhad.', 'Rich spicy warmth, aromatic cardamom, creamy malt finish', 'Assam & Malabar Spices', 'Medium', 40, 110, true, false, true, '4-5 mins', ARRAY['Vegetarian', 'Authentic Kulhad', 'Fresh Milk'], '{"size":"Regular (Kulhad)","sugar":"Normal Sugar","temperature":"Hot (Steaming)","addOns":[]}'::jsonb),
('tg-02', 'Adrak Elaichi Kadak Chai', 'tea', 'Artisanal Teas & Chai', 40, 4.85, 310, true, 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80', 'Double-boiled strong tea infused with freshly grated organic ginger roots and hand-crushed green cardamom pods.', 'Sharp ginger zing, sweet cardamom aroma, strong robust body', 'Darjeeling & Coorg Cardamom', 'High', 55, 95, true, false, true, '3-4 mins', ARRAY['Vegetarian', 'Immunity Booster'], '{"size":"Regular (150ml)","sugar":"Normal Sugar","temperature":"Hot (Steaming)","addOns":[]}'::jsonb),
('tg-03', 'Kashmiri Saffron Kahwa', 'tea', 'Artisanal Teas & Chai', 75, 4.95, 180, true, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=600&q=80', 'Exquisite Kashmiri green tea steeped with pure Pampore saffron strands, cinnamon bark, and garnished with slivered almonds.', 'Golden saffron nectar, toasted almond crunch, delicate floral spice', 'Pampore, Kashmir', 'Low', 20, 60, false, true, true, '5-6 mins', ARRAY['Vegan', 'Dairy-Free', 'Royal Blend'], '{"size":"Regular (180ml)","sugar":"Wild Blossom Honey","temperature":"Hot (Steaming)","addOns":["Extra Saffron Strands"]}'::jsonb),
('tg-04', 'Classic South Indian Filter Coffee', 'coffee', 'Hot & Cold Coffees', 60, 4.92, 295, true, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', 'Traditional 80:20 Arabica-Chicory decoction freshly dripped through a brass filter, frothed with boiled whole milk in a traditional Davarah tumbler.', 'Intense roasted cocoa, velvety froth, deep caramelized chicory', 'Chikmagalur & Wayanad', 'High', 75, 120, true, false, true, '4-5 mins', ARRAY['Vegetarian', 'Brass Davarah Served'], '{"size":"Davarah Glass (160ml)","sugar":"Normal Sugar","temperature":"Hot (Steaming)","addOns":[]}'::jsonb),
('tg-05', 'Artisan Creamy Cappuccino', 'coffee', 'Hot & Cold Coffees', 90, 4.88, 240, true, 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80', 'Double shot of freshly ground dark-roast espresso topped with thick micro-foam steamed milk and dusted with Belgian dark cocoa.', 'Bittersweet dark chocolate, nutty crema, silky milk foam', 'Estate Arabica Beans', 'High', 85, 140, false, false, true, '4 mins', ARRAY['Vegetarian', 'Latte Art'], '{"size":"Medium (250ml)","sugar":"Normal Sugar","temperature":"Hot (Steaming)","addOns":[]}'::jsonb),
('tg-06', 'Signature Thick Cold Coffee', 'cold-beverages', 'Iced Brews & Shakes', 110, 4.94, 380, true, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80', 'Rich blended espresso shake with creamy vanilla bean gelato, chilled milk, and swirls of decadent chocolate fudge syrup.', 'Creamy mocha, frozen vanilla, rich chocolate drizzle', 'House Special Recipe', 'Medium', 50, 280, true, false, true, '3-4 mins', ARRAY['Vegetarian', 'Ice Cream Scoop'], '{"size":"Large (350ml)","sugar":"Normal Sugar","temperature":"Cold (Chilled)","addOns":["Chocolate Drizzle"]}'::jsonb),
('tg-07', 'Fresh Lemon Mint Iced Tea', 'cold-beverages', 'Iced Brews & Shakes', 80, 4.8, 165, true, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80', 'Nilgiri cold-brewed black tea shaken over ice with fresh garden mint leaves, freshly squeezed yellow lemon juice, and pure cane syrup.', 'Zesty citrus punch, cooling wild mint, crisp clean finish', 'Nilgiri Hills', 'Low', 25, 85, false, true, true, '3 mins', ARRAY['Vegan', 'Dairy-Free', 'Refreshing'], '{"size":"Large (350ml)","sugar":"Less Sugar","temperature":"Cold (Chilled)","addOns":[]}'::jsonb),
('tg-08', 'Crispy Samosa with Mint Chutney (2 Pcs)', 'snacks', 'Quick Bites & Snacks', 50, 4.9, 510, true, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', 'Golden-fried pastry pockets stuffed with spiced potatoes, green peas, roasted cashews, served with tangy tamarind and spicy mint coriander dip.', 'Crispy flaky crust, savory cumin-coriander spiced filling', 'Fresh Kitchen Fry', 'None', 0, 260, true, false, true, '5-7 mins', ARRAY['Vegetarian', 'Hot & Fresh', 'Chef Special'], '{"size":"Standard Plate (2 Pcs)","sugar":"No Sugar","temperature":"Hot (Crispy)","addOns":["Extra Mint Chutney"]}'::jsonb),
('tg-09', 'Irani Maska Bun with Chai Dip', 'snacks', 'Quick Bites & Snacks', 45, 4.88, 340, true, 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80', 'Ultra-soft sweet bakery bun generously slathered with salted Amul butter and sweet tutti-frutti, toasted lightly to perfection.', 'Melt-in-mouth soft bread, salted butter richness, subtle sweetness', 'Artisan Bakery', 'None', 0, 210, true, false, true, '2-3 mins', ARRAY['Vegetarian', 'Comfort Classic'], '{"size":"1 Bun (4 Slices)","sugar":"Normal Sugar","temperature":"Warm (Toasted)","addOns":[]}'::jsonb),
('tg-10', 'Grilled Cheese Corn Sandwich', 'snacks', 'Quick Bites & Snacks', 110, 4.86, 220, true, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', 'Triple-layer jumbo bread filled with sweet American corn kernels, melted mozzarella, crunchy bell peppers, and signature herb seasoning.', 'Gooey cheese pull, sweet crunchy corn, buttery toasted crust', 'Fresh Cafe Grill', 'None', 0, 320, false, true, true, '7-9 mins', ARRAY['Vegetarian', 'Double Cheese'], '{"size":"Jumbo 4 Triangles","sugar":"No Sugar","temperature":"Hot (Grilled)","addOns":["Extra Mozzarella Cheese"]}'::jsonb),
('tg-11', 'Crispy Paneer Pakoda Platter', 'snacks', 'Quick Bites & Snacks', 95, 4.82, 190, true, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80', 'Fresh malai cottage cheese cubes marinated in ajwain and chaat masala, coated in seasoned chickpea batter and fried crisp.', 'Soft paneer center, crunchy spiced batter, tangy chaat masala', 'Fresh Kitchen Fry', 'None', 0, 290, false, false, true, '6-8 mins', ARRAY['Vegetarian', 'High Protein'], '{"size":"6 Big Pieces","sugar":"No Sugar","temperature":"Hot (Crispy)","addOns":[]}'::jsonb),
('tg-12', 'Monsoon Chai & Pakoda Table Combo', 'specials', 'Chef Special Combos', 130, 4.96, 310, true, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80', '2 Cups of Special Kulhad Masala Chai + 1 Plate Hot Mix Pakodas (Paneer & Onion) + 2 Crispy Samosas with Chutney Trio.', 'The ultimate Indian cafe dining experience to share at your table', 'Signature Pairing', 'Medium', 40, 480, true, true, true, '6-8 mins', ARRAY['Vegetarian', 'Sharing Platter (2-3 Persons)', 'Value Combo'], '{"size":"Sharing Combo for 2","sugar":"Normal Sugar","temperature":"Hot (Freshly Prepared)","addOns":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  description = EXCLUDED.description,
  tasting_notes = EXCLUDED.tasting_notes,
  is_available = EXCLUDED.is_available,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  updated_at = NOW();

-- ==============================================================================
-- 10. SEED TABLES (01 to 20)
-- ==============================================================================

INSERT INTO public.restaurant_tables (number, name, seats, zone, status, active_order_id, qr_code_id) VALUES
('01', 'Table 01 (Indoor Window)', 2, 'Window Bay', 'available', NULL, 'TG-QR-T01'),
('02', 'Table 02 (Indoor Window)', 2, 'Window Bay', 'available', NULL, 'TG-QR-T02'),
('03', 'Table 03 (Garden Patio)', 4, 'Outdoor Patio', 'available', NULL, 'TG-QR-T03'),
('04', 'Table 04 (Garden Patio)', 4, 'Outdoor Patio', 'available', NULL, 'TG-QR-T04'),
('05', 'Table 05 (Main Central)', 4, 'Central Dining', 'available', NULL, 'TG-QR-T05'),
('06', 'Table 06 (Main Central)', 4, 'Central Dining', 'available', NULL, 'TG-QR-T06'),
('07', 'Table 07 (Cozy Sofa Booth)', 6, 'Lounge Section', 'available', NULL, 'TG-QR-T07'),
('08', 'Table 08 (Cozy Sofa Booth)', 6, 'Lounge Section', 'available', NULL, 'TG-QR-T08'),
('09', 'Table 09 (Bar Counter High)', 2, 'Brew Bar', 'available', NULL, 'TG-QR-T09'),
('10', 'Table 10 (Bar Counter High)', 2, 'Brew Bar', 'available', NULL, 'TG-QR-T10'),
('11', 'Table 11 (Indoor)', 4, 'Indoor Lounge', 'available', NULL, 'TG-QR-T11'),
('12', 'Table 12 (Indoor)', 4, 'Indoor Lounge', 'available', NULL, 'TG-QR-T12'),
('13', 'Table 13 (Indoor)', 4, 'Indoor Lounge', 'available', NULL, 'TG-QR-T13'),
('14', 'Table 14 (Outdoor Canopy)', 4, 'Outdoor Patio', 'available', NULL, 'TG-QR-T14'),
('15', 'Table 15 (Outdoor Canopy)', 4, 'Outdoor Patio', 'available', NULL, 'TG-QR-T15'),
('16', 'Table 16 (Family Section)', 8, 'Family Zone', 'available', NULL, 'TG-QR-T16'),
('17', 'Table 17 (Family Section)', 8, 'Family Zone', 'available', NULL, 'TG-QR-T17'),
('18', 'Table 18 (Corner Nook)', 2, 'Quiet Zone', 'available', NULL, 'TG-QR-T18'),
('19', 'Table 19 (Quiet Study)', 2, 'Quiet Zone', 'available', NULL, 'TG-QR-T19'),
('20', 'Table 20 (Rooftop View)', 4, 'Rooftop Lounge', 'available', NULL, 'TG-QR-T20')
ON CONFLICT (number) DO NOTHING;

-- ==============================================================================
-- 11. SEED SETTINGS & CUSTOMERS
-- ==============================================================================

INSERT INTO public.restaurant_settings (
  id, restaurant_name, tagline, announcement_text, currency, tax_rate_percent,
  service_charge_percent, avg_preparation_minutes, wifi_name, wifi_password,
  opening_time, closing_time, is_accepting_orders, auto_accept_orders, kitchen_printer_connected
) VALUES (
  'current', 'TeaGo Artisanal Cafe', 'Authentic Kadak Chai, Handcrafted Coffees & Quick Bites',
  '✨ Welcome to TeaGo! Complete 10 table orders to unlock ₹10 FREE ORDER Reward!',
  '₹', 5.0, 0.0, 5, 'TeaGo_Guest_HighSpeed', 'KadakChai2026', '08:00 AM', '11:00 PM', true, true, true
)
ON CONFLICT (id) DO UPDATE SET
  restaurant_name = EXCLUDED.restaurant_name,
  tagline = EXCLUDED.tagline,
  tax_rate_percent = EXCLUDED.tax_rate_percent,
  updated_at = NOW();

INSERT INTO public.customers (id, name, phone, email, total_orders, total_spent, loyalty_tier, favorite_drink) VALUES
('c-01', 'Aarav Sharma', '+91 98765 43210', 'aarav@example.com', 12, 1450, 'Gold', 'Special Kulhad Masala Chai'),
('c-02', 'Priya Patel', '+91 98123 45678', 'priya@example.com', 8, 920, 'Silver', 'Classic South Indian Filter Coffee'),
('c-03', 'Rohan Mehta', '+91 97234 56789', 'rohan@example.com', 19, 2380, 'Platinum', 'Signature Thick Cold Coffee'),
('c-04', 'Ananya Deshmukh', '+91 96345 67890', 'ananya@example.com', 5, 480, 'Silver', 'Irani Maska Bun with Chai Dip')
ON CONFLICT (id) DO NOTHING;
