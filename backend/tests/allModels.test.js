const { testSequelize, connectTestDB, closeTestDB, clearTestDB } = require('../database/testDb');
const {
  TestUser,
  TestHotel,
  TestRoom,
  TestNotification
} = require('../models/testModels');
const bcrypt = require('bcryptjs');

describe('All Model CRUD Operations', () => {
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

  describe('Hotel Model', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await TestUser.create({
        name: 'Hotel Owner',
        email: 'owner@example.com',
        password: 'password123',
        role: 'hotelier'
      });
    });

    it('should create a hotel', async () => {
      const hotelData = {
        name: 'Grand Hotel',
        description: 'A luxurious hotel',
        location: 'New York',
        address: '123 Main St',
        phone: '1234567890',
        email: 'hotel@example.com',
        rating: 4.5,
        amenities: ['wifi', 'pool'],
        images: ['hotel1.jpg'],
        featured: false,
        status: 'active',
        ownerId: testUser.id
      };

      const hotel = await TestHotel.create(hotelData);
      
      expect(hotel.id).toBeDefined();
      expect(hotel.name).toBe(hotelData.name);
      expect(hotel.location).toBe(hotelData.location);
      expect(hotel.ownerId).toBe(testUser.id);
    });

    it('should read a hotel', async () => {
      const hotelData = {
        name: 'Beach Resort',
        description: 'A beautiful beach resort',
        location: 'Miami',
        address: '456 Beach Ave',
        phone: '9876543210',
        email: 'resort@example.com',
        ownerId: testUser.id
      };

      const createdHotel = await TestHotel.create(hotelData);
      const foundHotel = await TestHotel.findByPk(createdHotel.id);
      
      expect(foundHotel).toBeTruthy();
      expect(foundHotel.name).toBe(hotelData.name);
      expect(foundHotel.location).toBe(hotelData.location);
    });

    it('should update a hotel', async () => {
      const hotelData = {
        name: 'City Hotel',
        description: 'A modern city hotel',
        location: 'Chicago',
        address: '789 City St',
        phone: '5555555555',
        email: 'city@example.com',
        ownerId: testUser.id
      };

      const hotel = await TestHotel.create(hotelData);
      await hotel.update({ name: 'Updated City Hotel' });
      
      expect(hotel.name).toBe('Updated City Hotel');
    });

    it('should delete a hotel', async () => {
      const hotelData = {
        name: 'Mountain Lodge',
        description: 'A cozy mountain lodge',
        location: 'Colorado',
        address: '321 Mountain Rd',
        phone: '7777777777',
        email: 'lodge@example.com',
        ownerId: testUser.id
      };

      const hotel = await TestHotel.create(hotelData);
      await hotel.destroy();
      
      const deletedHotel = await TestHotel.findByPk(hotel.id);
      expect(deletedHotel).toBeNull();
    });
  });

  describe('Room Model', () => {
    let testUser, testHotel;

    beforeEach(async () => {
      testUser = await TestUser.create({
        name: 'Hotel Owner',
        email: 'owner@example.com',
        password: 'password123',
        role: 'hotelier'
      });

      testHotel = await TestHotel.create({
        name: 'Test Hotel',
        description: 'A test hotel',
        location: 'Test City',
        address: '123 Test St',
        phone: '1234567890',
        email: 'test@example.com',
        ownerId: testUser.id
      });
    });

    it('should create a room', async () => {
      const roomData = {
        roomNumber: '101',
        hotelId: testHotel.id,
        type: 'Standard',
        description: 'A standard room',
        price: 100.00,
        capacity: 2,
        totalRooms: 10,
        amenities: ['wifi', 'tv'],
        images: ['room1.jpg'],
        isAvailable: true
      };

      const room = await TestRoom.create(roomData);
      
      expect(room.id).toBeDefined();
      expect(room.type).toBe(roomData.type);
      expect(parseFloat(room.price)).toBe(roomData.price);
      expect(room.hotelId).toBe(testHotel.id);
    });

    it('should read a room', async () => {
      const roomData = {
        roomNumber: '201',
        hotelId: testHotel.id,
        type: 'Deluxe',
        description: 'A deluxe room',
        price: 200.00,
        capacity: 4,
        totalRooms: 5
      };

      const createdRoom = await TestRoom.create(roomData);
      const foundRoom = await TestRoom.findByPk(createdRoom.id);
      
      expect(foundRoom).toBeTruthy();
      expect(foundRoom.type).toBe(roomData.type);
      expect(parseFloat(foundRoom.price)).toBe(roomData.price);
    });

    it('should update a room', async () => {
      const roomData = {
        roomNumber: '301',
        hotelId: testHotel.id,
        type: 'Suite',
        description: 'A luxury suite',
        price: 300.00,
        capacity: 6,
        totalRooms: 2
      };

      const room = await TestRoom.create(roomData);
      await room.update({ price: 350.00 });
      
      expect(parseFloat(room.price)).toBe(350.00);
    });

    it('should delete a room', async () => {
      const roomData = {
        roomNumber: '401',
        hotelId: testHotel.id,
        type: 'Economy',
        description: 'An economy room',
        price: 50.00,
        capacity: 1,
        totalRooms: 20
      };

      const room = await TestRoom.create(roomData);
      await room.destroy();
      
      const deletedRoom = await TestRoom.findByPk(room.id);
      expect(deletedRoom).toBeNull();
    });
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