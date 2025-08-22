const { testSequelize, connectTestDB, closeTestDB, clearTestDB } = require('../database/testDb');

// Common test setup functions that can be imported by individual test files
module.exports = {
  setupTestDatabase: async () => {
    await connectTestDB();
  },
  
  cleanupTestDatabase: async () => {
    await closeTestDB();
  },
  
  clearTestData: async () => {
    await clearTestDB();
  }
};

// Set timeout for database operations
jest.setTimeout(30000);