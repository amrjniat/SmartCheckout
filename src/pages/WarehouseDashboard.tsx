// import { useState } from 'react';
// import { useOutletContext } from 'react-router-dom';

// interface OutletContextType {
//   isRtl: boolean;
//   setIsRtl: (val: boolean) => void;
// }

// export default function WarehouseDashboard() {
//   const { isRtl } = useOutletContext<OutletContextType>();
//   const [activeCard, setActiveCard] = useState<string | null>(null);

//   const translations = {
//     ar: {
//       cardTotalItems: 'إجمالي المواد',
//       cardLowStock: 'مواد منخفضة',
//       cardInbound: 'حركات الإدخال',
//       cardOutbound: 'حركات الإخراج',
//       unitItem: 'مادة',
//       unitTx: 'حركة',
//       tableTitle: 'آخر الحركات المستودعية',
//       thID: 'رقم الحركة',
//       thItem: 'المادة',
//       thQty: 'الكمية',
//       thStatus: 'الحالة',
//       statusIn: 'إدخال',
//       statusOut: 'إخراج',
//       categoriesTitle: 'حالة الأقسام الرئيسية',
//       quickActionsTitle: 'إجراءات المستودع',
//       actionAddItem: 'إضافة مادة',
//       actionReceive: 'استلام بضاعة',
//       actionTransfer: 'نقل مخزون',
//       actionAudit: 'جرد سريع',
//       alertsTitle: 'تنبيهات المخزون',
//       alertEmpty: 'نفدت كمية "شاشات العرض" ⚠️',
//       alertLow: 'مخزون "طابعات الليزر" أقل من الحد الأدنى ⚠️',
//     },
//     en: {
//       cardTotalItems: 'Total Items',
//       cardLowStock: 'Low Stock',
//       cardInbound: 'Inbound Tx',
//       cardOutbound: 'Outbound Tx',
//       unitItem: 'Items',
//       unitTx: 'Tx',
//       tableTitle: 'Latest Inventory Movements',
//       thID: 'Tx ID',
//       thItem: 'Item',
//       thQty: 'Qty',
//       thStatus: 'Status',
//       statusIn: 'In',
//       statusOut: 'Out',
//       categoriesTitle: 'Main Categories Status',
//       quickActionsTitle: 'Warehouse Actions',
//       actionAddItem: 'Add Item',
//       actionReceive: 'Receive Goods',
//       actionTransfer: 'Transfer Stock',
//       actionAudit: 'Quick Audit',
//       alertsTitle: 'Inventory Alerts',
//       alertEmpty: '"Monitors" stock is completely depleted ⚠️',
//       alertLow: '"Laser Printers" stock is below minimum ⚠️',
//     },
//   };

//   const t = isRtl ? translations.ar : translations.en;

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
//     <div className="p-4 sm:p-6 space-y-6 bg-slate-50/50">
//       {/* بطاقات الإحصائيات مع تأثيرات التمرير والضغط */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         <div
//           onClick={() => handleCardPress('totalItems')}
//           className={`relative p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/50 ${
//             activeCard === 'totalItems' ? 'scale-95 translate-y-0 shadow-none' : ''
//           }`}
//         >
//           <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
//             <span className="text-sm font-bold opacity-90">{t.cardTotalItems}</span>
//             <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">📦</div>
//           </div>
//           <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
//             <span className="text-3xl font-black tracking-tight">1,245</span>
//             <span className="text-[11px] font-medium opacity-80">{t.unitItem}</span>
//           </div>
//         </div>

//         <div
//           onClick={() => handleCardPress('lowStock')}
//           className={`relative p-5 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-rose-500/50 ${
//             activeCard === 'lowStock' ? 'scale-95 translate-y-0 shadow-none' : ''
//           }`}
//         >
//           <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
//             <span className="text-sm font-bold opacity-90">{t.cardLowStock}</span>
//             <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">⚠️</div>
//           </div>
//           <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
//             <span className="text-3xl font-black tracking-tight">12</span>
//             <span className="text-[11px] font-medium opacity-80">{t.unitItem}</span>
//           </div>
//         </div>

//         <div
//           onClick={() => handleCardPress('inbound')}
//           className={`relative p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-500/50 ${
//             activeCard === 'inbound' ? 'scale-95 translate-y-0 shadow-none' : ''
//           }`}
//         >
//           <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
//             <span className="text-sm font-bold opacity-90">{t.cardInbound}</span>
//             <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">📥</div>
//           </div>
//           <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
//             <span className="text-3xl font-black tracking-tight">45</span>
//             <span className="text-[11px] font-medium opacity-80">{t.unitTx}</span>
//           </div>
//         </div>

