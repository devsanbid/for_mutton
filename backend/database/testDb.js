const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create test database connection
const testSequelize = new Sequelize({
  database: 'hotel_test',
  username: 'postgres',
  host: 'localhost',
  password: 'root',
  port: 5432,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectTestDB = async () => {
  try {
    // First try to connect to the test database
    await testSequelize.authenticate();
    console.log('✅ Test database connected successfully');
  } catch (error) {
    // If test database doesn't exist, create it
    if (error.original && error.original.code === '3D000') {
      console.log('📝 Test database does not exist, creating it...');
      
      // Create a temporary connection to postgres database to create test database
      const { Sequelize } = require('sequelize');
      const tempSequelize = new Sequelize({
        database: 'postgres',
        username: 'postgres',
        host: 'localhost',
        password: 'root',
        port: 5432,
        dialect: 'postgres',
        logging: false
      });
      
      try {
        await tempSequelize.authenticate();
        await tempSequelize.query('CREATE DATABASE hotel_test;');
        await tempSequelize.close();
        console.log('✅ Test database created successfully');
        
        // Now connect to the test database
        await testSequelize.authenticate();
        console.log('✅ Test database connected successfully');
      } catch (createError) {
        await tempSequelize.close();
        console.error('❌ Failed to create test database:', createError.message);
        throw createError;
      }
    } else {
      console.error('❌ Test database connection failed:', error.message);
      throw error;
    }
  }
  
  try {
    // Force sync to recreate tables for clean testing
    await testSequelize.sync({ force: true });
    console.log('✅ Test database synchronized');
  } catch (syncError) {
    console.error('❌ Test database synchronization failed:', syncError.message);
    throw syncError;
  }
};

const closeTestDB = async () => {
  try {
    await testSequelize.close();
    console.log('✅ Test database connection closed');
  } catch (error) {
    console.error('❌ Error closing test database:', error.message);
    throw error;
  }
};

const clearTestDB = async () => {
  try {
    await testSequelize.sync({ force: true });
    console.log('✅ Test database cleared');
  } catch (error) {
    console.error('❌ Error clearing test database:', error.message);
    throw error;
  }
};

module.exports = {
  testSequelize,
  connectTestDB,
  closeTestDB,
  clearTestDB
};