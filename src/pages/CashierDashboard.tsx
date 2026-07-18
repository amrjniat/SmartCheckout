// import { useState } from 'react';
// import Header, { type MenuItem } from '../components/layout/Header';

// export default function WarehouseDashboard() {
//   const [isRtl, setIsRtl] = useState(true);
//   const [activeCard, setActiveCard] = useState<string | null>(null);

//   const t = isRtl ? {
//     langBtn: 'English',
//     userTitle: 'أمين المستودع',
//     userName: 'محمد الخالد',
//     branchName: 'المستودع الرئيسي',
//     avatarChar: 'م',
//     headerTitle: 'لوحة تحكم المستودعات واللوجستيات',
//     headerSubtitle: 'مراقبة المخزون، الحركات المستودعية، وإدارة سلاسل الإمداد',
//     cardTotalItems: 'إجمالي المواد',
//     cardLowStock: 'مواد منخفضة',
//     cardInbound: 'حركات الإدخال',
//     cardOutbound: 'حركات الإخراج',
//     unitItem: 'مادة',
//     unitTx: 'حركة',
//     tableTitle: 'آخر الحركات المستودعية',
//     thID: 'رقم الحركة',
//     thItem: 'المادة',
//     thType: 'النوع',
//     thQty: 'الكمية',
//     thStatus: 'الحالة',
//     statusIn: 'إدخال',
//     statusOut: 'إخراج',
//     categoriesTitle: 'حالة الأقسام الرئيسية',
//     quickActionsTitle: 'إجراءات المستودع',
//     actionAddItem: 'إضافة مادة',
//     actionReceive: 'استلام بضاعة',
//     actionTransfer: 'نقل مخزون',
//     actionAudit: 'جرد سريع',
//     alertsTitle: 'تنبيهات المخزون',
//     alertEmpty: 'نفدت كمية "شاشات العرض" ⚠️',
//     alertLow: 'مخزون "طابعات الليزر" أقل من الحد الأدنى ⚠️',
//     navDash: 'الرئيسية',
//     navItems: 'إدارة المواد',
//     navMovements: 'الحركات',
//     navInventory: 'الجرد واللوجستيات',
//     navSuppliers: 'الموردين',
//   } : {
//     langBtn: 'العربية',
//     userTitle: 'Warehouse Keeper',
//     userName: 'Mohamed Alkhalid',
//     branchName: 'Main Warehouse',
//     avatarChar: 'M',
//     headerTitle: 'Stores & Logistics Dashboard',
//     headerSubtitle: 'Inventory monitoring, stock movements, and supply chain management',
//     cardTotalItems: 'Total Items',
//     cardLowStock: 'Low Stock',
//     cardInbound: 'Inbound Tx',
//     cardOutbound: 'Outbound Tx',
//     unitItem: 'Items',
//     unitTx: 'Tx',
//     tableTitle: 'Latest Inventory Movements',
//     thID: 'Tx ID',
//     thItem: 'Item',
//     thType: 'Type',
//     thQty: 'Qty',
//     thStatus: 'Status',
//     statusIn: 'In',
//     statusOut: 'Out',
//     categoriesTitle: 'Main Categories Status',
//     quickActionsTitle: 'Warehouse Actions',
//     actionAddItem: 'Add Item',
//     actionReceive: 'Receive Goods',
//     actionTransfer: 'Transfer Stock',
//     actionAudit: 'Quick Audit',
//     alertsTitle: 'Inventory Alerts',
//     alertEmpty: '"Monitors" stock is completely depleted ⚠️',
//     alertLow: '"Laser Printers" stock is below minimum ⚠️',
//     navDash: 'Dashboard',
//     navItems: 'Items',
//     navMovements: 'Movements',
//     navInventory: 'Logistics',
//     navSuppliers: 'Suppliers',
//   };

//   const menuItems: MenuItem[] = [
//     { id: 'dash', text: t.navDash, active: true },
//     { id: 'items', text: t.navItems, active: false },
//     { id: 'movements', text: t.navMovements, active: false },
//     { id: 'inventory', text: t.navInventory, active: false },
//     { id: 'suppliers', text: t.navSuppliers, active: false },
//   ];

