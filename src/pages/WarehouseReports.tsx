import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Package, AlertTriangle, XCircle, TrendingDown, TrendingUp, 
  Download, FileText, Printer, RefreshCw, Bell, Activity, Layers,
  PieChart as PieChartIcon, Info 
} from 'lucide-react';
// ⚠️ Note: Make sure this path is correct based on the location of warehouseService.ts in your project
import { warehouseService } from '../services/warehouseService';
import type { WarehouseStats, RecentMovement, MonthlySummary, MostActiveProduct, InventoryEvolutionPoint, LowStockProduct, OutOfStockProduct, WarehouseKpis } from '../services/warehouseService';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// ✅ movementData (monthly inbound/outbound movement) is now fetched from the backend inside the component

// ✅ statusData is now computed from real data inside the component (see useMemo below)

// ✅ activeProducts (most active products) is now fetched from the backend inside the component

// ✅ inventoryEvolution (weekly inventory trend) is now fetched from the backend inside the component
// ⚠️ Note: the data is approximate (computed cumulatively from movements without a Snapshot table) — this is clarified to the user via a Tooltip in the UI

// ✅ lowStockProducts (low-stock products) is now fetched from the backend inside the component

// ✅ outOfStockProducts (out-of-stock products) is now fetched from the backend inside the component

// ✅ recentMovements is now fetched from the backend inside the component

// --- i18n: language type + dictionary ---
type Language = 'ar' | 'en';

