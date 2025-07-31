import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, User, Settings, LogOut, Shield, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getAdminNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '../../../services/adminApi';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';

const AdminHeader = ({ setSidebarOpen, sidebarOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch notifications and user profile on component mount
  useEffect(() => {
    fetchNotifications();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setUserLoading(true);
      
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      console.log('AdminHeader - userData from localStorage:', userData);
      console.log('AdminHeader - token from localStorage:', token);
      
      if (userData && token) {
        const parsedUser = JSON.parse(userData);
        console.log('AdminHeader - Using localStorage user:', parsedUser);
        setCurrentUser(parsedUser);
        return;
      }
      
      console.log('AdminHeader - No localStorage data, trying API');
      const response = await api.auth.getProfile();
      console.log('AdminHeader - API response:', response);
      setCurrentUser(response.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Final fallback to localStorage if API fails
      const userData = localStorage.getItem('user');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    } finally {
      setUserLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getAdminNotifications({ page: 1, limit: 10 });
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find(n => n.id === notificationId);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const handleViewAllNotifications = () => {
    setShowNotifications(false);
    // Navigate to notifications page
    window.location.href = '/admin/notifications';
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    // Navigate to admin profile page
    window.location.href = '/admin/profile';
  };

  const handleLogout = async () => {
    try {
      setShowUserMenu(false);
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 left-0 lg:left-64 z-30 h-16">
      <div className="flex items-center justify-between px-4 lg:px-6 h-full">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="ml-4 lg:ml-0">
            <h1 className="text-xl font-semibold text-gray-900">HevenStay Admin Dashboard</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users, hotels..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{unreadCount} unread</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-sm">Loading notifications...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.slice(0, 4).map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNotification(notification.id);
                              }}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button 
                    onClick={() => navigate('/admin/notifications')}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                {currentUser?.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt="Profile" 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <Shield className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {userLoading ? 'Loading...' : (currentUser?.name || 'Admin')}
              </span>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  <button 
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </button>
                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/admin/change-password');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Change Password
                  </button>
                  <hr className="my-2" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;