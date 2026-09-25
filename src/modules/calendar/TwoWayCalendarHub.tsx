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
  ArrowLeftRight, 
  AlertTriangle, 
  Plus, 
  Layers,
  Activity,
  History
} from 'lucide-react';
import { useBookingContext } from '../../context/BookingContext';
import { 
  STEVAN_CALENDAR_EMAIL, 
  STEVAN_DOMAIN, 
  generateGoogleCalendarUrl, 
  downloadIcsFile,
  INITIAL_EXTERNAL_BUSY_SLOTS,
  INITIAL_SYNC_LOGS
} from './calendarEngine';
import { ExternalCalendarEvent, CalendarSyncLog } from './types';

export const TwoWayCalendarHub: React.FC = () => {
  const { bookings } = useBookingContext();
  const [copiedFeed, setCopiedFeed] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Two-way sync controls
  const [autoSync, setAutoSync] = useState(true);
  const [blockBusySlots, setBlockBusySlots] = useState(true);
  
  // External busy slots fetched inbound from stevancollinslazich.com
  const [externalSlots, setExternalSlots] = useState<ExternalCalendarEvent[]>(INITIAL_EXTERNAL_BUSY_SLOTS);
  
  // Two-way sync logs
  const [syncLogs, setSyncLogs] = useState<CalendarSyncLog[]>(INITIAL_SYNC_LOGS);

  // New mock external event modal state
  const [showAddHoldModal, setShowAddHoldModal] = useState(false);
  const [newHoldTitle, setNewHoldTitle] = useState('');
  const [newHoldDate, setNewHoldDate] = useState('2026-10-16');
  const [newHoldSlot, setNewHoldSlot] = useState('09:00 AM - 01:00 PM (Morning)');

  const iCalFeedUrl = `webcal://${STEVAN_DOMAIN}/feed/home-revival-appointments.ics`;

  const handleCopyFeed = () => {
    navigator.clipboard.writeText(iCalFeedUrl);
    setCopiedFeed(true);
    setTimeout(() => setCopiedFeed(false), 2500);
  };

  const handleTriggerTwoWaySync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const newLog: CalendarSyncLog = {
        id: `sync-log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        direction: 'two-way',
        eventTitle: 'Two-Way Bi-directional Sync Completed',
        status: 'synced',
        details: `Reconciled ${bookings.length} local bookings with external calendar feed at ${STEVAN_DOMAIN}. 0 conflicts.`
      };
      setSyncLogs(prev => [newLog, ...prev]);
    }, 850);
  };

  const handleAddExternalHold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHoldTitle.trim()) return;

    const newHold: ExternalCalendarEvent = {
      id: `ext-slot-${Date.now()}`,
      title: newHoldTitle.trim(),
      source: 'stevancollinslazich.com',
      date: newHoldDate,
      timeSlot: newHoldSlot,
      isBusyBlock: true,
      notes: `Added from Stevan's external calendar on ${STEVAN_DOMAIN}`
    };

    setExternalSlots(prev => [newHold, ...prev]);
    
    // Add to sync log
    const log: CalendarSyncLog = {
      id: `sync-log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      direction: 'inbound',
      eventTitle: `Inbound Busy Block: "${newHold.title}"`,
      status: 'synced',
      details: `Received blackout window from stevancollinslazich.com on ${newHold.date} (${newHold.timeSlot}). Customer booking scheduler will block this slot.`
    };
    setSyncLogs(prev => [log, ...prev]);

    setNewHoldTitle('');
    setShowAddHoldModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner: Two-Way Sync Active */}
      <div className="bg-white p-6 rounded-3xl border border-[#E7E0D5] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 text-xs uppercase font-semibold tracking-wider text-[#B25E29] bg-[#FAF2EB] px-2.5 py-0.5 rounded-full border border-[#F0DDCF]">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Two-Way Bi-Directional Engine</span>
            </span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Live Syncing Active
            </span>
          </div>

          <h1 className="text-2xl font-bold font-editorial text-[#2C2825] mt-1">
            Calendar Engine at {STEVAN_DOMAIN}
          </h1>
          <p className="text-xs text-[#5C554E] mt-1 max-w-2xl leading-relaxed">
            Maintains continuous 2-way synchronization between customer bookings in this app and Stevan Collins' personal calendar at <strong>{STEVAN_CALENDAR_EMAIL}</strong>. External busy blocks are automatically honored to avoid double-bookings.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddHoldModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white border border-[#DFD7CA] text-[#2C2825] hover:bg-[#F2ECE2] transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#B25E29]" />
            <span>Simulate External Hold</span>
          </button>

          <button
            onClick={handleTriggerTwoWaySync}
            disabled={isSyncing}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors shadow-sm disabled:opacity-75"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Reconciling 2-Way...' : 'Reconcile Two-Way Now'}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Outbound Sync */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C827A] uppercase flex items-center space-x-1">
              <span>Outbound Sync</span>
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active ({bookings.length} pushed)
            </span>
          </div>
          <div>
            <div className="text-sm font-bold text-[#2C2825]">
              App → {STEVAN_DOMAIN}
            </div>
            <p className="text-xs text-[#5C554E] mt-0.5">
              Pushes all scheduled bookings, price revisions, customer phone, and address coordinates.
            </p>
          </div>
          <div className="pt-2 border-t border-[#F0EBE1] flex items-center justify-between text-xs">
            <span className="text-stone-500">Auto-Push on Change:</span>
            <input 
              type="checkbox" 
              checked={autoSync} 
              onChange={(e) => setAutoSync(e.target.checked)} 
              className="rounded text-[#B25E29] focus:ring-[#B25E29]" 
            />
          </div>
        </div>

        {/* Card 2: Inbound Busy Blockouts */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C827A] uppercase">
              Inbound Sync
            </span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {externalSlots.length} External Holds
            </span>
          </div>
          <div>
            <div className="text-sm font-bold text-[#2C2825]">
              {STEVAN_DOMAIN} → App
            </div>
            <p className="text-xs text-[#5C554E] mt-0.5">
              Reads external events & holds on Stevan's Google Calendar and blocks customer booking slots.
            </p>
          </div>
          <div className="pt-2 border-t border-[#F0EBE1] flex items-center justify-between text-xs">
            <span className="text-stone-500">Enforce Inbound Blackouts:</span>
            <input 
              type="checkbox" 
              checked={blockBusySlots} 
              onChange={(e) => setBlockBusySlots(e.target.checked)} 
              className="rounded text-[#B25E29] focus:ring-[#B25E29]" 
            />
          </div>
        </div>

        {/* Card 3: Auto-BCC & Push Notifications */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C827A] uppercase">
              Sync Integrations
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified
            </span>
          </div>
          <div>
            <div className="text-sm font-bold text-[#2C2825]">
              BCC & 24h/2h Alerts
            </div>
            <p className="text-xs text-[#5C554E] mt-0.5">
              Automated receipts BCC'd to {STEVAN_CALENDAR_EMAIL}. Push notifications fire 24h & 2h prior.
            </p>
          </div>
          <div className="pt-2 border-t border-[#F0EBE1] text-[11px] text-[#8C827A]">
            Target: <strong>{STEVAN_CALENDAR_EMAIL}</strong>
          </div>
        </div>

      </div>

      {/* External Inbound Busy Slots (from Stevan's personal calendar) */}
      <div className="bg-white p-6 rounded-3xl border border-[#E7E0D5] space-y-4">
        <div className="flex justify-between items-center border-b border-[#F0EBE1] pb-3">
          <div>
            <h3 className="font-bold text-sm text-[#2C2825] flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#B25E29]" />
              <span>Inbound External Holds Pulled from {STEVAN_DOMAIN}</span>
            </h3>
            <p className="text-[11px] text-[#8C827A]">
              These slots are blocked out in Stevan's personal Google Calendar and are withheld from client selection.
            </p>
          </div>

          <button
            onClick={() => setShowAddHoldModal(true)}
            className="text-xs font-semibold text-[#B25E29] hover:underline"
          >
            + Add Test Hold
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {externalSlots.map(slot => (
            <div key={slot.id} className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE5D8] space-y-1 text-xs">
              <div className="flex justify-between items-start">
                <span className="font-bold text-[#2C2825] leading-snug">{slot.title}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-mono">
                  Busy
                </span>
              </div>
              <p className="text-xs text-[#B25E29] font-medium flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{slot.date}</span>
              </p>
              <p className="text-[11px] text-[#7A7168]">{slot.timeSlot}</p>
              {slot.notes && (
                <p className="text-[10px] text-[#A2988F] italic pt-1 border-t border-[#EAE3D5]">
                  {slot.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two-Way Sync Activity Log */}
      <div className="bg-white p-6 rounded-3xl border border-[#E7E0D5] space-y-4">
        <div className="flex justify-between items-center border-b border-[#F0EBE1] pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-[#2C2825]">
              Real-Time Two-Way Sync Transaction Log
            </h3>
          </div>
          <span className="text-xs text-[#8C827A]">Live Feed</span>
        </div>

        <div className="divide-y divide-[#F7F4EE] max-h-60 overflow-y-auto pr-1">
          {syncLogs.map(log => (
            <div key={log.id} className="py-2.5 text-xs flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-mono font-bold ${
                    log.direction === 'inbound' 
                      ? 'bg-blue-100 text-blue-800' 
                      : log.direction === 'outbound' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {log.direction}
                  </span>
                  <span className="font-semibold text-[#2C2825]">{log.eventTitle}</span>
                </div>
                <p className="text-[#5C554E] text-[11px] pl-1 leading-relaxed">{log.details}</p>
              </div>

              <span className="text-[10px] text-[#8C827A] font-mono shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Universal Subscription Feed */}
      <div className="bg-white p-6 rounded-3xl border border-[#E7E0D5] space-y-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-[#B25E29]" />
          <h3 className="text-base font-bold font-editorial text-[#2C2825]">
            Universal Live WebCal / iCal Feed for {STEVAN_DOMAIN}
          </h3>
        </div>
        <p className="text-xs text-[#5C554E]">
          Subscribe to this direct feed in Google Calendar, Apple Calendar, or Outlook to mirror all bookings and price updates automatically.
        </p>

        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE5D8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full truncate font-mono text-xs text-[#2C2825] bg-white px-3 py-2 rounded-xl border border-[#DCD3C5]">
            {iCalFeedUrl}
          </div>
          <button
            onClick={handleCopyFeed}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors"
          >
            {copiedFeed ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy WebCal URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Add External Hold Modal */}
      {showAddHoldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7E0D5] p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold font-editorial text-[#2C2825]">
              Simulate Inbound Hold on {STEVAN_DOMAIN}
            </h3>
            <p className="text-xs text-[#5C554E]">
              Add a personal hold or on-site painting session. The app will immediately block this slot so customers cannot select it.
            </p>

            <form onSubmit={handleAddExternalHold} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#554E46] mb-1">Hold Title</label>
                <input
                  type="text"
                  placeholder="e.g. Gallery Wall Framing Session at Midtown Studio"
                  value={newHoldTitle}
                  onChange={(e) => setNewHoldTitle(e.target.value)}
                  className="w-full text-xs bg-white border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#554E46] mb-1">Date</label>
                <input
                  type="date"
                  value={newHoldDate}
                  onChange={(e) => setNewHoldDate(e.target.value)}
                  className="w-full text-xs bg-white border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#554E46] mb-1">Time Slot</label>
                <select
                  value={newHoldSlot}
                  onChange={(e) => setNewHoldSlot(e.target.value)}
                  className="w-full text-xs bg-white border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825]"
                >
                  <option value="09:00 AM - 01:00 PM (Morning)">09:00 AM - 01:00 PM (Morning Window)</option>
                  <option value="01:30 PM - 05:30 PM (Afternoon)">01:30 PM - 05:30 PM (Afternoon Window)</option>
                  <option value="09:00 AM - 04:00 PM (Full Day)">09:00 AM - 04:00 PM (Full Day Session)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddHoldModal(false)}
                  className="px-4 py-2 rounded-full text-xs text-[#5C554E] hover:bg-[#F2ECE2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29]"
                >
                  Save Inbound Hold
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
