import { Booking } from '../../types';

export interface ExternalCalendarEvent {
  id: string;
  title: string;
  source: 'stevancollinslazich.com' | 'Google Calendar' | 'Apple Calendar';
  date: string; // YYYY-MM-DD
  timeSlot: string;
  isBusyBlock: boolean;
  notes?: string;
}

export interface CalendarSyncLog {
  id: string;
  timestamp: string;
  direction: 'inbound' | 'outbound' | 'two-way';
  eventTitle: string;
  status: 'synced' | 'pending' | 'conflict_resolved';
  details: string;
}

export interface TwoWaySyncConfig {
  targetDomain: string; // 'stevancollinslazich.com'
  targetEmail: string; // 'scl@stevancollinslazich.com'
  autoTwoWaySync: boolean;
  inboundBusySlotsBlocking: boolean;
  syncIntervalMinutes: number;
  lastSyncedAt: string;
}
