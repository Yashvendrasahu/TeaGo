import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ArrowLeft, Award, Gift, Phone, UtensilsCrossed } from 'lucide-react';

export default function AdminCustomersPage() {
  const { customers, navigate } = useApp();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
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
              Customer Dining Directory & Loyalty
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Track customer dine-in frequency, completed table orders, and unlocked 10-order milestones
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patron by name or mobile..."
            className="pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-white text-xs w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 uppercase font-semibold border-b border-stone-100">
            <tr>
              <th className="px-5 py-3">Customer Name</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Completed Orders</th>
              <th className="px-5 py-3">Reward Progress</th>
              <th className="px-5 py-3">Lifetime Spend</th>
              <th className="px-5 py-3">Last Seated</th>
              <th className="px-5 py-3">Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map(cust => (
              <tr key={cust.id} className="hover:bg-stone-50/70">
                <td className="px-5 py-4 font-bold text-stone-900">
                  {cust.name}
                </td>
                <td className="px-5 py-4 font-mono text-stone-600">
                  {cust.phone}
                </td>
                <td className="px-5 py-4 font-mono font-bold text-stone-900">
                  {cust.completedOrders} orders
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${Math.min(100, (cust.completedOrders % 10) * 10)}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-stone-500">
                      {cust.completedOrders % 10}/10
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 font-mono font-bold text-stone-900">
                  ₹{cust.totalSpent}
                </td>
                <td className="px-5 py-4 font-semibold text-amber-900">
                  {cust.lastTable}
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                    {cust.tier}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
