
import { useState, useRef } from 'react';
import PoswaveLogo from '../components/layout/PoswaveLogo';

export default function WarehouseDashboard() {
  const [isRtl, setIsRtl] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  
  const navRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const translations = {
    ar: {
      langBtn: 'English',
      userTitle: 'أمين المستودع',
      userName: 'محمد الخالد',
      branchName: 'المستودع الرئيسي',
      avatarChar: 'م',
      headerTitle: 'لوحة تحكم المستودعات واللوجستيات', 
      headerSubtitle: 'مراقبة المخزون، الحركات المستودعية، وإدارة سلاسل الإمداد',
      
      cardTotalItems: 'إجمالي المواد', cardLowStock: 'مواد منخفضة', cardInbound: 'حركات الإدخال', cardOutbound: 'حركات الإخراج',
      unitItem: 'مادة', unitTx: 'حركة',

      tableTitle: 'آخر الحركات المستودعية', thID: 'رقم الحركة', thItem: 'المادة', thType: 'النوع', thQty: 'الكمية', thStatus: 'الحالة',
      statusIn: 'إدخال', statusOut: 'إخراج',

      categoriesTitle: 'حالة الأقسام الرئيسية',

      quickActionsTitle: 'إجراءات المستودع', actionAddItem: 'إضافة مادة', actionReceive: 'استلام بضاعة', actionTransfer: 'نقل مخزون', actionAudit: 'جرد سريع',

      alertsTitle: 'تنبيهات المخزون', alertEmpty: 'نفدت كمية "شاشات العرض" ⚠️', alertLow: 'مخزون "طابعات الليزر" أقل من الحد الأدنى ⚠️',
    },
    en: {
      langBtn: 'العربية', userTitle: 'Warehouse Keeper', userName: 'Mohamed Alkhalid', branchName: 'Main Warehouse', avatarChar: 'M',
      headerTitle: 'Stores & Logistics Dashboard', headerSubtitle: 'Inventory monitoring, stock movements, and supply chain management',
      
      cardTotalItems: 'Total Items', cardLowStock: 'Low Stock', cardInbound: 'Inbound Tx', cardOutbound: 'Outbound Tx',
      unitItem: 'Items', unitTx: 'Tx',

      tableTitle: 'Latest Inventory Movements', thID: 'Tx ID', thItem: 'Item', thType: 'Type', thQty: 'Qty', thStatus: 'Status',
      statusIn: 'In', statusOut: 'Out',

      categoriesTitle: 'Main Categories Status',

      quickActionsTitle: 'Warehouse Actions', actionAddItem: 'Add Item', actionReceive: 'Receive Goods', actionTransfer: 'Transfer Stock', actionAudit: 'Quick Audit',

      alertsTitle: 'Inventory Alerts', alertEmpty: '"Monitors" stock is completely depleted ⚠️', alertLow: '"Laser Printers" stock is below minimum ⚠️',
    }
  };

  const t = isRtl ? translations.ar : translations.en;

  const menuItems = [
    { id: 'dash', text: isRtl ? 'الرئيسية' : 'Dashboard', active: true },
    { id: 'items', text: isRtl ? 'إدارة المواد' : 'Items', active: false },
    { id: 'movements', text: isRtl ? 'الحركات' : 'Movements', active: false },
    { id: 'inventory', text: isRtl ? 'الجرد واللوجستيات' : 'Logistics', active: false },
    { id: 'suppliers', text: isRtl ? 'الموردين' : 'Suppliers', active: false },
  ];

  const transactionsData = [
    { id: 'TX-5092', item: isRtl ? 'شاشة ديل 24' : 'Dell Monitor 24', qty: '50', type: 'in' },
    { id: 'TX-5093', item: isRtl ? 'لوحة مفاتيح' : 'Keyboard', qty: '120', type: 'in' },
    { id: 'TX-5094', item: isRtl ? 'فأرة لاسلكية' : 'Wireless Mouse', qty: '15', type: 'out' },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    setIsMouseDown(true);
    startX.current = e.pageX - navRef.current.offsetLeft;
    scrollLeft.current = navRef.current.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => setIsMouseDown(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !navRef.current) return;
    e.preventDefault(); 
    const x = e.pageX - navRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; 
    navRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleCardPress = (cardId: string) => {
    setActiveCard(cardId);
    setTimeout(() => setActiveCard(null), 150);
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-slate-50 font-sans relative" dir={isRtl ? 'rtl' : 'ltr'}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.01); border-radius: 100px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.25); border-radius: 100px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.6); }
        
        /* تأثير رفع البطاقة للأعلى */
        .card-hover {
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(0);
        }
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.25);
        }
        .card-hover:active, .card-hover.active {
          transform: translateY(-2px);
        }
        
        /* تأثير جميع العناصر القابلة للنقر */
        .interactive {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .interactive:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
        }
        .interactive:active {
          transform: translateY(-1px);
        }
        
        /* تأثير الصفوف */
        .row-hover {
          transition: all 0.25s ease;
        }
        .row-hover:hover {
          background: rgba(59, 130, 246, 0.06);
          transform: translateY(-2px);
        }
        
        /* تأثير التنبيهات */
        .alert-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .alert-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
        }
        
        /* تأثير شريط التقدم */
        .progress-animate {
          transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* تأثير الأيقونات */
        .icon-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .icon-hover:hover {
          transform: translateY(-6px) scale(1.1);
        }
        
        /* تأثير البطاقات الداخلية */
        .inner-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .inner-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px -6px rgba(0, 0, 0, 0.12);
        }
      `}</style>

      {/* الهيدر الرئيسي مع الشعار الجديد للمخازن واللوجستيات */}
      <header className="w-full bg-[#0a1931] text-white shadow-md z-30 px-4 flex-shrink-0 select-none">
        <div className="flex items-center justify-between h-20 w-full gap-2">
          
          {/* قسم الشعار مطابق تماماً لصورة POSWAVE STORES & LOGISTICS */}
          <div className="flex items-center gap-3.5 flex-shrink-0 group cursor-pointer">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 lg:hidden transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            
            <PoswaveLogo iconSize={48} />
          </div>

          {/* شريط العناصر الأصلي والكامل */}
          <div className="hidden lg:flex items-center gap-1 flex-1 max-w-[65%] relative px-6">
            <div ref={navRef} onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeaveOrUp} onMouseUp={handleMouseLeaveOrUp} onMouseMove={handleMouseMove} className={`w-full flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1.5 pt-1 scroll-smooth ${isMouseDown ? 'cursor-grabbing' : 'cursor-grab'}`}>
              {menuItems.map((item) => (
                <button key={item.id} className={`interactive px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${item.active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'}`}>{item.text}</button>
              ))}
            </div>
          </div>

          {/* قسم المستخدم واللغة */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => setIsRtl(!isRtl)} className="interactive text-[11px] font-bold bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg min-w-[65px] text-center">{t.langBtn}</button>
            <div className="flex items-center gap-2 interactive cursor-pointer">
              <div className="hidden md:flex flex-col text-xs font-medium text-left">
                <span className="text-slate-200">{t.userName}</span>
                <span className="text-[10px] text-slate-400 opacity-80">{t.userTitle}</span>
              </div>
              <div className="w-9 h-9 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center font-bold text-sm border border-blue-500/30">{t.avatarChar}</div>
            </div>
          </div>
        </div>
      </header>

      {/* محتوى لوحة التحكم والجداول والإحصائيات */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        <div className="w-full bg-white border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">{t.headerTitle}</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{t.headerSubtitle}</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
          {/* بطاقات الإحصائيات - تأثير رفع للأعلى */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div 
              onClick={() => handleCardPress('totalItems')}
              className={`card-hover relative p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm flex flex-col justify-between h-32 overflow-hidden cursor-pointer ${activeCard === 'totalItems' ? 'active' : ''}`}
            >
              <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                <span className="text-sm font-bold opacity-90">{t.cardTotalItems}</span>
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">📦</div>
              </div>
              <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
                <span className="text-3xl font-black tracking-tight">1,245</span><span className="text-[11px] font-medium opacity-80">{t.unitItem}</span>
              </div>
            </div>

            <div 
              onClick={() => handleCardPress('lowStock')}
              className={`card-hover relative p-5 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-sm flex flex-col justify-between h-32 overflow-hidden cursor-pointer ${activeCard === 'lowStock' ? 'active' : ''}`}
            >
              <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                <span className="text-sm font-bold opacity-90">{t.cardLowStock}</span>
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">⚠️</div>
              </div>
              <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
                <span className="text-3xl font-black tracking-tight">12</span><span className="text-[11px] font-medium opacity-80">{t.unitItem}</span>
              </div>
            </div>

            <div 
              onClick={() => handleCardPress('inbound')}
              className={`card-hover relative p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm flex flex-col justify-between h-32 overflow-hidden cursor-pointer ${activeCard === 'inbound' ? 'active' : ''}`}
            >
              <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                <span className="text-sm font-bold opacity-90">{t.cardInbound}</span>
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">📥</div>
              </div>
              <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
                <span className="text-3xl font-black tracking-tight">45</span><span className="text-[11px] font-medium opacity-80">{t.unitTx}</span>
              </div>
            </div>

            <div 
              onClick={() => handleCardPress('outbound')}
              className={`card-hover relative p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-sm flex flex-col justify-between h-32 overflow-hidden cursor-pointer ${activeCard === 'outbound' ? 'active' : ''}`}
            >
              <div className={`flex items-center justify-between w-full ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                <span className="text-sm font-bold opacity-90">{t.cardOutbound}</span>
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner">📤</div>
              </div>
              <div className={`flex items-baseline gap-1.5 w-full mt-4 ${isRtl ? 'text-right justify-start' : 'text-left justify-end'}`}>
                <span className="text-3xl font-black tracking-tight">38</span><span className="text-[11px] font-medium opacity-80">{t.unitTx}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* جدول الحركات */}
              <div className="inner-card bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
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
                        <tr key={tx.id} className="row-hover cursor-pointer">
                          <td className="py-3.5 font-bold text-blue-600 text-left">{tx.id}</td>
                          <td className="py-3.5 font-bold text-slate-800 text-left">{tx.item}</td>
                          <td className="py-3.5 font-black text-slate-800 text-left">{tx.qty}</td>
                          <td className="py-3.5 text-left">
                            <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border ${tx.type === 'in' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                              {tx.type === 'in' ? t.statusIn : t.statusOut}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* أزرار الإجراءات السريعة */}
              <div className="inner-card bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4">{t.quickActionsTitle}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <button className="icon-hover flex flex-col items-center justify-center p-4 rounded-xl border border-blue-100 bg-blue-50/30 hover:bg-blue-50 text-blue-600 group cursor-pointer">
                    <span className="text-xl mb-1 group-hover:scale-110 transition-transform">➕</span><span className="text-xs font-bold">{t.actionAddItem}</span>
                  </button>
                  <button className="icon-hover flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 text-emerald-600 group cursor-pointer">
                    <span className="text-xl mb-1 group-hover:scale-110 transition-transform">🚚</span><span className="text-xs font-bold">{t.actionReceive}</span>
                  </button>
                  <button className="icon-hover flex flex-col items-center justify-center p-4 rounded-xl border border-purple-100 bg-purple-50/30 hover:bg-purple-50 text-purple-600 group cursor-pointer">
                    <span className="text-xl mb-1 group-hover:scale-110 transition-transform">📦</span><span className="text-xs font-bold">{t.actionTransfer}</span>
                  </button>
                  <button className="icon-hover flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-700 group cursor-pointer">
                    <span className="text-xl mb-1 group-hover:scale-110 transition-transform">📋</span><span className="text-xs font-bold">{t.actionAudit}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* حالة الأقسام الرئيسية */}
              <div className="inner-card bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-5 text-left">{t.categoriesTitle}</h3>
                <div className="space-y-4">
                  {[{name: isRtl?'إلكترونيات':'Electronics', p:'80%'}, {name: isRtl?'قرطاسية':'Stationery', p:'45%'}, {name: isRtl?'مواد تنظيف':'Cleaning', p:'20%'}].map((cat, index) => (
                    <div key={index} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span className="truncate text-left">{cat.name}</span><span className="text-slate-500 font-semibold">{cat.p}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`progress-animate h-full rounded-full ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-amber-500' : 'bg-red-500'}`} 
                          style={{ width: cat.p }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* تنبيهات المخزون */}
              <div className="inner-card bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4 text-left">{t.alertsTitle}</h3>
                <div className="space-y-3 text-xs font-bold">
                  <div className="alert-hover p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-left cursor-pointer">{t.alertEmpty}</div>
                  <div className="alert-hover p-3 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 text-left cursor-pointer">{t.alertLow}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
