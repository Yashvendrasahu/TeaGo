import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  QrCode,
  ArrowLeft,
  Printer,
  X,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function AdminTablesPage() {
  const { tables, updateTableStatus, switchTable, navigate, settings } = useApp();

  const [selectedQRTable, setSelectedQRTable] = useState(null);
  const [filterSection, setFilterSection] = useState('all');

  const filteredTables = tables.filter(t => {
    if (filterSection !== 'all' && t.section !== filterSection) return false;
    return true;
  });

  const handlePrintQR = () => {
    window.print();
  };

  const handleSimulateCustomerScan = (tableNum) => {
    switchTable(tableNum);
    navigate('home');
  };

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
              Table QR & Floor Management
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage 20 dining tables, preview custom table QR stickers & print table markers
            </p>
          </div>
        </div>

        {/* Section Filter */}
        <div className="flex items-center gap-2">
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-semibold"
          >
            <option value="all">All Sections (20 Tables)</option>
            <option value="Main Hall">Main Hall</option>
            <option value="Garden Terrace">Garden Terrace</option>
            <option value="Family Booth">Family Booth</option>
            <option value="Window Corner">Window Corner</option>
            <option value="Bar Counter">Bar Counter</option>
          </select>
        </div>
      </div>

      {/* 20 Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredTables.map((table, idx) => {
          const isActive = table.status === 'order_active';
          const isOccupied = table.status === 'occupied';
          return (
            <div
              key={table.number || `table-card-${idx}`}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-2xs ${
                isActive
                  ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400'
                  : isOccupied
                  ? 'bg-stone-50 border-stone-300'
                  : 'bg-white border-stone-200 hover:border-stone-400'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-bold text-stone-900">
                    Table {table.number}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    isActive ? 'bg-amber-200 text-amber-950' : isOccupied ? 'bg-stone-200 text-stone-800' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {table.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="text-xs text-stone-500 space-y-0.5">
                  <div className="font-semibold text-stone-700">{table.section}</div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span>Capacity: {table.capacity} Guests</span>
                  </div>
                  {table.activeOrderId && (
                    <div className="text-amber-900 font-mono font-bold mt-1">
                      Active: #{table.activeOrderId}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-stone-200/80">
                <button
                  onClick={() => setSelectedQRTable(table)}
                  className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-300" />
                  <span>Generate QR Code</span>
                </button>

                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    onClick={() => updateTableStatus(table.number, table.status === 'available' ? 'occupied' : 'available')}
                    className="py-1 px-2 rounded-lg border border-stone-300 hover:bg-white font-medium text-stone-700 truncate"
                  >
                    {table.status === 'available' ? 'Mark Occupied' : 'Mark Available'}
                  </button>
                  <button
                    onClick={() => handleSimulateCustomerScan(table.number)}
                    className="py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#2D4739] font-bold truncate flex items-center justify-center gap-1"
                  >
                    <span>Simulate Scan</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable QR Code Modal */}
      {selectedQRTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 text-center space-y-5">
            
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Official Table QR Sticker
              </span>
              <button
                onClick={() => setSelectedQRTable(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Table QR Stand Display */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border-2 border-dashed border-stone-300 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#2D4739] text-white flex items-center justify-center font-serif text-xs font-bold">
                  🍃
                </span>
                <span className="font-serif text-lg font-bold text-stone-900">TeaGo Cafe</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs inline-block">
                {/* SVG QR Code Simulation with Center Leaf */}
                <svg viewBox="0 0 160 160" className="w-44 h-44 mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Position detection corners */}
                  <rect x="10" y="10" width="40" height="40" rx="6" fill="#1C2420" />
                  <rect x="18" y="18" width="24" height="24" rx="2" fill="#FFFFFF" />
                  <rect x="24" y="24" width="12" height="12" fill="#1C2420" />

                  <rect x="110" y="10" width="40" height="40" rx="6" fill="#1C2420" />
                  <rect x="118" y="18" width="24" height="24" rx="2" fill="#FFFFFF" />
                  <rect x="124" y="24" width="12" height="12" fill="#1C2420" />

                  <rect x="10" y="110" width="40" height="40" rx="6" fill="#1C2420" />
                  <rect x="18" y="118" width="24" height="24" rx="2" fill="#FFFFFF" />
                  <rect x="24" y="124" width="12" height="12" fill="#1C2420" />

                  {/* QR Pattern dots */}
                  <rect x="60" y="15" width="8" height="8" fill="#1C2420" />
                  <rect x="75" y="15" width="8" height="8" fill="#1C2420" />
                  <rect x="90" y="15" width="8" height="8" fill="#1C2420" />

                  <rect x="60" y="30" width="8" height="8" fill="#1C2420" />
                  <rect x="90" y="30" width="8" height="8" fill="#1C2420" />

                  <rect x="60" y="45" width="8" height="8" fill="#1C2420" />
                  <rect x="75" y="45" width="8" height="8" fill="#1C2420" />

                  <rect x="15" y="60" width="8" height="8" fill="#1C2420" />
                  <rect x="30" y="60" width="8" height="8" fill="#1C2420" />
                  <rect x="45" y="60" width="8" height="8" fill="#1C2420" />
                  <rect x="60" y="60" width="8" height="8" fill="#1C2420" />
                  <rect x="90" y="60" width="8" height="8" fill="#1C2420" />
                  <rect x="105" y="60" width="8" height="8" fill="#1C2420" />
                  <rect x="120" y="60" width="8" height="8" fill="#1C2420" />
                  <rect x="135" y="60" width="8" height="8" fill="#1C2420" />

                  {/* Center Badge */}
                  <circle cx="80" cy="80" r="16" fill="#2D4739" />
                  <text x="80" y="85" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">T{selectedQRTable.number}</text>

                  <rect x="15" y="90" width="8" height="8" fill="#1C2420" />
                  <rect x="30" y="90" width="8" height="8" fill="#1C2420" />
                  <rect x="45" y="90" width="8" height="8" fill="#1C2420" />
                  <rect x="105" y="90" width="8" height="8" fill="#1C2420" />
                  <rect x="120" y="90" width="8" height="8" fill="#1C2420" />
                  <rect x="135" y="90" width="8" height="8" fill="#1C2420" />

                  <rect x="60" y="105" width="8" height="8" fill="#1C2420" />
                  <rect x="90" y="105" width="8" height="8" fill="#1C2420" />
                  <rect x="60" y="120" width="8" height="8" fill="#1C2420" />
                  <rect x="75" y="120" width="8" height="8" fill="#1C2420" />
                  <rect x="90" y="120" width="8" height="8" fill="#1C2420" />
                  <rect x="60" y="135" width="8" height="8" fill="#1C2420" />
                  <rect x="90" y="135" width="8" height="8" fill="#1C2420" />
                  <rect x="105" y="135" width="8" height="8" fill="#1C2420" />
                  <rect x="120" y="135" width="8" height="8" fill="#1C2420" />
                  <rect x="135" y="135" width="8" height="8" fill="#1C2420" />
                </svg>
              </div>

              <div>
                <div className="font-serif text-xl font-bold text-stone-900">
                  TABLE {selectedQRTable.number}
                </div>
                <p className="text-xs font-semibold text-stone-600 mt-0.5">
                  Scan to View Digital Menu & Order
                </p>
                <div className="text-[10px] text-stone-400 mt-1">
                  Wi-Fi: {settings.wifiName} · Pass: {settings.wifiPassword}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrintQR}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Table Stand QR</span>
              </button>
              <button
                onClick={() => handleSimulateCustomerScan(selectedQRTable.number)}
                className="flex-1 py-2.5 rounded-xl bg-[#2D4739] text-white text-xs font-bold hover:bg-[#23382D] flex items-center justify-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test Dine-in</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
