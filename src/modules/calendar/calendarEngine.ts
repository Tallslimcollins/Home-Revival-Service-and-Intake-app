import { Booking } from '../../types';
import { ExternalCalendarEvent, CalendarSyncLog, TwoWaySyncConfig } from './types';

export const STEVAN_CALENDAR_EMAIL = 'scl@stevancollinslazich.com';
export const STEVAN_DOMAIN = 'stevancollinslazich.com';

// Mock external busy calendar events fetched via inbound sync from stevancollinslazich.com
export const INITIAL_EXTERNAL_BUSY_SLOTS: ExternalCalendarEvent[] = [
  {
    id: 'ext-slot-1',
    title: 'Studio Textile Stretching & Framing (Midtown Studio)',
    source: 'stevancollinslazich.com',
    date: '2026-10-05',
    timeSlot: '09:00 AM - 01:00 PM (Morning)',
    isBusyBlock: true,
    notes: 'Blocked off in personal Google Calendar at scl@stevancollinslazich.com'
  },
  {
    id: 'ext-slot-2',
    title: 'Historic Plaster Restoration Consultation (Central Ave)',
    source: 'stevancollinslazich.com',
    date: '2026-10-09',
    timeSlot: '01:30 PM - 05:30 PM (Afternoon)',
    isBusyBlock: true,
    notes: 'On-site consultation blocked in external calendar'
  },
  {
    id: 'ext-slot-3',
    title: 'Sherwin-Williams Color Fan Archive & Materials Run',
    source: 'stevancollinslazich.com',
    date: '2026-10-14',
    timeSlot: '09:00 AM - 01:00 PM (Morning)',
    isBusyBlock: true,
    notes: 'Morning materials acquisition window'
  }
];

export const INITIAL_SYNC_LOGS: CalendarSyncLog[] = [
  {
    id: 'sync-log-1',
    timestamp: '2026-09-25T06:45:00Z',
    direction: 'two-way',
    eventTitle: 'Two-Way Sync Handshake Established',
    status: 'synced',
    details: `Connected client applet with Stevan's primary calendar at ${STEVAN_DOMAIN} (${STEVAN_CALENDAR_EMAIL}).`
  },
  {
    id: 'sync-log-2',
    timestamp: '2026-09-25T06:45:30Z',
    direction: 'inbound',
    eventTitle: 'Inbound Availability Pulled (3 Busy Slots)',
    status: 'synced',
    details: 'Imported personal holds from Google Calendar to prevent scheduling overlaps.'
  },
  {
    id: 'sync-log-3',
    timestamp: '2026-09-25T06:50:00Z',
    direction: 'outbound',
    eventTitle: 'BK-7821 Synced Outbound with Price Adjustment',
    status: 'synced',
    details: 'Updated calendar event description with revised $585 total and heavy plaster hardware notes.'
  }
];

export const INITIAL_TWO_WAY_CONFIG: TwoWaySyncConfig = {
  targetDomain: STEVAN_DOMAIN,
  targetEmail: STEVAN_CALENDAR_EMAIL,
  autoTwoWaySync: true,
  inboundBusySlotsBlocking: true,
  syncIntervalMinutes: 15,
  lastSyncedAt: new Date().toISOString()
};

/**
 * Check if a date & time slot is blocked by an inbound calendar event from stevancollinslazich.com
 */
export function isSlotBlockedByExternalCalendar(
  dateStr: string,
  timeSlotStr: string,
  externalSlots: ExternalCalendarEvent[]
): ExternalCalendarEvent | undefined {
  return externalSlots.find(
    slot => slot.date === dateStr && slot.timeSlot === timeSlotStr && slot.isBusyBlock
  );
}

/**
 * Generate Google Calendar Web URL with deep 2-way sync metadata
 */
export function generateGoogleCalendarUrl(booking: Booking): string {
  const startTime = booking.timeSlot.includes('Morning') ? '090000' : '133000';
  const endTime = booking.timeSlot.includes('Morning') ? '130000' : '173000';

  const cleanDate = booking.scheduledDate.replace(/-/g, '');
  const datesParam = `${cleanDate}T${startTime}Z/${cleanDate}T${endTime}Z`;

  const title = encodeURIComponent(`Home Revival: ${booking.serviceTitle} - ${booking.customer.fullName}`);
  
  const specificsSummary = Object.entries(booking.specifics || {})
    .filter(([_, v]) => typeof v !== 'object')
    .map(([k, v]) => `• ${k}: ${v}`)
    .join('\n');

  const lineItemsSummary = (booking.lineItems || [])
    .map(li => `• ${li.description}: $${li.amount}`)
    .join('\n');

  const details = encodeURIComponent(
    `Home Revival Service with Stevan Collins Lazich\n` +
    `Client: ${booking.customer.fullName} (${booking.customer.phone} / ${booking.customer.email})\n` +
    `Booking Ref: ${booking.id}\n` +
    `Status: ${booking.status.toUpperCase()}\n` +
    `Total Quoted: $${booking.totalPrice} (Paid: $${booking.amountPaid})\n\n` +
    `Configured Specifics:\n${specificsSummary}\n\n` +
    `Itemized Scope:\n${lineItemsSummary}\n\n` +
    `Special Instructions:\n${booking.specialInstructions || 'None provided'}\n\n` +
    `Two-Way Sync Hub: ${STEVAN_DOMAIN} (${STEVAN_CALENDAR_EMAIL})`
  );

  const location = encodeURIComponent(`${booking.customer.address}, ${booking.customer.city}, TN ${booking.customer.zipCode}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}&add=${STEVAN_CALENDAR_EMAIL}`;
}

/**
 * Generate RFC-5545 compliant .ICS calendar content with Valarms for 24h & 2h push reminders
 */
export function generateIcsContent(booking: Booking): string {
  const startTime = booking.timeSlot.includes('Morning') ? '090000' : '133000';
  const endTime = booking.timeSlot.includes('Morning') ? '130000' : '173000';
  const cleanDate = booking.scheduledDate.replace(/-/g, '');
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const summary = `Home Revival: ${booking.serviceTitle} - ${booking.customer.fullName}`;
  const description = `Home Revival Appointment with Stevan Collins Lazich\\nRef: ${booking.id}\\nClient: ${booking.customer.fullName} (${booking.customer.phone})\\nTotal: $${booking.totalPrice} (Paid: $${booking.amountPaid})\\nTwo-Way Sync: ${STEVAN_DOMAIN}`;
  const location = `${booking.customer.address}, ${booking.customer.city}, TN ${booking.customer.zipCode}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Stevan Collins Lazich//Home Revival Two-Way Sync//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Stevan Collins Lazich Appointments (${STEVAN_DOMAIN})`,
    'BEGIN:VEVENT',
    `UID:booking-${booking.id}@${STEVAN_DOMAIN}`,
    `DTSTAMP:${now}`,
    `DTSTART:${cleanDate}T${startTime}`,
    `DTEND:${cleanDate}T${endTime}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `ORGANIZER;CN=Stevan Collins Lazich:mailto:${STEVAN_CALENDAR_EMAIL}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${booking.customer.fullName}:mailto:${booking.customer.email}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Upcoming Home Revival Service Tomorrow with Stevan Collins Lazich',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Stevan Collins Lazich arriving in 2 hours for Home Revival service',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Trigger download of .ICS file directly in the browser
 */
export function downloadIcsFile(booking: Booking): void {
  const ics = generateIcsContent(booking);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `HomeRevival-${booking.id}-${booking.scheduledDate}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
