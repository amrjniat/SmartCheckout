import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { 
  Search, Filter, Package, ArrowDownToLine, ArrowUpFromLine, 
  AlertTriangle, XCircle, Eye, Plus, Minus, Edit, History, 
  X, CheckCircle, BarChart3
} from 'lucide-react';
import { inventoryService } from '../services/inventoryService';

// ================= Layout Context =================
interface DashboardContext {
  isRtl: boolean;
}

type UserRole = 'manager' | 'storekeeper';

type Lang = 'ar' | 'en';

interface LocalizedText {
  ar: string;
  en: string;
}

const translations = {
  ar: {
    pageTitle: 'إدارة المخزون',
    pageDescription: 'متابعة كميات المنتجات وحركات الإدخال والإخراج والتنبيهات.',
    totalProducts: 'إجمالي المنتجات',
    inboundToday: 'الوارد اليوم',
    outboundToday: 'الصادر اليوم',
    lowStock: 'مواد منخفضة',
    outOfStock: 'نفدت الكمية',
    movementThisWeek: 'حركة الأسبوع',
    inbound: 'الوارد',
    outbound: 'الصادر',
    searchPlaceholder: 'البحث بالاسم، الباركود، أو SKU...',
    allStatuses: 'جميع الحالات',
    statusInStock: 'متوفر',
    statusLow: 'منخفض',
    statusOut: 'نفد',
    advancedFilters: 'فلاتر متقدمة',
    colProduct: 'المنتج',
    colSku: 'SKU',
    colCurrentQty: 'الكمية الحالية',
    colMinQty: 'الحد الأدنى',
    colLastMovement: 'آخر حركة',
    colStatus: 'الحالة',
    colActions: 'العمليات',
    addQty: 'إضافة كمية',
    subtractQty: 'سحب كمية',
    adjustQty: 'جرد/تعديل',
    movementHistory: 'سجل الحركات',
    historyTitle: 'سجل حركات المخزون',
    currentBalance: 'الكمية الحالية',
    minimum: 'الحد الأدنى',
    colDate: 'التاريخ',
    colOperation: 'العملية',
    colQty: 'الكمية',
    colUser: 'المستخدم',
    adjustStockTitle: 'تعديل الرصيد (جرد)',
    quantity: 'الكمية',
    reasonOptional: 'السبب / الملاحظات (اختياري)',
    reasonPlaceholder: 'مثال: فاتورة شراء، تالف، تسوية جرد...',
    saveAdjustment: 'حفظ التعديل',
    cancel: 'إلغاء',
    toastUpdated: 'تم تحديث المخزون بنجاح',
    addReasonDefault: 'إضافة للرصيد',
    subtractReasonDefault: 'سحب من الرصيد',
    setReasonDefault: 'جرد وتعديل',
    managerUser: 'المدير',
    statusLabelOut: 'نفد',
    statusLabelLow: 'منخفض',
    statusLabelIn: 'متوفر',
    dailyOps: 'عملية',
    loadingMessage: 'جاري تحميل بيانات المخزون...',
    loadErrorMessage: 'حدث خطأ أثناء تحميل بيانات المخزون',
    retry: 'إعادة المحاولة',
    emptyState: 'لا توجد منتجات لعرضها'
  },
  en: {
    pageTitle: 'Inventory Management',
    pageDescription: 'Track product quantities, stock movements, and alerts.',
    totalProducts: 'Total Products',
    inboundToday: 'Inbound Today',
    outboundToday: 'Outbound Today',
    lowStock: 'Low Stock Items',
    outOfStock: 'Out of Stock',
    movementThisWeek: 'Weekly Movement',
    inbound: 'Inbound',
    outbound: 'Outbound',
    searchPlaceholder: 'Search by name, barcode, or SKU...',
    allStatuses: 'All Statuses',
    statusInStock: 'In Stock',
    statusLow: 'Low',
    statusOut: 'Out',
    advancedFilters: 'Advanced Filters',
    colProduct: 'Product',
    colSku: 'SKU',
    colCurrentQty: 'Current Qty',
    colMinQty: 'Min Qty',
    colLastMovement: 'Last Movement',
    colStatus: 'Status',
    colActions: 'Actions',
    addQty: 'Add Qty',
    subtractQty: 'Subtract Qty',
    adjustQty: 'Audit/Adjust',
    movementHistory: 'Movement History',
    historyTitle: 'Inventory Movement History',
    currentBalance: 'Current Qty',
    minimum: 'Minimum',
    colDate: 'Date',
    colOperation: 'Operation',
    colQty: 'Qty',
    colUser: 'User',
    adjustStockTitle: 'Adjust Balance (Audit)',
    quantity: 'Quantity',
    reasonOptional: 'Reason / Notes (Optional)',
    reasonPlaceholder: 'Example: purchase invoice, damaged, stock settlement...',
    saveAdjustment: 'Save Adjustment',
    cancel: 'Cancel',
    toastUpdated: 'Inventory updated successfully',
    addReasonDefault: 'Stock addition',
    subtractReasonDefault: 'Stock withdrawal',
    setReasonDefault: 'Audit and adjustment',
    managerUser: 'Manager',
    statusLabelOut: 'Out',
    statusLabelLow: 'Low',
    statusLabelIn: 'In Stock',
    dailyOps: 'ops',
    loadingMessage: 'Loading inventory data...',
    loadErrorMessage: 'An error occurred while loading inventory data',
    retry: 'Retry',
    emptyState: 'No products to display'
  }
} as const;

