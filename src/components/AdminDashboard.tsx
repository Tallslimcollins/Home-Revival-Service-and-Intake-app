import React, { useState } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Users, 
  Clock, 
  Edit3, 
  CheckCircle2, 
  Plus, 
  Search, 
  Filter, 
  Receipt,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Send,
  MessageSquare,
  ArrowRight,
  FileText,
  UserCheck,
  ChevronRight,
  Check,
  Camera
} from 'lucide-react';
import { useBookingContext } from '../context/BookingContext';
import { BookingStatus, Booking, ClientIntakeInquiry } from '../types';
import { STEVAN_CALENDAR_EMAIL, STEVAN_DOMAIN, generateGoogleCalendarUrl } from '../utils/calendar';
import { GLOBAL_BILLING_TERMS } from '../data/services';

export const AdminDashboard: React.FC = () => {
  const { 
    bookings, 
    services,
    intakes,
    updateIntakeStatus,
    convertIntakeToBooking,
    updateBookingStatus, 
    setBookingForPriceAdjustment, 
    setActiveReceipt,
    setActiveTab,
    createBooking
  } = useBookingContext();

  // Sub-tabs in Admin Dashboard: 'bookings' | 'intakes' | 'calendar'
  const [adminTab, setAdminTab] = useState<'intakes' | 'bookings'>('intakes');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal for converting intake to booking proposal
  const [intakeToConvert, setIntakeToConvert] = useState<ClientIntakeInquiry | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || 'art-hang');
  const [proposalCustomPrice, setProposalCustomPrice] = useState<number>(400);
  const [proposalNotes, setProposalNotes] = useState<string>('');

  // Metrics
  const totalRevenueCollected = bookings.reduce((sum, b) => sum + (b.amountPaid || 0), 0);
  const totalInvoiced = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const pendingIntakesCount = intakes.filter(i => i.status === 'new').length;
  const activeJobsCount = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length;

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredIntakes = intakes.filter(i => {
    const matchesSearch = 
      i.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.priorityFocus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreateWalkInBooking = () => {
    const sample = createBooking({
      serviceId: 'art-hang',
      serviceTitle: 'Art Hang (Direct Studio Walk-in)',
      category: 'art-hang',
      customer: {
        fullName: 'New Studio Client',
        email: 'client@example.com',
        phone: '(901) 555-0100',
        address: 'Direct Memphis Consultation',
        city: 'Memphis',
        zipCode: '38104'
      },
      scheduledDate: new Date().toISOString().split('T')[0],
      timeSlot: '01:30 PM - 05:30 PM (Afternoon)',
      lineItems: [
        {
          id: 'li-direct-1',
          description: 'Art Hang Standard Scope ($400 starting flat rate)',
          amount: 400,
          type: 'base_service'
        }
      ],
      totalPrice: 400,
      specifics: {
        estimatedPieces: 8,
        wallType: 'Drywall',
        arrangementStyle: 'Curated Gallery Wall'
      },
      pushReminderEnabled: true,
      reminderTimes: ['24h', '2h']
    });

    setBookingForPriceAdjustment(sample);
  };

  const handleOpenConvertModal = (intake: ClientIntakeInquiry) => {
    setIntakeToConvert(intake);
    
    // Auto pick smart default service based on intake
    let recommendedSvc = services[0];
    if (intake.priorityFocus.toLowerCase().includes('art hang') || intake.priorityFocus.toLowerCase().includes('gallery')) {
      recommendedSvc = services.find(s => s.id === 'art-hang') || services[0];
    } else if (intake.priorityFocus.toLowerCase().includes('window')) {
      recommendedSvc = services.find(s => s.id === 'window-treatment-plan') || services[0];
    } else if (intake.priorityFocus.toLowerCase().includes('reset') || intake.priorityFocus.toLowerCase().includes('organizing')) {
      recommendedSvc = services.find(s => s.id === 'home-reset-organizing') || services[0];
    } else if (intake.priorityFocus.toLowerCase().includes('unpack') || intake.priorityFocus.toLowerCase().includes('move')) {
      recommendedSvc = services.find(s => s.id === 'move-in-unpack-setup') || services[0];
    } else if (intake.priorityFocus.toLowerCase().includes('color') || intake.priorityFocus.toLowerCase().includes('paint')) {
      recommendedSvc = services.find(s => s.id === 'color-palette-plan') || services[0];
    } else if (intake.priorityFocus.toLowerCase().includes('multi-room') || intake.priorityFocus.toLowerCase().includes('roadmap')) {
      recommendedSvc = services.find(s => s.id === 'full-home-revival-plan') || services[0];
    } else {
      recommendedSvc = services.find(s => s.id === 'room-setup-styling') || services[0];
    }

    setSelectedServiceId(recommendedSvc.id);
    setProposalCustomPrice(recommendedSvc.basePrice);
    setProposalNotes(`Recommended ${recommendedSvc.title} based on your situation: "${intake.currentSituation.slice(0, 100)}..."`);
  };

  const handleConfirmConvert = () => {
    if (!intakeToConvert) return;
    const newBooking = convertIntakeToBooking(intakeToConvert.id, selectedServiceId, proposalCustomPrice);
    setIntakeToConvert(null);
    setAdminTab('bookings');
    // Open Price Adjuster so Stevan can fine tune lines or immediately send proposal
    setBookingForPriceAdjustment(newBooking);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner: Studio Admin Mode Notice */}
      <div className="bg-[#2C2825] text-white p-6 rounded-3xl border border-[#403A35] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-600 text-white font-bold">
              Admin Mode
            </span>
            <span className="text-xs text-stone-300">Stevan Collins Lazich Studio Command</span>
          </div>
          <h1 className="text-2xl font-bold font-editorial text-[#FAF8F5] mt-1">
            Studio Command & Client Inquiries
          </h1>
          <p className="text-xs text-stone-300 mt-1">
            Review new client inquiries, dispatch custom proposals, adjust prices & scope, and manage synced bookings. Real-time sync with <strong>{STEVAN_DOMAIN}</strong> ({STEVAN_CALENDAR_EMAIL}).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('calendar-hub')}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-stone-800 text-stone-200 hover:text-white hover:bg-stone-700 transition-colors"
          >
            Calendar Hub
          </button>
          <button
            onClick={handleCreateWalkInBooking}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#B25E29] hover:bg-[#C96B30] text-white transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Custom Order</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5]">
          <div className="flex items-center justify-between text-[#8C827A] mb-2 text-xs">
            <span>New Client Inquiries</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-editorial text-[#2C2825]">
            {intakes.length}
          </div>
          <span className="text-[11px] text-amber-800 font-medium">
            {pendingIntakesCount} pending personal review
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5]">
          <div className="flex items-center justify-between text-[#8C827A] mb-2 text-xs">
            <span>Collected Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-editorial text-[#2C2825]">
            ${totalRevenueCollected}
          </div>
          <span className="text-[11px] text-[#8C827A]">
            Out of ${totalInvoiced} total invoiced
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5]">
          <div className="flex items-center justify-between text-[#8C827A] mb-2 text-xs">
            <span>Active Appointments</span>
            <Calendar className="w-4 h-4 text-[#B25E29]" />
          </div>
          <div className="text-2xl font-bold font-editorial text-[#2C2825]">
            {activeJobsCount}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">
            Synced with {STEVAN_DOMAIN}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5]">
          <div className="flex items-center justify-between text-[#8C827A] mb-2 text-xs">
            <span>Calendar Auto-Sync</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-[#2C2825] mt-1 font-mono truncate">
            {STEVAN_CALENDAR_EMAIL}
          </div>
          <span className="text-[11px] text-[#8C827A]">
            Auto-BCC receipts & reminders
          </span>
        </div>
      </div>

      {/* Main Admin Switcher Tabs: Intakes vs Bookings */}
      <div className="flex items-center space-x-2 border-b border-[#E7E0D5] pb-3">
        <button
          onClick={() => setAdminTab('intakes')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
            adminTab === 'intakes'
              ? 'bg-[#2C2825] text-white shadow-sm'
              : 'bg-white text-[#5C554E] border border-[#E2DAD0] hover:bg-[#F2ECE2]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>New Client Intake Inquiries</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold ml-1">
            {intakes.length}
          </span>
        </button>

        <button
          onClick={() => setAdminTab('bookings')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
            adminTab === 'bookings'
              ? 'bg-[#2C2825] text-white shadow-sm'
              : 'bg-white text-[#5C554E] border border-[#E2DAD0] hover:bg-[#F2ECE2]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-amber-300" />
          <span>Active Bookings & Price Adjuster</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#B25E29] text-white font-bold ml-1">
            {bookings.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW A: NEW CLIENT INTAKE INQUIRIES TAB                                   */}
      {/* ========================================================================= */}
      {adminTab === 'intakes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E7E0D5] p-6 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-bold text-lg font-editorial text-[#2C2825]">
                  New Client Inquiries & Overviews
                </h3>
                <p className="text-xs text-[#7A7168]">
                  Clients seeking guidance, single-room resets, art hanging, or full roadmaps.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#8C827A] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search name, neighborhood, problem..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl text-[#2C2825] focus:ring-1 focus:ring-[#B25E29]"
                />
              </div>
            </div>

            {/* Intakes List */}
            <div className="space-y-4">
              {filteredIntakes.map(intake => (
                <div 
                  key={intake.id}
                  className="p-5 rounded-2xl border border-[#E7E0D5] bg-[#FAF8F5] hover:border-[#D4A373] transition-all space-y-4"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-[#ECE5D8] pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-bold text-[#8C461C] bg-[#FAF3EC] px-2.5 py-1 rounded-md border border-[#ECD8C8]">
                        {intake.id}
                      </span>
                      <div>
                        <h4 className="font-bold text-base font-editorial text-[#2C2825]">
                          {intake.fullName}
                        </h4>
                        <div className="text-xs text-[#7A7168] flex items-center space-x-2">
                          <span>{intake.neighborhood}</span>
                          <span>•</span>
                          <span>{intake.homeAgeOrWallTypes}</span>
                          <span>•</span>
                          <span>{new Date(intake.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <select
                        value={intake.status}
                        onChange={(e) => updateIntakeStatus(intake.id, e.target.value as any)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                          intake.status === 'new' 
                            ? 'bg-amber-100 text-amber-900 border-amber-300' 
                            : intake.status === 'reviewed'
                            ? 'bg-blue-100 text-blue-900 border-blue-300'
                            : intake.status === 'converted'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-purple-100 text-purple-900 border-purple-300'
                        }`}
                      >
                        <option value="new">New Intake</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="proposal_sent">Proposal Sent</option>
                        <option value="converted">Converted to Booking</option>
                      </select>

                      <button
                        onClick={() => handleOpenConvertModal(intake)}
                        className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#2C2825] hover:bg-[#B25E29] text-white transition-colors shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Convert to Booking / Send Proposal</span>
                      </button>
                    </div>
                  </div>

                  {/* Context Narrative */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#EBE3D6]">
                      <span className="font-bold text-[#2C2825] block uppercase text-[10px] tracking-wider text-[#9A4616]">
                        Current Situation in the Home:
                      </span>
                      <p className="text-[#4A453F] leading-relaxed">
                        "{intake.currentSituation}"
                      </p>
                    </div>

                    <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#EBE3D6]">
                      <span className="font-bold text-[#2C2825] block uppercase text-[10px] tracking-wider text-[#9A4616]">
                        What Feels Heaviest to Face Alone:
                      </span>
                      <p className="text-[#4A453F] leading-relaxed">
                        "{intake.heaviestChallenge}"
                      </p>
                    </div>
                  </div>

                  {/* Details strip */}
                  <div className="flex flex-wrap items-center justify-between text-xs pt-1 text-[#6F6458] gap-2">
                    <div className="flex items-center space-x-4">
                      <span><strong>Priority:</strong> {intake.priorityFocus}</span>
                      <span><strong>Email:</strong> {intake.email}</span>
                      <span><strong>Phone:</strong> {intake.phone}</span>
                    </div>

                    {intake.photoNotes && (
                      <div className="flex items-center space-x-1.5 text-stone-600 bg-white px-2.5 py-1 rounded-md border border-[#E0D7C8]">
                        <Camera className="w-3.5 h-3.5 text-[#B25E29]" />
                        <span>{intake.photoNotes}</span>
                      </div>
                    )}
                  </div>

                  {intake.convertedBookingId && (
                    <div className="pt-2 border-t border-[#E8DFD2] flex items-center justify-between text-xs text-emerald-800">
                      <span className="font-medium">
                        ✓ Converted to booking ID: <strong>{intake.convertedBookingId}</strong>
                      </span>
                      <button
                        onClick={() => {
                          const target = bookings.find(b => b.id === intake.convertedBookingId);
                          if (target) {
                            setAdminTab('bookings');
                            setBookingForPriceAdjustment(target);
                          }
                        }}
                        className="text-[#B25E29] underline font-semibold"
                      >
                        Open Proposal in Adjuster →
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: BOOKINGS & SCOPE ADJUSTER TABLE                                   */}
      {/* ========================================================================= */}
      {adminTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-[#E7E0D5] p-6 space-y-5">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#8C827A] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search clients, address, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl text-[#2C2825] focus:ring-1 focus:ring-[#B25E29]"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-[#8C827A]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-[#FAF7F2] border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825]"
              >
                <option value="all">All Statuses</option>
                <option value="pending_review">Pending Review</option>
                <option value="quote_adjusted">Quote Adjusted</option>
                <option value="deposit_paid">Deposit Paid</option>
                <option value="paid_in_full">Paid in Full</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#F0EBE1] text-[#7A7168] uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Booking ID & Date</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Service & Specifics</th>
                  <th className="py-3 px-3">Total / Paid</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F4EE]">
                {filteredBookings.map(b => {
                  const googleCalUrl = generateGoogleCalendarUrl(b);
                  const hasReceipt = b.receipts && b.receipts.length > 0;

                  return (
                    <tr key={b.id} className="hover:bg-[#FAF8F5] transition-colors">
                      
                      {/* Booking ID & Date */}
                      <td className="py-3 px-3 align-top">
                        <span className="font-mono font-bold text-[#2C2825] block">{b.id}</span>
                        <span className="text-[11px] text-[#7A7168] flex items-center space-x-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-[#B25E29]" />
                          <span>{b.scheduledDate}</span>
                        </span>
                        <span className="text-[10px] text-[#A2988F] block">{b.timeSlot}</span>
                      </td>

                      {/* Client */}
                      <td className="py-3 px-3 align-top">
                        <span className="font-bold text-[#2C2825] block">{b.customer.fullName}</span>
                        <span className="text-[11px] text-[#5C554E] block">{b.customer.phone}</span>
                        <span className="text-[11px] text-[#8C827A] truncate max-w-xs block">
                          {b.customer.address}, {b.customer.city}
                        </span>
                      </td>

                      {/* Service & Specifics */}
                      <td className="py-3 px-3 align-top">
                        <span className="font-semibold text-[#2C2825] block">{b.serviceTitle}</span>
                        <div className="text-[11px] text-[#7A7168] mt-1 space-y-0.5">
                          {Object.entries(b.specifics || {}).slice(0, 3).map(([k, v]) => (
                            <div key={k} className="truncate max-w-xs">
                              <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span> {String(v)}
                            </div>
                          ))}
                        </div>
                        {b.adjustments && b.adjustments.length > 0 && (
                          <span className="inline-block mt-1 text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Adjusted: {b.adjustments[0].reason}
                          </span>
                        )}
                      </td>

                      {/* Total / Paid */}
                      <td className="py-3 px-3 align-top">
                        <div className="text-sm font-bold font-editorial text-[#2C2825]">
                          ${b.totalPrice}
                        </div>
                        <span className="text-[11px] text-emerald-700 block font-medium">
                          Paid: ${b.amountPaid}
                        </span>
                        {b.totalPrice > b.amountPaid && (
                          <span className="text-[10px] text-amber-800">
                            Due: ${b.totalPrice - b.amountPaid}
                          </span>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3 px-3 align-top">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                          className="text-[11px] font-semibold bg-[#FAF7F2] border border-[#DCD3C5] rounded-lg px-2 py-1 text-[#2C2825]"
                        >
                          <option value="pending_review">Pending Review</option>
                          <option value="quote_adjusted">Quote Adjusted</option>
                          <option value="deposit_paid">Deposit Paid</option>
                          <option value="paid_in_full">Paid in Full</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 align-top text-right">
                        <div className="flex flex-col items-end space-y-1.5">
                          {/* THE CORE BUTTON: Adjust Price and Specifics */}
                          <button
                            onClick={() => setBookingForPriceAdjustment(b)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors shadow-sm"
                            title="Adjust line items, materials, hourly rate, and specifics"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Adjust Price & Scope</span>
                          </button>

                          <div className="flex items-center space-x-1">
                            {hasReceipt && (
                              <button
                                onClick={() => setActiveReceipt({ receipt: b.receipts[0], booking: b })}
                                className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded border border-emerald-200"
                                title="View Automated Email Receipt"
                              >
                                <Receipt className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <a
                              href={googleCalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-stone-600 hover:text-[#B25E29] hover:bg-stone-100 rounded border border-stone-200"
                              title="Sync with Stevan's Google Calendar"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONVERT INTAKE TO PROPOSAL / BOOKING MODAL                                 */}
      {/* ========================================================================= */}
      {intakeToConvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7E0D5] w-full max-w-xl shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-[#EAE3D6] pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#9A4616]">
                  Studio Proposal Generator
                </span>
                <h3 className="text-xl font-bold font-editorial text-[#2C2825]">
                  Convert Intake to Proposal for {intakeToConvert.fullName}
                </h3>
              </div>
              <button
                onClick={() => setIntakeToConvert(null)}
                className="text-[#8C827A] hover:text-[#2C2825]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2C2825] mb-1">
                  Select Returning Clients Service Base:
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => {
                    const sid = e.target.value;
                    setSelectedServiceId(sid);
                    const found = services.find(s => s.id === sid);
                    if (found) setProposalCustomPrice(found.basePrice);
                  }}
                  className="w-full bg-white border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825]"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.displayPriceLabel} - {s.menuBadge})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#2C2825] mb-1">
                  Proposed Initial Price ($ USD):
                </label>
                <input
                  type="number"
                  value={proposalCustomPrice}
                  onChange={(e) => setProposalCustomPrice(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-white border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2C2825] font-bold font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2C2825] mb-1">
                  Proposal Notes for Client:
                </label>
                <textarea
                  rows={2}
                  value={proposalNotes}
                  onChange={(e) => setProposalNotes(e.target.value)}
                  className="w-full bg-white border border-[#DCD3C5] rounded-xl p-3 text-[#2C2825]"
                />
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE5D8] text-[11px] text-[#7A7168] italic">
                <strong>Billing Terms:</strong> "{GLOBAL_BILLING_TERMS}"
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIntakeToConvert(null)}
                className="px-4 py-2 text-xs font-semibold text-[#554E46] hover:text-[#2C2825]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmConvert}
                className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#B25E29] hover:bg-[#C96B30] text-white transition-colors shadow-sm flex items-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Create Booking & Open Scope Adjuster</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
