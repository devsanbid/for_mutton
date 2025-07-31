import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Star, X, CheckCircle } from 'lucide-react';
import { bookingsAPI, reviewsAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { getHotelImageUrl } from '../../utils/imageUtils';

const MyBookingsComponent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('👤 Current user:', user);
  console.log('🔐 Is authenticated:', isAuthenticated());
  console.log('🆔 User ID:', user?.id);



  const [selectedBookingId, setSelectedBookingId] = useState(null);
const [reviewText, setReviewText] = useState('');
const [rating, setRating] = useState(0);


const [rescheduleBookingId, setRescheduleBookingId] = useState(null);
const [newCheckIn, setNewCheckIn] = useState('');
const [newCheckOut, setNewCheckOut] = useState('');



  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching user bookings...');
      const response = await bookingsAPI.getUserBookings();
      console.log('📦 Raw API response:', response);
      console.log('📋 Bookings data:', response.bookings || response);
      setBookings(response.bookings || response);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching bookings:', err);
      setError('Failed to load bookings');
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getBookingStatus = (booking) => {
    if (booking.status) {
      return booking.status;
    }
    
    const now = new Date();
    const checkIn = new Date(booking.checkInDate || booking.checkIn);
    const checkOut = new Date(booking.checkOutDate || booking.checkOut);
    
    if (booking.status === 'cancelled') return 'cancelled';
    if (now > checkOut) return 'completed';
    if (now >= checkIn && now <= checkOut) return 'active';
    return 'upcoming';
  };

  const filteredBookings = bookings.filter(booking => getBookingStatus(booking) === activeTab);
  
  console.log('📊 All bookings:', bookings);
  console.log('🔍 Active tab:', activeTab);
  console.log('📋 Filtered bookings:', filteredBookings);
  console.log('📈 Booking statuses:', bookings.map(b => ({ id: b.id, status: getBookingStatus(b) })));

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingsAPI.cancel(bookingId);
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        toast.error('Failed to cancel booking');
      }
    }
  };

  // const handleReschedule = (bookingId) => {
  //   alert('Reschedule functionality would be implemented here');
  // };

  const handleReschedule = (bookingId) => {
  setRescheduleBookingId(bookingId);
};

  const handleLeaveReview = (bookingId) => {
    setSelectedBookingId(bookingId);
  };

  const submitReview = async () => {
    if (!rating || !reviewText.trim()) {
      toast.error('Please provide both rating and review text');
      return;
    }

    try {
      const booking = bookings.find(b => b._id === selectedBookingId || b.id === selectedBookingId);
      console.log('🔍 [submitReview] Selected booking:', booking);
      console.log('🔍 [submitReview] Hotel object:', booking?.hotel);
      console.log('🔍 [submitReview] Hotel ID attempts:', {
        '_id': booking?.hotel?._id,
        'id': booking?.hotel?.id,
        'final_hotelId': booking?.hotel?._id || booking?.hotel?.id
      });
      
      const hotelId = booking?.hotel?._id || booking?.hotel?.id;
      if (!hotelId) {
        console.error('❌ [submitReview] No hotelId found in booking:', booking);
        toast.error('Unable to submit review: Hotel information missing');
        return;
      }
      
      await reviewsAPI.create({
        hotelId: hotelId,
        bookingId: selectedBookingId,
        rating: rating,
        comment: reviewText
      });
      toast.success('Review submitted successfully!');
      setSelectedBookingId(null);
      setReviewText('');
      setRating(0);
      fetchBookings();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading your bookings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage your hotel reservations and past stays</p>
      </div>

      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'upcoming', label: 'Upcoming', count: bookings.filter(b => getBookingStatus(b) === 'upcoming').length },
          { key: 'completed', label: 'Completed', count: bookings.filter(b => getBookingStatus(b) === 'completed').length },
          { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => getBookingStatus(b) === 'cancelled').length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-[#2F5249] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {activeTab} bookings
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming bookings. Book your next stay!"
                : `You don't have any ${activeTab} bookings.`}
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={() => navigate('/')}
                className="bg-[#2F5249] text-white px-6 py-3 rounded-lg hover:bg-[#437057] transition-colors font-medium"
              >
                Browse Hotels
              </button>
            )}
          </div>
        ) : (
          filteredBookings.map(booking => (
            <div key={booking._id || booking.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                    <img
                      src={getHotelImageUrl(booking.hotel)}
                      alt={booking.hotel?.name || 'Hotel'}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{booking.hotel?.name || 'Hotel Name'}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getBookingStatus(booking))}`}>
                          {getBookingStatus(booking).charAt(0).toUpperCase() + getBookingStatus(booking).slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin size={16} className="mr-1" />
                        <span className="text-sm">{booking.hotel?.location || booking.hotel?.address || 'Location'}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Booking ID: {booking._id || booking.id}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 mb-1">Check-in</div>
                      <div className="font-medium">{new Date(booking.checkInDate || booking.checkIn).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Check-out</div>
                      <div className="font-medium">{new Date(booking.checkOutDate || booking.checkOut).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Guests</div>
                      <div className="font-medium flex items-center">
                        <Users size={16} className="mr-1" />
                        {booking.guests || booking.numberOfGuests}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Room</div>
                      <div className="font-medium">{booking.room?.name || booking.room?.type || booking.roomType || 'Room'}</div>
                    </div>
                  </div>

                  <div className="text-right mt-4 lg:mt-0">
                    <div className="text-2xl font-bold text-[#2F5249]">
                      NPR {(booking.totalAmount || booking.total || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total paid</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-3">
                    {getBookingStatus(booking) === 'upcoming' && (
                      <>
                        <button
                          onClick={() => handleCancelBooking(booking._id || booking.id)}
                          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Cancel Booking
                        </button>
                        <button
                          onClick={() => handleReschedule(booking._id || booking.id)}
                          className="px-4 py-2 border border-[#437057] text-[#437057] rounded-lg hover:bg-[#437057] hover:text-white transition-colors"
                        >
                          Reschedule
                        </button>
                      </>
                    )}
                    {getBookingStatus(booking) === 'completed' && (
                      <button
                        onClick={() => handleLeaveReview(booking._id || booking.id)}
                        className="px-4 py-2 bg-[#2F5249] text-white rounded-lg hover:bg-[#437057] transition-colors flex items-center space-x-2"
                      >
                        <Star size={16} />
                        <span>Leave Review</span>
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/users/hotel/${booking.hotelId || booking.hotel?.id}`)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View Hotel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {selectedBookingId && (
   <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
      <button
        onClick={() => setSelectedBookingId(null)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <X size={20} />
      </button>
      <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Rating:</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              onClick={() => setRating(star)}
              className={`cursor-pointer ${
                rating >= star ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill={rating >= star ? '#facc15' : 'none'}
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Your Review:</label>
        <textarea
          className="w-full p-2 border rounded-md text-sm"
          rows={4}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
      </div>
      <button
        onClick={submitReview}
        className="w-full bg-[#2F5249] text-white py-2 rounded-md hover:bg-[#437057]"
      >
        Submit Review
      </button>
    </div>
  </div>
)}


{rescheduleBookingId && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
      <button
        onClick={() => {
          setRescheduleBookingId(null);
          setNewCheckIn('');
          setNewCheckOut('');
        }}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <X size={20} />
      </button>
      <h2 className="text-xl font-semibold mb-4">Reschedule Booking</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">New Check-in Date</label>
        <input
          type="date"
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
          value={newCheckIn}
          onChange={(e) => setNewCheckIn(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">New Check-out Date</label>
        <input
          type="date"
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
          value={newCheckOut}
          onChange={(e) => setNewCheckOut(e.target.value)}
        />
      </div>
      <button
        onClick={() => {
          alert(`Booking rescheduled to:\nCheck-in: ${newCheckIn}\nCheck-out: ${newCheckOut}`);
          setRescheduleBookingId(null);
          setNewCheckIn('');
          setNewCheckOut('');
        }}
        className="w-full bg-[#2F5249] text-white py-2 rounded-md hover:bg-[#437057] transition-colors"
      >
        Confirm Reschedule
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default MyBookingsComponent;
