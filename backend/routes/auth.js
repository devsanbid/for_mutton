const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  resetPassword,
  confirmResetPassword
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const {
  validateRegister,
  validateLogin,
  handleValidationErrors
} = require('../middleware/validation');

// Public routes
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/reset-password', resetPassword);
router.post('/confirm-reset-password', confirmResetPassword);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, uploadSingle(), updateProfile);
router.put('/change-password', auth, changePassword);

module.exports = router;