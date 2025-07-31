import React, { useState, useEffect } from 'react';
import { User, Building, Hotel, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { getRecentActivities } from '../../../services/adminApi';

const AdminRecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping
  const iconMap = {
    User,
    Building,
    Hotel,
    AlertTriangle,
    CheckCircle,
    Calendar
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getRecentActivities(10);
        setActivities(response.data || []);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load recent activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRecentActivities(10);
      setActivities(response.data || []);
    } catch (err) {
      console.error('Error refreshing activities:', err);
      setError('Failed to refresh activities');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start space-x-3 animate-pulse">
              <div className="p-2 rounded-full bg-gray-200 w-8 h-8"></div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500">{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button 
          onClick={handleRefresh}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No recent activities found</p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = iconMap[activity.icon] || User;
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  {iconMap[activity.icon] && React.createElement(iconMap[activity.icon], {
                    className: "h-5 w-5 text-blue-600"
                  })}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.relativeTime}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminRecentActivity;