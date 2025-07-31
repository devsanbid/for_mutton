import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboard from '../components/pages/AdminDashboard';
import UserManagement from '../components/pages/UserManagement';
import HotelierManagement from '../components/pages/HotelierManagement';
import HotelListings from '../components/pages/HotelListings';
import Notifications from '../components/pages/Notifications';
import Analytics from '../components/pages/Analytics';
import Settings from '../components/pages/Settings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="hoteliers" element={<HotelierManagement />} />
        <Route path="hotels" element={<HotelListings />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;