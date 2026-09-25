import React, { useState } from 'react';
import { 
  Calendar, 
  Bell, 
  Settings, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  Layers, 
  ShieldCheck, 
  UserCheck, 
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { useBookingContext } from '../context/BookingContext';
import { STEVAN_CALENDAR_EMAIL, STEVAN_DOMAIN } from '../utils/calendar';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    clientType,
    setClientType,
    setIsIntakeModalOpen,
    intakes,
    isAdminMode, 
    setIsAdminMode, 
    bookings, 
    notifications, 
    pushPermission, 
    requestPushPermission,
    markNotificationRead,
    clearNotifications
  } = useBookingContext();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const activeBookingsCount = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length;
  const pendingIntakesCount = intakes.filter(i => i.status === 'new').length;

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E7E0D5]">
      {/* Top micro-banner */}
      <div className="bg-[#2C2825] text-[#ECE6DD] px-4 py-1.5 text-xs flex justify-between items-center tracking-wide">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium">Memphis & Mid-South On-Site Booking</span>
          <span className="text-stone-400 hidden sm:inline">•</span>
          <span className="text-stone-400 hidden sm:inline">Home Revival by Stevan Collins Lazich</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-stone-300">
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Calendar Sync:</span>
            <span className="font-mono text-amber-200">{STEVAN_DOMAIN}</span>
          </div>
          <a 
            href="https://stevancollinslazich.com" 
            className="text-stone-300 hover:text-white hover:underline text-[11px] font-medium transition-colors"
          >
            ← Return to Website
          </a>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand & Identity */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setActiveTab('services')}
              className="text-left group cursor-pointer"
            >
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#2C2825] font-editorial group-hover:text-[#B25E29] transition-colors">
                STEVAN COLLINS LAZICH
              </div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#8C827A] font-medium">
                Home Revival by Stevan Collins Lazich
              </div>
            </button>
          </div>

          {/* Navigation Links with Client Choice */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#F0EBE1] p-1.5 rounded-full border border-[#DFD7CA]">
            {/* Primary New Client CTA */}
            <button
              onClick={() => {
                setClientType('new');
                setIsIntakeModalOpen(true);
              }}
              className="px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all bg-[#B25E29] hover:bg-[#C96B30] text-white shadow-sm flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>New Clients: Start Here</span>
            </button>

            {/* Returning Clients Menu Toggle */}
            <button
              onClick={() => {
                setClientType('returning');
                setActiveTab('services');
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'services' && clientType === 'returning'
                  ? 'bg-[#2C2825] text-white shadow-sm'
                  : 'text-[#5C554E] hover:text-[#2C2825] hover:bg-[#E6DECFA0]'
              }`}
            >
              Returning Clients: Service Menu
            </button>

            {/* Only shown when Stevan has entered PIN 0874 */}
            {isAdminMode && (
              <>
                <button
                  onClick={() => setActiveTab('my-bookings')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all relative ${
                    activeTab === 'my-bookings'
                      ? 'bg-[#2C2825] text-white shadow-sm'
                      : 'text-[#5C554E] hover:text-[#2C2825] hover:bg-[#E6DECFA0]'
                  }`}
                >
                  Bookings Manager
                </button>
                <button
                  onClick={() => setActiveTab('calendar-hub')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    activeTab === 'calendar-hub'
                      ? 'bg-[#2C2825] text-white shadow-sm'
                      : 'text-[#5C554E] hover:text-[#2C2825] hover:bg-[#E6DECFA0]'
                  }`}
                >
                  Calendar Hub
                </button>
                <button
                  onClick={() => setActiveTab('admin-dashboard')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all relative ${
                    activeTab === 'admin-dashboard'
                      ? 'bg-[#8F3B16] text-white shadow-sm'
                      : 'text-[#8F3B16] hover:bg-[#E6DECFA0]'
                  }`}
                >
                  Studio Admin
                </button>
              </>
            )}
          </nav>

          {/* Right Action Icons: Notifications, Push Status */}
          <div className="flex items-center space-x-3">
            {/* Push notification banner button */}
            {pushPermission !== 'granted' ? (
              <button
                onClick={requestPushPermission}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors"
                title="Enable browser push notifications for upcoming service reminders"
              >
                <Bell className="w-3.5 h-3.5 text-amber-700 animate-bounce" />
                <span>Enable Reminders</span>
              </button>
            ) : (
              <div className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-medium">Push Reminders Active</span>
              </div>
            )}

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-full text-[#5C554E] hover:text-[#2C2825] hover:bg-[#EFEAE0] transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B25E29] text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E7E0D5] p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                    <div className="font-semibold text-sm text-[#2C2825] flex items-center space-x-2">
                      <span>Service Reminders & Activity</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] rounded bg-amber-100 text-amber-800 font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-xs text-[#8C827A] hover:text-[#2C2825]"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[#F5F2EA] py-1">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-[#8C827A]">
                        No notifications yet. Upcoming appointment reminders and price changes will appear here.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                            !n.read ? 'bg-[#FBF8F2]' : 'hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-semibold text-[#2C2825]">{n.title}</h4>
                            <span className="text-[10px] text-[#A2988F]">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-[#5C554E] mt-1 leading-relaxed">{n.body}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#F0EBE1] flex justify-between items-center text-xs">
                    <span className="text-[11px] text-[#8C827A]">Synced with stevancollinslazich.com</span>
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        setActiveTab('calendar-hub');
                      }}
                      className="text-[#B25E29] hover:underline font-medium text-xs flex items-center"
                    >
                      Calendar details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-[#E7E0D5] text-xs">
          <button
            onClick={() => {
              setClientType('new');
              setIsIntakeModalOpen(true);
            }}
            className="font-bold py-1.5 px-4 rounded-full bg-[#B25E29] text-white flex items-center space-x-1 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>New Clients: Start Here</span>
          </button>
          <button
            onClick={() => {
              setClientType('returning');
              setActiveTab('services');
            }}
            className={`font-semibold py-1.5 px-3 rounded-full ${
              activeTab === 'services' ? 'bg-[#2C2825] text-white' : 'text-[#5C554E]'
            }`}
          >
            Service Menu
          </button>
          {isAdminMode && (
            <button
              onClick={() => setActiveTab('admin-dashboard')}
              className={`font-semibold py-1.5 px-3 rounded-full ${
                activeTab === 'admin-dashboard' ? 'bg-[#8F3B16] text-white' : 'text-[#8F3B16]'
              }`}
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
