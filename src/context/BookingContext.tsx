import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, ServiceOffering, LineItem, BookingStatus, PaymentReceipt, NotificationLog, ClientIntakeInquiry } from '../types';
import { SERVICES_CATALOGUE } from '../data/services';
import { INITIAL_BOOKINGS } from '../data/initialBookings';
import { INITIAL_INTAKE_INQUIRIES } from '../data/initialIntakes';
import { notificationEngine } from '../modules/notifications/notificationEngine';

interface BookingContextType {
  bookings: Booking[];
  services: ServiceOffering[];
  activeTab: 'services' | 'my-bookings' | 'admin-dashboard' | 'calendar-hub';
  setActiveTab: (tab: 'services' | 'my-bookings' | 'admin-dashboard' | 'calendar-hub') => void;
  clientType: 'new' | 'returning';
  setClientType: (type: 'new' | 'returning') => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  
  // Intake Inquiries
  intakes: ClientIntakeInquiry[];
  isIntakeModalOpen: boolean;
  setIsIntakeModalOpen: (open: boolean) => void;
  selectedIntakeForReview: ClientIntakeInquiry | null;
  setSelectedIntakeForReview: (intake: ClientIntakeInquiry | null) => void;
  createIntakeInquiry: (data: Omit<ClientIntakeInquiry, 'id' | 'createdAt' | 'status'>) => ClientIntakeInquiry;
  updateIntakeStatus: (id: string, status: ClientIntakeInquiry['status'], notes?: string) => void;
  convertIntakeToBooking: (intakeId: string, serviceId: string, customPrice?: number) => Booking;

  // Modals & workflows
  selectedServiceForBooking: ServiceOffering | null;
  setSelectedServiceForBooking: (svc: ServiceOffering | null) => void;
  
  bookingForPriceAdjustment: Booking | null;
  setBookingForPriceAdjustment: (booking: Booking | null) => void;

  bookingForPayment: Booking | null;
  setBookingForPayment: (booking: Booking | null) => void;

  activeReceipt: { receipt: PaymentReceipt; booking: Booking } | null;
  setActiveReceipt: (data: { receipt: PaymentReceipt; booking: Booking } | null) => void;

  // Actions
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'amountPaid' | 'adjustments' | 'receipts' | 'calendarSynced'>) => Booking;
  updateBookingSpecificsAndPrice: (
    bookingId: string,
    newTotal: number,
    newLineItems: LineItem[],
    newSpecifics: Record<string, any>,
    reason: string,
    notes?: string
  ) => void;
  recordPayment: (
    bookingId: string,
    amount: number,
    paymentMethod: string,
    paymentType: 'full' | 'deposit' | 'balance_settlement'
  ) => PaymentReceipt;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  toggleCalendarSync: (bookingId: string) => void;
  togglePushReminders: (bookingId: string) => void;
  
  // Notifications
  notifications: NotificationLog[];
  pushPermission: NotificationPermission;
  requestPushPermission: () => Promise<void>;
  sendUpcomingReminderPush: (booking: Booking, timeframeLabel?: string) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const STORAGE_KEY = 'stevan_collins_bookings_v2';
