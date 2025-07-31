import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
adminApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response interceptor error:', error);
    if (error.response?.status === 401) {
      console.error('Authentication failed - redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard API calls
export const getDashboardStats = async () => {
  try {
    console.log('Making API call to /admin/dashboard/stats');
    const response = await adminApi.get('/admin/dashboard/stats');
    console.log('API response:', response);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    console.error('Error response:', error.response);
    throw error.response?.data || error.message;
  }
};

export const getRecentActivities = async (limit = 10) => {
  try {
    const response = await adminApi.get('/admin/dashboard/activities', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// User Management API calls
export const getAllUsers = async (page = 1, limit = 10, search = '') => {
  try {
    const response = await adminApi.get('/admin/users', {
      params: { page, limit, search }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await adminApi.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await adminApi.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await adminApi.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Hotelier Management API calls
export const getAllHoteliers = async (page = 1, limit = 10, search = '', status = '') => {
  try {
    const response = await adminApi.get('/admin/hoteliers', {
      params: { page, limit, search, status }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getHotelierById = async (hotelierId) => {
  try {
    const response = await adminApi.get(`/admin/hoteliers/${hotelierId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateHotelierStatus = async (hotelierId, status) => {
  try {
    const response = await adminApi.put(`/admin/hoteliers/${hotelierId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};



// Hotel Management API calls
export const getAllHotels = async (page = 1, limit = 10, search = '', status = '') => {
  try {
    const response = await adminApi.get('/admin/hotels', {
      params: { page, limit, search, status }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getHotelById = async (hotelId) => {
  try {
    const response = await adminApi.get(`/admin/hotels/${hotelId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateHotelStatus = async (hotelId, status) => {
  try {
    const response = await adminApi.patch(`/admin/hotels/${hotelId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteHotel = async (hotelId) => {
  try {
    const response = await adminApi.delete(`/admin/hotels/${hotelId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Analytics API calls
export const getAnalyticsData = async (timeRange = '30days') => {
  try {
    const response = await adminApi.get('/admin/analytics', {
      params: { timeRange }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getGeneralAnalytics = async (timeRange = '30days') => {
  try {
    const response = await adminApi.get('/admin/analytics/general', {
      params: { timeRange }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getRevenueAnalytics = async (timeRange = '30days') => {
  try {
    const response = await adminApi.get('/admin/analytics/revenue', {
      params: { timeRange }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserAnalytics = async (timeRange = '30days') => {
  try {
    const response = await adminApi.get('/admin/analytics/users', {
      params: { timeRange }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getBookingAnalytics = async (timeRange = '30days') => {
  try {
    const response = await adminApi.get('/admin/analytics/bookings', {
      params: { timeRange }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Settings API calls
export const getSystemSettings = async () => {
  try {
    const response = await adminApi.get('/admin/settings');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateSystemSettings = async (settings) => {
  try {
    const response = await adminApi.patch('/admin/settings', settings);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getNotificationSettings = async () => {
  try {
    const response = await adminApi.get('/admin/settings/notifications');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateNotificationSettings = async (settings) => {
  try {
    const response = await adminApi.patch('/admin/settings/notifications', settings);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Notification API calls
export const getAdminNotifications = async (page = 1, limit = 20, type = 'all') => {
  try {
    const response = await adminApi.get('/notifications/admin/all', {
      params: { page, limit, type }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await adminApi.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await adminApi.put('/notifications/mark-all-read');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await adminApi.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createNotification = async (notificationData) => {
  try {
    const response = await adminApi.post('/notifications/admin/create', notificationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin Profile API calls
export const getAdminProfile = async () => {
  try {
    const response = await adminApi.get('/admin/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateAdminProfile = async (profileData) => {
  try {
    const response = await adminApi.patch('/admin/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const changeAdminPassword = async (passwordData) => {
  try {
    const response = await adminApi.patch('/admin/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default adminApi;