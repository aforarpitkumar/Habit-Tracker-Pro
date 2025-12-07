/**
 * Advanced Notification Service
 * Handles push notifications, scheduling, and customization
 */

interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  reminderTime: string;
  motivationalQuotes: boolean;
  streakMilestones: boolean;
  weeklyProgress: boolean;
  customReminders: CustomReminder[];
}

interface CustomReminder {
  id: string;
  habitId?: string;
  title: string;
  message: string;
  time: string;
  days: number[]; // 0-6, Sunday to Saturday
  enabled: boolean;
}

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledTime: Date;
  data?: any;
}

class NotificationService {
  private settings: NotificationSettings = {
    enabled: false,
    dailyReminder: true,
    reminderTime: '09:00',
    motivationalQuotes: true,
    streakMilestones: true,
    weeklyProgress: true,
    customReminders: []
  };

  private scheduledNotifications: ScheduledNotification[] = [];

  constructor() {
    this.loadSettings();
    this.setupPeriodicChecks();
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    
    if (granted) {
      this.settings.enabled = true;
      this.saveSettings();
      console.log('✅ Notification permission granted');
    } else {
      console.warn('❌ Notification permission denied');
    }

    return granted;
  }

  /**
   * Show immediate notification
   */
  async showNotification(title: string, options: NotificationOptions = {}) {
    if (!this.settings.enabled || Notification.permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.svg',
        badge: '/icons/icon-192x192.svg',
        tag: 'habit-tracker',
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      return notification;
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  /**
   * Schedule daily reminder
   */
  scheduleDailyReminder() {
    if (!this.settings.dailyReminder) return;

    const [hours, minutes] = this.settings.reminderTime.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    this.scheduleNotification({
      id: 'daily-reminder',
      title: '🎯 Time to check your habits!',
      body: 'Don\'t forget to mark your completed habits for today.',
      scheduledTime,
      data: { type: 'daily-reminder' }
    });
  }

  /**
   * Schedule custom reminders
   */
  scheduleCustomReminders() {
    this.settings.customReminders
      .filter(reminder => reminder.enabled)
      .forEach(reminder => {
        const today = new Date().getDay();
        
        if (reminder.days.includes(today)) {
          const [hours, minutes] = reminder.time.split(':').map(Number);
          const scheduledTime = new Date();
          scheduledTime.setHours(hours, minutes, 0, 0);

          if (scheduledTime > new Date()) {
            this.scheduleNotification({
              id: `custom-${reminder.id}`,
              title: reminder.title,
              body: reminder.message,
              scheduledTime,
              data: { 
                type: 'custom-reminder',
                habitId: reminder.habitId,
                reminderId: reminder.id
              }
            });
          }
        }
      });
  }

  /**
   * Show streak milestone notification
   */
  showStreakMilestone(habitName: string, streak: number) {
    if (!this.settings.streakMilestones) return;

    const milestones = [3, 7, 14, 30, 50, 100];
    if (!milestones.includes(streak)) return;

    const messages = {
      3: 'Great start! 🌱',
      7: 'One week strong! 💪',
      14: 'Two weeks of consistency! 🔥',
      30: 'Monthly habit champion! 🏆',
      50: 'Incredible dedication! ⭐',
      100: 'Legendary consistency! 👑'
    };

    this.showNotification(
      `${streak}-day streak achieved!`,
      {
        body: `${habitName}: ${messages[streak as keyof typeof messages]}`,
        tag: `streak-${habitName}`,
        icon: '/icons/streak-icon.svg'
      }
    );
  }

  /**
   * Show motivational quote notification
   */
  showMotivationalQuote() {
    if (!this.settings.motivationalQuotes) return;

    const quotes = [
      'Small daily improvements lead to stunning results! 🌟',
      'Your consistency today shapes your tomorrow! 💫',
      'Every habit completed is a victory! 🎉',
      'Progress, not perfection! 🚀',
      'You\'re building something amazing! 🏗️',
      'Consistency is the mother of mastery! 🎯'
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    this.showNotification(
      'Daily Motivation',
      {
        body: randomQuote,
        tag: 'motivation'
      }
    );
  }

  /**
   * Schedule notification
   */
  private scheduleNotification(notification: ScheduledNotification) {
    const delay = notification.scheduledTime.getTime() - Date.now();
    
    if (delay <= 0) return;

    setTimeout(() => {
      this.showNotification(notification.title, {
        body: notification.body,
        data: notification.data
      });
    }, delay);

    this.scheduledNotifications.push(notification);
  }

  /**
   * Add custom reminder
   */
  addCustomReminder(reminder: Omit<CustomReminder, 'id'>): string {
    const id = crypto.randomUUID();
    const newReminder: CustomReminder = { ...reminder, id };
    
    this.settings.customReminders.push(newReminder);
    this.saveSettings();
    this.scheduleCustomReminders();
    
    return id;
  }

  /**
   * Update settings
   */
  updateSettings(newSettings: Partial<NotificationSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    
    // Reschedule notifications with new settings
    this.scheduleDailyReminder();
    this.scheduleCustomReminders();
  }

  /**
   * Get current settings
   */
  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  /**
   * Setup periodic checks
   */
  private setupPeriodicChecks() {
    // Check every hour for scheduled notifications
    setInterval(() => {
      this.scheduleDailyReminder();
      this.scheduleCustomReminders();
    }, 60 * 60 * 1000);

    // Show motivational quote once per day
    const lastQuoteDate = localStorage.getItem('lastMotivationalQuote');
    const today = new Date().toDateString();
    
    if (lastQuoteDate !== today && this.settings.motivationalQuotes) {
      setTimeout(() => {
        this.showMotivationalQuote();
        localStorage.setItem('lastMotivationalQuote', today);
      }, 2000); // Show after 2 seconds
    }
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings() {
    try {
      const stored = localStorage.getItem('notificationSettings');
      if (stored) {
        this.settings = { ...this.settings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings() {
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export type { NotificationSettings, CustomReminder };