// ================= Types =================
interface StockMovement {
  id: string;
  date: string;
  type: 'add' | 'subtract' | 'set';
  quantity: number;
  user: LocalizedText;
  reason: LocalizedText;
}

interface ProductInventory {
  id: string;
  image: string;
  name: LocalizedText;
  sku: string;
  category: LocalizedText;
  currentQty: number;
  minQty: number;
  lastMovement: string;
  lastUpdate: string;
  history: StockMovement[];
}

export default function InventoryManagement() {
  const { isRtl } = useOutletContext<DashboardContext>();
  const lang: Lang = isRtl ? 'ar' : 'en';
  const t = translations[lang];
  const location = useLocation();

  const [activeRole, setActiveRole] = useState<UserRole>(
    location.pathname.startsWith('/warehouse') ? 'storekeeper' : 'manager'
  );

  React.useEffect(() => {
    setActiveRole(location.pathname.startsWith('/warehouse') ? 'storekeeper' : 'manager');
  }, [location.pathname]);

  const [inventory, setInventory] = useState<ProductInventory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // UI States
  const [selectedProduct, setSelectedProduct] = useState<ProductInventory | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'add' | 'subtract' | 'set'>('add');
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  // Modal Form State
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('');

  // ================= Data Fetching =================
  const loadInventory = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      // جلب البيانات الحقيقية من الباك إند
      const data = await inventoryService.getInventory();
      setInventory(data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setLoadError(t.loadErrorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [t.loadErrorMessage]);

  useEffect(() => {
    loadInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const getLocalized = (value: LocalizedText) => value[lang];

  // ================= Helpers =================
  const getStatus = (qty: number, min: number) => {
    if (qty === 0) return { label: t.statusLabelOut, color: 'bg-red-100 text-red-800', icon: '🔴' };
    if (qty <= min) return { label: t.statusLabelLow, color: 'bg-orange-100 text-orange-800', icon: '🟠' };
    return { label: t.statusLabelIn, color: 'bg-green-100 text-green-800', icon: '🟢' };
  };

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // ================= Actions =================
  const handleSaveAdjustment = async () => {
    if (!selectedProduct || adjustQty <= 0) return;

    try {
      // 1. تمرير (productId) أولاً كمعيار أول، ثم كائن البيانات (data) كمعيار ثانٍ
      await inventoryService.adjustStock(selectedProduct.id, {
        warehouseId: 1, // رقم المستودع الافتراضي
        type: modalAction, // 'add' | 'subtract' | 'set'
        quantity: adjustQty,
        reason: adjustReason || undefined,
      });

      // 2. تحديث الرصيد في الواجهة بعد نجاح الاستجابة من الباك إند
      setInventory(prev => prev.map(item => {
        if (item.id === selectedProduct.id) {
          let newQty = item.currentQty;
          if (modalAction === 'add') newQty += adjustQty;
          if (modalAction === 'subtract') newQty = Math.max(0, newQty - adjustQty);
          if (modalAction === 'set') newQty = adjustQty;

          return {
            ...item,
            currentQty: newQty,
            lastMovement: `${modalAction === 'subtract' ? '-' : '+'}${adjustQty}`,
            lastUpdate: new Date().toISOString().split('T')[0],
          };
        }
        return item;
      }));

      setIsModalOpen(false);
      setAdjustQty(0);
      setAdjustReason('');
      showToast(t.toastUpdated);
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('حدث خطأ أثناء تحديث المخزون في السيرفر');
    }
  };
  
  const openAdjustModal = (product: ProductInventory, action: 'add' | 'subtract' | 'set') => {
    setSelectedProduct(product);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const openHistoryDrawer = async (product: ProductInventory) => {
    // 1. فتح النافذة فوراً وتصفير السجل القديم لتجنب تداخل البيانات
    setSelectedProduct({ ...product, history: [] }); 
    setIsDrawerOpen(true);
    setIsLoadingHistory(true);

    try {
      // 2. جلب الحركات الحقيقية من الباك إند للمستودع الافتراضي (1)
      const historyData = await inventoryService.getProductMovements(product.id, 1);
      
      // 3. تحديث حالة المنتج لإظهار البيانات الجديدة في النافذة
      setSelectedProduct(prev => prev ? { ...prev, history: historyData } : null);
    } catch (error) {
      console.error('Error fetching movements:', error);
      showToast('حدث خطأ أثناء تحميل سجل الحركات');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // ================= Derived Stats =================
  const todayStr = new Date().toISOString().split('T')[0];

  const todayStats = useMemo(() => {
    let inboundCount = 0;
    let outboundCount = 0;
    inventory.forEach(item => {
      item.history.forEach(h => {
        if (h.date.startsWith(todayStr)) {
          if (h.type === 'add') inboundCount += 1;
          if (h.type === 'subtract') outboundCount += 1;
        }
      });
    });
    return { inboundCount, outboundCount };
  }, [inventory, todayStr]);

  const weeklyStats = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    let totalIn = 0;
    let totalOut = 0;
    inventory.forEach(item => {
      item.history.forEach(h => {
        const hDate = new Date(h.date.replace(' ', 'T'));
        if (!isNaN(hDate.getTime()) && hDate >= weekAgo) {
          if (h.type === 'add') totalIn += h.quantity;
          if (h.type === 'subtract') totalOut += h.quantity;
        }
      });
    });
    const max = Math.max(totalIn, totalOut, 1);
    return {
      totalIn,
      totalOut,
      inPercent: (totalIn / max) * 100,
      outPercent: (totalOut / max) * 100
    };
  }, [inventory]);

  // ================= Filters =================
  const filteredData = useMemo(() => {
    return inventory.filter(item => {
      const q = searchTerm.trim().toLowerCase();
      const matchSearch =
        q.length === 0 ||
        item.name.ar.toLowerCase().includes(q) ||
        item.name.en.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.ar.toLowerCase().includes(q) ||
        item.category.en.toLowerCase().includes(q);
      const status = getStatus(item.currentQty, item.minQty);
      const matchStatus = filterStatus === 'all' || 
                          (filterStatus === 'out' && item.currentQty === 0) ||
                          (filterStatus === 'low' && item.currentQty > 0 && item.currentQty <= item.minQty) ||
                          (filterStatus === 'in' && item.currentQty > item.minQty);
      return matchSearch && matchStatus;
    });
  }, [inventory, searchTerm, filterStatus]);

  // ================= Render =================
  return (
    <div className={`p-6 bg-gray-50 min-h-screen font-sans ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t.pageTitle}</h1>
        <p className="text-gray-500 mt-1">{t.pageDescription}</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center justify-center text-gray-500">
          {t.loadingMessage}
        </div>
      )}

      {/* Error State */}
      {!isLoading && loadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center justify-between">
          <span>{loadError}</span>
          <button
            onClick={loadInventory}
            className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-700 transition"
          >
            {t.retry}
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">
        {[
          { title: t.totalProducts, value: inventory.length, icon: Package, color: 'text-blue-700', iconBg: 'bg-blue-200', cardBg: 'from-blue-100 to-blue-50', border: 'border-blue-200', hoverBorder: 'hover:border-blue-400', glow: 'hover:shadow-blue-300' },
          { title: t.inboundToday, value: `${todayStats.inboundCount} ${t.dailyOps}`, icon: ArrowDownToLine, color: 'text-emerald-700', iconBg: 'bg-emerald-200', cardBg: 'from-emerald-100 to-emerald-50', border: 'border-emerald-200', hoverBorder: 'hover:border-emerald-400', glow: 'hover:shadow-emerald-300' },
          { title: t.outboundToday, value: `${todayStats.outboundCount} ${t.dailyOps}`, icon: ArrowUpFromLine, color: 'text-violet-700', iconBg: 'bg-violet-200', cardBg: 'from-violet-100 to-violet-50', border: 'border-violet-200', hoverBorder: 'hover:border-violet-400', glow: 'hover:shadow-violet-300' },
          { title: t.lowStock, value: inventory.filter(i => i.currentQty > 0 && i.currentQty <= i.minQty).length, icon: AlertTriangle, color: 'text-amber-700', iconBg: 'bg-amber-200', cardBg: 'from-amber-100 to-amber-50', border: 'border-amber-200', hoverBorder: 'hover:border-amber-400', glow: 'hover:shadow-amber-300' },
          { title: t.outOfStock, value: inventory.filter(i => i.currentQty === 0).length, icon: XCircle, color: 'text-rose-700', iconBg: 'bg-rose-200', cardBg: 'from-rose-100 to-rose-50', border: 'border-rose-200', hoverBorder: 'hover:border-rose-400', glow: 'hover:shadow-rose-300' },
        ].map((stat, idx) => (
          <div 
            key={idx} 
            className={`group relative bg-gradient-to-br ${stat.cardBg} p-6 rounded-2xl border ${stat.border} ${stat.hoverBorder} flex flex-col items-start gap-4 overflow-hidden transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl ${stat.glow} cursor-pointer`}
          >
            <div className={`p-4 rounded-xl ${stat.iconBg} ${stat.color} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-extrabold text-gray-800 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Chart / Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 w-32">
          <BarChart3 size={18} /> {t.movementThisWeek}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-12">{t.inbound}</span>
            <div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${weeklyStats.inPercent}%` }}></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-12">{t.outbound}</span>
            <div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${weeklyStats.outPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-1/3">
          <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-2.5 text-gray-400`} size={20} />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            className="border rounded-lg px-4 py-2 bg-gray-50 outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">{t.allStatuses}</option>
            <option value="in">{t.statusInStock}</option>
            <option value="low">{t.statusLow}</option>
            <option value="out">{t.statusOut}</option>
          </select>
          <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
            <Filter size={18} /> {t.advancedFilters}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="px-4 py-3 font-medium">{t.colProduct}</th>
                <th className="px-4 py-3 font-medium">{t.colSku}</th>
                <th className="px-4 py-3 font-medium">{t.colCurrentQty}</th>
                <th className="px-4 py-3 font-medium">{t.colMinQty}</th>
                <th className="px-4 py-3 font-medium">{t.colLastMovement}</th>
                <th className="px-4 py-3 font-medium">{t.colStatus}</th>
                <th className="px-4 py-3 font-medium text-center">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!isLoading && !loadError && filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    {t.emptyState}
                  </td>
                </tr>
              )}
              {filteredData.map((item) => {
                const status = getStatus(item.currentQty, item.minQty);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={item.image} alt={getLocalized(item.name)} className="w-10 h-10 rounded border" />
                      <span className="font-medium text-gray-800">{getLocalized(item.name)}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item.sku}</td>
                    <td className="px-4 py-3 font-bold text-gray-700">{item.currentQty}</td>
                    <td className="px-4 py-3 text-gray-500">{item.minQty}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${item.lastMovement.startsWith('+') ? 'text-green-600' : 'text-red-600'}`} dir="ltr">
                        {item.lastMovement}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max ${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openAdjustModal(item, 'add')} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200" title={t.addQty}><Plus size={16}/></button>
                        <button onClick={() => openAdjustModal(item, 'subtract')} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200" title={t.subtractQty}><Minus size={16}/></button>
                        {activeRole === 'manager' && (
                          <button onClick={() => openAdjustModal(item, 'set')} className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" title={t.adjustQty}><Edit size={16}/></button>
                        )}
                        <button onClick={() => openHistoryDrawer(item)} className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" title={t.movementHistory}><History size={16}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer: History */}
      {isDrawerOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <History size={20} className="text-gray-500"/> {t.historyTitle}
              </h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>
            <div className="p-4 border-b flex items-center gap-4">
               <img src={selectedProduct.image} alt={getLocalized(selectedProduct.name)} className="w-16 h-16 rounded border" />
               <div>
                 <h3 className="font-bold text-gray-800">{getLocalized(selectedProduct.name)}</h3>
                 <p className="text-sm text-gray-500">{t.currentBalance}: <span className="font-bold">{selectedProduct.currentQty}</span></p>
                 <p className="text-sm text-gray-500">{t.minimum}: {selectedProduct.minQty}</p>
               </div>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <table className={`w-full text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
                <thead className="text-gray-500 mb-2 border-b">
                  <tr>
                    <th className="pb-2 font-medium">{t.colDate}</th>
                    <th className="pb-2 font-medium">{t.colOperation}</th>
                    <th className="pb-2 font-medium">{t.colQty}</th>
                    <th className="pb-2 font-medium">{t.colUser}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoadingHistory ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        جاري تحميل السجل...
                      </td>
                    </tr>
                  ) : selectedProduct.history.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">
                        لا توجد حركات مسجلة لهذا المنتج
                      </td>
                    </tr>
                  ) : (
                    selectedProduct.history.map((hist) => (
                      <tr key={hist.id} className="text-gray-700">
                        <td className="py-3 text-xs">{hist.date}</td>
                        <td className="py-3">{getLocalized(hist.reason)}</td>
                        <td className="py-3 font-bold" dir="ltr">
                          {hist.type === 'add' ? <span className="text-green-600">+{hist.quantity}</span> :
                           hist.type === 'subtract' ? <span className="text-red-600">-{hist.quantity}</span> :
                           <span className="text-blue-600">={hist.quantity}</span>}
                        </td>
                        <td className="py-3 text-xs text-gray-500">{getLocalized(hist.user)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adjust Quantity */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold">
                {modalAction === 'add' ? t.addQty : modalAction === 'subtract' ? t.subtractQty : t.adjustStockTitle}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="p-3 bg-gray-50 rounded border text-sm flex justify-between">
                <span className="font-medium text-gray-700">{getLocalized(selectedProduct.name)}</span>
                <span className="text-gray-500">{t.currentBalance}: <strong className="text-gray-800">{selectedProduct.currentQty}</strong></span>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t.quantity}</label>
                <input 
                  type="number" 
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  value={adjustQty || ''}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t.reasonOptional}</label>
                <input 
                  type="text" 
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t.reasonPlaceholder}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                />
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex gap-2">
              <button 
                onClick={handleSaveAdjustment}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {t.saveAdjustment}
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 left-6 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up z-50">
          <CheckCircle className="text-green-400" size={20} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}