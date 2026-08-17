// import type { Notification, NotificationType, NotificationModule } from '../types/Notification';

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




import axiosInstance from '../services/axiosInstance';
import type { Notification, NotificationType, NotificationModule } from '../types/Notification';

type Listener = (notifications: Notification[]) => void;

interface BackendNotification {
  id: number;
  title: string;
  message: string;
  type: NotificationType | null;
  module: NotificationModule;
  redirectUrl: string | null;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

interface NotificationsResponse {
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  notifications: BackendNotification[];
}

class NotificationService {
  private listeners: Listener[] = [];
  private notifications: Notification[] = [];

  private mapNotification(n: BackendNotification): Notification {
    return {
      id: String(n.id),
      title: n.title,
      message: n.message,
      type: n.type ?? 'info',
      module: n.module,
      isRead: n.isRead,
      createdAt: n.createdAt,
      actionUrl: n.redirectUrl ?? undefined,
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.notifications));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    listener(this.notifications);
    this.fetchNotifications();
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  async fetchNotifications(): Promise<void> {
    try {
      const response = await axiosInstance.get<NotificationsResponse>('/notifications', {
        params: { pageSize: 100 },
      });
      this.notifications = response.data.notifications
        .map((n) => this.mapNotification(n))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.notify();
    } catch (error) {
      console.error('فشل تحميل الإشعارات:', error);
    }
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  async markAsRead(id: string): Promise<void> {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      this.notifications = this.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      this.notify();
    } catch (error) {
      console.error('فشل تعليم الإشعار كمقروء:', error);
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await axiosInstance.put('/notifications/read-all');
      this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
      this.notify();
    } catch (error) {
      console.error('فشل تعليم جميع الإشعارات كمقروءة:', error);
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      this.notifications = this.notifications.filter((n) => n.id !== id);
      this.notify();
    } catch (error) {
      console.error('فشل حذف الإشعار:', error);
    }
  }
}

export const notificationService = new NotificationService();