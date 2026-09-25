import { Booking } from '../types';

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-7821',
    serviceId: 'art-hang',
    serviceTitle: 'Art Hang',
    category: 'art-hang',
    customer: {
      fullName: 'Eleanor Vance',
      email: 'eleanor.vance@gmail.com',
      phone: '(901) 555-0194',
      address: '2188 Central Ave, Midtown',
      city: 'Memphis',
      zipCode: '38104'
    },
    scheduledDate: '2026-10-02',
    timeSlot: '09:00 AM - 01:00 PM (Morning)',
    status: 'quote_adjusted',
    createdAt: '2026-09-24T14:30:00Z',
    lineItems: [
      {
        id: 'li-1',
        description: 'Art Hang Base Scope (Placement guidance, measuring, layout & hanging)',
        amount: 400,
        type: 'base_service'
      },
      {
        id: 'li-2',
        description: 'Specialty heavy anchor kits & cleats for 2 plaster mirrors',
        amount: 65,
        type: 'materials'
      },
      {
        id: 'li-3',
        description: 'Midtown client courtesy credit',
        amount: -50,
        type: 'discount'
      }
    ],
    totalPrice: 415,
    amountPaid: 0,
    specifics: {
      estimatedPieces: 9,
      wallType: 'Historic Plaster & Lath',
      hasOversizedOrMirrors: '1-2 Heavy Mirrors (Requires custom cleats / quoted separately)',
      arrangementStyle: 'Curated Gallery Wall',
      stevanNotes: 'Stevan inspected: Plaster requires custom masonry bits and toggle anchors. Applied $50 welcome courtesy credit.'
    },
    specialInstructions: 'Two heavy antique gilded mirrors in front parlor, plus 7 family photographs in stairwell.',
    adjustments: [
      {
        id: 'adj-101',
        adjustedAt: '2026-09-24T16:15:00Z',
        adjustedBy: 'Stevan Collins Lazich',
        previousTotal: 400,
        newTotal: 415,
        reason: 'Added heavy hardware for plaster walls + $50 welcome courtesy credit',
        notes: 'Covers specialty plaster masonry hardware.'
      }
    ],
    receipts: [],
    calendarSynced: true,
    calendarEventId: 'cal-art-7821',
    pushReminderEnabled: true,
    reminderTimes: ['24h', '2h']
  },
  {
    id: 'BK-7819',
    serviceId: 'custom-fabric-art',
    serviceTitle: 'Custom Fabric Wall Art',
    category: 'custom-fabric',
    customer: {
      fullName: 'Marcus & Claire Holloway',
      email: 'holloway.marcus@gmail.com',
      phone: '(901) 555-0812',
      address: '644 S McLean Blvd',
      city: 'Memphis',
      zipCode: '38104'
    },
    scheduledDate: '2026-10-06',
    timeSlot: '01:30 PM - 05:30 PM (Afternoon)',
    status: 'paid_in_full',
    createdAt: '2026-09-22T10:15:00Z',
    lineItems: [
      {
        id: 'li-11',
        description: 'Custom Fabric Wall Panel (48" x 72" Grand Architectural Scale)',
        amount: 720,
        type: 'custom_fabric'
      },
      {
        id: 'li-12',
        description: 'Hand-painted acrylic & gold leaf embellishments by Stevan',
        amount: 140,
        type: 'custom_fabric'
      },
      {
        id: 'li-13',
        description: 'White Oak natural rubbed floater frame',
        amount: 160,
        type: 'materials'
      },
      {
        id: 'li-14',
        description: 'On-site flush acoustic wall installation & delivery',
        amount: 120,
        type: 'base_service'
      }
    ],
    totalPrice: 1140,
    amountPaid: 1140,
    specifics: {
      approximateScale: '48" x 72" Grand Architectural Scale',
      subjectDirection: 'Botanical & Flora Study',
      floaterFrameOption: 'Natural Rubbed White Oak Frame',
      roomLocation: 'Dining room tall niche with evening chandelier lighting'
    },
    specialInstructions: 'Need acoustic dampening because dining room has hardwood floors and high ceilings.',
    adjustments: [
      {
        id: 'adj-102',
        adjustedAt: '2026-09-22T12:00:00Z',
        adjustedBy: 'Stevan Collins Lazich',
        previousTotal: 850,
        newTotal: 1140,
        reason: 'Client upgraded from 40x60 to 48x72 with solid White Oak floater frame',
        notes: 'Custom commission quoted and built by Stevan in Midtown studio.'
      }
    ],
    receipts: [
      {
        transactionId: 'TXN-994821',
        paidAt: '2026-09-22T14:22:10Z',
        amountPaid: 1140,
        paymentMethod: 'Visa •••• 4242',
        paymentType: 'full',
        currency: 'USD',
        clientEmail: 'holloway.marcus@gmail.com',
        merchantBcc: 'service@stevancollinslazich.com',
        receiptNumber: 'RCPT-2026-0941',
        status: 'succeeded'
      }
    ],
    calendarSynced: true,
    calendarEventId: 'cal-fabric-7819',
    pushReminderEnabled: true,
    reminderTimes: ['24h', '2h']
  },
  {
    id: 'BK-7815',
    serviceId: 'color-palette-plan',
    serviceTitle: 'Color Palette Plan (Sherwin-Williams)',
    category: 'color-finish',
    customer: {
      fullName: 'Sarah Jenkins',
      email: 's.jenkins.design@outlook.com',
      phone: '(901) 555-0377',
      address: '7320 Dogwood Rd',
      city: 'Germantown',
      zipCode: '38138'
    },
    scheduledDate: '2026-10-12',
    timeSlot: '09:00 AM - 01:00 PM (Morning)',
    status: 'deposit_paid',
    createdAt: '2026-09-23T11:00:00Z',
    lineItems: [
      {
        id: 'li-21',
        description: 'Comprehensive Sherwin-Williams Palette Plan (Base Flat Rate)',
        amount: 350,
        type: 'base_service'
      },
      {
        id: 'li-22',
        description: 'Color Testing Add-On — on-wall swatch testing & sheen evaluation',
        amount: 125,
        type: 'materials'
      }
    ],
    totalPrice: 475,
    amountPaid: 237.5,
    specifics: {
      numberOfRooms: 4,
      includeColorTestingAddOn: true,
      includeTrimAndDoors: true,
      paletteAtmosphere: 'Warm Earthy & Soulful'
    },
    specialInstructions: 'Need palette that bridges dark heart-pine floors with north-facing natural morning light.',
    adjustments: [],
    receipts: [
      {
        transactionId: 'TXN-993188',
        paidAt: '2026-09-23T11:28:44Z',
        amountPaid: 237.5,
        paymentMethod: 'Apple Pay',
        paymentType: 'deposit',
        currency: 'USD',
        clientEmail: 's.jenkins.design@outlook.com',
        merchantBcc: 'service@stevancollinslazich.com',
        receiptNumber: 'RCPT-2026-0938',
        status: 'succeeded'
      }
    ],
    calendarSynced: true,
    calendarEventId: 'cal-color-7815',
    pushReminderEnabled: true,
    reminderTimes: ['24h']
  }
];
