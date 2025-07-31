const { sequelize } = require('../database/db');
const { User, Hotel, Room, Booking, Review, Payment } = require('../models');
const { Op } = require('sequelize');

const getHotelerAnalytics = async (req, res) => {
  try {
    const hotelerId = req.user.id;
    const { timeRange = '30days' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (timeRange) {
      case '7days':
        dateFilter = { createdAt: { [Op.gte]: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30days':
        dateFilter = { createdAt: { [Op.gte]: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '90days':
        dateFilter = { createdAt: { [Op.gte]: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } };
        break;
      case '1year':
        dateFilter = { createdAt: { [Op.gte]: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = { createdAt: { [Op.gte]: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
    }

    const bookings = await Booking.findAll({
      include: [{
        model: Room,
        as: 'room',
        include: [{
          model: Hotel,
          as: 'hotel',
          where: { hotelierId: hotelerId }
        }]
      }],
      where: dateFilter
    });

    console.log('🔍 [getHotelerAnalytics] HotelierId:', hotelerId);
    console.log('🔍 [getHotelerAnalytics] Date filter:', dateFilter);
    console.log('🔍 [getHotelerAnalytics] All bookings found:', bookings.length);
    console.log('🔍 [getHotelerAnalytics] Booking statuses:', bookings.map(b => ({ id: b.id, status: b.status, total: b.total })));

    const completedBookings = bookings.filter(booking => booking.status === 'completed');
    console.log('🔍 [getHotelerAnalytics] Completed bookings:', completedBookings.length);
    console.log('🔍 [getHotelerAnalytics] Completed booking details:', completedBookings.map(b => ({ id: b.id, total: b.total, status: b.status })));

    const totalBookings = bookings.length;
    const completedBookingsCount = completedBookings.length;
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + parseFloat(booking.total || 0), 0);
    console.log('🔍 [getHotelerAnalytics] Total revenue calculated:', totalRevenue);
    
    const averageBookingValue = completedBookingsCount > 0 ? totalRevenue / completedBookingsCount : 0;
    const uniqueGuests = new Set(bookings.map(booking => booking.userId)).size;

    const monthlyData = await Booking.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('Booking.createdAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'bookings'],
        [sequelize.fn('COALESCE', sequelize.fn('SUM', 
          sequelize.literal("CASE WHEN \"Booking\".\"status\" = 'completed' THEN \"Booking\".\"total\" ELSE 0 END")
        ), 0), 'revenue']
      ],
      include: [{
        model: Room,
        as: 'room',
        attributes: [],
        include: [{
          model: Hotel,
          as: 'hotel',
          attributes: [],
          where: { hotelierId: hotelerId }
        }]
      }],
      where: dateFilter,
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('Booking.createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('Booking.createdAt')), 'ASC']]
    });

    const hotelPerformance = await Hotel.findAll({
      where: { hotelierId: hotelerId },
      include: [{
        model: Room,
        as: 'rooms',
        include: [{
          model: Booking,
          as: 'bookings',
          where: dateFilter,
          required: false
        }]
      }]
    });

    const hotelStats = hotelPerformance.map(hotel => {
      const hotelBookings = hotel.rooms.flatMap(room => room.bookings || []);
      const revenue = hotelBookings.reduce((sum, booking) => sum + parseFloat(booking.total || 0), 0);
      const confirmedBookings = hotelBookings.filter(booking => booking.status === 'confirmed').length;
      const occupancyRate = hotelBookings.length > 0 ? (confirmedBookings / hotelBookings.length) * 100 : 0;
      
      return {
        hotelName: hotel.name,
        bookings: hotelBookings.length,
        revenue: revenue,
        occupancyRate: occupancyRate
      };
    }).sort((a, b) => b.revenue - a.revenue);

    const analytics = {
      total_bookings: totalBookings,
      total_revenue: totalRevenue,
      average_booking_value: averageBookingValue,
      unique_guests: uniqueGuests
    };

    res.json({
      success: true,
      data: {
        summary: {
          totalBookings: analytics.total_bookings,
          totalRevenue: analytics.total_revenue,
          averageBookingValue: analytics.average_booking_value,
          uniqueGuests: analytics.unique_guests
        },
        monthlyData: monthlyData.map(row => ({
          month: row.dataValues.month,
          bookings: parseInt(row.dataValues.bookings) || 0,
          revenue: parseFloat(row.dataValues.revenue) || 0
        })),
        hotelPerformance: hotelStats,
        timeRange
      }
    });
  } catch (error) {
    console.error('Error fetching hoteler analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const hotelerId = req.user.id;
    
    const totalHotels = await Hotel.count({
      where: { hotelierId: hotelerId }
    });

    const totalRooms = await Room.count({
      include: [{
        model: Hotel,
        as: 'hotel',
        where: { hotelierId: hotelerId }
      }]
    });

    const now = new Date();
    const activeBookings = await Booking.count({
      where: {
        status: 'confirmed',
        checkIn: { [Op.lte]: now },
        checkOut: { [Op.gte]: now }
      },
      include: [{
        model: Room,
        as: 'room',
        include: [{
          model: Hotel,
          as: 'hotel',
          where: { hotelierId: hotelerId }
        }]
      }]
    });

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentBookings = await Booking.count({
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo }
      },
      include: [{
        model: Room,
        as: 'room',
        include: [{
          model: Hotel,
          as: 'hotel',
          where: { hotelierId: hotelerId }
        }]
      }]
    });

    const completedBookings = await Booking.findAll({
      where: {
        status: 'completed'
      },
      include: [{
        model: Room,
        as: 'room',
        include: [{
          model: Hotel,
          as: 'hotel',
          where: { hotelierId: hotelerId }
        }]
      }]
    });

    console.log('🔍 [getDashboardStats] HotelierId:', hotelerId);
    console.log('🔍 [getDashboardStats] Completed bookings found:', completedBookings.length);
    console.log('🔍 [getDashboardStats] Completed booking details:', completedBookings.map(b => ({ id: b.id, total: b.total, status: b.status })));

    const totalRevenue = completedBookings.reduce((sum, booking) => sum + parseFloat(booking.total || 0), 0);
    console.log('🔍 [getDashboardStats] Total revenue calculated:', totalRevenue);

    res.json({
      success: true,
      data: {
        totalHotels: totalHotels,
        totalRooms: totalRooms,
        activeBookings: activeBookings,
        recentBookings: recentBookings,
        totalRevenue: totalRevenue,
        completedBookings: completedBookings.length
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

module.exports = {
  getHotelerAnalytics,
  getDashboardStats
};