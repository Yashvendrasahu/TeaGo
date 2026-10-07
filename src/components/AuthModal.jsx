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
  AlertCircle,
  KeyRound,
  Send,
  RotateCcw
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

  const [mode, setMode] = useState(authModalMode || 'login'); // 'login' | 'signup' | 'admin'
  const [authMethod, setAuthMethod] = useState('password'); // 'password' | 'otp'
  const [otpStep, setOtpStep] = useState('input'); // 'input' | 'verify'
  const [otpToken, setOtpToken] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Sync mode when modal opens with a specific mode (e.g. 'admin' or 'signup')
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode || 'login');
      setAuthMethod('password');
      setOtpStep('input');
      setOtpToken('');
      setErrorMsg('');
      setInfoMsg('');
      if (authModalMode === 'admin') {
        setEmail('');
        setPassword('');
      }
    }
  }, [isAuthModalOpen, authModalMode]);

  // Resend Timer Countdown
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (!isAuthModalOpen) return null;

  // 1. Send 6-Digit Email OTP
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.sendEmailOtp(email, name, phone);
      if (res?.success) {
        setOtpStep('verify');
        setOtpTimer(45);
        setInfoMsg(res.message || `6-digit OTP code has been sent to ${email}. Check your email inbox!`);
        showToast(`OTP Code sent to ${email} 📩`);
      } else {
        setErrorMsg(res?.error || 'Failed to send OTP. Please check your email.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify 6-Digit Email OTP
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!otpToken || otpToken.trim().length < 6) {
      setErrorMsg('Please enter the complete 6-digit OTP code received on your email.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.verifyEmailOtp(email, otpToken, name, phone);
      if (res?.success && res.user) {
        setUser({
          ...res.user,
          role: res.user.role || 'customer',
          isLoggedIn: true
        });
        showToast(`Welcome to TeaGo, ${res.user.name || 'Tea Lover'}! 🎉`);
        setIsAuthModalOpen(false);
        navigate('home');
      } else {
        setErrorMsg(res?.error || 'Invalid or expired OTP code. Please try again or resend.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Password-Based Login
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

  // 4. Admin Login
  const handleAdminLogin = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await api.login(email, password);
      if (res?.success && res.user) {
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

  // 5. Customer Password Sign-up
  const handleCustomerSignUp = async (e) => {
    e?.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.signUp(email, password, name, phone);
      if (res?.success && res.user) {
        setUser({
          ...res.user,
          role: res.user.role || 'customer',
          isLoggedIn: true
        });
        showToast(`Account created! Welcome to TeaGo, ${res.user.name || 'Tea Lover'}! 🎉`);
        setIsAuthModalOpen(false);
        navigate('home');
      } else {
        setErrorMsg(res?.error || 'Registration failed. Please check your credentials or network.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
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
                  : authMethod === 'otp'
                  ? 'Email OTP Verification'
                  : mode === 'signup'
                  ? 'Create Customer Account'
                  : 'Customer Sign In'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isAdminMode
                  ? 'Restricted to authorized restaurant staff'
                  : authMethod === 'otp'
                  ? 'Instant 6-digit verification code to your email'
                  : 'Manage table orders, rewards & favorite drinks'}
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

        {/* User Info If Already Logged In */}
        {user?.isLoggedIn && !isAdminMode ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 text-sm">{user.name || 'Diner'}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                  {user.role === 'admin' ? 'Staff Admin' : user.loyaltyTier || 'Silver Member'}
                </span>
              </div>
              <p className="text-emerald-800">{user.email || 'Table Guest'}</p>
              <div className="pt-2 border-t border-emerald-200/60 flex justify-between text-[11px] text-emerald-900 font-medium">
                <span>Completed Orders: {user.completedOrdersCount || 0}</span>
                <span>Active Table: {currentTable || '01'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsAuthModalOpen(false);
                  navigate('profile');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#2D4739] text-white text-xs font-bold hover:bg-[#23382D] transition-colors"
              >
                View Profile & Rewards
              </button>
              <button
                onClick={logoutUser}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Info Message (OTP Sent Notice) */}
            {infoMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{infoMsg}</span>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            {/* Method Toggle for Customer (Email OTP vs Password) */}
            {!isAdminMode && (
              <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('otp');
                    setErrorMsg('');
                    setInfoMsg('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    authMethod === 'otp'
                      ? 'bg-white text-[#2D4739] shadow-2xs font-bold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email OTP Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('password');
                    setErrorMsg('');
                    setInfoMsg('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    authMethod === 'password'
                      ? 'bg-white text-stone-900 shadow-2xs font-bold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Password Login</span>
                </button>
              </div>
            )}

            {/* Form Views */}
            {isAdminMode ? (
              /* 1. KITCHEN ADMIN LOGIN FORM */
              <form onSubmit={handleAdminLogin} className="space-y-3.5 text-xs">
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
                      setAuthMethod('otp');
                      setErrorMsg('');
                    }}
                    className="text-stone-500 hover:text-stone-800 text-xs font-semibold underline"
                  >
                    ← Switch back to Customer Sign In
                  </button>
                </div>
              </form>
            ) : authMethod === 'otp' ? (
              /* 2. CUSTOMER EMAIL OTP AUTH (Instant 6-Digit Code) */
              <div className="space-y-4 text-xs">
                {otpStep === 'input' ? (
                  <form onSubmit={handleSendOtp} className="space-y-3.5">
                    <div>
                      <label className="font-bold uppercase text-stone-700 block mb-1">Your Name (Optional)</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
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
                          placeholder="you@example.com"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#2D4739]"
                        />
                      </div>
                      <span className="text-[10px] text-stone-400 mt-1 block">
                        Supabase will send a 6-digit verification code to this email.
                      </span>
                    </div>

                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Instant <strong>₹10 Welcome Gift Voucher</strong> unlocked on first verification!</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-[#2D4739] hover:bg-[#23382D] text-white font-bold text-xs transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isLoading ? 'Sending OTP Code...' : 'Send 6-Digit OTP to Email'}</span>
                    </button>
                  </form>
                ) : (
                  /* Verify OTP Step */
                  <form onSubmit={handleVerifyOtp} className="space-y-3.5 animate-in fade-in">
                    <div className="text-center space-y-1 pb-1">
                      <div className="text-xs font-bold text-stone-900">
                        Enter 6-Digit Code sent to:
                      </div>
                      <div className="font-mono text-xs text-emerald-900 font-bold bg-emerald-50 py-1 px-3 rounded-lg inline-block">
                        {email}
                      </div>
                    </div>

                    <div>
                      <label className="font-bold uppercase text-stone-700 block mb-1 text-center">
                        6-Digit OTP Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        value={otpToken}
                        onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))}
                        placeholder="1 2 3 4 5 6"
                        className="w-full text-center text-xl tracking-[0.35em] font-mono font-bold py-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#2D4739]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || otpToken.length < 6}
                      className="w-full py-3 rounded-xl bg-[#2D4739] hover:bg-[#23382D] text-white font-bold text-xs transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isLoading ? 'Verifying OTP...' : 'Verify Code & Start Ordering'}</span>
                    </button>

                    <div className="flex items-center justify-between pt-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep('input');
                          setOtpToken('');
                          setErrorMsg('');
                        }}
                        className="text-stone-500 hover:text-stone-800 underline font-medium"
                      >
                        ← Change Email
                      </button>

                      <button
                        type="button"
                        disabled={otpTimer > 0 || isLoading}
                        onClick={handleSendOtp}
                        className={`flex items-center gap-1 font-bold ${
                          otpTimer > 0 ? 'text-stone-400' : 'text-[#2D4739] hover:underline'
                        }`}
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : mode === 'login' ? (
              /* 3. CUSTOMER PASSWORD SIGN IN */
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
                    Create New Account with Password
                  </button>
                </div>
              </div>
            ) : (
              /* 4. CUSTOMER PASSWORD SIGN UP FORM */
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
            )}
          </>
        )}

      </div>
    </div>
  );
}
