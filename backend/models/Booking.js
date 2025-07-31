const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookingId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  checkIn: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  checkOut: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  guests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  nights: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  roomType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'esewa'),
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'checked-in', 'completed', 'cancelled'),
    defaultValue: 'upcoming'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  hotelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Hotels',
      key: 'id'
    }
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Rooms',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Booking;