import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  X,
  User,
  Lock,
  Mail,
  Phone,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  LogOut,
  LogIn,
  AlertCircle
} from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    user,
    setUser,
    currentTable,
    navigate,
    showToast,
    logoutUser
  } = useApp();

  const [mode, setMode] = useState(authModalMode || 'login'); // 'login' | 'signup' | 'admin' | 'guest'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync mode when modal opens with a specific mode (e.g. 'admin' or 'signup')
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode || 'login');
      setErrorMsg('');
      if (authModalMode === 'admin') {
        setEmail('');
        setPassword('');
      }
    }
  }, [isAuthModalOpen, authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleCustomerLogin = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await api.login(email, password);
      if (res?.success && res.user) {
        const userRole = res.user.role || (res.user.email?.toLowerCase().includes('admin') ? 'admin' : 'customer');
        setUser({
          ...res.user,
          role: userRole,
          isLoggedIn: true
        });
        setIsAuthModalOpen(false);

        // Role-based post-login redirection
        if (userRole === 'admin') {
          showToast(`Welcome Admin ${res.user.name || ''}! 👨‍🍳`);
          navigate('admin-dashboard');
        } else {
          showToast(`Welcome back, ${res.user.name || 'Tea Lover'}! 👋`);
          navigate('home');
        }
      } else {
        setErrorMsg(res?.error || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await api.login(email, password);
      if (res?.success && res.user) {
        // Strict Role Check for Admin Access
        const userRole = res.user.role || (res.user.email?.toLowerCase().includes('admin') ? 'admin' : 'customer');
        if (userRole === 'admin') {
          setUser({
            ...res.user,
            role: 'admin',
            isLoggedIn: true
          });
          showToast('Authenticated as Kitchen Admin! 👨‍🍳');
          setIsAuthModalOpen(false);
          navigate('admin-dashboard');
        } else {
          setErrorMsg('Access Denied: This account is a regular customer and does not have Kitchen/Admin privileges.');
        }
      } else {
        setErrorMsg(res?.error || 'Invalid admin credentials.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Admin authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerSignUp = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await api.signUp(email, password, name, phone);
      if (res?.success && res.user) {
        setUser({
          ...res.user,
          role: 'customer',
          isLoggedIn: true
        });
        showToast(`Account created! Welcome to TeaGo, ${res.user.name}! 🎉`);
        setIsAuthModalOpen(false);
        navigate('home');
      } else {
        setErrorMsg(res?.error || 'Sign up failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      const res = await api.guestLogin(name || 'Diner', currentTable || '01');
      if (res?.user) {
        setUser({
          ...res.user,
          isLoggedIn: false
        });
        showToast('Continuing as Table Guest 🍵');
        setIsAuthModalOpen(false);
      }
    } catch (err) {
      console.warn('Guest login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdminMode = mode === 'admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base shadow-xs ${
              isAdminMode ? 'bg-stone-900 text-amber-300' : 'bg-[#2D4739] text-white'
            }`}>
              {isAdminMode ? <ShieldCheck className="w-5 h-5" /> : '🍃'}
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {user?.isLoggedIn && !isAdminMode
                  ? 'Your TeaGo Profile'
                  : isAdminMode
                  ? 'Kitchen & Admin Login'
                  : mode === 'signup'
                  ? 'Create Customer Account'
                  : 'Customer Sign In'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isAdminMode
                  ? 'Restricted to authorized restaurant staff'
                  : user?.isLoggedIn
                  ? 'Manage your orders and milestone vouchers'
                  : 'Track dining rewards & unlock ₹10 welcome voucher'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Already Logged In as customer and viewing modal */}
        {user?.isLoggedIn && !isAdminMode ? (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-900 text-sm block">{user.name}</span>
                  <span className="text-stone-500 text-xs">{user.email}</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold">
                  {user.loyaltyTier || 'Silver Member'}
                </span>
              </div>
              
              {user.phone && (
                <div className="text-stone-600 flex items-center gap-1.5 pt-1">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{user.phone}</span>
                </div>
              )}

              <div className="pt-2 border-t border-stone-200/60 flex justify-between items-center text-stone-600">
                <span>Completed Table Orders:</span>
                <strong className="text-stone-900 font-mono text-sm">{user.completedOrdersCount || 0} / 10</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsAuthModalOpen(false);
                  navigate('profile');
                }}
                className="py-2.5 rounded-xl bg-[#2D4739] text-white font-bold hover:bg-[#23382D] transition-colors"
              >
                View Full Profile
              </button>
              <button
                onClick={() => {
                  logoutUser();
                  setIsAuthModalOpen(false);
                }}
                className="py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Error banner */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. ADMIN LOGIN MODE (No signup option allowed) */}
            {isAdminMode ? (
              <form onSubmit={handleAdminLogin} className="space-y-3.5 text-xs">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Staff Access Only:</strong> Enter your verified restaurant admin credentials. Customer accounts cannot access the kitchen portal.
                  </div>
                </div>

                <div>
                  <label className="font-bold uppercase text-stone-700 block mb-1">Staff / Admin Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@teago.com"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-stone-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold uppercase text-stone-700 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isLoading ? 'Verifying Admin Permissions...' : 'Sign In as Kitchen Admin'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                    }}
                    className="text-stone-500 hover:text-stone-800 text-xs font-semibold underline"
                  >
                    ← Switch back to Customer Sign In
                  </button>
                </div>
              </form>
            ) : mode === 'login' ? (
              /* 2. CUSTOMER SIGN IN (With prominent Create Account directly below) */
              <div className="space-y-4 text-xs">
                <form onSubmit={handleCustomerLogin} className="space-y-3.5">
                  <div>
                    <label className="font-bold uppercase text-stone-700 block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#2D4739]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold uppercase text-stone-700 block mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#2D4739]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-[#2D4739] hover:bg-[#23382D] text-white font-bold text-xs transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                  </button>
                </form>

                {/* Direct Create Account Option Box right below */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-950 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>New to TeaGo? Create Account</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Sign up with your Name, Email & Phone to get an instant <strong>₹10 Welcome Voucher</strong>!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMsg('');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white border border-emerald-300 text-emerald-900 font-bold text-xs hover:bg-emerald-100 transition-all shadow-2xs"
                  >
                    Create New Account (Name, Email & Password)
                  </button>
                </div>

                {/* Guest diner quick continue */}
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={handleGuestLogin}
                    className="text-stone-500 hover:text-stone-800 text-[11px] font-medium underline"
                  >
                    Or continue as Guest Diner without logging in
                  </button>
                </div>
              </div>
            ) : mode === 'signup' ? (
              /* 3. CUSTOMER SIGN UP FORM */
              <form onSubmit={handleCustomerSignUp} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold uppercase text-stone-700 block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Aarav Sharma"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#2D4739]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold uppercase text-stone-700 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aarav@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#2D4739]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold uppercase text-stone-700 block mb-1">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#2D4739]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold uppercase text-stone-700 block mb-1">Create Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#2D4739]"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Includes instant <strong>₹10 Welcome Gift Voucher</strong> for your table order!</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-[#2D4739] hover:bg-[#23382D] text-white font-bold text-xs transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                    }}
                    className="text-stone-600 hover:text-stone-900 font-semibold underline text-xs"
                  >
                    Already have an account? Sign In here
                  </button>
                </div>
              </form>
            ) : null}
          </>
        )}

      </div>
    </div>
  );
}
