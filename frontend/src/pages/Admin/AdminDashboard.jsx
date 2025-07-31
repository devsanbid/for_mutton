import React, { useState, useEffect } from 'react';
import { Users, Building, Hotel, Calendar, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import AdminStatCard from '../../components/Admin/AdminCommon/AdminStatCard';
import AdminRecentActivity from '../../components/Admin/AdminCommon/AdminRecentActivity';
import QuickActions from '../../components/Admin/AdminCommon/AdminQuickActions';
import AdminQuickActions from '../../components/Admin/AdminCommon/AdminQuickActions';
import { getDashboardStats } from '../../services/adminApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching dashboard stats...');
      const response = await getDashboardStats();
      console.log('Dashboard stats response:', response);
      
      if (!response || !response.stats) {
        throw new Error('Invalid response format from server');
      }
      
      const data = response.stats;
        
        const formattedStats = [
          {
            title: 'Total Users',
            value: data.totalUsers?.toLocaleString() || '0',
            change: '+8.2%',
            icon: Users,
            color: '#97B067'
          },
          {
            title: 'Total Hotels',
            value: data.totalHotels?.toLocaleString() || '0',
            change: '+12.5%',
            icon: Hotel,
            color: '#437057'
          },
          {
            title: 'Total Bookings',
            value: data.totalBookings?.toLocaleString() || '0',
            change: '+18.7%',
            icon: Calendar,
            color: '#2F5249'
          },
          {
            title: 'Platform Revenue',
            value: `Rs. ${(data.totalRevenue / 1000000).toFixed(1)}M` || 'Rs. 0',
            change: '+22.3%',
            icon: DollarSign,
            color: '#97B067'
          },
          {
            title: 'Admin Revenue',
            value: `Rs. ${(data.adminRevenue / 1000000).toFixed(1)}M` || 'Rs. 0',
            change: '+15.8%',
            icon: TrendingUp,
            color: '#437057'
          }
        ];
        
        const formattedPendingActions = [
          {
            title: 'Pending Hotelier Approvals',
            count: data.pendingHoteliers || 0,
            icon: AlertTriangle,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
          },
          {
            title: 'Total Hoteliers',
            count: data.totalHoteliers || 0,
            icon: Building,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
          },
          {
            title: 'Active Hotels',
            count: data.totalHotels || 0,
            icon: Hotel,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
          },
          {
            title: 'Total Users',
            count: data.totalUsers || 0,
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
          }
        ];
        
        setStats(formattedStats);
        setPendingActions(formattedPendingActions);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="space-y-6 w-full border">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h2>
        <p className="text-gray-600">Monitor and manage the HevenStay platform efficiently.</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <AdminStatCard key={index} {...stat} />
          ))}
        </div>
      )}

      {/* Pending Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h3>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Unable to load platform overview</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pendingActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div key={index} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{action.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{action.count}</p>
                    </div>
                    <div className={`p-3 rounded-full ${action.bgColor}`}>
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminRecentActivity />
        <AdminQuickActions />
      </div>
    </div>
  );
};

export default AdminDashboard;