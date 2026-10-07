import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TeaIllustration from '../components/TeaIllustration';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Bell,
  ArrowLeft,
  Sparkles,
  Receipt,
  UtensilsCrossed,
  Flame,
  Check
} from 'lucide-react';

export default function TrackingPage() {
  const {
    orders,
    selectedOrderId,
    setSelectedOrderId,
    navigate,
    showToast,
    addToCart,
    products,
    currentTable
  } = useApp();

  const [searchIdInput, setSearchIdInput] = useState('');
  const [waiterCalled, setWaiterCalled] = useState(false);

  // Current order to track
  const currentOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const handleSearchOrder = (e) => {
    e.preventDefault();
    const found = orders.find(o => o.id.toUpperCase() === searchIdInput.trim().toUpperCase());
    if (found) {
      setSelectedOrderId(found.id);
      setSearchIdInput('');
    } else {
      showToast(`Order #${searchIdInput} not found`, 'error');
    }
  };

  const handleCallStaff = () => {
    setWaiterCalled(true);
    showToast(`Staff alerted for Table ${currentOrder?.tableNumber || currentTable}! A waiter is on their way.`);
    setTimeout(() => setWaiterCalled(false), 8000);
  };

  const handleReorder = () => {
    if (!currentOrder) return;
    currentOrder.items.forEach(item => {
      const matchProduct = products.find(p => p.id === item.id) || products[0];
      addToCart(matchProduct, item.options, item.quantity);
    });
    navigate('cart');
  };

  if (!currentOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">No Active Order</h2>
        <p className="text-xs text-stone-500">
          No active order found. Browse the digital menu to select items and place an order.
        </p>
        <button
          onClick={() => navigate('menu')}
          className="px-5 py-2.5 rounded-xl bg-[#2D4739] text-white text-xs font-semibold"
        >
          Open Digital Menu
        </button>
      </div>
    );
  }

  const isDelivered = currentOrder.status === 'delivered';
  const isReady = currentOrder.status === 'ready';
  const isPreparing = currentOrder.status === 'preparing';
  const isAccepted = currentOrder.status === 'accepted';
  const isPlaced = currentOrder.status === 'placed';

  // Status text message
  const getStatusMessage = () => {
    if (isDelivered) return `Your order has been delivered to Table ${currentOrder.tableNumber}. Enjoy your meal! 🎉`;
    if (isReady) return `Your order is ready! Restaurant staff is bringing it to Table ${currentOrder.tableNumber}.`;
    if (isPreparing) return `Your order is being freshly prepared by the kitchen chef.`;
    if (isAccepted) return `Order accepted by kitchen. Preparing fresh brews shortly.`;
    return `Order placed successfully from Table ${currentOrder.tableNumber}. Waiting for kitchen acknowledgment.`;
  };

  const getStatusBadge = () => {
    switch (currentOrder.status) {
      case 'delivered':
        return { label: 'Delivered to Table', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'ready':
        return { label: 'Ready for Table Service', bg: 'bg-sky-100 text-sky-900 border-sky-300 animate-pulse' };
      case 'preparing':
        return { label: 'Preparing in Kitchen', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'accepted':
        return { label: 'Accepted by Kitchen', bg: 'bg-purple-100 text-purple-900 border-purple-300' };
      default:
        return { label: 'Order Placed', bg: 'bg-stone-100 text-stone-800 border-stone-300' };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('orders')}
            className="p-2 rounded-xl hover:bg-stone-200 text-stone-600 transition-colors"
            title="View all table orders"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Order #{currentOrder.id}
              </h1>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Dine-in for <strong className="text-stone-900">Table {currentOrder.tableNumber}</strong> · Placed at {new Date(currentOrder.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Order search */}
        <form onSubmit={handleSearchOrder} className="flex items-center gap-2">
          <input
            type="text"
            value={searchIdInput}
            onChange={(e) => setSearchIdInput(e.target.value)}
            placeholder="Track #TG-XXXX"
            className="px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-white font-mono uppercase focus:outline-none focus:border-[#2D4739]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800"
          >
            Track
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Live Kitchen Status Card & Timeline */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Main Status Callout */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                  isDelivered ? 'bg-emerald-100 text-emerald-800' : isReady ? 'bg-sky-100 text-sky-800 animate-bounce' : 'bg-amber-100 text-amber-900'
                }`}>
                  {isDelivered ? '🎉' : isReady ? '🔔' : <Flame className="w-6 h-6 text-amber-700 animate-pulse" />}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                    Estimated Prep Time
                  </span>
                  <div className="font-mono text-xl font-bold text-stone-900">
                    {isDelivered ? 'Completed & Served' : currentOrder.estimatedPrepTime || '4–5 minutes'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">Table Number</span>
                <span className="font-mono text-xl font-bold text-amber-900 bg-amber-50 px-3 py-0.5 rounded-lg border border-amber-200">
                  T{currentOrder.tableNumber}
                </span>
              </div>
            </div>

            {/* Live Message Prompt */}
            <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
              isDelivered ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' :
              isReady ? 'bg-sky-50 text-sky-900 border border-sky-200' :
              'bg-amber-50 text-amber-950 border border-amber-200'
            }`}>
              {getStatusMessage()}
            </div>

            {/* Timeline Stepper */}
            <div className="pt-2 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Kitchen Stepping Timeline
              </h3>

              <div className="relative space-y-5 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                {currentOrder.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all z-10 ${
                        step.completed
                          ? 'bg-[#2D4739] text-white ring-4 ring-emerald-50'
                          : 'bg-stone-100 text-stone-400 border border-stone-300'
                      }`}
                    >
                      {step.completed ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1 flex items-center justify-between text-xs">
                      <div>
                        <h4 className={`font-bold ${step.completed ? 'text-stone-900' : 'text-stone-400'}`}>
                          {step.title}
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-stone-500 tabular-nums">
                        {step.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Staff Assistance Button */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                <Bell className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Need Table Assistance?</h4>
                <p className="text-[11px] text-stone-500">Call restaurant waiter or request extra water/cutlery.</p>
              </div>
            </div>

            <button
              onClick={handleCallStaff}
              disabled={waiterCalled}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                waiterCalled
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
            >
              {waiterCalled ? 'Staff Alerted!' : 'Call Waiter'}
            </button>
          </div>

        </div>

        {/* Right: Ordered Items & Bill Summary */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Order Items ({currentOrder.items.length})
              </h3>
              <span className="text-xs font-mono font-bold text-stone-900">
                Table {currentOrder.tableNumber}
              </span>
            </div>

            <div className="space-y-3 divide-y divide-stone-100 max-h-64 overflow-y-auto pr-1">
              {currentOrder.items.map((item, i) => (
                <div key={i} className="pt-3 first:pt-0 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stone-100 shrink-0 overflow-hidden flex items-center justify-center">
                    <TeaIllustration id={item.id} className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-stone-900 truncate">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-900 tabular-nums">
                        ₹{(item.itemTotal || item.price * item.quantity)}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5 truncate">
                      {item.options?.size} · {item.options?.temperature} · {item.options?.sugar}
                    </div>
                    {item.options?.addOns?.length > 0 && (
                      <div className="text-[10px] text-emerald-800 font-medium">
                        + {item.options.addOns.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-stone-900">₹{currentOrder.subtotal}</span>
              </div>
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Milestone Reward</span>
                  <span className="font-mono">-₹{currentOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Restaurant GST (5%)</span>
                <span className="font-mono text-stone-900">₹{currentOrder.tax}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-100 text-sm">
                <span>Total Amount</span>
                <span className="font-mono text-base tabular-nums">₹{currentOrder.total}</span>
              </div>
            </div>

            {/* Reorder / Add More Items */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => navigate('menu')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2D4739] hover:bg-[#23382D] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Order More Items for Table {currentOrder.tableNumber}</span>
              </button>

              <button
                onClick={handleReorder}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reorder Exact Items</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
