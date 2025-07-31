import React, { useState, useEffect } from 'react';
import { Calendar, User, DollarSign, Clock, CheckCircle, XCircle, Phone, Mail, MapPin } from 'lucide-react';
import { bookingsAPI } from '../../services/api';
import Loading from '../../components/common/Loading';
import { useToast } from '../../context/ToastContext';

const Button = ({ children, onClick, size = 'md', variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
  };
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching hotelier bookings...');
      const response = await bookingsAPI.getHotelierBookings();
      console.log('📦 Raw API response:', response);
      
      const bookingsData = response.bookings || response.data || response || [];
      console.log('📋 Extracted bookings data:', bookingsData);
      console.log('📊 Number of bookings:', bookingsData.length);
      
      const formattedBookings = bookingsData.map(booking => ({
        id: booking.id,
        guestName: booking.user?.name || 'Unknown Guest',
        guestEmail: booking.user?.email || 'No email',
        hotel: booking.hotel?.name || 'Unknown Hotel',
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        amount: `$${booking.total}`,
        status: booking.status,
        phone: booking.user?.phone || 'No phone',
        roomType: booking.room?.name || booking.roomType || 'Unknown Room',
        bookingId: booking.bookingId,
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus
      }));
      
      console.log('✅ Formatted bookings:', formattedBookings);
      setBookings(formattedBookings);
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      console.log('🔍 Error details:', error.response?.data || error.message);
      showToast('Failed to load bookings', 'error');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const [statusFilter, setStatusFilter] = useState('All');

  const updateBookingStatus = async (id, newStatus) => {
    try {
      await bookingsAPI.updateStatus(id, { status: newStatus });
      setBookings(bookings.map(booking =>
        booking.id === id ? { ...booking, status: newStatus } : booking
      ));
      showToast('Booking status updated successfully', 'success');
    } catch (error) {
      console.error('Error updating booking status:', error);
      showToast('Failed to update booking status', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
      case 'upcoming':
        return 'bg-green-100 text-green-800';
      case 'checked-in':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
      case 'upcoming':
        return <Clock className="h-4 w-4" />;
      case 'checked-in':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Confirmed';
      case 'checked-in':
        return 'Checked In';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const filteredBookings = statusFilter === 'All' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  console.log('📊 All bookings:', bookings);
  console.log('🔍 Status filter:', statusFilter);
  console.log('📋 Filtered bookings:', filteredBookings);
  console.log('📈 Booking count - Total:', bookings.length, 'Filtered:', filteredBookings.length);
  console.log('🔍 Booking statuses:', bookings.map(b => ({ id: b.id, status: b.status, guestName: b.guestName })));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Booking Management</h2>
            <p className="text-gray-600 mt-1">View and manage all your hotel bookings</p>
          </div>
          
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {['All', 'upcoming', 'checked-in', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {status === 'upcoming' ? 'Upcoming' : status === 'checked-in' ? 'Checked In' : status === 'completed' ? 'Completed' : status === 'cancelled' ? 'Cancelled' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {statusFilter === 'All' ? 'No bookings yet' : `No ${statusFilter.toLowerCase()} bookings`}
            </h3>
            <p className="text-gray-600">
              {statusFilter === 'All' 
                ? 'Bookings will appear here once guests start making reservations.'
                : `No bookings with ${statusFilter.toLowerCase()} status found.`
              }
            </p>
          </div>
        )}

        {/* Desktop Table View */}
        {filteredBookings.length > 0 && (
        <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hotel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.user?.fullName || booking.guestName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.user?.email || booking.guestEmail || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.hotel?.name || booking.hotel || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.checkInDate || booking.checkIn).toLocaleDateString()} - 
                        {new Date(booking.checkOutDate || booking.checkOut).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.numberOfGuests || booking.guests || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Rs. {(booking.totalAmount || booking.amount || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{getStatusLabel(booking.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {booking.status === 'upcoming' && (
                          <Button
                            onClick={() => updateBookingStatus(booking.id, 'checked-in')}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Check In
                          </Button>
                        )}
                        {booking.status === 'checked-in' && (
                          <Button
                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Check Out
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => alert(`Calling ${booking.phone}`)}
                        >
                          Contact
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Mobile Card View */}
        {filteredBookings.length > 0 && (
        <div className="lg:hidden space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              {/* Guest Info Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{booking.user?.fullName || booking.guestName || 'N/A'}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {booking.user?.email || booking.guestEmail || 'N/A'}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  <span className="ml-1">{getStatusLabel(booking.status)}</span>
                </span>
              </div>

              {/* Hotel Info */}
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="font-medium">{booking.hotel?.name || booking.hotel || 'N/A'}</span>
                </div>
              </div>

              {/* Booking Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Check-in</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(booking.checkInDate || booking.checkIn).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Check-out</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(booking.checkOutDate || booking.checkOut).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Guests</p>
                  <p className="text-sm font-medium text-gray-900">{booking.numberOfGuests || booking.guests || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Amount</p>
                  <p className="text-sm font-medium text-gray-900">
                    Rs. {(booking.totalAmount || booking.amount || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
                {booking.status === 'upcoming' && (
                  <Button
                    onClick={() => updateBookingStatus(booking.id, 'checked-in')}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Check In
                  </Button>
                )}
                {booking.status === 'checked-in' && (
                  <Button
                    onClick={() => updateBookingStatus(booking.id, 'completed')}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Check Out
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert(`Calling ${booking.user?.phone || booking.phone || 'No phone available'}`)}
                  className="flex-1"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;