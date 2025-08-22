const { testSequelize, connectTestDB, closeTestDB, clearTestDB } = require('../database/testDb');
const { TestUser } = require('../models/testModels');
const bcrypt = require('bcryptjs');

describe('User Model CRUD Operations', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('User Model', () => {
    it('should create a user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '1234567890',
        role: 'user'
      };

      const user = await TestUser.create(userData);
      
      expect(user.id).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });

    it('should read a user', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        role: 'hotelier'
      };

      const createdUser = await TestUser.create(userData);
      const foundUser = await TestUser.findByPk(createdUser.id);
      
      expect(foundUser).toBeTruthy();
      expect(foundUser.name).toBe(userData.name);
      expect(foundUser.email).toBe(userData.email);
    });

    it('should update a user', async () => {
      const userData = {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123'
      };

      const user = await TestUser.create(userData);
      await user.update({ name: 'Bob Johnson' });
      
      expect(user.name).toBe('Bob Johnson');
    });

    it('should delete a user', async () => {
      const userData = {
        name: 'Alice Brown',
        email: 'alice@example.com',
        password: 'password123'
      };

      const user = await TestUser.create(userData);
      await user.destroy();
      
      const deletedUser = await TestUser.findByPk(user.id);
      expect(deletedUser).toBeNull();
    });
  });
});