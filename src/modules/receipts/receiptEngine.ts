import { Booking, PaymentReceipt } from '../../types';
import { STEVAN_CALENDAR_EMAIL, STEVAN_DOMAIN } from '../calendar/calendarEngine';

export interface EmailDispatchPayload {
  to: string;
  from: string;
  bcc: string;
  subject: string;
  sentAt: string;
  htmlBody: string;
}

export function generatePaymentReceipt(
  booking: Booking,
  amount: number,
  paymentMethod: string,
  paymentType: 'full' | 'deposit' | 'balance_settlement'
): PaymentReceipt {
  const receiptNumber = `RCPT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    transactionId,
    paidAt: new Date().toISOString(),
    amountPaid: amount,
    paymentMethod,
    paymentType,
    currency: 'USD',
    clientEmail: booking.customer.email,
    merchantBcc: STEVAN_CALENDAR_EMAIL,
    receiptNumber,
    status: 'succeeded'
  };
}

export function buildEmailConfirmationPayload(booking: Booking, receipt: PaymentReceipt): EmailDispatchPayload {
  const subject = `Official Receipt & Appointment Confirmation #${receipt.receiptNumber} - Home Revival`;
  const from = `Stevan Collins Lazich <service@${STEVAN_DOMAIN}>`;
  const to = `${booking.customer.fullName} <${receipt.clientEmail}>`;
  const bcc = `Stevan Collins Lazich Studio Archive <${STEVAN_CALENDAR_EMAIL}>`;

  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E7E0D5; border-radius: 16px; background-color: #FAF8F5;">
      <h2 style="font-family: serif; color: #2C2825; margin-bottom: 4px;">STEVAN COLLINS LAZICH</h2>
      <p style="color: #B25E29; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-top: 0;">Home Revival by Stevan Collins Lazich</p>
      
      <p style="font-size: 14px; color: #4A453F; line-height: 1.6;">
        Dear ${booking.customer.fullName},<br><br>
        Thank you for choosing Home Revival. Your transaction of <strong>$${receipt.amountPaid}</strong> (${receipt.paymentMethod}) has been successfully processed. Your appointment is confirmed and synced with our studio calendar at <strong>${STEVAN_DOMAIN}</strong>.
      </p>

      <div style="background-color: #FFFFFF; padding: 16px; border-radius: 12px; border: 1px solid #E0D7C8; margin: 20px 0;">
        <table style="width: 100%; font-size: 13px; color: #2C2825;">
          <tr>
            <td style="padding: 6px 0; color: #7A7168;">Receipt Number:</td>
            <td style="padding: 6px 0; font-weight: bold; text-align: right;">${receipt.receiptNumber}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #7A7168;">Service:</td>
            <td style="padding: 6px 0; font-weight: bold; text-align: right;">${booking.serviceTitle}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #7A7168;">Appointment Date:</td>
            <td style="padding: 6px 0; font-weight: bold; text-align: right;">${booking.scheduledDate}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #7A7168;">Time Slot:</td>
            <td style="padding: 6px 0; font-weight: bold; text-align: right;">${booking.timeSlot}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #7A7168;">Service Address:</td>
            <td style="padding: 6px 0; font-weight: bold; text-align: right;">${booking.customer.address}, ${booking.customer.city}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #7A7168;">Total Quoted Price:</td>
            <td style="padding: 6px 0; font-weight: bold; text-align: right;">$${booking.totalPrice}</td>
          </tr>
          <tr style="border-top: 2px solid #E7E0D5;">
            <td style="padding: 8px 0; font-weight: bold; color: #166534;">Amount Paid:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #166534; text-align: right; font-size: 15px;">$${receipt.amountPaid}</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 12px; color: #7A7168; font-style: italic;">
        Stevan will bring all required equipment and hanging hardware. Reminders will be sent 24 hours and 2 hours prior to arrival.
      </p>
    </div>
  `;

  return {
    to,
    from,
    bcc,
    subject,
    sentAt: receipt.paidAt,
    htmlBody
  };
}