// All UI copy lives here so the header toggle button can switch between
// Arabic and English without touching any other part of the component.
const translations: Record<string, Record<Language, string>> = {
  criticalAlert: { ar: 'تنبيه حرج: يوجد 5 منتجات نافدة تماماً من المستودع تحتاج لإجراء فوري.', en: 'Critical alert: 5 products are completely out of stock in the warehouse and require immediate action.' },
  notice: { ar: 'إشعار: تم استلام 3 شحنات توريد جديدة بنجاح اليوم.', en: 'Notice: 3 new supply shipments were received successfully today.' },

  pageTitle: { ar: 'تقارير وتحليلات المخزون', en: 'Inventory Reports & Analytics' },
  pageSubtitle: { ar: 'نظرة شاملة لحالة المخزون وحركة المنتجات', en: 'A comprehensive overview of inventory status and product movement' },
  print: { ar: 'طباعة', en: 'Print' },
  refresh: { ar: 'تحديث', en: 'Refresh' },
  refreshSuccess: { ar: 'تم تحديث البيانات بنجاح', en: 'Data updated successfully' },
  exportStartedPrefix: { ar: 'تم بدء تصدير التقرير بصيغة', en: 'Report export started in' },
  exportStartedSuffix: { ar: '', en: 'format' },
  loadFailedError: { ar: 'حدث خطأ أثناء تحميل بيانات المخزون', en: 'An error occurred while loading inventory data' },

  timePeriod: { ar: 'الفترة الزمنية', en: 'Time Period' },
  thisMonth: { ar: 'هذا الشهر', en: 'This Month' },
  thisWeek: { ar: 'هذا الأسبوع', en: 'This Week' },
  today: { ar: 'اليوم', en: 'Today' },
  thisYear: { ar: 'هذا العام', en: 'This Year' },
  customPeriod: { ar: 'فترة مخصصة...', en: 'Custom Period...' },
  category: { ar: 'التصنيف', en: 'Category' },
  allCategories: { ar: 'جميع التصنيفات', en: 'All Categories' },
  beverages: { ar: 'مشروبات', en: 'Beverages' },
  foodItems: { ar: 'مواد غذائية', en: 'Food Items' },
  cleaningSupplies: { ar: 'منظفات', en: 'Cleaning Supplies' },
  status: { ar: 'الحالة', en: 'Status' },
  allProducts: { ar: 'جميع المنتجات', en: 'All Products' },
  available: { ar: 'متوفر', en: 'Available' },
  lowStock: { ar: 'منخفض المخزون', en: 'Low Stock' },
  outOfStock: { ar: 'نافد', en: 'Out of Stock' },
  warehouse: { ar: 'المستودع', en: 'Warehouse' },
  mainWarehouse: { ar: 'المستودع الرئيسي (الرياض)', en: 'Main Warehouse (Riyadh)' },
  coldStorage: { ar: 'مستودع التبريد', en: 'Cold Storage Warehouse' },

  totalProducts: { ar: 'إجمالي المنتجات', en: 'Total Products' },
  totalStockQty: { ar: 'إجمالي الكمية بالمخزن', en: 'Total Stock Quantity' },
  lowStockTitle: { ar: 'منخفض المخزون', en: 'Low Stock' },
  outOfStockProductsTitle: { ar: 'منتجات نافدة', en: 'Out of Stock Products' },
  totalInbound: { ar: 'إجمالي الوارد', en: 'Total Inbound' },
  totalOutbound: { ar: 'إجمالي الصادر', en: 'Total Outbound' },

  turnoverRate: { ar: 'معدل دوران المخزون', en: 'Inventory Turnover Rate' },
  avgDailyConsumption: { ar: 'متوسط الاستهلاك اليومي', en: 'Average Daily Consumption' },
  itemsUnit: { ar: 'قطعة', en: 'items' },
  todayMovementsCount: { ar: 'عدد الحركات اليوم', en: "Today's Movement Count" },
  movementsUnit: { ar: 'حركة', en: 'movements' },
  avgDailyInbound: { ar: 'متوسط الوارد اليومي', en: 'Average Daily Inbound' },

  inboundOutboundChartTitle: { ar: 'حركة الوارد والصادر', en: 'Inbound & Outbound Movement' },
  inboundLabel: { ar: 'الوارد', en: 'Inbound' },
  outboundLabel: { ar: 'الصادر', en: 'Outbound' },
  productStatusDistribution: { ar: 'توزيع حالة المنتجات', en: 'Product Status Distribution' },
  mostActiveProducts: { ar: 'المنتجات الأكثر حركة (استهلاكاً)', en: 'Most Active Products (by Consumption)' },
  quantityConsumed: { ar: 'الكمية المستهلكة', en: 'Quantity Consumed' },
  totalInventoryTrend: { ar: 'تطور إجمالي المخزون', en: 'Total Inventory Trend' },
  approxTooltip: { ar: 'هذه الأرقام تقريبية: محسوبة تراكمياً من حركات المخزون (وارد/صادر)، وقد لا تعكس عمليات الجرد التصحيحية بدقة كاملة.', en: 'These figures are approximate: calculated cumulatively from inventory movements (inbound/outbound), and may not fully reflect corrective stock-count adjustments.' },
  totalUnitsApprox: { ar: 'إجمالي القطع (تقريبي)', en: 'Total Units (Approx.)' },

  reorderNeeded: { ar: 'منتجات تحتاج لإعادة طلب (منخفضة)', en: 'Products Needing Reorder (Low Stock)' },
  productsCountSuffix: { ar: 'منتجات', en: 'products' },
  productCol: { ar: 'المنتج', en: 'Product' },
  currentQtyCol: { ar: 'الكمية الحالية', en: 'Current Quantity' },
  minThresholdCol: { ar: 'الحد الأدنى', en: 'Minimum Threshold' },
  statusCol: { ar: 'الحالة', en: 'Status' },
  orderNow: { ar: 'اطلب الآن', en: 'Order Now' },
  noLowStock: { ar: 'لا توجد منتجات منخفضة المخزون حالياً 👍', en: 'No low-stock products currently 👍' },
  outOfStockTableTitle: { ar: 'المنتجات النافدة', en: 'Out-of-Stock Products' },
  lastTransactionCol: { ar: 'آخر عملية', en: 'Last Transaction' },
  noOutOfStock: { ar: 'لا توجد منتجات نافدة حالياً 👍', en: 'No out-of-stock products currently 👍' },
  recentMovementsTitle: { ar: 'آخر حركات المخزون', en: 'Recent Inventory Movements' },
  dateCol: { ar: 'التاريخ', en: 'Date' },
  operationCol: { ar: 'العملية', en: 'Operation' },
  quantityCol: { ar: 'الكمية', en: 'Quantity' },
  noMovementsYet: { ar: 'لا توجد حركات مسجلة بعد', en: 'No movements recorded yet' },
  viewFullLog: { ar: 'عرض السجل كاملاً', en: 'View Full Log' },

  yesterday: { ar: 'أمس', en: 'Yesterday' },
  noMovementsRecorded: { ar: 'لا توجد حركات مسجلة', en: 'No movements recorded' },
  justNow: { ar: 'منذ لحظات', en: 'Just now' },
  hourAgo: { ar: 'منذ ساعة', en: '1 hour ago' },
  dayAgo: { ar: 'منذ يوم', en: '1 day ago' },
  twoDaysAgo: { ar: 'منذ يومين', en: '2 days ago' },
  weekAgo: { ar: 'منذ أسبوع', en: '1 week ago' },
  monthAgo: { ar: 'منذ شهر', en: '1 month ago' },
};

