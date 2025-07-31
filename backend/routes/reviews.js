const express = require('express');
const router = express.Router();
const {
  createReview,
  getHotelReviews,
  getUserReviews,
  getHotelerReviews,
  updateReview,
  deleteReview,
  getReviewById
} = require('../controllers/reviewController');
const { auth, authorize } = require('../middleware/auth');
const {
  validateReview,
  handleValidationErrors
} = require('../middleware/validation');

// Public routes
router.get('/hotel/:hotelId', getHotelReviews);

// User routes
router.post('/', auth, authorize(['user']), validateReview, handleValidationErrors, createReview);
router.get('/user/my-reviews', auth, authorize(['user']), getUserReviews);
router.put('/:id', auth, authorize(['user']), validateReview, handleValidationErrors, updateReview);
router.delete('/:id', auth, authorize(['user']), deleteReview);

// Hotelier routes
router.get('/hotelier-reviews', auth, authorize(['hotelier']), getHotelerReviews);

// General routes (must be last to avoid conflicts)
router.get('/:id', getReviewById);

module.exports = router;