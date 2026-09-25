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
  SlidersHorizontal,
  Info,
  AlertTriangle,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useBookingContext } from '../../context/BookingContext';
import { LineItem } from '../../types';
import { INITIAL_EXTERNAL_BUSY_SLOTS, isSlotBlockedByExternalCalendar, STEVAN_DOMAIN } from '../calendar/calendarEngine';
import { GLOBAL_BILLING_TERMS } from '../../data/services';
import confetti from 'canvas-confetti';

export const SchedulingWizard: React.FC = () => {
  const { 
    selectedServiceForBooking, 
    setSelectedServiceForBooking, 
    createBooking, 
    setActiveTab,
    setBookingForPayment
  } = useBookingContext();

  if (!selectedServiceForBooking) return null;

  const service = selectedServiceForBooking;

  // Wizard step: 1 = Specifics, 2 = Date & Time Slot, 3 = Review
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Specifics state
  const [specifics, setSpecifics] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = { ...service.defaultSpecifics };
    service.specificOptions.forEach(opt => {
      if (init[opt.id] === undefined) {
        init[opt.id] = opt.defaultValue;
      }
    });
    return init;
  });

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

  // Check inbound external availability from stevancollinslazich.com
  const blockedSlot = isSlotBlockedByExternalCalendar(
    scheduledDate, 
    timeSlot, 
    INITIAL_EXTERNAL_BUSY_SLOTS
  );

  // Live dynamic line items
  const calculateLineItems = (): LineItem[] => {
    const items: LineItem[] = [];

    if (service.pricingModel === 'custom_quote') {
      items.push({
        id: 'li-base',
        description: `${service.title} (Quoted custom by scale & install)`,
        amount: 0,
        type: 'base_service'
      });
    } else if (service.pricingModel === 'from') {
      items.push({
        id: 'li-base',
        description: `${service.title} (Base package: ${service.displayPriceLabel})`,
        amount: service.basePrice,
        type: 'base_service'
      });
    } else {
      items.push({
        id: 'li-base',
        description: `${service.title} (Standard flat rate)`,
        amount: service.basePrice,
        type: 'base_service'
      });
    }

    // Add-on modifiers (e.g. Color Testing Add-On — $125)
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

    if (blockedSlot) {
      alert(`The selected slot on ${scheduledDate} is blocked by Stevan's schedule on ${STEVAN_DOMAIN}. Please choose a different date or time.`);
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
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });

    setSelectedServiceForBooking(null);

    // If custom quote, client submits for review directly without payment
    if (andProceedToPayment && totalPrice > 0) {
      setBookingForPayment(newBooking);
    } else {
      setActiveTab('my-bookings');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7E0D5] w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E7E0D5] flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#9A4616] bg-[#FAF3EC] px-2.5 py-0.5 rounded-full border border-[#ECD8C8]">
                {service.menuBadge}
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

        {/* Progress Bar */}
        <div className="grid grid-cols-3 bg-[#F0EBE1] h-1.5">
          <div className={`h-full bg-[#B25E29] transition-all duration-300 ${step >= 1 ? 'w-full' : 'w-0'}`}></div>
          <div className={`h-full bg-[#B25E29] transition-all duration-300 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
          <div className={`h-full bg-[#B25E29] transition-all duration-300 ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: SPECIFICS CONFIGURATION */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-[#F4EEE4] p-4 rounded-2xl border border-[#E5DACB] text-xs text-[#554E46] flex items-start space-x-3">
                <SlidersHorizontal className="w-5 h-5 text-[#B25E29] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#2C2825] mb-0.5">Customize service specifics</p>
                  <p>{service.tagline}</p>
                </div>
              </div>

              {/* Scope Boundaries / Exclusions Notice */}
              {service.exclusions && service.exclusions.length > 0 && (
                <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-[#8C461C]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Scope Boundaries & Verified Guardrails:</span>
                  </div>
                  {service.exclusions.map((exc, idx) => (
                    <p key={idx} className="text-[#644A32] pl-5 leading-relaxed">
                      • {exc}
                    </p>
                  ))}
                </div>
              )}

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
                        <div className="space-y-2">
                          <select
                            value={specifics[opt.id] ?? opt.defaultValue}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleSpecificChange(opt.id, val);
                              if (!val.toLowerCase().includes('other')) {
                                handleSpecificChange(`${opt.id}_custom`, undefined);
                              }
                            }}
                            className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] focus:border-[#B25E29] focus:outline-none rounded-xl px-3 py-2 text-[#2C2825]"
                          >
                            {opt.options.map(optionVal => (
                              <option key={optionVal} value={optionVal}>{optionVal}</option>
                            ))}
                          </select>
                          {String(specifics[opt.id] ?? opt.defaultValue).toLowerCase().includes('other') && (
                            <div className="space-y-1">
                              <label className="block text-[11px] font-semibold text-[#8C461C]">
                                Specify your room or space:
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Garage apartment, sunroom, outdoor living patio, mudroom..."
                                value={specifics[`${opt.id}_custom`] || ''}
                                onChange={(e) => handleSpecificChange(`${opt.id}_custom`, e.target.value)}
                                className="w-full text-xs bg-white border border-[#B25E29]/50 focus:border-[#B25E29] focus:ring-1 focus:ring-[#B25E29] focus:outline-none rounded-xl px-3 py-2 text-[#2C2825] placeholder:text-[#A89F91]"
                                autoFocus
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {opt.type === 'number' && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={specifics[opt.id] ?? opt.defaultValue}
                            onChange={(e) => handleSpecificChange(opt.id, Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-24 text-xs font-semibold bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825]"
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
                            className="w-4 h-4 rounded text-[#B25E29] focus:ring-[#B25E29]"
                          />
                          <span className="text-xs font-medium text-[#3D3731]">
                            Include {opt.priceModifier ? `(+$${opt.priceModifier})` : ''}
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
                  <span className="text-xs text-[#8C827A] uppercase font-medium">
                    {service.pricingModel === 'custom_quote' ? 'Pricing Structure' : 'Base Service Rate'}
                  </span>
                  <div className="text-2xl font-bold font-editorial text-[#2C2825]">
                    {service.pricingModel === 'custom_quote' 
                      ? 'Custom Quote' 
                      : `$${totalPrice}`}
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
              
              {/* Inbound Calendar Warning if slot is blocked externally */}
              {blockedSlot && (
                <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl text-xs text-amber-900 flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Two-Way Calendar Sync Conflict Notice:</strong>
                    <span>
                      This time slot on {scheduledDate} is blocked on Stevan's studio calendar ({blockedSlot.title}). Please choose an alternate morning or afternoon window below.
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5] space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[#2C2825] flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[#B25E29]" />
                    <span>Select Appointment Date & Time Window</span>
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    ✓ Checked against {STEVAN_DOMAIN}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#554E46] mb-1">
                      Preferred Date
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

              {/* Customer Contact & Address */}
              <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5] space-y-4">
                <h3 className="text-sm font-bold text-[#2C2825] flex items-center space-x-2">
                  <User className="w-4 h-4 text-[#B25E29]" />
                  <span>Contact Information & Memphis Area Address</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#554E46] mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      value={customer.fullName}
                      onChange={(e) => handleCustomerChange('fullName', e.target.value)}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825]"
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
                      className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825]"
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
                      className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825]"
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
                      className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825]"
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
                    placeholder="e.g., Antique plaster walls, staircase gallery wall, specific frame count..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl p-3 text-[#2C2825]"
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
                    if (blockedSlot) {
                      alert(`The slot is blocked by an external event. Please change the time slot.`);
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

          {/* STEP 3: QUOTE REVIEW */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5] space-y-4">
                <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
                  <div>
                    <h3 className="font-bold text-base font-editorial text-[#2C2825]">
                      Booking Summary & Itemized Estimate
                    </h3>
                    <p className="text-[11px] text-[#8C827A]">
                      Scheduled for {scheduledDate} • {timeSlot}
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-semibold">
                    {service.menuBadge}
                  </span>
                </div>

                <div className="space-y-2 py-2">
                  {lineItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-xs text-[#4A453F]">
                      <span className="font-medium">{item.description}</span>
                      <span className="font-bold font-mono text-[#2C2825]">
                        {service.pricingModel === 'custom_quote' && item.amount === 0 
                          ? 'Quoted Custom' 
                          : `$${item.amount}`}
                      </span>
                    </div>
                  ))}

                  <div className="border-t border-[#F0EBE1] pt-3 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-[#2C2825]">
                        {service.pricingModel === 'custom_quote' ? 'Total Scope Status' : 'Starting Base Price'}
                      </span>
                      <p className="text-[11px] text-[#8C827A]">
                        {service.pricingModel === 'from' ? 'Final quote confirmed on-site or after walkthrough' : 'Covers standard service scope'}
                      </p>
                    </div>
                    <span className="text-2xl font-bold font-editorial text-[#2C2825]">
                      {service.pricingModel === 'custom_quote' ? 'Custom Quote' : `$${totalPrice}`}
                    </span>
                  </div>
                </div>

                {/* MANDATORY GLOBAL BILLING TERMS BANNER */}
                <div className="p-3.5 bg-stone-100/90 border border-stone-300/80 rounded-2xl text-xs text-stone-700 flex items-start space-x-2.5">
                  <FileText className="w-4 h-4 text-[#8C461C] shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong className="block text-[#2C2825] font-semibold mb-0.5">Billing Terms & Policy:</strong>
                    <span>"{GLOBAL_BILLING_TERMS}"</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl text-xs text-stone-600 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-[#B25E29] shrink-0 mt-0.5" />
                  <p>
                    <strong>Price & Specifics Adjustment Flexibility:</strong> You or Stevan can adjust line items, materials specifics, or hours at any time. Changes sync directly to the calendar and update your receipt.
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
                    Submit for Review & Calendar Hold
                  </button>

                  {totalPrice > 0 ? (
                    <button
                      type="button"
                      onClick={() => handleSubmit(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>Confirm & Pay Securely</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSubmit(false)}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors shadow-sm"
                    >
                      <span>Submit for Custom Commission Quote</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
