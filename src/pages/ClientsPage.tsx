
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Users, UserPlus, Activity, DollarSign, Search, Plus, 
  Download, Filter, ShoppingCart, 
  Eye, Edit, X, Phone, Mail, Loader2, AlertTriangle
} from 'lucide-react';
import {
  fetchCustomers,
  fetchCustomerStats,
  createCustomer,
} from '../services/customerService';
import type { Customer, CustomerStats } from '../services/customerService';
type LayoutContext = { isRtl: boolean; setIsRtl: (value: boolean) => void };

// ================= Translations =================
const translations = {
  ar: {
    title: 'إدارة العملاء',
    subtitle: 'نظرة شاملة على بيانات وعمليات عملائك',
    totalCustomers: 'إجمالي العملاء',
    newCustomers: 'عملاء جدد',
    activeCustomers: 'نشطون',
    totalSales: 'إجمالي المبيعات',
    searchPlaceholder: 'ابحث بالاسم، الهاتف، أو رقم العميل...',
    filter: 'فلترة',
    export: 'تصدير',
    newCustomerBtn: 'عميل جديد',
    tableCustomer: 'العميل',
    tableContact: 'معلومات الاتصال',
    tablePurchases: 'المشتريات / الفواتير',
    tableBalance: 'الرصيد المستحق',
    tableStatus: 'الحالة',
    tableActions: 'إجراءات',
    currency: 'ر.س',
    invoices: 'فواتير',
    addCustomerTitle: 'إضافة عميل جديد',
    name: 'الاسم',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    save: 'حفظ العميل',
    saving: 'جارٍ الحفظ...',
    cancel: 'إلغاء',
    active: 'نشط',
    new: 'جديد',
    inactive: 'غير نشط',
    debtor: 'مدين',
    vip: 'مميز',
    company: 'شركة',
    regular: 'عادي',
    loading: 'جارٍ تحميل بيانات العملاء...',
    errorLoad: 'حدث خطأ أثناء تحميل العملاء. حاول مرة أخرى.',
    retry: 'إعادة المحاولة',
    noResults: 'لا يوجد عملاء مطابقين',
    errorAdd: 'حدث خطأ أثناء إضافة العميل',
  },
  en: {
    title: 'Customers Management',
    subtitle: 'Comprehensive overview of your customers data and operations',
    totalCustomers: 'Total Customers',
    newCustomers: 'New Customers',
    activeCustomers: 'Active',
    totalSales: 'Total Sales',
    searchPlaceholder: 'Search by name, phone, or ID...',
    filter: 'Filter',
    export: 'Export',
    newCustomerBtn: 'New Customer',
    tableCustomer: 'Customer',
    tableContact: 'Contact Info',
    tablePurchases: 'Purchases / Invoices',
    tableBalance: 'Due Balance',
    tableStatus: 'Status',
    tableActions: 'Actions',
    currency: 'SAR',
    invoices: 'Invoices',
    addCustomerTitle: 'Add New Customer',
    name: 'Name',
    phone: 'Phone Number',
    email: 'Email Address',
    save: 'Save Customer',
    saving: 'Saving...',
    cancel: 'Cancel',
    active: 'Active',
    new: 'New',
    inactive: 'Inactive',
    debtor: 'Debtor',
    vip: 'VIP',
    company: 'Company',
    regular: 'Regular',
    loading: 'Loading customers...',
    errorLoad: 'Failed to load customers. Please try again.',
    retry: 'Retry',
    noResults: 'No matching customers found',
    errorAdd: 'Failed to add customer',
  }
};

