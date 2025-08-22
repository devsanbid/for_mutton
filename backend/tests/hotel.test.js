const { testSequelize, connectTestDB, closeTestDB, clearTestDB } = require('../database/testDb');
const { TestUser, TestHotel } = require('../models/testModels');

describe('Hotel Model CRUD Operations', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
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
});