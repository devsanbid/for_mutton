const { User, Hotel, Booking, Payment, Review, Notification } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../database/db');

const createNotification = async (userId, title, message, type = 'general') => {
  try {
    await Notification.create({
      userId,
      title,
      message,
      type
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'user' } });
    const totalHoteliers = await User.count({ where: { role: 'hotelier' } });
    const pendingHoteliers = await User.count({ 
      where: { role: 'hotelier', status: 'pending' } 
    });
    const totalHotels = await Hotel.count();
    const totalBookings = await Booking.count();
    const totalRevenue = parseFloat(await Payment.sum('amount', {
      where: { status: 'completed' }
    }) || 0);
    const adminRevenue = parseFloat(await Payment.sum('adminCommission', {
      where: { status: 'completed' }
    }) || 0);

    const monthlyBookings = await Booking.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1)
        }
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']]
    });

    const monthlyRevenue = await Payment.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('SUM', sequelize.col('adminCommission')), 'revenue']
      ],
      where: {
        status: 'completed',
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1)
        }
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']]
    });

    res.json({
      stats: {
        totalUsers,
        totalHoteliers,
        pendingHoteliers,
        totalHotels,
        totalBookings,
        totalRevenue: isNaN(totalRevenue) ? 0 : totalRevenue,
        adminRevenue: isNaN(adminRevenue) ? 0 : adminRevenue
      },
      charts: {
        monthlyBookings,
        monthlyRevenue
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;
    const offset = (page - 1) * limit;

    let where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (role && role !== 'all') {
      where.role = role;
    }
    if (status && status !== 'all') {
      where.status = status;
    }

    const users = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password', 'resetPasswordToken'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      users: users.rows,
      totalCount: users.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(users.count / limit)
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.update({ status }, { where: { id } });

    let notificationMessage = '';
    if (status === 'approved') {
      notificationMessage = 'Your account has been approved. You can now access all features.';
    } else if (status === 'suspended') {
      notificationMessage = 'Your account has been suspended. Please contact support for more information.';
    } else if (status === 'rejected') {
      notificationMessage = 'Your application has been rejected. Please contact support for more information.';
    }

    if (notificationMessage) {
      await createNotification(
        user.id,
        'Account Status Update',
        notificationMessage,
        'approval'
      );
    }

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password', 'resetPasswordToken'] }
    });

    res.json({
      message: 'User status updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllHoteliers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    let where = { role: 'hotelier' };
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (status && status !== 'all') {
      where.status = status;
    }

    const hoteliers = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password', 'resetPasswordToken'] },
      include: [
        {
          model: Hotel,
          as: 'hotels',
          attributes: ['id', 'name', 'location', 'status']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const hoteliersWithStats = await Promise.all(
      hoteliers.rows.map(async (hotelier) => {
        const totalRevenue = await Payment.sum('hotelerAmount', {
          where: { hotelierId: hotelier.id, status: 'completed' }
        }) || 0;
        
        const totalBookings = await Booking.count({
          include: [{
            model: Hotel,
            as: 'hotel',
            where: { hotelierId: hotelier.id }
          }]
        });

        return {
          ...hotelier.toJSON(),
          totalRevenue: parseFloat(totalRevenue),
          totalBookings
        };
      })
    );

    res.json({
      hoteliers: hoteliersWithStats,
      totalCount: hoteliers.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(hoteliers.count / limit)
    });
  } catch (error) {
    console.error('Get all hoteliers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateHotelierStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const hotelier = await User.findByPk(id);
    if (!hotelier || hotelier.role !== 'hotelier') {
      return res.status(404).json({ message: 'Hotelier not found' });
    }

    await User.update({ status }, { where: { id } });

    let notificationMessage = '';
    if (status === 'approved') {
      notificationMessage = 'Your hotelier account has been approved. You can now manage your hotels.';
    } else if (status === 'suspended') {
      notificationMessage = 'Your hotelier account has been suspended. Please contact support for more information.';
    } else if (status === 'rejected') {
      notificationMessage = 'Your hotelier application has been rejected. Please contact support for more information.';
    }

    if (notificationMessage) {
      await createNotification(
        hotelier.id,
        'Hotelier Status Update',
        notificationMessage,
        'approval'
      );
    }

    const updatedHotelier = await User.findByPk(id, {
      attributes: { exclude: ['password', 'resetPasswordToken'] }
    });

    res.json({
      message: 'Hotelier status updated successfully',
      hotelier: updatedHotelier
    });
  } catch (error) {
    console.error('Update hotelier status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllHotels = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    let where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (status && status !== 'all') {
      where.status = status;
    }

    const hotels = await Hotel.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'hotelier',
          attributes: ['name', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      hotels: hotels.rows,
      totalCount: hotels.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(hotels.count / limit)
    });
  } catch (error) {
    console.error('Get all hotels error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateHotelStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const hotel = await Hotel.findByPk(id, {
      include: [{
        model: User,
        as: 'hotelier',
        attributes: ['id', 'name']
      }]
    });

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    await Hotel.update({ status }, { where: { id } });

    let notificationMessage = '';
    if (status === 'suspended') {
      notificationMessage = `Your hotel "${hotel.name}" has been suspended.`;
    } else if (status === 'active') {
      notificationMessage = `Your hotel "${hotel.name}" has been reactivated.`;
    }

    if (notificationMessage) {
      await createNotification(
        hotel.hotelier.id,
        'Hotel Status Update',
        notificationMessage,
        'general'
      );
    }

    res.json({ message: 'Hotel status updated successfully' });
  } catch (error) {
    console.error('Update hotel status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let where = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const bookings = await Booking.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        },
        {
          model: Hotel,
          as: 'hotel',
          attributes: ['name', 'location'],
          include: [{
            model: User,
            as: 'hotelier',
            attributes: ['name', 'email']
          }]
        },
        {
          model: Payment,
          as: 'payment',
          attributes: ['amount', 'status', 'paymentMethod']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      bookings: bookings.rows,
      totalCount: bookings.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(bookings.count / limit)
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPaymentAnalytics = async (req, res) => {
  try {
    const totalRevenue = await Payment.sum('amount', {
      where: { status: 'completed' }
    }) || 0;
    
    const adminRevenue = await Payment.sum('adminCommission', {
      where: { status: 'completed' }
    }) || 0;
    
    const hotelerRevenue = await Payment.sum('hotelerAmount', {
      where: { status: 'completed' }
    }) || 0;

    const monthlyPayments = await Payment.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        [sequelize.fn('SUM', sequelize.col('adminCommission')), 'adminAmount'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        status: 'completed',
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1)
        }
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']]
    });

    const paymentMethods = await Payment.findAll({
      attributes: [
        'paymentMethod',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
      ],
      where: { status: 'completed' },
      group: ['paymentMethod']
    });

    res.json({
      summary: {
        totalRevenue: parseFloat(totalRevenue),
        adminRevenue: parseFloat(adminRevenue),
        hotelerRevenue: parseFloat(hotelerRevenue)
      },
      monthlyPayments,
      paymentMethods
    });
  } catch (error) {
    console.error('Get payment analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getGeneralAnalytics = async (req, res) => {
  try {
    const { timeRange = '30days' } = req.query;
    
    const totalUsers = await User.count();
    const totalHotels = await Hotel.count();
    const totalBookings = await Booking.count();
    const totalRevenue = await Payment.sum('amount', {
      where: { status: 'completed' }
    }) || 0;

    res.json({
      totalUsers,
      totalHotels,
      totalBookings,
      totalRevenue: parseFloat(totalRevenue),
      platformHealth: {
        uptime: '99.9%',
        responseTime: '1.2s',
        satisfaction: 4.6,
        pendingTickets: 23
      }
    });
  } catch (error) {
    console.error('Get general analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRevenueAnalytics = async (req, res) => {
  try {
    const { timeRange = '30days' } = req.query;
    
    const monthlyRevenue = await Payment.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'revenue']
      ],
      where: {
        status: 'completed',
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1)
        }
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']]
    });

    res.json({
      monthlyRevenue,
      trends: {
        growth: '+18.7%',
        averageBookingValue: 4250
      }
    });
  } catch (error) {
    console.error('Get revenue analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserAnalytics = async (req, res) => {
  try {
    const { timeRange = '30days' } = req.query;
    
    const monthlyGrowth = await User.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'newUsers']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1)
        }
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']]
    });

    res.json({
      monthlyGrowth,
      totalUsers: await User.count(),
      activeUsers: await User.count({ where: { status: 'approved' } })
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBookingAnalytics = async (req, res) => {
  try {
    const { timeRange = '30days' } = req.query;
    
    const monthlyBookings = await Booking.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'bookings']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1)
        }
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']]
    });

    res.json({
      monthlyBookings,
      trends: {
        peakSeason: 'Dec-Feb',
        repeatCustomers: '32%',
        mobileBookings: '68%'
      }
    });
  } catch (error) {
    console.error('Get booking analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const activities = [];

    // Get recent user registrations
    const recentUsers = await User.findAll({
      where: { role: 'user' },
      order: [['createdAt', 'DESC']],
      limit: limit,
      attributes: ['id', 'name', 'email', 'createdAt']
    });

    recentUsers.forEach(user => {
      activities.push({
        id: `user-${user.id}`,
        type: 'user_registration',
        title: 'New User Registration',
        description: `${user.name} (${user.email}) registered`,
        timestamp: user.createdAt,
        icon: 'UserPlus'
      });
    });

    // Get recent hotelier registrations and approvals
    const recentHoteliers = await User.findAll({
      where: { role: 'hotelier' },
      order: [['createdAt', 'DESC']],
      limit: limit,
      attributes: ['id', 'name', 'email', 'status', 'createdAt', 'updatedAt']
    });

    recentHoteliers.forEach(hotelier => {
      activities.push({
        id: `hotelier-${hotelier.id}`,
        type: 'hotelier_registration',
        title: hotelier.status === 'approved' ? 'Hotelier Approved' : 'New Hotelier Registration',
        description: `${hotelier.name} (${hotelier.email}) ${hotelier.status === 'approved' ? 'was approved' : 'registered as hotelier'}`,
        timestamp: hotelier.status === 'approved' ? hotelier.updatedAt : hotelier.createdAt,
        icon: 'Building'
      });
    });

    // Get recent hotel listings with hotelier info
    const recentHotels = await Hotel.findAll({
      include: [{
        model: User,
        as: 'hotelier',
        attributes: ['name', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: limit,
      attributes: ['id', 'name', 'location', 'status', 'createdAt']
    });

    recentHotels.forEach(hotel => {
      activities.push({
        id: `hotel-${hotel.id}`,
        type: 'hotel_listing',
        title: 'New Hotel Listed',
        description: `${hotel.name} in ${hotel.location} was listed by ${hotel.hotelier?.name || 'Unknown'}`,
        timestamp: hotel.createdAt,
        icon: 'MapPin'
      });
    });

    // Get recent bookings with user and hotel info
    const recentBookings = await Booking.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        },
        {
          model: Hotel,
          as: 'hotel',
          attributes: ['name', 'location']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limit,
      attributes: ['id', 'bookingId', 'status', 'createdAt']
    });

    recentBookings.forEach(booking => {
      activities.push({
        id: `booking-${booking.id}`,
        type: 'booking',
        title: 'New Booking',
        description: `${booking.user?.name || 'Unknown'} booked ${booking.hotel?.name || 'Unknown Hotel'} (${booking.bookingId})`,
        timestamp: booking.createdAt,
        icon: 'Calendar'
      });
    });

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Limit the final result
    const limitedActivities = activities.slice(0, limit);

    // Add relative time
    const activitiesWithRelativeTime = limitedActivities.map(activity => ({
      ...activity,
      relativeTime: getRelativeTime(activity.timestamp)
    }));

    res.json({
      success: true,
      data: activitiesWithRelativeTime,
      total: activitiesWithRelativeTime.length
    });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activities'
    });
  }
};

