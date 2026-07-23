

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