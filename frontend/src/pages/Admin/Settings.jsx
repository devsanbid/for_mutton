import React, { useState, useEffect } from 'react';
import { Save, Globe, User, Shield, Bell, Key, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import AdminButton from '../../components/Admin/AdminCommon/AdminButton';
import { 
  getSystemSettings, 
  updateSystemSettings, 
  updateAdminProfile, 
  changeAdminPassword,
  getNotificationSettings,
  updateNotificationSettings
} from '../../services/adminApi';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      platformName: '',
      platformDescription: '',
      supportEmail: '',
      contactPhone: '',
      timezone: 'Asia/Kathmandu',
      currency: 'NPR',
      language: 'English'
    }
  });
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin',
    avatar: '',
    bio: '',
    location: '',
    joinedDate: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    securityAlerts: true
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [settingsData, profileData, notificationData] = await Promise.all([
        getSystemSettings().catch(() => ({})),
        api.auth.getProfile().then(res => res.user).catch(() => ({})),
        getNotificationSettings().catch(() => ({}))
      ]);
      
      setSettings({
        general: {
          platformName: settingsData.platformName || 'HeavenStay',
          platformDescription: settingsData.platformDescription || 'Your trusted hotel booking platform',
          supportEmail: settingsData.supportEmail || 'support@heavenstay.com',
          contactPhone: settingsData.contactPhone || '+977-1-4444444',
          timezone: settingsData.timezone || 'Asia/Kathmandu',
          currency: settingsData.currency || 'NPR',
          language: settingsData.language || 'English'
        }
      });
      
      setProfile({
        name: profileData.name || 'Admin User',
        email: profileData.email || 'admin@heavenstay.com',
        phone: profileData.phone || '+977-1-4444444',
        role: profileData.role || 'admin',
        avatar: profileData.avatar || '',
        bio: profileData.bio || '',
        location: profileData.location || 'Kathmandu, Nepal',
        joinedDate: profileData.createdAt || new Date().toISOString()
      });
      
      setNotificationSettings({
        emailNotifications: notificationData.emailNotifications ?? true,
        pushNotifications: notificationData.pushNotifications ?? true,
        smsNotifications: notificationData.smsNotifications ?? false,
        weeklyReports: notificationData.weeklyReports ?? true,
        securityAlerts: notificationData.securityAlerts ?? true
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'general', label: 'General', icon: Globe }
  ];

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.auth.updateProfile({
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        location: profile.location
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setSaving(true);
    try {
      await changeAdminPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await updateNotificationSettings(notificationSettings);
      toast.success('Notification settings saved successfully!');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateSystemSettings(settings.general);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const getSaveHandler = () => {
    switch (activeTab) {
      case 'profile':
        return handleSaveProfile;
      case 'security':
        return handleChangePassword;
      case 'notifications':
        return handleSaveNotifications;
      case 'general':
        return handleSaveSettings;
      default:
        return handleSaveSettings;
    }
  };

  const getSaveButtonText = () => {
    if (saving) return 'Saving...';
    switch (activeTab) {
      case 'profile':
        return 'Update Profile';
      case 'security':
        return 'Change Password';
      case 'notifications':
        return 'Save Preferences';
      case 'general':
        return 'Save Settings';
      default:
        return 'Save Changes';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
          <p className="text-gray-600">Manage your profile, security, and system preferences</p>
        </div>
        <AdminButton
          onClick={getSaveHandler()}
          disabled={saving || loading || (activeTab === 'security' && (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword))}
          style={{ backgroundColor: '#437057' }}
          className="hover:opacity-90 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {getSaveButtonText()}
        </AdminButton>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Profile Avatar Section */}
                    <div className="flex items-center space-x-6">
                      <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
                        ) : (
                          <User className="h-10 w-10 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{profile.name}</h4>
                        <p className="text-sm text-gray-500">{profile.role}</p>
                        <p className="text-xs text-gray-400">Joined {new Date(profile.joinedDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="h-4 w-4 inline mr-1" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                          disabled={saving}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail className="h-4 w-4 inline mr-1" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="h-4 w-4 inline mr-1" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => handleProfileChange('phone', e.target.value)}
                          disabled={saving}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          Location
                        </label>
                        <input
                          type="text"
                          value={profile.location}
                          onChange={(e) => handleProfileChange('location', e.target.value)}
                          disabled={saving}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                        disabled={saving}
                        rows="3"
                        placeholder="Tell us about yourself..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <Shield className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Password Security</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Key className="h-4 w-4 inline mr-1" />
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      disabled={saving}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Key className="h-4 w-4 inline mr-1" />
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      disabled={saving}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Key className="h-4 w-4 inline mr-1" />
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      disabled={saving}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.pushNotifications}
                        onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsNotifications}
                        onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Weekly Reports</h4>
                      <p className="text-sm text-gray-500">Receive weekly analytics reports</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.weeklyReports}
                        onChange={(e) => handleNotificationChange('weeklyReports', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Security Alerts</h4>
                      <p className="text-sm text-gray-500">Receive alerts for security events</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.securityAlerts}
                        onChange={(e) => handleNotificationChange('securityAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                        <input
                          type="text"
                          value={settings.general.platformName}
                          onChange={(e) => handleSettingChange('general', 'platformName', e.target.value)}
                          disabled={saving}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                        <input
                          type="email"
                          value={settings.general.supportEmail}
                          onChange={(e) => handleSettingChange('general', 'supportEmail', e.target.value)}
                          disabled={saving}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                        <input
                          type="tel"
                          value={settings.general.contactPhone}
                          onChange={(e) => handleSettingChange('general', 'contactPhone', e.target.value)}
                          disabled={saving}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                        <select
                          value={settings.general.timezone}
                          onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                          disabled={saving}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        >
                          <option value="Asia/Kathmandu">Asia/Kathmandu</option>
                          <option value="UTC">UTC</option>
                          <option value="Asia/Kolkata">Asia/Kolkata</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select
                          value={settings.general.currency}
                          onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                          disabled={saving}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        >
                          <option value="NPR">NPR (Nepalese Rupee)</option>
                          <option value="USD">USD (US Dollar)</option>
                          <option value="INR">INR (Indian Rupee)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
                        <select
                          value={settings.general.language}
                          onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                          disabled={saving}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        >
                          <option value="English">English</option>
                          <option value="Nepali">Nepali</option>
                          <option value="Hindi">Hindi</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform Description</label>
                      <textarea
                        value={settings.general.platformDescription}
                        onChange={(e) => handleSettingChange('general', 'platformDescription', e.target.value)}
                        disabled={saving}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
