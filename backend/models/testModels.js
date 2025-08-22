const { DataTypes } = require('sequelize');
const { testSequelize } = require('../database/testDb');
const bcrypt = require('bcryptjs');

// Test User Model
const TestUser = testSequelize.define('User', {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [10, 15]
    }
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('user', 'hotelier', 'admin'),
    defaultValue: 'user',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'suspended', 'rejected'),
    defaultValue: 'approved',
    allowNull: false
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  esewaId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  businessName: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

TestUser.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Test Hotel Model
const TestHotel = testSequelize.define('Hotel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  amenities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0.0
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending'),
    defaultValue: 'active'
  },
  checkInTime: {
    type: DataTypes.TIME,
    defaultValue: '14:00:00'
  },
  checkOutTime: {
    type: DataTypes.TIME,
    defaultValue: '12:00:00'
  }
}, {
  timestamps: true
});

// Test Room Model
const TestRoom = testSequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roomNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amenities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

// Test Booking Model
const TestBooking = testSequelize.define('Booking', {
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
      min: 1,
      max: 10
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
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
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

// Test Notification Model
const TestNotification = testSequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('info', 'success', 'warning', 'error'),
    defaultValue: 'info'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

// Test Review Model
const TestReview = testSequelize.define('Review', {
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
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

// Test Payment Model
const TestPayment = testSequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  method: {
    type: DataTypes.ENUM('esewa', 'khalti', 'card', 'cash'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

// Define associations
TestUser.hasMany(TestHotel, { foreignKey: 'ownerId', as: 'hotels' });
TestHotel.belongsTo(TestUser, { foreignKey: 'ownerId', as: 'owner' });

TestHotel.hasMany(TestRoom, { foreignKey: 'hotelId', as: 'rooms' });
TestRoom.belongsTo(TestHotel, { foreignKey: 'hotelId', as: 'hotel' });

TestUser.hasMany(TestBooking, { foreignKey: 'userId', as: 'bookings' });
TestBooking.belongsTo(TestUser, { foreignKey: 'userId', as: 'user' });

TestHotel.hasMany(TestBooking, { foreignKey: 'hotelId', as: 'bookings' });
TestBooking.belongsTo(TestHotel, { foreignKey: 'hotelId', as: 'hotel' });

TestRoom.hasMany(TestBooking, { foreignKey: 'roomId', as: 'bookings' });
TestBooking.belongsTo(TestRoom, { foreignKey: 'roomId', as: 'room' });

TestUser.hasMany(TestNotification, { foreignKey: 'userId', as: 'notifications' });
TestNotification.belongsTo(TestUser, { foreignKey: 'userId', as: 'user' });

TestUser.hasMany(TestReview, { foreignKey: 'userId', as: 'reviews' });
TestReview.belongsTo(TestUser, { foreignKey: 'userId', as: 'user' });

TestHotel.hasMany(TestReview, { foreignKey: 'hotelId', as: 'reviews' });
TestReview.belongsTo(TestHotel, { foreignKey: 'hotelId', as: 'hotel' });

TestBooking.hasOne(TestPayment, { foreignKey: 'bookingId', as: 'payment' });
TestPayment.belongsTo(TestBooking, { foreignKey: 'bookingId', as: 'booking' });

module.exports = {
  TestUser,
  TestHotel,
  TestRoom,
  TestBooking,
  TestNotification,
  TestReview,
  TestPayment
};