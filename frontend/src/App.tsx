import { useEffect, useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import Profile from './pages/Profile';
import Support from './pages/Support';
import Settings from './pages/Settings';
import ControllerSettingsTabs from './pages/ControllerSettingsTabs';
import SettingsDocPage from './pages/SettingsDocPage';
import OnboardComputerSettings from './pages/OnboardComputerSettings';
import MicrolightSettings from './pages/MicrolightSettings';
import Contact from './pages/Contact';
import Partners from './pages/Partners';
import Reviews from './pages/Reviews';
import News from './pages/News';
import NewsDetailProtection from './pages/NewsDetailProtection';
import NewsDetailBrief from './pages/NewsDetailBrief';
import NewsDetailPrice from './pages/NewsDetailPrice';
import NewsDetailDynamic from './pages/NewsDetailDynamic';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import ULightController from './pages/ULightController';
import ReviewDetailULight from './pages/ReviewDetailULight';
import OnBoardComputer from './pages/OnBoardComputer';
import Controller from './pages/Controller';
import SurRonLightBee from './pages/SurRonLightBee';
import AuthConfirm from './pages/AuthConfirm';

import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/Dashboard';
import AdminDashboard3 from './admin/pages/Dashboard3';
import AdminLogin from './admin/pages/Login';
import AdminCatalog from './admin/pages/Catalog';
import AdminOrders from './admin/pages/Orders';
import AdminReviews from './admin/pages/ReviewsManager';
import AdminOrderDetail from './admin/pages/OrderDetail';
import AdminProductEditor from './admin/pages/ProductEditor';
import AdminNewsManager from './admin/pages/NewsManager';
import AdminHomeManager from './admin/pages/HomeManager';
import AdminShopManager from './admin/pages/ShopManager';
import { AuthProvider as AdminAuthProvider, ProtectedRoute as AdminProtectedRoute } from './admin/context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { NewsProvider } from './context/NewsContext';
import { ProductContentProvider } from './context/ProductContentContext';
import CookieBanner from './components/CookieBanner';
import CartToast from './components/CartToast';

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const enableAdmin = import.meta.env.DEV || import.meta.env.VITE_ENABLE_ADMIN === 'true';

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px)');
    const apply = (matches: boolean) => {
      document.body.classList.toggle('is-mobile', matches);
      document.documentElement.classList.toggle('is-mobile', matches);
    };
    apply(mediaQuery.matches);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px)');
    const updateMatch = () => {
      document.body.classList.toggle('is-mobile', mediaQuery.matches);
      document.documentElement.classList.toggle('is-mobile', mediaQuery.matches);
    };
    updateMatch();
    mediaQuery.addEventListener('change', updateMatch);
    return () => mediaQuery.removeEventListener('change', updateMatch);
  }, []);

  useEffect(() => {
    const isHome = location.pathname === '/';
    document.body.classList.toggle('is-home', isHome);
    document.documentElement.classList.toggle('is-home', isHome);
  }, [location.pathname]);

  useLayoutEffect(() => {
    try {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
    } catch {}
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    window.requestAnimationFrame(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (isAdminRoute) return;
    const path = `${location.pathname}${location.search}`;
    try {
      const body = JSON.stringify({ path });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/track', new Blob([body], { type: 'application/json' }));
      } else {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => undefined);
      }
    } catch {
      return;
    }
  }, [isAdminRoute, location.pathname, location.search]);

  return (
    <AdminAuthProvider>
      <AuthProvider>
        <ProductProvider>
          <ProductContentProvider>
            <ReviewsProvider>
              <NewsProvider>
                <CartProvider>
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/protection-of-controllers" element={<NewsDetailProtection />} />
            <Route path="/news/brief-news-for-the-year" element={<NewsDetailBrief />} />
            <Route path="/news/price-increase" element={<NewsDetailPrice />} />
            <Route path="/news/:slug" element={<NewsDetailDynamic />} />
            <Route path="/support" element={<Support />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/controller" element={<ControllerSettingsTabs />} />
            <Route path="/settings/onboard-computer" element={<OnboardComputerSettings />} />
            <Route path="/settings/microlight" element={<MicrolightSettings />} />
            <Route path="/settings/:slug" element={<SettingsDocPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/auth/confirm" element={<AuthConfirm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/ulight-controller" element={<ULightController />} />
            <Route path="/reviews/ulight" element={<ReviewDetailULight />} />
            <Route path="/sur-ron-light-bee" element={<SurRonLightBee />} />
            <Route path="/on-board-computer" element={<OnBoardComputer />} />
            <Route path="/controller" element={<Controller />} />

            {enableAdmin ? (
              <>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout />
                    </AdminProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard3 />} />
                  <Route path="dashboard" element={<AdminDashboard3 />} />
                  <Route path="dashboard-3" element={<AdminDashboard3 />} />
                  <Route path="catalog" element={<AdminCatalog />} />
                  <Route path="catalog/:id" element={<AdminProductEditor />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="orders/:id" element={<AdminOrderDetail />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="news" element={<AdminNewsManager />} />
                  <Route path="home" element={<AdminHomeManager />} />
                  <Route path="shop" element={<AdminShopManager />} />
                  <Route path="*" element={<AdminDashboard />} />
                </Route>
              </>
            ) : (
              <>
                <Route path="/admin/login" element={<Home />} />
                <Route path="/admin/*" element={<Home />} />
              </>
            )}
              
              <Route path="*" element={<Home />} />
            </Routes>
            {!isAdminRoute && location.pathname !== '/' && (
              <>
                <div className="footer-separator" />
                <Footer />
              </>
            )}
            <CookieBanner />
            <CartToast />
                </CartProvider>
              </NewsProvider>
            </ReviewsProvider>
          </ProductContentProvider>
        </ProductProvider>
      </AuthProvider>
    </AdminAuthProvider>
  );
}
