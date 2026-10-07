import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, TrendingUp, BarChart2, PieChart, Clock, Award, Coffee, Flame } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { orders, products, navigate } = useApp();

  const categoriesShare = [
    { name: 'Artisanal Teas & Chai', percent: 45, color: 'bg-amber-700' },
    { name: 'Hot & Cold Coffees', percent: 25, color: 'bg-[#2D4739]' },
    { name: 'Quick Bites & Snacks', percent: 20, color: 'bg-rose-500' },
    { name: 'Chef Special Combos', percent: 10, color: 'bg-amber-400' }
  ];

  const hourlyTrends = [
    { time: '8 AM', vol: 18 },
    { time: '10 AM', vol: 35 },
    { time: '12 PM', vol: 50 },
    { time: '2 PM', vol: 30 },
    { time: '4 PM', vol: 70 },
    { time: '6 PM', vol: 95 },
    { time: '8 PM', vol: 80 },
    { time: '10 PM', vol: 40 }
  ];

  const topItems = [
    { name: 'Special Kulhad Masala Chai', orders: 1240, share: '38%' },
    { name: 'Crispy Samosa with Chutney', orders: 940, share: '29%' },
    { name: 'Classic Filter Coffee', orders: 780, share: '24%' },
    { name: 'Signature Thick Cold Coffee', orders: 620, share: '19%' },
    { name: 'Irani Maska Bun', orders: 580, share: '18%' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-stone-200 pb-5">
        <button
          onClick={() => navigate('admin-dashboard')}
          className="p-2 rounded-xl hover:bg-stone-200 text-stone-600"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Restaurant Dining & Sales Analytics
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Table turnover speeds, evening chai rushes, and best selling pairings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Hourly Volume Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-base font-bold text-stone-900">
              Peak Chai & Snacks Rush (By Hour)
            </h3>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md font-bold">
              Evening Peak: 4:30 PM – 8:00 PM
            </span>
          </div>

          <div className="h-52 flex items-end justify-between gap-3 pt-6 border-b border-stone-100 pb-2">
            {hourlyTrends.map(item => (
              <div key={item.time} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full max-w-[34px] bg-[#2D4739] hover:bg-emerald-700 transition-all rounded-t-lg shadow-2xs"
                  style={{ height: `${item.vol * 1.5}px` }}
                />
                <span className="text-[11px] font-mono text-stone-500">{item.time}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 text-xs">
            <div>
              <span className="text-stone-400 block font-medium">Fastest Prep Time</span>
              <span className="font-bold text-stone-900 font-mono text-sm">3.8 mins avg</span>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">Busiest Table</span>
              <span className="font-bold text-amber-900 font-mono text-sm">Table 07 (Garden)</span>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">Repeat Patrons</span>
              <span className="font-bold text-emerald-800 font-mono text-sm">74.5%</span>
            </div>
          </div>
        </div>

        {/* Category Share */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
          <h3 className="font-serif text-base font-bold text-stone-900">
            Category Sales Share
          </h3>

          <div className="space-y-3.5 text-xs">
            {categoriesShare.map(cat => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between font-semibold text-stone-700">
                  <span>{cat.name}</span>
                  <span className="font-mono font-bold text-stone-900">{cat.percent}%</span>
                </div>
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full`}
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Sellers Table */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <h3 className="font-serif text-base font-bold text-stone-900">
          Most Ordered Table Items
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {topItems.map((item, idx) => (
            <div key={item.name} className="p-4 rounded-xl bg-stone-50 border border-stone-100 text-xs space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Rank #{idx + 1}</span>
              <div className="font-bold text-stone-900 truncate">{item.name}</div>
              <div className="font-mono text-emerald-900 font-bold">{item.orders} served</div>
              <div className="text-[11px] text-stone-500">In {item.share} of table bills</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
