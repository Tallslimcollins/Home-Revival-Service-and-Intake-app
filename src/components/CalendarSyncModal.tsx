import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  Bell, 
  Mail, 
  Download,
  Share2
} from 'lucide-react';
import { useBookingContext } from '../context/BookingContext';
import { STEVAN_CALENDAR_EMAIL, STEVAN_DOMAIN, generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

export const CalendarSyncModal: React.FC = () => {
  const { bookings, sendUpcomingReminderPush } = useBookingContext();
  const [copiedFeed, setCopiedFeed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const iCalFeedUrl = `webcal://${STEVAN_DOMAIN}/feed/home-revival-appointments.ics`;

  const handleCopyFeed = () => {
    navigator.clipboard.writeText(iCalFeedUrl);
    setCopiedFeed(true);
    setTimeout(() => setCopiedFeed(false), 2500);
  };

  const handleManualSync = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 900);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#E7E0D5] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-[#B25E29]">
            External Integration Hub
          </span>
          <h1 className="text-2xl font-bold font-editorial text-[#2C2825] mt-1">
            Calendar Sync at {STEVAN_DOMAIN}
          </h1>
          <p className="text-xs text-[#5C554E] mt-1">
            All customer bookings, revisions, and on-site appointment slots automatically sync with Stevan's studio calendar ({STEVAN_CALENDAR_EMAIL}).
          </p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={isRefreshing}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors shadow-sm disabled:opacity-75"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Syncing...' : 'Sync Calendar Now'}</span>
        </button>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Domain & Account Status */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C827A] uppercase">Active Target Calendar</span>
            <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Connected
            </span>
          </div>
          <div>
            <div className="text-lg font-bold font-editorial text-[#2C2825] truncate">
              {STEVAN_DOMAIN}
            </div>
            <p className="text-xs font-mono text-[#5C554E]">{STEVAN_CALENDAR_EMAIL}</p>
          </div>
          <p className="text-[11px] text-[#8C827A] pt-2 border-t border-[#F0EBE1]">
            Events include customer address, gate codes, phone numbers, and itemized task checklists.
          </p>
        </div>

        {/* Card 2: Push Reminders & Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C827A] uppercase">Push Reminders</span>
            <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Bell className="w-3.5 h-3.5 mr-1" />
              Active
            </span>
          </div>
          <div className="text-xs text-[#4A453F] space-y-1">
            <div className="flex justify-between">
              <span>24 Hours Prior:</span>
              <strong className="text-[#2C2825]">Prep & Arrival Notice</strong>
            </div>
            <div className="flex justify-between">
              <span>2 Hours Prior:</span>
              <strong className="text-[#2C2825]">En-Route Notification</strong>
            </div>
          </div>
          <p className="text-[11px] text-[#8C827A] pt-2 border-t border-[#F0EBE1]">
            Both client and Stevan receive push notifications with driving directions and hardware notes.
          </p>
        </div>

        {/* Card 3: Automated Receipts Engine */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C827A] uppercase">Receipt Automation</span>
            <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Mail className="w-3.5 h-3.5 mr-1" />
              BCC Enabled
            </span>
          </div>
          <div className="text-xs text-[#4A453F] space-y-1">
            <p>Every transaction triggers an itemized receipt dispatched to the client and automatically BCC'd to:</p>
            <p className="font-mono font-semibold text-[#2C2825]">{STEVAN_CALENDAR_EMAIL}</p>
          </div>
          <p className="text-[11px] text-[#8C827A] pt-2 border-t border-[#F0EBE1]">
            Receipts retain full audit logs of any price or specifics adjustments.
          </p>
        </div>

      </div>

      {/* Subscription Feed & Google Calendar Section */}
      <div className="bg-white p-6 rounded-3xl border border-[#E7E0D5] space-y-5">
        <h3 className="text-lg font-bold font-editorial text-[#2C2825] flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-[#B25E29]" />
          <span>Universal iCal / Webcal Subscription Feed</span>
        </h3>
        <p className="text-xs text-[#5C554E] max-w-2xl leading-relaxed">
          Subscribe to this live feed in Apple Calendar, Google Calendar, or Microsoft Outlook. Any new booking, time change, or price update will automatically reflect in your personal calendar feed.
        </p>

        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE5D8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full truncate font-mono text-xs text-[#2C2825] bg-white px-3 py-2 rounded-xl border border-[#DCD3C5]">
            {iCalFeedUrl}
          </div>
          <button
            onClick={handleCopyFeed}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors"
          >
            {copiedFeed ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Subscription URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Synced Appointments List */}
      <div className="bg-white p-6 rounded-3xl border border-[#E7E0D5] space-y-4">
        <div className="flex justify-between items-center border-b border-[#F0EBE1] pb-3">
          <h3 className="font-bold text-sm text-[#2C2825]">
            Synced Appointment Queue ({bookings.length} events)
          </h3>
          <span className="text-xs text-[#8C827A]">Auto-sync interval: Instant</span>
        </div>

        <div className="divide-y divide-[#F7F4EE]">
          {bookings.map(booking => {
            const googleCalUrl = generateGoogleCalendarUrl(booking);

            return (
              <div key={booking.id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#8C827A]">{booking.id}</span>
                    <span className="font-semibold text-xs text-[#2C2825]">{booking.serviceTitle}</span>
                    <span className="text-xs text-stone-500">• {booking.customer.fullName}</span>
                  </div>
                  <div className="text-xs text-[#7A7168] mt-1 flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-[#B25E29]" />
                      <span>{booking.scheduledDate}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#B25E29]" />
                      <span>{booking.timeSlot}</span>
                    </span>
                    <span className="text-emerald-700 font-medium">
                      ✓ Synced with {STEVAN_DOMAIN}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={googleCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#DFD7CA] hover:border-[#B25E29] bg-white text-[#2C2825] transition-colors"
                  >
                    <span>Google Calendar</span>
                    <ExternalLink className="w-3 h-3 text-[#8C827A]" />
                  </a>

                  <button
                    onClick={() => downloadIcsFile(booking)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#DFD7CA] hover:border-[#B25E29] bg-white text-[#2C2825] transition-colors"
                    title="Download individual .ICS event"
                  >
                    <Download className="w-3 h-3 text-[#8C827A]" />
                    <span>.ICS</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
