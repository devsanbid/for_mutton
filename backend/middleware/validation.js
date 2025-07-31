const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('role')
    .optional()
    .isIn(['user', 'hotelier'])
    .withMessage('Role must be either user or hotelier'),
  handleValidationErrors
];

const validateLogin = [
  handleValidationErrors
];

const validateHotel = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Hotel name must be between 2 and 200 characters'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  handleValidationErrors
];

const validateRoom = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Room name must be between 2 and 100 characters'),
  body('type')
    .isIn(['standard', 'deluxe', 'suite', 'presidential'])
    .withMessage('Invalid room type'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('capacity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Capacity must be between 1 and 10'),
  body('totalRooms')
    .isInt({ min: 1 })
    .withMessage('Total rooms must be at least 1'),
  handleValidationErrors
];

const validateBooking = [
  body('checkIn')
    .isISO8601()
    .toDate()
    .withMessage('Check-in date must be a valid date'),
  body('checkOut')
    .isISO8601()
    .toDate()
    .withMessage('Check-out date must be a valid date'),
  body('guests')
    .isInt({ min: 1 })
    .withMessage('Number of guests must be at least 1'),
  body('roomType')
    .trim()
    .notEmpty()
    .withMessage('Room type is required'),
  body('paymentMethod')
    .isIn(['cash', 'esewa'])
    .withMessage('Payment method must be cash or esewa'),
  handleValidationErrors
];

const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comment must be between 10 and 1000 characters'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateHotel,
  validateRoom,
  validateBooking,
  validateReview,
  handleValidationErrors
};