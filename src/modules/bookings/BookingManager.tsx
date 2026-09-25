import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Edit3, 
  CheckCircle2, 
  Receipt, 
  Bell, 
  Download, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  CornerDownRight,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useBookingContext } from '../../context/BookingContext';
import { Booking } from '../../types';
import { generateGoogleCalendarUrl, downloadIcsFile, STEVAN_DOMAIN } from '../calendar/calendarEngine';

export const BookingManager: React.FC = () => {
  const { 
    bookings, 
    setActiveTab, 
    setBookingForPriceAdjustment, 
    setBookingForPayment,
    setActiveReceipt,
    togglePushReminders,
    sendUpcomingReminderPush,
    pushPermission,
    requestPushPermission
  } = useBookingContext();

  const [filter, setFilter] = useState<'all' | 'active' | 'adjusted' | 'completed'>('all');

  const filteredBookings = bookings.filter(b => {
    if (filter === 'active') return b.status !== 'completed' && b.status !== 'cancelled';
    if (filter === 'adjusted') return b.status === 'quote_adjusted' || (b.adjustments && b.adjustments.length > 0);
    if (filter === 'completed') return b.status === 'completed';
    return true;
  });

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'quote_adjusted':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <Sparkles className="w-3 h-3 mr-1 text-amber-700" />
            Price & Scope Adjusted
          </span>
        );
      case 'deposit_paid':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 mr-1 text-blue-600" />
            Deposit Paid
          </span>
        );
      case 'paid_in_full':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
            Paid in Full
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Calendar className="w-3 h-3 mr-1 text-purple-600" />
            Scheduled
          </span>
        );
      case 'pending_review':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-300">
            <Clock className="w-3 h-3 mr-1 text-stone-500" />
            Pending Studio Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-[#E7E0D5]">
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-[#B25E29]">
            Client Management Portal
          </span>
          <h1 className="text-2xl font-bold font-editorial text-[#2C2825] mt-1">
            Appointments & Invoices
          </h1>
          <p className="text-xs text-[#5C554E] mt-1">
            Manage your bookings, review on-the-fly price and specifics adjustments, sync with {STEVAN_DOMAIN}, and inspect email receipts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pushPermission !== 'granted' && (
            <button
              onClick={requestPushPermission}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-amber-700" />
              <span>Enable Reminder Pushes</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('services')}
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book New Service</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-[#E7E0D5] pb-3 text-xs font-medium">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors ${
            filter === 'all' ? 'bg-[#2C2825] text-white font-semibold' : 'text-[#7A7168] hover:bg-[#F2ECE2]'
          }`}
        >
          All Appointments ({bookings.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors ${
            filter === 'active' ? 'bg-[#2C2825] text-white font-semibold' : 'text-[#7A7168] hover:bg-[#F2ECE2]'
          }`}
        >
          Active / Upcoming ({bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length})
        </button>
        <button
          onClick={() => setFilter('adjusted')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors ${
            filter === 'adjusted' ? 'bg-[#2C2825] text-white font-semibold' : 'text-[#7A7168] hover:bg-[#F2ECE2]'
          }`}
        >
          Price / Scope Adjusted ({bookings.filter(b => b.status === 'quote_adjusted' || (b.adjustments && b.adjustments.length > 0)).length})
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E7E0D5] p-12 text-center space-y-4">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold font-editorial text-[#2C2825]">No Bookings Found</h3>
          <p className="text-xs text-[#7A7168] max-w-md mx-auto">
            You don't have any appointments matching this filter. Explore the service catalogue to book Stevan.
          </p>
          <button
            onClick={() => setActiveTab('services')}
            className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors"
          >
            Explore Offerings
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map(booking => {
            const hasUnpaidBalance = booking.totalPrice > booking.amountPaid;
            const remainingBalance = booking.totalPrice - booking.amountPaid;
            const googleCalUrl = generateGoogleCalendarUrl(booking);
            const latestAdjustment = booking.adjustments?.[0];

            return (
              <div 
                key={booking.id}
                className="bg-white rounded-3xl border border-[#E7E0D5] p-6 shadow-sm hover:shadow-md transition-shadow space-y-5"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#F0EBE1] pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#8C827A]">{booking.id}</span>
                      {getStatusBadge(booking.status)}
                      <span className="text-[11px] text-[#A2988F]">
                        Booked {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold font-editorial text-[#2C2825] mt-1">
                      {booking.serviceTitle}
                    </h2>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-[#8C827A] uppercase font-semibold">Total Price</span>
                    <div className="text-2xl font-bold font-editorial text-[#2C2825]">
                      ${booking.totalPrice}
                    </div>
                    <span className="text-[11px] text-[#5C554E]">
                      Paid: <strong className="text-emerald-700">${booking.amountPaid}</strong>
                      {hasUnpaidBalance && (
                        <span className="text-amber-800 ml-1">(${remainingBalance} remaining)</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Scope / Price Adjustment Banner */}
                {latestAdjustment && (
                  <div className="bg-[#FAF3EC] border border-[#ECD9C9] p-4 rounded-2xl flex items-start space-x-3 text-xs">
                    <Sparkles className="w-5 h-5 text-[#B25E29] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-[#2C2825]">
                          Price & Specifics Adjusted by {latestAdjustment.adjustedBy}
                        </p>
                        <span className="text-[11px] text-[#8C827A]">
                          {new Date(latestAdjustment.adjustedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[#554E46] mt-0.5">
                        <strong>Reason:</strong> {latestAdjustment.reason}
                      </p>
                      {latestAdjustment.notes && (
                        <p className="text-[#7A7168] mt-0.5 italic">
                          Studio Notes: {latestAdjustment.notes}
                        </p>
                      )}
                      <div className="mt-1.5 text-[11px] font-mono text-[#B25E29] flex items-center space-x-2">
                        <span>Original: ${latestAdjustment.previousTotal}</span>
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span className="font-bold">Adjusted Total: ${latestAdjustment.newTotal}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Details Grid: Time, Specifics, Line items */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE5D8] space-y-2">
                    <div className="font-semibold text-[#2C2825] flex items-center space-x-1.5">
                      <Calendar className="w-4 h-4 text-[#B25E29]" />
                      <span>Appointment Time</span>
                    </div>
                    <div className="pl-5 space-y-1 text-[#4A453F]">
                      <p className="font-bold text-sm text-[#2C2825]">{booking.scheduledDate}</p>
                      <p className="text-xs text-[#7A7168]">{booking.timeSlot}</p>
                      <p className="text-xs flex items-center space-x-1 pt-1 text-[#5C554E]">
                        <MapPin className="w-3.5 h-3.5 text-[#B25E29] shrink-0" />
                        <span>{booking.customer.address}, {booking.customer.city}</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE5D8] space-y-2">
                    <div className="font-semibold text-[#2C2825] flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-[#B25E29]" />
                      <span>Configured Specifics</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-[#5C554E] max-h-28 overflow-y-auto pr-1">
                      {Object.entries(booking.specifics || {}).map(([k, v]) => (
                        <div key={k} className="flex justify-between border-b border-[#EAE3D5] pb-0.5">
                          <span className="capitalize text-[#7A7168]">{k.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-medium text-[#2C2825]">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE5D8] space-y-2">
                    <div className="font-semibold text-[#2C2825] flex items-center space-x-1.5">
                      <DollarSign className="w-4 h-4 text-[#B25E29]" />
                      <span>Itemized Line Items</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-[#5C554E] max-h-28 overflow-y-auto pr-1">
                      {(booking.lineItems || []).map(li => (
                        <div key={li.id} className="flex justify-between border-b border-[#EAE3D5] pb-0.5">
                          <span className="text-[#3D3731]">{li.description}</span>
                          <span className="font-mono font-medium">${li.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F0EBE1]">
                  
                  {/* Push reminder controls & calendar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => togglePushReminders(booking.id)}
                      className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        booking.pushReminderEnabled
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>{booking.pushReminderEnabled ? 'Reminders Active' : 'Enable Reminders'}</span>
                    </button>

                    <button
                      onClick={() => sendUpcomingReminderPush(booking, 'Tomorrow at 9:00 AM')}
                      className="px-2.5 py-1.5 rounded-full text-xs text-[#7A7168] hover:text-[#2C2825] hover:bg-[#F2ECE2] transition-colors"
                    >
                      Test Push Alert
                    </button>

                    <a
                      href={googleCalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white text-[#2C2825] border border-[#DFD7CA] hover:border-[#B25E29] transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#B25E29]" />
                      <span>Google Cal</span>
                    </a>

                    <button
                      onClick={() => downloadIcsFile(booking)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white text-[#2C2825] border border-[#DFD7CA] hover:border-[#B25E29] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-[#B25E29]" />
                      <span>.ICS</span>
                    </button>
                  </div>

                  {/* Price adjuster, receipt & payment */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* The crucial on-the-fly price and specifics adjuster */}
                    <button
                      onClick={() => setBookingForPriceAdjustment(booking)}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white text-[#2C2825] border border-[#DFD7CA] hover:bg-[#F2ECE2] transition-colors"
                      title="Adjust price and specific details on-the-fly"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#B25E29]" />
                      <span>Adjust Price & Specifics</span>
                    </button>

                    {/* View Email Receipt */}
                    {booking.receipts && booking.receipts.length > 0 && (
                      <button
                        onClick={() => setActiveReceipt({ receipt: booking.receipts[0], booking })}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Email Receipt</span>
                      </button>
                    )}

                    {/* Pay Button if remaining balance */}
                    {hasUnpaidBalance ? (
                      <button
                        onClick={() => setBookingForPayment(booking)}
                        className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors shadow-sm"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Pay Remaining (${remainingBalance})</span>
                      </button>
                    ) : (
                      <div className="px-4 py-2 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Fully Paid</span>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