// --- سياق الـ Layout: نفس النمط المستخدم بصفحة QuickSaleScreen — اللغة وزر التبديل يعيشان بالـ Layout/Navbar المشترك
// --- Layout context: same pattern used in QuickSaleScreen — language state and its toggle button live in the shared Layout/Navbar
interface LayoutContext {
  isRtl: boolean;
  setIsRtl: (value: boolean) => void;
}

// --- المكون الرئيسي / Main Component ---
export default function InventoryReports() {
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [stats, setStats] = useState<WarehouseStats | null>(null);
  const [recentMovements, setRecentMovements] = useState<RecentMovement[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlySummary[]>([]);
  const [activeProducts, setActiveProducts] = useState<MostActiveProduct[]>([]);
  const [inventoryEvolution, setInventoryEvolution] = useState<InventoryEvolutionPoint[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState<OutOfStockProduct[]>([]);
  const [kpis, setKpis] = useState<WarehouseKpis | null>(null);

  // ✅ لغة الواجهة تأتي جاهزة من الـ Layout المشترك (نفس نمط QuickSaleScreen) — هذه الصفحة تقرأها فقط ولا تملك زر التبديل
  // ✅ UI language comes ready-made from the shared Layout (same pattern as QuickSaleScreen) — this page only reads it and does not own the toggle button
  const { isRtl } = useOutletContext<LayoutContext>();
  const language: Language = isRtl ? 'ar' : 'en';
  const t = (key: keyof typeof translations) => translations[key][language];
  const numberLocale = isRtl ? 'ar' : 'en-US';
  const dateLocale = isRtl ? 'ar-EG' : 'en-US';

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, movementsRes, monthlyRes, activeProductsRes, evolutionRes, lowStockRes, outOfStockRes, kpisRes] = await Promise.all([
        warehouseService.getStats(),
        warehouseService.getRecentMovements(10),
        warehouseService.getMonthlySummary(6),
        warehouseService.getMostActiveProducts(5, 'month'),
        warehouseService.getInventoryEvolution(4),
        warehouseService.getLowStockProducts(),
        warehouseService.getOutOfStockProducts(),
        warehouseService.getKpis(),
      ]);
      setStats(statsRes.data);
      setRecentMovements(movementsRes.data);
      setMonthlyData(monthlyRes.data);
      setActiveProducts(activeProductsRes.data);
      setInventoryEvolution(evolutionRes.data);
      setLowStockProducts(lowStockRes.data);
      setOutOfStockProducts(outOfStockRes.data);
      setKpis(kpisRes.data);
    } catch (error) {
      console.error('Failed to load inventory data:', error);
      showToast(t('loadFailedError'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ توزيع حالة المنتجات محسوب من نفس بيانات /stats (مافي حاجة لطلب إضافي)
  // ✅ Product status distribution is computed from the same /stats data (no extra request needed)
  const statusData = useMemo(() => {
    if (!stats) return [];
    const available = stats.totalProducts - stats.lowStockItems - stats.outOfStock;
    return [
      { name: t('available'), value: available, color: '#10B981' },
      { name: language === 'ar' ? 'منخفض' : 'Low', value: stats.lowStockItems, color: '#F97316' },
      { name: t('outOfStock'), value: stats.outOfStock, color: '#EF4444' },
    ];
  }, [stats, language]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleExport = (type: string) => {
    const suffix = t('exportStartedSuffix');
    showToast(`${t('exportStartedPrefix')} ${type}${suffix ? ' ' + suffix : ''}`);
  };

  // ✅ تنسيق التاريخ: اليوم / أمس / تاريخ كامل
  // ✅ Date formatting: Today / Yesterday / full date
  const formatMovementDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return t('today');
    if (date.toDateString() === yesterday.toDateString()) return t('yesterday');
    return date.toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' });
  };

  // ✅ تنسيق نسبي: "منذ X" (لعمود آخر عملية بجدول المنتجات النافدة)
  // ✅ Relative time formatting: "X ago" (used in the last-transaction column of the out-of-stock table)
  const formatRelativeTime = (dateStr: string | null) => {
    if (!dateStr) return t('noMovementsRecorded');

    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMinutes < 60) return diffMinutes <= 1 ? t('justNow') : (isRtl ? `منذ ${diffMinutes} دقيقة` : `${diffMinutes} min ago`);
    if (diffHours < 24) return diffHours === 1 ? t('hourAgo') : (isRtl ? `منذ ${diffHours} ساعات` : `${diffHours} hours ago`);
    if (diffDays < 7) return diffDays === 1 ? t('dayAgo') : diffDays === 2 ? t('twoDaysAgo') : (isRtl ? `منذ ${diffDays} أيام` : `${diffDays} days ago`);
    if (diffWeeks < 5) return diffWeeks === 1 ? t('weekAgo') : (isRtl ? `منذ ${diffWeeks} أسابيع` : `${diffWeeks} weeks ago`);
    return diffMonths === 1 ? t('monthAgo') : (isRtl ? `منذ ${diffMonths} أشهر` : `${diffMonths} months ago`);
  };

  // ✅ تحويل نوع الحركة لعرض موحّد + إشارة + لون
  // ✅ Convert movement type to a unified display + sign + color
  const getMovementDisplay = (movementType: string, quantity: number) => {
    const isInbound = movementType === 'إدخال'; // backend value, kept as-is regardless of UI language
    return {
      label: isInbound ? t('inboundLabel') : movementType === 'إخراج' ? t('outboundLabel') : movementType,
      qtyText: `${isInbound ? '+' : '-'}${quantity}`,
      color: isInbound ? 'text-green-600' : 'text-blue-600',
      badgeClass: isInbound ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800',
    };
  };

  if (isLoading) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6 min-h-screen bg-slate-100 flex flex-col gap-6 animate-pulse">
        <div className="h-16 bg-gray-300 rounded-xl"></div>
        <div className="h-12 bg-gray-300 rounded-xl w-1/2"></div>
        <div className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-gray-300 rounded-xl"></div>)}
        </div>
        <div className="h-64 bg-gray-300 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6 min-h-screen bg-slate-100 font-sans text-gray-900">
      
      {/* التنبيهات الذكية / Smart Alerts */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-xl z-50 transition-all">
          {toastMessage}
        </div>
      )}
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-3 bg-red-100 text-red-800 p-3 rounded-lg border border-red-200 shadow-sm">
          <AlertTriangle size={20} className="text-red-500" />
          <span className="font-semibold text-sm">{t('criticalAlert')}</span>
        </div>
        <div className="flex items-center gap-3 bg-green-100 text-green-800 p-3 rounded-lg border border-green-200 shadow-sm">
          <Bell size={20} className="text-green-500" />
          <span className="font-semibold text-sm">{t('notice')}</span>
        </div>
      </div>

      {/* الرأس (Header) والأزرار / Header and Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('pageTitle')}</h1>
          <p className="text-sm text-gray-600 mt-1">{t('pageSubtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* ملاحظة: زر تبديل اللغة انتقل للـ Layout/Navbar المشترك، ما عاد موجود هنا
              Note: the language toggle button now lives in the shared Layout/Navbar, not here */}
          <button type="button" onClick={() => handleExport('PDF')} className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md">
            <FileText size={16} className="text-red-500" /> PDF
          </button>
          <button type="button" onClick={() => handleExport('Excel')} className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md">
            <Download size={16} className="text-green-600" /> Excel
          </button>
          <button type="button" onClick={() => window.print()} className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md">
            <Printer size={16} className="text-gray-600" /> {t('print')}
          </button>
          <button type="button" onClick={() => { fetchData(); showToast(t('refreshSuccess')); }} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md">
            <RefreshCw size={16} /> {t('refresh')}
          </button>
        </div>
      </div>

      {/* الفلاتر / Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t('timePeriod')}</label>
          <select className="w-full bg-gray-100 border border-gray-300 text-gray-800 py-2 px-3 rounded-lg text-sm outline-none focus:border-blue-600">
            <option>{t('thisMonth')}</option>
            <option>{t('thisWeek')}</option>
            <option>{t('today')}</option>
            <option>{t('thisYear')}</option>
            <option>{t('customPeriod')}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t('category')}</label>
          <select className="w-full bg-gray-100 border border-gray-300 text-gray-800 py-2 px-3 rounded-lg text-sm outline-none focus:border-blue-600">
            <option>{t('allCategories')}</option>
            <option>{t('beverages')}</option>
            <option>{t('foodItems')}</option>
            <option>{t('cleaningSupplies')}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t('status')}</label>
          <select className="w-full bg-gray-100 border border-gray-300 text-gray-800 py-2 px-3 rounded-lg text-sm outline-none focus:border-blue-600">
            <option>{t('allProducts')}</option>
            <option>{t('available')}</option>
            <option>{t('lowStock')}</option>
            <option>{t('outOfStock')}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t('warehouse')}</label>
          <select className="w-full bg-gray-100 border border-gray-300 text-gray-800 py-2 px-3 rounded-lg text-sm outline-none focus:border-blue-600">
            <option>{t('mainWarehouse')}</option>
            <option>{t('coldStorage')}</option>
          </select>
        </div>
      </div>

      {/* بطاقات الإحصائيات الست الملونة والمحسنة / Six colored and enhanced stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        
        <StatCard 
          title={t('totalProducts')} 
          value={(stats?.totalProducts ?? 0).toLocaleString(numberLocale)} 
          icon={<Package size={22} />} 
          bg="bg-gradient-to-bl from-slate-200 to-slate-50" 
          borderColor="border-slate-300 hover:border-slate-400"
          textColor="text-slate-900" 
          iconStyle="bg-slate-300 text-slate-800"
          hoverShadow="hover:shadow-slate-200/50"
        />

        <StatCard 
          title={t('totalStockQty')} 
          value={(stats?.totalStock ?? 0).toLocaleString(numberLocale)} 
          icon={<Layers size={22} />} 
          bg="bg-gradient-to-bl from-indigo-200 to-indigo-50" 
          borderColor="border-indigo-300 hover:border-indigo-400"
          textColor="text-indigo-900" 
          iconStyle="bg-indigo-300 text-indigo-800"
          hoverShadow="hover:shadow-indigo-200/50"
        />

        <StatCard 
          title={t('lowStockTitle')} 
          value={(stats?.lowStockItems ?? 0).toLocaleString(numberLocale)} 
          icon={<TrendingDown size={22} />} 
          bg="bg-gradient-to-bl from-amber-200 to-amber-50" 
          borderColor="border-amber-300 hover:border-amber-500"
          textColor="text-amber-900" 
          iconStyle="bg-amber-300 text-amber-800"
          hoverShadow="hover:shadow-amber-200/50"
        />

        <StatCard 
          title={t('outOfStockProductsTitle')} 
          value={(stats?.outOfStock ?? 0).toLocaleString(numberLocale)} 
          icon={<XCircle size={22} />} 
          bg="bg-gradient-to-bl from-red-200 to-red-50" 
          borderColor="border-red-300 hover:border-red-500"
          textColor="text-red-900" 
          iconStyle="bg-red-300 text-red-800"
          hoverShadow="hover:shadow-red-200/50"
        />

        {/* ⚠️ ملاحظة: /stats يرجع إجمالي كل الحركات (كل الوقت)، مو "هذا الشهر" بالتحديد.
            العنوان بالأسفل باقي "هذا الشهر" مؤقتاً لحد ما نضيف فلترة شهرية بالباك لاحقاً
            ⚠️ Note: /stats returns the total of all movements (all time), not specifically "this month".
            The label stays "this month" temporarily until we add monthly filtering on the backend */}
        <StatCard 
          title={t('totalInbound')} 
          value={(stats?.totalEntries ?? 0).toLocaleString(numberLocale)} 
          icon={<Download size={22} />} 
          bg="bg-gradient-to-bl from-emerald-200 to-emerald-50" 
          borderColor="border-emerald-300 hover:border-emerald-500"
          textColor="text-emerald-900" 
          iconStyle="bg-emerald-300 text-emerald-800"
          hoverShadow="hover:shadow-emerald-200/50"
        />

        <StatCard 
          title={t('totalOutbound')} 
          value={(stats?.totalExits ?? 0).toLocaleString(numberLocale)} 
          icon={<TrendingUp size={22} />} 
          bg="bg-gradient-to-bl from-sky-200 to-sky-50" 
          borderColor="border-sky-300 hover:border-sky-500"
          textColor="text-sky-900" 
          iconStyle="bg-sky-300 text-sky-800"
          hoverShadow="hover:shadow-sky-200/50"
        />
      </div>

      {/* مؤشرات الأداء KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label={t('turnoverRate')} value={`${(kpis?.turnoverRate ?? 0).toFixed(0)}%`} colorTheme="violet" isRtl={isRtl} />
        <KpiCard label={t('avgDailyConsumption')} value={`${Math.round(kpis?.avgDailyConsumption ?? 0)} ${t('itemsUnit')}`} colorTheme="orange" isRtl={isRtl} />
        <KpiCard label={t('todayMovementsCount')} value={`${kpis?.todayMovementsCount ?? 0} ${t('movementsUnit')}`} colorTheme="blue" isRtl={isRtl} />
        <KpiCard label={t('avgDailyInbound')} value={`${Math.round(kpis?.avgDailyInbound ?? 0)} ${t('itemsUnit')}`} colorTheme="teal" isRtl={isRtl} />
      </div>

      {/* الرسوم البيانية / Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 1. حركة الوارد والصادر / Inbound & Outbound Movement */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transform hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Activity size={20} className="text-blue-500"/> {t('inboundOutboundChartTitle')}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" />
                <XAxis dataKey="monthName" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Line type="monotone" name={t('inboundLabel')} dataKey="inbound" stroke="#10B981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                <Line type="monotone" name={t('outboundLabel')} dataKey="outbound" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. توزيع المنتجات حسب الحالة / Product Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transform hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-purple-500"/> {t('productStatusDistribution')}
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label={({name, percent}) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. المنتجات الأكثر حركة / Most Active Products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transform hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Activity size={20} className="text-orange-500"/> {t('mostActiveProducts')}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeProducts} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#CBD5E1" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} />
                <YAxis dataKey="productName" type="category" axisLine={false} tickLine={false} tick={{fill: '#334155', fontSize: 14, fontWeight: 500}} width={90} />
                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="totalQuantity" name={t('quantityConsumed')} fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. تطور المخزون / Inventory Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transform hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-500"/> {t('totalInventoryTrend')}
            <span className="relative group inline-flex items-center">
              <Info size={15} className="text-gray-400 cursor-help" />
              <span className={`absolute ${isRtl ? 'right-0' : 'left-0'} top-6 z-10 hidden group-hover:block bg-gray-800 text-white text-xs font-normal rounded-lg px-3 py-2 w-60 shadow-lg leading-relaxed`}>
                {t('approxTooltip')}
              </span>
            </span>
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inventoryEvolution}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" />
                <XAxis dataKey="weekLabel" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} domain={['dataMin - 1000', 'dataMax + 1000']} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" name={t('totalUnitsApprox')} dataKey="totalQuantity" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* الجداول / Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* جدول المنتجات منخفضة المخزون والنافدة / Low-stock and out-of-stock product tables */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transform hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ease-out">
            <div className="bg-orange-100 border-b border-orange-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-orange-800 flex items-center gap-2"><AlertTriangle size={18}/> {t('reorderNeeded')}</h3>
              <span className="bg-orange-300 text-orange-900 text-xs font-bold px-2 py-1 rounded-full">{lowStockProducts.length} {t('productsCountSuffix')}</span>
            </div>
            <div className="overflow-x-auto">
              <table className={`w-full text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
                <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 font-medium">{t('productCol')}</th>
                    <th className="px-6 py-3 font-medium">{t('currentQtyCol')}</th>
                    <th className="px-6 py-3 font-medium">{t('minThresholdCol')}</th>
                    <th className="px-6 py-3 font-medium">{t('statusCol')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lowStockProducts.map(item => (
                    <tr key={item.productId} className="hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{item.productName}</td>
                      <td className="px-6 py-4 font-bold text-orange-700">{item.currentQuantity}</td>
                      <td className="px-6 py-4 text-gray-600">{item.minStock}</td>
                      <td className="px-6 py-4">
                        <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs font-medium">{t('orderNow')}</span>
                      </td>
                    </tr>
                  ))}
                  {lowStockProducts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-6 text-center text-gray-400 text-sm">
                        {t('noLowStock')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transform hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ease-out">
            <div className="bg-red-100 border-b border-red-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-red-900 flex items-center gap-2"><XCircle size={18}/> {t('outOfStockTableTitle')}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className={`w-full text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
                <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 font-medium">{t('productCol')}</th>
                    <th className="px-6 py-3 font-medium">{t('lastTransactionCol')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {outOfStockProducts.map(item => (
                    <tr key={item.productId} className="hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{item.productName}</td>
                      <td className="px-6 py-4 text-gray-600">{formatRelativeTime(item.lastMovementDate)}</td>
                    </tr>
                  ))}
                  {outOfStockProducts.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-6 py-6 text-center text-gray-400 text-sm">
                        {t('noOutOfStock')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* جدول آخر الحركات / Recent movements table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-1 flex flex-col transform hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ease-out">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">{t('recentMovementsTitle')}</h3>
          </div>
          <div className="p-0 overflow-x-auto flex-1">
             <table className={`w-full text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
                <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t('dateCol')}</th>
                    <th className="px-4 py-3 font-medium">{t('operationCol')}</th>
                    <th className="px-4 py-3 font-medium">{t('productCol')}</th>
                    <th className="px-4 py-3 font-medium">{t('quantityCol')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentMovements.map(item => {
                    const display = getMovementDisplay(item.movementType, item.quantity);
                    return (
                      <tr key={item.id} className="hover:bg-gray-100 transition-colors">
                        <td className="px-4 py-3 text-gray-600 text-xs">{formatMovementDate(item.createdAt)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${display.badgeClass}`}>
                            {display.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800">{item.productName}</td>
                        <td className={`px-4 py-3 font-bold ${display.color} dir-ltr text-left`}>{display.qtyText}</td>
                      </tr>
                    );
                  })}
                  {recentMovements.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-400 text-sm">
                        {t('noMovementsYet')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-100 text-center">
            <button type="button" className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
              {t('viewFullLog')} {isRtl ? '\u2190' : '\u2192'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- المكونات المساعدة / Helper Components ---
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bg: string;
  borderColor: string;
  textColor: string;
  iconStyle: string;
  hoverShadow: string;
}

function StatCard({ title, value, icon, bg, borderColor, textColor, iconStyle, hoverShadow }: StatCardProps) {
  return (
    <div className={`
      ${bg} ${borderColor} p-5 rounded-xl border
      transform hover:-translate-y-2 hover:shadow-2xl ${hoverShadow}
      transition-all duration-300 ease-out cursor-pointer
      flex flex-col justify-between shadow-sm min-h-[110px]
    `}>
      <div className="flex justify-between items-start w-full mb-2">
        <p className="text-xs font-bold text-gray-600 tracking-wide">{title}</p>
        <div className={`${iconStyle} p-2 rounded-lg shadow-inner transition-transform duration-300 hover:scale-110`}>
          {icon}
        </div>
      </div>
      <div>
        <h4 className={`text-3xl font-black ${textColor}`}>{value}</h4>
      </div>
    </div>
  );
}

function KpiCard({ label, value, colorTheme, isRtl }: { label: string, value: string, colorTheme: 'violet' | 'orange' | 'blue' | 'teal', isRtl: boolean }) {
  const themeStyles = {
    violet: "hover:border-violet-300 hover:shadow-violet-100 border-l-4 border-l-violet-500",
    orange: "hover:border-orange-300 hover:shadow-orange-100 border-l-4 border-l-orange-500",
    blue: "hover:border-blue-300 hover:shadow-blue-100 border-l-4 border-l-blue-500",
    teal: "hover:border-teal-300 hover:shadow-teal-100 border-l-4 border-l-teal-500",
  };

  return (
    <div className={`
      bg-white border border-gray-200 p-4 rounded-xl shadow-sm
      flex flex-col justify-center items-start ${isRtl ? 'text-right' : 'text-left'}
      transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer
      ${themeStyles[colorTheme]}
    `}>
      <span className="text-xs font-semibold text-gray-500 mb-2">{label}</span>
      <span className="text-xl font-bold text-gray-900">{value}</span>
    </div>
  );
}