const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllHoteliers,
  updateHotelierStatus,
  getAllHotels,
  updateHotelStatus,
  getAllBookings,
  getPaymentAnalytics,
  getGeneralAnalytics,
  getRevenueAnalytics,
  getUserAnalytics,
  getBookingAnalytics,
  getRecentActivities,
  getSystemSettings,
  updateSystemSettings,
  getNotificationSettings,
  updateNotificationSettings
} = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

// All admin routes require admin authentication
router.use(auth, authorize(['admin']));

// Dashboard and analytics
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/activities', getRecentActivities);
router.get('/analytics/general', getGeneralAnalytics);
router.get('/analytics/revenue', getRevenueAnalytics);
router.get('/analytics/users', getUserAnalytics);
router.get('/analytics/bookings', getBookingAnalytics);
router.get('/analytics/payments', getPaymentAnalytics);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);

// Hotelier management
router.get('/hoteliers', getAllHoteliers);
router.put('/hoteliers/:id/status', updateHotelierStatus);

// Hotel management
router.get('/hotels', getAllHotels);
router.put('/hotels/:id/status', updateHotelStatus);

// Booking management
router.get('/bookings', getAllBookings);

// Settings management
router.get('/settings', getSystemSettings);
router.patch('/settings', updateSystemSettings);
router.get('/settings/notifications', getNotificationSettings);
router.patch('/settings/notifications', updateNotificationSettings);

module.exports = router;