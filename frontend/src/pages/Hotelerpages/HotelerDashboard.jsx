import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Calendar, Building, MessageSquare, Star, BarChart3 } from 'lucide-react';
import StatCard from '../../components/Hoteler/common/StatCard';
import QuickActions from '../../components/Hoteler/common/QuickActions';
import RecentBookings from '../../components/Hoteler/common/RecentBookings';
import OccupancyChart from '../../components/Hoteler/common/OccupancyChart';
import { bookingsAPI, hotelsAPI } from '../../services/api';
import Loading from '../../components/common/Loading';

const HotelerDashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserName(user.fullName || user.name || 'User');
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUserName('User');
      }
    }
    
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch hotels and bookings data
      const [hotelsResponse, bookingsResponse] = await Promise.all([
        hotelsAPI.getHotelerHotels(),
        bookingsAPI.getHotelierBookings()
      ]);
      
      const hotelsData = hotelsResponse.hotels || [];
      const bookingsData = bookingsResponse.bookings || [];
      
      setHotels(hotelsData);
      setBookings(bookingsData);
      
      // Calculate statistics
      const activeBookings = bookingsData.filter(booking => 
        booking.status === 'confirmed' || booking.status === 'checked-in'
      ).length;
      
      const totalRevenue = bookingsData
        .filter(booking => booking.status === 'completed')
        .reduce((sum, booking) => sum + (parseFloat(booking.total) || 0), 0);
      
      console.log('📊 [Dashboard] Bookings data:', bookingsData);
      console.log('📊 [Dashboard] Completed bookings:', bookingsData.filter(booking => booking.status === 'completed'));
      console.log('📊 [Dashboard] Total revenue calculated:', totalRevenue);
      
      const totalRooms = hotelsData.reduce((sum, hotel) => sum + (hotel.rooms?.length || 0), 0);
      const occupiedRooms = bookingsData.filter(booking => 
        booking.status === 'checked-in'
      ).length;
      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
      
      const averageRating = hotelsData.length > 0 
        ? (hotelsData.reduce((sum, hotel) => sum + (hotel.rating || 0), 0) / hotelsData.length).toFixed(1)
        : '0.0';
      
      setStats([
        {
          title: 'Total Revenue',
          value: `$${totalRevenue.toLocaleString()}`,
          change: '+12.5%',
          icon: DollarSign,
          color: '#97B067'
        },
        {
          title: 'Active Bookings',
          value: activeBookings.toString(),
          change: '+8.2%',
          icon: Calendar,
          color: '#437057'
        },
        {
          title: 'Occupancy Rate',
          value: `${occupancyRate}%`,
          change: '+5.1%',
          icon: Users,
          color: '#2F5249'
        },
        {
          title: 'Average Rating',
          value: averageRating,
          change: '+0.2',
          icon: Star,
          color: '#97B067'
        }
      ]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default stats on error
      setStats([
        {
          title: 'Total Revenue',
          value: '$0',
          change: '0%',
          icon: DollarSign,
          color: '#97B067'
        },
        {
          title: 'Active Bookings',
          value: '0',
          change: '0%',
          icon: Calendar,
          color: '#437057'
        },
        {
          title: 'Occupancy Rate',
          value: '0%',
          change: '0%',
          icon: Users,
          color: '#2F5249'
        },
        {
          title: 'Average Rating',
          value: '0.0',
          change: '0',
          icon: Star,
          color: '#97B067'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {userName}!</h2>
        <p className="text-gray-600">Here's what's happening with your hotels today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupancy Overview</h3>
          <OccupancyChart />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          <RecentBookings />
        </div>
      </div>

      {/* Quick Actions */}
      {/* <QuickActions /> */}
    </div>
  );
};

export default HotelerDashboard;