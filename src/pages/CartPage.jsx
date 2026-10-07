import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TeaIllustration from '../components/TeaIllustration';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Gift,
  CheckCircle2,
  Sparkles,
  QrCode,
  UtensilsCrossed,
  Clock,
  Receipt,
  AlertCircle,
  LogIn
} from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    tax,
    discount,
    finalTotal,
    appliedReward,
    applyReward,
    removeReward,
    specialKitchenInstructions,
    placeOrder,
    navigate,
    currentTable,
    tables,
    user,
    openCustomerAuth,
    showToast
  } = useApp();

  const [tableNumberInput, setTableNumberInput] = useState(currentTable || '');
  const [tableError, setTableError] = useState('');
  const [paymentOption, setPaymentOption] = useState('pay_after_meal'); // 'pay_after_meal' | 'upi_counter'
  const [kitchenNote, setKitchenNote] = useState(specialKitchenInstructions || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available rewards
  const availableReward = user.unlockedRewards?.find(r => r.isUnlocked && !r.isRedeemed);

  const handleTableSelect = (num) => {
    setTableNumberInput(num);
    setTableError('');
  };

  const handleCheckout = () => {
    const formatted = tableNumberInput.trim();
    if (!formatted) {
      setTableError('Please enter or select your Table Number to proceed.');
      showToast('Please specify your Table Number', 'error');
      // Scroll to table input
      const el = document.getElementById('table-number-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setTableError('');
    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder(formatted, kitchenNote);
      setIsSubmitting(false);
    }, 450);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#2D4739] flex items-center justify-center mx-auto text-2xl">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Your Order is Empty
          </h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Explore our digital menu to add hot kulhad chai, artisan coffees, and crispy snacks directly from your phone.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => navigate('menu')}
            className="px-6 py-3 rounded-xl bg-[#2D4739] hover:bg-[#23382D] text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs"
          >
            Browse Digital Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Table Banner Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2D4739] border border-emerald-200 flex items-center justify-center font-bold text-lg">
            <UtensilsCrossed className="w-5 h-5 text-[#2D4739]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                Dine-in Order Checkout
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Review your items, enter your Table Number below, and place your order directly to the kitchen.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearCart}
            className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold"
          >
            Clear Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Itemized Order List & Table Number Entry */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Selected Food & Drinks */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden divide-y divide-stone-100 shadow-2xs">
            <div className="p-4 bg-stone-50/70 border-b border-stone-100 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-stone-600">
              <span>Selected Food & Drinks ({cart.length})</span>
              <span className="text-emerald-800">Dine-in Mode</span>
            </div>

            {cart.map((item, idx) => (
              <div key={item.cartItemId || `${item.productId}-${idx}`} className="p-4 flex items-start gap-3.5">
                
                {/* Visual */}
                <div className="w-14 h-14 rounded-xl bg-stone-100 shrink-0 overflow-hidden flex items-center justify-center">
                  <TeaIllustration
                    image={item.image}
                    id={item.productId}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      <div className="w-2.5 h-2.5 border border-emerald-600 rounded-2xs flex items-center justify-center shrink-0">
                        <div className="w-1 h-1 rounded-full bg-emerald-600" />
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                        {item.name}
                      </h3>
                    </div>
                    <span className="font-mono text-xs sm:text-sm font-bold text-stone-900 tabular-nums">
                      ₹{item.totalPrice}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="text-[11px] text-stone-500 space-y-0.5">
                    <div>{item.options.size} · {item.options.temperature} · {item.options.sugar}</div>
                    {item.options.addOns && item.options.addOns.length > 0 && (
                      <div className="text-emerald-800 font-medium">
                        + {item.options.addOns.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Stepper */}
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-white text-stone-600"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold font-mono text-stone-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-white text-stone-600"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-stone-400 hover:text-rose-600 p-1 text-xs transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Remove</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Table Number Entry Section (Crucial Step for final order placement) */}
          <div
            id="table-number-section"
            className={`p-5 rounded-2xl border transition-all shadow-2xs space-y-4 ${
              tableError
                ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200'
                : 'bg-white border-stone-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Enter Your Table Number</span>
                  <span className="text-rose-600 text-xs">*</span>
                </label>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Check the stand or QR sticker on your table to enter your table number.
                </p>
              </div>

              {tableNumberInput && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-mono font-bold text-xs">
                  Table {tableNumberInput}
                </span>
              )}
            </div>

            {/* Input Field */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={5}
                  value={tableNumberInput}
                  onChange={(e) => {
                    setTableNumberInput(e.target.value);
                    if (tableError) setTableError('');
                  }}
                  placeholder="Type table number (e.g. 07, 12, 03)"
                  className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#2D4739] focus:ring-1 focus:ring-[#2D4739]"
                />
              </div>

              {tableNumberInput && (
                <button
                  type="button"
                  onClick={() => setTableNumberInput('')}
                  className="p-3 text-xs text-stone-400 hover:text-stone-600 bg-stone-100 rounded-xl"
                  title="Clear table number"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Error message */}
            {tableError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-700 font-semibold bg-rose-100/70 px-3 py-2 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{tableError}</span>
              </div>
            )}

            {/* Quick Table Selector Chips */}
            <div className="space-y-1.5 pt-1 border-t border-stone-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Or Tap to Select Table:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {tables.map((table, idx) => {
                  const isSelected = String(tableNumberInput).padStart(2, '0') === table.number;
                  return (
                    <button
                      key={table.number || `table-chip-${idx}`}
                      type="button"
                      onClick={() => handleTableSelect(table.number)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        isSelected
                          ? 'bg-[#2D4739] text-white shadow-xs scale-105'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200/60'
                      }`}
                    >
                      {table.number}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Kitchen Instructions Input */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              Instructions for Kitchen Chef (Optional)
            </label>
            <input
              type="text"
              value={kitchenNote}
              onChange={(e) => setKitchenNote(e.target.value)}
              placeholder="e.g. Serve chai first, extra hot, less spice in samosa..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#2D4739]"
            />
          </div>

        </div>

        {/* Right Column: Rewards & Order Confirmation */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Rewards Application Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-amber-600" />
                <span>Dining Rewards</span>
              </h3>
              {user?.isLoggedIn && (
                <span className="text-[11px] font-bold text-stone-500">
                  {user.completedOrdersCount}/10 Completed
                </span>
              )}
            </div>

            {user?.isLoggedIn ? (
              appliedReward ? (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-900">{appliedReward.title}</span>
                    <div className="text-[11px] text-emerald-700">₹{appliedReward.discountAmount} discount applied</div>
                  </div>
                  <button
                    onClick={removeReward}
                    className="text-xs font-bold text-emerald-900 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : availableReward ? (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-950">🎉 Reward Available!</span>
                    <div className="text-[11px] text-amber-800">Use ₹10 OFF on this order</div>
                  </div>
                  <button
                    onClick={() => applyReward(availableReward)}
                    className="px-3 py-1 bg-amber-400 text-stone-950 rounded-lg text-xs font-bold hover:bg-amber-300"
                  >
                    Apply ₹10 OFF
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-stone-500">
                  Complete {10 - ((user.completedOrdersCount || 0) % 10)} more orders to unlock your next ₹10 reward.
                </p>
              )
            ) : (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-2">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>₹10 Welcome Gift Available!</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Sign in or create an account to unlock your ₹10 Welcome Voucher and earn free chai for every 10 table orders!
                </p>
                <button
                  type="button"
                  onClick={() => openCustomerAuth('login')}
                  className="w-full py-2 bg-[#2D4739] text-white rounded-lg text-xs font-bold hover:bg-[#23382D] transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login / Create Account</span>
                </button>
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Payment Preference
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentOption('pay_after_meal')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentOption === 'pay_after_meal'
                    ? 'bg-[#2D4739] text-white border-[#2D4739] shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                }`}
              >
                <div className="font-bold">Pay After Meal</div>
                <div className={`text-[10px] mt-0.5 ${paymentOption === 'pay_after_meal' ? 'text-emerald-100' : 'text-stone-400'}`}>
                  Cash / UPI at Table Counter
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentOption('upi_counter')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentOption === 'upi_counter'
                    ? 'bg-[#2D4739] text-white border-[#2D4739] shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                }`}
              >
                <div className="font-bold">UPI / Card at Counter</div>
                <div className={`text-[10px] mt-0.5 ${paymentOption === 'upi_counter' ? 'text-emerald-100' : 'text-stone-400'}`}>
                  GPay / PhonePe / Paytm
                </div>
              </button>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-stone-700 border-b border-stone-100 pb-2">
              Bill Summary {tableNumberInput ? `· Table ${tableNumberInput}` : ''}
            </h3>

            <div className="space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono text-stone-900 font-semibold">₹{cartSubtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Milestone Reward</span>
                  <span className="font-mono">-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Restaurant GST (5%)</span>
                <span className="font-mono text-stone-900 font-semibold">₹{tax}</span>
              </div>

              <div className="pt-2.5 border-t border-stone-200 flex justify-between items-baseline font-bold text-stone-900">
                <span className="text-sm">Final Amount</span>
                <span className="font-mono text-xl tabular-nums">₹{finalTotal}</span>
              </div>
            </div>

            {/* If NOT logged in: Prompt to Login / Create Account for Rewards & Discount */}
            {!user?.isLoggedIn && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 space-y-2 text-stone-900">
                <div className="flex items-start gap-2">
                  <span className="text-base">🎁</span>
                  <div>
                    <div className="font-bold text-xs text-amber-950">
                      Apply ₹10 Discount & Track Milestone Rewards
                    </div>
                    <p className="text-[11px] text-amber-900 leading-tight mt-0.5">
                      Login or Create an Account before ordering to track your free rewards and use vouchers!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openCustomerAuth('login')}
                  className="w-full py-2 px-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg text-xs transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login / Create Account to Apply Discount</span>
                </button>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full mt-3 py-3.5 px-6 rounded-xl bg-[#2D4739] hover:bg-[#23382D] text-white font-bold text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Sending to Kitchen...</span>
              ) : (
                <>
                  <span>
                    {tableNumberInput
                      ? `Place Order for Table ${tableNumberInput}`
                      : 'Enter Table Number & Place Order'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[10px] text-stone-400 text-center">
              Order will be sent instantly to the restaurant kitchen dashboard.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
