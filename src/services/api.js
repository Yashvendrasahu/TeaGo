/**
 * TeaGo Unified Service
 * Directly interacts with Supabase Database (Products, Orders, Profiles, Tables, Storage)
 * and proxies through Node.js Express backend for Gemini AI.
 */
import { supabaseClient } from './supabaseClient';
import { productsService, ordersService, storageService } from './supabaseService';

const API_BASE = '/api';

export const api = {
  // Health & Server Status
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch {
      return { status: 'online' };
    }
  },

  // Supabase Status
  async getSupabaseStatus() {
    try {
      const res = await fetch(`${API_BASE}/supabase/status`);
      return await res.json();
    } catch {
      return { isConfigured: Boolean(supabaseClient) };
    }
  },

  // Storage Upload: Direct to Supabase 'menu-images' Bucket
  async uploadImage(base64Data, fileName = 'dish.jpg', bucketName = 'menu-images') {
    // 1. Direct Supabase Storage if file object or convert base64
    if (supabaseClient) {
      try {
        const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        // Convert base64 to Blob if needed
        let uploadPayload = base64Data;
        if (typeof base64Data === 'string' && base64Data.startsWith('data:')) {
          const res = await fetch(base64Data);
          uploadPayload = await res.blob();
        }

        const { data, error } = await supabaseClient.storage
          .from(bucketName)
          .upload(cleanName, uploadPayload, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (!error && data) {
          const { data: publicData } = supabaseClient.storage
            .from(bucketName)
            .getPublicUrl(cleanName);

          return {
            success: true,
            url: publicData?.publicUrl || base64Data
          };
        }
      } catch (err) {
        console.warn('Client storage upload exception:', err);
      }
    }

    // 2. Proxy to backend
    try {
      const res = await fetch(`${API_BASE}/storage/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Data, fileName, bucketName })
      });
      return await res.json();
    } catch {
      return { success: true, url: base64Data };
    }
  },

  // Supabase Auth: Sign Up (Directly Creates in auth.users and profiles)
  async signUp(email, password, name, phone) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = name || cleanEmail.split('@')[0] || 'Tea Lover';
    const cleanPhone = phone || '';

    // Direct Supabase Client Auth
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { name: cleanName, phone: cleanPhone, role: 'customer' }
          }
        });

        if (error) throw error;

        // Ensure profile is inserted in public.profiles table
        if (data?.user) {
          try {
            await supabaseClient.from('profiles').upsert({
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
            console.warn('Direct profile upsert:', profErr.message);
          }

          return {
            success: true,
            user: {
              id: data.user.id,
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
            },
            session: data.session
          };
        }
      } catch (err) {
        console.warn('Client-side Supabase signUp error:', err.message);
        // Fallback to backend API
      }
    }

    // Proxy through server backend
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password, name: cleanName, phone: cleanPhone })
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Supabase Auth: Login (Direct check against auth.users & profiles table)
  async login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (!error && data?.user) {
          // Fetch user profile from public.profiles
          const { data: prof } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const userRole = prof?.role || data.user.user_metadata?.role || (cleanEmail.includes('admin') ? 'admin' : 'customer');

          return {
            success: true,
            user: {
              id: data.user.id,
              email: data.user.email,
              name: prof?.name || data.user.user_metadata?.name || 'Tea Lover',
              phone: prof?.phone || data.user.user_metadata?.phone || '',
              avatarUrl: prof?.avatar_url || '',
              role: userRole,
              loyaltyTier: prof?.loyalty_tier || (userRole === 'admin' ? 'Staff Admin' : 'Silver Member'),
              completedOrdersCount: prof?.completed_orders_count || 0,
              unlockedRewards: prof?.unlocked_rewards || [],
              favoriteProductIds: prof?.favorite_product_ids || []
            },
            session: data.session
          };
        }
      } catch (err) {
        console.warn('Client Supabase signIn error:', err.message);
      }
    }

    // Proxy through backend
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Guest Login
  async guestLogin(name, tableNumber) {
    return {
      success: true,
      user: {
        id: '',
        name: name || 'Guest Diner',
        email: '',
        phone: '',
        isLoggedIn: false,
        role: 'customer',
        loyaltyTier: 'Guest Diner',
        completedOrdersCount: 0,
        unlockedRewards: [],
        favoriteProductIds: []
      }
    };
  },

  // Products: Direct from Supabase with backend fallback
  async getProducts() {
    if (supabaseClient) {
      try {
        const prods = await productsService.getAll();
        if (prods && prods.length > 0) return prods;
      } catch (err) {
        console.warn('Direct products fetch fallback:', err.message);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/products`);
      const json = await res.json();
      return json.data || [];
    } catch {
      return null;
    }
  },

  async addProduct(product) {
    if (supabaseClient) {
      try {
        return await productsService.create(product);
      } catch (err) {
        console.warn('Direct product create error:', err.message);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const json = await res.json();
      return json.data || product;
    } catch {
      return product;
    }
  },

  async updateProduct(id, updates) {
    if (supabaseClient) {
      try {
        return await productsService.update(id, updates);
      } catch (err) {
        console.warn('Direct product update error:', err.message);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const json = await res.json();
      return json.data;
    } catch {
      return updates;
    }
  },

  async deleteProduct(id) {
    if (supabaseClient) {
      try {
        return await productsService.delete(id);
      } catch (err) {
        console.warn('Direct product delete error:', err.message);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  // Orders: Direct to Supabase with backend fallback
  async getOrders() {
    if (supabaseClient) {
      try {
        const ords = await ordersService.getAll();
        if (ords && ords.length > 0) return ords;
      } catch (err) {
        console.warn('Direct orders fetch fallback:', err.message);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/orders`);
      const json = await res.json();
      return json.data || [];
    } catch {
      return null;
    }
  },

  async createOrder(order) {
    if (supabaseClient) {
      try {
        return await ordersService.create(order);
      } catch (err) {
        console.warn('Direct order create error:', err.message);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const json = await res.json();
      return json.data || order;
    } catch {
      return order;
    }
  },

  async updateOrderStatus(id, status, timeline) {
    if (supabaseClient) {
      try {
        return await ordersService.updateStatus(id, status, timeline);
      } catch (err) {
        console.warn('Direct order status update error:', err.message);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, timeline })
      });
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  },

  // Tables
  async getTables() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('restaurant_tables').select('*').order('number', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Direct tables fetch error:', err.message);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/tables`);
      const json = await res.json();
      return json.data || [];
    } catch {
      return null;
    }
  },

  async updateTableStatus(tableNumber, status) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('restaurant_tables').update({ status }).eq('number', tableNumber);
      } catch (err) {
        console.warn('Direct table update error:', err.message);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/tables/${tableNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Settings
  async getSettings() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('restaurant_settings').select('*').eq('id', 'current').single();
        if (!error && data) {
          return {
            restaurantName: data.restaurant_name,
            tagline: data.tagline,
            announcementText: data.announcement_text,
            currencySymbol: data.currency || '₹',
            taxRatePercent: Number(data.tax_rate_percent || 5),
            avgPreparationMinutes: Number(data.avg_preparation_minutes || 5),
            wifiName: data.wifi_name,
            wifiPassword: data.wifi_password,
            isAcceptingOrders: data.is_accepting_orders !== false,
            autoAcceptOrders: Boolean(data.auto_accept_orders)
          };
        }
      } catch (err) {
        console.warn('Direct settings fetch error:', err.message);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/settings`);
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  },

  async updateSettings(settings) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('restaurant_settings').upsert({
          id: 'current',
          restaurant_name: settings.restaurantName,
          tagline: settings.tagline,
          announcement_text: settings.announcementText,
          tax_rate_percent: settings.taxRatePercent,
          avg_preparation_minutes: settings.avgPreparationMinutes,
          wifi_name: settings.wifiName,
          wifi_password: settings.wifiPassword,
          is_accepting_orders: settings.isAcceptingOrders,
          auto_accept_orders: settings.autoAcceptOrders,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Direct settings upsert error:', err.message);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      return await res.json();
    } catch {
      return settings;
    }
  },

  // Customers
  async getCustomers() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('customers').select('*').order('total_orders', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(c => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
            email: c.email,
            completedOrders: c.total_orders,
            totalSpent: c.total_spent,
            tier: c.loyalty_tier || 'Silver',
            favoriteDrink: c.favorite_drink
          }));
        }
      } catch (err) {
        console.warn('Direct customers fetch error:', err.message);
      }
    }

    try {
      const res = await fetch(`${API_BASE}/customers`);
      const json = await res.json();
      return json.data || [];
    } catch {
      return null;
    }
  },

  // Gemini AI Sommelier
  async askAiSommelier(prompt, tableNumber) {
    try {
      const res = await fetch(`${API_BASE}/ai/sommelier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, tableNumber })
      });
      return await res.json();
    } catch (err) {
      console.warn('API askAiSommelier error:', err);
      return null;
    }
  },

  // Gemini AI Description Generator
  async generateAiDescription(name, category, price, isVeg) {
    try {
      const res = await fetch(`${API_BASE}/ai/generate-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, price, isVeg })
      });
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }
};