//   const transactionsData = [
//     { id: 'TX-5092', item: isRtl ? 'شاشة ديل 24' : 'Dell Monitor 24', qty: '50', type: 'in' },
//     { id: 'TX-5093', item: isRtl ? 'لوحة مفاتيح' : 'Keyboard', qty: '120', type: 'in' },
//     { id: 'TX-5094', item: isRtl ? 'فأرة لاسلكية' : 'Wireless Mouse', qty: '15', type: 'out' },
//   ];

//   const handleCardPress = (cardId: string) => {
//     setActiveCard(cardId);
//     setTimeout(() => setActiveCard(null), 150);
//   };

//   return (
//     <div className="flex flex-col w-full h-screen overflow-hidden bg-slate-50 font-sans relative" dir={isRtl ? 'rtl' : 'ltr'}>
//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar { height: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.01); border-radius: 100px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.25); border-radius: 100px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.6); }
//         .card-hover {
//           transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
//           transform: translateY(0);
//           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
//         }
//         .card-hover:hover {
//           transform: translateY(-8px);
//           box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
//         }
//         .card-hover:active, .card-hover.active {
//           transform: translateY(-4px);
//           box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.2);
//         }
//         .interactive {
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//         }
//         .interactive:hover {
//           transform: translateY(-3px);
//           box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15);
//         }
//         .interactive:active {
//           transform: translateY(-1px);
//         }
//         .row-hover {
//           transition: all 0.25s ease;
//         }
//         .row-hover:hover {
//           background: rgba(59, 130, 246, 0.06);
//           transform: translateY(-2px);
//         }
//         .alert-hover {
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
//         }
//         .alert-hover:hover {
//           transform: translateY(-3px);
//           box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
//         }
//         .progress-animate {
//           transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
//         }
//         .icon-hover {
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//         }
//         .icon-hover:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15);
//         }
//         .inner-card {
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
//         }
//         .inner-card:hover {
//           transform: translateY(-6px);
//           box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);
//         }
//       `}</style>

//       <Header
//         title={t.headerTitle}
//         subtitle={t.headerSubtitle}
//         isRtl={isRtl}
//         onToggleRtl={() => setIsRtl(!isRtl)}
//         userName={t.userName}
//         userTitle={t.userTitle}
//         avatarChar={t.avatarChar}
//         branchName={t.branchName}
//         menuItems={menuItems}
//         showFilters={false}
//         showNotifications={true}
//         showUserCard={true}
//         langBtn={t.langBtn}
//       />

//       <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           <div onClick={() => handleCardPress('totalItems')} className={`card-hover relative p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer ${activeCard === 'totalItems' ? 'active' : ''}`}>
//             <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
//               <span className="text-sm font-bold opacity-90">{t.cardTotalItems}</span>
//               <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">📦</div>
//             </div>
//             <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
//               <span className="text-3xl font-black tracking-tight">1,245</span><span className="text-[11px] font-medium opacity-80">{t.unitItem}</span>
//             </div>
//           </div>

//           <div onClick={() => handleCardPress('lowStock')} className={`card-hover relative p-5 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer ${activeCard === 'lowStock' ? 'active' : ''}`}>
//             <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
//               <span className="text-sm font-bold opacity-90">{t.cardLowStock}</span>
//               <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">⚠️</div>
//             </div>
//             <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
//               <span className="text-3xl font-black tracking-tight">12</span><span className="text-[11px] font-medium opacity-80">{t.unitItem}</span>
//             </div>
//           </div>

//           <div onClick={() => handleCardPress('inbound')} className={`card-hover relative p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer ${activeCard === 'inbound' ? 'active' : ''}`}>
//             <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
//               <span className="text-sm font-bold opacity-90">{t.cardInbound}</span>
//               <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">📥</div>
//             </div>
//             <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
//               <span className="text-3xl font-black tracking-tight">45</span><span className="text-[11px] font-medium opacity-80">{t.unitTx}</span>
//             </div>
//           </div>

