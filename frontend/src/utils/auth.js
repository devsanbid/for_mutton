// Token management utilities
export const tokenUtils = {
  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Set token in localStorage
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem('token');
  },

  // Check if token exists
  hasToken: () => {
    return !!localStorage.getItem('token');
  },

  // Decode JWT token (basic decode without verification)
  decodeToken: (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token) => {
    try {
      const decoded = tokenUtils.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  },

  // Get user data from token
  getUserFromToken: (token) => {
    try {
      const decoded = tokenUtils.decodeToken(token);
      return decoded ? {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        isApproved: decoded.isApproved
      } : null;
    } catch (error) {
      return null;
    }
  }
};

// User data management utilities
export const userUtils = {
  // Get user data from localStorage
  getUser: () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Set user data in localStorage
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Remove user data from localStorage
  removeUser: () => {
    localStorage.removeItem('user');
  },

  // Update specific user fields
  updateUser: (updates) => {
    const currentUser = userUtils.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      userUtils.setUser(updatedUser);
      return updatedUser;
    }
    return null;
  }
};

// Role-based utilities
export const roleUtils = {
  // Check if user has specific role
  hasRole: (user, role) => {
    return user && user.role === role;
  },

  // Check if user is admin
  isAdmin: (user) => {
    return roleUtils.hasRole(user, 'admin');
  },

  // Check if user is hotelier
  isHotelier: (user) => {
    return roleUtils.hasRole(user, 'hotelier');
  },

  // Check if user is regular user
  isUser: (user) => {
    return roleUtils.hasRole(user, 'user');
  },

  // Check if user is approved (for hoteliers)
  isApproved: (user) => {
    return user && (user.role === 'admin' || user.role === 'user' || user.isApproved === true);
  },

  // Get dashboard route based on role
  getDashboardRoute: (user) => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'hotelier':
        return user.isApproved ? '/hotelier/dashboard' : '/hotelier/pending';
      case 'user':
        return '/users/dashboard';
      default:
        return '/';
    }
  }
};

// Authentication state utilities
export const authUtils = {
  // Clear all auth data
  clearAuthData: () => {
    tokenUtils.removeToken();
    userUtils.removeUser();
  },

  // Set auth data
  setAuthData: (token, user) => {
    tokenUtils.setToken(token);
    userUtils.setUser(user);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = tokenUtils.getToken();
    return token && !tokenUtils.isTokenExpired(token);
  },

  // Get current authenticated user
  getCurrentUser: () => {
    if (!authUtils.isAuthenticated()) {
      return null;
    }
    return userUtils.getUser();
  },

  // Initialize auth state from localStorage
  initializeAuth: () => {
    const token = tokenUtils.getToken();
    const user = userUtils.getUser();
    
    if (token && !tokenUtils.isTokenExpired(token) && user) {
      return { token, user, isAuthenticated: true };
    } else {
      // Clear invalid data
      authUtils.clearAuthData();
      return { token: null, user: null, isAuthenticated: false };
    }
  }
};

export default {
  token: tokenUtils,
  user: userUtils,
  role: roleUtils,
  auth: authUtils
};