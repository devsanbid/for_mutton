const express = require('express');
const router = express.Router();
const {
  getHotelerAnalytics,
  getDashboardStats
} = require('../controllers/analyticsController');
const { auth, authorize } = require('../middleware/auth');

router.get('/hotelier', auth, authorize(['hotelier']), getHotelerAnalytics);
router.get('/dashboard', auth, authorize(['hotelier']), getDashboardStats);

module.exports = router;