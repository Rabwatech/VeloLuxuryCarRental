import { Settings, User, Bell, Shield, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function SettingsPage() {
  const { admin } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
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
        </div>

        {/* Settings Options */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <User size={20} />
              Profile Settings
            </h2>
            <p className="text-gray-600 text-sm">Coming soon: Update your personal information and password</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <Bell size={20} />
              Notification Preferences
            </h2>
            <p className="text-gray-600 text-sm">Coming soon: Configure email and push notifications</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <Shield size={20} />
              Security
            </h2>
            <p className="text-gray-600 text-sm">Coming soon: Two-factor authentication and security settings</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <Globe size={20} />
              Language & Region
            </h2>
            <p className="text-gray-600 text-sm">Coming soon: Change language and regional settings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
