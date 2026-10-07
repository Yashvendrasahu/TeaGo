import React from 'react';
import { useApp } from '../context/AppContext';
import DrinkCard from '../components/DrinkCard';
import TeaIllustration from '../components/TeaIllustration';
import {
  QrCode,
  ArrowRight,
  Sparkles,
  Utensils,
  Clock,
  Award,
  Gift,
  CheckCircle2,
  ChevronRight,
  Flame,
  Coffee,
  Heart
} from 'lucide-react';

export default function HomePage() {
  const {
    products,
    navigate,
    setIsQRModalOpen,
    user,
    setCustomizingProduct
  } = useApp();

  const popularToday = products.filter(p => p.isBestseller).slice(0, 4);
  const teaAndCoffee = products.filter(p => p.category === 'tea' || p.category === 'coffee').slice(0, 4);
  const quickSnacks = products.filter(p => p.category === 'snacks').slice(0, 4);
  const chefSpecial = products.find(p => p.id === 'tg-12') || products[0];

  const rewardProgress = Math.min(100, Math.round((user.completedOrdersCount / user.requiredOrdersForReward) * 100));
  const remainingForReward = Math.max(0, user.requiredOrdersForReward - (user.completedOrdersCount % user.requiredOrdersForReward));

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* 1. Restaurant Hero */}
      <section className="relative pt-4 sm:pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Card */}
          <div className="relative rounded-3xl bg-[#1D2A22] text-[#F3F7F4] overflow-hidden border border-[#2B3E32] shadow-xl p-6 sm:p-12">
            
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(78,138,62,0.25)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(210,105,30,0.18)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Copy */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-xs font-bold text-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Digital Table Ordering · Zero Waiting</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight text-balance">
                  Your Table. Your Menu. <br className="hidden sm:inline" />
                  Your Order.
                </h1>

                <p className="text-xs sm:text-sm text-[#A8C2B3] max-w-lg leading-relaxed">
                  Scan the table QR, explore the digital menu, customize items, enter your table number at checkout, and get fresh food delivered right to your seat.
                </p>

                {/* Primary Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => navigate('menu')}
                    className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-98 flex items-center gap-2"
                  >
                    <span>Explore Digital Menu</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate('tracking')}
                    className="px-5 py-3 rounded-xl bg-[#2A3E31] hover:bg-[#344E3D] text-emerald-100 font-semibold text-xs sm:text-sm transition-all border border-[#3C5745] flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-emerald-300" />
                    <span>View Current Order Status</span>
                  </button>
                </div>

                {/* 4-Step QR Value Stream */}
                <div className="pt-6 border-t border-[#2D4335] grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                    <span className="font-mono text-amber-300 font-bold block text-sm">1. SCAN</span>
                    <span className="text-[10px] text-[#A8C2B3]">Table QR</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                    <span className="font-mono text-amber-300 font-bold block text-sm">2. CHOOSE</span>
                    <span className="text-[10px] text-[#A8C2B3]">Menu Items</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                    <span className="font-mono text-amber-300 font-bold block text-sm">3. ORDER</span>
                    <span className="text-[10px] text-[#A8C2B3]">Enter Table #</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                    <span className="font-mono text-amber-300 font-bold block text-sm">4. ENJOY</span>
                    <span className="text-[10px] text-[#A8C2B3]">Delivered at Table</span>
                  </div>
                </div>

              </div>

              {/* Right Showcase: Chef Special Combo */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm bg-[#152119] border border-[#2B3E32] rounded-2xl p-5 shadow-2xl space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      Chef Table Special
                    </span>
                    <span className="font-mono text-white font-bold">₹{chefSpecial.price}</span>
                  </div>

                  <div className="h-44 w-full rounded-xl overflow-hidden flex items-center justify-center">
                    <TeaIllustration
                      image={chefSpecial.image}
                      id={chefSpecial.id}
                      alt={chefSpecial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-serif text-base font-bold text-white">
                      {chefSpecial.name}
                    </h3>
                    <p className="text-[11px] text-[#A8C2B3] line-clamp-2 mt-1">
                      {chefSpecial.description}
                    </p>
                  </div>

                  <button
                    onClick={() => setCustomizingProduct(chefSpecial)}
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors border border-white/10"
                  >
                    Customize & Add to Order
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. Customer Table Rewards Milestone Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 p-6 rounded-3xl border border-amber-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold text-stone-900">
                  TeaGo Dining Rewards
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  {user.completedOrdersCount} / {user.requiredOrdersForReward} Orders Completed
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Every 10 completed dine-in orders automatically unlocks <strong className="text-amber-900">₹10 FREE ORDER REWARD</strong>!
              </p>
            </div>
          </div>

          {/* Progress Bar & CTA */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4 min-w-[280px]">
            <div className="w-full sm:w-44 space-y-1">
              <div className="h-2.5 w-full bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${rewardProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-stone-500 font-medium block text-right">
                {remainingForReward > 0 ? `${remainingForReward} more orders to unlock` : 'Reward Unlocked!'}
              </span>
            </div>

            <button
              onClick={() => navigate('rewards')}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors whitespace-nowrap"
            >
              View Rewards
            </button>
          </div>
        </div>
      </section>

      {/* 3. Popular Today Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-bold text-[#2D4739] uppercase tracking-wider">
              Diner Favorites
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
              Popular Today at TeaGo
            </h2>
          </div>
          <button
            onClick={() => navigate('menu')}
            className="text-xs font-bold text-[#2D4739] hover:underline flex items-center gap-1"
          >
            <span>Full Menu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularToday.map(product => (
            <DrinkCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Tea & Coffee Favorites */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Steamed & Brewed Fresh
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
              Tea & Coffee Classics
            </h2>
          </div>
          <button
            onClick={() => navigate('menu')}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1"
          >
            <span>View All Brews</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {teaAndCoffee.map(product => (
            <DrinkCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Quick Snacks & Bites */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              Fresh From Kitchen Fryer
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5">
              Quick Bites & Hot Snacks
            </h2>
          </div>
          <button
            onClick={() => navigate('menu')}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1"
          >
            <span>All Snacks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickSnacks.map(product => (
            <DrinkCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. AI Assistant Recommendation Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#243B2E] text-white p-6 sm:p-10 border border-emerald-900/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Menu Assistant</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">
              Unsure what to order today?
            </h3>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Ask our TeaGo AI Sommelier: &ldquo;Suggest a strong tea under ₹50&rdquo;, &ldquo;What snacks go well with Masala Chai?&rdquo; or &ldquo;Recommend low-sugar cold drinks&rdquo;.
            </p>
          </div>

          <button
            onClick={() => navigate('ai-assistant')}
            className="px-6 py-3 rounded-xl bg-white text-[#243B2E] hover:bg-stone-100 text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <span>Ask AI Assistant</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
