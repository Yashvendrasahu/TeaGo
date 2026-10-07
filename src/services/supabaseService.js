import { supabaseClient } from './supabaseClient';

/**
 * Maps database snake_case product columns to client camelCase properties
 */
export function mapProductFromDb(dbProduct) {
  if (!dbProduct) return null;
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category,
    categoryName: dbProduct.category_name,
    price: Number(dbProduct.price),
    rating: Number(dbProduct.rating ?? 5.0),
    reviewsCount: dbProduct.reviews_count || 0,
    isVeg: dbProduct.is_veg !== false,
    image: dbProduct.image,
    description: dbProduct.description,
    tastingNotes: dbProduct.tasting_notes,
    origin: dbProduct.origin,
    caffeineLevel: dbProduct.caffeine_level || 'Medium',
    caffeineMg: dbProduct.caffeine_mg || 0,
    calories: dbProduct.calories || 0,
    isBestseller: Boolean(dbProduct.is_bestseller),
    isNew: Boolean(dbProduct.is_new),
    isAvailable: dbProduct.is_available !== false,
    prepTime: dbProduct.prep_time || '4-5 mins',
    dietaryTags: Array.isArray(dbProduct.dietary_tags) ? dbProduct.dietary_tags : [],
    defaultOptions: dbProduct.default_options || {},
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at
  };
}

/**
 * Maps client camelCase product properties to database snake_case columns
 */
export function mapProductToDb(clientProduct) {
  const mapped = {};
  if (clientProduct.id !== undefined) mapped.id = clientProduct.id;
  if (clientProduct.name !== undefined) mapped.name = clientProduct.name;
  if (clientProduct.category !== undefined) mapped.category = clientProduct.category;
  if (clientProduct.categoryName !== undefined) mapped.category_name = clientProduct.categoryName;
  if (clientProduct.price !== undefined) mapped.price = Number(clientProduct.price);
  if (clientProduct.rating !== undefined) mapped.rating = Number(clientProduct.rating);
  if (clientProduct.reviewsCount !== undefined) mapped.reviews_count = Number(clientProduct.reviewsCount);
  if (clientProduct.isVeg !== undefined) mapped.is_veg = Boolean(clientProduct.isVeg);
  if (clientProduct.image !== undefined) mapped.image = clientProduct.image;
  if (clientProduct.description !== undefined) mapped.description = clientProduct.description;
  if (clientProduct.tastingNotes !== undefined) mapped.tasting_notes = clientProduct.tastingNotes;
  if (clientProduct.origin !== undefined) mapped.origin = clientProduct.origin;
  if (clientProduct.caffeineLevel !== undefined) mapped.caffeine_level = clientProduct.caffeineLevel;
  if (clientProduct.caffeineMg !== undefined) mapped.caffeine_mg = Number(clientProduct.caffeineMg);
  if (clientProduct.calories !== undefined) mapped.calories = Number(clientProduct.calories);
  if (clientProduct.isBestseller !== undefined) mapped.is_bestseller = Boolean(clientProduct.isBestseller);
  if (clientProduct.isNew !== undefined) mapped.is_new = Boolean(clientProduct.isNew);
  if (clientProduct.isAvailable !== undefined) mapped.is_available = Boolean(clientProduct.isAvailable);
  if (clientProduct.prepTime !== undefined) mapped.prep_time = clientProduct.prepTime;
  if (clientProduct.dietaryTags !== undefined) mapped.dietary_tags = clientProduct.dietaryTags;
  if (clientProduct.defaultOptions !== undefined) mapped.default_options = clientProduct.defaultOptions;
  mapped.updated_at = new Date().toISOString();
  return mapped;
}

/**
 * Maps database snake_case order columns to client camelCase properties
 */
export function mapOrderFromDb(dbOrder) {
  if (!dbOrder) return null;
  return {
    id: dbOrder.id,
    userId: dbOrder.user_id,
    tableNumber: dbOrder.table_number,
    customerName: dbOrder.customer_name || 'Diner',
    customerPhone: dbOrder.customer_phone || '',
    orderType: dbOrder.order_type || 'Dine-in',
    items: Array.isArray(dbOrder.items) ? dbOrder.items : [],
    subtotal: Number(dbOrder.subtotal || 0),
    tax: Number(dbOrder.tax || 0),
    discount: Number(dbOrder.discount || 0),
    total: Number(dbOrder.total || 0),
    status: dbOrder.status || 'placed',
    estimatedPrepTime: dbOrder.estimated_prep_time || '4-5 minutes',
    kitchenNotes: dbOrder.kitchen_notes || '',
    timeline: Array.isArray(dbOrder.timeline) ? dbOrder.timeline : [],
    date: dbOrder.created_at,
    createdAt: dbOrder.created_at,
    updatedAt: dbOrder.updated_at
  };
}

