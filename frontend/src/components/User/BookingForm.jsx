import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, ArrowLeft, CreditCard } from 'lucide-react';
import { roomsAPI, bookingsAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const BookingFormComponent = () => {
  const { id } = useParams(); // This is the room ID
  const navigate = useNavigate();
  const { toast } = useToast();
  const [room, setRoom] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: ''
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const response = await roomsAPI.getById(id);
        setRoom(response.room);
        setHotel(response.room.hotel);
        setError(null);
      } catch (err) {
        console.error('Error fetching room data:', err);
        setError('Failed to load room details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoomData();
    }
  }, [id]);

  const nights = bookingData.checkIn && bookingData.checkOut
    ? Math.ceil((new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const subtotal = room ? room.price * nights : 0;
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    try {
      const bookingPayload = {
        hotelId: room.hotelId,
        roomId: room.id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: parseInt(bookingData.guests),
        roomType: room.type || room.name || 'standard',
        specialRequests: bookingData.specialRequests || '',
        paymentMethod: 'esewa'
      };

      console.log('Booking payload:', bookingPayload);
      await bookingsAPI.create(bookingPayload);
      toast.success('Booking confirmed successfully! Your booking details will be available in My Bookings.');
      navigate('/users/mybookings');
    } catch (error) {
      console.error('Booking error:', error);
      console.error('Error message:', error.message);
      toast.error(error.message || 'Failed to create booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#437057] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading room details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-[#437057] text-white px-4 py-2 rounded-lg hover:bg-[#2F5249] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!room || !hotel) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Room not found</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-[#437057] text-white px-4 py-2 rounded-lg hover:bg-[#2F5249] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-[#437057] hover:text-[#2F5249] transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Hotel Details</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Check-in & Check-out */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="date"
                    id="checkIn"
                    name="checkIn"
                    value={bookingData.checkIn}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#437057] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="date"
                    id="checkOut"
                    name="checkOut"
                    value={bookingData.checkOut}
                    onChange={handleInputChange}
                    min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#437057] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Guests */}
            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <select
                  id="guests"
                  name="guests"
                  value={bookingData.guests}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#437057] focus:border-transparent"
                >
                  {Array.from({ length: room.capacity }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-500 mt-1">Maximum {room.capacity} guests for this room</p>
            </div>

            {/* Selected Room Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Selected Room</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room:</span>
                  <span className="font-medium">{room.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{room.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per night:</span>
                  <span className="font-medium">NPR {room.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">Up to {room.capacity} guests</span>
                </div>
                {room.description && (
                  <div>
                    <span className="text-gray-600">Description:</span>
                    <p className="text-sm text-gray-700 mt-1">{room.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={bookingData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any special requests or requirements..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#437057] focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#2F5249] text-white py-3 px-6 rounded-lg hover:bg-[#437057] transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <CreditCard size={20} />
              <span>Proceed to Payment</span>
            </button>
          </form>
        </div>

        {/* Booking Summary */}
        <div className="space-y-6">
          {/* Hotel Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hotel Information</h2>
            <div className="flex items-center space-x-4">
              <img
                src={hotel.images && hotel.images.length > 0 ? hotel.images[0] : '/api/placeholder/64/64'}
                alt={hotel.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{hotel.name}</h3>
                <p className="text-gray-600">{hotel.location}</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium">{bookingData.checkIn || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium">{bookingData.checkOut || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nights:</span>
                <span className="font-medium">{nights} night{nights !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests:</span>
                <span className="font-medium">{bookingData.guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room:</span>
                <span className="font-medium">{room?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room Type:</span>
                <span className="font-medium capitalize">{room?.type}</span>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Price Breakdown</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  NPR {room?.price.toLocaleString()} x {nights} night{nights !== 1 ? 's' : ''}
                </span>
                <span className="font-medium">NPR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (13%)</span>
                <span className="font-medium">NPR {tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#2F5249]">NPR {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFormComponent;
