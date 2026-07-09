import { useState, useRef, type MouseEvent } from 'react';
import Header from '../components/layout/Header';

type TimeFilter = 'day' | 'week' | 'month';

// بيانات الترجمة
const translations = {
  ar: {
    title: 'نظرة عامة',
    filterDay: 'اليوم',
    filterWeek: 'الأسبوع',
    filterMonth: 'الشهر',
    filterTextDay: 'ملخص أداء النظام لليوم',
    filterTextWeek: 'ملخص أداء النظام للأسبوع الحالي',
    filterTextMonth: 'ملخص أداء النظام للشهر الحالي',
    cardSales: 'مبيعات اليوم',
    cardInvoices: 'عدد الفواتير',
    cardProfit: 'الربح الصافي',
    cardLowStock: 'مواد منخفضة المخزون',
    currency: 'ل.س',
    invoiceUnit: 'فاتورة',
    itemUnit: 'مادة',
    tableTitle: 'أحدث الحركات والفواتير',
    viewAll: 'عرض الكل ←',
    thInvoiceNo: 'رقم الفاتورة',
    thCustomer: 'العميل',
    thTime: 'الوقت',
    thTotal: 'الإجمالي',
    thStatus: 'الحالة',
    statusPaid: 'مدفوعة',
    statusPending: 'معلقة',
    topProductsTitle: 'الأكثر مبيعاً اليوم',
    clientCash: 'عميل نقدي',
    clientCompany: 'شركة الأمل التجارية',
    clientAhmed: 'أحمد العلي',
    clientInstitution: 'مؤسسة النجاح',
    productOil: 'زيت نباتي سيدي هشام 1ل',
    productSugar: 'سكر الأسرة ناعم 1كغ',
  },
  en: {
    title: 'Overview',
    filterDay: 'Day',
    filterWeek: 'Week',
    filterMonth: 'Month',
    filterTextDay: "Today's System Performance Summary",
    filterTextWeek: 'Current Week Performance Summary',
    filterTextMonth: 'Current Month Performance Summary',
    cardSales: "Today's Sales",
    cardInvoices: 'Invoices Count',
    cardProfit: 'Net Profit',
    cardLowStock: 'Low Stock Items',
    currency: 'SYP',
    invoiceUnit: 'Invoice',
    itemUnit: 'Items',
    tableTitle: 'Latest Transactions & Invoices',
    viewAll: 'View All →',
    thInvoiceNo: 'Invoice No',
    thCustomer: 'Customer',
    thTime: 'Time',
    thTotal: 'Total',
    thStatus: 'Status',
    statusPaid: 'Paid',
    statusPending: 'Pending',
    topProductsTitle: 'Top Selling Products Today',
    clientCash: 'Cash Client',
    clientCompany: 'Al-Amal Trading Co.',
    clientAhmed: 'Ahmed Al-Ali',
    clientInstitution: 'Al-Najah Institution',
    productOil: 'Sidi Hashem Vegetable Oil 1L',
    productSugar: 'Household Sugar Fine 1kg',
  }
};

const dayData = {
  sales: '2,500,000',
  invoices: '145',
  profit: '850,000',
  lowStock: '12',
  topProducts: [
    { nameKey: 'productOil', salesCount: '412 قطعة', percentage: 85 },
    { nameKey: 'productSugar', salesCount: '350 قطعة', percentage: 70 }
  ],
  transactions: [
    { id: '#INV-08-42', clientKey: 'clientCash', time: '12:40 م', total: '150,000', status: 'paid' },
    { id: '#INV-08-41', clientKey: 'clientCompany', time: '11:15 ص', total: '1,200,000', status: 'pending' },
    { id: '#INV-08-40', clientKey: 'clientAhmed', time: '10:30 ص', total: '85,000', status: 'paid' }
  ]
};

const weekData = {
  sales: '17,400,000',
  invoices: '980',
  profit: '5,800,000',
  lowStock: '15',
  topProducts: [
    { nameKey: 'productOil', salesCount: '2,840 قطعة', percentage: 90 },
    { nameKey: 'productSugar', salesCount: '2,100 قطعة', percentage: 75 }
  ],
  transactions: [
    { id: '#INV-08-35', clientKey: 'clientCompany', time: 'أمس', total: '3,100,000', status: 'paid' },
    { id: '#INV-08-34', clientKey: 'clientCash', time: 'أول أمس', total: '450,000', status: 'paid' }
  ]
};

