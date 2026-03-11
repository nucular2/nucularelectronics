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
import ControllerSettings from './pages/ControllerSettings';
import Contact from './pages/Contact';
import Partners from './pages/Partners';
import Reviews from './pages/Reviews';
import News from './pages/News';
import NewsDetailProtection from './pages/NewsDetailProtection';
import NewsDetailBrief from './pages/NewsDetailBrief';
import NewsDetailPrice from './pages/NewsDetailPrice';
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

import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/Dashboard';
import AdminLogin from './admin/pages/Login';
import AdminCatalog from './admin/pages/Catalog';
import AdminOrders from './admin/pages/Orders';
import AdminReviews from './admin/pages/ReviewsManager';
import { AuthProvider as AdminAuthProvider, ProtectedRoute as AdminProtectedRoute } from './admin/context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { ReviewsProvider } from './context/ReviewsContext';

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

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

  return (
    <AdminAuthProvider>
      <AuthProvider>
        <ProductProvider>
          <ReviewsProvider>
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
            <Route path="/support" element={<Support />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/controller" element={<ControllerSettings />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/ulight-controller" element={<ULightController />} />
            <Route path="/reviews/ulight" element={<ReviewDetailULight />} />
            <Route path="/sur-ron-light-bee" element={<SurRonLightBee />} />
            <Route path="/on-board-computer" element={<OnBoardComputer />} />
            <Route path="/controller" element={<Controller />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="catalog" element={<AdminCatalog />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="*" element={<AdminDashboard />} />
              </Route>
              
              <Route path="*" element={<Home />} />
            </Routes>
            {!isAdminRoute && location.pathname !== '/' && <Footer />}
          </CartProvider>
          </ReviewsProvider>
        </ProductProvider>
      </AuthProvider>
    </AdminAuthProvider>
  );
}
