const request = require('supertest');
const app = require('../server');
const { User, Hotel, Room, Booking } = require('../models');
const jwt = require('jsonwebtoken');

describe('Booking API', () => {
  let userToken;
  let hotelierToken;
  let user;
  let hotelier;
  let testHotel;
  let testRoom;

  beforeEach(async () => {
    // Create test user
    user = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'password123',
      phone: '1234567890',
      role: 'user',
      status: 'approved'
    });

    // Create test hotelier
    hotelier = await User.create({
      name: 'Hotel Owner',
      email: 'hotelier@example.com',
      password: 'password123',
      phone: '1234567890',
      role: 'hotelier',
      status: 'approved'
    });

    userToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'heavenstay_secret_key_2024');
    hotelierToken = jwt.sign({ id: hotelier.id }, process.env.JWT_SECRET || 'heavenstay_secret_key_2024');

    // Create test hotel
    testHotel = await Hotel.create({
      name: 'Test Hotel',
      description: 'A beautiful test hotel',
      location: 'Test City',
      address: '123 Test Street',
      phone: '1234567890',
      email: 'hotel@test.com',
      amenities: ['wifi', 'parking'],
      images: ['hotel1.jpg'],
      rating: 4.5,
      featured: false,
      status: 'active',
      hotelierId: hotelier.id
    });

    // Create test room
    testRoom = await Room.create({
      hotelId: testHotel.id,
      type: 'Standard',
      description: 'Standard room with basic amenities',
      price: 100.00,
      capacity: 2,
      totalRooms: 5,
      amenities: ['wifi', 'tv'],
      images: ['room1.jpg'],
      isAvailable: true
    });
  });

  describe('POST /api/bookings', () => {
    it('should create a booking successfully', async () => {
      const bookingData = {
        hotelId: testHotel.id,
        roomId: testRoom.id,
        checkIn: '2024-12-25',
        checkOut: '2024-12-27',
        guests: 2,
        roomType: 'Standard',
        specialRequests: 'Late check-in',
        paymentMethod: 'credit_card'
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(bookingData)
        .expect(201);

      expect(response.body.message).toBe('Booking created successfully');
      expect(response.body.booking.bookingId).toBeDefined();
      expect(response.body.booking.userId).toBe(user.id);
      expect(response.body.booking.hotelId).toBe(testHotel.id);
      expect(response.body.booking.roomId).toBe(testRoom.id);
      expect(response.body.booking.nights).toBe(2);
      expect(parseFloat(response.body.booking.subtotal)).toBe(200.00); // 2 nights * $100
      expect(parseFloat(response.body.booking.total)).toBe(226.00); // subtotal + 13% tax
    });

    it('should not create booking without authentication', async () => {
      const bookingData = {
        hotelId: testHotel.id,
        roomId: testRoom.id,
        checkIn: '2024-12-25',
        checkOut: '2024-12-27',
        guests: 2,
        roomType: 'Standard'
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(401);

      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    it('should not create booking with invalid date range', async () => {
      const bookingData = {
        hotelId: testHotel.id,
        roomId: testRoom.id,
        checkIn: '2024-12-27',
        checkOut: '2024-12-25', // Check-out before check-in
        guests: 2,
        roomType: 'Standard'
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(bookingData)
        .expect(400);

      expect(response.body.message).toBe('Invalid date range');
    });

    it('should not create booking for non-existent hotel', async () => {
      const bookingData = {
        hotelId: 99999,
        roomId: testRoom.id,
        checkIn: '2024-12-25',
        checkOut: '2024-12-27',
        guests: 2,
        roomType: 'Standard'
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(bookingData)
        .expect(404);

      expect(response.body.message).toBe('Hotel or room not found');
    });

    it('should not create booking for non-existent room', async () => {
      const bookingData = {
        hotelId: testHotel.id,
        roomId: 99999,
        checkIn: '2024-12-25',
        checkOut: '2024-12-27',
        guests: 2,
        roomType: 'Standard'
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(bookingData)
        .expect(404);

      expect(response.body.message).toBe('Hotel or room not found');
    });

    it('should validate required fields', async () => {
      const invalidData = {
        hotelId: testHotel.id,
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/bookings', () => {
    let testBooking;

    beforeEach(async () => {
      testBooking = await Booking.create({
        bookingId: 'HB123456789ABC',
        checkIn: '2024-12-25',
        checkOut: '2024-12-27',
        guests: 2,
        nights: 2,
        roomType: 'Standard',
        specialRequests: 'Late check-in',
        subtotal: 200.00,
        tax: 26.00,
        total: 226.00,
        paymentMethod: 'credit_card',
        paymentStatus: 'paid',
        status: 'upcoming',
        userId: user.id,
        hotelId: testHotel.id,
        roomId: testRoom.id
      });
    });

    it('should get user bookings', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.bookings).toBeDefined();
      expect(response.body.bookings.length).toBeGreaterThan(0);
      expect(response.body.bookings[0].userId).toBe(user.id);
      expect(response.body.bookings[0].bookingId).toBe(testBooking.bookingId);
    });

    it('should not get bookings without authentication', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .expect(401);

      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    it('should filter bookings by status', async () => {
      const response = await request(app)
        .get('/api/bookings?status=upcoming')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.bookings).toBeDefined();
      if (response.body.bookings.length > 0) {
        expect(response.body.bookings[0].status).toBe('upcoming');
      }
    });
  });

  describe('GET /api/bookings/:id', () => {
    let testBooking;

    beforeEach(async () => {
      testBooking = await Booking.create({
        bookingId: 'HB123456789ABC',
        checkIn: '2024-12-25',
        checkOut: '2024-12-27',
        guests: 2,
        nights: 2,
        roomType: 'Standard',
        subtotal: 200.00,
        tax: 26.00,
        total: 226.00,
        paymentMethod: 'credit_card',
        paymentStatus: 'paid',
        status: 'upcoming',
        userId: user.id,
        hotelId: testHotel.id,
        roomId: testRoom.id
      });
    });

    it('should get booking by id', async () => {
      const response = await request(app)
        .get(`/api/bookings/${testBooking.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.booking.id).toBe(testBooking.id);
      expect(response.body.booking.bookingId).toBe(testBooking.bookingId);
      expect(response.body.booking.hotel).toBeDefined();
      expect(response.body.booking.room).toBeDefined();
    });

    it('should not get booking without authentication', async () => {
      const response = await request(app)
        .get(`/api/bookings/${testBooking.id}`)
        .expect(401);

      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    it('should return 404 for non-existent booking', async () => {
      const response = await request(app)
        .get('/api/bookings/99999')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);

      expect(response.body.message).toBe('Booking not found');
    });
  });

  describe('PUT /api/bookings/:id/cancel', () => {
    let testBooking;

    beforeEach(async () => {
      testBooking = await Booking.create({
        bookingId: 'HB123456789ABC',
        checkIn: '2024-12-25',
        checkOut: '2024-12-27',
        guests: 2,
        nights: 2,
        roomType: 'Standard',
        subtotal: 200.00,
        tax: 26.00,
        total: 226.00,
        paymentMethod: 'credit_card',
        paymentStatus: 'paid',
        status: 'upcoming',
        userId: user.id,
        hotelId: testHotel.id,
        roomId: testRoom.id
      });
    });

    it('should cancel booking successfully', async () => {
      const response = await request(app)
        .put(`/api/bookings/${testBooking.id}/cancel`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.message).toBe('Booking cancelled successfully');
      expect(response.body.booking.status).toBe('cancelled');
    });

    it('should not cancel booking without authentication', async () => {
      const response = await request(app)
        .put(`/api/bookings/${testBooking.id}/cancel`)
        .expect(401);

      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    it('should return 404 for non-existent booking', async () => {
      const response = await request(app)
        .put('/api/bookings/99999/cancel')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);

      expect(response.body.message).toBe('Booking not found');
    });
  });

  describe('GET /api/bookings/hotelier/bookings', () => {
    let testBooking;

    beforeEach(async () => {
      testBooking = await Booking.create({
        bookingId: 'HB123456789ABC',
        checkIn: '2024-12-25',
        checkOut: '2024-12-27',
        guests: 2,
        nights: 2,
        roomType: 'Standard',
        subtotal: 200.00,
        tax: 26.00,
        total: 226.00,
        paymentMethod: 'credit_card',
        paymentStatus: 'paid',
        status: 'upcoming',
        userId: user.id,
        hotelId: testHotel.id,
        roomId: testRoom.id
      });
    });

    it('should get hotelier bookings', async () => {
      const response = await request(app)
        .get('/api/bookings/hotelier/bookings')
        .set('Authorization', `Bearer ${hotelierToken}`)
        .expect(200);

      expect(response.body.bookings).toBeDefined();
      expect(response.body.bookings.length).toBeGreaterThan(0);
      expect(response.body.bookings[0].hotelId).toBe(testHotel.id);
    });

    it('should not get hotelier bookings without authentication', async () => {
      const response = await request(app)
        .get('/api/bookings/hotelier/bookings')
        .expect(401);

      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    it('should not get hotelier bookings as regular user', async () => {
      const response = await request(app)
        .get('/api/bookings/hotelier/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.message).toBe('Access denied. Insufficient permissions.');
    });
  });
});