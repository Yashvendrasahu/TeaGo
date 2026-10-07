import React from 'react';
import { useApp } from '../context/AppContext';
import { Gift, Award, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Ticket, QrCode } from 'lucide-react';

export default function RewardsPage() {
  const { user, applyReward, navigate } = useApp();

  const completedCount = user?.completedOrdersCount || 0;
  const requiredCount = user?.requiredOrdersForReward || 10;
  const progressPercent = Math.min(100, Math.round((completedCount / requiredCount) * 100));
  const remainingOrders = Math.max(0, requiredCount - (completedCount % requiredCount));
  const rewardsList = Array.isArray(user?.unlockedRewards) ? user.unlockedRewards : [];

  const handleUseReward = (reward) => {
    applyReward(reward);
    navigate('cart');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
          <Gift className="w-3.5 h-3.5 text-amber-700" />
          <span>Table Dining Loyalty Program</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          TeaGo Dining Rewards
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Complete 10 dining orders to automatically unlock ₹10 FREE ORDER REWARD on your table.
        </p>
      </div>

      {/* Main Progress Showcase Box */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1F3327] via-[#2A4434] to-[#17271E] text-white p-6 sm:p-10 shadow-xl border border-emerald-900/40 relative overflow-hidden space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
              Completed Orders Milestone
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              {completedCount} / {requiredCount} Orders Completed
            </h2>
          </div>

          <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-right">
            <span className="text-[10px] text-emerald-200 uppercase font-bold block">Reward Target</span>
            <span className="font-mono text-lg sm:text-xl font-bold text-amber-300">
              ₹10 FREE ORDER
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-300 to-amber-400 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-emerald-100/80 font-medium">
            <span>0 Orders</span>
            <span className="font-bold text-amber-300">
              {remainingOrders > 0 ? `${remainingOrders} more completed orders to unlock` : '🎉 Milestone Reached!'}
            </span>
            <span>10 Orders</span>
          </div>
        </div>

        <p className="text-xs text-emerald-100/70 border-t border-emerald-800/60 pt-4">
          *Important: Only successfully delivered table orders count toward your loyalty rewards. Cancelled or uncompleted orders are excluded.
        </p>

      </div>

      {/* Unlocked Rewards Section */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-stone-900">
          Your Unlocked Dining Vouchers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rewardsList.map((reward, idx) => (
            <div
              key={reward.id || `reward-${idx}`}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                reward.isRedeemed
                  ? 'bg-stone-100 border-stone-200 opacity-60'
                  : 'bg-white border-amber-300 shadow-xs ring-1 ring-amber-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {reward.isRedeemed ? 'Redeemed' : 'Active Reward'}
                  </span>
                  <Ticket className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="font-serif text-lg font-bold text-stone-900">
                  {reward.title}
                </h4>
                <p className="text-xs text-stone-600">
                  {reward.desc}
                </p>
                <div className="text-[11px] font-mono text-stone-500">
                  Code: <strong className="text-stone-800">{reward.code}</strong>
                </div>
              </div>

              <div>
                {reward.isRedeemed ? (
                  <div className="text-xs text-stone-400 font-semibold py-2">
                    Already used on a previous order
                  </div>
                ) : (
                  <button
                    onClick={() => handleUseReward(reward)}
                    className="w-full py-2.5 rounded-xl bg-[#2D4739] hover:bg-[#23382D] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Apply Reward to Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How Rewards Work */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 text-xs">
        <h4 className="font-serif text-base font-bold text-stone-900">
          How TeaGo Table Rewards Work
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1">
            <span className="font-bold text-stone-900 block">1. Scan & Order</span>
            <p className="text-stone-500">Sit at any restaurant table and place your order using the table QR code.</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-stone-900 block">2. Complete Dine-in</span>
            <p className="text-stone-500">When your food is delivered, your completed orders count increases.</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-stone-900 block">3. Enjoy Free Treats</span>
            <p className="text-stone-500">Every 10th order receives an instant ₹10 OFF voucher.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
