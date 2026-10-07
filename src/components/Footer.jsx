import React from 'react';
import { useApp } from '../context/AppContext';
import { QrCode, Wifi, Clock, Utensils, Sparkles, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { navigate, setIsQRModalOpen, openAdminAuth, user, settings, currentTable } = useApp();

  return (
    <footer className="bg-[#1C2420] text-[#D8E2DC] border-t border-[#2D3832] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Core Restaurant Proposition */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-md bg-[#3A5C4A] text-white flex items-center justify-center font-serif text-sm font-bold">
                🍃
              </span>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                TeaGo
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#A4B5AC]">
              QR-Based Digital Self-Ordering System for Cafes & Restaurants. Scan table QR, explore the digital menu, place orders directly to the kitchen, and track live preparation.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-amber-300">
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan · Order · Relax</span>
            </div>
          </div>

          {/* Col 2: In-Restaurant Table Self-Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Table Dining Services
            </h4>
            <ul className="space-y-2 text-xs text-[#A4B5AC]">
              <li>
                <button onClick={() => navigate('menu')} className="hover:text-white transition-colors">
                  Digital Food & Drinks Menu
                </button>
              </li>
              <li>
                <button onClick={() => navigate('tracking')} className="hover:text-white transition-colors">
                  Live Kitchen Preparation Tracker
                </button>
              </li>
              <li>
                <button onClick={() => navigate('rewards')} className="hover:text-white transition-colors">
                  Table Dining Rewards (10 Orders = ₹10 Free)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('ai-assistant')} className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Restaurant Sommelier
                </button>
              </li>
              <li>
                <button onClick={() => setIsQRModalOpen(true)} className="text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1">
                  <QrCode className="w-3 h-3" /> Switch Dining Table (Now Table {currentTable})
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Cafe Amenities & Guest Wi-Fi */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Cafe Amenities & Wi-Fi
            </h4>
            <div className="space-y-2.5 text-xs text-[#A4B5AC]">
              <div className="flex items-start gap-2 bg-[#25322A] p-2.5 rounded-xl border border-[#34463B]">
                <Wifi className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block text-[11px]">Free Guest High-Speed Wi-Fi</span>
                  <div className="text-[10px] text-[#A4B5AC]">SSID: <strong className="text-white">{settings.wifiName}</strong></div>
                  <div className="text-[10px] text-[#A4B5AC]">Pass: <strong className="text-white font-mono">{settings.wifiPassword}</strong></div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p>Kitchen Hours: 8:00 AM – 11:00 PM Daily</p>
                  <p className="text-[11px] text-[#7A9184]">Fresh Chai & Bites Steeped Every 4 Minutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Operations & Staff */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Restaurant Kitchen Staff
            </h4>
            <p className="text-xs text-[#A4B5AC]">
              Orders placed from tables are routed instantly to the kitchen display for live preparation and table delivery.
            </p>
            <button
              onClick={() => {
                if (user?.isLoggedIn && user?.role === 'admin') {
                  navigate('admin-dashboard');
                } else {
                  openAdminAuth();
                }
              }}
              className="px-3.5 py-2 bg-[#2E4A3B] text-emerald-100 rounded-lg text-xs font-medium hover:bg-[#395C4A] transition-colors border border-emerald-800/40 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Kitchen Admin Dashboard</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#2A3630] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A9184]">
          <p>© {new Date().getFullYear()} TeaGo Cafe & Restaurant Systems. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('orders')} className="hover:text-stone-300">
              My Table Orders
            </button>
            <button onClick={() => navigate('rewards')} className="hover:text-stone-300">
              Rewards
            </button>
            <button onClick={() => navigate('admin-tables')} className="hover:text-stone-300">
              Tables 01–20 Directory
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
