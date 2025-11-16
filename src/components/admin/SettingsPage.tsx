import { useState } from 'react';
import { User, Bell, Shield, Globe, Save, Edit, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';

export function SettingsPage() {
  const { admin } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: admin?.full_name || '',
    email: admin?.email || '',
    phone: admin?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [notifications, setNotifications] = useState({
    email_new_leads: true,
    email_lead_updates: true,
    email_maintenance_reminders: true,
    email_weekly_reports: true,
    push_new_leads: false,
    push_urgent_leads: true,
  });
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleProfileSave = () => {
    // TODO: Implement profile update API call
    console.log('Saving profile:', profileData);
    setEditingProfile(false);
  };

  const handlePasswordSave = () => {
    // TODO: Implement password change API call
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('New passwords do not match!');
      return;
    }
    console.log('Changing password');
    setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    setEditingPassword(false);
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    // TODO: Implement notification preferences API call
    console.log('Updating notification:', key);
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    // TODO: Implement language change
    console.log('Changing language to:', lang);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-gold font-bold">
                  {admin?.full_name?.charAt(0) || admin?.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-navy">{admin?.full_name}</h3>
              <p className="text-gray-600">{admin?.email}</p>
              <p className="text-sm text-gold mt-2 capitalize">{admin?.role?.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-navy mb-4">Account Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle size={16} className="text-green-500" />
                <span>Account Active</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={16} className="text-gray-400" />
                <span>Last login: {admin?.last_login_at ? new Date(admin.last_login_at).toLocaleString() : 'Never'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-navy flex items-center gap-2">
                <User size={20} />
                Profile Settings
              </h2>
              {!editingProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProfile(true)}
                >
                  <Edit size={16} className="mr-2" />
                  Edit
                </Button>
              )}
            </div>

            {editingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+60 12 345 6789"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleProfileSave} className="flex-1">
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingProfile(false);
                      setProfileData({
                        full_name: admin?.full_name || '',
                        email: admin?.email || '',
                        phone: admin?.phone || '',
                      });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Full Name:</span>
                  <span className="font-medium text-navy">{admin?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-navy">{admin?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium text-navy">{admin?.phone || 'Not set'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Password Change */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-navy flex items-center gap-2">
                <Shield size={20} />
                Change Password
              </h2>
              {!editingPassword && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingPassword(true)}
                >
                  <Edit size={16} className="mr-2" />
                  Change
                </Button>
              )}
            </div>

            {editingPassword ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={handlePasswordSave} className="flex-1">
                    <Save size={16} className="mr-2" />
                    Update Password
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingPassword(false);
                      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Click "Change" to update your password</p>
            )}
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <Bell size={20} />
              Notification Preferences
            </h2>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Email Notifications</h3>
                <div className="space-y-3">
                  {[
                    { key: 'email_new_leads', label: 'New lead submissions' },
                    { key: 'email_lead_updates', label: 'Lead status updates' },
                    { key: 'email_maintenance_reminders', label: 'Maintenance reminders' },
                    { key: 'email_weekly_reports', label: 'Weekly reports' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-600">{label}</span>
                      <button
                        onClick={() => handleNotificationToggle(key as keyof typeof notifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications[key as keyof typeof notifications] ? 'bg-navy' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Push Notifications</h3>
                <div className="space-y-3">
                  {[
                    { key: 'push_new_leads', label: 'New lead submissions' },
                    { key: 'push_urgent_leads', label: 'Urgent/high priority leads' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-600">{label}</span>
                      <button
                        onClick={() => handleNotificationToggle(key as keyof typeof notifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications[key as keyof typeof notifications] ? 'bg-navy' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Language & Region */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <Globe size={20} />
              Language & Region
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                >
                  <option value="en">English</option>
                  <option value="ms">Bahasa Malaysia</option>
                  <option value="zh">中文 (Chinese)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                  defaultValue="Asia/Kuala_Lumpur"
                >
                  <option value="Asia/Kuala_Lumpur">Kuala Lumpur (GMT+8)</option>
                  <option value="Asia/Singapore">Singapore (GMT+8)</option>
                  <option value="UTC">UTC (GMT+0)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
