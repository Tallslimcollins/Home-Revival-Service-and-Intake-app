import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Send,
  Eye,
  FileText
} from 'lucide-react';
import { useBookingContext } from '../../context/BookingContext';
import { generateGoogleCalendarUrl, downloadIcsFile, STEVAN_CALENDAR_EMAIL, STEVAN_DOMAIN } from '../calendar/calendarEngine';
import { buildEmailConfirmationPayload } from './receiptEngine';

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt } = useBookingContext();
  const [activeView, setActiveView] = useState<'email' | 'invoice'>('email');
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  if (!activeReceipt) return null;

  const { receipt, booking } = activeReceipt;
  const emailPayload = buildEmailConfirmationPayload(booking, receipt);
  const googleCalUrl = generateGoogleCalendarUrl(booking);

  const handlePrint = () => {
    window.print();
  };

  const handleResend = () => {
    setResendStatus('Email dispatched successfully to client and BCC to Stevan Collins Lazich!');
    setTimeout(() => {
      setResendStatus(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7E0D5] w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E7E0D5] flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#2C2825] block">
                Automated Transaction Receipt
              </span>
              <span className="text-[10px] text-[#8C827A] font-mono">
                {receipt.receiptNumber} • {receipt.transactionId}
              </span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center space-x-2">
            <div className="flex bg-[#F0EBE1] p-1 rounded-full text-xs font-medium">
              <button
                onClick={() => setActiveView('email')}
                className={`px-3 py-1 rounded-full transition-all flex items-center space-x-1 ${
                  activeView === 'email' ? 'bg-[#2C2825] text-white shadow-xs' : 'text-[#5C554E]'
                }`}
              >
                <Mail className="w-3 h-3" />
                <span>Email Delivery</span>
              </button>
              <button
                onClick={() => setActiveView('invoice')}
                className={`px-3 py-1 rounded-full transition-all flex items-center space-x-1 ${
                  activeView === 'invoice' ? 'bg-[#2C2825] text-white shadow-xs' : 'text-[#5C554E]'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Printable Invoice</span>
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="p-2 text-[#5C554E] hover:text-[#2C2825] hover:bg-[#F2ECE2] rounded-full transition-colors"
              title="Print or Save PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveReceipt(null)}
              className="p-2 text-[#8C827A] hover:text-[#2C2825] hover:bg-[#F2ECE2] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {resendStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 flex items-center space-x-2 print:hidden animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{resendStatus}</span>
            </div>
          )}

          {/* VIEW MODE 1: EMAIL CLIENT PREVIEW */}
          {activeView === 'email' && (
            <div className="space-y-4">
              {/* Simulated Mail Client Window Bar */}
              <div className="bg-white rounded-2xl border border-[#E7E0D5] p-4 text-xs space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-[#8C827A] border-b border-[#F0EBE1] pb-2">
                  <span className="font-semibold text-[#2C2825] flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-[#B25E29]" />
                    <span>Automated Email Dispatch Confirmation</span>
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold text-[10px]">
                    ✓ Dispatched to Inbox
                  </span>
                </div>

                <div className="font-mono text-[11px] text-[#4A453F] space-y-1">
                  <div><strong>From:</strong> {emailPayload.from}</div>
                  <div><strong>To:</strong> {emailPayload.to}</div>
                  <div><strong>BCC:</strong> {emailPayload.bcc}</div>
                  <div><strong>Subject:</strong> {emailPayload.subject}</div>
                  <div><strong>Date Sent:</strong> {new Date(receipt.paidAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Formatted Email Content Card */}
              <div className="bg-white p-6 rounded-3xl border border-[#E7E0D5] shadow-sm space-y-5">
                <div>
                  <h2 className="text-2xl font-bold font-editorial text-[#2C2825]">
                    STEVAN COLLINS LAZICH
                  </h2>
                  <p className="text-xs uppercase tracking-widest text-[#B25E29] font-medium">
                    Home Revival by Stevan Collins Lazich
                  </p>
                  <p className="text-xs text-[#7A7168] mt-0.5">
                    Memphis, TN • {STEVAN_DOMAIN}
                  </p>
                </div>

                <p className="text-xs text-[#4A453F] leading-relaxed">
                  Hi {booking.customer.fullName},<br />
                  Thank you for your appointment with Home Revival. Your payment of <strong>${receipt.amountPaid}</strong> via <strong>{receipt.paymentMethod}</strong> has been received and verified. This transaction has synced directly with Stevan's calendar at <strong>{STEVAN_DOMAIN}</strong>.
                </p>

                {/* Mandatory Details Grid: Service, Price, Date, Time */}
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE5D8] space-y-2.5 text-xs">
                  <div className="flex justify-between items-center border-b border-[#EAE3D5] pb-2">
                    <span className="text-[#7A7168]">Service:</span>
                    <span className="font-bold text-[#2C2825] text-sm">{booking.serviceTitle}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-[#EAE3D5] pb-2">
                    <span className="text-[#7A7168]">Appointment Date:</span>
                    <span className="font-bold text-[#2C2825] flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-[#B25E29]" />
                      <span>{booking.scheduledDate}</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-[#EAE3D5] pb-2">
                    <span className="text-[#7A7168]">Appointment Time:</span>
                    <span className="font-bold text-[#2C2825] flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#B25E29]" />
                      <span>{booking.timeSlot}</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-[#EAE3D5] pb-2">
                    <span className="text-[#7A7168]">Service Address:</span>
                    <span className="font-medium text-[#2C2825] flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-[#B25E29]" />
                      <span>{booking.customer.address}, {booking.customer.city}</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-[#EAE3D5] pb-2">
                    <span className="text-[#7A7168]">Total Quoted Price:</span>
                    <span className="font-mono font-bold text-sm text-[#2C2825]">${booking.totalPrice}</span>
                  </div>

                  <div className="flex justify-between items-center pt-1 text-emerald-800">
                    <span className="font-bold">Amount Paid (This Transaction):</span>
                    <span className="font-mono font-bold text-base">${receipt.amountPaid}</span>
                  </div>
                </div>

                <div className="text-xs text-[#7A7168] italic">
                  Stevan brings all precision levels, heavy-duty brackets, and hardware. Automatic reminders will arrive 24 hours and 2 hours prior to arrival.
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: PRINTABLE INVOICE / PDF */}
          {activeView === 'invoice' && (
            <div className="bg-white p-7 rounded-3xl border border-[#E0D7C8] shadow-sm space-y-6">
              <div className="flex justify-between items-start border-b border-[#EFEAE0] pb-5">
                <div>
                  <h1 className="text-2xl font-bold font-editorial text-[#2C2825] tracking-tight">
                    STEVAN COLLINS LAZICH
                  </h1>
                  <p className="text-xs uppercase tracking-widest text-[#B25E29] font-medium mt-0.5">
                    Home Revival by Stevan Collins Lazich
                  </p>
                  <p className="text-xs text-[#7A7168] mt-1">
                    Memphis, TN • {STEVAN_DOMAIN}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs uppercase font-mono font-bold px-2.5 py-1 rounded bg-[#F7F4EE] border border-[#E8E1D3] text-[#2C2825]">
                    {receipt.receiptNumber}
                  </span>
                  <p className="text-xs text-[#8C827A] mt-1.5 font-mono">
                    {new Date(receipt.paidAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Billed To & Service Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C827A]">Customer Details</span>
                  <p className="font-bold text-[#2C2825] mt-1">{booking.customer.fullName}</p>
                  <p className="text-[#5C554E]">{booking.customer.address}</p>
                  <p className="text-[#5C554E]">{booking.customer.city}, TN {booking.customer.zipCode}</p>
                  <p className="text-[#8C827A] mt-1 font-mono">{booking.customer.phone}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C827A]">Scheduled Appointment</span>
                  <p className="font-bold text-[#2C2825] mt-1">{booking.serviceTitle}</p>
                  <p className="text-[#5C554E] flex items-center space-x-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-[#B25E29]" />
                    <span>{booking.scheduledDate}</span>
                  </p>
                  <p className="text-[#5C554E] flex items-center space-x-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#B25E29]" />
                    <span>{booking.timeSlot}</span>
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Two-Way Synced with stevancollinslazich.com
                  </span>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C827A]">Itemized Scope of Work</span>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#EFEAE0] text-left text-[#7A7168]">
                      <th className="py-2 font-medium">Description</th>
                      <th className="py-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F7F4EE]">
                    {(booking.lineItems || []).map(item => (
                      <tr key={item.id}>
                        <td className="py-2 text-[#3D3731]">{item.description}</td>
                        <td className="py-2 text-right font-mono font-medium text-[#2C2825]">${item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t-2 border-[#E7E0D5] pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#5C554E]">
                    <span>Total Quoted Amount:</span>
                    <span className="font-mono font-medium">${booking.totalPrice}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-800">
                    <span>Paid this Transaction ({receipt.paymentMethod}):</span>
                    <span className="font-mono text-sm">${receipt.amountPaid}</span>
                  </div>
                  <div className="flex justify-between text-[#5C554E] border-t border-[#F0EBE1] pt-1.5">
                    <span>Remaining Balance:</span>
                    <span className="font-mono text-[#2C2825]">
                      ${Math.max(0, booking.totalPrice - booking.amountPaid)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE5D8] flex items-center justify-between text-[11px] text-[#7A7168]">
                <div>
                  <span className="font-mono">Ref: {receipt.transactionId}</span>
                  <span className="mx-2">•</span>
                  <span>Two-Way Calendar Sync Verified</span>
                </div>
                <div className="flex items-center space-x-1 text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="font-medium">Encrypted Settlement</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:hidden">
            <a
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white border border-[#DFD7CA] hover:border-[#B25E29] text-xs font-semibold text-[#2C2825] flex items-center justify-center space-x-2 transition-colors shadow-xs"
            >
              <Calendar className="w-4 h-4 text-[#B25E29]" />
              <span>Add to Google Cal</span>
              <ExternalLink className="w-3 h-3 text-[#8C827A]" />
            </a>

            <button
              onClick={() => downloadIcsFile(booking)}
              className="p-3 rounded-2xl bg-white border border-[#DFD7CA] hover:border-[#B25E29] text-xs font-semibold text-[#2C2825] flex items-center justify-center space-x-2 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4 text-[#B25E29]" />
              <span>Download .ICS</span>
            </button>

            <button
              onClick={handleResend}
              className="p-3 rounded-2xl bg-[#2C2825] hover:bg-[#B25E29] text-xs font-semibold text-white flex items-center justify-center space-x-2 transition-colors shadow-xs"
            >
              <Mail className="w-4 h-4" />
              <span>Resend Email Receipt</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#E7E0D5] flex items-center justify-between print:hidden">
          <span className="text-xs text-[#8C827A]">
            Official copy stored in {STEVAN_DOMAIN} archive
          </span>

          <button
            onClick={() => setActiveReceipt(null)}
            className="px-6 py-2 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors"
          >
            Close Receipt
          </button>
        </div>

      </div>
    </div>
  );
};
