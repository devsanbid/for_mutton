import React, { useState } from 'react';
import { Send, Users, Building, Bell, Calendar, Plus, Edit, Trash2, Eye } from 'lucide-react';
import AdminButton from '../../components/Admin/AdminCommon/AdminButton';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'System Maintenance Scheduled',
      message: 'The platform will undergo scheduled maintenance on January 25th from 2:00 AM to 4:00 AM. Please plan accordingly.',
      type: 'System',
      audience: 'All Users',
      status: 'Sent',
      sentDate: '2024-01-20',
      recipients: 14081
    },
    {
      id: 2,
      title: 'New Feature: Advanced Analytics',
      message: 'We\'ve introduced new analytics features to help you better understand your business performance.',
      type: 'Feature',
      audience: 'Hoteliers',
      status: 'Sent',
      sentDate: '2024-01-18',
      recipients: 1234
    },
    {
      id: 3,
      title: 'Policy Update: Cancellation Terms',
      message: 'Important updates to our cancellation policy. Please review the new terms and conditions.',
      type: 'Policy',
      audience: 'All Users',
      status: 'Draft',
      sentDate: null,
      recipients: 0
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'General',
    audience: 'All Users',
    scheduleDate: '',
    priority: 'Normal'
  });

  const handleCreateNotification = () => {
    setEditingNotification(null);
    setFormData({
      title: '',
      message: '',
      type: 'General',
      audience: 'All Users',
      scheduleDate: '',
      priority: 'Normal'
    });
    setShowCreateForm(true);
  };

  const handleEditNotification = (notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      audience: notification.audience,
      scheduleDate: '',
      priority: 'Normal'
    });
    setShowCreateForm(true);
  };

  const handleSaveNotification = () => {
    const recipientCount = formData.audience === 'All Users' ? 14081 : 
                          formData.audience === 'Hoteliers' ? 1234 : 12847;
    
    if (editingNotification) {
      setNotifications(notifications.map(notif => 
        notif.id === editingNotification.id 
          ? { ...notif, ...formData, recipients: recipientCount }
          : notif
      ));
    } else {
      const newNotification = {
        id: Date.now(),
        ...formData,
        status: 'Draft',
        sentDate: null,
        recipients: recipientCount
      };
      setNotifications([newNotification, ...notifications]);
    }
    
    setShowCreateForm(false);
    setEditingNotification(null);
  };

  const handleSendNotification = (id) => {
    if (window.confirm('Are you sure you want to send this notification?')) {
      setNotifications(notifications.map(notif => 
        notif.id === id 
          ? { ...notif, status: 'Sent', sentDate: new Date().toISOString().split('T')[0] }
          : notif
      ));
      alert('Notification sent successfully!');
    }
  };

  const handleDeleteNotification = (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(notif => notif.id !== id));
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'System':
        return 'bg-red-100 text-red-800';
      case 'Feature':
        return 'bg-blue-100 text-blue-800';
      case 'Policy':
        return 'bg-yellow-100 text-yellow-800';
      case 'General':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sent':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications & Announcements</h2>
          <p className="text-gray-600">Send notifications and announcements to users and hoteliers</p>
        </div>
        <Button
          onClick={handleCreateNotification}
          style={{ backgroundColor: '#437057' }}
          className="hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Notification
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">14,081</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">1,234</div>
              <div className="text-sm text-gray-600">Active Hoteliers</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{notifications.filter(n => n.status === 'Sent').length}</div>
              <div className="text-sm text-gray-600">Sent This Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Notification Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingNotification ? 'Edit Notification' : 'Create New Notification'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter notification title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="General">General</option>
                <option value="System">System</option>
                <option value="Feature">Feature</option>
                <option value="Policy">Policy</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
              <select
                value={formData.audience}
                onChange={(e) => setFormData({...formData, audience: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Users">All Users</option>
                <option value="Users">Users Only</option>
                <option value="Hoteliers">Hoteliers Only</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your notification message"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => setShowCreateForm(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNotification}
              style={{ backgroundColor: '#437057' }}
              className="hover:opacity-90"
            >
              {editingNotification ? 'Update' : 'Save as Draft'}
            </Button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Audience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                      <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">{notification.message}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                      {notification.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {notification.audience}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {notification.recipients.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(notification.status)}`}>
                      {notification.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {notification.sentDate ? new Date(notification.sentDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => alert('View notification details')}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditNotification(notification)}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {notification.status === 'Draft' && (
                        <button
                          onClick={() => handleSendNotification(notification.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Notifications;