const INTAKES_STORAGE_KEY = 'stevan_collins_intakes_v1';
const NOTIFICATIONS_KEY = 'stevan_collins_notifications_v2';

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services] = useState<ServiceOffering[]>(SERVICES_CATALOGUE);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved bookings:', e);
    }
    return INITIAL_BOOKINGS;
  });

  const [activeTab, setActiveTab] = useState<'services' | 'my-bookings' | 'admin-dashboard' | 'calendar-hub'>('services');
  const [clientType, setClientType] = useState<'new' | 'returning'>('new');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Intake Inquiries State
  const [intakes, setIntakes] = useState<ClientIntakeInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(INTAKES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved intakes:', e);
    }
    return INITIAL_INTAKE_INQUIRIES;
  });
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState<boolean>(false);
  const [selectedIntakeForReview, setSelectedIntakeForReview] = useState<ClientIntakeInquiry | null>(null);
  
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceOffering | null>(null);
  const [bookingForPriceAdjustment, setBookingForPriceAdjustment] = useState<Booking | null>(null);
  const [bookingForPayment, setBookingForPayment] = useState<Booking | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<{ receipt: PaymentReceipt; booking: Booking } | null>(null);

  const [pushPermission, setPushPermission] = useState<NotificationPermission>(() => {
    return notificationEngine.getPermission();
  });

  const [notifications, setNotifications] = useState<NotificationLog[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse notifications:', e);
    }
    return [
      {
        id: 'notif-1',
        title: 'Quote Adjusted by Stevan',
        body: 'Stevan adjusted the scope & added $50 courtesy discount for BK-7821.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        bookingId: 'BK-7821',
        read: false,
      },
      {
        id: 'notif-2',
        title: 'Calendar Sync Active',
        body: 'Connected with Stevan’s Studio Calendar at stevancollinslazich.com.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true,
      }
    ];
  });

  // Save bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.warn('Failed to save bookings:', e);
    }
  }, [bookings]);

  // Save intakes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(INTAKES_STORAGE_KEY, JSON.stringify(intakes));
    } catch (e) {
      console.warn('Failed to save intakes:', e);
    }
  }, [intakes]);

  // Save notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications:', e);
    }
  }, [notifications]);

  const addNotification = (title: string, body: string, bookingId?: string) => {
    const newNotif: NotificationLog = {
      id: `notif-${Date.now()}`,
      title,
      body,
      timestamp: new Date().toISOString(),
      bookingId,
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Send native push if permission granted
    notificationEngine.dispatchPush(title, {
      body,
      tag: bookingId || 'home-revival',
    });
  };

  const requestPushPermission = async () => {
    const perm = await notificationEngine.requestPushPermission();
    setPushPermission(perm);
    if (perm === 'granted') {
      addNotification('Push Notifications Active', 'You will receive timely service reminders before your appointments.');
    }
  };

  const createIntakeInquiry = (
    data: Omit<ClientIntakeInquiry, 'id' | 'createdAt' | 'status'>
  ): ClientIntakeInquiry => {
    const intakeId = `INTK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newIntake: ClientIntakeInquiry = {
      ...data,
      id: intakeId,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    setIntakes(prev => [newIntake, ...prev]);

    addNotification(
      `New Client Intake Submitted (${intakeId})`,
      `Intake from ${newIntake.fullName} received. Archived & BCC to service@stevancollinslazich.com.`
    );

    return newIntake;
  };

  const updateIntakeStatus = (
    id: string, 
    status: ClientIntakeInquiry['status'],
    notes?: string
  ) => {
    setIntakes(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        return {
          ...item,
          status,
          ...(notes !== undefined ? { adminNotes: notes } : {})
        };
      })
    );

    addNotification(
      `Intake ${id} Updated`,
      `Status changed to "${status.replace('_', ' ')}".`
    );
  };

  const convertIntakeToBooking = (
    intakeId: string, 
    serviceId: string, 
    customPrice?: number
  ): Booking => {
    const intake = intakes.find(i => i.id === intakeId);
    const svc = services.find(s => s.id === serviceId) || services[0];
    
    const finalPrice = customPrice !== undefined ? customPrice : svc.basePrice;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    const scheduledDate = tomorrow.toISOString().split('T')[0];

    const newBooking = createBooking({
      serviceId: svc.id,
      serviceTitle: svc.title,
      category: svc.category,
      customer: {
        fullName: intake ? intake.fullName : 'New Client',
        email: intake ? intake.email : 'client@example.com',
        phone: intake ? intake.phone : '(901) 555-0100',
        address: intake ? intake.address : 'Midtown Memphis',
        city: intake ? intake.neighborhood : 'Memphis',
        zipCode: '38104'
      },
      scheduledDate,
      timeSlot: '09:00 AM - 01:00 PM (Morning)',
      lineItems: [
        {
          id: `li-prop-${Date.now()}`,
          description: `${svc.title} Proposal (Based on intake assessment)`,
          amount: finalPrice,
          type: 'base_service'
        }
      ],
      totalPrice: finalPrice,
      specifics: {
        intakeId,
        source: 'Converted from New Client Intake',
        wallType: intake ? intake.homeAgeOrWallTypes : 'Drywall',
        notesFromIntake: intake ? intake.currentSituation : ''
      },
      specialInstructions: intake 
        ? `Intake Context: ${intake.currentSituation}. Priority: ${intake.priorityFocus}.`
        : '',
      pushReminderEnabled: true,
      reminderTimes: ['24h', '2h']
    });

    // Mark intake as converted
    setIntakes(prev =>
      prev.map(i => i.id === intakeId ? { ...i, status: 'converted', convertedBookingId: newBooking.id } : i)
    );

    addNotification(
      `Intake Converted to Proposal (${newBooking.id})`,
      `Custom proposal generated for ${intake?.fullName}. Booking link created.`
    );

    return newBooking;
  };

  const sendUpcomingReminderPush = (booking: Booking, timeframeLabel = 'Tomorrow at 9:00 AM') => {
    const title = `Reminder: Home Revival with Stevan Collins Lazich`;
    const body = `Your appointment for "${booking.serviceTitle}" is scheduled for ${timeframeLabel}. Stevan will bring all required equipment and hardware.`;
    
    addNotification(title, body, booking.id);
  };

  const createBooking = (
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'amountPaid' | 'adjustments' | 'receipts' | 'calendarSynced'>
  ): Booking => {
    const newId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'pending_review',
      amountPaid: 0,
      adjustments: [],
      receipts: [],
      calendarSynced: true,
      pushReminderEnabled: true,
      reminderTimes: ['24h', '2h'],
    };

    setBookings(prev => [newBooking, ...prev]);

    addNotification(
      `New Booking Scheduled (${newId})`,
      `Your request for "${newBooking.serviceTitle}" has been received. Stevan will review specific requirements and sync with his calendar.`,
      newId
    );

    return newBooking;
  };

  const updateBookingSpecificsAndPrice = (
    bookingId: string,
    newTotal: number,
    newLineItems: LineItem[],
    newSpecifics: Record<string, any>,
    reason: string,
    notes?: string
  ) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id !== bookingId) return b;

        const prevTotal = b.totalPrice;
        const adjustment = {
          id: `adj-${Date.now()}`,
          adjustedAt: new Date().toISOString(),
          adjustedBy: isAdminMode ? 'Stevan Collins Lazich' : 'Client Modification',
          previousTotal: prevTotal,
          newTotal: newTotal,
          reason: reason || 'Price & specifics updated',
          notes: notes || ''
        };

        const newStatus: BookingStatus = 
          b.amountPaid >= newTotal && newTotal > 0
            ? 'paid_in_full'
            : b.amountPaid > 0
            ? 'deposit_paid'
            : 'quote_adjusted';

        return {
          ...b,
          totalPrice: newTotal,
          lineItems: newLineItems,
          specifics: { ...b.specifics, ...newSpecifics },
          adjustments: [adjustment, ...(b.adjustments || [])],
          status: newStatus,
        };
      })
    );

    addNotification(
      `Booking ${bookingId} Updated`,
      `Price & specifics were adjusted: new total is $${newTotal} (${reason}).`,
      bookingId
    );
  };

  const recordPayment = (
    bookingId: string,
    amount: number,
    paymentMethod: string,
    paymentType: 'full' | 'deposit' | 'balance_settlement'
  ): PaymentReceipt => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    const receiptNumber = `RCPT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReceipt: PaymentReceipt = {
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      paidAt: new Date().toISOString(),
      amountPaid: amount,
      paymentMethod,
      paymentType,
      currency: 'USD',
      clientEmail: booking.customer.email,
      merchantBcc: 'service@stevancollinslazich.com',
      receiptNumber,
      status: 'succeeded',
    };

    const newAmountPaid = (booking.amountPaid || 0) + amount;
    const isPaidInFull = newAmountPaid >= booking.totalPrice;

    setBookings(prev =>
      prev.map(b => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          amountPaid: newAmountPaid,
          status: isPaidInFull ? 'paid_in_full' : 'deposit_paid',
          receipts: [newReceipt, ...(b.receipts || [])],
          calendarSynced: true,
        };
      })
    );

    addNotification(
      `Payment Received: $${amount}`,
      `Confirmation receipt ${receiptNumber} generated and sent to ${booking.customer.email} (BCC: service@stevancollinslazich.com).`,
      bookingId
    );

    // Open receipt modal automatically
    setActiveReceipt({ receipt: newReceipt, booking: { ...booking, amountPaid: newAmountPaid, receipts: [newReceipt, ...booking.receipts] } });

    return newReceipt;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status } : b))
    );
    addNotification(`Status Changed: ${bookingId}`, `Status updated to ${status.replace('_', ' ').toUpperCase()}`, bookingId);
  };

  const toggleCalendarSync = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id !== bookingId) return b;
        const newSync = !b.calendarSynced;
        return { ...b, calendarSynced: newSync };
      })
    );
  };

  const togglePushReminders = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id !== bookingId) return b;
        const enabled = !b.pushReminderEnabled;
        return { ...b, pushReminderEnabled: enabled };
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        services,
        activeTab,
        setActiveTab,
        clientType,
        setClientType,
        isAdminMode,
        setIsAdminMode,
        intakes,
        isIntakeModalOpen,
        setIsIntakeModalOpen,
        selectedIntakeForReview,
        setSelectedIntakeForReview,
        createIntakeInquiry,
        updateIntakeStatus,
        convertIntakeToBooking,
        selectedServiceForBooking,
        setSelectedServiceForBooking,
        bookingForPriceAdjustment,
        setBookingForPriceAdjustment,
        bookingForPayment,
        setBookingForPayment,
        activeReceipt,
        setActiveReceipt,
        createBooking,
        updateBookingSpecificsAndPrice,
        recordPayment,
        updateBookingStatus,
        toggleCalendarSync,
        togglePushReminders,
        notifications,
        pushPermission,
        requestPushPermission,
        sendUpcomingReminderPush,
        markNotificationRead,
        clearNotifications,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
};