//         <div
//           onClick={() => handleCardPress('outbound')}
//           className={`relative p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex flex-col justify-between h-32 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-500/50 ${
//             activeCard === 'outbound' ? 'scale-95 translate-y-0 shadow-none' : ''
//           }`}
//         >
//           <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
//             <span className="text-sm font-bold opacity-90">{t.cardOutbound}</span>
//             <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">📤</div>
//           </div>
//           <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
//             <span className="text-3xl font-black tracking-tight">38</span>
//             <span className="text-[11px] font-medium opacity-80">{t.unitTx}</span>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           {/* جدول الحركات */}
//           <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
//             <div className="flex items-center justify-between mb-5">
//               <h3 className="text-sm font-bold text-slate-800">{t.tableTitle}</h3>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse min-w-[450px]">
//                 <thead>
//                   <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold">
//                     <th className="pb-3 text-left">{t.thID}</th>
//                     <th className="pb-3 text-left">{t.thItem}</th>
//                     <th className="pb-3 text-left">{t.thQty}</th>
//                     <th className="pb-3 text-left">{t.thStatus}</th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-sm divide-y divide-slate-50 text-slate-600">
//                   {transactionsData.map((tx) => (
//                     <tr key={tx.id} className="cursor-pointer transition-colors duration-200 hover:bg-slate-50">
//                       <td className="py-3.5 font-bold text-blue-600 text-left">{tx.id}</td>
//                       <td className="py-3.5 font-bold text-slate-800 text-left">{tx.item}</td>
//                       <td className="py-3.5 font-black text-slate-800 text-left">{tx.qty}</td>
//                       <td className="py-3.5 text-left">
//                         <span
//                           className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border ${
//                             tx.type === 'in'
//                               ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
//                               : 'bg-purple-50 text-purple-600 border-purple-100'
//                           }`}
//                         >
//                           {tx.type === 'in' ? t.statusIn : t.statusOut}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* أزرار الإجراءات السريعة مع تأثيرات متقدمة */}
//           <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
//             <h3 className="text-sm font-bold text-slate-800 mb-4">{t.quickActionsTitle}</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//               <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-blue-100 bg-blue-50/30 text-blue-600 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 hover:bg-blue-50 active:scale-95">
//                 <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">➕</span>
//                 <span className="text-xs font-bold">{t.actionAddItem}</span>
//               </button>
//               <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 text-emerald-600 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20 hover:bg-emerald-50 active:scale-95">
//                 <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">🚚</span>
//                 <span className="text-xs font-bold">{t.actionReceive}</span>
//               </button>
//               <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-purple-100 bg-purple-50/30 text-purple-600 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 hover:bg-purple-50 active:scale-95">
//                 <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">📦</span>
//                 <span className="text-xs font-bold">{t.actionTransfer}</span>
//               </button>
//               <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-700 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-500/10 hover:bg-slate-50 active:scale-95">
//                 <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">📋</span>
//                 <span className="text-xs font-bold">{t.actionAudit}</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-6">
//           {/* حالة الأقسام الرئيسية */}
//           <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
//             <h3 className="text-sm font-bold text-slate-800 mb-5 text-left">{t.categoriesTitle}</h3>
//             <div className="space-y-4">
//               {[
//                 { name: isRtl ? 'إلكترونيات' : 'Electronics', p: '80%' },
//                 { name: isRtl ? 'قرطاسية' : 'Stationery', p: '45%' },
//                 { name: isRtl ? 'مواد تنظيف' : 'Cleaning', p: '20%' },
//               ].map((cat, index) => (
//                 <div key={index} className="space-y-1.5 group cursor-pointer">
//                   <div className="flex justify-between text-xs font-bold text-slate-700 transition-colors group-hover:text-blue-600">
//                     <span className="truncate text-left">{cat.name}</span>
//                     <span className="text-slate-500 font-semibold group-hover:text-blue-500 transition-colors">{cat.p}</span>
//                   </div>
//                   <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                     <div
//                       className={`h-full rounded-full transition-all duration-1000 ease-out ${
//                         index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-amber-500' : 'bg-red-500'
//                       }`}
//                       style={{ width: cat.p }}
//                     ></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* تنبيهات المخزون بتأثيرات تمرير */}
//           <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
//             <h3 className="text-sm font-bold text-slate-800 mb-4 text-left">{t.alertsTitle}</h3>
//             <div className="space-y-3 text-xs font-bold">
//               <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-left cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:shadow-rose-500/10 active:scale-95">
//                 {t.alertEmpty}
//               </div>
//               <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 text-left cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:shadow-orange-500/10 active:scale-95">
//                 {t.alertLow}
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

