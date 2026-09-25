import { Booking } from '../types';

export const STEVAN_CALENDAR_EMAIL = 'service@stevancollinslazich.com';
export const STEVAN_DOMAIN = 'stevancollinslazich.com';

/**
 * Generate Google Calendar Web URL for 1-click event addition
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
    `Stevan Collins Lazich / Home Revival Booking\n` +
    `Client: ${booking.customer.fullName} (${booking.customer.phone} / ${booking.customer.email})\n` +
    `Status: ${booking.status.toUpperCase()}\n` +
    `Total: $${booking.totalPrice} (Paid: $${booking.amountPaid})\n\n` +
    `Specifics:\n${specificsSummary}\n\n` +
    `Line Items:\n${lineItemsSummary}\n\n` +
    `Instructions: ${booking.specialInstructions || 'None provided'}\n\n` +
    `Sync Destination: ${STEVAN_DOMAIN} (${STEVAN_CALENDAR_EMAIL})`
  );

  const location = encodeURIComponent(`${booking.customer.address}, ${booking.customer.city}, TN ${booking.customer.zipCode}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}&add=${STEVAN_CALENDAR_EMAIL}`;
}

/**
 * Generate standard .ICS file string for universal calendar sync (Google, Apple, Outlook)
 */
export function generateIcsContent(booking: Booking): string {
  const startTime = booking.timeSlot.includes('Morning') ? '090000' : '133000';
  const endTime = booking.timeSlot.includes('Morning') ? '130000' : '173000';
  const cleanDate = booking.scheduledDate.replace(/-/g, '');
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const summary = `Home Revival: ${booking.serviceTitle} - ${booking.customer.fullName}`;
  const description = `Home Revival Appointment with Stevan Collins Lazich\\nClient: ${booking.customer.fullName}\\nPhone: ${booking.customer.phone}\\nStatus: ${booking.status}\\nTotal: $${booking.totalPrice}\\nSync: ${STEVAN_DOMAIN}`;
  const location = `${booking.customer.address}, ${booking.customer.city}, TN ${booking.customer.zipCode}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Stevan Collins Lazich//Home Revival Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Stevan Collins Lazich Appointments',
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
    'DESCRIPTION:Reminder: Upcoming Home Revival Service Tomorrow',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Stevan Collins Lazich arriving in 2 hours',
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
