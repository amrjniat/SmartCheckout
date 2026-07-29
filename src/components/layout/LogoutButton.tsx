import React from 'react';

export interface LogoutButtonProps {
  onClick?: () => void;
  isRtl?: boolean;
  variant?: 'header' | 'subheader';
  text?: string;
  className?: string;
}

export default function LogoutButton({
  onClick,
  isRtl = true,
  variant = 'header',
  text,
  className = '',
}: LogoutButtonProps) {
  // النص الذي سيظهر في التلميح عند الضغط أو التمرير
  const tooltipText = text || (isRtl ? 'تسجيل الخروج' : 'Logout');

  // أضفنا 'group' و 'relative' للتحكم في ظهور التلميح
  const baseClasses = "logout-btn group relative flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer";
  
  const variantClasses = variant === 'header'
    ? "text-rose-400 bg-rose-500/10 border border-rose-500/20"
    : "text-rose-600 bg-rose-50 border border-rose-100 shadow-sm";

  return (
    <>
      <style>{`
        .logout-btn {
          transition: transform 0.2s ease-out, background-color 0.2s ease-out, box-shadow 0.2s ease-out, color 0.2s ease-out;
          transform: scale(1);
        }
        .logout-btn.header-var:hover {
          transform: scale(1.08);
          background-color: rgba(244, 63, 94, 0.2);
          color: rgba(251, 113, 133, 1);
        }
        .logout-btn.subheader-var:hover {
          transform: scale(1.05);
          background-color: rgba(255, 228, 230, 1);
          box-shadow: 0 4px 12px rgba(225, 29, 72, 0.15);
        }
        .logout-btn:active {
          transform: scale(0.95);
        }
        /* تنسيقات التلميح المخصص (Tooltip) */
        .custom-tooltip {
          transition: opacity 0.2s ease, transform 0.2s ease;
          transform: translateY(5px);
          pointer-events: none;
        }
        /* إظهار التلميح عند التمرير أو عند الضغط (Focus/Active) */
        .group:hover .custom-tooltip,
        .group:active .custom-tooltip,
        .group:focus .custom-tooltip,
        .logout-btn:focus-within .custom-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
      `}</style>

      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses} ${variant === 'header' ? 'header-var' : 'subheader-var'} ${className}`}
        type="button"
      >
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform ${isRtl ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>

        {/* عنصر التلميح الذي سيظهر عند الضغط أو التمرير */}
        <span
          className="custom-tooltip absolute top-full mt-2 px-2.5 py-1 bg-slate-800 text-white text-[10px] font-medium rounded-md opacity-0 invisible z-50 whitespace-nowrap shadow-lg"
        >
          {tooltipText}
        </span>
      </button>
    </>
  );
}