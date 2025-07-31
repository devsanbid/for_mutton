import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css'
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';


//importing pages
import HomeP from './pages/User/Homep.jsx';
import Login from './components/HomepageCompoent/Login.jsx';
import Signup from './components/HomepageCompoent/Sigin.jsx';



//UserSide
import Header from './components/User/Header.jsx';
import Dashboard from './pages/User/UserSide/Dashboard.jsx';
import HotelDetails from './pages/User/UserSide/HotelDetails.jsx';
import BookingForm from './pages/User/UserSide/BookingForm.jsx';
import MyBookings from './pages/User/UserSide/MyBooking.jsx';
import Profile from './pages/User/UserSide/Profile.jsx';
import Payment from './pages/User/UserSide/Payment.jsx';
import Reviews from './pages/User/UserSide/Reviews.jsx';
import Rooms from './pages/Hotelerpages/Rooms.jsx';
import UserLayout from './components/User/userlayout.jsx';
// import HotelDetails from './pages/User/UserSide/HotelDetails.jsx';
import ResetPasswordComponent from './components/User/ResetPassword.jsx';
import ChangePasswordComponent from './components/User/ChangePassword.jsx';
import HotelerChangePasswordComponent from './components/Hoteler/ChangePassword.jsx';
import AdminChangePasswordComponent from './components/Admin/ChangePassword.jsx';




//Hoteler
import MainLayout from './components/Hoteler/layout/MainLayout.jsx';
import HotelerDashboard from './pages/Hotelerpages/HotelerDashboard.jsx';
import Hotels from './pages/Hotelerpages/Hotels.jsx';
import Bookings from './pages/Hotelerpages/Bookings.jsx';
import Messages from './pages/Hotelerpages/Messages.jsx';
import HotelerReviews from './pages/Hotelerpages/HotelerReviews.jsx';
import Analytics from './pages/Hotelerpages/Analytics.jsx';
import HotelProfile from './pages/Hotelerpages/HotelerProfile.jsx';
import HotelerPayments from './pages/Hotelerpages/HotelerPayments.jsx';
import HotelListOnlyComponent from './pages/User/UserSide/HotelListingOnly.jsx';
import PendingApproval from './pages/Hotelier/PendingApproval.jsx';
import HotelerNotifications from './pages/Hotelerpages/Notifications.jsx';
import PaymentPage from './pages/Hotelerpages/Payments.jsx';
import ProtectedHotelerRoute from './components/Hoteler/common/ProtectedHotelerRoute.jsx';


//Admin
import AdminLayout from './components/Admin/Adminlayout/AdminLayout.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import UserManagement from './pages/Admin/UserManagement.jsx';
import HotelierManagement from './pages/Admin/HotelierManagement.jsx';
import HotelListings from './pages/Admin/HotelListings.jsx';
import Notifications from './pages/Admin/Notifications.jsx';
import AdminAnalytics from './pages/Admin/AdminAnalytics.jsx';
import Settings from './pages/Admin/Settings.jsx';
import AdminProfile from './pages/Admin/AdminProfile.jsx';


function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeP />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />


          {/* User Routes - Protected */}
          <Route path="/users" element={
            <ProtectedRoute requiredRole="user">
              <UserLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="hotel/:id" element={<HotelDetails />} />
            <Route path="book/:id" element={<BookingForm />} />
            <Route path="mybookings" element={<MyBookings />} />
            <Route path="hotel-listing" element={<HotelListOnlyComponent />} />
            <Route path="profile" element={<Profile />} />
            <Route path="payment/:bookingId" element={<Payment />} />
            <Route path="reviews/:bookingId" element={<Reviews />} />
            <Route path="reset-password" element={<HotelerChangePasswordComponent />} />
            <Route path="change-password" element={<ChangePasswordComponent />} />
          </Route>

           {/* Hotelier Pending Approval Route */}
           <Route path="/hotelier/pending" element={
             <ProtectedRoute requiredRole="hotelier" requireApproval={false}>
               <PendingApproval />
             </ProtectedRoute>
           } />

           {/* Hotelier Routes - Protected with Approval */}
          <Route path="/hoteler" element={
            <ProtectedRoute requiredRole="hotelier" requireApproval={true}>
              <MainLayout />
            </ProtectedRoute>
          }>
            {/* Hotel Profile - Always accessible */}
            <Route path="hotel-profile" element={<HotelProfile />} />
            
            {/* Protected routes - require profile completion */}
            <Route index element={
              <ProtectedHotelerRoute>
                <HotelerDashboard />
              </ProtectedHotelerRoute>
            } />
            <Route path="dashboard" element={
              <ProtectedHotelerRoute>
                <HotelerDashboard />
              </ProtectedHotelerRoute>
            } />
            <Route path="rooms" element={
              <ProtectedHotelerRoute>
                <Rooms />
              </ProtectedHotelerRoute>
            } />
            <Route path="bookings" element={
              <ProtectedHotelerRoute>
                <Bookings />
              </ProtectedHotelerRoute>
            } />
            <Route path="messages" element={
              <ProtectedHotelerRoute>
                <Messages />
              </ProtectedHotelerRoute>
            } />
            <Route path="reviews" element={
              <ProtectedHotelerRoute>
                <HotelerReviews />
              </ProtectedHotelerRoute>
            } />
            <Route path="analytics" element={
              <ProtectedHotelerRoute>
                <Analytics />
              </ProtectedHotelerRoute>
            } />
            <Route path="notifications" element={
              <ProtectedHotelerRoute>
                <HotelerNotifications />
              </ProtectedHotelerRoute>
            } />
            <Route path="payments" element={
              <ProtectedHotelerRoute>
                <HotelerPayments />
              </ProtectedHotelerRoute>
            } />
            <Route path="reset-password" element={<ResetPasswordComponent />} />
          </Route>




          {/* Admin Routes - Protected */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="hoteliers" element={<HotelierManagement />} />
            <Route path="hotels" element={<HotelListings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="adminprofile" element={<AdminProfile />} />
            <Route path="change-password" element={<AdminChangePasswordComponent />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );


}

export default App;