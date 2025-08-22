const { testSequelize, connectTestDB, closeTestDB, clearTestDB } = require('../database/testDb');
const { TestUser, TestHotel, TestRoom, TestBooking, TestReview, TestNotification, TestPayment } = require('../models/testModels');

// Export test models for use in test files
global.User = TestUser;
global.Hotel = TestHotel;
global.Room = TestRoom;
global.Booking = TestBooking;
global.Review = TestReview;
global.Notification = TestNotification;
global.Payment = TestPayment;

// Setup test database
beforeAll(async () => {
  try {
    await connectTestDB();
  } catch (error) {
    console.error('Test database setup failed:', error);
    throw error;
  }
});

// Clean up after each test
afterEach(async () => {
  try {
    await clearTestDB();
  } catch (error) {
    console.error('Test cleanup failed:', error);
  }
});

// Close database connection after all tests
afterAll(async () => {
  try {
    await closeTestDB();
  } catch (error) {
    console.error('Error closing test database:', error);
  }
});

// Increase timeout for database operations
jest.setTimeout(30000);