//           <div onClick={() => handleCardPress('outbound')} className={`card-hover relative p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer ${activeCard === 'outbound' ? 'active' : ''}`}>
//             <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
//               <span className="text-sm font-bold opacity-90">{t.cardOutbound}</span>
//               <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">📤</div>
//             </div>
//             <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
//               <span className="text-3xl font-black tracking-tight">38</span><span className="text-[11px] font-medium opacity-80">{t.unitTx}</span>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-6">
//             {/* Transactions Table */}
//             <div className="inner-card bg-white rounded-2xl border border-slate-100 p-5">
//               <div className="flex items-center justify-between mb-5">
//                 <h3 className="text-sm font-bold text-slate-800">{t.tableTitle}</h3>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse min-w-[450px]">
//                   <thead>
//                     <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold">
//                       <th className="pb-3 text-left">{t.thID}</th>
//                       <th className="pb-3 text-left">{t.thItem}</th>
//                       <th className="pb-3 text-left">{t.thQty}</th>
//                       <th className="pb-3 text-left">{t.thStatus}</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-sm divide-y divide-slate-50 text-slate-600">
//                     {transactionsData.map((tx) => (
//                       <tr key={tx.id} className="row-hover cursor-pointer">
//                         <td className="py-3.5 font-bold text-blue-600 text-left">{tx.id}</td>
//                         <td className="py-3.5 font-bold text-slate-800 text-left">{tx.item}</td>
//                         <td className="py-3.5 font-black text-slate-800 text-left">{tx.qty}</td>
//                         <td className="py-3.5 text-left">
//                           <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border ${tx.type === 'in' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
//                             {tx.type === 'in' ? t.statusIn : t.statusOut}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="inner-card bg-white rounded-2xl border border-slate-100 p-5">
//               <h3 className="text-sm font-bold text-slate-800 mb-4">{t.quickActionsTitle}</h3>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                 <button className="icon-hover flex flex-col items-center justify-center p-4 rounded-xl border border-blue-100 bg-blue-50/30 hover:bg-blue-50 text-blue-600 group cursor-pointer">
//                   <span className="text-xl mb-1 group-hover:scale-110 transition-transform">➕</span><span className="text-xs font-bold">{t.actionAddItem}</span>
//                 </button>
//                 <button className="icon-hover flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 text-emerald-600 group cursor-pointer">
//                   <span className="text-xl mb-1 group-hover:scale-110 transition-transform">🚚</span><span className="text-xs font-bold">{t.actionReceive}</span>
//                 </button>
//                 <button className="icon-hover flex flex-col items-center justify-center p-4 rounded-xl border border-purple-100 bg-purple-50/30 hover:bg-purple-50 text-purple-600 group cursor-pointer">
//                   <span className="text-xl mb-1 group-hover:scale-110 transition-transform">📦</span><span className="text-xs font-bold">{t.actionTransfer}</span>
//                 </button>
//                 <button className="icon-hover flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-700 group cursor-pointer">
//                   <span className="text-xl mb-1 group-hover:scale-110 transition-transform">📋</span><span className="text-xs font-bold">{t.actionAudit}</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-6">
//             {/* Categories */}
//             <div className="inner-card bg-white rounded-2xl border border-slate-100 p-5">
//               <h3 className="text-sm font-bold text-slate-800 mb-5 text-left">{t.categoriesTitle}</h3>
//               <div className="space-y-4">
//                 {[{name: isRtl?'إلكترونيات':'Electronics', p:'80%'}, {name: isRtl?'قرطاسية':'Stationery', p:'45%'}, {name: isRtl?'مواد تنظيف':'Cleaning', p:'20%'}].map((cat, index) => (
//                   <div key={index} className="space-y-1.5">
//                     <div className="flex justify-between text-xs font-bold text-slate-700">
//                       <span className="truncate text-left">{cat.name}</span><span className="text-slate-500 font-semibold">{cat.p}</span>
//                     </div>
//                     <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                       <div className={`progress-animate h-full rounded-full ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: cat.p }}></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Alerts */}
//             <div className="inner-card bg-white rounded-2xl border border-slate-100 p-5">
//               <h3 className="text-sm font-bold text-slate-800 mb-4 text-left">{t.alertsTitle}</h3>
//               <div className="space-y-3 text-xs font-bold">
//                 <div className="alert-hover p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-left cursor-pointer">{t.alertEmpty}</div>
//                 <div className="alert-hover p-3 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 text-left cursor-pointer">{t.alertLow}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }









import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

interface OutletContextType {
  isRtl: boolean;
  setIsRtl: (val: boolean) => void;
}

