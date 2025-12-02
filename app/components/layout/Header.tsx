'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Menu, LogOut, User, Bell } from 'lucide-react';
import { notificationsAPI } from '@/lib/api';
import { NetworkStatusIndicator } from './NetworkStatus';
// import Button from '@/app/components/ui/Button';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationsAPI.getAll();
        const data = res.data?.notifications ?? res.data ?? [];
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Mobile Menu Button */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        {/* Page Title */}
        <div className="flex-1 lg:ml-0">
          <h2 className="text-xl font-semibold text-gray-900">
            Welcome back, {user?.full_name || user?.username}!
          </h2>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <NetworkStatusIndicator />
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 relative cursor-pointer"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotificationsMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium text-sm text-gray-900">Notifications</p>
                </div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-4 text-sm text-gray-500">No notifications</div>
                ) : (
                  notifications.map((notification: any) => (
                    <div key={notification.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50">
                      <p className="text-sm text-gray-900">{notification.message || notification.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.created_at || notification.createdAt || Date.now()).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer" 
            >
              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium text-sm text-gray-900">{user?.full_name || user?.username}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}