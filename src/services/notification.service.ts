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




import toast from 'react-hot-toast';
import axiosInstance from '../services/axiosInstance';
import type {
  Notification,
  NotificationType,
  NotificationModule,
  NotificationPayload,
} from '../types/Notification';

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

const MAX_NOTIFICATIONS = 200;

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
      source: 'api',
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.notifications]));
  }

  private getToastTheme(type: NotificationType) {
    switch (type) {
      case 'success':
        return 'bg-emerald-500 text-white';
      case 'warning':
        return 'bg-amber-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
      default:
        return 'bg-sky-500 text-white';
    }
  }

  private triggerToast(notification: Notification) {
    const text = `${notification.title} • ${notification.message}`;

    switch (notification.type) {
      case 'success':
        toast.success(text, { id: notification.id, duration: 4000 });
        break;
      case 'warning':
        toast(text, {
          id: notification.id,
          duration: 4500,
          className: this.getToastTheme('warning'),
        });
        break;
      case 'error':
        toast.error(text, { id: notification.id, duration: 5000 });
        break;
      case 'info':
      default:
        toast(text, {
          id: notification.id,
          duration: 4000,
          className: this.getToastTheme('info'),
        });
        break;
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    listener([...this.notifications]);
    void this.fetchNotifications();
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  addNotification(payload: NotificationPayload): Notification {
    const notification: Notification = {
      id: payload.createdAt ? `${Date.now()}-${Math.random().toString(16).slice(2)}` : crypto.randomUUID(),
      title: payload.title,
      message: payload.message,
      type: payload.type ?? 'info',
      module: payload.module ?? 'general',
      isRead: false,
      createdAt: payload.createdAt ?? new Date().toISOString(),
      actionUrl: payload.actionUrl,
      source: payload.source ?? 'local',
    };

    this.notifications = [notification, ...this.notifications]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, MAX_NOTIFICATIONS);

    this.notify();
    this.triggerToast(notification);
    return notification;
  }

  notifyAction(payload: NotificationPayload): Notification {
    return this.addNotification(payload);
  }

  notifySales(title: string, message: string, type: NotificationType = 'info', actionUrl?: string): Notification {
    return this.notifyAction({ title, message, type, module: 'sales', actionUrl, source: 'local' });
  }

  notifyInventory(title: string, message: string, type: NotificationType = 'info', actionUrl?: string): Notification {
    return this.notifyAction({ title, message, type, module: 'inventory', actionUrl, source: 'local' });
  }

  notifyClient(title: string, message: string, type: NotificationType = 'info', actionUrl?: string): Notification {
    return this.notifyAction({ title, message, type, module: 'clients', actionUrl, source: 'local' });
  }

  notifySupplier(title: string, message: string, type: NotificationType = 'info', actionUrl?: string): Notification {
    return this.notifyAction({ title, message, type, module: 'suppliers', actionUrl, source: 'local' });
  }

  notifyInvoice(title: string, message: string, type: NotificationType = 'info', actionUrl?: string): Notification {
    return this.notifyAction({ title, message, type, module: 'invoices', actionUrl, source: 'local' });
  }

  notifySystem(title: string, message: string, type: NotificationType = 'info', actionUrl?: string): Notification {
    return this.notifyAction({ title, message, type, module: 'general', actionUrl, source: 'system' });
  }

  async fetchNotifications(): Promise<void> {
    try {
      const response = await axiosInstance.get<NotificationsResponse>('/notifications', {
        params: { pageSize: 100 },
      });
      const fetched = response.data.notifications
        .map((n) => this.mapNotification(n))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      this.notifications = fetched.length > 0 ? fetched : this.notifications;
      this.notify();
    } catch (error) {
      console.error('فشل تحميل الإشعارات:', error);
    }
  }

  private setReadState(id: string, isRead: boolean): void {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, isRead } : n
    );
    this.notify();
  }

  async markAsRead(id: string): Promise<void> {
    const normalizedId = String(id);
    this.setReadState(normalizedId, true);

    try {
      await axiosInstance.put(`/notifications/${normalizedId}/read`);
    } catch (error) {
      console.warn('فشل مزامنة تعليم الإشعار كمقروء في الـ backend، لكن حالة الواجهة تم تحديثها محليًا:', error);
    }
  }

  async markAllAsRead(): Promise<void> {
    if (this.notifications.length === 0) return;

    this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
    this.notify();

    try {
      await axiosInstance.put('/notifications/read-all');
    } catch (error) {
      console.warn('فشل مزامنة تعليم جميع الإشعارات كمقروءة في الـ backend، لكن الواجهة تم تحديثها محليًا:', error);
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