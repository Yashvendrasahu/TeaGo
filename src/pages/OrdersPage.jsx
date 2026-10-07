import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TeaIllustration from '../components/TeaIllustration';
import {
  RotateCcw,
  Receipt,
  Star,
  Clock,
  ChevronRight,
  ArrowRight,
  X,
  Printer,
  QrCode,
  LogIn,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

export default function OrdersPage() {
  const { orders, navigate, addToCart, products, currentTable, user, openCustomerAuth } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'completed'
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  // Protected Route Check for Customer Orders Section
  if (!user?.isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#2D4739] text-white flex items-center justify-center mx-auto text-2xl shadow-lg">
          <Receipt className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Sign In to View Your Table Orders
          </h2>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            Please log in with your customer account to view your live table orders, download past tax invoices, and 1-click re-order your favorite chai & bites.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 max-w-md mx-auto space-y-3 text-left">
          <div className="font-bold text-xs text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Customer Order Privileges</span>
          </div>
          <ul className="text-xs text-amber-900 space-y-1.5">
            <li>🧾 Digital GST invoices & detailed table bills</li>
            <li>⏱️ Real-time kitchen preparation status for your table</li>
            <li>🎁 Milestone reward tracking (10 completed orders = ₹10 free)</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <button
            onClick={() => openCustomerAuth('login')}
            className="px-6 py-3 rounded-xl bg-[#2D4739] hover:bg-[#23382D] text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to View Orders</span>
          </button>
          <button
            onClick={() => openCustomerAuth('signup')}
            className="px-6 py-3 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-xs transition-all shadow-2xs"
          >
            Create New Account
          </button>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'active') return order.status !== 'delivered' && order.status !== 'cancelled';
    if (activeTab === 'completed') return order.status === 'delivered';
    return true;
  });

  const handleReorder = (order) => {
    order.items.forEach(item => {
      const matchProduct = products.find(p => p.id === item.id) || products[0];
      addToCart(matchProduct, item.options || {}, item.quantity);
    });
    navigate('cart');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="text-[10px] font-bold text-[#2D4739] uppercase tracking-wider">
            Restaurant Dining Logs
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
            Table Orders & Invoices
          </h1>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'all' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'active' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Active ({orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'completed' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Completed ({orders.filter(o => o.status === 'delivered').length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const isCompleted = order.status === 'delivered';
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-stone-900">
                      #{order.id}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                      Table {order.tableNumber || currentTable}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-xs text-stone-500">
                      {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md capitalize ${
                      isCompleted ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'
                    }`}>
                      {isCompleted ? 'Delivered & Completed' : order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 rounded-xl bg-stone-50/70">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 shrink-0 overflow-hidden flex items-center justify-center">
                        <TeaIllustration id={item.id} className="w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        <div className="font-bold text-stone-900 truncate">
                          {item.quantity}x {item.name}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {item.options?.size} · {item.options?.temperature} · {item.options?.sugar}
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-stone-900">
                        ₹{(item.itemTotal || item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-stone-600">
                    Total: <strong className="font-mono text-stone-900 font-bold text-sm">₹{order.total}</strong> (Table Dine-in)
                  </div>

                  <div className="flex items-center gap-2">
                    {!isCompleted ? (
                      <button
                        onClick={() => navigate('tracking', order.id)}
                        className="px-4 py-2 bg-[#2D4739] hover:bg-[#23382D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                      >
                        <span>Live Kitchen Tracking</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setSelectedReceiptOrder(order)}
                          className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1"
                        >
                          <Receipt className="w-3.5 h-3.5 text-stone-500" />
                          <span>View Invoice</span>
                        </button>
                        <button
                          onClick={() => handleReorder(order)}
                          className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reorder for Table {currentTable}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 space-y-3">
          <p className="text-xs text-stone-500">No table orders in this category.</p>
          <button
            onClick={() => navigate('menu')}
            className="px-4 py-2 bg-[#2D4739] text-white text-xs font-bold rounded-xl"
          >
            Order for Table {currentTable}
          </button>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="font-serif text-base font-bold text-stone-900">TeaGo Restaurant Invoice</span>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Order No:</span>
                <span className="font-mono font-bold text-stone-900">#{selectedReceiptOrder.id}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Dining Table:</span>
                <span className="font-bold text-amber-900">Table {selectedReceiptOrder.tableNumber}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Time:</span>
                <span className="text-stone-800">{new Date(selectedReceiptOrder.date).toLocaleString()}</span>
              </div>

              <div className="pt-3 border-t border-stone-200 space-y-2">
                {selectedReceiptOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-stone-800">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-mono">₹{(item.itemTotal || item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-200 space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{selectedReceiptOrder.subtotal}</span>
                </div>
                {selectedReceiptOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-bold">
                    <span>Milestone Reward</span>
                    <span className="font-mono">-₹{selectedReceiptOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-mono">₹{selectedReceiptOrder.tax}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-100 text-sm">
                  <span>Total Paid</span>
                  <span className="font-mono">₹{selectedReceiptOrder.total}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill</span>
              </button>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="flex-1 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
