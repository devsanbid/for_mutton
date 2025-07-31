const { Payment, Booking, User, Hotel, Room } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../database/db');

const getHotelerPayments = async (req, res) => {
  try {
    const hotelierId = req.user.id;
    const { timeRange, days, status, method } = req.query;
    
    let dateFilter = {};
    const daysParam = days || timeRange;
    if (daysParam && daysParam !== 'all') {
      const numDays = parseInt(daysParam.toString().replace('days', ''));
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - numDays);
      dateFilter.createdAt = {
        [Op.gte]: startDate
      };
    }

    let whereClause = {
      hotelierId: hotelierId,
      ...dateFilter
    };

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (method && method !== 'all') {
      whereClause.paymentMethod = method;
    }

    const payments = await Payment.findAll({
      where: whereClause,
      include: [
        {
          model: Booking,
          as: 'booking',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'phone']
            },
            {
              model: Hotel,
              as: 'hotel',
              attributes: ['id', 'name']
            },
            {
              model: Room,
              as: 'room',
              attributes: ['id', 'name', 'type']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      date: payment.createdAt.toISOString().split('T')[0],
      type: payment.amount < 0 ? 'Refund' : 'Booking Payment',
      guest: payment.booking.user.name,
      guestPhone: payment.booking.user.phone,
      amount: parseFloat(payment.hotelerAmount),
      status: payment.status,
      method: payment.paymentMethod === 'cash' ? 'Pay at Hotel' : 'eSewa',
      paymentId: payment.transactionId || `${payment.paymentMethod.toUpperCase()}${payment.id.toString().padStart(6, '0')}`,
      roomType: payment.booking.room.name,
      nights: payment.booking.nights,
      hotelName: payment.booking.hotel.name
    }));

    const totalRevenue = payments
      .filter(p => p.status === 'completed' && p.hotelerAmount > 0)
      .reduce((sum, p) => sum + parseFloat(p.hotelerAmount), 0);

    const pendingAmount = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + parseFloat(p.hotelerAmount), 0);

    const esewaRevenue = payments
      .filter(p => p.paymentMethod === 'esewa' && p.status === 'completed' && p.hotelerAmount > 0)
      .reduce((sum, p) => sum + parseFloat(p.hotelerAmount), 0);

    const cashRevenue = totalRevenue - esewaRevenue;

    res.json({
      success: true,
      data: {
        transactions: formattedPayments,
        summary: {
          totalRevenue,
          pendingAmount,
          esewaRevenue,
          cashRevenue
        }
      }
    });
  } catch (error) {
    console.error('Get hotelier payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
};

const getHotelerPaymentMethods = async (req, res) => {
  try {
    const hotelierId = req.user.id;

    const hotelier = await User.findByPk(hotelierId, {
      attributes: ['id', 'name', 'esewaId', 'businessName']
    });

    if (!hotelier) {
      return res.status(404).json({
        success: false,
        message: 'Hotelier not found'
      });
    }

    const paymentMethods = [
      {
        id: 1,
        type: 'Pay at Hotel',
        name: 'Cash Payment',
        details: 'Accept cash payments at check-in',
        status: 'Active',
        primary: true
      }
    ];

    if (hotelier.esewaId) {
      paymentMethods.push({
        id: 2,
        type: 'eSewa',
        name: 'eSewa Digital Wallet',
        details: `ID: ${hotelier.esewaId}`,
        status: 'Active',
        primary: false,
        esewaId: hotelier.esewaId,
        accountName: hotelier.businessName || hotelier.name
      });
    }

    res.json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment methods',
      error: error.message
    });
  }
};

const addPaymentMethod = async (req, res) => {
  try {
    const hotelierId = req.user.id;
    const { type, esewaId, accountName } = req.body;

    if (type !== 'eSewa') {
      return res.status(400).json({
        success: false,
        message: 'Only eSewa payment method can be added'
      });
    }

    if (!esewaId || !accountName) {
      return res.status(400).json({
        success: false,
        message: 'eSewa ID and account name are required'
      });
    }

    await User.update(
      {
        esewaId: esewaId,
        businessName: accountName
      },
      {
        where: { id: hotelierId }
      }
    );

    res.json({
      success: true,
      message: 'Payment method added successfully'
    });
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add payment method',
      error: error.message
    });
  }
};

const getPaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelierId = req.user.id;

    const payment = await Payment.findOne({
      where: {
        id: id,
        hotelierId: hotelierId
      },
      include: [
        {
          model: Booking,
          as: 'booking',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'phone']
            },
            {
              model: Hotel,
              as: 'hotel',
              attributes: ['id', 'name']
            },
            {
              model: Room,
              as: 'room',
              attributes: ['id', 'name', 'type']
            }
          ]
        }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const paymentDetails = {
      id: payment.id,
      date: payment.createdAt.toISOString().split('T')[0],
      type: payment.amount < 0 ? 'Refund' : 'Booking Payment',
      guest: payment.booking.user.name,
      guestPhone: payment.booking.user.phone,
      guestEmail: payment.booking.user.email,
      amount: parseFloat(payment.hotelerAmount),
      totalAmount: parseFloat(payment.amount),
      adminCommission: parseFloat(payment.adminCommission),
      status: payment.status,
      method: payment.paymentMethod === 'cash' ? 'Pay at Hotel' : 'eSewa',
      paymentId: payment.transactionId || `${payment.paymentMethod.toUpperCase()}${payment.id.toString().padStart(6, '0')}`,
      roomType: payment.booking.room.name,
      nights: payment.booking.nights,
      hotelName: payment.booking.hotel.name,
      checkIn: payment.booking.checkIn,
      checkOut: payment.booking.checkOut,
      guests: payment.booking.guests
    };

    res.json({
      success: true,
      data: paymentDetails
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
};

module.exports = {
  getHotelerPayments,
  getHotelerPaymentMethods,
  addPaymentMethod,
  getPaymentDetails
};