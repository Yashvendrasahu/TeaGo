import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DrinkCard from '../components/DrinkCard';
import {
  Award,
  Gift,
  Heart,
  User,
  QrCode,
  Sparkles,
  Ticket,
  ArrowRight,
  UtensilsCrossed,
  LogIn,
  LogOut
} from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser, products, navigate, showToast, openCustomerAuth, logoutUser } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  if (!user?.isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#2D4739] text-white flex items-center justify-center mx-auto text-2xl shadow-lg">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Sign In to View Your TeaGo Profile
          </h2>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            Create an account or log in with Supabase to track your completed table orders, unlock your ₹10 Welcome Voucher, and manage saved drinks.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 max-w-md mx-auto space-y-3 text-left">
          <div className="font-bold text-xs text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Member Privileges</span>
          </div>
          <ul className="text-xs text-amber-900 space-y-1.5">
            <li>✨ Instant <strong>₹10 Welcome Gift Voucher</strong> on signup</li>
            <li>🎁 <strong>1 Free Order</strong> after every 10 completed table visits</li>
            <li>📱 Live table order preparation tracking & digital bill receipts</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <button
            onClick={() => openCustomerAuth('login')}
            className="px-6 py-3 rounded-xl bg-[#2D4739] hover:bg-[#23382D] text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Account</span>
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

  const favoriteProducts = products.filter(p => (user?.favoriteProductIds || []).includes(p.id));
  const completedOrders = user?.completedOrdersCount || 0;
  const requiredOrders = user?.requiredOrdersForReward || 10;
  const progressPercent = Math.min(100, Math.round((completedOrders / requiredOrders) * 100));
  const unlockedRewards = Array.isArray(user?.unlockedRewards) ? user.unlockedRewards : [];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser(prev => ({ ...prev, name, phone }));
    showToast('Profile information saved!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1C2C21] via-[#283E30] to-[#16241B] text-white p-6 sm:p-10 shadow-xl border border-emerald-900/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-2xl shadow-md">
            ☕
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              {user?.name || 'Patron'}
            </h1>
            <p className="text-xs text-emerald-200/80">{user?.phone || '+91 98765 43210'} · Regular Patron</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Dine-in Self-Ordering Active</span>
            </div>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-right space-y-1 sm:min-w-[220px]">
          <span className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider block">
            Milestone Progress
          </span>
          <div className="font-mono text-2xl font-bold text-amber-300">
            {completedOrders} / {requiredOrders} Orders
          </div>
          <div className="text-[10px] text-emerald-100/70">
            {Math.max(0, requiredOrders - (completedOrders % requiredOrders))} more to unlock ₹10 reward
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left: Rewards & Active Table Info */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Rewards Progress Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-600" />
                <span>Dining Rewards Progress</span>
              </h3>
              <button
                onClick={() => navigate('rewards')}
                className="text-xs font-bold text-[#2D4739] hover:underline"
              >
                View Full Program →
              </button>
            </div>

            <div className="space-y-2">
              <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-stone-500 font-medium">
                <span>{completedOrders} Completed</span>
                <span className="font-bold text-amber-900">
                  Target: {requiredOrders} Completed Orders
                </span>
              </div>
            </div>

            {/* Unlocked vouchers */}
            {unlockedRewards.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <span className="text-xs font-bold uppercase text-stone-400 block">Available Dining Vouchers</span>
                {unlockedRewards.map((rew, idx) => (
                  <div key={rew.id || `profile-reward-${idx}`} className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-amber-950">{rew.title}</span>
                      <div className="text-[11px] text-amber-800">Code: {rew.code}</div>
                    </div>
                    <button
                      onClick={() => {
                        navigate('cart');
                      }}
                      className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-bold"
                    >
                      Apply to Order
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favorite Items */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Favorite Chai & Snacks</span>
            </h3>

            {favoriteProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteProducts.map(p => (
                  <DrinkCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="p-6 bg-white rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
                Tap the heart icon on any drink or snack to save your favorites here.
              </div>
            )}
          </div>

        </div>

        {/* Right: Personal Info Form */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
              <User className="w-4 h-4 text-[#2D4739]" />
              <span>Patron Information</span>
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-stone-500 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#2D4739]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-stone-500 block mb-1">
                  Mobile Number (for live order status SMS)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#2D4739]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#2D4739] text-white font-bold hover:bg-[#23382D] transition-colors shadow-xs"
              >
                Update Profile Info
              </button>

              <button
                type="button"
                onClick={logoutUser}
                className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