/**
 * Maps client camelCase order properties to database snake_case columns
 */
export function mapOrderToDb(clientOrder) {
  const mapped = {};
  if (clientOrder.id !== undefined) mapped.id = clientOrder.id;
  if (clientOrder.userId !== undefined) mapped.user_id = clientOrder.userId;
  if (clientOrder.tableNumber !== undefined) mapped.table_number = clientOrder.tableNumber;
  if (clientOrder.customerName !== undefined) mapped.customer_name = clientOrder.customerName;
  if (clientOrder.customerPhone !== undefined) mapped.customer_phone = clientOrder.customerPhone;
  if (clientOrder.orderType !== undefined) mapped.order_type = clientOrder.orderType;
  if (clientOrder.items !== undefined) mapped.items = clientOrder.items;
  if (clientOrder.subtotal !== undefined) mapped.subtotal = Number(clientOrder.subtotal);
  if (clientOrder.tax !== undefined) mapped.tax = Number(clientOrder.tax);
  if (clientOrder.discount !== undefined) mapped.discount = Number(clientOrder.discount);
  if (clientOrder.total !== undefined) mapped.total = Number(clientOrder.total);
  if (clientOrder.status !== undefined) mapped.status = clientOrder.status;
  if (clientOrder.estimatedPrepTime !== undefined) mapped.estimated_prep_time = clientOrder.estimatedPrepTime;
  if (clientOrder.kitchenNotes !== undefined) mapped.kitchen_notes = clientOrder.kitchenNotes;
  if (clientOrder.timeline !== undefined) mapped.timeline = clientOrder.timeline;
  mapped.updated_at = new Date().toISOString();
  return mapped;
}

// ==============================================================================
// 1. PRODUCTS CRUD UTILITY
// ==============================================================================

export const productsService = {
  /**
   * Fetch all products with optional filters
   */
  async getAll({ category, isAvailable, limit } = {}) {
    if (!supabaseClient) throw new Error('Supabase client is not configured');

    let query = supabaseClient
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (isAvailable !== undefined) {
      query = query.eq('is_available', isAvailable);
    }
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapProductFromDb);
  },

  /**
   * Fetch a single product by ID
   */
  async getById(id) {
    if (!supabaseClient) throw new Error('Supabase client is not configured');

    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return mapProductFromDb(data);
  },

  /**
   * Create a new product in the products table
   */
  async create(productData) {
    if (!supabaseClient) throw new Error('Supabase client is not configured');

    const productWithId = {
      id: productData.id || `tg-${Date.now().toString().slice(-4)}`,
      ...productData
    };

    const payload = mapProductToDb(productWithId);
    const { data, error } = await supabaseClient
      .from('products')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return mapProductFromDb(data);
  },

  /**
   * Update an existing product by ID
   */
  async update(id, updates) {
    if (!supabaseClient) throw new Error('Supabase client is not configured');

    const payload = mapProductToDb(updates);
    const { data, error } = await supabaseClient
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapProductFromDb(data);
  },

  /**
   * Toggle product availability status (In-Stock / Out-of-Stock)
   */
  async toggleAvailability(id, isAvailable) {
    return this.update(id, { isAvailable });
  },

  /**
   * Delete a product by ID
   */
  async delete(id) {
    if (!supabaseClient) throw new Error('Supabase client is not configured');

    const { error } = await supabaseClient
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, id };
  }
};

// ==============================================================================
// 2. ORDERS CRUD UTILITY
// ==============================================================================

