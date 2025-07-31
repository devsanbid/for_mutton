import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create headers
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Authentication API calls
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  // Get current user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  // Update profile with avatar (FormData)
  updateProfileWithAvatar: async (formData) => {
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers,
      body: formData, // FormData for file upload
    });
    return handleResponse(response);
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(passwordData),
    });
    return handleResponse(response);
  },

  // Forgot password (request reset token)
  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  // Reset password (confirm with token)
  resetPassword: async (token, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/confirm-reset-password`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify({ token, newPassword }),
    });
    return handleResponse(response);
  },

  // Logout (if backend has logout endpoint)
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

// Hotels API calls
export const hotelsAPI = {
  // Get all hotels
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/hotels?${queryString}`, {
      method: 'GET',
      headers: createHeaders(false),
    });
    return handleResponse(response);
  },

  // Get hotel by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/hotels/${id}`, {
      method: 'GET',
      headers: createHeaders(false),
    });
    return handleResponse(response);
  },

  // Create hotel (hotelier only)
  create: async (formData) => {
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/hotels`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(response);
  },

  // Update hotel (hotelier only)
  update: async (id, formData) => {
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/hotels/${id}`, {
      method: 'PUT',
      headers,
      body: formData,
    });
    return handleResponse(response);
  },

  // Delete hotel (hotelier only)
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/hotels/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Get hotelier's hotels
  getHotelerHotels: async () => {
    const response = await fetch(`${API_BASE_URL}/hotels/hotelier/my-hotels`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Get hotelier profile
  getHotelerProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/hotels/hotelier/profile`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Update hotelier profile
  updateHotelerProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/hotels/hotelier/profile`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  // Update hotelier profile with avatar (FormData)
  updateHotelerProfileWithAvatar: async (formData) => {
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/hotels/hotelier/profile`, {
      method: 'PUT',
      headers,
      body: formData, // FormData for file upload
    });
    return handleResponse(response);
  },
};

// Bookings API calls
export const bookingsAPI = {
  // Create booking
  create: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
  },

  // Get user's bookings
  getUserBookings: async () => {
    const headers = createHeaders();
    console.log('🚀 Making API call to:', `${API_BASE_URL}/bookings/my-bookings`);
    console.log('📋 Request headers:', headers);
    console.log('🔑 Token from localStorage:', localStorage.getItem('token'));
    
    const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
      method: 'GET',
      headers,
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    return handleResponse(response);
  },

  // Get hotelier's bookings
  getHotelierBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/hotelier-bookings`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Update booking status
  updateStatus: async (id, statusData) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(statusData),
    });
    return handleResponse(response);
  },

  // Cancel booking
  cancel: async (id) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

// Reviews API calls
export const reviewsAPI = {
  // Create review
  create: async (reviewData) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(reviewData),
    });
    return handleResponse(response);
  },

  // Get hotel reviews
  getHotelReviews: async (hotelId) => {
    const response = await fetch(`${API_BASE_URL}/reviews/hotel/${hotelId}`, {
      method: 'GET',
      headers: createHeaders(false),
    });
    return handleResponse(response);
  },

  // Get user's reviews
  getUserReviews: async () => {
    const response = await fetch(`${API_BASE_URL}/reviews/my-reviews`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Get hotelier reviews
  getHotelerReviews: async () => {
    const response = await fetch(`${API_BASE_URL}/reviews/hotelier-reviews`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Reply to review
  reply: async (reviewId, replyData) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(replyData),
    });
    return handleResponse(response);
  },

  // Update review
  update: async (id, reviewData) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(reviewData),
    });
    return handleResponse(response);
  },

  // Delete review
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

// Rooms API calls
export const roomsAPI = {
  // Get hotelier's rooms
  getHotelerRooms: async () => {
    const response = await fetch(`${API_BASE_URL}/hotels/hotelier/my-rooms`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Get rooms by hotel
  getRoomsByHotel: async (hotelId) => {
    const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}/rooms`, {
      method: 'GET',
      headers: createHeaders(false),
    });
    return handleResponse(response);
  },

  // Get room by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/hotels/rooms/${id}`, {
      method: 'GET',
      headers: createHeaders(false),
    });
    return handleResponse(response);
  },

  // Create room
  create: async (hotelId, roomData) => {
    const formData = new FormData();
    
    // Add room data
    Object.keys(roomData).forEach(key => {
      if (key === 'images' && Array.isArray(roomData[key])) {
        roomData[key].forEach(file => {
          formData.append('images', file);
        });
      } else if (key === 'amenities' && Array.isArray(roomData[key])) {
        formData.append(key, JSON.stringify(roomData[key]));
      } else {
        formData.append(key, roomData[key]);
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}/rooms`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Update room
  update: async (id, roomData) => {
    const formData = new FormData();
    
    // Add room data
    Object.keys(roomData).forEach(key => {
      if (key === 'images' && Array.isArray(roomData[key])) {
        roomData[key].forEach(file => {
          formData.append('images', file);
        });
      } else if (key === 'amenities' && Array.isArray(roomData[key])) {
        formData.append(key, JSON.stringify(roomData[key]));
      } else {
        formData.append(key, roomData[key]);
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/hotels/rooms/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Delete room
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/hotels/rooms/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

// Analytics API calls
export const analyticsAPI = {
  // Get hotelier analytics
  getHotelerAnalytics: async (timeRange = '30d') => {
    const response = await fetch(`${API_BASE_URL}/analytics/hotelier?timeRange=${timeRange}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Get revenue analytics
  getRevenueAnalytics: async (timeRange = '30d') => {
    const response = await fetch(`${API_BASE_URL}/analytics/revenue?timeRange=${timeRange}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Get booking analytics
  getBookingAnalytics: async (timeRange = '30d') => {
    const response = await fetch(`${API_BASE_URL}/analytics/bookings?timeRange=${timeRange}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

// Admin API calls
export const adminAPI = {
  // Get all users
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Get all hotels
  getHotels: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/hotels`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Get all bookings
  getBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/bookings`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Approve/reject hotelier
  updateHotelierStatus: async (userId, status) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

// Payments API calls
export const paymentsAPI = {
  // Get hotelier payments
  getHotelerPayments: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/payments/hotelier-payments?${queryParams}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Get payment methods
  getPaymentMethods: async () => {
    const response = await fetch(`${API_BASE_URL}/payments/payment-methods`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },

  // Add payment method
  addPaymentMethod: async (paymentMethodData) => {
    const response = await fetch(`${API_BASE_URL}/payments/payment-methods`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(paymentMethodData),
    });
    return handleResponse(response);
  },

  // Get payment details
  getPaymentDetails: async (paymentId) => {
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

export default {
  auth: authAPI,
  hotels: hotelsAPI,
  bookings: bookingsAPI,
  reviews: reviewsAPI,
  analytics: analyticsAPI,
  admin: adminAPI,
  payments: paymentsAPI,
  // Export axios instance for other services
  get: axiosInstance.get.bind(axiosInstance),
  post: axiosInstance.post.bind(axiosInstance),
  put: axiosInstance.put.bind(axiosInstance),
  delete: axiosInstance.delete.bind(axiosInstance),
  patch: axiosInstance.patch.bind(axiosInstance),
};