import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Calendar, Mountain, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const Header = ({ user: propUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setUserLoading(true);
      
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      console.log('Header - userData from localStorage:', userData);
      console.log('Header - token from localStorage:', token);
      
      if (userData && token) {
        const parsedUser = JSON.parse(userData);
        console.log('Header - Using localStorage user:', parsedUser);
        setCurrentUser(parsedUser);
        return;
      }
      
      console.log('Header - No localStorage data, trying API');
      const response = await authAPI.getProfile();
      console.log('Header - API response:', response);
      setCurrentUser(response.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to prop user or localStorage if API fails
      if (propUser) {
        setCurrentUser(propUser);
      } else {
        const userData = localStorage.getItem('user');
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }
      }
    } finally {
      setUserLoading(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };
  const defaultUser = {
    name: 'Guest User',
    email: 'guest@example.com',
    phone: 'N/A',
    avatar: '/default-avatar.png', // Add a real default image if needed
  };

  // Use currentUser if available, otherwise fallback to defaultUser
  const displayUser = currentUser || defaultUser;

  return (
    <header className="bg-[#2F5249] text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Mountain className="h-8 w-8 text-[#97B067]" />
            <span className="text-xl font-bold">HeavenStay</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/users/hotel-listing" className="hover:text-[#97B067] transition-colors">Hotels</Link>
            <Link to="/users/mybookings" className="hover:text-[#97B067] transition-colors">MyBookings</Link>
            <Link to="/users/profile" className="hover:text-[#97B067] transition-colors">Profile</Link>
          </nav>

          {/* User Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-3 hover:bg-[#437057] rounded-lg p-2 transition-colors"
              >
                <img 
                  src={displayUser.avatar} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border-2 border-[#97B067]"
                />
                <span className="text-sm">
                  {userLoading ? 'Loading...' : displayUser.name}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={displayUser.avatar} 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full border-2 border-[#97B067]"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {userLoading ? 'Loading...' : displayUser.name}
                        </h3>
                        <p className="text-sm text-gray-600">{displayUser.email}</p>
                        <p className="text-xs text-gray-500">{displayUser.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    {/* <button
                      onClick={() => handleNavigation('/profile')}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <User size={16} />
                      <span>View Profile</span>
                    </button> */}
                    <button
  onClick={() => handleNavigation('/users/change-password')}
  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
>
  <User size={16} />
  <span>Change Password</span>
</button>

                    <button
                      onClick={() => handleNavigation('/users/mybookings')}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <Calendar size={16} />
                      <span>My Bookings</span>
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-[#437057] transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#437057] bg-[#2F5249] absolute left-0 right-0 top-16 z-50 shadow-lg">
            <nav className="flex flex-col space-y-2 p-4">
              <button 
                onClick={() => handleNavigation('/')}
                className="text-left p-2 hover:bg-[#437057] rounded transition-colors"
              >
                Hotels
              </button>
              <button 
                onClick={() => handleNavigation('/mybookings')}
                className="text-left p-2 hover:bg-[#437057] rounded transition-colors"
              >
                My Bookings
              </button>
              <button 
                onClick={() => handleNavigation('/profile')}
                className="text-left p-2 hover:bg-[#437057] rounded transition-colors"
              >
                Profile
              </button>
              <div className="flex items-center space-x-3 p-2 border-t border-[#437057] mt-2">
                <img 
                  src={displayUser.avatar} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border-2 border-[#97B067]"
                />
                <div>
                  <div className="text-sm font-medium">
                    {userLoading ? 'Loading...' : displayUser.name}
                  </div>
                  <div className="text-xs text-gray-300">{displayUser.email}</div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Overlay for profile dropdown */}
      {isProfileDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
