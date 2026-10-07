import React from 'react';
import { useApp } from '../context/AppContext';
import TeaIllustration from './TeaIllustration';
import { Heart, Plus, SlidersHorizontal, Star, Clock, Sparkles } from 'lucide-react';

export default function DrinkCard({ product }) {
  const {
    navigate,
    setCustomizingProduct,
    addToCart,
    user,
    toggleFavorite
  } = useApp();

  const isFavorite = user.favoriteProductIds?.includes(product.id);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, product.defaultOptions || {}, 1);
  };

  const handleCustomize = (e) => {
    e.stopPropagation();
    setCustomizingProduct(product);
  };

  const handleViewDetails = () => {
    navigate('product-details', product.id);
  };

  return (
    <div
      onClick={handleViewDetails}
      className="group relative bg-white rounded-2xl border border-stone-200/80 hover:border-stone-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Visual Showcase */}
      <div className="relative h-44 w-full bg-stone-100 overflow-hidden flex items-center justify-center">
        <TeaIllustration
          image={product.image}
          id={product.id}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow-xs flex items-center justify-center text-stone-500 hover:text-rose-500 hover:bg-white transition-all z-10"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-500'
            }`}
          />
        </button>

        {/* Veg Dot Symbol */}
        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-2xs flex items-center justify-center border border-stone-200">
          <div className="w-3 h-3 border border-emerald-600 flex items-center justify-center rounded-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          </div>
        </div>

        {/* Bestseller Badge */}
        {product.isBestseller && (
          <div className="absolute bottom-2.5 left-2.5 bg-stone-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>Popular</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
        
        <div className="space-y-1">
          {/* Metadata line (Category · Prep time · Rating) */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
            <span>{product.categoryName.split(' ')[0]}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center text-stone-600">
              <Clock className="w-3 h-3 mr-0.5 text-stone-400" />
              {product.prepTime || '4-5m'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center text-amber-700 font-bold">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500 mr-0.5" />
              {product.rating}
            </span>
          </div>

          {/* Drink Name */}
          <h3 className="font-serif text-base font-bold text-stone-900 leading-snug group-hover:text-[#2D4739] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Tasting notes / description */}
          <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Table Cart Action Row */}
        <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-stone-400 uppercase font-bold">Price</span>
            <span className="text-base font-bold font-mono text-stone-900 tabular-nums">
              ₹{product.price}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCustomize}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 text-xs font-semibold transition-colors flex items-center gap-1"
              title="Customize sugar, temperature & extras"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Options</span>
            </button>
            
            <button
              onClick={handleQuickAdd}
              className="px-3 py-2 rounded-xl bg-[#2D4739] hover:bg-[#23382D] text-white text-xs font-bold transition-all flex items-center gap-1 shadow-2xs active:scale-95"
              title="Add to order"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
