const User = require('./User');
const Hotel = require('./Hotel');
const Room = require('./Room');
const Booking = require('./Booking');
const Review = require('./Review');
const Notification = require('./Notification');
const Payment = require('./Payment');

User.hasMany(Hotel, { foreignKey: 'hotelierId', as: 'hotels' });
Hotel.belongsTo(User, { foreignKey: 'hotelierId', as: 'hotelier' });

Hotel.hasMany(Room, { foreignKey: 'hotelId', as: 'rooms' });
Room.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });

User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Hotel.hasMany(Booking, { foreignKey: 'hotelId', as: 'bookings' });
Booking.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });

Room.hasMany(Booking, { foreignKey: 'roomId', as: 'bookings' });
Booking.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Hotel.hasMany(Review, { foreignKey: 'hotelId', as: 'reviews' });
Review.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });

Booking.hasOne(Review, { foreignKey: 'bookingId', as: 'review' });
Review.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Booking.hasOne(Payment, { foreignKey: 'bookingId', as: 'payment' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

User.hasMany(Payment, { foreignKey: 'userId', as: 'userPayments' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Payment, { foreignKey: 'hotelierId', as: 'hotelerPayments' });
Payment.belongsTo(User, { foreignKey: 'hotelierId', as: 'hotelier' });

module.exports = {
  User,
  Hotel,
  Room,
  Booking,
  Review,
  Notification,
  Payment
};