import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QrCode, X, Scan, CheckCircle2, Sparkles, MapPin, ArrowRight } from 'lucide-react';

export default function QRScanModal() {
  const {
    isQRModalOpen,
    setIsQRModalOpen,
    currentTable,
    switchTable,
    tables,
    navigate
  } = useApp();

  const [scannedTable, setScannedTable] = useState(null);

  if (!isQRModalOpen) return null;

  const handleSelectTable = (tableNum) => {
    setScannedTable(tableNum);
    setTimeout(() => {
      switchTable(tableNum);
      setIsQRModalOpen(false);
      setScannedTable(null);
      navigate('menu');
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-300 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2D4739] text-white flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                Table QR Scanner Simulator
              </h3>
              <p className="text-[11px] text-stone-500">
                Simulate scanning the QR code placed on your restaurant table
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsQRModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Simulated Camera Viewfinder */}
          <div className="relative aspect-[16/9] w-full rounded-2xl bg-stone-950 overflow-hidden flex flex-col items-center justify-center text-white border border-stone-800 shadow-inner p-4">
            
            {/* Viewfinder Target box */}
            <div className="relative w-40 h-40 border-2 border-emerald-400/80 rounded-2xl flex flex-col items-center justify-center p-2">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />

              {/* Animated Scan line */}
              <div className="w-full h-0.5 bg-emerald-400/90 shadow-[0_0_8px_#34d399] animate-pulse" />

              <QrCode className="w-16 h-16 text-stone-600 mt-2 opacity-40" />
              <span className="text-[10px] text-emerald-300 font-mono mt-1">Ready to Scan</span>
            </div>

            <p className="text-[11px] text-stone-400 mt-3 text-center">
              Scan the table QR code to open the digital menu and self-order
            </p>
          </div>

          {/* Quick Table Switcher Grid (Tables 01-20) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Select Table QR to Simulate (1–20)
              </label>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
              {tables.map((table, idx) => {
                const isSelected = currentTable === table.number;
                const isScanning = scannedTable === table.number;
                const zoneName = table.zone || table.section || 'Indoor';
                return (
                  <button
                    key={table.number || `qr-table-${idx}`}
                    type="button"
                    onClick={() => handleSelectTable(table.number)}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-[#2D4739] text-white border-[#2D4739] shadow-xs'
                        : isScanning
                        ? 'bg-emerald-500 text-white border-emerald-500 scale-95'
                        : 'bg-white border-stone-200 hover:border-stone-400 text-stone-800'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-medium opacity-80">Table</span>
                    <span className="font-mono text-sm font-bold tabular-nums">
                      {table.number}
                    </span>
                    <span className={`text-[9px] truncate max-w-full ${isSelected ? 'text-emerald-200' : 'text-stone-400'}`}>
                      {zoneName.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>How Table QR Self-Ordering Works</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              When a guest scans the table QR code, the digital menu opens. Guests browse recipes, select and customize items, enter their table number at checkout, and the kitchen prepares their order with live status updates.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex justify-end items-center">
          <button
            onClick={() => {
              setIsQRModalOpen(false);
              navigate('menu');
            }}
            className="px-4 py-2 bg-[#2D4739] text-white rounded-xl text-xs font-semibold hover:bg-[#23382D] flex items-center gap-1"
          >
            <span>Open Digital Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