export default function CashierDashboard() {
  const { isRtl } = useOutletContext<OutletContextType>();
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const translations = {
    ar: {
      cardTodaySales: 'مبيعات اليوم',
      cardInvoicesCount: 'عدد الفواتير',
      cardDrawerStatus: 'حالة الدرج',
      cardShiftDuration: 'مدة الوردية',
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
      actionOpenDrawer: 'فتح الدرج',
      actionShiftReport: 'تقرير الوردية',
      actionCloseShift: 'إغلاق الوردية',
      alertsTitle: 'تنبيهات',
      alertNoAlerts: 'لا توجد تنبيهات حالياً ✅',
      alertLowCash: 'رصيد الدرج منخفض، يُفضّل الإيداع ⚠️',
    },
    en: {
      cardTodaySales: "Today's Sales",
      cardInvoicesCount: 'Invoices Count',
      cardDrawerStatus: 'Drawer Status',
      cardShiftDuration: 'Shift Duration',
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
      actionOpenDrawer: 'Open Drawer',
      actionShiftReport: 'Shift Report',
      actionCloseShift: 'Close Shift',
      alertsTitle: 'Alerts',
      alertNoAlerts: 'No alerts right now ✅',
      alertLowCash: 'Drawer cash balance is low ⚠️',
    },
  };

  const t = isRtl ? translations.ar : translations.en;

  const invoicesData = [
    { id: 'INV-2041', customer: isRtl ? 'زبون نقدي' : 'Walk-in Customer', amount: '85,000', status: 'paid' },
    { id: 'INV-2042', customer: isRtl ? 'محمد سعيد' : 'Mohamad Saeed', amount: '142,500', status: 'paid' },
    { id: 'INV-2043', customer: isRtl ? 'زبون نقدي' : 'Walk-in Customer', amount: '30,000', status: 'returned' },
  ];

  const handleCardPress = (cardId: string) => {
    setActiveCard(cardId);
    setTimeout(() => setActiveCard(null), 150);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-slate-50/50">
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
            <span className="text-3xl font-black tracking-tight">1,257,500</span>
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
            <span className="text-3xl font-black tracking-tight">27</span>
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

        <div
          onClick={() => handleCardPress('shiftDuration')}
          className={`relative p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-500/50 ${
            activeCard === 'shiftDuration' ? 'scale-95 translate-y-0 shadow-none' : ''
          }`}
        >
          <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
            <span className="text-sm font-bold opacity-90">{t.cardShiftDuration}</span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">⏱️</div>
          </div>
          <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
            <span className="text-3xl font-black tracking-tight">03:24</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* جدول الفواتير */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-slate-800">{t.tableTitle}</h3>
            </div>
            <div className="overflow-x-auto">
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
                  {invoicesData.map((inv) => (
                    <tr key={inv.id} className="cursor-pointer transition-colors duration-200 hover:bg-slate-50">
                      <td className="py-3.5 font-bold text-blue-600 text-left">{inv.id}</td>
                      <td className="py-3.5 font-bold text-slate-800 text-left">{inv.customer}</td>
                      <td className="py-3.5 font-black text-slate-800 text-left">{inv.amount}</td>
                      <td className="py-3.5 text-left">
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                            inv.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}
                        >
                          {inv.status === 'paid' ? t.statusPaid : t.statusReturned}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* أزرار الإجراءات السريعة */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
            <h3 className="text-sm font-bold text-slate-800 mb-4">{t.quickActionsTitle}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-blue-100 bg-blue-50/30 text-blue-600 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 hover:bg-blue-50 active:scale-95">
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">🧾</span>
                <span className="text-xs font-bold">{t.actionNewSale}</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-amber-100 bg-amber-50/30 text-amber-600 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/20 hover:bg-amber-50 active:scale-95">
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">🗄️</span>
                <span className="text-xs font-bold">{t.actionOpenDrawer}</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-purple-100 bg-purple-50/30 text-purple-600 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 hover:bg-purple-50 active:scale-95">
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">📊</span>
                <span className="text-xs font-bold">{t.actionShiftReport}</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-700 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-500/10 hover:bg-slate-50 active:scale-95">
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">🔒</span>
                <span className="text-xs font-bold">{t.actionCloseShift}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* تنبيهات */}
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
    </div>
  );
}