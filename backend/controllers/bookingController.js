const { Booking, Hotel, Room, User, Payment, Notification } = require('../models');
const { Op } = require('sequelize');
const crypto = require('crypto');

const createNotification = async (userId, title, message, type = 'booking', relatedId = null, relatedType = null) => {
  try {
    await Notification.create({
      userId,
      title,
      message,
      type,
      relatedId,
      relatedType
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

const createBooking = async (req, res) => {
  try {
    const {
      hotelId,
      roomId,
      checkIn,
      checkOut,
      guests,
      roomType,
      specialRequests,
      paymentMethod
    } = req.body;
    const userId = req.user.id;

    const hotel = await Hotel.findByPk(hotelId);
    const room = await Room.findByPk(roomId);

    if (!hotel || !room) {
      return res.status(404).json({ message: 'Hotel or room not found' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.status(400).json({ message: 'Invalid date range' });
    }

    const existingBookings = await Booking.count({
      where: {
        roomId,
        status: { [Op.in]: ['upcoming', 'checked-in'] },
        [Op.or]: [
          {
            checkIn: {
              [Op.between]: [checkIn, checkOut]
            }
          },
          {
            checkOut: {
              [Op.between]: [checkIn, checkOut]
            }
          },
          {
            [Op.and]: [
              { checkIn: { [Op.lte]: checkIn } },
              { checkOut: { [Op.gte]: checkOut } }
            ]
          }
        ]
      }
    });

    if (existingBookings >= room.totalRooms) {
      return res.status(400).json({ message: 'Room not available for selected dates' });
    }

    const subtotal = parseFloat(room.price) * nights;
    const tax = subtotal * 0.13;
    const total = subtotal + tax;
    const bookingId = 'HB' + Date.now() + crypto.randomBytes(3).toString('hex').toUpperCase();

    const booking = await Booking.create({
      bookingId,
      checkIn,
      checkOut,
      guests,
      nights,
      roomType,
      specialRequests,
      subtotal,
      tax,
      total,
      paymentMethod,
      paymentStatus: 'paid',
      userId,
      hotelId,
      roomId
    });

    const adminCommission = total * 0.10;
    const hotelerAmount = total - adminCommission;

    await Payment.create({
      amount: total,
      adminCommission,
      hotelerAmount,
      paymentMethod,
      status: 'completed',
      transactionId: bookingId,
      bookingId: booking.id,
      userId,
      hotelierId: hotel.hotelierId
    });

    await createNotification(
      hotel.hotelierId,
      'New Booking Received',
      `You have received a new booking for ${hotel.name} from ${req.user.name}.`,
      'booking',
      booking.id,
      'booking'
    );

    const bookingWithDetails = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Hotel,
          as: 'hotel',
          attributes: ['id', 'name', 'location', 'images']
        },
        {
          model: Room,
          as: 'room',
          attributes: ['name', 'type', 'images']
        }
      ]
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: bookingWithDetails
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    console.log('🔍 getUserBookings called for userId:', userId);
    console.log('📊 Query status filter:', status);

    let where = { userId };
    if (status && status !== 'all') {
      where.status = status;
    }

    console.log('🔎 Booking query where clause:', where);

    const bookings = await Booking.findAll({
      where,
      include: [
        {
          model: Hotel,
          as: 'hotel',
          attributes: ['id', 'name', 'location', 'images', 'phone', 'email']
        },
        {
          model: Room,
          as: 'room',
          attributes: ['name', 'type', 'images']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log('📋 Found bookings count:', bookings.length);
    console.log('📦 Bookings data:', JSON.stringify(bookings, null, 2));

    res.json({ bookings });
  } catch (error) {
    console.error('❌ Get user bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getHotelerBookings = async (req, res) => {
  try {
    const hotelierId = req.user.id;
    const { status } = req.query;

    console.log('🔍 [getHotelerBookings] HotelierId:', hotelierId);
    console.log('🔍 [getHotelerBookings] Status filter:', status);

    let bookingWhere = {};
    if (status && status !== 'all') {
      bookingWhere.status = status;
    }

    console.log('🔍 [getHotelerBookings] Booking where clause:', bookingWhere);

    const bookings = await Booking.findAll({
      where: bookingWhere,
      include: [
        {
          model: Hotel,
          as: 'hotel',
          where: { hotelierId },
          attributes: ['id', 'name', 'location']
        },
        {
          model: Room,
          as: 'room',
          attributes: ['name', 'type']
        },
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email', 'phone', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log('🔍 [getHotelerBookings] Found bookings:', bookings.length);
    console.log('🔍 [getHotelerBookings] Booking details:', bookings.map(b => ({
      id: b.id,
      status: b.status,
      total: b.total,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      hotelName: b.hotel?.name
    })));

    res.json({ bookings });
  } catch (error) {
    console.error('Get hoteler bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const hotelierId = req.user.id;

    const booking = await Booking.findOne({
      where: { id },
      include: [
        {
          model: Hotel,
          as: 'hotel',
          where: { hotelierId }
        },
        {
          model: User,
          as: 'user',
          attributes: ['name']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }

    await Booking.update({ status }, { where: { id } });

    if (status === 'completed') {
      await createNotification(
        booking.userId,
        'Booking Completed',
        `Your booking at ${booking.hotel.name} has been marked as completed. You can now leave a review.`,
        'booking',
        booking.id,
        'booking'
      );
    }

    const updatedBooking = await Booking.findByPk(id, {
      include: [
        {
          model: Hotel,
          as: 'hotel',
          attributes: ['name', 'location']
        },
        {
          model: Room,
          as: 'room',
          attributes: ['name', 'type']
        },
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email', 'phone']
        }
      ]
    });

    res.json({
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findOne({
      where: { id, userId },
      include: [
        {
          model: Hotel,
          as: 'hotel',
          attributes: ['name', 'hotelierId']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    const checkInDate = new Date(booking.checkIn);
    const now = new Date();
    const timeDiff = checkInDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff < 24) {
      return res.status(400).json({ 
        message: 'Cannot cancel booking less than 24 hours before check-in' 
      });
    }

    await Booking.update({ status: 'cancelled' }, { where: { id } });

    await Payment.update(
      { status: 'refunded' },
      { where: { bookingId: booking.id } }
    );

    await createNotification(
      booking.hotel.hotelierId,
      'Booking Cancelled',
      `Booking for ${booking.hotel.name} has been cancelled by the guest.`,
      'booking',
      booking.id,
      'booking'
    );

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findOne({
      where: { id },
      include: [
        {
          model: Hotel,
          as: 'hotel',
          attributes: ['name', 'location', 'images', 'phone', 'email', 'hotelierId']
        },
        {
          model: Room,
          as: 'room',
          attributes: ['name', 'type', 'images', 'amenities']
        },
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email', 'phone']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId !== userId && booking.hotel.hotelierId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getHotelerBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingById
};