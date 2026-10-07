import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import CustomizerModal from './components/CustomizerModal';
import QRScanModal from './components/QRScanModal';
import AuthModal from './components/AuthModal';
import { Lock, ShieldCheck } from 'lucide-react';

// Customer Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import TrackingPage from './pages/TrackingPage';
import OrdersPage from './pages/OrdersPage';
import RewardsPage from './pages/RewardsPage';
import ProfilePage from './pages/ProfilePage';
import AiAssistantPage from './pages/AiAssistantPage';

// Restaurant Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminTablesPage from './pages/AdminTablesPage';
import AdminCustomersPage from './pages/AdminCustomersPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';

function AdminAccessGate() {
  const { openAdminAuth, navigate } = useApp();
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-stone-900 text-amber-300 flex items-center justify-center mx-auto text-2xl shadow-lg border border-stone-800">
        <Lock className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Restaurant Admin Access Required
        </h2>
        <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
          The Kitchen Dashboard and Table Management portal are restricted to verified staff and cafe administrators with role <code className="bg-stone-200 px-1.5 py-0.5 rounded font-mono font-bold">admin</code> in the profiles table.
        </p>
      </div>
      <div className="pt-3 flex flex-col sm:flex-row justify-center gap-3">
        <button
          onClick={openAdminAuth}
          className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sign In as Kitchen Admin</span>
        </button>
        <button
          onClick={() => navigate('home')}
          className="px-5 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-xs"
        >
          Return to Customer Menu
        </button>
      </div>
    </div>
  );
}

function MainContent() {
  const { currentView, user } = useApp();

  const isAdminRoute = currentView.startsWith('admin');
  const isAuthorizedAdmin = user?.isLoggedIn && user?.role === 'admin';

  const renderView = () => {
    // If attempting to access an Admin route without admin credentials
    if (isAdminRoute && !isAuthorizedAdmin) {
      return <AdminAccessGate />;
    }

    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'menu':
        return <MenuPage />;
      case 'product-details':
        return <ProductDetailsPage />;
      case 'cart':
        return <CartPage />;
      case 'tracking':
        return <TrackingPage />;
      case 'orders':
        return <OrdersPage />;
      case 'rewards':
        return <RewardsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'ai-assistant':
        return <AiAssistantPage />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'admin-orders':
        return <AdminOrdersPage />;
      case 'admin-products':
        return <AdminProductsPage />;
      case 'admin-tables':
        return <AdminTablesPage />;
      case 'admin-customers':
        return <AdminCustomersPage />;
      case 'admin-analytics':
        return <AdminAnalyticsPage />;
      case 'admin-settings':
        return <AdminSettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF8F5] text-stone-800">
      <Navbar />
      
      <main className="flex-grow">
        {renderView()}
      </main>

      {!isAdminRoute && <Footer />}

      {/* Global Modals & Overlays */}
      <CustomizerModal />
      <QRScanModal />
      <AuthModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
