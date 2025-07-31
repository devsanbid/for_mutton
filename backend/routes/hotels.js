const express = require('express');
const router = express.Router();
const {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelerHotels,
  getHotelerProfile,
  updateHotelerProfile
} = require('../controllers/hotelController');
const {
  createRoom,
  getRoomsByHotel,
  getHotelerRooms,
  updateRoom,
  deleteRoom,
  getRoomById
} = require('../controllers/roomController');
const { auth, authorize } = require('../middleware/auth');
const { uploadMultiple, uploadSingle } = require('../middleware/upload');
const {
  validateHotel,
  validateRoom,
  handleValidationErrors
} = require('../middleware/validation');

// Public routes
router.get('/', getAllHotels);
router.get('/:id', getHotelById);
router.get('/:hotelId/rooms', getRoomsByHotel);
router.get('/rooms/:id', getRoomById);

// Hotelier routes
router.get('/hotelier/my-hotels', auth, authorize(['hotelier']), getHotelerHotels);
router.get('/hotelier/profile', auth, authorize(['hotelier']), getHotelerProfile);
router.put('/hotelier/profile', auth, authorize(['hotelier']), uploadSingle('avatar'), updateHotelerProfile);
router.post('/', auth, authorize(['hotelier']), uploadMultiple('images', 10), validateHotel, handleValidationErrors, createHotel);
router.put('/:id', auth, authorize(['hotelier']), uploadMultiple('images', 10), validateHotel, handleValidationErrors, updateHotel);
router.delete('/:id', auth, authorize(['hotelier']), deleteHotel);

// Room routes for hoteliers
router.get('/hotelier/my-rooms', auth, authorize(['hotelier']), getHotelerRooms);
router.post('/:hotelId/rooms', auth, authorize(['hotelier']), uploadMultiple('images', 5), validateRoom, handleValidationErrors, createRoom);
router.put('/rooms/:id', auth, authorize(['hotelier']), uploadMultiple('images', 5), validateRoom, handleValidationErrors, updateRoom);
router.delete('/rooms/:id', auth, authorize(['hotelier']), deleteRoom);

module.exports = router;