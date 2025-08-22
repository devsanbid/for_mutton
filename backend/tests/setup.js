const { sequelize } = require('../database/db');
const { User, Hotel, Room, Booking, Review, Notification, Payment } = require('../models');

// Setup test database
beforeAll(async () => {
  try {
    // Connect to test database
    await sequelize.authenticate();
    console.log('Test database connected');
    
    // Sync database (create tables)
    await sequelize.sync({ force: true });
    console.log('Test database synchronized');
  } catch (error) {
    console.error('Test database setup failed:', error);
    throw error;
  }
});

// Clean up after each test
afterEach(async () => {
  try {
    // Clear all tables
    await Payment.destroy({ where: {}, force: true });
    await Review.destroy({ where: {}, force: true });
    await Notification.destroy({ where: {}, force: true });
    await Booking.destroy({ where: {}, force: true });
    await Room.destroy({ where: {}, force: true });
    await Hotel.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
  } catch (error) {
    console.error('Test cleanup failed:', error);
  }
});

// Close database connection after all tests
afterAll(async () => {
  try {
    await sequelize.close();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Error closing test database:', error);
  }
});

// Increase timeout for database operations
jest.setTimeout(30000);