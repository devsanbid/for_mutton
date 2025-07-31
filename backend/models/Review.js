const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 1000]
    }
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
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Bookings',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Review;