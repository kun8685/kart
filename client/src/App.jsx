import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
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

import AxiosInterceptor from './components/AxiosInterceptor';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <Router>
      <AxiosInterceptor />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/cart/:id?" element={<CartScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />
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

export default App;