const monthData = {
  sales: '72,150,000',
  invoices: '4,120',
  profit: '24,300,000',
  lowStock: '8',
  topProducts: [
    { nameKey: 'productOil', salesCount: '11,500 قطعة', percentage: 95 },
    { nameKey: 'productSugar', salesCount: '9,400 قطعة', percentage: 80 }
  ],
  transactions: [
    { id: '#INV-07-90', clientKey: 'clientInstitution', time: '12 يونيو', total: '8,500,000', status: 'pending' },
    { id: '#INV-07-89', clientKey: 'clientAhmed', time: '10 يونيو', total: '120,000', status: 'paid' }
  ]
};

const filterTextData: Record<TimeFilter, string> = {
  day: 'filterTextDay',
  week: 'filterTextWeek',
  month: 'filterTextMonth'
};

const dashboardMockData: Record<TimeFilter, typeof dayData> = {
  day: dayData,
  week: weekData,
  month: monthData
};

// ✅ مكون البطاقة بعد إعادة الهيكلة الجذرية الشاملة
interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: 'blue' | 'purple' | 'green' | 'orange';
}

const HoverCard = ({ children, className = '', accentColor = 'blue' }: HoverCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const accentColors = {
    blue: { glow: 'rgba(59, 130, 246, 0.45)', border: 'rgba(59, 130, 246, 0.35)', shine: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, transparent 60%)' },
    purple: { glow: 'rgba(168, 85, 247, 0.45)', border: 'rgba(168, 85, 247, 0.35)', shine: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, transparent 60%)' },
    green: { glow: 'rgba(34, 197, 94, 0.45)', border: 'rgba(34, 197, 94, 0.35)', shine: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, transparent 60%)' },
    orange: { glow: 'rgba(249, 115, 22, 0.45)', border: 'rgba(249, 115, 22, 0.35)', shine: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, transparent 60%)' }
  };

  const currentAccent = accentColors[accentColor];

  // دالة الحساب الفوري وحقن خصائص CSS المخصصة لتجنب Re-render وتفعيل الـ GPU
  const processCoordinates = (e: MouseEvent<HTMLDivElement>, scaleValue: number) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const px = x / rect.width;
    const py = y / rect.height;

    const rx = (py - 0.5) * -16; // زاوية دوران واضحة ومدروسة
    const ry = (px - 0.5) * 16;

    // تحويل النطاق إلى [-1, 1] لحساب الـ Parallax الداخلي للعناصر بدقة
    const mx = (px - 0.5) * 2;
    const my = (py - 0.5) * 2;

    el.style.setProperty('--rx', `${rx}deg`);
    el.style.setProperty('--ry', `${ry}deg`);
    el.style.setProperty('--mx', `${mx}`);
    el.style.setProperty('--my', `${my}`);
    el.style.setProperty('--glare-x', `${px * 100}%`);
    el.style.setProperty('--glare-y', `${py * 100}%`);
    el.style.setProperty('--scale', `${scaleValue}`);
  };

  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    processCoordinates(e, 1.04); // تضخيم فوري عند الدخول (نقطة 4)
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    processCoordinates(e, 1.04);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    processCoordinates(e, 0.95); // انضغاط فوري عند النقر بدون انتظار الحركة (نقطة 3)
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    processCoordinates(e, 1.04);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const el = cardRef.current;
    if (!el) return;

    // إرجاع القيم للمركز بدقة لتصحيح التجميد (نقطة 11)
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--mx', '0');
    el.style.setProperty('--my', '0');
    el.style.setProperty('--glare-x', '50%');
    el.style.setProperty('--glare-y', '50%');
    el.style.setProperty('--scale', '1');
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ 
        perspective: '1400px', 
        transformStyle: 'preserve-3d' 
      }}
    >
      {/* الوهج الخلفي المستقر - Glow */}
      <div
        className="absolute -inset-1 rounded-2xl pointer-events-none blur-2xl"
        style={{
          background: currentAccent.glow,
          opacity: isHovered ? 0.7 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      />

      {/* جسم الكارت الرئيسي الخاضع للـ GPU المحرك بالكامل بالمتغيرات */}
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="relative bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-2xl cursor-pointer select-none"
        style={{
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden', // تسريع معالجة الرسوميات (نقطة 6)
          contain: 'paint',             // عزل كامل للـ Paint للحصول على أعلى سلاسة
          transform: isHovered
            ? 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(var(--scale, 1.04)) translateZ(10px)'
            : 'rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)',
          boxShadow: isHovered
            ? `0 35px 60px -15px ${currentAccent.glow}, 0 0 0 1px ${currentAccent.border}, 0 15px 30px rgba(0,0,0,0.12)`
            : '0 4px 6px -1px rgba(0,0,0,0.03), 0 2px 4px -1px rgba(0,0,0,0.02), 0 0 0 1px rgba(0,0,0,0.04)',
          border: `1px solid ${isHovered ? currentAccent.border : 'transparent'}`,
          // الغاء الـ transform تماماً من الانتقال أثناء الـ Hover لمنع التقطيع (نقطة 5)
          transition: isHovered 
            ? 'box-shadow 0.2s ease, border 0.2s ease' 
            : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease, border 0.5s ease'
        }}
      >
        {/* لمعان الخلفية المحيطي - Shine */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
          style={{
            background: currentAccent.shine,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.4s ease'
          }}
        />

        {/* تأثير انعكاس البريق الضخم فائق النعومة - Glare (نقطة 2، 7، 11) */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          <div
            className="absolute w-72 h-72 rounded-full mix-blend-overlay opacity-0"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, transparent 75%)',
              left: 'var(--glare-x, 50%)',
              top: 'var(--glare-y, 50%)',
              transform: 'translate(-50%, -50%) translateZ(1px)',
              filter: 'blur(12px)',
              willChange: 'left, top, opacity', // إجبار المتصفح على معالجة المواقع سينمائياً
              opacity: isHovered ? 0.65 : 0,
              transition: isHovered 
                ? 'left .06s linear, top .06s linear, opacity 0.3s ease' 
                : 'left 0.5s ease, top 0.5s ease, opacity 0.5s ease'
            }}
          />
        </div>

        {/* الخط العلوي الانسيابي المتوهج */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${currentAccent.border}, transparent)`,
            transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.6s ease'
          }}
        />

        {/* الحاوية الداخلية الحاضنة للـ 3D الفعلي لجميع الأبناء */}
        <div style={{ transformStyle: 'preserve-3d' }} className="relative z-10 h-full w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

// ✅ مكون صف المنتج - تم تعديل الـ Hover لمنع تعارض المصفوفات (نقطة 12)
const ProductRow = ({
  product,
  index,
  getTranslatedValue
}: {
  product: { nameKey: string; salesCount: string; percentage: number };
  index: number;
  getTranslatedValue: (key: string) => string;
}) => (
  <div className="space-y-3 p-2 rounded-xl transition-colors duration-200 hover:bg-slate-50/80">
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-400 text-xs">{product.salesCount}</span>
      <span className="font-semibold text-slate-800">
        {getTranslatedValue(product.nameKey)}
      </span>
    </div>
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${
          index === 0 ? 'bg-blue-600' : 'bg-purple-500'
        }`}
        style={{ width: `${product.percentage}%` }}
      />
    </div>
  </div>
);

