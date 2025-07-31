const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth, authorize } = require('../middleware/auth');

// Get hotelier payments with filters
router.get('/hotelier-payments', auth, authorize(['hotelier']), paymentController.getHotelerPayments);

// Get payment methods for hotelier
router.get('/payment-methods', auth, authorize(['hotelier']), paymentController.getHotelerPaymentMethods);

// Add payment method (eSewa details)
router.post('/payment-methods', auth, authorize(['hotelier']), paymentController.addPaymentMethod);

// Get specific payment details
router.get('/:id', auth, authorize(['hotelier']), paymentController.getPaymentDetails);

module.exports = router;