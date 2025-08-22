const { testSequelize, connectTestDB, closeTestDB, clearTestDB } = require('../database/testDb');
const { TestUser, TestHotel, TestRoom } = require('../models/testModels');

describe('Room Model CRUD Operations', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
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
});