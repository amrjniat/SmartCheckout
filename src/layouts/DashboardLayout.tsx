import { useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import PoswaveLogo from '../components/layout/PoswaveLogo';

export default function DashboardLayout() {
  const [isRtl, setIsRtl] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTimeFilter, setActiveTimeFilter] = useState('day');
  
  const navRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // قاموس الترجمة الشامل لجميع عناصر الواجهة بما فيها محتويات صورة image_dd2445.jpg
  const translations = {
    ar: {
      langBtn: 'English',
      logout: 'تسجيل الخروج',
      userTitle: 'مدير النظام',
      userName: 'عمرو عمار',
      branchName: 'فرع حمص الرئيسي',
      avatarChar: 'ع',
      headerTitle: 'نظرة عامة', // العنوان الرئيسي يظهر بالإنجليزية كما بالصورة
      headerSubtitle: 'ملخص أداء النظام لليوم',
      
      // أزرار الفلترة الزمنية
      filterDay: 'اليوم',
      filterWeek: 'الأسبوع',
      filterMonth: 'الشهر',

      // نصوص بطاقات الإحصائيات الأربعة
      cardSales: 'مبيعات اليوم',
      cardInvoices: 'عدد الفواتير',
      cardProfit: 'الربح الصافي',
      cardStock: 'مواد منخفضة المخزون',
      
      // الوحدات والعملات
      currency: 'ل.س',
      unitInvoice: 'فاتورة',
      unitItem: 'مادة',

      // محتويات الجدول الأسفل
      tableTitle: 'أحدث الحركات والفواتير',
      viewAll: 'عرض الكل ←',
      thInvoice: 'رقم الفاتورة',
      thCustomer: 'العميل',
      thTime: 'الوقت',
      thTotal: 'الإجمالي',
      thStatus: 'الحالة',
      topProductsTitle: 'الأكثر مبيعاً اليوم',
      statusPaid: 'مدفوعة',
      statusPending: 'معلقة'
    },
    en: {
      langBtn: 'العربية',
      logout: 'Logout',
      userTitle: 'System Admin',
      userName: 'Amr Ammar',
      branchName: 'Homs Main Branch',
      avatarChar: 'A',
      headerTitle: 'Overview',
      headerSubtitle: 'System performance summary for today',
      
      filterDay: 'Day',
      filterWeek: 'Week',
      filterMonth: 'Month',

      cardSales: "Today's Sales",
      cardInvoices: 'Invoices Count',
      cardProfit: 'Net Profit',
      cardStock: 'Low Stock Items',
      
      currency: 'SYP',
      unitInvoice: 'Invoices',
      unitItem: 'Items',

      tableTitle: 'Recent Transactions & Invoices',
      viewAll: 'View All →',
      thInvoice: 'Invoice No.',
      thCustomer: 'Customer',
      thTime: 'Time',
      thTotal: 'Total',
      thStatus: 'Status',
      topProductsTitle: 'Top Selling Today',
      statusPaid: 'Paid',
      statusPending: 'Pending'
    }
  };

  const t = isRtl ? translations.ar : translations.en;

  const menuItems = [
    { id: 'dash', text: isRtl ? 'الصفحه الرئيسيه' : 'Home page', active: true },
    { id: 'pos', text: isRtl ? 'شاشة البيع السريع (POS)' : 'Quick Sale Screen (POS)', active: false },
    { id: 'products', text: isRtl ? 'إدارة المواد والمنتجات' : 'Products Management', active: false },
    { id: 'inventory', text: isRtl ? 'المخزون والمستودعات' : 'Inventory & Warehouses', active: false },
    { id: 'sales', text: isRtl ? 'الفواتير والمبيعات' : 'Sales & Invoices', active: false },
    { id: 'customers', text: isRtl ? 'إدارة العملاء والزبائن' : 'Customers & Clients', active: false },
    { id: 'team', text: isRtl ? 'إدارة الفريق والموظفين' : 'Team & Employees', active: false },
    { id: 'reports', text: isRtl ? 'التقارير والتحليلات البيانية' : 'Reports & Analytics', active: false },
    { id: 'settings', text: isRtl ? 'إعدادات النظام العامة' : 'General Settings', active: false },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    setIsMouseDown(true);
    startX.current = e.pageX - navRef.current.offsetLeft;
    scrollLeft.current = navRef.current.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !navRef.current) return;
    e.preventDefault(); 
    const x = e.pageX - navRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; 
    navRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleScrollClick = (direction: 'right' | 'left') => {
    if (navRef.current) {
      const scrollAmount = 240;
      if (direction === 'left') {
        navRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        navRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-slate-50 font-sans relative" dir={isRtl ? 'rtl' : 'ltr'}>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.01); border-radius: 100px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.25); border-radius: 100px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.6); }
      `}</style>

      {/* الهيدر العلوي الحاضن لشعار POSWAVE من صورة image_dd0dc3_2.png */}
      <header className="w-full bg-[#0a1931] text-white shadow-md z-30 px-4 flex-shrink-0 select-none">
        <div className="flex items-center justify-between h-20 w-full gap-2">
          
          <div className="flex items-center gap-3 flex-shrink-0 group cursor-pointer">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 lg:hidden transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <PoswaveLogo iconSize={48} />
          </div>

          <div className="hidden lg:flex items-center gap-1 flex-1 max-w-[65%] relative px-6">
            <button onClick={() => handleScrollClick('right')} className="absolute right-0 z-10 p-1 rounded-full bg-white/5 hover:bg-blue-600 text-white transition-all focus:outline-none">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </button>
            <div ref={navRef} onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeaveOrUp} onMouseUp={handleMouseLeaveOrUp} onMouseMove={handleMouseMove} className={`w-full flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1.5 pt-1 scroll-smooth ${isMouseDown ? 'cursor-grabbing' : 'cursor-grab'}`}>
              {menuItems.map((item) => (
                <button key={item.id} onDragStart={(e) => e.preventDefault()} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${item.active ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'}`}>{item.text}</button>
              ))}
            </div>
            <button onClick={() => handleScrollClick('left')} className="absolute left-0 z-10 p-1 rounded-full bg-white/5 hover:bg-blue-600 text-white transition-all focus:outline-none">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => setIsRtl(!isRtl)} className="text-[11px] font-bold bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg min-w-[65px] text-center">{t.langBtn}</button>
            <button className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors hidden sm:block" title={t.logout}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-xs font-medium text-start">
                <span className="text-slate-200">{t.userName}</span>
                <span className="text-[10px] text-slate-400 opacity-80">{t.userTitle}</span>
              </div>
              <div className="w-9 h-9 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center font-bold text-sm border border-blue-500/30">{t.avatarChar}</div>
            </div>
          </div>

        </div>
      </header>

      {/* محتوى لوحة التحكم الفرعي المصلح والمطابق تماماً لصورة image_dd2445.jpg */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        
        {/* صف عنوان التصفح والفلترة والبروفايل الفرعي المقابل له */}
        <div className="w-full bg-white border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">{t.headerTitle}</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{t.headerSubtitle}</p>
          </div>
          
          {/* الجانب الأيمن من صف الـ Header: أدوات الفلترة وبطاقة الحساب الفرعية المترجمة */}
          <div className="flex items-center gap-4 self-end sm:self-auto">
            {/* التبديل الزمني (اليوم / الأسبوع / الشهر) */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-0.5">
              <button onClick={() => setActiveTimeFilter('day')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${activeTimeFilter === 'day' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{t.filterDay}</button>
              <button onClick={() => setActiveTimeFilter('week')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${activeTimeFilter === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{t.filterWeek}</button>
              <button onClick={() => setActiveTimeFilter('month')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${activeTimeFilter === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{t.filterMonth}</button>
            </div>

            {/* أيقونة الإشعارات التنبيهية */}
            <button className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-100 relative">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v1.341C7.67 7.165 7 8.388 7 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>

            {/* الكارد المصغر للمستخدم الظاهر في الصورة المترجم مع الاتجاه */}
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm shadow-blue-600/20">{t.avatarChar}</div>
              <div className="flex flex-col text-xs font-medium text-start">
                <span className="text-slate-800 font-bold">{t.userName}</span>
                <span className="text-[10px] text-blue-600 font-semibold">{t.branchName}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* هنا مكان حقن الصفحة الحالية (Dashboard.tsx وغيرها) عبر React Router */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <Outlet context={{ isRtl, setIsRtl }} />
        </div>
      </div>

    </div>
  );
}