import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Sparkles,
  User,
  ShieldCheck,
  Menu as MenuIcon,
  X,
  QrCode,
  ArrowRight,
  LogIn,
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const {
    currentView,
    navigate,
    cartItemCount,
    cartSubtotal,
    setIsQRModalOpen,
    openCustomerAuth,
    openAdminAuth,
    logoutUser,
    user,
    settings
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminView = currentView.startsWith('admin');

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Digital Menu', view: 'menu' },
    { label: 'Live Order Tracker', view: 'tracking' },
    { label: 'Orders', view: 'orders' },
    { label: 'Rewards', view: 'rewards' },
    { label: 'AI Assistant', view: 'ai-assistant', highlight: true },
  ];

  const adminNavLinks = [
    { label: 'Dashboard', view: 'admin-dashboard' },
    { label: 'Kitchen Orders', view: 'admin-orders' },
    { label: 'Menu Catalog', view: 'admin-products' },
    { label: 'Table Management', view: 'admin-tables' },
    { label: 'Customers', view: 'admin-customers' },
    { label: 'Analytics', view: 'admin-analytics' },
    { label: 'Settings', view: 'admin-settings' },
  ];

  return (
    <>
      {/* Restaurant Announcement Banner */}
      <div className="bg-[#2D4739] text-[#E8F2EC] text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto">
            <span>☕</span>
            <span>{settings.announcementText}</span>
          </div>

          {!isAdminView && (
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 text-amber-300 hover:text-amber-200 text-xs font-semibold underline shrink-0"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Table QR Scanner</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Zone 1: Brand Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(isAdminView ? 'admin-dashboard' : 'home')}
              className="group flex items-center gap-2 text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#2D4739] text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm transition-transform group-hover:scale-105">
                🍃
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-stone-900 font-serif">
                  TeaGo
                </span>
              </div>
            </button>

            {isAdminView && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-900 text-white">
                Admin Operations
              </span>
            )}
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {!isAdminView ? (
              navLinks.map(link => {
                const isActive = currentView === link.view;
                return (
                  <button
                    key={link.view}
                    onClick={() => navigate(link.view)}
                    className={`relative py-1 transition-colors ${
                      isActive
                        ? 'text-[#2D4739] font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {link.label}
                    {link.highlight && (
                      <span className="ml-1 inline-block text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold uppercase">
                        AI
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2D4739] rounded-full" />
                    )}
                  </button>
                );
              })
            ) : (
              adminNavLinks.map(link => {
                const isActive = currentView === link.view;
                return (
                  <button
                    key={link.view}
                    onClick={() => navigate(link.view)}
                    className={`relative py-1 transition-colors ${
                      isActive
                        ? 'text-stone-900 font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
                    )}
                  </button>
                );
              })
            )}
          </nav>

          {/* Zone 3: Actions (Order Bag, Profile, QR Scanner, Admin Portal) */}
          <div className="flex items-center gap-2.5">
            {!isAdminView ? (
              <>
                {/* QR Scanner Trigger */}
                <button
                  onClick={() => setIsQRModalOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors"
                  title="Scan Table QR Code"
                >
                  <QrCode className="w-4 h-4 text-[#2D4739]" />
                  <span>Scan QR</span>
                </button>

                {/* Order Bag Button */}
                <button
                  onClick={() => navigate('cart')}
                  className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2D4739] text-white hover:bg-[#23382D] transition-all shadow-sm active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs font-semibold">
                    My Order
                  </span>
                  {cartItemCount > 0 && (
                    <span className="flex items-center justify-center bg-amber-400 text-stone-900 font-bold text-xs h-5 min-w-5 px-1 rounded-full tabular-nums">
                      {cartItemCount}
                    </span>
                  )}
                  {cartSubtotal > 0 && (
                    <span className="hidden md:inline text-xs font-mono font-medium pl-1 border-l border-emerald-700/60 tabular-nums">
                      ₹{cartSubtotal}
                    </span>
                  )}
                </button>

                {/* Profile / Login Button */}
                {user?.isLoggedIn ? (
                  <button
                    onClick={() => navigate('profile')}
                    className={`px-3 py-1.5 rounded-xl border transition-colors flex items-center gap-2 text-xs shadow-2xs ${
                      currentView === 'profile'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                    }`}
                    title={`Profile: ${user.name} (${user.loyaltyTier})`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#2D4739] text-white flex items-center justify-center font-bold text-[10px]">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline font-bold">
                      {user.name ? user.name.split(' ')[0] : 'Profile'}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => openCustomerAuth('login')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 hover:border-[#2D4739] hover:bg-stone-50 font-bold text-xs transition-all shadow-2xs active:scale-95"
                    title="Sign In or Create Account"
                  >
                    <LogIn className="w-4 h-4 text-[#2D4739]" />
                    <span>Login</span>
                  </button>
                )}

                {/* Switch to Admin Mode */}
                <button
                  onClick={() => {
                    if (user?.isLoggedIn && user?.role === 'admin') {
                      navigate('admin-dashboard');
                    } else {
                      openAdminAuth();
                    }
                  }}
                  className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                  title="Switch to Restaurant Admin & Kitchen Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                  <span>Admin</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  logoutUser();
                  navigate('home');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors"
                title="Sign Out of Admin Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-stone-200 bg-[#FAF8F5] px-4 pt-2 pb-4 space-y-1 shadow-lg">
            {!isAdminView ? (
              <>
                {navLinks.map(link => (
                  <button
                    key={link.view}
                    onClick={() => {
                      navigate(link.view);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentView === link.view
                        ? 'bg-emerald-50 text-[#2D4739] font-bold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

                <button
                  onClick={() => {
                    navigate('admin-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 mt-2 border-t border-stone-200 text-xs text-stone-600 font-medium flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-stone-500" />
                  <span>Restaurant Kitchen & Staff Portal</span>
                </button>
              </>
            ) : (
              <>
                {adminNavLinks.map(link => (
                  <button
                    key={link.view}
                    onClick={() => {
                      navigate(link.view);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentView === link.view
                        ? 'bg-stone-200 text-stone-900 font-bold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    logoutUser();
                    navigate('home');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 mt-2 rounded-lg text-sm font-medium text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Admin Portal</span>
                </button>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
}
