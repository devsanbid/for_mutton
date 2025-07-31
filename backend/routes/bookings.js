const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getHotelerBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingById
} = require('../controllers/bookingController');
const { auth, authorize } = require('../middleware/auth');
const {
  validateBooking,
  handleValidationErrors
} = require('../middleware/validation');

// User routes
router.post('/', auth, authorize(['user']), validateBooking, handleValidationErrors, createBooking);
router.get('/my-bookings', auth, authorize(['user']), getUserBookings);
router.put('/:id/cancel', auth, authorize(['user']), cancelBooking);

// Hotelier routes
router.get('/hotelier-bookings', auth, authorize(['hotelier']), getHotelerBookings);
router.put('/:id/status', auth, authorize(['hotelier']), updateBookingStatus);

// General routes (must be last to avoid conflicts)
router.get('/:id', auth, getBookingById);

module.exports = router;