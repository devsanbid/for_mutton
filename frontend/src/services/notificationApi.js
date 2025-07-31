import api from './api';

const notificationApi = {
  getUserNotifications: async (page = 1, limit = 20, isRead) => {
    try {
      const params = { page, limit };
      if (isRead !== undefined) {
        params.isRead = isRead;
      }
      const response = await api.get('/notifications', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getNotificationStats: async () => {
    try {
      const response = await api.get('/notifications/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default notificationApi;