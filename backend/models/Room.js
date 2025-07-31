const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  type: {
    type: DataTypes.ENUM('standard', 'deluxe', 'suite', 'presidential'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10
    }
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amenities: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  totalRooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  hotelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Hotels',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Room;