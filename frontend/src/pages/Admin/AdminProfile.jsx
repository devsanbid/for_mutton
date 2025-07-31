import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Edit, Camera, Shield, Key, Calendar } from 'lucide-react';
import Button from '../../components/Hoteler/common/Button';

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@hevenstay.com',
    phone: '+977-1-4567890',
    address: 'Kathmandu, Nepal',
    role: 'System Administrator',
    department: 'IT Administration',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-20 10:30 AM',
    permissions: [
      'User Management',
      'Hotelier Management', 
      'Hotel Listings',
      'Analytics & Reports',
      'System Settings',
      'Notifications'
    ],
    profileImage: null,
    bio: 'Experienced system administrator responsible for managing the HevenStay platform and ensuring smooth operations.',
    emergencyContact: {
      name: 'Emergency Contact',
      phone: '+977-1-9876543',
      relation: 'Supervisor'
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmergencyContactChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    alert('Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordForm(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData(prev => ({
        ...prev,
        profileImage: imageUrl
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Profile</h2>
          <p className="text-gray-600">Manage your admin account settings and information</p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          style={{ backgroundColor: '#437057' }}
          className="hover:opacity-90"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Profile Image & Basic Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {profileData.profileImage ? (
                <img 
                  src={profileData.profileImage} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <Shield className="h-12 w-12 text-gray-600" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
                <Camera className="h-3 w-3" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{profileData.name}</h3>
            <p className="text-gray-600">{profileData.role}</p>
            <p className="text-sm text-gray-500">{profileData.department}</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Joined: {new Date(profileData.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="text-sm font-medium text-gray-900">{profileData.lastLogin}</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span className="text-gray-900">{profileData.name}</span>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span className="text-gray-900">{profileData.email}</span>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span className="text-gray-900">{profileData.phone}</span>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-gray-400 mr-2" />
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span className="text-gray-900">{profileData.department}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
            {isEditing ? (
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <span className="text-gray-900">{profileData.address}</span>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          {isEditing ? (
            <textarea
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profileData.bio}</p>
          )}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.emergencyContact.name}
                onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.emergencyContact.name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={profileData.emergencyContact.phone}
                onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.emergencyContact.phone}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relation</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.emergencyContact.relation}
                onChange={(e) => handleEmergencyContactChange('relation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.emergencyContact.relation}</p>
            )}
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Permissions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {profileData.permissions.map((permission, index) => (
            <div
              key={index}
              className="flex items-center px-3 py-2 bg-green-50 border border-green-200 rounded-lg"
            >
              <Shield className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-green-800">{permission}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
          <Button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            variant="outline"
            size="sm"
          >
            <Key className="h-4 w-4 mr-2" />
            Change Password
          </Button>
        </div>
        
        {showPasswordForm && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                onClick={() => setShowPasswordForm(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordChange}
                style={{ backgroundColor: '#437057' }}
                className="hover:opacity-90"
                size="sm"
              >
                Update Password
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;