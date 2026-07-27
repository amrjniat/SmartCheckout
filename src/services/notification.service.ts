// import { Notification, NotificationType, NotificationModule } from '../types/Notification';

// const STORAGE_KEY = 'smartcheckout_notifications';
// const MAX_NOTIFICATIONS = 100;

// type Listener = (notifications: Notification[]) => void;

// class NotificationService {
//   private listeners: Listener[] = [];

//   private getAll(): Notification[] {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       return raw ? JSON.parse(raw) : [];
//     } catch {
//       return [];
//     }
//   }

//   private saveAll(notifications: Notification[]) {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
//     this.listeners.forEach((listener) => listener(notifications));
//   }

//   subscribe(listener: Listener): () => void {
//     this.listeners.push(listener);
//     listener(this.getAll());
//     return () => {
//       this.listeners = this.listeners.filter((l) => l !== listener);
//     };
//   }

//   getNotifications(): Notification[] {
//     return this.getAll().sort(
//       (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     );
//   }

//   getUnreadCount(): number {
//     return this.getAll().filter((n) => !n.isRead).length;
//   }

//   addNotification(data: {
//     title: string;
//     message: string;
//     type: NotificationType;
//     module: NotificationModule;
//     actionUrl?: string;
//   }): Notification {
//     const newNotification: Notification = {
//       id: crypto.randomUUID(),
//       isRead: false,
//       createdAt: new Date().toISOString(),
//       ...data,
//     };
//     const all = [newNotification, ...this.getAll()].slice(0, MAX_NOTIFICATIONS);
//     this.saveAll(all);
//     return newNotification;
//   }

//   deleteNotification(id: string): void {
//     this.saveAll(this.getAll().filter((n) => n.id !== id));
//   }

//   markAsRead(id: string): void {
//     this.saveAll(
//       this.getAll().map((n) => (n.id === id ? { ...n, isRead: true } : n))
//     );
//   }

//   markAllAsRead(): void {
//     this.saveAll(this.getAll().map((n) => ({ ...n, isRead: true })));
//   }

//   clearAll(): void {
//     this.saveAll([]);
//   }
// }

// export const notificationService = new NotificationService();









import type { Notification, NotificationType, NotificationModule } from '../types/Notification';

const STORAGE_KEY = 'smartcheckout_notifications';
const MAX_NOTIFICATIONS = 100;

type Listener = (notifications: Notification[]) => void;

class NotificationService {
  private listeners: Listener[] = [];

  private getAll(): Notification[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveAll(notifications: Notification[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    this.listeners.forEach((listener) => listener(notifications));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    listener(this.getAll());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getNotifications(): Notification[] {
    return this.getAll().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getUnreadCount(): number {
    return this.getAll().filter((n) => !n.isRead).length;
  }

  addNotification(data: {
    title: string;
    message: string;
    type: NotificationType;
    module: NotificationModule;
    actionUrl?: string;
  }): Notification {
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      isRead: false,
      createdAt: new Date().toISOString(),
      ...data,
    };
    const all = [newNotification, ...this.getAll()].slice(0, MAX_NOTIFICATIONS);
    this.saveAll(all);
    return newNotification;
  }

  deleteNotification(id: string): void {
    this.saveAll(this.getAll().filter((n) => n.id !== id));
  }

  markAsRead(id: string): void {
    this.saveAll(
      this.getAll().map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  markAllAsRead(): void {
    this.saveAll(this.getAll().map((n) => ({ ...n, isRead: true })));
  }

  clearAll(): void {
    this.saveAll([]);
  }
}

export const notificationService = new NotificationService();