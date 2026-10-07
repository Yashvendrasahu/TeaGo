import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import DrinkCard from '../components/DrinkCard';
import { INITIAL_CATEGORIES } from '../data/initialData';
import { Search, Sparkles, X, Check, QrCode } from 'lucide-react';

export default function MenuPage() {
  const { products, navigate, setIsQRModalOpen } = useApp();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category match
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }

      // Veg filter
      if (vegOnly && !product.isVeg) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCategory = product.categoryName.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return b.reviewsCount - a.reviewsCount;
    });
  }, [products, activeCategory, searchQuery, vegOnly, sortBy]);

  const clearFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setVegOnly(false);
    setSortBy('popular');
  };

  const hasActiveFilters = activeCategory !== 'all' || searchQuery !== '' || vegOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Menu Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#2D4739]">
            TeaGo Digital Ordering
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-0.5">
            Digital Food & Drinks Menu
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Select your items, customize, and enter your Table Number at checkout.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('ai-assistant')}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#2D4739] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>AI Sommelier</span>
          </button>
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {INITIAL_CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#2D4739] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by chai, cappuccino, samosa, sandwich..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:bg-white focus:outline-none focus:border-[#2D4739]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="sm:col-span-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold focus:outline-none focus:border-[#2D4739]"
            >
              <option value="popular">Sort: Most Popular</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="price-low">Sort: Price Low → High</option>
              <option value="price-high">Sort: Price High → Low</option>
            </select>
          </div>

        </div>

        {/* Veg Toggle & Filter Clear */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              vegOnly ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <div className="w-3 h-3 border border-current rounded-xs flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
            </div>
            <span>Pure Veg Only</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-rose-600 hover:text-rose-700 font-semibold underline text-xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
        <span>
          Showing <strong className="text-stone-900">{filteredProducts.length}</strong> delicious items
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map(product => (
            <DrinkCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-stone-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto text-xl">
            ☕
          </div>
          <h3 className="font-serif text-base font-bold text-stone-900">
            No menu items found
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try resetting your search query or choosing another category.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl bg-[#2D4739] text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
