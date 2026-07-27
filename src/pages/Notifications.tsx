import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bell, Search, Trash2, CheckCheck } from 'lucide-react';
import { notificationService } from '../services/notification.service';
import type { Notification, NotificationModule } from '../types/Notification';

interface LayoutContext {
  isRtl: boolean;
}

const translations = {
  ar: {
    title: 'الإشعارات', subtitle: 'عرض وإدارة جميع إشعاراتك', searchPlaceholder: 'ابحث في الإشعارات...',
    all: 'الكل', unread: 'غير مقروء', sales: 'المبيعات', inventory: 'المخزون', clients: 'العملاء',
    suppliers: 'الموردين', invoices: 'الفواتير', general: 'عام', markAllRead: 'تعليم الكل كمقروء',
    empty: 'لا يوجد إشعارات', delete: 'حذف',
  },
  en: {
    title: 'Notifications', subtitle: 'View and manage all your notifications', searchPlaceholder: 'Search notifications...',
    all: 'All', unread: 'Unread', sales: 'Sales', inventory: 'Inventory', clients: 'Clients',
    suppliers: 'Suppliers', invoices: 'Invoices', general: 'General', markAllRead: 'Mark all as read',
    empty: 'No notifications', delete: 'Delete',
  },
};

const moduleFilters: (NotificationModule | 'all')[] = ['all', 'sales', 'inventory', 'clients', 'suppliers', 'invoices', 'general'];

export default function NotificationsPage() {
  const { isRtl } = useOutletContext<LayoutContext>();
  const t = translations[isRtl ? 'ar' : 'en'];

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState<NotificationModule | 'all'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => notificationService.subscribe(setNotifications), []);

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase());
      const matchesModule = moduleFilter === 'all' || n.module === moduleFilter;
      const matchesUnread = !showUnreadOnly || !n.isRead;
      return matchesSearch && matchesModule && matchesUnread;
    });
  }, [notifications, search, moduleFilter, showUnreadOnly]);

  return (
    <div className="p-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
          <p className="text-gray-500 text-sm">{t.subtitle}</p>
        </div>
        <button
          onClick={() => notificationService.markAllAsRead()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <CheckCheck className="w-4 h-4" />
          {t.markAllRead}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full ${isRtl ? 'pr-9' : 'pl-9'} py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
        </div>
        <button
          onClick={() => setShowUnreadOnly((prev) => !prev)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showUnreadOnly ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          {t.unread}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {moduleFilters.map((m) => (
          <button
            key={m}
            onClick={() => setModuleFilter(m)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${moduleFilter === m ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {t[m]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Bell className="w-10 h-10 mb-2" />
            <p className="text-sm">{t.empty}</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => notificationService.markAsRead(n.id)}
              className={`flex items-start gap-3 px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-blue-50/40' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800">{n.title}</p>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString(isRtl ? 'ar-EG' : 'en-US')}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); notificationService.deleteNotification(n.id); }}
                className="text-gray-300 hover:text-red-500 transition-colors"
                aria-label={t.delete}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}