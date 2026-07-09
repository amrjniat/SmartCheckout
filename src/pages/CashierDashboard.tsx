import { useState, useRef } from 'react';
import PoswaveLogo from '../components/layout/PoswaveLogo';

export default function CashierDashboard() {
  const [isArabic, setIsArabic] = useState(true);
  const [isRtl, setIsRtl] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTimeFilter, setActiveTimeFilter] = useState('day');
  
  const navRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
    setIsRtl(!isRtl);
  };

  const translations = {
    ar: {
      langBtn: 'English',
      userTitle: 'كاشير نقطة البيع',
      userName: 'عمرو عمار',
      branchName: 'فرع حمص الرئيسي',
      avatarChar: 'ع',
      headerTitle: 'لوحة تحكم كاشير نقطة البيع', 
      headerSubtitle: 'مراقبة المبيعات اللحظية، إدارة الفواتير والعمليات السريعة',
      filterDay: 'اليوم',
      filterWeek: 'الأسبوع',
      filterMonth: 'الشهر',
      cardSales: 'مبيعاتي اليوم',
      cardInvoices: 'عدد الفواتير',
      cardCustomers: 'عدد العملاء',
      cardAvgInvoice: 'متوسط قيمة الفاتورة',
      currency: 'ل.س',
      invoiceUnit: 'فاتورة',
      customerUnit: 'عميل',
      tableTitle: 'آخر الفواتير',
      thInvoiceNo: 'رقم الفاتورة',
      thCustomer: 'العميل',
      thTime: 'الوقت',
      thTotal: 'الإجمالي',
      thStatus: 'الحالة',
      statusPaid: 'مدفوعة',
      statusPending: 'معلقة',
      topProductsTitle: 'أكثر المنتجات مبيعاً اليوم',
      qtyUnit: 'قطعة',
      productOil: 'زيت نباتي',
      productSugar: 'سكر',
      productRice: 'أرز',
      customerAhmed: 'أحمد',
      customerMohamed: 'محمد',
      customerCash: 'نقدي',
      quickActionsTitle: 'العمليات السريعة',
      actionNewSale: 'عملية بيع جديدة',
      actionViewInvoices: 'عرض الفواتير',
      actionAddCustomer: 'إضافة عميل',
      actionRecallInvoice: 'استرجاع فاتورة',
      alertsTitle: 'مركز التنبيهات',
      alertLowStock: 'يوجد 3 منتجات قاربت على النفاد ⚠️',
      alertPendingInvoices: 'توجد فاتورتان معلقتان ⚠️',
      alertSessionTimeout: 'انتهت صلاحية جلسة المستخدم بعد 20 دقيقة ⚠️',
      navHome: 'الصفحة الرئيسية',
      navPos: 'شاشة البيع (POS)',
      navInvoices: 'الفواتير',
      navCustomers: 'العملاء',
      navReturns: 'المرتجعات',
      navProfile: 'حسابي',
    },
    en: {
      langBtn: 'العربية',
      logout: 'Logout',
      userTitle: 'POS Cashier',
      userName: 'Amr Ammar',
      branchName: 'Homs Main Branch',
      avatarChar: 'A',
      headerTitle: 'POS Cashier Dashboard',
      headerSubtitle: 'Real-time sales monitoring, invoice management & quick actions',
      filterDay: 'Day',
      filterWeek: 'Week',
      filterMonth: 'Month',
      cardSales: 'My Sales Today',
      cardInvoices: 'Invoices Count',
      cardCustomers: 'Customers Served',
      cardAvgInvoice: 'Avg Invoice Value',
      currency: 'SYP',
      invoiceUnit: 'Invoices',
      customerUnit: 'Customers',
      tableTitle: 'Latest Invoices',
      thInvoiceNo: 'Invoice No',
      thCustomer: 'Customer',
      thTime: 'Time',
      thTotal: 'Total',
      thStatus: 'Status',
      statusPaid: 'Paid',
      statusPending: 'Pending',
      topProductsTitle: 'Top Selling Products Today',
      qtyUnit: 'Pcs',
      productOil: 'Vegetable Oil',
      productSugar: 'Sugar',
      productRice: 'Rice',
      customerAhmed: 'Ahmed',
      customerMohamed: 'Mohamed',
      customerCash: 'Cash',
      quickActionsTitle: 'Quick Actions',
      actionNewSale: 'New Sale',
      actionViewInvoices: 'View Invoices',
      actionAddCustomer: 'Add Customer',
      actionRecallInvoice: 'Recall Invoice',
      alertsTitle: 'Alerts Center',
      alertLowStock: '3 products are running out of stock ⚠️',
      alertPendingInvoices: 'There are 2 pending invoices ⚠️',
      alertSessionTimeout: 'User session expires in 20 minutes ⚠️',
      navHome: 'Home',
      navPos: 'POS Screen',
      navInvoices: 'Invoices',
      navCustomers: 'Customers',
      navReturns: 'Returns',
      navProfile: 'My Account',
    }
  };

  const t = isArabic ? translations.ar : translations.en;

  const menuItems = [
    { id: 'dash', text: t.navHome, active: true },
    { id: 'pos', text: t.navPos, active: false },
    { id: 'invoices', text: t.navInvoices, active: false },
    { id: 'customers', text: t.navCustomers, active: false },
    { id: 'returns', text: t.navReturns, active: false },
    { id: 'profile', text: t.navProfile, active: false },
  ];

  const invoicesData = [
    { id: 'INV-1001', customer: t.customerAhmed, time: '12:30', total: '50,000', status: 'paid' },
    { id: 'INV-1002', customer: t.customerMohamed, time: '12:45', total: '18,000', status: 'paid' },
    { id: 'INV-1003', customer: t.customerCash, time: '13:10', total: '95,000', status: 'pending' },
  ];

  const topSellingProducts = [
    { name: t.productOil, sales: `420 ${t.qtyUnit}`, percentage: '90%' },
    { name: t.productSugar, sales: `350 ${t.qtyUnit}`, percentage: '75%' },
    { name: t.productRice, sales: `210 ${t.qtyUnit}`, percentage: '50%' },
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

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-slate-50 font-sans relative" dir={isRtl ? 'rtl' : 'ltr'}>
      
      <style>{`
        .custom-horizontal-scroll::-webkit-scrollbar { height: 4px; }
        .custom-horizontal-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.01); border-radius: 100px; }
        .custom-horizontal-scroll::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.25); border-radius: 100px; }
        .custom-horizontal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.6); }
        
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }
        .card-hover:active {
          transform: translateY(-3px);
        }
      `}</style>

      {/* ========== الهيدر العلوي ========== */}
      <header className="w-full bg-[#0a192f] text-white shadow-md z-30 px-4 flex-shrink-0 select-none">
        <div className="flex items-center justify-between h-20 w-full gap-2">
          
          <div className="flex items-center gap-3 flex-shrink-0 group cursor-pointer">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 lg:hidden transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <PoswaveLogo iconSize={48} />
          </div>

          {/* شريط القوائم - بدون أسهم */}
          <div className="hidden lg:flex items-center gap-1 flex-1 max-w-[65%] relative px-6">
            <div 
              ref={navRef} 
              onMouseDown={handleMouseDown} 
              onMouseLeave={handleMouseLeaveOrUp} 
              onMouseUp={handleMouseLeaveOrUp} 
              onMouseMove={handleMouseMove} 
              className={`w-full flex items-center gap-1 overflow-x-auto custom-horizontal-scroll pb-1.5 pt-1 scroll-smooth ${isMouseDown ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
              {menuItems.map((item) => (
                <button key={item.id} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${item.active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'}`}>
                  {item.text}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={toggleLanguage} className="text-[11px] font-bold bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg min-w-[65px] text-center">
              {t.langBtn}
            </button>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-xs font-medium text-start">
                <span className="text-slate-200">{t.userName}</span>
                <span className="text-[10px] text-slate-400 opacity-80">{t.userTitle}</span>
              </div>
              <div className="w-9 h-9 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center font-bold text-sm border border-blue-500/30">
                {t.avatarChar}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========== المحتوى الرئيسي ========== */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        
        {/* شريط العنوان */}
        <div className="w-full bg-white border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">{t.headerTitle}</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{t.headerSubtitle}</p>
          </div>
          
          <div className="flex items-center gap-4 self-end sm:self-auto">
            {/* فلاتر الوقت */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-0.5">
              <button onClick={() => setActiveTimeFilter('day')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${activeTimeFilter === 'day' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                {t.filterDay}
              </button>
              <button onClick={() => setActiveTimeFilter('week')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${activeTimeFilter === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                {t.filterWeek}
              </button>
              <button onClick={() => setActiveTimeFilter('month')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${activeTimeFilter === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                {t.filterMonth}
              </button>
            </div>

            {/* معلومات المستخدم */}
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-xs">{t.avatarChar}</div>
              <div className="flex flex-col text-xs font-medium text-start">
                <span className="text-slate-800 font-bold">{t.userName}</span>
                <span className="text-[10px] text-blue-600 font-semibold">{t.branchName}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* المنطقة القابلة للتمرير */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
          
          {/* ========== البطاقات العلوية ========== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* 1. مبيعاتي اليوم */}
            <div className="card-hover p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm flex flex-col justify-between h-32 relative overflow-hidden cursor-pointer">
              <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                <span className="text-sm font-bold opacity-90">{t.cardSales}</span>
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-sm shadow-inner">💰</div>
              </div>
              <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
                <span className="text-2xl font-black tracking-tight">2,500,000</span>
                <span className="text-[11px] font-medium opacity-80">{t.currency}</span>
              </div>
            </div>

            {/* 2. عدد الفواتير */}
            <div className="card-hover p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm flex flex-col justify-between h-32 relative overflow-hidden cursor-pointer">
              <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                <span className="text-sm font-bold opacity-90">{t.cardInvoices}</span>
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-sm shadow-inner">📄</div>
              </div>
              <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
                <span className="text-3xl font-black tracking-tight">145</span>
                <span className="text-[11px] font-medium opacity-80">{t.invoiceUnit}</span>
              </div>
            </div>

            {/* 3. عدد العملاء */}
            <div className="card-hover p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-sm flex flex-col justify-between h-32 relative overflow-hidden cursor-pointer">
              <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                <span className="text-sm font-bold opacity-90">{t.cardCustomers}</span>
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-sm shadow-inner">👥</div>
              </div>
              <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
                <span className="text-3xl font-black tracking-tight">52</span>
                <span className="text-[11px] font-medium opacity-80">{t.customerUnit}</span>
              </div>
            </div>

            {/* 4. متوسط قيمة الفاتورة */}
            <div className="card-hover p-5 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-sm flex flex-col justify-between h-32 relative overflow-hidden cursor-pointer">
              <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                <span className="text-sm font-bold opacity-90">{t.cardAvgInvoice}</span>
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-sm shadow-inner">💵</div>
              </div>
              <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
                <span className="text-2xl font-black tracking-tight">17,200</span>
                <span className="text-[11px] font-medium opacity-80">{t.currency}</span>
              </div>
            </div>
          </div>

          {/* ========== الشبكة الرئيسية ========== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ========== الجزء الأيمن - الفواتير والأزرار السريعة ========== */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* جدول آخر الفواتير */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold text-slate-800">{t.tableTitle}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-start border-collapse min-w-[450px]">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold">
                        <th className="pb-3 text-start">{t.thInvoiceNo}</th>
                        <th className="pb-3 text-start">{t.thCustomer}</th>
                        <th className="pb-3 text-start">{t.thTime}</th>
                        <th className="pb-3 text-start">{t.thTotal}</th>
                        <th className="pb-3 text-start">{t.thStatus}</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-50 text-slate-600">
                      {invoicesData.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 font-bold text-blue-600 text-start">{invoice.id}</td>
                          <td className="py-3.5 font-bold text-slate-800 text-start">{invoice.customer}</td>
                          <td className="py-3.5 font-medium text-slate-400 text-start">{invoice.time}</td>
                          <td className="py-3.5 font-black text-slate-800 text-start">{invoice.total} {t.currency}</td>
                          <td className="py-3.5 text-start">
                            <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border ${invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                              {invoice.status === 'paid' ? t.statusPaid : t.statusPending}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* الأزرار السريعة */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4">{t.quickActionsTitle}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <button className="card-hover flex flex-col items-center justify-center p-4 rounded-xl border border-blue-100 bg-blue-50/30 hover:bg-blue-50 text-blue-600 transition-all group">
                    <span className="text-xl mb-1 group-hover:scale-110 transition-transform">🛒</span>
                    <span className="text-xs font-bold">{t.actionNewSale}</span>
                  </button>
                  <button className="card-hover flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-700 transition-all group">
                    <span className="text-xl mb-1 group-hover:scale-110 transition-transform">📄</span>
                    <span className="text-xs font-bold">{t.actionViewInvoices}</span>
                  </button>
                  <button className="card-hover flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-700 transition-all group">
                    <span className="text-xl mb-1 group-hover:scale-110 transition-transform">👤</span>
                    <span className="text-xs font-bold">{t.actionAddCustomer}</span>
                  </button>
                  <button className="card-hover flex flex-col items-center justify-center p-4 rounded-xl border border-amber-100 bg-amber-50/30 hover:bg-amber-50 text-amber-600 transition-all group">
                    <span className="text-xl mb-1 group-hover:scale-110 transition-transform">🔄</span>
                    <span className="text-xs font-bold">{t.actionRecallInvoice}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* ========== الجزء الأيسر - المنتجات والتنبيهات ========== */}
            <div className="space-y-6">
              
              {/* أكثر المنتجات مبيعاً */}
              <div className="card-hover bg-white rounded-2xl border border-slate-100 p-5 shadow-sm cursor-pointer">
                <h3 className="text-sm font-bold text-slate-800 mb-5 text-start">{t.topProductsTitle}</h3>
                <div className="space-y-4">
                  {topSellingProducts.map((prod, index) => (
                    <div key={index} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span className="truncate text-start">{prod.name}</span>
                        <span className="text-slate-500 font-semibold">{prod.sales}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-emerald-500' : 'bg-purple-500'}`} 
                          style={{ width: prod.percentage }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* لوحة التنبيهات */}
              <div className="card-hover bg-white rounded-2xl border border-slate-100 p-5 shadow-sm cursor-pointer">
                <h3 className="text-sm font-bold text-slate-800 mb-4 text-start">{t.alertsTitle}</h3>
                <div className="space-y-3 text-xs font-bold">
                  <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 text-start">
                    {t.alertLowStock}
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-start">
                    {t.alertPendingInvoices}
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-start">
                    {t.alertSessionTimeout}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}