export const ordersService = {
  /**
   * Fetch all orders with optional filters
   */
  async getAll({ status, tableNumber, userId, limit } = {}) {
    if (!supabaseClient) throw new Error('Supabase client is not configured');

    let query = supabaseClient
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    if (tableNumber) {
      query = query.eq('table_number', tableNumber);
    }
    if (userId) {
      query = query.eq('user_id', userId);
    }
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapOrderFromDb);
  },

  /**
   * Fetch a single order by ID
   */
  async getById(id) {
    if (!supabaseClient) throw new Error('Supabase client is not configured');

    const { data, error } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return mapOrderFromDb(data);
  },

  /**
   * Create a new order in the orders table
   */
  async create(orderData) {
    if (!supabaseClient) throw new Error('Supabase client is not configured');

    const orderId = orderData.id || `TG-${Math.floor(1020 + Math.random() * 8980)}`;
    const fullOrder = {
      id: orderId,
      status: 'placed',
      timeline: [
        { status: 'placed', label: 'Order Placed by Table Diner', time: 'Just now', completed: true },
        { status: 'accepted', label: 'Accepted by Kitchen Chef', time: 'Pending', completed: false },
        { status: 'preparing', label: 'Brewing & Fresh Kitchen Fry', time: 'Pending', completed: false },
        { status: 'ready', label: 'Order Ready for Table Service', time: 'Pending', completed: false },
        { status: 'delivered', label: 'Delivered to Table & Enjoyed', time: 'Pending', completed: false }
      ],
      ...orderData
    };

    const payload = mapOrderToDb(fullOrder);
    const { data, error } = await supabaseClient
      .from('orders')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    // Also update the restaurant table status
    if (fullOrder.tableNumber) {
      await supabaseClient
        .from('restaurant_tables')
        .update({ status: 'order_active', active_order_id: orderId })
        .eq('number', fullOrder.tableNumber);
    }

    return mapOrderFromDb(data);
  },

  /**
   * Update order status and lifecycle timeline (placed -> accepted -> preparing -> ready -> delivered)
   */
  async updateStatus(id, newStatus, customTimeline) {
    if (!supabaseClient) throw new Error('Supabase client is not configured');

    const updates = { status: newStatus };
    if (customTimeline) {
      updates.timeline = customTimeline;
    }

    const payload = mapOrderToDb(updates);
    const { data, error } = await supabaseClient
      .from('orders')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // If order delivered or cancelled, release table
    if (newStatus === 'delivered' || newStatus === 'cancelled') {
      const order = mapOrderFromDb(data);
      if (order?.tableNumber) {
        await supabaseClient
          .from('restaurant_tables')
          .update({ status: 'available', active_order_id: null })
          .eq('number', order.tableNumber);
      }
    }

    return mapOrderFromDb(data);
  },

  /**
   * Update arbitrary order fields by ID
   */
  async update(id, updates) {
    if (!supabaseClient) throw new Error('Supabase client is not configured');

    const payload = mapOrderToDb(updates);
    const { data, error } = await supabaseClient
      .from('orders')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapOrderFromDb(data);
  },

  /**
   * Delete an order by ID
   */
  async delete(id) {
    if (!supabaseClient) throw new Error('Supabase client is not configured');

    const { error } = await supabaseClient
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, id };
  },

  /**
   * Realtime subscription helper for orders changes (insert, update, delete)
   */
  subscribeToChanges(callback) {
    if (!supabaseClient) return null;

    const channel = supabaseClient
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (typeof callback === 'function') {
            callback({
              eventType: payload.eventType, // 'INSERT' | 'UPDATE' | 'DELETE'
              new: mapOrderFromDb(payload.new),
              old: mapOrderFromDb(payload.old)
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }
};

// ==============================================================================
// 3. STORAGE BUCKET UTILITY (Image Uploads to 'menu-images')
// ==============================================================================

export const storageService = {
  /**
   * Upload an image file directly to the Supabase 'menu-images' storage bucket
   */
  async uploadImage(file, customFileName, bucketName = 'menu-images') {
    if (!supabaseClient) throw new Error('Supabase client is not configured');

    const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
    const fileName = customFileName || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: publicUrlData } = supabaseClient.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return {
      success: true,
      path: data.path,
      url: publicUrlData.publicUrl
    };
  },

  /**
   * Get the public URL for an image path in the bucket
   */
  getPublicUrl(filePath, bucketName = 'menu-images') {
    if (!supabaseClient) return filePath;
    const { data } = supabaseClient.storage.from(bucketName).getPublicUrl(filePath);
    return data?.publicUrl || filePath;
  }
};
