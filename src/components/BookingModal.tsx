import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  SlidersHorizontal,
  Info,
  DollarSign
} from 'lucide-react';
import { useBookingContext } from '../context/BookingContext';
import { LineItem } from '../types';
import confetti from 'canvas-confetti';

export const BookingModal: React.FC = () => {
  const { 
    selectedServiceForBooking, 
    setSelectedServiceForBooking, 
    createBooking, 
    setActiveTab,
    setBookingForPayment
  } = useBookingContext();

  if (!selectedServiceForBooking) return null;

  const service = selectedServiceForBooking;

  // Step state: 1 = specifics, 2 = schedule & contact, 3 = quote review
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Specifics form state
  const [specifics, setSpecifics] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = { ...service.defaultSpecifics };
    service.specificOptions.forEach(opt => {
      if (init[opt.id] === undefined) {
        init[opt.id] = opt.defaultValue;
      }
    });
    return init;
  });

  // Schedule & Contact State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [scheduledDate, setScheduledDate] = useState<string>(defaultDateStr);
  const [timeSlot, setTimeSlot] = useState<string>('09:00 AM - 01:00 PM (Morning)');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  const [customer, setCustomer] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Memphis',
    zipCode: '38104'
  });

  // Calculate live dynamic line items based on specifics
  const calculateLineItems = (): LineItem[] => {
    const items: LineItem[] = [];

    // Base item
    if (service.pricingModel === 'hourly') {
      const hours = Number(specifics.estimatedHours || 2);
      items.push({
        id: 'li-base',
        description: `${service.title} (${hours} hrs @ $${service.basePrice}/hr)`,
        amount: hours * service.basePrice,
        type: 'base_service'
      });
    } else {
      items.push({
        id: 'li-base',
        description: `${service.title} (Base Scope)`,
        amount: service.basePrice,
        type: 'base_service'
      });
    }

    // Add modifier items
    service.specificOptions.forEach(opt => {
      const val = specifics[opt.id];
      if (opt.priceModifier && opt.type === 'boolean' && val === true) {
        items.push({
          id: `li-mod-${opt.id}`,
          description: `Add-on: ${opt.name}`,
          amount: opt.priceModifier,
          type: 'materials'
        });
      }
    });

    return items;
  };

  const lineItems = calculateLineItems();
  const totalPrice = lineItems.reduce((acc, curr) => acc + curr.amount, 0);

  const handleSpecificChange = (id: string, value: any) => {
    setSpecifics(prev => ({ ...prev, [id]: value }));
  };

  const handleCustomerChange = (field: string, val: string) => {
    setCustomer(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (andProceedToPayment: boolean) => {
    if (!customer.fullName || !customer.email || !customer.phone || !customer.address) {
      alert('Please fill in your name, email, phone, and Memphis area service address.');
      return;
    }

    const newBooking = createBooking({
      serviceId: service.id,
      serviceTitle: service.title,
      category: service.category,
      customer,
      scheduledDate,
      timeSlot,
      lineItems,
      totalPrice,
      specifics,
      specialInstructions,
      pushReminderEnabled: true,
      reminderTimes: ['24h', '2h']
    });

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    setSelectedServiceForBooking(null);

    if (andProceedToPayment) {
      setBookingForPayment(newBooking);
    } else {
      setActiveTab('my-bookings');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7E0D5] w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E7E0D5] flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-[#B25E29] bg-[#FAF2EB] px-2.5 py-0.5 rounded-full border border-[#F0DDCF]">
                Home Revival Intake
              </span>
              <span className="text-xs text-[#8C827A]">Step {step} of 3</span>
            </div>
            <h2 className="text-xl font-bold font-editorial text-[#2C2825] mt-1">
              {service.title}
            </h2>
          </div>

          <button
            onClick={() => setSelectedServiceForBooking(null)}
            className="p-2 text-[#8C827A] hover:text-[#2C2825] hover:bg-[#F2ECE2] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step progress bar */}
        <div className="grid grid-cols-3 bg-[#F0EBE1] h-1.5">
          <div className={`h-full bg-[#B25E29] transition-all duration-300 ${step >= 1 ? 'w-full' : 'w-0'}`}></div>
          <div className={`h-full bg-[#B25E29] transition-all duration-300 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
          <div className={`h-full bg-[#B25E29] transition-all duration-300 ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: SPECIFICS CONFIGURATION */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-[#F4EEE4] p-4 rounded-2xl border border-[#E5DACB] text-xs text-[#554E46] flex items-start space-x-3">
                <SlidersHorizontal className="w-5 h-5 text-[#B25E29] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#2C2825] mb-0.5">Customize your service specifics</p>
                  <p>Choose your parameters below. Note: You and Stevan can also adjust prices, line items, and specifics anytime after booking.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.specificOptions.map(opt => (
                  <div key={opt.id} className="bg-white p-4 rounded-2xl border border-[#E7E0D5] flex flex-col justify-between">
                    <div>
                      <label className="block text-xs font-bold text-[#2C2825] mb-1">
                        {opt.name}
                      </label>
                      {opt.description && (
                        <p className="text-[11px] text-[#8C827A] mb-2">{opt.description}</p>
                      )}
                    </div>

                    <div className="mt-2">
                      {opt.type === 'select' && opt.options && (
                        <select
                          value={specifics[opt.id] ?? opt.defaultValue}
                          onChange={(e) => handleSpecificChange(opt.id, e.target.value)}
                          className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825] focus:ring-2 focus:ring-[#B25E29] focus:outline-none"
                        >
                          {opt.options.map(optionVal => (
                            <option key={optionVal} value={optionVal}>{optionVal}</option>
                          ))}
                        </select>
                      )}

                      {opt.type === 'number' && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={specifics[opt.id] ?? opt.defaultValue}
                            onChange={(e) => handleSpecificChange(opt.id, Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-24 text-xs font-semibold bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825] focus:ring-2 focus:ring-[#B25E29] focus:outline-none"
                          />
                          {opt.unit && (
                            <span className="text-xs font-medium text-[#7A7168]">{opt.unit}</span>
                          )}
                        </div>
                      )}

                      {opt.type === 'boolean' && (
                        <label className="flex items-center space-x-2 cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            checked={Boolean(specifics[opt.id])}
                            onChange={(e) => handleSpecificChange(opt.id, e.target.checked)}
                            className="w-4 h-4 rounded text-[#B25E29] focus:ring-[#B25E29] border-[#DCD3C5]"
                          />
                          <span className="text-xs text-[#4A453F]">
                            Include this option {opt.priceModifier ? `(+$${opt.priceModifier})` : ''}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live quote preview */}
              <div className="bg-white p-4 rounded-2xl border border-[#E7E0D5] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8C827A] uppercase font-medium">Estimated Starting Quote</span>
                  <div className="text-2xl font-bold font-editorial text-[#2C2825]">
                    ${totalPrice}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors shadow-sm"
                >
                  <span>Select Date & Time</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SCHEDULE & CONTACT */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5] space-y-4">
                <h3 className="text-sm font-bold text-[#2C2825] flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#B25E29]" />
                  <span>Choose Your Preferred Date & Arrival Window</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#554E46] mb-1">
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      min={defaultDateStr}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2.5 text-[#2C2825] focus:ring-2 focus:ring-[#B25E29]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#554E46] mb-1">
                      Time Slot
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2.5 text-[#2C2825] focus:ring-2 focus:ring-[#B25E29]"
                    >
                      <option value="09:00 AM - 01:00 PM (Morning)">09:00 AM - 01:00 PM (Morning Window)</option>
                      <option value="01:30 PM - 05:30 PM (Afternoon)">01:30 PM - 05:30 PM (Afternoon Window)</option>
                      <option value="09:00 AM - 04:00 PM (Full Day)">09:00 AM - 04:00 PM (Full Day Session)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Contact & Address in Memphis */}
              <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5] space-y-4">
                <h3 className="text-sm font-bold text-[#2C2825] flex items-center space-x-2">
                  <User className="w-4 h-4 text-[#B25E29]" />
                  <span>Contact Information & Service Location</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#554E46] mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      value={customer.fullName}
                      onChange={(e) => handleCustomerChange('fullName', e.target.value)}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825] focus:ring-2 focus:ring-[#B25E29]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#554E46] mb-1">Email Address *</label>
                    <input
                      type="email"
                      placeholder="eleanor@example.com"
                      value={customer.email}
                      onChange={(e) => handleCustomerChange('email', e.target.value)}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825] focus:ring-2 focus:ring-[#B25E29]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#554E46] mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="(901) 555-0194"
                      value={customer.phone}
                      onChange={(e) => handleCustomerChange('phone', e.target.value)}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825] focus:ring-2 focus:ring-[#B25E29]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#554E46] mb-1">Street Address *</label>
                    <input
                      type="text"
                      placeholder="e.g. 2188 Central Ave, Midtown"
                      value={customer.address}
                      onChange={(e) => handleCustomerChange('address', e.target.value)}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825] focus:ring-2 focus:ring-[#B25E29]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#554E46] mb-1">City / Region</label>
                    <select
                      value={customer.city}
                      onChange={(e) => handleCustomerChange('city', e.target.value)}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825]"
                    >
                      <option value="Memphis (Midtown / Downtown / East)">Memphis (Midtown / Downtown / East)</option>
                      <option value="Germantown">Germantown</option>
                      <option value="Collierville">Collierville</option>
                      <option value="Cordova / Bartlett">Cordova / Bartlett</option>
                      <option value="Other Mid-South Area">Other Mid-South Area</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#554E46] mb-1">ZIP Code</label>
                    <input
                      type="text"
                      placeholder="38104"
                      value={customer.zipCode}
                      onChange={(e) => handleCustomerChange('zipCode', e.target.value)}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#554E46] mb-1">
                    Special Room Notes or Architectural Details
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Antique plaster walls, 12ft ceiling height, staircase gallery wall, bringing 4 frames..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl p-3 text-[#2C2825] focus:ring-2 focus:ring-[#B25E29]"
                  ></textarea>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center space-x-1 text-xs text-[#554E46] hover:text-[#2C2825] font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to specifics</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!customer.fullName || !customer.email || !customer.phone || !customer.address) {
                      alert('Please fill in your name, email, phone, and street address.');
                      return;
                    }
                    setStep(3);
                  }}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors shadow-sm"
                >
                  <span>Review Quote & Booking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: QUOTE REVIEW & CONFIRMATION */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5] space-y-4">
                <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-[#2C2825] font-editorial text-base">
                      Booking Summary & Itemized Estimate
                    </h3>
                    <p className="text-[11px] text-[#8C827A]">
                      Scheduled for {scheduledDate} • {timeSlot}
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold">
                    Flexible Scope
                  </span>
                </div>

                {/* Line items list */}
                <div className="space-y-2 py-2">
                  {lineItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-xs text-[#4A453F]">
                      <span className="font-medium">{item.description}</span>
                      <span className="font-bold font-mono text-[#2C2825]">${item.amount}</span>
                    </div>
                  ))}

                  <div className="border-t border-[#F0EBE1] pt-3 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-[#2C2825]">Total Estimated Price</span>
                      <p className="text-[11px] text-[#8C827A]">Includes standard hanging hardware and materials</p>
                    </div>
                    <span className="text-2xl font-bold font-editorial text-[#2C2825]">
                      ${totalPrice}
                    </span>
                  </div>
                </div>

                {/* Specifics recap */}
                <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EDE5D8] text-xs text-[#554E46] space-y-1">
                  <span className="font-bold text-[#2C2825]">Configured Specifics:</span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-[#6B6156] pt-1">
                    {Object.entries(specifics).map(([key, val]) => (
                      <div key={key}>
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                        <strong className="text-[#2C2825]">{String(val)}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important notice: Price adjustment flexibility */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-[#B25E29] shrink-0 mt-0.5" />
                  <p>
                    <strong>Price & Specifics Adjustment Guarantee:</strong> You or Stevan can adjust the line items, hours, and materials specifics after submission. If adjusted, you'll receive an instant notification and revised quote.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1 text-xs text-[#554E46] hover:text-[#2C2825] font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Modify appointment details</span>
                </button>

                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => handleSubmit(false)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold bg-white border border-[#DFD7CA] text-[#2C2825] hover:bg-[#F2ECE2] transition-colors"
                  >
                    Submit for Review First
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSubmit(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Confirm & Pay Securely</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
