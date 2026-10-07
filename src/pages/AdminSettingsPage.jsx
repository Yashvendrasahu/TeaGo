import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  ArrowLeft,
  Save,
  Store,
  Wifi,
  Percent,
  Clock,
  QrCode,
  Database,
  Sparkles,
  CheckCircle2,
  Copy,
  ExternalLink,
  Zap,
  Server
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { settings, setSettings, navigate, showToast, backendStatus } = useApp();

  const [formData, setFormData] = useState({ ...settings });
  const [supabaseInfo, setSupabaseInfo] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    api.getSupabaseStatus().then(info => {
      if (info) setSupabaseInfo(info);
    }).catch(console.warn);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSettings({
      ...formData,
      taxRatePercent: Number(formData.taxRatePercent),
      avgPreparationMinutes: Number(formData.avgPreparationMinutes || 5)
    });
    showToast('Restaurant settings updated successfully!');
  };

  const handleCopySql = () => {
    if (supabaseInfo?.sqlSchema) {
      navigator.clipboard.writeText(supabaseInfo.sqlSchema);
      setCopiedSql(true);
      showToast('Copied Supabase SQL schema to clipboard! 📋');
      setTimeout(() => setCopiedSql(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('admin-dashboard')}
            className="p-2 rounded-xl hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Restaurant & Backend Settings
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Node.js Express backend, Supabase database, and Gemini AI configurations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Server className="w-3.5 h-3.5 text-emerald-700" />
            <span>Express Server Active</span>
          </span>
        </div>
      </div>

      {/* Backend & Supabase & Gemini Status Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 rounded-3xl p-6 text-white space-y-5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-700/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Full-Stack Architecture Status</span>
            </div>
            <h2 className="text-lg font-bold font-serif">Node.js + Express + Supabase + Gemini AI</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold">Node.js Express API</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${backendStatus?.gemini ? 'bg-emerald-400' : 'bg-emerald-400'}`} />
              <span className="font-bold">Gemini 3.8 Flash</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${supabaseInfo?.isConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="font-bold">{supabaseInfo?.isConfigured ? 'Supabase Connected' : 'Supabase Ready'}</span>
            </div>
          </div>
        </div>

        {/* Supabase Schema Helper Box */}
        <div className="bg-stone-950/60 rounded-2xl p-4 border border-stone-700/60 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-stone-200">Supabase SQL Schema Script (One-Click Setup)</span>
            </div>
            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5 w-fit"
            >
              {copiedSql ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Schema Copied!' : 'Copy SQL Schema'}</span>
            </button>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            To persist data permanently to your own Supabase project, open the <strong>Supabase SQL Editor</strong>, paste this script, and set <code className="text-emerald-300 font-mono">SUPABASE_URL</code> and <code className="text-emerald-300 font-mono">SUPABASE_ANON_KEY</code> in environment secrets.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Restaurant Profile */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4 text-xs shadow-2xs">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Store className="w-4 h-4 text-[#2D4739]" />
            <span>Cafe & Brand Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold uppercase text-stone-700 block mb-1">Restaurant Name</label>
              <input
                type="text"
                value={formData.restaurantName || ''}
                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:bg-white focus:outline-none focus:border-[#2D4739]"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-stone-700 block mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:bg-white focus:outline-none focus:border-[#2D4739]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold uppercase text-stone-700 block mb-1">Customer Top Announcement</label>
              <input
                type="text"
                value={formData.announcementText || ''}
                onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:bg-white focus:outline-none focus:border-[#2D4739]"
              />
            </div>
          </div>
        </div>

        {/* GST & Preparation Timing */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4 text-xs shadow-2xs">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2D4739]" />
            <span>Billing & Kitchen Timings</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold uppercase text-stone-700 block mb-1">Restaurant GST Rate (%)</label>
              <input
                type="number"
                step="0.5"
                value={formData.taxRatePercent || 5}
                onChange={(e) => setFormData({ ...formData, taxRatePercent: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 font-mono focus:bg-white focus:outline-none focus:border-[#2D4739]"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-stone-700 block mb-1">Standard Prep Benchmark (Minutes)</label>
              <input
                type="number"
                value={formData.avgPreparationMinutes || 5}
                onChange={(e) => setFormData({ ...formData, avgPreparationMinutes: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 font-mono focus:bg-white focus:outline-none focus:border-[#2D4739]"
              />
            </div>
          </div>
        </div>

        {/* Guest Wi-Fi */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4 text-xs shadow-2xs">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-[#2D4739]" />
            <span>Table Stand Guest Wi-Fi</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold uppercase text-stone-700 block mb-1">Wi-Fi Network SSID</label>
              <input
                type="text"
                value={formData.wifiName || ''}
                onChange={(e) => setFormData({ ...formData, wifiName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#2D4739]"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-stone-700 block mb-1">Wi-Fi Password</label>
              <input
                type="text"
                value={formData.wifiPassword || ''}
                onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 font-mono focus:bg-white focus:outline-none focus:border-[#2D4739]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#2D4739] hover:bg-[#23382D] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Restaurant Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}