// ================= Main Component =================
export default function CustomersPage() {
  const { isRtl } = useOutletContext<LayoutContext>();
  const lang: 'ar' | 'en' = isRtl ? 'ar' : 'en';
  const t = translations[lang];
  const isRTL = isRtl;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({ name: '', phone: '', email: '' });

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // ================= جلب العملاء من الباك إند =================
  const loadCustomers = useCallback(async (search: string) => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const { customers: data } = await fetchCustomers({ search: search || undefined, pageSize: 50 });
      setCustomers(data);
    } catch (err) {
      console.error('❌ فشل تحميل العملاء:', err);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ================= جلب الإحصائيات =================
  const loadStats = useCallback(async () => {
    try {
      const data = await fetchCustomerStats();
      setStats(data);
    } catch (err) {
      console.error('❌ فشل تحميل إحصائيات العملاء:', err);
      // لا نوقف الصفحة بسبب فشل الإحصائيات فقط، نسيبها فاضية (0)
    }
  }, []);

  // تحميل أولي
  useEffect(() => {
    loadCustomers('');
    loadStats();
  }, [loadCustomers, loadStats]);

  // ================= Debounce للبحث (300ms) =================
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadCustomers(searchTerm);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'n') { e.preventDefault(); setIsAddModalOpen(true); }
      if (e.ctrlKey && e.key === 'f') { e.preventDefault(); document.getElementById('searchInput')?.focus(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ================= إضافة عميل =================
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.name) return;

    setIsSaving(true);
    setAddError(null);
    try {
      await createCustomer({
        customerName: newCustomerForm.name,
        mobile: newCustomerForm.phone || undefined,
        email: newCustomerForm.email || undefined,
      });
      setIsAddModalOpen(false);
      setNewCustomerForm({ name: '', phone: '', email: '' });
      // إعادة تحميل القائمة والإحصائيات عشان العميل الجديد يظهر فورًا
      await loadCustomers(searchTerm);
      await loadStats();
    } catch (err: any) {
      console.error('❌ فشل إضافة العميل:', err);
      setAddError(err?.response?.data?.message || t.errorAdd);
    } finally {
      setIsSaving(false);
    }
  };

  const getAvatarGradient = (type: string) => {
    switch(type) {
      case 'VIP': return 'from-amber-400 to-orange-500';
      case 'Company': return 'from-indigo-500 to-purple-600';
      case 'Regular': return 'from-blue-500 to-indigo-600';
      default: return 'from-slate-400 to-slate-600';
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800 text-start" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ====== HEADER ====== */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">{t.title}</h1>
        <p className="text-slate-500">{t.subtitle}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid w-full grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard 
          title={t.totalCustomers} 
          value={(stats?.totalCustomers ?? 0).toString()} 
          icon={<Users size={17} />} 
          theme="blue"
        />
        <StatCard 
          title={t.newCustomers} 
          value={(stats?.newCustomers ?? 0).toString()} 
          icon={<UserPlus size={17} />} 
          theme="amber"
        />
        <StatCard 
          title={t.activeCustomers} 
          value={(stats?.activeCustomers ?? 0).toString()} 
          icon={<Activity size={17} />} 
          theme="emerald"
        />
        <StatCard 
          title={t.totalSales} 
          value={(stats?.totalSales ?? 0).toLocaleString()} 
          currency={t.currency} 
          icon={<DollarSign size={17} />} 
          theme="indigo"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 border border-slate-200 gap-4">
        <div className="relative w-full lg:w-1/3">
          <Search className={`absolute top-3 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} size={20} />
          <input 
            id="searchInput"
            type="text" 
            placeholder={t.searchPlaceholder} 
            className={`w-full py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${isRTL ? 'pl-4 pr-12' : 'pr-4 pl-12'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium">
            <Filter size={18} /> {t.filter}
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium">
            <Download size={18} /> {t.export}
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 ease-in-out"
          >
            <Plus size={20} /> {t.newCustomerBtn}
          </button>
        </div>
      </div>

      {/* Table / Loading / Error */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
            <Loader2 className="animate-spin" size={32} />
            <span className="font-medium">{t.loading}</span>
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
            <AlertTriangle className="text-rose-500" size={32} />
            <span className="font-medium">{t.errorLoad}</span>
            <button
              onClick={() => loadCustomers(searchTerm)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {t.retry}
            </button>
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
            <Users size={32} />
            <span className="font-medium">{t.noResults}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                <tr>
                  <th className="p-4 font-semibold">{t.tableCustomer}</th>
                  <th className="p-4 font-semibold">{t.tableContact}</th>
                  <th className="p-4 font-semibold">{t.tablePurchases}</th>
                  <th className="p-4 font-semibold">{t.tableBalance}</th>
                  <th className="p-4 font-semibold">{t.tableStatus}</th>
                  <th className="p-4 font-semibold text-center">{t.tableActions}</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer"
                    onClick={() => { setSelectedCustomer(customer); setIsSidePanelOpen(true); }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(customer.type)} flex items-center justify-center font-bold text-white shadow-sm`}>
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 flex items-center gap-2 flex-wrap">
                            {customer.name}
                            {customer.type === 'VIP' && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{t.vip}</span>}
                            {customer.type === 'Company' && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">{t.company}</span>}
                            {customer.type === 'Regular' && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">{t.regular}</span>}
                            {customer.isDebtor && <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">{t.debtor}</span>}
                          </div>
                          <div className="text-xs text-slate-500">{customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-700" dir="ltr">{customer.phone || '—'}</div>
                      <div className="text-xs text-slate-500">{customer.email || '—'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-slate-800">{customer.totalPurchases.toLocaleString()} {t.currency}</div>
                      <div className="text-xs text-slate-500">{customer.invoicesCount} {t.invoices}</div>
                    </td>
                    <td className="p-4">
                      {customer.balance > 0 ? (
                        <span className="text-sm font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                          {customer.balance.toLocaleString()} {t.currency}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400 font-medium">0 {t.currency}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={customer.status} t={t} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <button className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><ShoppingCart size={18} /></button>
                        <button className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"><Eye size={18} /></button>
                        <button className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"><Edit size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">{t.addCustomerTitle}</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white rounded-full p-1.5 shadow-sm border border-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-6 space-y-5">
              {addError && (
                <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-3">
                  {addError}
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.name}</label>
                <input type="text" required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={newCustomerForm.name} onChange={e => setNewCustomerForm({...newCustomerForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.phone}</label>
                <input type="tel" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={newCustomerForm.phone} onChange={e => setNewCustomerForm({...newCustomerForm, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.email}</label>
                <input type="email" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={newCustomerForm.email} onChange={e => setNewCustomerForm({...newCustomerForm, email: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={isSaving} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all flex items-center justify-center gap-2">
                  {isSaving && <Loader2 className="animate-spin" size={18} />}
                  {isSaving ? t.saving : t.save}
                </button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all">{t.cancel}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Side Panel */}
      {isSidePanelOpen && selectedCustomer && (
        <>
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" onClick={() => setIsSidePanelOpen(false)} />
          <div className={`fixed top-0 ${isRTL ? 'left-0 border-r' : 'right-0 border-l'} h-full w-full md:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-slate-200 overflow-y-auto`}>
            <div className="p-8 border-b border-slate-100 bg-slate-800 relative text-white">
              <button onClick={() => setIsSidePanelOpen(false)} className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} p-2 text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-full transition-colors`}>
                <X size={20} />
              </button>
              <div className="flex flex-col items-center mt-6">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getAvatarGradient(selectedCustomer.type)} text-white flex items-center justify-center text-4xl font-extrabold mb-4 shadow-lg border-4 border-slate-700`}>
                   {selectedCustomer.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold mb-2">{selectedCustomer.name}</h2>
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedCustomer.status} t={t} />
                  {selectedCustomer.isDebtor && (
                    <span className="bg-rose-500/10 text-rose-300 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-bold w-fit">{t.debtor}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="mb-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b pb-3">{t.tableContact}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-700 font-medium"><Phone size={18} className="text-blue-500"/> <span dir="ltr">{selectedCustomer.phone || '—'}</span></div>
                  <div className="flex items-center gap-4 text-slate-700 font-medium"><Mail size={18} className="text-blue-500"/> {selectedCustomer.email || '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ================= Sub Components =================

const StatCard = ({ title, value, icon, currency = '', theme }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  const themes: Record<string, { bg: string; shadow: string }> = {
    blue:    { bg: 'bg-gradient-to-br from-blue-500 to-blue-600',     shadow: 'rgba(59, 130, 246, 0.35)' },
    amber:   { bg: 'bg-gradient-to-br from-orange-500 to-amber-600', shadow: 'rgba(249, 115, 22, 0.35)' },
    emerald: { bg: 'bg-gradient-to-br from-emerald-500 to-teal-600', shadow: 'rgba(34, 197, 94, 0.35)' },
    indigo:  { bg: 'bg-gradient-to-br from-purple-500 to-indigo-600', shadow: 'rgba(168, 85, 247, 0.35)' },
  };
  const th = themes[theme] || themes.blue;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative ${th.bg} text-white p-2.5 rounded-xl flex min-h-[125px] flex-col items-center justify-center text-center cursor-pointer select-none overflow-hidden`}
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? `0 18px 28px -12px ${th.shadow}, 0 6px 12px -4px rgba(0,0,0,0.14)`
          : '0 3px 5px -1px rgba(0,0,0,0.08), 0 2px 3px -1px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease',
      }}
    >
      <div
        className="w-6 h-6 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center mb-1.5 text-base"
        style={{
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-xs font-bold mb-0.5 opacity-80">{title}</h3>
        <p className="text-base font-black leading-tight">{value} <span className="text-[11px] font-medium opacity-60">{currency}</span></p>
      </div>
    </div>
  );
};

const StatusBadge = ({ status, t }: { status: string, t: any }) => {
  switch(status) {
    case 'Active': return <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> {t.active}</span>;
    case 'New': return <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> {t.new}</span>;
    case 'Inactive': return <span className="bg-rose-500/10 text-rose-600 border border-rose-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> {t.inactive}</span>;
    default: return null;
  }
};