export default function WarehouseDashboard() {
  const { isRtl } = useOutletContext<OutletContextType>();
  const [activeCard, setActiveCard] = useState<string | null>(null);

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
      alertEmpty: 'نفدت كمية "شاشات العرض" ⚠️',
      alertLow: 'مخزون "طابعات الليزر" أقل من الحد الأدنى ⚠️',
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
      alertEmpty: '"Monitors" stock is completely depleted ⚠️',
      alertLow: '"Laser Printers" stock is below minimum ⚠️',
    },
  };

  const t = isRtl ? translations.ar : translations.en;

  const transactionsData = [
    { id: 'TX-5092', item: isRtl ? 'شاشة ديل 24' : 'Dell Monitor 24', qty: '50', type: 'in' },
    { id: 'TX-5093', item: isRtl ? 'لوحة مفاتيح' : 'Keyboard', qty: '120', type: 'in' },
    { id: 'TX-5094', item: isRtl ? 'فأرة لاسلكية' : 'Wireless Mouse', qty: '15', type: 'out' },
  ];

  const handleCardPress = (cardId: string) => {
    setActiveCard(cardId);
    setTimeout(() => setActiveCard(null), 150);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-slate-50/50">
      {/* بطاقات الإحصائيات مع تأثيرات التمرير والضغط */}
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
            <span className="text-3xl font-black tracking-tight">1,245</span>
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
            <span className="text-3xl font-black tracking-tight">12</span>
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
            <span className="text-3xl font-black tracking-tight">45</span>
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
            <span className="text-3xl font-black tracking-tight">38</span>
            <span className="text-[11px] font-medium opacity-80">{t.unitTx}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* جدول الحركات */}
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
                  {transactionsData.map((tx) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* أزرار الإجراءات السريعة مع تأثيرات متقدمة */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
            <h3 className="text-sm font-bold text-slate-800 mb-4">{t.quickActionsTitle}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-blue-100 bg-blue-50/30 text-blue-600 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 hover:bg-blue-50 active:scale-95">
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">➕</span>
                <span className="text-xs font-bold">{t.actionAddItem}</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 text-emerald-600 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20 hover:bg-emerald-50 active:scale-95">
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">🚚</span>
                <span className="text-xs font-bold">{t.actionReceive}</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-purple-100 bg-purple-50/30 text-purple-600 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 hover:bg-purple-50 active:scale-95">
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">📦</span>
                <span className="text-xs font-bold">{t.actionTransfer}</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-700 group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-500/10 hover:bg-slate-50 active:scale-95">
                <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">📋</span>
                <span className="text-xs font-bold">{t.actionAudit}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* حالة الأقسام الرئيسية */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
            <h3 className="text-sm font-bold text-slate-800 mb-5 text-left">{t.categoriesTitle}</h3>
            <div className="space-y-4">
              {[
                { name: isRtl ? 'إلكترونيات' : 'Electronics', p: '80%' },
                { name: isRtl ? 'قرطاسية' : 'Stationery', p: '45%' },
                { name: isRtl ? 'مواد تنظيف' : 'Cleaning', p: '20%' },
              ].map((cat, index) => (
                <div key={index} className="space-y-1.5 group cursor-pointer">
                  <div className="flex justify-between text-xs font-bold text-slate-700 transition-colors group-hover:text-blue-600">
                    <span className="truncate text-left">{cat.name}</span>
                    <span className="text-slate-500 font-semibold group-hover:text-blue-500 transition-colors">{cat.p}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: cat.p }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* تنبيهات المخزون بتأثيرات تمرير */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-shadow hover:shadow-md duration-300">
            <h3 className="text-sm font-bold text-slate-800 mb-4 text-left">{t.alertsTitle}</h3>
            <div className="space-y-3 text-xs font-bold">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-left cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:shadow-rose-500/10 active:scale-95">
                {t.alertEmpty}
              </div>
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 text-left cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:shadow-orange-500/10 active:scale-95">
                {t.alertLow}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}