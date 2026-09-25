import { Booking, NotificationLog } from '../../types';

class NotificationEngine {
  private static instance: NotificationEngine;
  private audioCtx: AudioContext | null = null;

  public static getInstance(): NotificationEngine {
    if (!NotificationEngine.instance) {
      NotificationEngine.instance = new NotificationEngine();
    }
    return NotificationEngine.instance;
  }

  public isPushSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermission(): NotificationPermission {
    if (!this.isPushSupported()) return 'denied';
    return Notification.permission;
  }

  public async requestPushPermission(): Promise<NotificationPermission> {
    if (!this.isPushSupported()) return 'denied';
    try {
      const perm = await Notification.requestPermission();
      return perm;
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
      return 'denied';
    }
  }

  /**
   * Play a tasteful, soothing chime using Web Audio API
   */
  public playChimeSound() {
    try {
      if (typeof window === 'undefined') return;
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Dispatch a browser push notification and play chime
   */
  public dispatchPush(title: string, options?: NotificationOptions): boolean {
    this.playChimeSound();

    if (!this.isPushSupported()) return false;

    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options,
        });
        return true;
      } catch (err) {
        console.error('Failed to trigger native Notification:', err);
        return false;
      }
    }
    return false;
  }

  /**
   * Schedule automatic upcoming appointment reminder
   */
  public triggerUpcomingReminder(booking: Booking, timeframeLabel: '24 Hours Prior' | '2 Hours Prior' | 'Immediate Test'): NotificationLog {
    const title = `Reminder: Home Revival with Stevan Collins Lazich (${timeframeLabel})`;
    const body = `Your appointment for "${booking.serviceTitle}" is scheduled on ${booking.scheduledDate} (${booking.timeSlot}) at ${booking.customer.address}. Stevan will arrive on time with all required hanging hardware and tools.`;

    this.dispatchPush(title, {
      body,
      tag: `booking-reminder-${booking.id}`,
    });

    return {
      id: `notif-${Date.now()}`,
      title,
      body,
      timestamp: new Date().toISOString(),
      bookingId: booking.id,
      read: false
    };
  }
}

export const notificationEngine = NotificationEngine.getInstance();
