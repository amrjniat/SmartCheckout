// import { useNavigate } from 'react-router-dom';
// import { Notification } from '../../types/Notification';
// import { notificationService } from '../../services/notification.service';

// interface NotificationDropdownProps {
//   notifications: Notification[];
//   isRtl: boolean;
//   onClose: () => void;
// }

// const typeColors: Record<Notification['type'], string> = {
//   success: 'bg-green-500',
//   warning: 'bg-orange-500',
//   info: 'bg-blue-500',
//   error: 'bg-red-500',
// };

// const translations = {
//   ar: { title: 'الإشعارات', empty: 'لا يوجد إشعارات', viewAll: 'عرض جميع الإشعارات', markAllRead: 'تعليم الكل كمقروء' },
//   en: { title: 'Notifications', empty: 'No notifications', viewAll: 'View all notifications', markAllRead: 'Mark all as read' },
// };

// export const NotificationDropdown = ({ notifications, isRtl, onClose }: NotificationDropdownProps) => {
//   const navigate = useNavigate();
//   const t = translations[isRtl ? 'ar' : 'en'];

//   const handleItemClick = (n: Notification) => {
//     notificationService.markAsRead(n.id);
//     if (n.actionUrl) navigate(n.actionUrl);
//     onClose();
//   };

//   return (
//     <div
//       className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden`}
//       dir={isRtl ? 'rtl' : 'ltr'}
//     >
//       <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
//         <h3 className="font-semibold text-gray-800">{t.title}</h3>
//         {notifications.length > 0 && (
//           <button onClick={() => notificationService.markAllAsRead()} className="text-xs text-blue-500 hover:underline">
//             {t.markAllRead}
//           </button>
//         )}
//       </div>

//       <div className="max-h-80 overflow-y-auto">
//         {notifications.length === 0 ? (
//           <p className="text-center text-gray-400 text-sm py-6">{t.empty}</p>
//         ) : (
//           notifications.map((n) => (
//             <button
//               key={n.id}
//               onClick={() => handleItemClick(n)}
//               className={`w-full text-start flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${!n.isRead ? 'bg-blue-50/40' : ''}`}
//             >
//               <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${typeColors[n.type]}`} />
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-800 truncate">{n.title}</p>
//                 <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
//               </div>
//             </button>
//           ))
//         )}
//       </div>

//       <button
//         onClick={() => { navigate('/notifications'); onClose(); }}
//         className="w-full text-center text-sm text-blue-500 hover:bg-gray-50 py-2.5 font-medium"
//       >
//         {t.viewAll}
//       </button>
//     </div>
//   );
// };











import { useNavigate } from 'react-router-dom';
import type { Notification } from '../../types/Notification';
import { notificationService } from '../../services/notification.service';

interface NotificationDropdownProps {
  notifications: Notification[];
  isRtl: boolean;
  onClose: () => void;
}

const typeColors: Record<Notification['type'], string> = {
  success: 'bg-green-500',
  warning: 'bg-orange-500',
  info: 'bg-blue-500',
  error: 'bg-red-500',
};

const translations = {
  ar: { title: 'الإشعارات', empty: 'لا يوجد إشعارات', viewAll: 'عرض جميع الإشعارات', markAllRead: 'تعليم الكل كمقروء' },
  en: { title: 'Notifications', empty: 'No notifications', viewAll: 'View all notifications', markAllRead: 'Mark all as read' },
};

export const NotificationDropdown = ({ notifications, isRtl, onClose }: NotificationDropdownProps) => {
  const navigate = useNavigate();
  const t = translations[isRtl ? 'ar' : 'en'];

  const handleItemClick = (n: Notification) => {
    notificationService.markAsRead(n.id);
    if (n.actionUrl) navigate(n.actionUrl);
    onClose();
  };

  const formatTime = (value: string) => {
    try {
      return new Date(value).toLocaleString(isRtl ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return value;
    }
  };

  return (
    <div
      className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-[360px] rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 z-50 overflow-hidden`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">{t.title}</h3>
          <p className="text-[11px] text-slate-500">{notifications.length} {isRtl ? 'إشعار' : 'items'}</p>
        </div>
        {notifications.length > 0 && (
          <button onClick={() => notificationService.markAllAsRead()} className="text-xs font-medium text-blue-600 hover:text-blue-700">
            {t.markAllRead}
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-400">
            <div className="rounded-full bg-slate-100 p-3">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v1.341C7.67 7.165 7 8.388 7 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-sm">{t.empty}</p>
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => handleItemClick(n)}
              className={`w-full border-b border-slate-100 px-4 py-3 text-start transition hover:bg-slate-50 ${!n.isRead ? 'bg-blue-50/40' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${typeColors[n.type]}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-slate-800">{n.title}</p>
                    {!n.isRead && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{n.message}</p>
                  <p className="mt-2 text-[10px] text-slate-400">{formatTime(n.createdAt)}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      <button
        onClick={() => { navigate('/notifications'); onClose(); }}
        className="w-full border-t border-slate-100 bg-white px-4 py-3 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
      >
        {t.viewAll}
      </button>
    </div>
  );
};