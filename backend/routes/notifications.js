const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  getNotificationStats,
  getAdminNotifications
} = require('../controllers/notificationController');
const { auth, authorize } = require('../middleware/auth');

// User notification routes
router.get('/', auth, getUserNotifications);
router.get('/stats', auth, getNotificationStats);
router.put('/:id/read', auth, markAsRead);
router.put('/mark-all-read', auth, markAllAsRead);
router.delete('/:id', auth, deleteNotification);

// Admin notification routes
router.get('/admin/all', auth, authorize(['admin']), getAdminNotifications);
router.post('/admin/create', auth, authorize(['admin']), createNotification);

module.exports = router;