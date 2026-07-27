export type NotificationType = 'success' | 'warning' | 'info' | 'error';
export type NotificationModule =
  | 'sales'
  | 'inventory'
  | 'clients'
  | 'suppliers'
  | 'invoices'
  | 'general';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  module: NotificationModule;
  isRead: boolean;
  createdAt: string; // ISO date string
  actionUrl?: string;
}