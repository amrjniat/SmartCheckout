import { startSignalRConnection, onAnyDataChange } from '../services/signalRService';
import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getProducts } from '../services/productService';
import type { Product } from '../services/productService';
import AddProductModal from '../components/AddProductModal'; // عدّلوا المسار حسب مكان الملف الفعلي عندكم
import RestockModal from '../components/RestockModal'; // عدّلوا المسار حسب مكان الملف الفعلي عندكم
import { getTransactions } from '../services/transactionService';
import type { InventoryTransaction } from '../services/transactionService';

interface OutletContextType {
  isRtl: boolean;
  setIsRtl: (val: boolean) => void;
}

export default function WarehouseDashboard() {
  const { isRtl } = useOutletContext<OutletContextType>();
  const [activeCard, setActiveCard] = useState<string | null>(null);

  // حالات المنتجات والحركات
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactionsData, setTransactionsData] = useState<InventoryTransaction[]>([]);
  const [isTxLoading, setIsTxLoading] = useState<boolean>(true);

  // حالة نافذة إضافة مادة
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  // حالة نافذة استلام بضاعة (تعبئة المخزون)
  const [isRestockModalOpen, setIsRestockModalOpen] = useState<boolean>(false);

  // جلب البيانات عند فتح الشاشة مغلفة بـ useCallback
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsTxLoading(true);

      const [productsData, txData] = await Promise.all([
        getProducts(),
        getTransactions()
      ]);

      setProducts(productsData);
      setTransactionsData(txData);
    } catch (error) {
      console.error("حدث خطأ أثناء جلب بيانات لوحة التحكم:", error);
    } finally {
      setIsLoading(false);
      setIsTxLoading(false);
    }
  }, []);

  // الجلب الأساسي عند تحميل المكون
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // الاستماع لتحديثات SignalR
  useEffect(() => {    // 1. التأكد من بدء الاتصال
    startSignalRConnection();    // 2. الاستماع لأي تغيير بيانات يؤثر على المستودع (مخزون / بيع / فاتورة جديدة)
    const unsubscribe = onAnyDataChange(() => {
        console.log("تغيّرت بيانات المخزون أو المبيعات! جاري تحديث بيانات المستودع...");
        fetchDashboardData();
    });    // 3. تنظيف الاستماع عند مغادرة الصفحة
    return () => {
        unsubscribe();
    };
  }, [fetchDashboardData]);

  const totalItemsCount = products.length;
  const lowStockCount = products.filter(p => p.stockQuantity < 10).length;
  const inboundCount = transactionsData.filter(tx => tx.type === 'in').length;
  const outboundCount = transactionsData.filter(tx => tx.type === 'out').length;

  // حساب حالة الأقسام الرئيسية ديناميكياً بناءً على المنتجات المسجلة
  const calculateCategories = () => {
    if (products.length === 0) return [];
    
    const counts: { [key: string]: number } = {};
    products.forEach(p => {
      const cat = p.category || (isRtl ? 'أخرى' : 'Other');
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const total = products.length;
    return Object.keys(counts).map((catName, index) => {
      const count = counts[catName];
      const percentage = Math.round((count / total) * 100);
      
      // ألوان ديناميكية للأقسام
      const colors = ['bg-blue-500', 'bg-amber-500', 'bg-red-500', 'bg-emerald-500', 'bg-purple-500'];
      
      return {
        name: catName,
        p: `${percentage}%`,
        color: colors[index % colors.length]
      };
    });
  };

  const dynamicCategories = calculateCategories();

  const translations = {
    ar: {
      cardTotalItems: 'إجمالي المواد',
      cardLowStock: 'مواد منخفضة',
      cardInbound: 'حركات الإدخال',
      cardOutbound: 'حركات الإخراج',
      unitItem: 'مادة',
      unitTx: 'حركة',
      tableTitle: 'آخر الحركات المستودعية',
      thID: 'رقم الحركة',
      thItem: 'المادة',
      thQty: 'الكمية',
      thStatus: 'الحالة',
      statusIn: 'إدخال',
      statusOut: 'إخراج',
      categoriesTitle: 'حالة الأقسام الرئيسية',
      quickActionsTitle: 'إجراءات المستودع',
      actionAddItem: 'إضافة مادة',
      actionReceive: 'استلام بضاعة',
      actionTransfer: 'نقل مخزون',
      actionAudit: 'جرد سريع',
      alertsTitle: 'تنبيهات المخزون',
    },
    en: {
      cardTotalItems: 'Total Items',
      cardLowStock: 'Low Stock',
      cardInbound: 'Inbound Tx',
      cardOutbound: 'Outbound Tx',
      unitItem: 'Items',
      unitTx: 'Tx',
      tableTitle: 'Latest Inventory Movements',
      thID: 'Tx ID',
      thItem: 'Item',
      thQty: 'Qty',
      thStatus: 'Status',
      statusIn: 'In',
      statusOut: 'Out',
      categoriesTitle: 'Main Categories Status',
      quickActionsTitle: 'Warehouse Actions',
      actionAddItem: 'Add Item',
      actionReceive: 'Receive Goods',
      actionTransfer: 'Transfer Stock',
      actionAudit: 'Quick Audit',
      alertsTitle: 'Inventory Alerts',
    },
  };

  const t = isRtl ? translations.ar : translations.en;

  const handleCardPress = (cardId: string) => {
    setActiveCard(cardId);
    setTimeout(() => setActiveCard(null), 150);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-slate-50/50 relative">
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => handleCardPress('totalItems')}
          className={`relative p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/50 ${
            activeCard === 'totalItems' ? 'scale-95 translate-y-0 shadow-none' : ''
          }`}
        >
          <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
            <span className="text-sm font-bold opacity-90">{t.cardTotalItems}</span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">📦</div>
          </div>
          <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
            <span className="text-3xl font-black tracking-tight">{isLoading ? '...' : totalItemsCount}</span>
            <span className="text-[11px] font-medium opacity-80">{t.unitItem}</span>
          </div>
        </div>

        <div
          onClick={() => handleCardPress('lowStock')}
          className={`relative p-5 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-rose-500/50 ${
            activeCard === 'lowStock' ? 'scale-95 translate-y-0 shadow-none' : ''
          }`}
        >
          <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
            <span className="text-sm font-bold opacity-90">{t.cardLowStock}</span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">⚠️</div>
          </div>
          <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
            <span className="text-3xl font-black tracking-tight">{isLoading ? '...' : lowStockCount}</span>
            <span className="text-[11px] font-medium opacity-80">{t.unitItem}</span>
          </div>
        </div>

        <div
          onClick={() => handleCardPress('inbound')}
          className={`relative p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-500/50 ${
            activeCard === 'inbound' ? 'scale-95 translate-y-0 shadow-none' : ''
          }`}
        >
          <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
            <span className="text-sm font-bold opacity-90">{t.cardInbound}</span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">📥</div>
          </div>
          <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
            <span className="text-3xl font-black tracking-tight">{isTxLoading ? '...' : inboundCount}</span>
            <span className="text-[11px] font-medium opacity-80">{t.unitTx}</span>
          </div>
        </div>

        <div
          onClick={() => handleCardPress('outbound')}
          className={`relative p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-500/50 ${
            activeCard === 'outbound' ? 'scale-95 translate-y-0 shadow-none' : ''
          }`}
        >
          <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
            <span className="text-sm font-bold opacity-90">{t.cardOutbound}</span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">📤</div>
          </div>
          <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
            <span className="text-3xl font-black tracking-tight">{isTxLoading ? '...' : outboundCount}</span>
            <span className="text-[11px] font-medium opacity-80">{t.unitTx}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* جدول الحركات الديناميكي */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-800">{t.tableTitle}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[450px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold">
                    <th className="pb-3 text-left">{t.thID}</th>
                    <th className="pb-3 text-left">{t.thItem}</th>
                    <th className="pb-3 text-left">{t.thQty}</th>
                    <th className="pb-3 text-left">{t.thStatus}</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50 text-slate-600">
                  {isTxLoading ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400">جاري تحميل الحركات...</td>
                    </tr>
                  ) : transactionsData.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400">لا توجد حركات مسجلة</td>
                    </tr>
                  ) : (
                    transactionsData.map((tx) => (
                      <tr key={tx.id} className="cursor-pointer transition-colors duration-200 hover:bg-slate-50">
                        <td className="py-3.5 font-bold text-blue-600 text-left">{tx.id}</td>
                        <td className="py-3.5 font-bold text-slate-800 text-left">{tx.item}</td>
                        <td className="py-3.5 font-black text-slate-800 text-left">{tx.qty}</td>
                        <td className="py-3.5 text-left">
                          <span
                            className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                              tx.type === 'in'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : 'bg-purple-50 text-purple-600 border-purple-100'
                            }`}
                          >
                            {tx.type === 'in' ? t.statusIn : t.statusOut}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* أزرار الإجراءات السريعة التفاعلية */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
            <h3 className="text-sm font-bold text-slate-800 mb-4">{t.quickActionsTitle}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-blue-100 bg-blue-50/30 text-blue-600 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 hover:bg-blue-50 active:scale-95"
              >
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">➕</span>
                <span className="text-xs font-bold">{t.actionAddItem}</span>
              </button>
              <button 
                onClick={() => setIsRestockModalOpen(true)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 text-emerald-600 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20 hover:bg-emerald-50 active:scale-95"
              >
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">🚚</span>
                <span className="text-xs font-bold">{t.actionReceive}</span>
              </button>
              <button 
                onClick={() => alert('ميزة نقل المخزون قيد التفعيل')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-purple-100 bg-purple-50/30 text-purple-600 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 hover:bg-purple-50 active:scale-95"
              >
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">📦</span>
                <span className="text-xs font-bold">{t.actionTransfer}</span>
              </button>
              <button 
                onClick={() => alert('ميزة الجرد السريع قيد التفعيل')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-700 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-500/10 hover:bg-slate-50 active:scale-95"
              >
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">📋</span>
                <span className="text-xs font-bold">{t.actionAudit}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* حالة الأقسام الرئيسية الديناميكية */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
            <h3 className="text-sm font-bold text-slate-800 mb-5 text-left">{t.categoriesTitle}</h3>
            <div className="space-y-4">
              {dynamicCategories.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-2">لا توجد تصنيفات مسجلة</p>
              ) : (
                dynamicCategories.map((cat, index) => (
                  <div key={index} className="space-y-1.5 group cursor-pointer">
                    <div className="flex justify-between text-xs font-bold text-slate-700 transition-colors group-hover:text-blue-600">
                      <span className="truncate text-left">{cat.name}</span>
                      <span className="text-slate-500 font-semibold group-hover:text-blue-500 transition-colors">{cat.p}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${cat.color}`}
                        style={{ width: cat.p }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* تنبيهات المخزون */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
            <h3 className="text-sm font-bold text-slate-800 mb-4 text-left">{t.alertsTitle}</h3>
            <div className="space-y-3 text-xs font-bold">
              {lowStockCount > 0 ? (
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 text-left transition-all hover:shadow-sm">
                  يوجد لديك {lowStockCount} مواد أوشكت على النفاد ⚠️
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-left transition-all hover:shadow-sm">
                  جميع كميات المخزون في حالة جيدة ✅
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* نافذة منبثقة (Modal) لإضافة مادة جديدة حقيقية */}
      {/* ==========================================
          نافذة إضافة مادة جديدة - المكوّن الموحّد الصحيح
          (نفس المكوّن المستخدم في Materials.tsx، يطابق ProductDto حرفياً)
          ========================================== */}
      <AddProductModal
        isOpen={isAddModalOpen}
        mode="add"
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={async () => {
          // إغلاق النافذة ثم إعادة الجلب من الباك إند لتحديث كل بطاقات ولوحة المستودع
          setIsAddModalOpen(false);
          await fetchDashboardData();
        }}
      />

      {/* ==========================================
          نافذة استلام بضاعة - بحث عن منتج قائم وإضافة كمية مستلمة
          ========================================== */}
      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
}