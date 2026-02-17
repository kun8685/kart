import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import SearchScreen from './screens/SearchScreen';
import CategoryScreen from './screens/CategoryScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderScreen from './screens/OrderScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import UserListScreen from './screens/UserListScreen';
import ProductListScreen from './screens/ProductListScreen';
import OrderListScreen from './screens/OrderListScreen';
import DashboardScreen from './screens/DashboardScreen';
import SiteSettingsScreen from './screens/SiteSettingsScreen';
import ChatListScreen from './screens/admin/ChatListScreen';
import AdminChatDetailsScreen from './screens/admin/AdminChatDetailsScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import InfoScreen from './screens/InfoScreen';

import AxiosInterceptor from './components/AxiosInterceptor';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AxiosInterceptor />
      <Routes>
        {/* Public Routes */}
        <Route element={<ScrollToTopPublicWrapper />}>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomeScreen />} />
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
          <Route path="settings" element={<SiteSettingsScreen />} />
          <Route path="chat" element={<ChatListScreen />} />
          <Route path="chat/:userId" element={<AdminChatDetailsScreen />} />
        </Route>
      </Routes>
    </Router>
  );
}

// Wrapper to ensure scroll happens on route change
const ScrollToTopPublicWrapper = () => {
  return <Outlet />;
};

export default App;
