const request = require('supertest');
const app = require('../server');
const { User, Hotel, Room } = require('../models');
const jwt = require('jsonwebtoken');

describe('Hotel API', () => {
  let hotelierToken;
  let userToken;
  let hotelier;
  let user;
  let testHotel;

  beforeEach(async () => {
    // Create test hotelier
    hotelier = await User.create({
      name: 'Hotel Owner',
      email: 'hotelier@example.com',
      password: 'password123',
      phone: '1234567890',
      role: 'hotelier',
      status: 'approved'
    });

    // Create test user
    user = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'password123',
      phone: '1234567890',
      role: 'user',
      status: 'approved'
    });

    hotelierToken = jwt.sign({ id: hotelier.id }, process.env.JWT_SECRET || 'heavenstay_secret_key_2024');
    userToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'heavenstay_secret_key_2024');

    // Create test hotel
    testHotel = await Hotel.create({
      name: 'Test Hotel',
      description: 'A beautiful test hotel',
      location: 'Test City',
      address: '123 Test Street',
      phone: '1234567890',
      email: 'hotel@test.com',
      amenities: ['wifi', 'parking', 'pool'],
      images: ['hotel1.jpg', 'hotel2.jpg'],
      rating: 4.5,
      featured: false,
      status: 'active',
      hotelierId: hotelier.id
    });

    // Create test rooms
    await Room.create({
      hotelId: testHotel.id,
      type: 'Standard',
      description: 'Standard room with basic amenities',
      price: 100.00,
      capacity: 2,
      amenities: ['wifi', 'tv'],
      images: ['room1.jpg'],
      isAvailable: true
    });

    await Room.create({
      hotelId: testHotel.id,
      type: 'Deluxe',
      description: 'Deluxe room with premium amenities',
      price: 200.00,
      capacity: 4,
      amenities: ['wifi', 'tv', 'minibar'],
      images: ['room2.jpg'],
      isAvailable: true
    });
  });

  describe('GET /api/hotels', () => {
    it('should get all active hotels', async () => {
      const response = await request(app)
        .get('/api/hotels')
        .expect(200);

      expect(response.body.hotels).toBeDefined();
      expect(response.body.hotels.length).toBeGreaterThan(0);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.hotels[0].name).toBe('Test Hotel');
      expect(response.body.hotels[0].minPrice).toBe(100);
    });

    it('should search hotels by name', async () => {
      const response = await request(app)
        .get('/api/hotels?search=Test')
        .expect(200);

      expect(response.body.hotels.length).toBeGreaterThan(0);
      expect(response.body.hotels[0].name).toContain('Test');
    });

    it('should filter hotels by location', async () => {
      const response = await request(app)
        .get('/api/hotels?location=Test City')
        .expect(200);

      expect(response.body.hotels.length).toBeGreaterThan(0);
      expect(response.body.hotels[0].location).toContain('Test City');
    });

    it('should filter hotels by amenities', async () => {
      const response = await request(app)
        .get('/api/hotels?amenities=wifi')
        .expect(200);

      expect(response.body.hotels.length).toBeGreaterThan(0);
      expect(response.body.hotels[0].amenities).toContain('wifi');
    });

    it('should sort hotels by price low to high', async () => {
      const response = await request(app)
        .get('/api/hotels?sortBy=price-low')
        .expect(200);

      expect(response.body.hotels).toBeDefined();
      expect(response.body.hotels.length).toBeGreaterThan(0);
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/hotels?page=1&limit=5')
        .expect(200);

      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
    });
  });

  describe('GET /api/hotels/:id', () => {
    it('should get hotel by id', async () => {
      const response = await request(app)
        .get(`/api/hotels/${testHotel.id}`)
        .expect(200);

      expect(response.body.hotel.id).toBe(testHotel.id);
      expect(response.body.hotel.name).toBe('Test Hotel');
      expect(response.body.hotel.rooms).toBeDefined();
      expect(response.body.hotel.rooms.length).toBe(2);
    });

    it('should return 404 for non-existent hotel', async () => {
      const response = await request(app)
        .get('/api/hotels/99999')
        .expect(404);

      expect(response.body.message).toBe('Hotel not found');
    });
  });

  describe('POST /api/hotels', () => {
    it('should create hotel as hotelier', async () => {
      const hotelData = {
        name: 'New Hotel',
        description: 'A brand new hotel',
        location: 'New City',
        address: '456 New Street',
        phone: '9876543210',
        email: 'newhotel@test.com',
        amenities: ['wifi', 'gym']
      };

      const response = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${hotelierToken}`)
        .send(hotelData)
        .expect(201);

      expect(response.body.message).toBe('Hotel created successfully');
      expect(response.body.hotel.name).toBe(hotelData.name);
      expect(response.body.hotel.hotelierId).toBe(hotelier.id);
    });

    it('should not create hotel without authentication', async () => {
      const hotelData = {
        name: 'New Hotel',
        description: 'A brand new hotel',
        location: 'New City'
      };

      const response = await request(app)
        .post('/api/hotels')
        .send(hotelData)
        .expect(401);

      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    it('should not create hotel as regular user', async () => {
      const hotelData = {
        name: 'New Hotel',
        description: 'A brand new hotel',
        location: 'New City'
      };

      const response = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${userToken}`)
        .send(hotelData)
        .expect(403);

      expect(response.body.message).toBe('Access denied. Insufficient permissions.');
    });

    it('should validate required fields', async () => {
      const invalidData = {
        description: 'Missing name and location'
      };

      const response = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${hotelierToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/hotels/:id', () => {
    it('should update own hotel as hotelier', async () => {
      const updateData = {
        name: 'Updated Hotel Name',
        description: 'Updated description',
        location: 'Updated City',
        address: '789 Updated Street',
        phone: '5555555555',
        email: 'updated@test.com',
        amenities: ['wifi', 'spa']
      };

      const response = await request(app)
        .put(`/api/hotels/${testHotel.id}`)
        .set('Authorization', `Bearer ${hotelierToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe('Hotel updated successfully');
      expect(response.body.hotel.name).toBe(updateData.name);
    });

    it('should not update hotel without authentication', async () => {
      const updateData = { name: 'Updated Name' };

      const response = await request(app)
        .put(`/api/hotels/${testHotel.id}`)
        .send(updateData)
        .expect(401);

      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    it('should return 404 for non-existent hotel', async () => {
      const updateData = { name: 'Updated Name' };

      const response = await request(app)
        .put('/api/hotels/99999')
        .set('Authorization', `Bearer ${hotelierToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.message).toBe('Hotel not found');
    });
  });

  describe('DELETE /api/hotels/:id', () => {
    it('should delete own hotel as hotelier', async () => {
      const response = await request(app)
        .delete(`/api/hotels/${testHotel.id}`)
        .set('Authorization', `Bearer ${hotelierToken}`)
        .expect(200);

      expect(response.body.message).toBe('Hotel deleted successfully');
    });

    it('should not delete hotel without authentication', async () => {
      const response = await request(app)
        .delete(`/api/hotels/${testHotel.id}`)
        .expect(401);

      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    it('should return 404 for non-existent hotel', async () => {
      const response = await request(app)
        .delete('/api/hotels/99999')
        .set('Authorization', `Bearer ${hotelierToken}`)
        .expect(404);

      expect(response.body.message).toBe('Hotel not found');
    });
  });

  describe('GET /api/hotels/hotelier/my-hotels', () => {
    it('should get hotelier own hotels', async () => {
      const response = await request(app)
        .get('/api/hotels/hotelier/my-hotels')
        .set('Authorization', `Bearer ${hotelierToken}`)
        .expect(200);

      expect(response.body.hotels).toBeDefined();
      expect(response.body.hotels.length).toBeGreaterThan(0);
      expect(response.body.hotels[0].hotelierId).toBe(hotelier.id);
    });

    it('should not get hotels without authentication', async () => {
      const response = await request(app)
        .get('/api/hotels/hotelier/my-hotels')
        .expect(401);

      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    it('should not get hotels as regular user', async () => {
      const response = await request(app)
        .get('/api/hotels/hotelier/my-hotels')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.message).toBe('Access denied. Insufficient permissions.');
    });
  });
});