const { testSequelize, connectTestDB, closeTestDB, clearTestDB } = require('../database/testDb');
const { TestUser, TestNotification } = require('../models/testModels');

describe('Notification Model CRUD Operations', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('Notification Model', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await TestUser.create({
        name: 'Test User',
        email: 'user@example.com',
        password: 'password123'
      });
    });

    it('should create a notification', async () => {
      const notificationData = {
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'info',
        isRead: false,
        userId: testUser.id
      };

      const notification = await TestNotification.create(notificationData);
      
      expect(notification.id).toBeDefined();
      expect(notification.title).toBe(notificationData.title);
      expect(notification.message).toBe(notificationData.message);
      expect(notification.userId).toBe(testUser.id);
    });

    it('should read a notification', async () => {
      const notificationData = {
        title: 'Another Notification',
        message: 'Another test message',
        type: 'success',
        userId: testUser.id
      };

      const createdNotification = await TestNotification.create(notificationData);
      const foundNotification = await TestNotification.findByPk(createdNotification.id);
      
      expect(foundNotification).toBeTruthy();
      expect(foundNotification.title).toBe(notificationData.title);
      expect(foundNotification.message).toBe(notificationData.message);
    });

    it('should update a notification', async () => {
      const notificationData = {
        title: 'Update Test',
        message: 'This will be updated',
        type: 'warning',
        userId: testUser.id
      };

      const notification = await TestNotification.create(notificationData);
      await notification.update({ isRead: true });
      
      expect(notification.isRead).toBe(true);
    });

    it('should delete a notification', async () => {
      const notificationData = {
        title: 'Delete Test',
        message: 'This will be deleted',
        type: 'error',
        userId: testUser.id
      };

      const notification = await TestNotification.create(notificationData);
      await notification.destroy();
      
      const deletedNotification = await TestNotification.findByPk(notification.id);
      expect(deletedNotification).toBeNull();
    });
  });
});