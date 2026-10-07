import React from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Users,
  BarChart3,
  Settings,
  QrCode,
  Flame,
  Check,
  XCircle,
  Utensils,
  ShieldCheck,
  Lock
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { orders, updateOrderStatus, products, customers, tables, navigate, showToast, user, openAdminAuth } = useApp();

  if (!user?.isLoggedIn || user?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-stone-900 text-amber-300 flex items-center justify-center mx-auto text-2xl shadow-lg border border-stone-800">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Restaurant Admin Access Required
          </h2>
          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            The Kitchen Dashboard and Table Management portal are restricted to verified staff and cafe administrators.
          </p>
        </div>
        <div className="pt-3 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={openAdminAuth}
            className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign In with Admin Credentials</span>
          </button>
          <button
            onClick={() => navigate('home')}
            className="px-5 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-xs"
          >
            Return to Customer Menu
          </button>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const newOrders = orders.filter(o => o.status === 'placed');
  const acceptedOrders = orders.filter(o => o.status === 'accepted');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  const avgTicket = orders.length > 0 ? (totalRevenue / orders.length).toFixed(0) : '0';

  const occupiedTables = tables.filter(t => t.status !== 'available').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            TeaGo Kitchen & POS Operations
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
            Restaurant Admin Dashboard
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time table orders queue, kitchen steeping line, and sales metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('admin-tables')}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Tables 01–20 QR</span>
          </button>
          <button
            onClick={() => navigate('admin-products')}
            className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
            <span>Today&apos;s Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
            ₹{totalRevenue}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 5% GST Included
          </div>
        </div>

        {/* Live Active Kitchen Queue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
            <span>Kitchen Queue</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
            {preparingOrders.length + newOrders.length + acceptedOrders.length} orders
          </div>
          <div className="text-[11px] text-amber-800 font-medium">
            {readyOrders.length} ready for table delivery
          </div>
        </div>

        {/* Occupied Dining Tables */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
            <span>Table Occupancy</span>
            <QrCode className="w-4 h-4 text-sky-600" />
          </div>
          <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
            {occupiedTables} / {tables.length} Tables
          </div>
          <div className="text-[11px] text-stone-500">
            {tables.length - occupiedTables} tables available
          </div>
        </div>

        {/* Avg Prep Time & Ticket */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
            <span>Avg Ticket / Prep Time</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
            ₹{avgTicket} · 4.5m
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            Fast QR turnaround
          </div>
        </div>

      </div>

      {/* Live Table Orders Action Queue */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden space-y-4">
        
        <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Live Kitchen Order Queue (Dine-in Tables)
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Instant one-click transitions: Accept → Preparing → Ready → Delivered to Table
            </p>
          </div>

          <button
            onClick={() => navigate('admin-orders')}
            className="text-xs font-bold text-[#2D4739] hover:underline"
          >
            All Order Logs ({orders.length}) →
          </button>
        </div>

        {/* Live Order Cards */}
        <div className="p-5 space-y-4">
          {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').map(order => (
                <div
                  key={order.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    order.status === 'placed'
                      ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400'
                      : order.status === 'ready'
                      ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-300'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-stone-900">
                        #{order.id}
                      </span>
                      <span className="font-bold text-xs bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-md">
                        Table {order.tableNumber}
                      </span>
                    </div>

                    <span className="font-bold text-xs capitalize text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-200">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Items breakdown */}
                  <div className="space-y-1.5 text-xs">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-start bg-white p-2 rounded-lg border border-stone-100">
                        <div>
                          <span className="font-bold text-stone-900">{item.quantity}× {item.name}</span>
                          <div className="text-[11px] text-stone-500">
                            {item.options?.size} · {item.options?.temperature} · {item.options?.sugar}
                          </div>
                          {item.options?.addOns?.length > 0 && (
                            <div className="text-[10px] text-emerald-800 font-semibold">
                              + {item.options.addOns.join(', ')}
                            </div>
                          )}
                        </div>
                        <span className="font-mono font-bold text-stone-900">
                          ₹{(item.itemTotal || item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.kitchenNotes && (
                    <div className="text-[11px] text-stone-600 bg-white p-2 rounded-lg border border-stone-200 italic">
                      Note: {order.kitchenNotes}
                    </div>
                  )}

                  {/* Action transitions */}
                  <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-sm text-stone-900">Total: ₹{order.total}</span>

                    <div className="flex items-center gap-1.5">
                      {order.status === 'placed' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'accepted')}
                            className="px-3 py-1.5 bg-[#2D4739] hover:bg-[#23382D] text-white text-xs font-bold rounded-lg"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold rounded-lg"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {order.status === 'accepted' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg"
                        >
                          Mark as Preparing
                        </button>
                      )}

                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg"
                        >
                          Mark Ready (Bring to Table {order.tableNumber})
                        </button>
                      )}

                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Delivered to Table {order.tableNumber}</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-stone-500 bg-stone-50 rounded-xl">
              All active table orders have been prepared and delivered! 🍃
            </div>
          )}
        </div>

      </div>

      {/* Admin Shortcuts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <button
          onClick={() => navigate('admin-tables')}
          className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 text-left transition-all space-y-2 shadow-2xs group"
        >
          <div className="flex justify-between items-center">
            <span className="font-serif text-base font-bold text-stone-900">Table Management (20)</span>
            <QrCode className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
          </div>
          <p className="text-xs text-stone-500">
            Preview, download & print Table QR codes (Tables 01 to 20).
          </p>
        </button>

        <button
          onClick={() => navigate('admin-products')}
          className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 text-left transition-all space-y-2 shadow-2xs group"
        >
          <div className="flex justify-between items-center">
            <span className="font-serif text-base font-bold text-stone-900">Digital Menu ({products.length})</span>
            <Utensils className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
          </div>
          <p className="text-xs text-stone-500">
            Update pricing in ₹, edit items, or toggle in-stock availability.
          </p>
        </button>

        <button
          onClick={() => navigate('admin-analytics')}
          className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 text-left transition-all space-y-2 shadow-2xs group"
        >
          <div className="flex justify-between items-center">
            <span className="font-serif text-base font-bold text-stone-900">Restaurant Analytics</span>
            <BarChart3 className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
          </div>
          <p className="text-xs text-stone-500">
            Track daily peak hours, popular chai varietals, and average preparation speeds.
          </p>
        </button>
      </div>

    </div>
  );
}
