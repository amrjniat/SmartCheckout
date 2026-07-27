// import { useState, useEffect, useRef } from 'react';
// import { notificationService } from '../../services/notification.service';
// import { Notification } from '../../types/Notification';
// import { NotificationDropdown } from './NotificationDropdown';

// interface NotificationBellProps {
//   isRtl: boolean;
// }

// export const NotificationBell = ({ isRtl }: NotificationBellProps) => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const wrapperRef = useRef<HTMLDivElement>(null);

//   useEffect(() => notificationService.subscribe(setNotifications), []);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   return (
//     <div ref={wrapperRef} className="relative">
//       <button
//         onClick={() => setIsOpen((prev) => !prev)}
//         className="notif-btn p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 relative"
//         aria-label="Notifications"
//       >
//         {unreadCount > 0 && (
//           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
//         )}
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v1.341C7.67 7.165 7 8.388 7 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//           />
//         </svg>
//       </button>

//       {isOpen && (
//         <NotificationDropdown
//           notifications={notifications.slice(0, 5)}
//           isRtl={isRtl}
//           onClose={() => setIsOpen(false)}
//         />
//       )}
//     </div>
//   );
// };





import { useState, useEffect, useRef } from 'react';
import { notificationService } from '../../services/notification.service';
import type { Notification } from '../../types/Notification';
import { NotificationDropdown } from './NotificationDropdown';

interface NotificationBellProps {
  isRtl: boolean;
}

export const NotificationBell = ({ isRtl }: NotificationBellProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => notificationService.subscribe(setNotifications), []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="notif-btn p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 relative"
        aria-label="Notifications"
      >
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        )}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v1.341C7.67 7.165 7 8.388 7 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications.slice(0, 5)}
          isRtl={isRtl}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};