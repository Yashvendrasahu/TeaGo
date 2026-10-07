import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ArrowLeft, Filter, CheckCircle2, Clock, Check, XCircle, Flame, QrCode } from 'lucide-react';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, navigate } = useApp();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'placed', 'accepted', 'preparing', 'ready', 'delivered', 'cancelled'

  const filteredOrders = orders.filter(o => {
    if (activeTab !== 'all' && o.status !== activeTab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchTable = (o.tableNumber || '').includes(q);
      const matchCustomer = (o.customerName || '').toLowerCase().includes(q);
      if (!matchId && !matchTable && !matchCustomer) return false;
    }
    return true;
  });

  const getStatusCount = (st) => {
    if (st === 'all') return orders.length;
    return orders.filter(o => o.status === st).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('admin-dashboard')}
            className="p-2 rounded-xl hover:bg-stone-200 text-stone-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Restaurant Kitchen Order Line
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Live table orders, steeping status transitions & waiter delivery alerts
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search #TG or Table..."
            className="pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-white text-xs w-64"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Orders' },
          { id: 'placed', label: 'New Orders' },
          { id: 'accepted', label: 'Accepted' },
          { id: 'preparing', label: 'Preparing' },
          { id: 'ready', label: 'Ready for Table' },
          { id: 'delivered', label: 'Completed' },
          { id: 'cancelled', label: 'Cancelled' }
        ].map(tab => {
          const count = getStatusCount(tab.id);
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className={`bg-white rounded-2xl border p-5 space-y-4 shadow-2xs transition-all ${
                order.status === 'placed'
                  ? 'border-amber-400 ring-2 ring-amber-300'
                  : order.status === 'ready'
                  ? 'border-sky-300 bg-sky-50/20'
                  : 'border-stone-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-bold text-stone-900">#{order.id}</span>
                  <span className="text-stone-300">·</span>
                  <span className="font-bold text-xs bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-md border border-amber-300">
                    Table {order.tableNumber}
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-xs text-stone-500">
                    {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Status selector & Action Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-700">Kitchen Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-bold focus:outline-none focus:border-[#2D4739]"
                  >
                    <option value="placed">1. New Order (Placed)</option>
                    <option value="accepted">2. Order Accepted</option>
                    <option value="preparing">3. Preparing in Kitchen</option>
                    <option value="ready">4. Ready for Table {order.tableNumber}</option>
                    <option value="delivered">5. Delivered to Table</option>
                    <option value="cancelled">Cancelled / Rejected</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                {/* Items & Options */}
                <div className="md:col-span-8 space-y-2">
                  <div className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                    Table Items ({order.items.length})
                  </div>
                  <div className="space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex justify-between items-start">
                        <div>
                          <div className="font-bold text-stone-900">{item.quantity}× {item.name}</div>
                          <div className="text-stone-500 text-[11px] mt-0.5">
                            {item.options?.size} · {item.options?.temperature} · {item.options?.sugar}
                          </div>
                          {item.options?.addOns?.length > 0 && (
                            <div className="text-emerald-800 text-[10px] font-semibold mt-0.5">
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
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 italic text-[11px]">
                      Chef Note: {order.kitchenNotes}
                    </div>
                  )}
                </div>

                {/* Table Billing Summary */}
                <div className="md:col-span-4 bg-stone-50/80 p-4 rounded-xl border border-stone-200 space-y-2 text-right">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Table Amount</span>
                  <div className="font-mono text-2xl font-bold text-stone-900">₹{order.total}</div>
                  <div className="text-[11px] text-stone-500">Subtotal ₹{order.subtotal} + 5% GST</div>
                  
                  <div className="pt-3 border-t border-stone-200 space-y-1">
                    {order.status === 'placed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'accepted')}
                        className="w-full py-2 bg-[#2D4739] text-white rounded-lg text-xs font-bold hover:bg-[#23382D]"
                      >
                        Accept Order
                      </button>
                    )}
                    {order.status === 'accepted' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="w-full py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="w-full py-2 bg-sky-600 text-white rounded-lg text-xs font-bold hover:bg-sky-700"
                      >
                        Mark Ready for Table {order.tableNumber}
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="w-full py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800"
                      >
                        Confirm Delivered to Table {order.tableNumber}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 text-xs text-stone-500">
            No orders in this category.
          </div>
        )}
      </div>

    </div>
  );
}
