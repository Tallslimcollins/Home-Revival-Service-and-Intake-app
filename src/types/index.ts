export type ServiceCategory = 
  | 'art-hang'
  | 'window-treatment'
  | 'styling-revival'
  | 'organizing-moving'
  | 'color-finish'
  | 'custom-fabric';

export interface ServiceSpecificOption {
  id: string;
  name: string;
  type: 'select' | 'number' | 'text' | 'boolean';
  description?: string;
  options?: string[];
  defaultValue: string | number | boolean;
  unit?: string;
  priceModifier?: number; // per unit or fixed add-on
}

export interface ServiceOffering {
  id: string;
  title: string;
  category: ServiceCategory;
  menuBadge: string; // e.g. "Fast visible win", "Ready-made only", "One room", "Hands-on help", "Move-in help", "Bigger picture", "Custom work", "Paint direction"
  tagline: string;
  description: string;
  detailedPoints: string[];
  exclusions?: string[]; // Guardrails / what is quoted separately
  pricingModel: 'flat' | 'from' | 'custom_quote' | 'hourly';
  basePrice: number;
  displayPriceLabel: string; // e.g. "$400", "From $450", "$300 plan", "Custom Quote"
  priceSuffix?: string;
  estimatedDuration: string;
  iconName: string;
  imageUrl?: string;
  defaultSpecifics: Record<string, any>;
  specificOptions: ServiceSpecificOption[];
  popular?: boolean;
}

export interface LineItem {
  id: string;
  description: string;
  amount: number;
  type: 'base_service' | 'materials' | 'extra_hours' | 'custom_fabric' | 'travel_surcharge' | 'discount' | 'custom_adjustment';
}

export interface PriceAdjustment {
  id: string;
  adjustedAt: string;
  adjustedBy: string; // 'Stevan Collins Lazich' | 'Client'
  previousTotal: number;
  newTotal: number;
  reason: string;
  notes?: string;
}

export type BookingStatus = 
  | 'pending_review'
  | 'quote_adjusted'
  | 'deposit_paid'
  | 'paid_in_full'
  | 'scheduled'
  | 'completed'
  | 'cancelled';

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string; // e.g. Memphis, Germantown, Midtown, Collierville
  zipCode: string;
}

export interface PaymentReceipt {
  transactionId: string;
  paidAt: string;
  amountPaid: number;
  paymentMethod: string; // 'Visa •••• 4242' | 'Apple Pay' | 'Google Pay'
  paymentType: 'full' | 'deposit' | 'balance_settlement';
  currency: string;
  clientEmail: string;
  merchantBcc: string; // 'service@stevancollinslazich.com'
  receiptNumber: string;
  status: 'succeeded' | 'refunded';
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  category: ServiceCategory;
  customer: CustomerDetails;
  scheduledDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. '09:00 AM - 01:00 PM (Morning)'
  status: BookingStatus;
  createdAt: string;
  lineItems: LineItem[];
  totalPrice: number;
  amountPaid: number;
  specifics: Record<string, any>;
  specialInstructions?: string;
  adjustments: PriceAdjustment[];
  receipts: PaymentReceipt[];
  calendarSynced: boolean;
  calendarEventId?: string;
  pushReminderEnabled: boolean;
  reminderTimes: string[]; // e.g. ['24h', '2h']
}

export interface ClientIntakeInquiry {
  id: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'proposal_sent' | 'converted';
  
  // The Situation
  currentSituation: string; // What is going on in your home right now?
  heaviestChallenge: string; // What feels heaviest or hardest to face alone?
  priorityFocus: string; // What space or problem are you ready to tackle first?
  
  // Home & Property Details
  neighborhood: string; // Midtown, Downtown, East Memphis, Germantown, etc.
  address: string;
  homeAgeOrWallTypes: string; // Plaster, Drywall, Brick, etc.
  
  // Photos / Visuals
  photoNotes?: string;
  photoUrls?: string[];
  
  // Contact
  fullName: string;
  email: string;
  phone: string;
  preferredContactMethod?: 'email' | 'phone' | 'text';
  
  // Admin response notes
  adminNotes?: string;
  recommendedServiceId?: string;
  convertedBookingId?: string;
}

export interface NotificationLog {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  bookingId?: string;
  read: boolean;
}
