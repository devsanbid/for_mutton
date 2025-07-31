import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building, 
  Calendar, 
  MessageSquare, 
  Star, 
  BarChart3, 
  Hotel, 
  CreditCard,
  Bell,
  X
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');

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
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/hoteler/dashboard' },
    { id: 'rooms', label: 'Rooms', icon: Building, path: '/hoteler/rooms' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/hoteler/bookings' },
    // { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/hoteler/messages' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/hoteler/notifications' },
    { id: 'reviews', label: 'Reviews', icon: Star, path: '/hoteler/reviews' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/hoteler/analytics' },
    { id: 'hotel-profile', label: 'Hotel Profile', icon: Hotel, path: '/hoteler/hotel-profile' },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/hoteler/payments' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex h-full flex-col" style={{ backgroundColor: '#2F5249' }}>
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 h-16">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">HevenStay</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (location.pathname === '/' && item.path === '/dashboard');
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User profile */}
          <div className="px-6 py-4 border-t border-gray-600">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <Hotel className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-gray-300">Hotelier</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;