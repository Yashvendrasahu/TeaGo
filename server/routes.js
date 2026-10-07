import express from 'express';
import { db, isSupabaseConfigured, SUPABASE_SCHEMA_SQL } from './supabase.js';
import { askAiSommelier, generateMenuDescription, isGeminiConfigured } from './gemini.js';

export const apiRouter = express.Router();

// 1. Health & Configuration status
apiRouter.get('/health', async (req, res) => {
  res.json({
    status: 'online',
    serverTime: new Date().toISOString(),
    services: {
      supabase: {
        configured: isSupabaseConfigured,
        provider: isSupabaseConfigured ? 'Supabase Postgres & Storage' : 'In-Memory Store (Resilient Fallback)'
      },
      geminiAi: {
        configured: isGeminiConfigured,
        model: 'gemini-3.8-flash'
      }
    }
  });
});

// 2. Supabase setup status & Client Config
apiRouter.get('/supabase/config', (req, res) => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  res.json({
    isConfigured: Boolean(url && anonKey && !url.includes('your-project')),
    supabaseUrl: url,
    supabaseAnonKey: anonKey
  });
});

apiRouter.get('/supabase/status', (req, res) => {
  res.json({
    isConfigured: isSupabaseConfigured,
    supabaseUrl: process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL.slice(0, 18)}...` : 'Not Set',
    sqlSchema: SUPABASE_SCHEMA_SQL,
    storageBucket: 'menu-images',
    authEnabled: true,
    setupInstructions: [
      '1. Open your Supabase Dashboard: https://app.supabase.com',
      '2. Go to SQL Editor and click New Query',
      '3. Paste the schema SQL from this endpoint and click Run',
      '4. Add SUPABASE_URL and SUPABASE_ANON_KEY to your environment secrets'
    ]
  });
});

// 3. SUPABASE STORAGE: IMAGE UPLOAD
apiRouter.post('/storage/upload', async (req, res) => {
  try {
    const { base64Data, fileName, bucketName } = req.body;
    if (!base64Data) {
      return res.status(400).json({ success: false, error: 'base64Data is required' });
    }

    const uploadResult = await db.uploadImage(base64Data, fileName || 'product.jpg', bucketName || 'menu-images');
    res.json(uploadResult);
  } catch (error) {
    console.error('Storage upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. SUPABASE AUTH: USER AUTHENTICATION & PROFILES
apiRouter.post('/auth/send-otp', async (req, res) => {
  try {
    const { email, name, phone } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    const result = await db.sendOtp({ email, name, phone });
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/auth/verify-otp', async (req, res) => {
  try {
    const { email, token, name, phone } = req.body;
    if (!email || !token) {
      return res.status(400).json({ success: false, error: 'Email and OTP token are required' });
    }
    const result = await db.verifyOtp({ email, token, name, phone });
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const result = await db.signUp({ email, password, name, phone });
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const result = await db.signIn({ email, password });
    if (!result.success) {
      return res.status(401).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/auth/guest', (req, res) => {
  const { name, tableNumber } = req.body;
  const guestUser = {
    id: `guest-${Date.now()}`,
    email: `guest-${Date.now()}@teago.local`,
    name: name || `Guest (Table ${tableNumber || '01'})`,
    phone: '',
    loyaltyTier: 'Guest Diner',
    completedOrdersCount: 0,
    unlockedRewards: [],
    favoriteProductIds: []
  };
  res.json({ success: true, user: guestUser });
});

// 5. PRODUCTS ENDPOINTS
apiRouter.get('/products', async (req, res) => {
  try {
    const products = await db.getProducts();
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/products', async (req, res) => {
  try {
    const newProduct = await db.addProduct(req.body);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.put('/products/:id', async (req, res) => {
  try {
    const updated = await db.updateProduct(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.delete('/products/:id', async (req, res) => {
  try {
    const result = await db.deleteProduct(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. ORDERS ENDPOINTS
apiRouter.get('/orders', async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/orders', async (req, res) => {
  try {
    const order = await db.createOrder(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status, timeline } = req.body;
    const updated = await db.updateOrderStatus(req.params.id, status, timeline);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. TABLES ENDPOINTS
apiRouter.get('/tables', async (req, res) => {
  try {
    const tables = await db.getTables();
    res.json({ success: true, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.patch('/tables/:tableNumber', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await db.updateTableStatus(req.params.tableNumber, status);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. CUSTOMERS & SETTINGS ENDPOINTS
apiRouter.get('/customers', async (req, res) => {
  try {
    const customers = await db.getCustomers();
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/settings', async (req, res) => {
  try {
    const settings = await db.getSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/settings', async (req, res) => {
  try {
    const settings = await db.updateSettings(req.body);
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. GEMINI AI ASSISTANT ENDPOINTS
apiRouter.post('/ai/sommelier', async (req, res) => {
  try {
    const { prompt, tableNumber, userPreferences } = req.body;
    const currentProducts = await db.getProducts();

    const response = await askAiSommelier({
      prompt,
      tableNumber,
      availableProducts: currentProducts,
      userPreferences
    });

    res.json({ success: true, ...response });
  } catch (error) {
    console.error('API /ai/sommelier error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/ai/generate-description', async (req, res) => {
  try {
    const { name, category, price, isVeg } = req.body;
    const result = await generateMenuDescription({ name, category, price, isVeg });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
