import { useRef, useState } from 'react';
import PoswaveLogo from './PoswaveLogo';

export type TimeFilter = 'day' | 'week' | 'month';

export interface MenuItem {
  id: string;
  text: string;
  path?: string | null;
  active?: boolean;
}

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  activeFilter?: TimeFilter;
  onFilterChange?: (filter: TimeFilter) => void;
  isRtl?: boolean;
  onToggleRtl?: () => void;
  userName?: string;
  userTitle?: string;
  avatarChar?: string;
  branchName?: string;
  menuItems?: MenuItem[];
  onNavigate?: (path: string) => void;
  showFilters?: boolean;
  showNotifications?: boolean;
  showUserCard?: boolean;
  langBtn?: string;
}

export default function Header({
  title,
  subtitle,
  activeFilter,
  onFilterChange,
  isRtl = true,
  onToggleRtl,
  userName = 'عمرو عمار',
  userTitle = 'مدير النظام',
  avatarChar = 'ع',
  branchName = 'فرع حمص الرئيسي',
  menuItems = [],
  onNavigate,
  showFilters = false,
  showNotifications = true,
  showUserCard = true,
  langBtn,
}: HeaderProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    setIsMouseDown(true);
    startX.current = e.pageX - navRef.current.offsetLeft;
    scrollLeft.current = navRef.current.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => setIsMouseDown(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !navRef.current) return;
    e.preventDefault();
    const x = e.pageX - navRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    navRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleScrollClick = (direction: 'prev' | 'next') => {
    if (navRef.current) {
      const scrollAmount = 240;
      // 'prev' = scroll right (reveals content from left side)
      // 'next' = scroll left (reveals content from right side)
      navRef.current.scrollBy({
        left: direction === 'prev' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const t = {
    day: isRtl ? 'اليوم' : 'Day',
    week: isRtl ? 'الأسبوع' : 'Week',
    month: isRtl ? 'الشهر' : 'Month',
    lang: langBtn || (isRtl ? 'English' : 'العربية'),
  };

  // Build nav link classes using string concatenation to avoid template literal issues
  const getNavLinkClass = (item: MenuItem) => {
    const base = 'nav-link px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap';
    if (item.active) return base + ' nav-link-active';
    if (!item.path) return base + ' nav-link-disabled text-slate-300 font-medium';
    return base + ' text-slate-300 font-medium';
  };

  const getFilterClass = (filter: TimeFilter) => {
    const base = 'filter-btn px-3 py-1 rounded-lg text-xs font-bold';
    if (activeFilter === filter) return base + ' filter-active';
    return base + ' text-slate-500 hover:text-slate-800';
  };

  return (
    <>
      <style>{`
        .nav-scroll-wrap {
          overflow-x: auto;
          overflow-y: visible;
          padding-top: 6px;
          padding-bottom: 6px;
          margin-top: -6px;
          margin-bottom: -6px;
        }
        .nav-link {
          transition: transform 0.2s ease-out, background-color 0.2s ease-out, color 0.2s ease-out;
          transform: scale(1);
          flex-shrink: 0;
        }
        .nav-link:not(:disabled):hover {
          transform: scale(1.08);
          background-color: rgba(255, 255, 255, 0.15);
          color: white;
        }
        .nav-link:not(:disabled):active {
          transform: scale(0.95);
        }
        .nav-link-active {
          background-color: rgb(37, 99, 235);
          color: white;
        }
        .nav-link-active:hover {
          transform: scale(1.08);
          background-color: rgb(59, 130, 246);
        }
        .nav-link-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .scroll-btn {
          transition: transform 0.2s ease-out, background-color 0.2s ease-out;
          transform: scale(1);
          flex-shrink: 0;
        }
        .scroll-btn:hover {
          transform: scale(1.15);
          background-color: rgb(37, 99, 235);
        }
        .scroll-btn:active {
          transform: scale(0.9);
        }
        .lang-btn {
          transition: transform 0.2s ease-out, background-color 0.2s ease-out;
          transform: scale(1);
        }
        .lang-btn:hover {
          transform: scale(1.08);
          background-color: rgba(255, 255, 255, 0.25);
        }
        .lang-btn:active {
          transform: scale(0.95);
        }
        .logout-btn {
          transition: transform 0.2s ease-out, background-color 0.2s ease-out;
          transform: scale(1);
        }
        .logout-btn:hover {
          transform: scale(1.15);
          background-color: rgba(244, 63, 94, 0.15);
        }
        .logout-btn:active {
          transform: scale(0.9);
        }
        .menu-btn {
          transition: transform 0.2s ease-out, background-color 0.2s ease-out;
          transform: scale(1);
        }
        .menu-btn:hover {
          transform: scale(1.1);
          background-color: rgba(255, 255, 255, 0.15);
        }
        .menu-btn:active {
          transform: scale(0.9);
        }
        .filter-btn {
          transition: transform 0.2s ease-out, background-color 0.2s ease-out, box-shadow 0.2s ease-out;
          transform: scale(1);
        }
        .filter-btn:hover {
          transform: scale(1.08);
          background-color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        }
        .filter-btn:active {
          transform: scale(0.95);
        }
        .filter-active {
          background-color: white;
          color: rgb(37, 99, 235);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .filter-active:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .notif-btn {
          transition: transform 0.2s ease-out, background-color 0.2s ease-out;
          transform: scale(1);
        }
        .notif-btn:hover {
          transform: scale(1.15);
          background-color: rgb(241, 245, 249);
          color: rgb(71, 85, 105);
        }
        .notif-btn:active {
          transform: scale(0.9);
        }
        .user-card {
          transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
          transform: scale(1);
          cursor: pointer;
        }
        .user-card:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }
        .user-card:active {
          transform: scale(0.98);
        }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.01); border-radius: 100px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.25); border-radius: 100px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.6); }
      `}</style>

      <header className="w-full bg-[#0a1931] text-white shadow-md z-30 px-4 flex-shrink-0 select-none relative">
        <div className="flex items-center justify-between w-full gap-4 px-2 py-3">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer">
            <PoswaveLogo iconSize={48} />
          </div>

          {/* Navigation */}
          {menuItems.length > 0 && (
            <div className="hidden lg:flex items-center gap-1 flex-1 max-w-[65%] relative px-6">
              <button
                onClick={() => handleScrollClick('prev')}
                className="scroll-btn p-1 rounded-full bg-white/5 text-white focus:outline-none"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isRtl ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
                </svg>
              </button>

              <div
                ref={navRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
                className="nav-scroll-wrap w-full flex items-center gap-1 custom-scrollbar scroll-smooth"
              >
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onDragStart={(e) => e.preventDefault()}
                    onClick={() => item.path && onNavigate?.(item.path)}
                    disabled={!item.path}
                    className={getNavLinkClass(item)}
                  >
                    {item.text}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleScrollClick('next')}
                className="scroll-btn p-1 rounded-full bg-white/5 text-white focus:outline-none"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isRtl ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
                </svg>
              </button>
            </div>
          )}

          {/* Right side: Language + User */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {onToggleRtl && (
              <button
                onClick={onToggleRtl}
                className="lang-btn text-[11px] font-bold bg-white/10 px-2.5 py-1.5 rounded-lg min-w-[65px] text-center"
              >
                {t.lang}
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-xs font-medium text-start">
                <span className="text-slate-200">{userName}</span>
                <span className="text-[10px] text-slate-400 opacity-80">{userTitle}</span>
              </div>
              <div className="w-9 h-9 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center font-bold text-sm border border-blue-500/30">
                {avatarChar}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sub-header with title, filters, and user card */}
      {(title || showFilters || showNotifications || showUserCard) && (
        <div className="w-full bg-white border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
          <div>
            {title && <h1 className="text-xl font-black text-slate-800 tracking-tight">{title}</h1>}
            {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            {showFilters && activeFilter && onFilterChange && (
              <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-0.5">
                {(['day', 'week', 'month'] as TimeFilter[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => onFilterChange(filter)}
                    className={getFilterClass(filter)}
                  >
                    {filter === 'day' ? t.day : filter === 'week' ? t.week : t.month}
                  </button>
                ))}
              </div>
            )}

            {showNotifications && (
              <button className="notif-btn p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 relative">
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v1.341C7.67 7.165 7 8.388 7 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            )}

            {showUserCard && (
              <div className="user-card flex items-center gap-2.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm shadow-blue-600/20">
                  {avatarChar}
                </div>
                <div className="flex flex-col text-xs font-medium text-start">
                  <span className="text-slate-800 font-bold">{userName}</span>
                  <span className="text-[10px] text-blue-600 font-semibold">{branchName}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}



