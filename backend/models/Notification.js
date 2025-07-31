const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 200]
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM('booking', 'payment', 'approval', 'general'),
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  relatedId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  relatedType: {
    type: DataTypes.ENUM('booking', 'hotel', 'user'),
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Notification;