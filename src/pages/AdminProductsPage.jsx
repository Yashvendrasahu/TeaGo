import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import TeaIllustration from '../components/TeaIllustration';
import { PRESET_FOOD_IMAGES } from '../data/initialData';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  Search,
  SlidersHorizontal,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  Zap
} from 'lucide-react';

export default function AdminProductsPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    navigate,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const fileInputRef = useRef(null);

  const initialFormState = {
    name: '',
    category: 'tea',
    categoryName: 'Artisanal Teas & Chai',
    price: 45,
    isVeg: true,
    image: '',
    description: '',
    tastingNotes: '',
    origin: '',
    prepTime: '4-5 mins',
    caffeineLevel: 'Medium',
    calories: 100
  };

  const [formData, setFormData] = useState(initialFormState);

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleOpenAdd = () => {
    setFormData({
      ...initialFormState,
      image: ''
    });
    setEditingProduct(null);
    setIsAddingProduct(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      category: prod.category || 'tea',
      categoryName: prod.categoryName || 'Artisanal Teas & Chai',
      price: prod.price || 45,
      isVeg: prod.isVeg !== false,
      image: prod.image || '',
      description: prod.description || '',
      tastingNotes: prod.tastingNotes || '',
      origin: prod.origin || '',
      prepTime: prod.prepTime || '4-5 mins',
      caffeineLevel: prod.caffeineLevel || 'Medium',
      calories: prod.calories || 100
    });
    setIsAddingProduct(false);
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5MB limit', 'error');
      return;
    }

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result;
      setFormData(prev => ({ ...prev, image: base64 }));
      showToast('Uploading photo to Supabase storage...');

      try {
        const uploadRes = await api.uploadImage(base64, file.name, 'menu-images');
        if (uploadRes?.url) {
          setFormData(prev => ({ ...prev, image: uploadRes.url }));
          showToast('Photo uploaded to Supabase "menu-images" bucket! 📸');
        }
      } catch (err) {
        console.warn('Storage bucket upload fallback:', err);
      } finally {
        setIsUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleGenerateAiDescription = async () => {
    if (!formData.name.trim()) {
      showToast('Please type an Item Name first!', 'error');
      return;
    }

    setIsGeneratingAi(true);
    try {
      const aiData = await api.generateAiDescription(
        formData.name,
        formData.categoryName || formData.category,
        formData.price,
        formData.isVeg
      );

      if (aiData) {
        setFormData(prev => ({
          ...prev,
          description: aiData.description || prev.description,
          tastingNotes: aiData.tastingNotes || prev.tastingNotes,
          prepTime: aiData.prepTime || prev.prepTime
        }));
        showToast('Generated description with Gemini AI! ✨');
      }
    } catch (err) {
      console.warn('AI generator error:', err);
      showToast('Could not reach AI generator', 'error');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    addProduct({
      ...formData,
      image: formData.image || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
      price: Number(formData.price),
      calories: Number(formData.calories || 100),
      defaultOptions: {
        size: 'Regular Cup',
        sugar: 'Normal Sugar',
        temperature: 'Hot (Steaming)',
        addOns: []
      }
    });
    setIsAddingProduct(false);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    updateProduct(editingProduct.id, {
      ...formData,
      image: formData.image || editingProduct.image || '',
      price: Number(formData.price),
      calories: Number(formData.calories)
    });
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('admin-dashboard')}
            className="p-2 rounded-xl hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Restaurant Digital Menu Management
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              {products.length} active cafe beverages & snacks synced with Node.js Express & Supabase
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chai, snacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:border-[#2D4739] shadow-2xs"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-[#2D4739] hover:bg-[#23382D] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', name: 'All Menu Items' },
          { id: 'tea', name: 'Chai & Teas' },
          { id: 'coffee', name: 'Coffees' },
          { id: 'cold-beverages', name: 'Iced Brews' },
          { id: 'snacks', name: 'Snacks' },
          { id: 'specials', name: 'Combos' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/80 font-bold uppercase tracking-wider text-stone-500">
              <th className="px-5 py-3.5">Product & Photo</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Price</th>
              <th className="px-5 py-3.5">Prep Time</th>
              <th className="px-5 py-3.5">Live Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredProducts.map(product => {
              const isAvailable = product.isAvailable !== false;
              return (
                <tr key={product.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-stone-100 shrink-0 overflow-hidden flex items-center justify-center border border-stone-200 shadow-2xs">
                        <TeaIllustration
                          image={product.image}
                          id={product.id}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 border border-emerald-600 rounded-2xs flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-emerald-600" />
                          </div>
                          <span>{product.name}</span>
                        </div>
                        <div className="text-[11px] text-stone-400 truncate max-w-xs">{product.tastingNotes || product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-stone-700">
                    {product.categoryName}
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-stone-900 tabular-nums text-sm">
                    ₹{product.price}
                  </td>
                  <td className="px-5 py-3.5 text-stone-600">
                    {product.prepTime || '4-5 mins'}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleProductAvailability(product.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-900 hover:bg-rose-200'
                      }`}
                    >
                      {isAvailable ? '● Available' : '○ Sold Out'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Edit Item"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {(isAddingProduct || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {isAddingProduct ? 'Add Item to Digital Menu' : `Edit "${editingProduct?.name}"`}
                </h3>
                <p className="text-[11px] text-stone-500">
                  Upload an appetizing photo so customers see it on their table ordering menu
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddingProduct(false);
                  setEditingProduct(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isAddingProduct ? handleSubmitAdd : handleSubmitEdit} className="space-y-4 text-xs">
              
              {/* Product Photo Upload & Preview Section */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#2D4739]" />
                    <span>Product Photo (Shown on QR Menu)</span>
                  </label>
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="text-[11px] text-rose-600 hover:underline font-semibold"
                    >
                      Clear Image
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  
                  {/* Live Image Preview Box */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-stone-200 border-2 border-stone-300 overflow-hidden shrink-0 shadow-inner flex items-center justify-center relative group">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-stone-400">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                        <span className="text-[10px]">No Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Actions */}
                  <div className="flex-1 space-y-2.5 w-full">
                    
                    {/* Device Upload Button */}
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:border-stone-400 hover:bg-stone-50 text-stone-800 font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#2D4739]" />
                        <span>Upload from Phone / PC</span>
                      </button>
                    </div>

                    {/* URL Input */}
                    <div className="relative">
                      <LinkIcon className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="Or paste direct image URL (https://...)"
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:border-[#2D4739]"
                      />
                    </div>

                  </div>
                </div>

                {/* Fast Preset Curated Photo Selector */}
                <div className="space-y-1.5 pt-2 border-t border-stone-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Quick Select from Cafe Food Library:
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {PRESET_FOOD_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium shrink-0 transition-all ${
                          formData.image === preset.url
                            ? 'bg-[#2D4739] text-white border-[#2D4739] shadow-2xs font-bold'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-4 h-4 rounded-full object-cover shrink-0"
                        />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Item Details */}
              <div>
                <label className="font-bold uppercase text-stone-700 block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kashmiri Kahwa Chai"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#2D4739]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-stone-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const catMap = {
                        'tea': 'Artisanal Teas & Chai',
                        'coffee': 'Hot & Cold Coffees',
                        'cold-beverages': 'Iced Brews & Shakes',
                        'snacks': 'Quick Bites & Snacks',
                        'specials': 'Chef Special Combos'
                      };
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        categoryName: catMap[e.target.value] || 'Artisanal Teas & Chai'
                      });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#2D4739]"
                  >
                    <option value="tea">Artisanal Teas & Chai</option>
                    <option value="coffee">Hot & Cold Coffees</option>
                    <option value="cold-beverages">Iced Brews & Shakes</option>
                    <option value="snacks">Quick Bites & Snacks</option>
                    <option value="specials">Chef Special Combos</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase text-stone-700 block mb-1">Price in ₹</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 font-mono font-bold focus:bg-white focus:outline-none focus:border-[#2D4739]"
                  />
                </div>
              </div>

              {/* Description & AI Generator */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold uppercase text-stone-700">Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={isGeneratingAi}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-0.5 rounded-lg transition-colors"
                  >
                    <Sparkles className={`w-3 h-3 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingAi ? 'Generating...' : 'Auto-Generate with Gemini AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe ingredients, steeping method..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#2D4739]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-stone-700 block mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                    placeholder="e.g. 4-5 mins"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#2D4739]"
                  />
                </div>
                <div>
                  <label className="font-bold uppercase text-stone-700 block mb-1">Origin / Craft</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="e.g. Assam & Malabar"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#2D4739]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingProduct(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2D4739] text-white font-bold hover:bg-[#23382D] shadow-xs transition-colors"
                >
                  {isAddingProduct ? 'Add to Menu' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
