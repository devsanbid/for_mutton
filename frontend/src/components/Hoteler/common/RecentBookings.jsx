import React, { useState, useEffect } from 'react';
import { Calendar, User } from 'lucide-react';
import { bookingsAPI } from '../../../services/api';

const RecentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  const fetchRecentBookings = async () => {
    try {
      setLoading(true);
      console.log('📋 [RecentBookings] Fetching hotelier bookings...');
      const response = await bookingsAPI.getHotelierBookings();
      console.log('📋 [RecentBookings] Received response:', response);
      
      const bookingsArray = response.bookings || [];
      console.log('📋 [RecentBookings] Bookings array:', bookingsArray);
      
      const recentBookings = bookingsArray
        .sort((a, b) => new Date(b.createdAt || b.checkIn) - new Date(a.createdAt || a.checkIn))
        .slice(0, 5);
      
      setBookings(recentBookings);
      setError(null);
    } catch (err) {
      console.error('❌ [RecentBookings] Error fetching bookings:', err);
      setError('Failed to load recent bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Checked-in':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
              <div className="ml-3 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-6 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center">
        <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No recent bookings found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{booking.user?.name || booking.guestName || 'Guest'}</p>
              <p className="text-xs text-gray-500">{booking.hotel?.name || booking.hotelName || 'Hotel'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(booking.checkIn || booking.date).toLocaleDateString()}
            </div>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(booking.status)}`}>
              {booking.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentBookings;