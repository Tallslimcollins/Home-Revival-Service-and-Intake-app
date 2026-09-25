import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  Bell, 
  SlidersHorizontal, 
  Check, 
  Palette, 
  Frame, 
  Layers, 
  Compass,
  Briefcase
} from 'lucide-react';
import { BookingProvider, useBookingContext } from './context/BookingContext';
import { Header } from './components/Header';
import { ServiceCard } from './components/ServiceCard';
import { AdminDashboard } from './components/AdminDashboard';
import { SchedulingWizard } from './modules/scheduling/SchedulingWizard';
import { PriceAdjusterModal } from './modules/price-adjuster/PriceAdjusterModal';
import { PaymentModal } from './modules/payments/PaymentModal';
import { ReceiptModal } from './modules/receipts/ReceiptModal';
import { NewClientIntakeModal } from './modules/intake/NewClientIntakeModal';
import { BookingManager } from './modules/bookings/BookingManager';
import { TwoWayCalendarHub } from './modules/calendar/TwoWayCalendarHub';
import { SERVICE_CATEGORIES } from './data/services';
import { STEVAN_CALENDAR_EMAIL, STEVAN_DOMAIN } from './modules/calendar/calendarEngine';

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    services, 
    clientType,
    setClientType,
    setIsIntakeModalOpen,
    isAdminMode, 
    setIsAdminMode,
    setSelectedServiceForBooking
  } = useBookingContext();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '0874') {
      setIsAdminMode(true);
      setActiveTab('admin-dashboard');
      setIsPinModalOpen(false);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const filteredServices = services.filter(svc => {
    return selectedCategory === 'all' || svc.category === selectedCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#2C2825]">
      {/* Persistent App Header */}
      <Header />

      {/* Main Dynamic View Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: SERVICE OFFERINGS CATALOGUE */}
        {activeTab === 'services' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            
            {/* Editorial Hero Section — Clean & Minimal */}
            <div className="relative rounded-3xl bg-[#2C2825] text-[#FAF8F5] p-8 sm:p-12 border border-[#443E38] shadow-xl overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-4">
                {/* Swallow Emblem */}
                <div className="inline-flex items-center space-x-2 text-[#DFC08C]">
                  <svg 
                    viewBox="0 0 64 64" 
                    fill="currentColor" 
                    className="w-7 h-7 text-[#DFC08C]" 
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M56 10C48 16 39 23 34 31C30 24 24 20 16 19C20 25 22 32 20 38C15 36 10 36 4 38C11 44 19 47 27 46C29 52 34 57 40 59C37 52 38 44 42 37C48 40 54 41 60 39C54 32 51 23 51 15C54 13 56 11 56 10Z" />
                  </svg>
                  <span className="text-xs uppercase tracking-widest font-semibold text-[#DFC08C]">
                    Home Revival • Memphis, TN
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial tracking-tight text-white leading-tight">
                  Thoughtful spaces crafted with what you already own.
                </h1>

                <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
                  Practical hands-on styling, precision art placement, and color direction by Stevan Collins Lazich.
                </p>

                {/* Dual-Path Client Switcher Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => {
                      setClientType('new');
                      setIsIntakeModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-[#B25E29] hover:bg-[#C96B30] text-white transition-all shadow-lg hover:shadow-xl group"
                  >
                    <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
                    <span>New Clients: Start Here</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => {
                      setClientType('returning');
                      const menuEl = document.getElementById('returning-client-menu');
                      if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white border border-white/20 transition-all backdrop-blur-sm"
                  >
                    <span>Returning Clients: Service Menu</span>
                  </button>
                </div>
              </div>

              {/* Decorative background subtle ambient glow */}
              <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-[#B25E29]/10 blur-3xl pointer-events-none"></div>
            </div>

            {/* Returning Clients Service Menu Pills */}
            <div id="returning-client-menu" className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E7E0D5]">
              <div className="text-xs font-bold font-editorial text-[#2C2825] uppercase tracking-wider hidden sm:block">
                Service Menu
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                {SERVICE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#2C2825] text-white shadow-sm'
                        : 'text-[#6B6156] hover:bg-[#F2ECE2] hover:text-[#2C2825]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Bottom info callout */}
            <div className="bg-[#FAF7F2] rounded-3xl border border-[#EDE5D8] p-8 text-center space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-[#9A4616] bg-[#FAF3EC] px-3 py-1 rounded-full border border-[#ECD8C8]">
                Bigger Picture
              </span>
              <h3 className="text-xl font-bold font-editorial text-[#2C2825]">
                Need a Comprehensive Multi-Room Walkthrough & Roadmap?
              </h3>
              <p className="text-xs text-[#5C554E] max-w-xl mx-auto leading-relaxed">
                For homes that need more than one good day. Stevan conducts an extensive multi-room walkthrough to establish room-by-room priorities, design direction, repair priorities, styling, sourcing, and phasing.
              </p>
              <div className="pt-2 flex justify-center space-x-4">
                <button
                  onClick={() => {
                    const fullPlan = services.find(s => s.id === 'full-home-revival-plan') || services[0];
                    setSelectedServiceForBooking(fullPlan);
                  }}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#2C2825] text-white hover:bg-[#B25E29] transition-colors shadow-sm"
                >
                  Book Full Home Revival Plan (From $1,500)
                </button>
              </div>
            </div>

            {/* Standard Billing Terms Banner */}
            <div className="bg-white p-5 rounded-2xl border border-[#E7E0D5] text-center text-xs text-[#6B6156]">
              <p className="font-medium text-[#3D3731]">
                <strong>Standard Billing Terms:</strong> "Materials, specialty hardware, sample paint, purchases, hauling, and unusually complex installs are billed or quoted separately."
              </p>
            </div>

          </div>
        )}

        {/* TAB 2: CLIENT BOOKINGS & SCHEDULE */}
        {activeTab === 'my-bookings' && <BookingManager />}

        {/* TAB 3: TWO-WAY CALENDAR ENGINE & SYNC HUB */}
        {activeTab === 'calendar-hub' && <TwoWayCalendarHub />}

        {/* TAB 4: STEVAN'S STUDIO COMMAND & ADJUSTMENTS */}
        {activeTab === 'admin-dashboard' && <AdminDashboard />}

      </main>

      {/* Global Modals */}
      <NewClientIntakeModal />
      <SchedulingWizard />
      <PriceAdjusterModal />
      <PaymentModal />
      <ReceiptModal />

      {/* Footer */}
      <footer className="bg-[#24201D] text-[#ECE6DD] border-t border-[#3D352E] mt-16 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#3D352E]/60">
            <div className="space-y-2 md:col-span-2">
              <h4 className="text-lg font-bold font-editorial text-white tracking-wide">
                STEVAN COLLINS LAZICH
              </h4>
              <p className="text-xs text-stone-400 max-w-md leading-relaxed font-light">
                Home Revivalist, Visual Artist & Maker. Transforming spaces across Memphis and the Mid-South with practical design, custom textile art, and mindful editing.
              </p>
              <div className="text-[11px] text-amber-200/90 pt-1">
                Calendar Sync & Receipts: <strong>{STEVAN_DOMAIN}</strong> ({STEVAN_CALENDAR_EMAIL})
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-white mb-2 uppercase text-[10px] tracking-wider">
                Returning Clients Menu
              </h5>
              <ul className="space-y-1.5 text-stone-400 text-xs">
                <li>Custom Fabric Wall Art (Custom Quote)</li>
                <li>Color Palette Plan ($350)</li>
                <li>Art Hang ($400 flat starting point)</li>
                <li>Room Setup + Styling (From $450)</li>
                <li>Home Reset + Organizing (From $450)</li>
                <li>Move-In Unpack + Setup (From $350)</li>
                <li>Full Home Revival Plan (From $1,500)</li>
                <li>Window Treatment Plan ($300 plan)</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-white mb-2 uppercase text-[10px] tracking-wider">
                Studio Portals
              </h5>
              <ul className="space-y-1.5 text-stone-400 text-xs">
                <li>
                  <button onClick={() => setActiveTab('services')} className="hover:text-white transition-colors">
                    Service Explorer
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('my-bookings')} className="hover:text-white transition-colors">
                    Client Bookings & Invoices
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('calendar-hub')} className="hover:text-white transition-colors">
                    Home Revival Calendar Feed
                  </button>
                </li>
                <li>
                  {isAdminMode ? (
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setActiveTab('admin-dashboard')} 
                        className="text-amber-400 hover:text-amber-300 font-medium"
                      >
                        Studio Admin Dashboard →
                      </button>
                      <button 
                        onClick={() => {
                          setIsAdminMode(false);
                          setActiveTab('services');
                        }}
                        className="text-[10px] text-stone-400 hover:text-white underline"
                      >
                        (Lock Admin)
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setPinInput('');
                        setPinError(false);
                        setIsPinModalOpen(true);
                      }} 
                      className="text-stone-400 hover:text-amber-300 transition-colors flex items-center space-x-1"
                    >
                      <span>Studio Admin Access (PIN)</span>
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-stone-500 text-[11px] gap-2">
            <div>
              Based on service offerings at{' '}
              <a 
                href="https://stevancollinslazich.com/services/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-stone-300 hover:text-white underline"
              >
                stevancollinslazich.com/services
              </a>
            </div>
            <div>
              Home Revival by Stevan Collins Lazich • Memphis, TN
            </div>
          </div>
        </div>
      </footer>

      {/* Studio Admin PIN Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7E0D5] w-full max-w-sm shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  Studio Security
                </span>
                <h3 className="text-xl font-bold font-editorial text-[#2C2825] mt-1">
                  Enter Studio PIN
                </h3>
              </div>
              <button 
                onClick={() => setIsPinModalOpen(false)}
                className="text-[#8C827A] hover:text-[#2C2825]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#5C554E]">
              Enter the 4-digit PIN to access Stevan's Studio Command and price adjustments.
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={6}
                  autoFocus
                  placeholder="Enter PIN"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  className="w-full text-center text-2xl tracking-[0.3em] font-mono py-2.5 bg-white border border-[#DCD3C5] rounded-xl text-[#2C2825] focus:ring-2 focus:ring-[#B25E29] focus:outline-none"
                />
                {pinError && (
                  <p className="text-xs text-red-600 mt-1.5 text-center font-medium">
                    Incorrect PIN. Access restricted.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#554E46] hover:text-[#2C2825]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-[#2C2825] hover:bg-[#B25E29] text-white transition-colors"
                >
                  Unlock Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <BookingProvider>
      <MainContent />
    </BookingProvider>
  );
}
