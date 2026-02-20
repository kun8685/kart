import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import axios from 'axios';
import ScrollToTop from './components/ScrollToTop';
import AxiosInterceptor from './components/AxiosInterceptor';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import Loader from './components/Loader';
import AnalyticsTracker from './components/AnalyticsTracker';

// Lazy loading screens
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const ProductScreen = lazy(() => import('./screens/ProductScreen'));
const CartScreen = lazy(() => import('./screens/CartScreen'));
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const SearchScreen = lazy(() => import('./screens/SearchScreen'));
const CategoryScreen = lazy(() => import('./screens/CategoryScreen'));
const RegisterScreen = lazy(() => import('./screens/RegisterScreen'));
const ShippingScreen = lazy(() => import('./screens/ShippingScreen'));
const PaymentScreen = lazy(() => import('./screens/PaymentScreen'));
const PlaceOrderScreen = lazy(() => import('./screens/PlaceOrderScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const OrderScreen = lazy(() => import('./screens/OrderScreen'));
const ProductEditScreen = lazy(() => import('./screens/ProductEditScreen'));
const UserListScreen = lazy(() => import('./screens/UserListScreen'));
const ProductListScreen = lazy(() => import('./screens/ProductListScreen'));
const OrderListScreen = lazy(() => import('./screens/OrderListScreen'));
const DashboardScreen = lazy(() => import('./screens/DashboardScreen'));
const SiteSettingsScreen = lazy(() => import('./screens/SiteSettingsScreen'));
const DiscountManagerScreen = lazy(() => import('./screens/admin/DiscountManagerScreen'));
const CouponListScreen = lazy(() => import('./screens/admin/CouponListScreen'));
const AnalyticsScreen = lazy(() => import('./screens/admin/AnalyticsScreen'));
const ChatListScreen = lazy(() => import('./screens/admin/ChatListScreen'));
const AdminChatDetailsScreen = lazy(() => import('./screens/admin/AdminChatDetailsScreen'));
const ForgotPasswordScreen = lazy(() => import('./screens/ForgotPasswordScreen'));
const ResetPasswordScreen = lazy(() => import('./screens/ResetPasswordScreen'));
const MyOrdersScreen = lazy(() => import('./screens/MyOrdersScreen'));
const InfoScreen = lazy(() => import('./screens/InfoScreen'));

function App() {

  useEffect(() => {
    // Fetch Global Site Theme on Load
    const fetchTheme = async () => {
      try {
        const { data } = await axios.get('/api/content');
        if (data.websiteTheme && data.websiteTheme !== 'default') {
          document.body.setAttribute('data-theme', data.websiteTheme);
        } else {
          document.body.removeAttribute('data-theme');
        }
      } catch (err) {
        console.error('Failed to load website theme', err);
      }
    };
    fetchTheme();
  }, []);

  return (
    <Router>
      {/* Festive Particles Container (Controlled by CSS data-theme) */}
      <div className="theme-particles">
        <div className="particle p1"></div>
        <div className="particle p2"></div>
        <div className="particle p3"></div>
        <div className="particle p4"></div>
        <div className="particle p5"></div>
        <div className="particle p6"></div>
        <div className="particle p7"></div>
      </div>

      {/* Water Balloon Explosions */}
      <div className="theme-balloons">
        <div className="balloon b-logo"></div>
        <div className="balloon b1"></div>
        <div className="balloon b2"></div>
        <div className="balloon b3"></div>
        <div className="balloon b4"></div>
        <div className="balloon b5"></div>
      </div>

      <ScrollToTop />
      <AnalyticsTracker />
      <AxiosInterceptor />
      <Suspense fallback={<div className="min-h-screen flex justify-center items-center"><Loader /></div>}>
        <Routes>
          {/* Public Routes */}
          <Route element={<ScrollToTopPublicWrapper />}>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/products" element={<SearchScreen />} />
              <Route path="/categories" element={<CategoryScreen />} />
              <Route path="/search/:keyword" element={<SearchScreen />} />
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route path="/cart/:id?" element={<CartScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
              <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orders" element={<MyOrdersScreen />} />
              <Route path="/info/:page" element={<InfoScreen />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="userlist" element={<UserListScreen />} />
            <Route path="productlist" element={<ProductListScreen />} />
            <Route path="product/:id/edit" element={<ProductEditScreen />} />
            <Route path="orderlist" element={<OrderListScreen />} />
            <Route path="order/:id" element={<OrderScreen />} />
            <Route path="dashboard" element={<DashboardScreen />} />
            <Route path="analytics" element={<AnalyticsScreen />} />
            <Route path="sales" element={<DiscountManagerScreen />} />
            <Route path="coupons" element={<CouponListScreen />} />
            <Route path="settings" element={<SiteSettingsScreen />} />
            <Route path="chat" element={<ChatListScreen />} />
            <Route path="chat/:userId" element={<AdminChatDetailsScreen />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

// Wrapper to ensure scroll happens on route change
const ScrollToTopPublicWrapper = () => {
  return <Outlet />;
};

export default App;
