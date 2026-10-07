import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import TeaIllustration from './TeaIllustration';
import { CUSTOMIZATION_OPTIONS } from '../data/initialData';
import { X, Check, Plus, Minus, Flame, Snowflake, Sun, Sparkles } from 'lucide-react';

export default function CustomizerModal() {
  const {
    customizingProduct,
    setCustomizingProduct,
    addToCart,
    calculateItemPrice,
    currentTable
  } = useApp();

  const [selectedSize, setSelectedSize] = useState('Regular Cup');
  const [selectedSugar, setSelectedSugar] = useState('Normal Sugar (Standard)');
  const [selectedTemp, setSelectedTemp] = useState('Hot (Steaming Cup)');
  const [selectedMilk, setSelectedMilk] = useState('Fresh Full Cream Milk');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Initialize options from product defaults
  useEffect(() => {
    if (customizingProduct) {
      const defaults = customizingProduct.defaultOptions || {};
      setSelectedSize(defaults.size || 'Regular Cup');
      setSelectedSugar(defaults.sugar || 'Normal Sugar (Standard)');
      setSelectedTemp(defaults.temperature || 'Hot (Steaming Cup)');
      setSelectedMilk(defaults.milk || 'Fresh Full Cream Milk');
      setSelectedAddOns(defaults.addOns || []);
      setQuantity(1);
      setSpecialInstructions('');
    }
  }, [customizingProduct]);

  if (!customizingProduct) return null;

  const currentOptions = {
    size: selectedSize,
    sugar: selectedSugar,
    temperature: selectedTemp,
    milk: selectedMilk,
    addOns: selectedAddOns,
    specialInstructions
  };

  const unitPrice = calculateItemPrice(customizingProduct, currentOptions);
  const totalPrice = unitPrice * quantity;

  const toggleAddOn = (addonName) => {
    if (selectedAddOns.includes(addonName)) {
      setSelectedAddOns(prev => prev.filter(a => a !== addonName));
    } else {
      setSelectedAddOns(prev => [...prev, addonName]);
    }
  };

  const handleAdd = () => {
    addToCart(customizingProduct, currentOptions, quantity);
    setCustomizingProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-300 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
              Artisanal Customization
            </div>
            <h3 className="text-base font-bold font-serif text-stone-900">
              Customize Item Recipe
            </h3>
          </div>
          <button
            onClick={() => setCustomizingProduct(null)}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Customization Options */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          
          {/* Item Brief Spotlight */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <div className="w-16 h-16 rounded-xl bg-stone-100 shrink-0 overflow-hidden flex items-center justify-center">
              <TeaIllustration
                image={customizingProduct.image}
                id={customizingProduct.id}
                alt={customizingProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                <span>{customizingProduct.categoryName}</span>
                <span aria-hidden="true">·</span>
                <span>{customizingProduct.prepTime || '4-5m prep'}</span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 font-serif truncate">
                {customizingProduct.name}
              </h4>
              <p className="text-[11px] text-stone-500 line-clamp-1">
                {customizingProduct.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-stone-400 block uppercase font-bold">Base</span>
              <span className="text-sm font-bold font-mono text-stone-900">
                ₹{customizingProduct.price}
              </span>
            </div>
          </div>

          {/* 1. Size Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              1. Serving Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CUSTOMIZATION_OPTIONS.sizes.map(size => {
                const isSelected = selectedSize.includes(size.name.split(' ')[0]);
                return (
                  <button
                    key={size.name}
                    type="button"
                    onClick={() => setSelectedSize(size.name)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#2D4739] text-white border-[#2D4739] shadow-xs'
                        : 'bg-white border-stone-200 hover:border-stone-300 text-stone-800'
                    }`}
                  >
                    <div className="text-xs font-bold">{size.name.split(' ')[0]}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-stone-500'}`}>
                      {size.volume}
                    </div>
                    {size.price > 0 && (
                      <div className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-amber-300 font-bold' : 'text-stone-600'}`}>
                        +₹{size.price}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Temperature Preference */}
          {customizingProduct.category !== 'snacks' && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                2. Temperature
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CUSTOMIZATION_OPTIONS.temperatures.map(temp => {
                  const isSelected = selectedTemp.includes(temp.name.split(' ')[0]);
                  return (
                    <button
                      key={temp.name}
                      type="button"
                      onClick={() => setSelectedTemp(temp.name)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#2D4739] text-white border-[#2D4739]'
                          : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        {temp.name.includes('Hot') && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                        {temp.name.includes('Warm') && <Sun className="w-3.5 h-3.5 text-amber-300" />}
                        {temp.name.includes('Cold') && <Snowflake className="w-3.5 h-3.5 text-sky-400" />}
                        <span>{temp.name.split(' ')[0]}</span>
                      </div>
                      <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-stone-400'}`}>
                        {temp.name.split('(')[1]?.replace(')', '') || 'Fresh'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Sugar Level */}
          {customizingProduct.category !== 'snacks' && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                3. Sweetness & Sugar
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CUSTOMIZATION_OPTIONS.sugars.map(s => {
                  const isSelected = selectedSugar === s.name;
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setSelectedSugar(s.name)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#2D4739] text-white border-[#2D4739]'
                          : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="text-xs font-semibold truncate">{s.name.split('(')[0]}</div>
                      {s.price > 0 && (
                        <span className={`text-[10px] font-mono block ${isSelected ? 'text-amber-300 font-bold' : 'text-stone-500'}`}>
                          +₹{s.price}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Extra Add-ons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                4. Kitchen Add-ons
              </label>
              <span className="text-[11px] text-stone-500">
                {selectedAddOns.length} selected
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CUSTOMIZATION_OPTIONS.addOns.map(addon => {
                const isSelected = selectedAddOns.includes(addon.name);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddOn(addon.name)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-[#2D4739] text-stone-900 ring-1 ring-[#2D4739]'
                        : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-1">
                      <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${isSelected ? 'bg-[#2D4739] text-white font-bold' : 'border border-stone-300'}`}>
                        {isSelected && '✓'}
                      </span>
                      <span className="text-xs font-semibold truncate">{addon.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-900 shrink-0">
                      +₹{addon.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Special Kitchen Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              Special Instructions for Kitchen Chef
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra hot, serve chutney separately, crispy maska bun..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:border-[#2D4739]"
            />
          </div>

        </div>

        {/* Modal Sticky Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex items-center justify-between gap-4">
          
          {/* Quantity Stepper */}
          <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-stone-700 transition-colors disabled:opacity-40"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-xs font-bold font-mono text-stone-900 tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-stone-700 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Order Action */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-6 rounded-xl bg-[#2D4739] hover:bg-[#23382D] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-between shadow-md active:scale-98"
          >
            <span>Add to Order</span>
            <span className="font-mono tabular-nums">₹{totalPrice}</span>
          </button>

        </div>
      </div>
    </div>
  );
}
