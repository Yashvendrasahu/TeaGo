import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { supabaseClient } from '../services/supabaseClient';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_TABLES,
  INITIAL_USER,
  INITIAL_CUSTOMERS,
  INITIAL_SETTINGS,
  CUSTOMIZATION_OPTIONS
} from '../data/initialData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Navigation View State
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return hash || 'home';
  });

  // Table Context (Entered / chosen by user when ordering or scanning)
  const [currentTable, setCurrentTable] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tableFromUrl = urlParams.get('table');
      if (tableFromUrl) return tableFromUrl.padStart(2, '0');
      const saved = localStorage.getItem('teago_current_table');
      return saved || '';
    } catch {
      return '';
    }
  });

  // QR Scanner Simulator Modal State
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Supabase Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup' | 'admin' | 'guest'

  // Selected items for detail views
  const [selectedProductId, setSelectedProductId] = useState('tg-01');
  const [selectedOrderId, setSelectedOrderId] = useState('TG-1024');
  const [customizingProduct, setCustomizingProduct] = useState(null);

  // Restaurant Tables (Tables 01 to 20)
  const [tables, setTables] = useState(() => {
    try {
      const saved = localStorage.getItem('teago_tables');
      return saved ? JSON.parse(saved) : INITIAL_TABLES;
    } catch {
      return INITIAL_TABLES;
    }
  });

  // Products state
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('teago_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(p => {
            const initialMatch = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
            return {
              ...p,
              image: p.image || initialMatch?.image || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'
            };
          });
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('teago_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedReward, setAppliedReward] = useState(null);
  const [specialKitchenInstructions, setSpecialKitchenInstructions] = useState('');

  // Orders state
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('teago_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // User & Rewards state (Starts strictly unauthenticated for visitors)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('teago_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isLoggedIn === true && parsed.email && parsed.email !== 'aarav.sharma@example.com') {
          return {
            ...parsed,
            isLoggedIn: true,
            role: parsed.role || 'customer',
            unlockedRewards: Array.isArray(parsed?.unlockedRewards) ? parsed.unlockedRewards : [],
            favoriteProductIds: Array.isArray(parsed?.favoriteProductIds) ? parsed.favoriteProductIds : []
          };
        }
      }
      return {
        id: '',
        name: 'Guest Diner',
        email: '',
        phone: '',
        isLoggedIn: false,
        role: 'customer',
        loyaltyTier: 'Guest Diner',
        completedOrdersCount: 0,
        unlockedRewards: [],
        favoriteProductIds: []
      };
    } catch {
      return {
        id: '',
        name: 'Guest Diner',
        email: '',
        phone: '',
        isLoggedIn: false,
        role: 'customer',
        loyaltyTier: 'Guest Diner',
        completedOrdersCount: 0,
        unlockedRewards: [],
        favoriteProductIds: []
      };
    }
  });

  // Customers state (Admin)
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('teago_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  // Settings state (Admin)
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('teago_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Backend connection status
  const [backendStatus, setBackendStatus] = useState({
    online: false,
    supabase: false,
    gemini: false
  });

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  // Load from Backend API on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const health = await api.getHealth();
        if (health?.status === 'online') {
          setBackendStatus({
            online: true,
            supabase: health.services?.supabase?.configured || false,
            gemini: health.services?.geminiAi?.configured || false
          });
        }

        // Fetch products from backend
        const remoteProducts = await api.getProducts();
        if (Array.isArray(remoteProducts) && remoteProducts.length > 0) {
          setProducts(remoteProducts);
        }

        // Fetch orders from backend
        const remoteOrders = await api.getOrders();
        if (Array.isArray(remoteOrders) && remoteOrders.length > 0) {
          setOrders(remoteOrders);
        }

        // Fetch tables from backend
        const remoteTables = await api.getTables();
        if (Array.isArray(remoteTables) && remoteTables.length > 0) {
          setTables(remoteTables);
        }

        // Fetch settings from backend
        const remoteSettings = await api.getSettings();
        if (remoteSettings) {
          setSettings(remoteSettings);
        }
      } catch (err) {
        console.warn('Could not sync with backend on start, running local store mode:', err);
      }
    }

    loadBackendData();
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (currentTable) {
      localStorage.setItem('teago_current_table', currentTable);
    }
  }, [currentTable]);

  useEffect(() => {
    localStorage.setItem('teago_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('teago_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('teago_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('teago_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('teago_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('teago_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('teago_settings', JSON.stringify(settings));
  }, [settings]);

  // Supabase Auth State Change Listener (For Magic Link click & Token auth)
  useEffect(() => {
    if (!supabaseClient) return;

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED')) {
        let userRole = 'customer';
        let userName = session.user.user_metadata?.name || 'Tea Lover';
        let userPhone = session.user.user_metadata?.phone || '';

        try {
          const { data: prof } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (prof) {
            userRole = prof.role || userRole;
            userName = prof.name || userName;
            userPhone = prof.phone || userPhone;
          }
        } catch (e) {
          console.warn('Profile fetch on auth state change:', e);
        }

        setUser(prev => ({
          ...prev,
          id: session.user.id,
          email: session.user.email,
          name: userName,
          phone: userPhone,
          role: userRole,
          isLoggedIn: true
        }));
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sync window hash for clean navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash) {
        if (hash.startsWith('product/')) {
          const pId = hash.replace('product/', '');
          setSelectedProductId(pId);
          setCurrentView('product-details');
        } else if (hash.startsWith('tracking/')) {
          const oId = hash.replace('tracking/', '');
          setSelectedOrderId(oId);
          setCurrentView('tracking');
        } else {
          setCurrentView(hash);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Switch / Enter Table
  const switchTable = (tableNumber) => {
    const formatted = String(tableNumber).padStart(2, '0');
    setCurrentTable(formatted);
    setUser(prev => ({ ...prev, currentTable: formatted }));
  };

  // Navigation function
  const navigate = (view, param = null) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'product-details' && param) {
      setSelectedProductId(param);
      window.location.hash = `#/product/${param}`;
      setCurrentView('product-details');
      return;
    }
    if (view === 'tracking' && param) {
      setSelectedOrderId(param);
      window.location.hash = `#/tracking/${param}`;
      setCurrentView('tracking');
      return;
    }
    window.location.hash = `#/${view}`;
    setCurrentView(view);
  };

  // Toast notifier
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Calculate customized drink/snack price
  const calculateItemPrice = (product, options) => {
    let price = product.price;

    if (options.size && options.size.includes('Large')) price += 20;
    if (options.size && options.size.includes('Kettle')) price += 60;

    if (options.sugar && options.sugar.includes('Jaggery')) price += 10;
    if (options.sugar && options.sugar.includes('Honey')) price += 15;

    if (options.milk && options.milk.includes('Oat')) price += 25;

    if (options.addOns && Array.isArray(options.addOns)) {
      options.addOns.forEach(addonName => {
        if (addonName.includes('Cheese')) price += 25;
        else if (addonName.includes('Gelato')) price += 30;
        else price += 10;
      });
    }

    return price;
  };

  // Add to cart
  const addToCart = (product, options, quantity = 1) => {
    const unitPrice = calculateItemPrice(product, options);
    const optionsSignature = JSON.stringify(options);
    const cartItemId = `${product.id}-${btoa(unescape(encodeURIComponent(optionsSignature))).substring(0, 10)}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: unitPrice * newQty
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            productId: product.id,
            name: product.name,
            categoryName: product.categoryName,
            isVeg: product.isVeg !== false,
            image: product.image,
            unitPrice,
            totalPrice: unitPrice * quantity,
            quantity,
            prepTime: product.prepTime || '4-5 mins',
            options: { ...options }
          }
        ];
      }
    });

    showToast(`Added ${product.name} to your order!`);
  };

  const updateCartQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: item.unitPrice * newQuantity
            }
          : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Item removed from order', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedReward(null);
  };

  // Cart financial calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const tax = Number((cartSubtotal * (settings.taxRatePercent / 100)).toFixed(2));
  
  const discount = appliedReward ? Math.min(cartSubtotal, appliedReward.discountAmount || 10) : 0;
  const finalTotal = Math.max(0, Number((cartSubtotal + tax - discount).toFixed(2)));

  const applyReward = (reward) => {
    setAppliedReward(reward);
    showToast(`Applied ${reward.title}: ₹${reward.discountAmount} OFF!`);
  };

  const removeReward = () => {
    setAppliedReward(null);
    showToast('Reward discount removed', 'info');
  };

  // Place Table Dine-in Order
  const placeOrder = async (targetTableNumber, kitchenNotes = '') => {
    if (cart.length === 0) {
      showToast('Your order is empty!', 'error');
      return null;
    }

    const tableNum = String(targetTableNumber || currentTable || '01').padStart(2, '0');
    setCurrentTable(tableNum);

    const newOrderId = `TG-${Math.floor(1025 + Math.random() * 8975)}`;
    const now = new Date().toISOString();

    const newOrder = {
      id: newOrderId,
      tableNumber: tableNum,
      date: now,
      customerName: user.name || 'Diner',
      customerPhone: user.phone || '+91 98765 43210',
      orderType: `Dine-in (Table ${tableNum})`,
      items: cart.map(item => ({
        id: item.productId,
        name: item.name,
        price: item.unitPrice,
        quantity: item.quantity,
        isVeg: item.isVeg,
        image: item.image,
        options: item.options,
        itemTotal: item.totalPrice
      })),
      subtotal: cartSubtotal,
      tax,
      discount,
      total: finalTotal,
      status: 'placed',
      estimatedPrepTime: '4–5 minutes',
      kitchenNotes: kitchenNotes || specialKitchenInstructions || 'Table self-order via QR',
      timeline: [
        { status: 'placed', title: `Order Placed for Table ${tableNum}`, time: 'Just now', completed: true },
        { status: 'accepted', title: 'Accepted by Kitchen', time: 'In ~1 min', completed: false },
        { status: 'preparing', title: 'Master Brewer Preparing & Steeping', time: 'In ~3 mins', completed: false },
        { status: 'ready', title: `Ready on Counter! Staff bringing to Table ${tableNum}`, time: 'In ~5 mins', completed: false },
        { status: 'delivered', title: `Delivered to Table ${tableNum} · Enjoy! 🎉`, time: 'In ~6 mins', completed: false }
      ]
    };

    // Update active orders locally
    setOrders(prev => [newOrder, ...prev]);

    // Send to Backend API
    api.createOrder(newOrder).catch(e => console.warn('Order API sync error:', e));

    // Update Table status to order_active
    setTables(prev =>
      prev.map(t =>
        t.number === tableNum
          ? { ...t, status: 'order_active', activeOrderId: newOrderId }
          : t
      )
    );
    api.updateTableStatus(tableNum, 'order_active').catch(e => console.warn('Table API sync error:', e));

    // If a reward was used, mark as redeemed
    if (appliedReward) {
      setUser(prev => ({
        ...prev,
        unlockedRewards: (Array.isArray(prev?.unlockedRewards) ? prev.unlockedRewards : []).map(r =>
          r.id === appliedReward.id ? { ...r, isRedeemed: true } : r
        )
      }));
    }

    // Celebration confetti
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    // Clear cart and route to live tracking
    clearCart();
    setSelectedOrderId(newOrderId);
    showToast(`Order #${newOrderId} sent to Kitchen for Table ${tableNum}!`);
    navigate('tracking', newOrderId);

    // Simulate real-time restaurant kitchen workflow
    simulateKitchenProgress(newOrderId, tableNum);

    return newOrder;
  };

  // Real-time kitchen status simulator
  const simulateKitchenProgress = (orderId, tableNum) => {
    setTimeout(() => {
      setOrders(prev => prev.map(ord => {
        if (ord.id === orderId && ord.status === 'placed') {
          const updatedTimeline = ord.timeline.map(t => t.status === 'accepted' ? { ...t, completed: true, time: 'Accepted just now' } : t);
          api.updateOrderStatus(orderId, 'accepted', updatedTimeline).catch(console.warn);
          return {
            ...ord,
            status: 'accepted',
            timeline: updatedTimeline
          };
        }
        return ord;
      }));
    }, 8000);

    setTimeout(() => {
      setOrders(prev => prev.map(ord => {
        if (ord.id === orderId && ord.status === 'accepted') {
          const updatedTimeline = ord.timeline.map(t => t.status === 'preparing' ? { ...t, completed: true, time: 'Now brewing & cooking' } : t);
          api.updateOrderStatus(orderId, 'preparing', updatedTimeline).catch(console.warn);
          return {
            ...ord,
            status: 'preparing',
            timeline: updatedTimeline
          };
        }
        return ord;
      }));
    }, 18000);

    setTimeout(() => {
      setOrders(prev => prev.map(ord => {
        if (ord.id === orderId && ord.status === 'preparing') {
          const updatedTimeline = ord.timeline.map(t => t.status === 'ready' ? { ...t, completed: true, time: `Ready for Table ${tableNum}` } : t);
          api.updateOrderStatus(orderId, 'ready', updatedTimeline).catch(console.warn);
          return {
            ...ord,
            status: 'ready',
            timeline: updatedTimeline
          };
        }
        return ord;
      }));
    }, 34000);

    setTimeout(() => {
      markOrderDelivered(orderId);
    }, 50000);
  };

  // Mark order as delivered
  const markOrderDelivered = (orderId) => {
    setOrders(prev => {
      let targetOrder = null;
      const updated = prev.map(ord => {
        if (ord.id === orderId && ord.status !== 'delivered') {
          targetOrder = ord;
          const updatedTimeline = ord.timeline.map(t => ({ ...t, completed: true, time: t.status === 'delivered' ? 'Delivered to Table' : t.time }));
          api.updateOrderStatus(orderId, 'delivered', updatedTimeline).catch(console.warn);
          return {
            ...ord,
            status: 'delivered',
            timeline: updatedTimeline
          };
        }
        return ord;
      });

      if (targetOrder) {
        setUser(u => {
          const newCompletedCount = (u?.completedOrdersCount || 0) + 1;
          const unlockedNew = newCompletedCount % 10 === 0;

          const currentRewards = Array.isArray(u?.unlockedRewards) ? u.unlockedRewards : [];
          let updatedRewards = [...currentRewards];
          if (unlockedNew) {
            const rewardObj = {
              id: `rew-${Date.now()}`,
              title: '₹10 FREE ORDER REWARD',
              discountAmount: 10,
              code: `TABLE10-${Math.floor(100 + Math.random() * 900)}`,
              isUnlocked: true,
              isRedeemed: false,
              desc: '10 Completed Orders Milestone Reward! ₹10 OFF on any table order.'
            };
            updatedRewards.push(rewardObj);
            showToast('🎉 CONGRATULATIONS! You completed 10 orders and unlocked ₹10 FREE ORDER Reward!', 'success');
          }

          return {
            ...u,
            completedOrdersCount: newCompletedCount,
            unlockedRewards: updatedRewards
          };
        });
      }

      return updated;
    });
  };

  const updateOrderStatus = (orderId, newStatus) => {
    if (newStatus === 'delivered') {
      markOrderDelivered(orderId);
    } else {
      setOrders(prev => prev.map(order => {
        if (order.id === orderId) {
          const updatedTimeline = order.timeline.map(step => {
            if (step.status === newStatus) return { ...step, completed: true, time: 'Updated by Kitchen' };
            return step;
          });
          api.updateOrderStatus(orderId, newStatus, updatedTimeline).catch(console.warn);
          return { ...order, status: newStatus, timeline: updatedTimeline };
        }
        return order;
      }));
    }
    showToast(`Order #${orderId} status changed to ${newStatus.toUpperCase()}`);
  };

  const toggleFavorite = (productId) => {
    setUser(prev => {
      const isFav = prev.favoriteProductIds?.includes(productId);
      const newFavs = isFav
        ? prev.favoriteProductIds.filter(id => id !== productId)
        : [...(prev.favoriteProductIds || []), productId];
      showToast(isFav ? 'Removed from favorites' : 'Saved to favorites ❤️');
      return { ...prev, favoriteProductIds: newFavs };
    });
  };

  const addProduct = async (newProd) => {
    const id = `tg-${Math.floor(20 + Math.random() * 80)}`;
    const productToAdd = {
      ...newProd,
      id,
      rating: 5.0,
      reviewsCount: 1,
      isAvailable: true
    };
    setProducts(prev => [productToAdd, ...prev]);
    showToast(`"${newProd.name}" added to digital menu!`);

    // Sync to backend
    api.addProduct(productToAdd).catch(console.warn);
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    showToast('Menu item updated');
    api.updateProduct(id, updatedFields).catch(console.warn);
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Item removed from menu', 'info');
    api.deleteProduct(id).catch(console.warn);
  };

  const toggleProductAvailability = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const newAvail = !product.isAvailable;
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: newAvail } : p));
    showToast('Availability status updated');
    api.updateProduct(id, { isAvailable: newAvail }).catch(console.warn);
  };

  const updateTableStatus = (tableNumber, newStatus) => {
    setTables(prev => prev.map(t => t.number === tableNumber ? { ...t, status: newStatus } : t));
    showToast(`Table ${tableNumber} marked as ${newStatus}`);
    api.updateTableStatus(tableNumber, newStatus).catch(console.warn);
  };

  const updateRestaurantSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    api.updateSettings(newSettings).catch(console.warn);
    showToast('Restaurant settings saved to database');
  };

  const openCustomerAuth = (initialMode = 'login') => {
    setAuthModalMode(initialMode);
    setIsAuthModalOpen(true);
  };

  const openAdminAuth = () => {
    setAuthModalMode('admin');
    setIsAuthModalOpen(true);
  };

  const logoutUser = () => {
    const guestUser = {
      id: '',
      name: 'Guest Diner',
      email: '',
      phone: '',
      isLoggedIn: false,
      role: 'customer',
      loyaltyTier: 'Guest Diner',
      completedOrdersCount: 0,
      unlockedRewards: [],
      favoriteProductIds: []
    };
    setUser(guestUser);
    localStorage.removeItem('teago_user');
    showToast('Logged out successfully');
  };

  return (
    <AppContext.Provider
      value={{
        currentTable,
        switchTable,
        tables,
        updateTableStatus,
        isQRModalOpen,
        setIsQRModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openCustomerAuth,
        openAdminAuth,
        logoutUser,

        currentView,
        setCurrentView,
        navigate,
        selectedProductId,
        setSelectedProductId,
        selectedOrderId,
        setSelectedOrderId,
        customizingProduct,
        setCustomizingProduct,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,

        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartItemCount,
        tax,
        discount,
        finalTotal,
        appliedReward,
        applyReward,
        removeReward,
        specialKitchenInstructions,
        setSpecialKitchenInstructions,
        calculateItemPrice,

        orders,
        placeOrder,
        updateOrderStatus,
        markOrderDelivered,

        user,
        setUser,
        toggleFavorite,

        customers,
        settings,
        setSettings: updateRestaurantSettings,
        backendStatus,

        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
