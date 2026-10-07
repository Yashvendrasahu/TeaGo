import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import TeaIllustration from '../components/TeaIllustration';
import DrinkCard from '../components/DrinkCard';
import { CUSTOMIZATION_OPTIONS } from '../data/initialData';
import {
  Heart,
  Star,
  Plus,
  Minus,
  ArrowLeft,
  Flame,
  Snowflake,
  Sun,
  Clock,
  Sparkles,
  Utensils
} from 'lucide-react';

export default function ProductDetailsPage() {
  const {
    products,
    selectedProductId,
    navigate,
    addToCart,
    user,
    toggleFavorite,
    calculateItemPrice
  } = useApp();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [selectedSize, setSelectedSize] = useState('Regular Cup');
  const [selectedSugar, setSelectedSugar] = useState('Normal Sugar (Standard)');
  const [selectedTemp, setSelectedTemp] = useState('Hot (Steaming Cup)');
  const [selectedMilk, setSelectedMilk] = useState('Fresh Full Cream Milk');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (product) {
      const defaults = product.defaultOptions || {};
      setSelectedSize(defaults.size || 'Regular Cup');
      setSelectedSugar(defaults.sugar || 'Normal Sugar (Standard)');
      setSelectedTemp(defaults.temperature || 'Hot (Steaming Cup)');
      setSelectedMilk(defaults.milk || 'Fresh Full Cream Milk');
      setSelectedAddOns(defaults.addOns || []);
      setQuantity(1);
      setSpecialInstructions('');
    }
  }, [product]);

  const isFavorite = user.favoriteProductIds?.includes(product.id);

  const currentOptions = {
    size: selectedSize,
    sugar: selectedSugar,
    temperature: selectedTemp,
    milk: selectedMilk,
    addOns: selectedAddOns,
    specialInstructions
  };

  const unitPrice = calculateItemPrice(product, currentOptions);
  const totalPrice = unitPrice * quantity;

  const toggleAddOn = (addonName) => {
    if (selectedAddOns.includes(addonName)) {
      setSelectedAddOns(prev => prev.filter(a => a !== addonName));
    } else {
      setSelectedAddOns(prev => [...prev, addonName]);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, currentOptions, quantity);
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.isBestseller))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('menu')}
          className="text-xs font-bold text-stone-600 hover:text-stone-900 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Digital Menu</span>
        </button>
      </div>

      {/* Main PDP Grid: Left Gallery + Right Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Left Column: Visual Showcase & Notes */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="relative aspect-square w-full rounded-3xl bg-stone-100 overflow-hidden border border-stone-200 shadow-xs flex items-center justify-center">
            <TeaIllustration
              image={product.image}
              id={product.id}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {/* Veg Dot */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs p-1.5 rounded-lg shadow-xs flex items-center justify-center border border-stone-200">
              <div className="w-3.5 h-3.5 border border-emerald-600 flex items-center justify-center rounded-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
              </div>
            </div>

            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-xs flex items-center justify-center text-stone-500 hover:text-rose-500 hover:bg-white transition-all z-10"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-500'}`} />
            </button>
          </div>

          {/* Craft & Ingredient Highlights */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-stone-700">
              Kitchen Preparation Notes
            </h3>

            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-stone-100">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Prep Time</span>
                <span className="font-bold text-stone-800">{product.prepTime || '4-5 mins'}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Origin / Craft</span>
                <span className="font-bold text-stone-800">{product.origin}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Rating</span>
                <span className="font-bold text-amber-700 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {product.rating} ({product.reviewsCount})
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 text-stone-600 leading-relaxed">
              <strong className="text-stone-900">Flavor Profile: </strong>
              {product.tastingNotes}
            </div>
          </div>

        </div>

        {/* Right Column: Contiguous Table Customizer & Order Action */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          
          {/* Title & Base Price */}
          <div className="border-b border-stone-200 pb-5">
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-1">
              <span>{product.categoryName}</span>
              <span aria-hidden="true">·</span>
              <span>Dine-in Order</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
              {product.description}
            </p>
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
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-800'
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
          {product.category !== 'snacks' && (
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
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        {temp.name.includes('Hot') && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                        {temp.name.includes('Warm') && <Sun className="w-3.5 h-3.5 text-amber-300" />}
                        {temp.name.includes('Cold') && <Snowflake className="w-3.5 h-3.5 text-sky-400" />}
                        <span>{temp.name.split(' ')[0]}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Sweetness & Sugar */}
          {product.category !== 'snacks' && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                3. Sweetness / Sugar
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
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-700'
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

          {/* 4. Kitchen Add-ons */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              4. Kitchen Add-ons
            </label>
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
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <span className="text-xs font-semibold truncate">{addon.name}</span>
                    <span className="text-xs font-mono font-bold text-stone-900">
                      +₹{addon.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-stone-700 disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-xs font-bold font-mono text-stone-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-stone-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Total</span>
                <span className="text-xl font-bold font-mono text-stone-900 tabular-nums">
                  ₹{totalPrice}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 px-6 rounded-xl bg-[#2D4739] hover:bg-[#23382D] text-white font-bold text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Add to Order</span>
              <span>·</span>
              <span className="font-mono tabular-nums">₹{totalPrice}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Recommended Pairings */}
      <div className="space-y-4 pt-6 border-t border-stone-200">
        <h3 className="font-serif text-xl font-bold text-stone-900">
          Delicious Pairings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {relatedProducts.map(rel => (
            <DrinkCard key={rel.id} product={rel} />
          ))}
        </div>
      </div>

    </div>
  );
}
