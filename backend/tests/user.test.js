const { User } = require('../models');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a user with hashed password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        role: 'user'
      };

      const user = await User.create(userData);

      expect(user.id).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Password should be hashed
      expect(user.role).toBe('user');
      expect(user.status).toBe('approved'); // Default status for regular users
    });

    it('should create a hotelier with pending status', async () => {
      const hotelierData = {
        name: 'Hotel Owner',
        email: 'hotelier@example.com',
        password: 'password123',
        phone: '1234567890',
        role: 'hotelier'
      };

      const user = await User.create(hotelierData);

      expect(user.role).toBe('hotelier');
      expect(user.status).toBe('approved'); // Default status, but can be overridden
    });

    it('should validate required fields', async () => {
      const invalidData = {
        email: 'test@example.com'
        // Missing required fields: name, password
      };

      await expect(User.create(invalidData)).rejects.toThrow();
    });

    it('should validate email uniqueness', async () => {
      const userData = {
        name: 'Test User',
        email: 'unique@example.com',
        password: 'password123',
        phone: '1234567890'
      };

      // Create first user
      await User.create(userData);

      // Try to create second user with same email
      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should validate name length', async () => {
      const invalidData = {
        name: 'A', // Too short (minimum 2 characters)
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890'
      };

      await expect(User.create(invalidData)).rejects.toThrow();
    });

    it('should validate password length', async () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123', // Too short (minimum 6 characters)
        phone: '1234567890'
      };

      await expect(User.create(invalidData)).rejects.toThrow();
    });

    it('should validate phone length', async () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '123' // Too short (minimum 10 characters)
      };

      await expect(User.create(invalidData)).rejects.toThrow();
    });

    it('should set default values correctly', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890'
      };

      const user = await User.create(userData);

      expect(user.role).toBe('user'); // Default role
      expect(user.status).toBe('approved'); // Default status
      expect(user.isEmailVerified).toBe(false); // Default email verification
      expect(user.avatar).toBeNull(); // Default avatar
      expect(user.resetPasswordToken).toBeNull(); // Default reset token
      expect(user.resetPasswordExpires).toBeNull(); // Default reset expires
    });
  });

  describe('Password Methods', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890'
      });
    });

    it('should compare password correctly', async () => {
      const isValid = await testUser.comparePassword('password123');
      expect(isValid).toBe(true);

      const isInvalid = await testUser.comparePassword('wrongpassword');
      expect(isInvalid).toBe(false);
    });

    it('should hash password on update', async () => {
      const originalPassword = testUser.password;
      
      await testUser.update({ password: 'newpassword123' });
      
      expect(testUser.password).not.toBe('newpassword123'); // Should be hashed
      expect(testUser.password).not.toBe(originalPassword); // Should be different from original
      
      const isValid = await testUser.comparePassword('newpassword123');
      expect(isValid).toBe(true);
    });

    it('should not rehash password if not changed', async () => {
      const originalPassword = testUser.password;
      
      await testUser.update({ name: 'Updated Name' });
      
      expect(testUser.password).toBe(originalPassword); // Should remain the same
    });
  });

  describe('User Roles and Status', () => {
    it('should accept valid roles', async () => {
      const roles = ['user', 'hotelier', 'admin'];
      
      for (const role of roles) {
        const user = await User.create({
          name: `Test ${role}`,
          email: `${role}@example.com`,
          password: 'password123',
          phone: '1234567890',
          role
        });
        
        expect(user.role).toBe(role);
      }
    });

    it('should accept valid statuses', async () => {
      const statuses = ['pending', 'approved', 'suspended', 'rejected'];
      
      for (const status of statuses) {
        const user = await User.create({
          name: `Test User ${status}`,
          email: `${status}@example.com`,
          password: 'password123',
          phone: '1234567890',
          status
        });
        
        expect(user.status).toBe(status);
      }
    });

    it('should reject invalid roles', async () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        role: 'invalid_role'
      };

      await expect(User.create(invalidData)).rejects.toThrow();
    });

    it('should reject invalid statuses', async () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        status: 'invalid_status'
      };

      await expect(User.create(invalidData)).rejects.toThrow();
    });
  });

  describe('User Fields', () => {
    it('should handle optional fields', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        avatar: 'avatar.jpg',
        esewaId: 'esewa123',
        businessName: 'Test Business'
      };

      const user = await User.create(userData);

      expect(user.avatar).toBe(userData.avatar);
      expect(user.esewaId).toBe(userData.esewaId);
      expect(user.businessName).toBe(userData.businessName);
    });

    it('should handle reset password fields', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890'
      });

      const resetToken = 'reset123';
      const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

      await user.update({
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      });

      expect(user.resetPasswordToken).toBe(resetToken);
      expect(user.resetPasswordExpires).toEqual(resetExpires);
    });
  });

  describe('User Timestamps', () => {
    it('should have createdAt and updatedAt timestamps', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890'
      });

      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt on modification', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890'
      });

      const originalUpdatedAt = user.updatedAt;
      
      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));
      
      await user.update({ name: 'Updated Name' });
      
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});