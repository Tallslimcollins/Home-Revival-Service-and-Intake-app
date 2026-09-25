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
  Share2,
  Copy,
  Clock
} from 'lucide-react';
import { useBookingContext } from '../context/BookingContext';
import { generateGoogleCalendarUrl, downloadIcsFile, STEVAN_CALENDAR_EMAIL, STEVAN_DOMAIN } from '../utils/calendar';

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt } = useBookingContext();
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  if (!activeReceipt) return null;

  const { receipt, booking } = activeReceipt;

  const handlePrint = () => {
    window.print();
  };

  const handleResend = () => {
    setResendStatus('Dispatched');
    setTimeout(() => {
      setResendStatus(null);
    }, 3500);
  };

  const googleCalUrl = generateGoogleCalendarUrl(booking);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7E0D5] w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-white border-b border-[#E7E0D5] flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-[#2C2825]">
              Automated Transaction Receipt
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 text-[#5C554E] hover:text-[#2C2825] hover:bg-[#F2ECE2] rounded-full transition-colors"
              title="Print or Save as PDF"
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

        {/* Scrollable Receipt Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Simulated Email Envelope Header */}
          <div className="bg-white p-4 rounded-2xl border border-[#E7E0D5] text-xs space-y-1.5 print:hidden">
            <div className="flex justify-between items-center text-[#8C827A]">
              <span>Automated Email Dispatch Log:</span>
              <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Delivered to Inbox</span>
              </span>
            </div>
            <div className="font-mono text-[11px] text-[#4A453F] space-y-0.5 pt-1 border-t border-[#F0EBE1]">
              <div><strong>From:</strong> Stevan Collins Lazich &lt;service@{STEVAN_DOMAIN}&gt;</div>
              <div><strong>To:</strong> {booking.customer.fullName} &lt;{receipt.clientEmail}&gt;</div>
              <div><strong>BCC:</strong> Stevan Collins Lazich &lt;{STEVAN_CALENDAR_EMAIL}&gt;</div>
              <div><strong>Subject:</strong> Confirmation Receipt #{receipt.receiptNumber} - Home Revival ({booking.serviceTitle})</div>
            </div>
          </div>

          {/* Printable Invoice / Receipt Card */}
          <div className="bg-white p-7 rounded-3xl border border-[#E0D7C8] shadow-sm space-y-6">
            
            {/* Studio Letterhead */}
            <div className="flex justify-between items-start border-b border-[#EFEAE0] pb-5">
              <div>
                <h1 className="text-2xl font-bold font-editorial text-[#2C2825] tracking-tight">
                  STEVAN COLLINS LAZICH
                </h1>
                <p className="text-xs uppercase tracking-widest text-[#B25E29] font-medium mt-0.5">
                  Home Revival Studio
                </p>
                <p className="text-xs text-[#7A7168] mt-1">
                  Memphis, TN • stevancollinslazich.com
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase font-mono font-bold px-2.5 py-1 rounded bg-[#F7F4EE] border border-[#E8E1D3] text-[#2C2825]">
                  {receipt.receiptNumber}
                </span>
                <p className="text-xs text-[#8C827A] mt-1.5 font-mono">
                  {new Date(receipt.paidAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Billed To & Service Date Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C827A]">Customer & Location</span>
                <p className="font-bold text-[#2C2825] mt-1">{booking.customer.fullName}</p>
                <p className="text-[#5C554E]">{booking.customer.address}</p>
                <p className="text-[#5C554E]">{booking.customer.city}, TN {booking.customer.zipCode}</p>
                <p className="text-[#8C827A] mt-1 font-mono">{booking.customer.phone}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C827A]">Appointment Details</span>
                <p className="font-bold text-[#2C2825] mt-1">{booking.serviceTitle}</p>
                <p className="text-[#5C554E] flex items-center space-x-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-[#B25E29]" />
                  <span>{booking.scheduledDate}</span>
                </p>
                <p className="text-[#5C554E] flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#B25E29]" />
                  <span>{booking.timeSlot}</span>
                </p>
                <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Synced with stevancollinslazich.com
                </span>
              </div>
            </div>

            {/* Itemized Service Breakdown */}
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

              {/* Total & Payments Calculation */}
              <div className="border-t-2 border-[#E7E0D5] pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#5C554E]">
                  <span>Total Quoted Amount</span>
                  <span className="font-mono font-medium">${booking.totalPrice}</span>
                </div>
                
                <div className="flex justify-between font-bold text-emerald-800">
                  <span>Amount Paid this Transaction ({receipt.paymentMethod})</span>
                  <span className="font-mono text-sm">${receipt.amountPaid}</span>
                </div>

                <div className="flex justify-between text-[#5C554E] border-t border-[#F0EBE1] pt-1.5 font-medium">
                  <span>Remaining Outstanding Balance</span>
                  <span className="font-mono text-[#2C2825]">
                    ${Math.max(0, booking.totalPrice - booking.amountPaid)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment & Security Metadata */}
            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE5D8] flex items-center justify-between text-[11px] text-[#7A7168]">
              <div>
                <span className="font-mono">Transaction ID: {receipt.transactionId}</span>
                <span className="mx-2">•</span>
                <span>Status: Succeeded</span>
              </div>
              <div className="flex items-center space-x-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-medium">Secure Verification</span>
              </div>
            </div>

            {/* Stevan's Personal Studio Note */}
            <div className="text-xs text-[#554E46] border-t border-[#F0EBE1] pt-4 italic">
              "Thank you for trusting Home Revival. I look forward to bringing clarity, warmth, and artistic craftsmanship into your living space."
              <div className="font-editorial text-sm font-bold text-[#2C2825] not-italic mt-1">
                — Stevan Collins Lazich
              </div>
            </div>

          </div>

          {/* Quick Calendar & Email Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:hidden">
            <a
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white border border-[#DFD7CA] hover:border-[#B25E29] text-xs font-semibold text-[#2C2825] flex items-center justify-center space-x-2 transition-colors shadow-sm"
            >
              <Calendar className="w-4 h-4 text-[#B25E29]" />
              <span>Add to Google Cal</span>
              <ExternalLink className="w-3 h-3 text-[#8C827A]" />
            </a>

            <button
              onClick={() => downloadIcsFile(booking)}
              className="p-3 rounded-2xl bg-white border border-[#DFD7CA] hover:border-[#B25E29] text-xs font-semibold text-[#2C2825] flex items-center justify-center space-x-2 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 text-[#B25E29]" />
              <span>Download .ICS File</span>
            </button>

            <button
              onClick={handleResend}
              className="p-3 rounded-2xl bg-[#2C2825] hover:bg-[#B25E29] text-xs font-semibold text-white flex items-center justify-center space-x-2 transition-colors shadow-sm"
            >
              <Mail className="w-4 h-4" />
              <span>{resendStatus ? 'Dispatched to Inbox!' : 'Resend Email Receipt'}</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#E7E0D5] flex items-center justify-between print:hidden">
          <span className="text-xs text-[#8C827A]">
            Official copy stored in stevancollinslazich.com archive
          </span>

          <button
            onClick={() => setActiveReceipt(null)}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
