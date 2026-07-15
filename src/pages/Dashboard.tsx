import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

type LayoutContext = { isRtl: boolean; setIsRtl: (value: boolean) => void };

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
  const [isHovered, setIsHovered] = useState(false);

  const accentShadow = {
    blue: 'rgba(59, 130, 246, 0.35)',
    purple: 'rgba(168, 85, 247, 0.35)',
    green: 'rgba(34, 197, 94, 0.35)',
    orange: 'rgba(249, 115, 22, 0.35)'
  };

  const accentBg = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    purple: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    green: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    orange: 'bg-gradient-to-br from-orange-500 to-amber-600'
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative ${accentBg[accentColor]} text-white p-5 sm:p-6 rounded-2xl cursor-pointer select-none overflow-hidden ${className}`}
      style={{
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered
          ? `0 24px 40px -12px ${accentShadow[accentColor]}, 0 8px 16px -4px rgba(0,0,0,0.15)`
          : '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.06)',
        transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease'
      }}
    >
      <div className="relative z-10 h-full w-full">
        {children}
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
  const { isRtl } = useOutletContext<LayoutContext>();

  const t = translations[isRtl ? 'ar' : 'en'];
  const currentData = dashboardMockData[activeFilter];

  const getTranslatedValue = (key: string): string => {
    const translationsAr = translations.ar as Record<string, string>;
    const translationsEn = translations.en as Record<string, string>;
    return isRtl ? (translationsAr[key] || key) : (translationsEn[key] || key);
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

      <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">

        {/* 💡 تطبيق الـ Parallax الحقيقي ثلاثي الأبعاد بتمرير إزاحات مختلفة ومستويات غائرة ومتطورة لكل عنصر (نقطة 1، 8، 9) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* كرت المبيعات - أزرق */}
          <HoverCard accentColor="blue">
            <div className="flex justify-between items-start mb-4" style={{ transformStyle: 'preserve-3d' }}>
              <span 
                className="text-sm font-semibold text-white/90 block"
                style={{ 
                  transform: 'translateZ(45px) translateX(calc(var(--mx, 0) * -4px)) translateY(calc(var(--my, 0) * -4px))',
                  backfaceVisibility: 'hidden'
                }}
              >
                {t.cardSales}
              </span>
              <div 
                className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-lg"
                style={{ 
                  transform: 'translateZ(75px) translateX(calc(var(--mx, 0) * -12px)) translateY(calc(var(--my, 0) * -12px))',
                  backfaceVisibility: 'hidden'
                }}
              >
                💰
              </div>
            </div>
            <div 
              className="text-2xl sm:text-3xl font-black text-white text-right tracking-tight"
              style={{ 
                transform: 'translateZ(100px) translateX(calc(var(--mx, 0) * -18px)) translateY(calc(var(--my, 0) * -18px))',
                backfaceVisibility: 'hidden'
              }}
            >
              {currentData.sales}
            </div>
            <div 
              className="text-sm text-white/75 mt-1 block"
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
                className="text-sm font-semibold text-white/90 block"
                style={{ 
                  transform: 'translateZ(45px) translateX(calc(var(--mx, 0) * -4px)) translateY(calc(var(--my, 0) * -4px))',
                  backfaceVisibility: 'hidden'
                }}
              >
                {t.cardInvoices}
              </span>
              <div 
                className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-lg"
                style={{ 
                  transform: 'translateZ(75px) translateX(calc(var(--mx, 0) * -12px)) translateY(calc(var(--my, 0) * -12px))',
                  backfaceVisibility: 'hidden'
                }}
              >
                📄
              </div>
            </div>
            <div 
              className="text-2xl sm:text-3xl font-black text-white text-right tracking-tight"
              style={{ 
                transform: 'translateZ(100px) translateX(calc(var(--mx, 0) * -18px)) translateY(calc(var(--my, 0) * -18px))',
                backfaceVisibility: 'hidden'
              }}
            >
              {currentData.invoices}
            </div>
            <div 
              className="text-sm text-white/75 mt-1 block"
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
                className="text-sm font-semibold text-white/90 block"
                style={{ 
                  transform: 'translateZ(45px) translateX(calc(var(--mx, 0) * -4px)) translateY(calc(var(--my, 0) * -4px))',
                  backfaceVisibility: 'hidden'
                }}
              >
                {t.cardProfit}
              </span>
              <div 
                className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-lg"
                style={{ 
                  transform: 'translateZ(75px) translateX(calc(var(--mx, 0) * -12px)) translateY(calc(var(--my, 0) * -12px))',
                  backfaceVisibility: 'hidden'
                }}
              >
                📈
              </div>
            </div>
            <div 
              className="text-2xl sm:text-3xl font-black text-white text-right tracking-tight"
              style={{ 
                transform: 'translateZ(100px) translateX(calc(var(--mx, 0) * -18px)) translateY(calc(var(--my, 0) * -18px))',
                backfaceVisibility: 'hidden'
              }}
            >
              {currentData.profit}
            </div>
            <div 
              className="text-sm text-white/75 mt-1 block"
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
                className="text-sm font-semibold text-white/90 block"
                style={{ 
                  transform: 'translateZ(45px) translateX(calc(var(--mx, 0) * -4px)) translateY(calc(var(--my, 0) * -4px))',
                  backfaceVisibility: 'hidden'
                }}
              >
                {t.cardLowStock}
              </span>
              <div 
                className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-lg"
                style={{ 
                  transform: 'translateZ(75px) translateX(calc(var(--mx, 0) * -12px)) translateY(calc(var(--my, 0) * -12px))',
                  backfaceVisibility: 'hidden'
                }}
              >
                ⚠️
              </div>
            </div>
            <div 
              className="text-2xl sm:text-3xl font-black text-white text-right tracking-tight"
              style={{ 
                transform: 'translateZ(100px) translateX(calc(var(--mx, 0) * -18px)) translateY(calc(var(--my, 0) * -18px))',
                backfaceVisibility: 'hidden'
              }}
            >
              {currentData.lowStock}
            </div>
            <div 
              className="text-sm text-white/75 mt-1 block"
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








