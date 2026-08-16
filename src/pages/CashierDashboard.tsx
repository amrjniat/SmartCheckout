// import { useState, useEffect } from 'react';
// import connection, { onAnyDataChange } from '../services/signalRService';
// import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
// import { getTodayInvoicesForBranch } from '../services/invoiceService';
// import type { InvoiceSummary } from '../services/invoiceService';

// interface OutletContextType {
//   isRtl: boolean;
//   setIsRtl: (val: boolean) => void;
// }

// const BRANCH_ID = 3; // ثابت معتمد للمؤسسة

// export default function CashierDashboard() {
//   const { isRtl } = useOutletContext<OutletContextType>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activeCard, setActiveCard] = useState<string | null>(null);

//   const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
//   const [totalSales, setTotalSales] = useState<number>(0);
//   const [invoicesCount, setInvoicesCount] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
  
//   const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false); 

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       // ✅ نجيب كل فواتير الفرع اليوم، بغض النظر مين باعها (كاشير أو مدير)
//       const result = await getTodayInvoicesForBranch(BRANCH_ID);

//       setInvoices(result.invoices);
//       setInvoicesCount(result.total);

//       const sum = result.invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
//       setTotalSales(sum);

//       setError(null);
//     } catch (err) {
//       console.error('فشل جلب فواتير اليوم:', err);
//       setError('حدث خطأ أثناء تحميل البيانات');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const unsubscribe = onAnyDataChange(() => {
//       console.log("📩 تغيّرت بيانات الفواتير أو المخزون - تحديث لوحة الكاشير");
//       fetchData();
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   const translations = {
//     ar: {
//       cardTodaySales: 'مبيعات اليوم',
//       cardInvoicesCount: 'عدد الفواتير',
//       cardDrawerStatus: 'حالة الدرج',
//       unitCurrency: 'ل.س',
//       unitInvoice: 'فاتورة',
//       drawerOpen: 'مفتوح',
//       tableTitle: 'آخر الفواتير',
//       thID: 'رقم الفاتورة',
//       thCustomer: 'الزبون',
//       thAmount: 'المبلغ',
//       thStatus: 'الحالة',
//       statusPaid: 'مدفوعة',
//       statusReturned: 'مرتجعة',
//       quickActionsTitle: 'إجراءات سريعة',
//       actionNewSale: 'فاتورة جديدة',
//       actionShiftReport: 'تقرير الوردية',
//       actionCloseShift: 'إغلاق الوردية',
//       alertsTitle: 'تنبيهات',
//       alertNoAlerts: 'لا توجد تنبيهات حالياً ✅',
//       alertLowCash: 'رصيد الدرج منخفض، يُفضّل الإيداع ⚠️',
//       loadingText: 'جاري التحميل...',
//       errorText: 'تعذر تحميل البيانات',
//       noInvoices: 'لا توجد فواتير اليوم بعد',
//     },
//     en: {
//       cardTodaySales: "Today's Sales",
//       cardInvoicesCount: 'Invoices Count',
//       cardDrawerStatus: 'Drawer Status',
//       unitCurrency: 'SYP',
//       unitInvoice: 'Invoices',
//       drawerOpen: 'Open',
//       tableTitle: 'Latest Invoices',
//       thID: 'Invoice ID',
//       thCustomer: 'Customer',
//       thAmount: 'Amount',
//       thStatus: 'Status',
//       statusPaid: 'Paid',
//       statusReturned: 'Returned',
//       quickActionsTitle: 'Quick Actions',
//       actionNewSale: 'New Sale',
//       actionShiftReport: 'Shift Report',
//       actionCloseShift: 'Close Shift',
//       alertsTitle: 'Alerts',
//       alertNoAlerts: 'No alerts right now ✅',
//       alertLowCash: 'Drawer cash balance is low ⚠️',
//       loadingText: 'Loading...',
//       errorText: 'Failed to load data',
//       noInvoices: 'No invoices yet today',
//     },
//   };

//   const t = isRtl ? translations.ar : translations.en;

//   const handleCardPress = (cardId: string) => {
//     setActiveCard(cardId);
//     setTimeout(() => setActiveCard(null), 150);
//   };

//   const handleNewSale = () => {
//     handleCardPress('newSale');
//     const targetPath = location.pathname.startsWith('/cashier') ? '/cashier/pos' : '/pos';
//     navigate(targetPath);
//   };

//   const handleCloseShift = () => {
//     handleCardPress('closeShift');
//     setIsReportModalOpen(false);
//     navigate('/');
//   };

//   const formatNumber = (num: number) => num.toLocaleString('en-US');

//   return (
//     <div className="p-4 sm:p-6 space-y-6 bg-slate-50/50 relative">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//         <div
//           onClick={() => handleCardPress('todaySales')}
//           className={`relative p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/50 ${
//             activeCard === 'todaySales' ? 'scale-95 translate-y-0 shadow-none' : ''
//           }`}
//         >
//           <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
//             <span className="text-sm font-bold opacity-90">{t.cardTodaySales}</span>
//             <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">💵</div>
//           </div>
//           <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
//             <span className="text-3xl font-black tracking-tight">
//               {loading ? '...' : formatNumber(totalSales)}
//             </span>
//             <span className="text-[11px] font-medium opacity-80">{t.unitCurrency}</span>
//           </div>
//         </div>

//         <div
//           onClick={() => handleCardPress('invoicesCount')}
//           className={`relative p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-500/50 ${
//             activeCard === 'invoicesCount' ? 'scale-95 translate-y-0 shadow-none' : ''
//           }`}
//         >
//           <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
//             <span className="text-sm font-bold opacity-90">{t.cardInvoicesCount}</span>
//             <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">🧾</div>
//           </div>
//           <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
//             <span className="text-3xl font-black tracking-tight">
//               {loading ? '...' : invoicesCount}
//             </span>
//             <span className="text-[11px] font-medium opacity-80">{t.unitInvoice}</span>
//           </div>
//         </div>

//         <div
//           onClick={() => handleCardPress('drawerStatus')}
//           className={`relative p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-amber-500/50 ${
//             activeCard === 'drawerStatus' ? 'scale-95 translate-y-0 shadow-none' : ''
//           }`}
//         >
//           <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
//             <span className="text-sm font-bold opacity-90">{t.cardDrawerStatus}</span>
//             <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">🗄️</div>
//           </div>
//           <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
//             <span className="text-3xl font-black tracking-tight">{t.drawerOpen}</span>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
//             <div className="flex items-center justify-between mb-5">
//               <h3 className="text-sm font-bold text-slate-800">{t.tableTitle}</h3>
//             </div>
//             <div className="overflow-x-auto">
//               {loading ? (
//                 <div className="text-center py-8 text-slate-400 text-sm font-bold">{t.loadingText}</div>
//               ) : error ? (
//                 <div className="text-center py-8 text-rose-500 text-sm font-bold">{error}</div>
//               ) : invoices.length === 0 ? (
//                 <div className="text-center py-8 text-slate-400 text-sm font-bold">{t.noInvoices}</div>
//               ) : (
//                 <table className="w-full text-left border-collapse min-w-[450px]">
//                   <thead>
//                     <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold">
//                       <th className="pb-3 text-left">{t.thID}</th>
//                       <th className="pb-3 text-left">{t.thCustomer}</th>
//                       <th className="pb-3 text-left">{t.thAmount}</th>
//                       <th className="pb-3 text-left">{t.thStatus}</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-sm divide-y divide-slate-50 text-slate-600">
//                     {invoices.slice(0, 5).map((inv) => (
//                       <tr key={inv.id} className="cursor-pointer transition-colors duration-200 hover:bg-slate-50">
//                         <td className="py-3.5 font-bold text-blue-600 text-left">{inv.invoiceNumber}</td>
//                         <td className="py-3.5 font-bold text-slate-800 text-left">{inv.customerName}</td>
//                         <td className="py-3.5 font-black text-slate-800 text-left">{formatNumber(inv.totalAmount)}</td>
//                         <td className="py-3.5 text-left">
//                           <span
//                             className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border ${
//                               inv.status === 'مدفوعة'
//                                 ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
//                                 : 'bg-rose-50 text-rose-600 border-rose-100'
//                             }`}
//                           >
//                             {inv.status === 'مدفوعة' ? t.statusPaid : t.statusReturned}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
//             <h3 className="text-sm font-bold text-slate-800 mb-4">{t.quickActionsTitle}</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//               <button
//                 onClick={handleNewSale}
//                 className={`flex flex-col items-center justify-center p-4 rounded-xl border border-blue-100 bg-blue-50/30 text-blue-600 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 hover:bg-blue-50 active:scale-95 ${
//                   activeCard === 'newSale' ? 'scale-95 shadow-none' : ''
//                 }`}
//               >
//                 <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">🧾</span>
//                 <span className="text-xs font-bold">{t.actionNewSale}</span>
//               </button>
              
//               <button 
//                 onClick={() => setIsReportModalOpen(true)}
//                 className="flex flex-col items-center justify-center p-4 rounded-xl border border-purple-100 bg-purple-50/30 text-purple-600 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 hover:bg-purple-50 active:scale-95"
//               >
//                 <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">📊</span>
//                 <span className="text-xs font-bold">{t.actionShiftReport}</span>
//               </button>
              
//               <button
//                 onClick={handleCloseShift}
//                 className={`flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-700 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-500/10 hover:bg-slate-50 active:scale-95 ${
//                   activeCard === 'closeShift' ? 'scale-95 shadow-none' : ''
//                 }`}
//               >
//                 <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">🔒</span>
//                 <span className="text-xs font-bold">{t.actionCloseShift}</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-6">
//           <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
//             <h3 className="text-sm font-bold text-slate-800 mb-4 text-left">{t.alertsTitle}</h3>
//             <div className="space-y-3 text-xs font-bold">
//               <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-left">
//                 {t.alertNoAlerts}
//               </div>
//               <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 text-left cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:shadow-orange-500/10 active:scale-95">
//                 {t.alertLowCash}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isReportModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
//           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
//             <div className={`p-5 flex justify-between items-center bg-purple-50/50 border-b border-purple-100 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
//               <h2 className="text-lg font-bold text-purple-800 flex items-center gap-2">
//                 <span>📊</span>
//                 {t.actionShiftReport}
//               </h2>
//               <button 
//                 onClick={() => setIsReportModalOpen(false)} 
//                 className="text-purple-400 hover:text-purple-600 hover:bg-purple-100 p-1 rounded-full transition-colors"
//               >
//                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
            
//             <div className="p-6 space-y-4">
//               <div className={`flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 ${isRtl ? 'text-right' : 'text-left'}`}>
//                 <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-3xl shrink-0 shadow-sm border border-white">💵</div>
//                 <div>
//                   <p className="text-sm font-bold text-blue-600 mb-1">{t.cardTodaySales}</p>
//                   <p className="text-2xl font-black text-slate-800">
//                     {loading ? '...' : formatNumber(totalSales)} <span className="text-xs font-bold text-slate-500">{t.unitCurrency}</span>
//                   </p>
//                 </div>
//               </div>
              
//               <div className={`flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 ${isRtl ? 'text-right' : 'text-left'}`}>
//                 <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-3xl shrink-0 shadow-sm border border-white">🧾</div>
//                 <div>
//                   <p className="text-sm font-bold text-emerald-600 mb-1">{t.cardInvoicesCount}</p>
//                   <p className="text-2xl font-black text-slate-800">
//                     {loading ? '...' : invoicesCount} <span className="text-xs font-bold text-slate-500">{t.unitInvoice}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-4 bg-slate-50 border-t border-slate-100">
//               <button
//                 onClick={() => setIsReportModalOpen(false)}
//                 className="w-full py-3 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
//               >
//                 {isRtl ? 'إغلاق' : 'Close'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





import { useState, useEffect } from 'react';
import { onAnyDataChange } from '../services/signalRService';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { getTodayInvoicesForBranch } from '../services/invoiceService';
import type { InvoiceSummary } from '../services/invoiceService';
import { getBranchIdFromToken } from '../services/authHelpers';

interface OutletContextType {
  isRtl: boolean;
  setIsRtl: (val: boolean) => void;
}

export default function CashierDashboard() {
  const { isRtl } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [invoicesCount, setInvoicesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false); 

  const fetchData = async () => {
    try {
      setLoading(true);

      // ✅ نجيب معرف الفرع الحقيقي من التوكن (Claims) بدل الثابت
      const branchId = getBranchIdFromToken();
      if (branchId === null) {
        setError(t.branchIdMissing);
        setInvoices([]);
        setInvoicesCount(0);
        setTotalSales(0);
        return;
      }

      // ✅ نجيب كل فواتير الفرع اليوم، بغض النظر مين باعها (كاشير أو مدير)
      const result = await getTodayInvoicesForBranch(branchId);

      setInvoices(result.invoices);
      setInvoicesCount(result.total);

      const sum = result.invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
      setTotalSales(sum);

      setError(null);
    } catch (err) {
      console.error('فشل جلب فواتير اليوم:', err);
      setError('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAnyDataChange(() => {
      console.log("📩 تغيّرت بيانات الفواتير أو المخزون - تحديث لوحة الكاشير");
      fetchData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const translations = {
    ar: {
      cardTodaySales: 'مبيعات اليوم',
      cardInvoicesCount: 'عدد الفواتير',
      cardDrawerStatus: 'حالة الدرج',
      unitCurrency: 'ل.س',
      unitInvoice: 'فاتورة',
      drawerOpen: 'مفتوح',
      tableTitle: 'آخر الفواتير',
      thID: 'رقم الفاتورة',
      thCustomer: 'الزبون',
      thAmount: 'المبلغ',
      thStatus: 'الحالة',
      statusPaid: 'مدفوعة',
      statusReturned: 'مرتجعة',
      quickActionsTitle: 'إجراءات سريعة',
      actionNewSale: 'فاتورة جديدة',
      actionShiftReport: 'تقرير الوردية',
      actionCloseShift: 'إغلاق الوردية',
      alertsTitle: 'تنبيهات',
      alertNoAlerts: 'لا توجد تنبيهات حالياً ✅',
      alertLowCash: 'رصيد الدرج منخفض، يُفضّل الإيداع ⚠️',
      loadingText: 'جاري التحميل...',
      errorText: 'تعذر تحميل البيانات',
      noInvoices: 'لا توجد فواتير اليوم بعد',
      branchIdMissing: 'تعذر تحديد الفرع، الرجاء تسجيل الدخول من جديد',
    },
    en: {
      cardTodaySales: "Today's Sales",
      cardInvoicesCount: 'Invoices Count',
      cardDrawerStatus: 'Drawer Status',
      unitCurrency: 'SYP',
      unitInvoice: 'Invoices',
      drawerOpen: 'Open',
      tableTitle: 'Latest Invoices',
      thID: 'Invoice ID',
      thCustomer: 'Customer',
      thAmount: 'Amount',
      thStatus: 'Status',
      statusPaid: 'Paid',
      statusReturned: 'Returned',
      quickActionsTitle: 'Quick Actions',
      actionNewSale: 'New Sale',
      actionShiftReport: 'Shift Report',
      actionCloseShift: 'Close Shift',
      alertsTitle: 'Alerts',
      alertNoAlerts: 'No alerts right now ✅',
      alertLowCash: 'Drawer cash balance is low ⚠️',
      loadingText: 'Loading...',
      errorText: 'Failed to load data',
      noInvoices: 'No invoices yet today',
      branchIdMissing: 'Could not determine branch, please sign in again',
    },
  };

  const t = isRtl ? translations.ar : translations.en;

  const handleCardPress = (cardId: string) => {
    setActiveCard(cardId);
    setTimeout(() => setActiveCard(null), 150);
  };

  const handleNewSale = () => {
    handleCardPress('newSale');
    const targetPath = location.pathname.startsWith('/cashier') ? '/cashier/pos' : '/pos';
    navigate(targetPath);
  };

  const handleCloseShift = () => {
    handleCardPress('closeShift');
    setIsReportModalOpen(false);
    navigate('/');
  };

  const formatNumber = (num: number) => num.toLocaleString('en-US');

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-slate-50/50 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          onClick={() => handleCardPress('todaySales')}
          className={`relative p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/50 ${
            activeCard === 'todaySales' ? 'scale-95 translate-y-0 shadow-none' : ''
          }`}
        >
          <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
            <span className="text-sm font-bold opacity-90">{t.cardTodaySales}</span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">💵</div>
          </div>
          <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
            <span className="text-3xl font-black tracking-tight">
              {loading ? '...' : formatNumber(totalSales)}
            </span>
            <span className="text-[11px] font-medium opacity-80">{t.unitCurrency}</span>
          </div>
        </div>

        <div
          onClick={() => handleCardPress('invoicesCount')}
          className={`relative p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-500/50 ${
            activeCard === 'invoicesCount' ? 'scale-95 translate-y-0 shadow-none' : ''
          }`}
        >
          <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
            <span className="text-sm font-bold opacity-90">{t.cardInvoicesCount}</span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">🧾</div>
          </div>
          <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
            <span className="text-3xl font-black tracking-tight">
              {loading ? '...' : invoicesCount}
            </span>
            <span className="text-[11px] font-medium opacity-80">{t.unitInvoice}</span>
          </div>
        </div>

        <div
          onClick={() => handleCardPress('drawerStatus')}
          className={`relative p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-amber-500/50 ${
            activeCard === 'drawerStatus' ? 'scale-95 translate-y-0 shadow-none' : ''
          }`}
        >
          <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
            <span className="text-sm font-bold opacity-90">{t.cardDrawerStatus}</span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">🗄️</div>
          </div>
          <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
            <span className="text-3xl font-black tracking-tight">{t.drawerOpen}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-800">{t.tableTitle}</h3>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-8 text-slate-400 text-sm font-bold">{t.loadingText}</div>
              ) : error ? (
                <div className="text-center py-8 text-rose-500 text-sm font-bold">{error}</div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm font-bold">{t.noInvoices}</div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[450px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold">
                      <th className="pb-3 text-left">{t.thID}</th>
                      <th className="pb-3 text-left">{t.thCustomer}</th>
                      <th className="pb-3 text-left">{t.thAmount}</th>
                      <th className="pb-3 text-left">{t.thStatus}</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-50 text-slate-600">
                    {invoices.slice(0, 5).map((inv) => (
                      <tr key={inv.id} className="cursor-pointer transition-colors duration-200 hover:bg-slate-50">
                        <td className="py-3.5 font-bold text-blue-600 text-left">{inv.invoiceNumber}</td>
                        <td className="py-3.5 font-bold text-slate-800 text-left">{inv.customerName}</td>
                        <td className="py-3.5 font-black text-slate-800 text-left">{formatNumber(inv.totalAmount)}</td>
                        <td className="py-3.5 text-left">
                          <span
                            className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                              inv.status === 'مدفوعة'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : 'bg-rose-50 text-rose-600 border-rose-100'
                            }`}
                          >
                            {inv.status === 'مدفوعة' ? t.statusPaid : t.statusReturned}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
            <h3 className="text-sm font-bold text-slate-800 mb-4">{t.quickActionsTitle}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <button
                onClick={handleNewSale}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border border-blue-100 bg-blue-50/30 text-blue-600 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 hover:bg-blue-50 active:scale-95 ${
                  activeCard === 'newSale' ? 'scale-95 shadow-none' : ''
                }`}
              >
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">🧾</span>
                <span className="text-xs font-bold">{t.actionNewSale}</span>
              </button>
              
              <button 
                onClick={() => setIsReportModalOpen(true)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-purple-100 bg-purple-50/30 text-purple-600 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 hover:bg-purple-50 active:scale-95"
              >
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">📊</span>
                <span className="text-xs font-bold">{t.actionShiftReport}</span>
              </button>
              
              <button
                onClick={handleCloseShift}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-700 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-500/10 hover:bg-slate-50 active:scale-95 ${
                  activeCard === 'closeShift' ? 'scale-95 shadow-none' : ''
                }`}
              >
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">🔒</span>
                <span className="text-xs font-bold">{t.actionCloseShift}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
            <h3 className="text-sm font-bold text-slate-800 mb-4 text-left">{t.alertsTitle}</h3>
            <div className="space-y-3 text-xs font-bold">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-left">
                {t.alertNoAlerts}
              </div>
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 text-left cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:shadow-orange-500/10 active:scale-95">
                {t.alertLowCash}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
            <div className={`p-5 flex justify-between items-center bg-purple-50/50 border-b border-purple-100 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
              <h2 className="text-lg font-bold text-purple-800 flex items-center gap-2">
                <span>📊</span>
                {t.actionShiftReport}
              </h2>
              <button 
                onClick={() => setIsReportModalOpen(false)} 
                className="text-purple-400 hover:text-purple-600 hover:bg-purple-100 p-1 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className={`flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-3xl shrink-0 shadow-sm border border-white">💵</div>
                <div>
                  <p className="text-sm font-bold text-blue-600 mb-1">{t.cardTodaySales}</p>
                  <p className="text-2xl font-black text-slate-800">
                    {loading ? '...' : formatNumber(totalSales)} <span className="text-xs font-bold text-slate-500">{t.unitCurrency}</span>
                  </p>
                </div>
              </div>
              
              <div className={`flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-3xl shrink-0 shadow-sm border border-white">🧾</div>
                <div>
                  <p className="text-sm font-bold text-emerald-600 mb-1">{t.cardInvoicesCount}</p>
                  <p className="text-2xl font-black text-slate-800">
                    {loading ? '...' : invoicesCount} <span className="text-xs font-bold text-slate-500">{t.unitInvoice}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="w-full py-3 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}