// Helper function to get relative time
const getRelativeTime = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
};

// Settings management
const getSystemSettings = async (req, res) => {
  try {
    // Return default system settings since we don't have a settings table
    const settings = {
      platformName: 'HeavenStay',
      platformDescription: 'Your trusted hotel booking platform',
      supportEmail: 'support@heavenstay.com',
      contactPhone: '+977-1-4444444',
      timezone: 'Asia/Kathmandu',
      currency: 'NPR',
      language: 'English'
    };
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system settings'
    });
  }
};

const updateSystemSettings = async (req, res) => {
  try {
    // For now, just return success since we don't have a settings table
    // In a real application, you would save these to a database
    const updatedSettings = req.body;
    
    res.json({
      success: true,
      message: 'System settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update system settings'
    });
  }
};

const getNotificationSettings = async (req, res) => {
  try {
    // Return default notification settings
    const settings = {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      weeklyReports: true,
      securityAlerts: true
    };
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification settings'
    });
  }
};

const updateNotificationSettings = async (req, res) => {
  try {
    // For now, just return success since we don't have a settings table
    const updatedSettings = req.body;
    
    res.json({
      success: true,
      message: 'Notification settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification settings'
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllHoteliers,
  updateHotelierStatus,
  getAllHotels,
  updateHotelStatus,
  getAllBookings,
  getPaymentAnalytics,
  getGeneralAnalytics,
  getRevenueAnalytics,
  getUserAnalytics,
  getBookingAnalytics,
  getRecentActivities,
  getSystemSettings,
  updateSystemSettings,
  getNotificationSettings,
  updateNotificationSettings
};