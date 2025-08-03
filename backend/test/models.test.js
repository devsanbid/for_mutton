const { Hotel, Room, Booking, Review, Payment, Notification } = require('../models');

describe('Hotel Model', () => {
  it('should require name', async () => {
    const hotel = Hotel.build({ location: 'City', address: 'Street 1', phone: '1234567890', email: 'h@example.com', hotelierId: 1 });
    let error;
    try {
      await hotel.validate();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.errors.map(e => e.path)).toContain('name');
  });

  it('should pass with valid data', async () => {
    const hotel = Hotel.build({ name: 'Grand', location: 'City', address: 'Street 1', phone: '1234567890', email: 'h@example.com', hotelierId: 1 });
    await expect(hotel.validate()).resolves.not.toThrow();
  });
});

describe('Room Model', () => {
  it('should require name', async () => {
    const room = Room.build({ type: 'standard', price: 100, capacity: 2, totalRooms: 1, hotelId: 1 });
    let error;
    try {
      await room.validate();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.errors.map(e => e.path)).toContain('name');
  });

  it('should pass with valid data', async () => {
    const room = Room.build({ name: 'A1', type: 'standard', price: 100, capacity: 2, totalRooms: 1, hotelId: 1 });
    await expect(room.validate()).resolves.not.toThrow();
  });
});

describe('Booking Model', () => {
  it('should require bookingId', async () => {
    const booking = Booking.build({ checkIn: '2024-01-01', checkOut: '2024-01-02', guests: 1, nights: 1, roomType: 'standard', subtotal: 100, tax: 10, total: 110, paymentMethod: 'cash', userId: 1, hotelId: 1, roomId: 1 });
    let error;
    try {
      await booking.validate();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.errors.map(e => e.path)).toContain('bookingId');
  });

  it('should pass with valid data', async () => {
    const booking = Booking.build({ bookingId: 'B1', checkIn: '2024-01-01', checkOut: '2024-01-02', guests: 1, nights: 1, roomType: 'standard', subtotal: 100, tax: 10, total: 110, paymentMethod: 'cash', userId: 1, hotelId: 1, roomId: 1 });
    await expect(booking.validate()).resolves.not.toThrow();
  });
});

describe('Review Model', () => {
  it('should require rating', async () => {
    const review = Review.build({ comment: 'Great', userId: 1, hotelId: 1, bookingId: 1 });
    let error;
    try {
      await review.validate();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.errors.map(e => e.path)).toContain('rating');
  });

  it('should pass with valid data', async () => {
    const review = Review.build({ rating: 5, comment: 'Excellent stay', userId: 1, hotelId: 1, bookingId: 1 });
    await expect(review.validate()).resolves.not.toThrow();
  });
});

describe('Payment Model', () => {
  it('should require amount', async () => {
    const payment = Payment.build({ adminCommission: 10, hotelerAmount: 90, paymentMethod: 'cash', bookingId: 1, userId: 1, hotelierId: 1 });
    let error;
    try {
      await payment.validate();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.errors.map(e => e.path)).toContain('amount');
  });

  it('should pass with valid data', async () => {
    const payment = Payment.build({ amount: 100, adminCommission: 10, hotelerAmount: 90, paymentMethod: 'cash', bookingId: 1, userId: 1, hotelierId: 1 });
    await expect(payment.validate()).resolves.not.toThrow();
  });
});

describe('Notification Model', () => {
  it('should require title', async () => {
    const notification = Notification.build({ message: 'msg', type: 'booking', userId: 1 });
    let error;
    try {
      await notification.validate();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.errors.map(e => e.path)).toContain('title');
  });

  it('should pass with valid data', async () => {
    const notification = Notification.build({ title: 'Info', message: 'msg', type: 'booking', userId: 1 });
    await expect(notification.validate()).resolves.not.toThrow();
  });
});