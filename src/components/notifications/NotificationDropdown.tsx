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

  return (
    <div
      className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">{t.title}</h3>
        {notifications.length > 0 && (
          <button onClick={() => notificationService.markAllAsRead()} className="text-xs text-blue-500 hover:underline">
            {t.markAllRead}
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">{t.empty}</p>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => handleItemClick(n)}
              className={`w-full text-start flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${!n.isRead ? 'bg-blue-50/40' : ''}`}
            >
              <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${typeColors[n.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{n.title}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
              </div>
            </button>
          ))
        )}
      </div>

      <button
        onClick={() => { navigate('/notifications'); onClose(); }}
        className="w-full text-center text-sm text-blue-500 hover:bg-gray-50 py-2.5 font-medium"
      >
        {t.viewAll}
      </button>
    </div>
  );
};