import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  Receipt,
  Smartphone,
  Sparkles,
  Calendar,
  Clock
} from 'lucide-react';
import { useBookingContext } from '../../context/BookingContext';
import confetti from 'canvas-confetti';
import { notificationEngine } from '../notifications/notificationEngine';
import { STEVAN_DOMAIN } from '../calendar/calendarEngine';

export const PaymentModal: React.FC = () => {
  const { 
    bookingForPayment, 
    setBookingForPayment, 
    recordPayment,
    setActiveReceipt 
  } = useBookingContext();

  if (!bookingForPayment) return null;

  const booking = bookingForPayment;
  const balanceRemaining = Math.max(0, booking.totalPrice - (booking.amountPaid || 0));
  const depositAmount = Math.round(booking.totalPrice * 0.5);

  const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('deposit');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'apple_pay' | 'google_pay'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form details
  const [cardName, setCardName] = useState(booking.customer.fullName || '');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('883');
  const [zipCode, setZipCode] = useState(booking.customer.zipCode || '38104');

  const amountToCharge = paymentType === 'deposit' 
    ? Math.min(balanceRemaining, depositAmount) 
    : balanceRemaining;

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate 1.2s secure gateway processing
    await new Promise(resolve => setTimeout(resolve, 1100));

    let methodLabel = 'Visa •••• 4242';
    if (selectedMethod === 'apple_pay') methodLabel = 'Apple Pay';
    if (selectedMethod === 'google_pay') methodLabel = 'Google Pay';

    // Record payment and generate automated email receipt
    const receipt = recordPayment(
      booking.id,
      amountToCharge,
      methodLabel,
      paymentType === 'deposit' ? 'deposit' : 'full'
    );

    // Trigger push sound and notification
    notificationEngine.playChimeSound();

    setIsProcessing(false);
    setBookingForPayment(null);

    // Trigger celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7E0D5] w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E7E0D5] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-editorial text-[#2C2825]">
                Secure Payment
              </h2>
              <p className="text-[11px] text-[#8C827A]">
                End-to-end encrypted transaction for {booking.id}
              </p>
            </div>
          </div>

          <button
            onClick={() => setBookingForPayment(null)}
            className="p-2 text-[#8C827A] hover:text-[#2C2825] hover:bg-[#F2ECE2] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleProcessPayment} className="p-6 space-y-5">
          
          {/* Service & Price Overview */}
          <div className="bg-white p-4 rounded-2xl border border-[#E7E0D5] space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-bold text-[#2C2825]">{booking.serviceTitle}</h4>
                <p className="text-[11px] text-[#8C827A] flex items-center space-x-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-[#B25E29]" />
                  <span>{booking.scheduledDate}</span>
                  <span>•</span>
                  <Clock className="w-3 h-3 text-[#B25E29]" />
                  <span>{booking.timeSlot}</span>
                </p>
              </div>
              <span className="text-lg font-bold font-editorial text-[#2C2825]">
                ${booking.totalPrice}
              </span>
            </div>

            {booking.amountPaid > 0 && (
              <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex justify-between">
                <span>Previously Paid:</span>
                <span className="font-bold">${booking.amountPaid}</span>
              </div>
            )}

            {/* Payment Choice: 50% Deposit vs Full Balance */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPaymentType('deposit')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentType === 'deposit'
                    ? 'border-[#B25E29] bg-[#FAF3EC] text-[#2C2825] ring-1 ring-[#B25E29]'
                    : 'border-[#DFD7CA] bg-white text-[#5C554E] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="text-xs font-bold">50% Deposit</div>
                <div className="text-base font-bold font-editorial text-[#B25E29]">
                  ${Math.min(balanceRemaining, depositAmount)}
                </div>
                <div className="text-[10px] text-[#8C827A]">Reserve slot on calendar</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('full')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentType === 'full'
                    ? 'border-[#B25E29] bg-[#FAF3EC] text-[#2C2825] ring-1 ring-[#B25E29]'
                    : 'border-[#DFD7CA] bg-white text-[#5C554E] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="text-xs font-bold">Full Balance</div>
                <div className="text-base font-bold font-editorial text-[#B25E29]">
                  ${balanceRemaining}
                </div>
                <div className="text-[10px] text-[#8C827A]">Settle entire booking</div>
              </button>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#554E46]">Select Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                  selectedMethod === 'card'
                    ? 'bg-[#2C2825] text-white border-[#2C2825]'
                    : 'bg-white text-[#5C554E] border-[#DFD7CA] hover:bg-[#FAF7F2]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('apple_pay')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                  selectedMethod === 'apple_pay'
                    ? 'bg-[#2C2825] text-white border-[#2C2825]'
                    : 'bg-white text-[#5C554E] border-[#DFD7CA] hover:bg-[#FAF7F2]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('google_pay')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                  selectedMethod === 'google_pay'
                    ? 'bg-[#2C2825] text-white border-[#2C2825]'
                    : 'bg-white text-[#5C554E] border-[#DFD7CA] hover:bg-[#FAF7F2]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Google Pay</span>
              </button>
            </div>
          </div>

          {/* Card Details Form */}
          {selectedMethod === 'card' ? (
            <div className="bg-white p-4 rounded-2xl border border-[#E7E0D5] space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#554E46] mb-1">Name on Card</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#554E46] mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full text-xs font-mono bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl pl-3 pr-10 py-2 text-[#2C2825]"
                    required
                  />
                  <CreditCard className="w-4 h-4 text-[#8C827A] absolute right-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#554E46] mb-1">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full text-xs font-mono bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#554E46] mb-1">CVC / CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="•••"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full text-xs font-mono bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825]"
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-[#E7E0D5] text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#FAF3EC] text-[#B25E29] flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#2C2825]">
                Pay with {selectedMethod === 'apple_pay' ? 'Apple Pay' : 'Google Pay'}
              </h4>
              <p className="text-xs text-[#8C827A]">
                Instant 1-touch authentication will verify your transaction securely.
              </p>
            </div>
          )}

          {/* Automated Receipt Notice & Global Billing Terms */}
          <div className="text-[11px] text-[#7A7168] bg-[#F7F4EE] p-3.5 rounded-xl border border-[#E8E1D3] space-y-2">
            <div className="flex items-center space-x-1.5 font-semibold text-[#3D3731]">
              <Receipt className="w-3.5 h-3.5 text-[#B25E29]" />
              <span>Automated Receipt & Calendar Sync</span>
            </div>
            <p>
              An automated email confirmation receipt will immediately be dispatched to <strong>{booking.customer.email}</strong>, detailing service, price, date, and time, and BCC'd to Stevan at <strong>{STEVAN_DOMAIN}</strong>.
            </p>
            <div className="pt-2 border-t border-[#E8E1D3] text-[#6E645A] italic">
              <strong>Billing Terms:</strong> "Materials, specialty hardware, sample paint, purchases, hauling, and unusually complex installs are billed or quoted separately."
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 px-6 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-75"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Securing Transaction...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Pay ${amountToCharge} & Dispatch Receipt</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