// مكون زر الفلتر
const FilterButton = ({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
      active
        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105'
        : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
    }`}
  >
    {children}
  </button>
);

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('day');
  const [isArabic, setIsArabic] = useState(true);
  const [isRtl, setIsRtl] = useState(true);

  const toggleLanguage = () => {
    setIsArabic((prev) => !prev);
    setIsRtl((prev) => !prev);
  };

  const t = translations[isArabic ? 'ar' : 'en'];
  const currentData = dashboardMockData[activeFilter];

  const getTranslatedValue = (key: string): string => {
    const translationsAr = translations.ar as Record<string, string>;
    const translationsEn = translations.en as Record<string, string>;
    return isArabic ? (translationsAr[key] || key) : (translationsEn[key] || key);
  };

  const getFilterText = (): string => {
    const filterKey = filterTextData[activeFilter];
    return t[filterKey as keyof typeof t] || '';
  };

  const getStatusClass = (status: string): string => {
    return status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-right" dir={isRtl ? 'rtl' : 'ltr'}>
      <Header title={t.title} subtitle={getFilterText()} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl text-sm font-medium">
            <FilterButton active={activeFilter === 'day'} onClick={() => setActiveFilter('day')}>{t.filterDay}</FilterButton>
            <FilterButton active={activeFilter === 'week'} onClick={() => setActiveFilter('week')}>{t.filterWeek}</FilterButton>
            <FilterButton active={activeFilter === 'month'} onClick={() => setActiveFilter('month')}>{t.filterMonth}</FilterButton>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.title}</h1>
            <p className="text-sm text-slate-500 mt-1">{getFilterText()}</p>
          </div>
          <button onClick={toggleLanguage} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-all hover:scale-105 active:scale-95">
            {isArabic ? 'English' : 'العربية'}
          </button>
        </div>

        {/* 💡 تطبيق الـ Parallax الحقيقي ثلاثي الأبعاد بتمرير إزاحات مختلفة ومستويات غائرة ومتطورة لكل عنصر (نقطة 1، 8، 9) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* كرت المبيعات - أزرق */}
          <HoverCard accentColor="blue">
            <div className="flex justify-between items-start mb-4" style={{ transformStyle: 'preserve-3d' }}>
              <span 
                className="text-sm font-semibold text-slate-600 block"
                style={{ 
                  transform: 'translateZ(45px) translateX(calc(var(--mx, 0) * -4px)) translateY(calc(var(--my, 0) * -4px))',
                  backfaceVisibility: 'hidden'
                }}
              >
                {t.cardSales}
              </span>
              <div 
                className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg shadow-lg shadow-blue-200/50"
                style={{ 
                  transform: 'translateZ(75px) translateX(calc(var(--mx, 0) * -12px)) translateY(calc(var(--my, 0) * -12px))',
                  backfaceVisibility: 'hidden'
                }}
              >
                💰
              </div>
            </div>
            <div 
              className="text-2xl sm:text-3xl font-black text-slate-900 text-right tracking-tight"
              style={{ 
                transform: 'translateZ(100px) translateX(calc(var(--mx, 0) * -18px)) translateY(calc(var(--my, 0) * -18px))',
                backfaceVisibility: 'hidden'
              }}
            >
              {currentData.sales}
            </div>
            <div 
              className="text-sm text-slate-500 mt-1 block"
              style={{ 
                transform: 'translateZ(30px) translateX(calc(var(--mx, 0) * -2px)) translateY(calc(var(--my, 0) * -2px))',
                backfaceVisibility: 'hidden'
              }}
            >
              {t.currency}
            </div>
          </HoverCard>

          {/* كرت الفواتير - بنفسجي */}
          <HoverCard accentColor="purple">
            <div className="flex justify-between items-start mb-4" style={{ transformStyle: 'preserve-3d' }}>
              <span 
                className="text-sm font-semibold text-slate-600 block"
                style={{ 
                  transform: 'translateZ(45px) translateX(calc(var(--mx, 0) * -4px)) translateY(calc(var(--my, 0) * -4px))',
                  backfaceVisibility: 'hidden'
                }}
              >
                {t.cardInvoices}
              </span>
              <div 
                className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-lg shadow-lg shadow-purple-200/50"
                style={{ 
                  transform: 'translateZ(75px) translateX(calc(var(--mx, 0) * -12px)) translateY(calc(var(--my, 0) * -12px))',
                  backfaceVisibility: 'hidden'
                }}
              >
                📄
              </div>
            </div>
            <div 
              className="text-2xl sm:text-3xl font-black text-slate-900 text-right tracking-tight"
              style={{ 
                transform: 'translateZ(100px) translateX(calc(var(--mx, 0) * -18px)) translateY(calc(var(--my, 0) * -18px))',
                backfaceVisibility: 'hidden'
              }}
            >
              {currentData.invoices}
            </div>
            <div 
              className="text-sm text-slate-500 mt-1 block"
              style={{ 
                transform: 'translateZ(30px) translateX(calc(var(--mx, 0) * -2px)) translateY(calc(var(--my, 0) * -2px))',
                backfaceVisibility: 'hidden'
              }}
            >
              {t.invoiceUnit}
            </div>
          </HoverCard>

          {/* كرت الأرباح - أخضر */}
          <HoverCard accentColor="green">
            <div className="flex justify-between items-start mb-4" style={{ transformStyle: 'preserve-3d' }}>
              <span 
                className="text-sm font-semibold text-slate-600 block"
                style={{ 
                  transform: 'translateZ(45px) translateX(calc(var(--mx, 0) * -4px)) translateY(calc(var(--my, 0) * -4px))',
                  backfaceVisibility: 'hidden'
                }}
              >
                {t.cardProfit}
              </span>
              <div 
                className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-lg shadow-lg shadow-green-200/50"
                style={{ 
                  transform: 'translateZ(75px) translateX(calc(var(--mx, 0) * -12px)) translateY(calc(var(--my, 0) * -12px))',
                  backfaceVisibility: 'hidden'
                }}
              >
                📈
              </div>
            </div>
            <div 
              className="text-2xl sm:text-3xl font-black text-slate-900 text-right tracking-tight"
              style={{ 
                transform: 'translateZ(100px) translateX(calc(var(--mx, 0) * -18px)) translateY(calc(var(--my, 0) * -18px))',
                backfaceVisibility: 'hidden'
              }}
            >
              {currentData.profit}
            </div>
            <div 
              className="text-sm text-slate-500 mt-1 block"
              style={{ 
                transform: 'translateZ(30px) translateX(calc(var(--mx, 0) * -2px)) translateY(calc(var(--my, 0) * -2px))',
                backfaceVisibility: 'hidden'
              }}
            >
              {t.currency}
            </div>
          </HoverCard>

          {/* كرت المخزون المنخفض - برتقالي */}
          <HoverCard accentColor="orange">
            <div className="flex justify-between items-start mb-4" style={{ transformStyle: 'preserve-3d' }}>
              <span 
                className="text-sm font-semibold text-slate-600 block"
                style={{ 
                  transform: 'translateZ(45px) translateX(calc(var(--mx, 0) * -4px)) translateY(calc(var(--my, 0) * -4px))',
                  backfaceVisibility: 'hidden'
                }}
              >
                {t.cardLowStock}
              </span>
              <div 
                className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-lg shadow-lg shadow-orange-200/50"
                style={{ 
                  transform: 'translateZ(75px) translateX(calc(var(--mx, 0) * -12px)) translateY(calc(var(--my, 0) * -12px))',
                  backfaceVisibility: 'hidden'
                }}
              >
                ⚠️
              </div>
            </div>
            <div 
              className="text-2xl sm:text-3xl font-black text-slate-900 text-right tracking-tight"
              style={{ 
                transform: 'translateZ(100px) translateX(calc(var(--mx, 0) * -18px)) translateY(calc(var(--my, 0) * -18px))',
                backfaceVisibility: 'hidden'
              }}
            >
              {currentData.lowStock}
            </div>
            <div 
              className="text-sm text-slate-500 mt-1 block"
              style={{ 
                transform: 'translateZ(30px) translateX(calc(var(--mx, 0) * -2px)) translateY(calc(var(--my, 0) * -2px))',
                backfaceVisibility: 'hidden'
              }}
            >
              {t.itemUnit}
            </div>
          </HoverCard>

        </div>

        {/* قسم الجداول والتحليلات */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <button className="text-sm font-semibold text-blue-600 hover:underline transition-colors">{t.viewAll}</button>
              <h2 className="text-lg font-bold text-slate-900">{t.tableTitle}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 rounded-lg">
                  <tr>
                    <th className="px-3 sm:px-4 py-3">{t.thInvoiceNo}</th>
                    <th className="px-3 sm:px-4 py-3">{t.thCustomer}</th>
                    <th className="px-3 sm:px-4 py-3">{t.thTime}</th>
                    <th className="px-3 sm:px-4 py-3">{t.thTotal}</th>
                    <th className="px-3 sm:px-4 py-3 text-center">{t.thStatus}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.transactions.map((tx, index) => (
                    <tr key={`${tx.id}-${index}`} className="hover:bg-slate-50 transition-all duration-200">
                      <td className="px-3 sm:px-4 py-4 font-semibold text-blue-600">{tx.id}</td>
                      <td className="px-3 sm:px-4 py-4 text-slate-700">{getTranslatedValue(tx.clientKey)}</td>
                      <td className="px-3 sm:px-4 py-4 text-slate-500">{tx.time}</td>
                      <td className="px-3 sm:px-4 py-4 font-bold text-slate-900">{tx.total} {t.currency}</td>
                      <td className="px-3 sm:px-4 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(tx.status)}`}>
                          {tx.status === 'paid' ? t.statusPaid : t.statusPending}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg">
            <h2 className="text-lg font-bold text-slate-900 mb-6">{t.topProductsTitle}</h2>
            <div className="space-y-6">
              {currentData.topProducts.map((product, index) => (
                <ProductRow key={index} product={product} index={index} getTranslatedValue={getTranslatedValue} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}