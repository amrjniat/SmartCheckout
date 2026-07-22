import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Users, UserPlus, Activity, DollarSign, Search, Plus, 
  Download, Filter, ShoppingCart, 
  Eye, Edit, X, Phone, Mail, MapPin
} from 'lucide-react';

type LayoutContext = { isRtl: boolean; setIsRtl: (value: boolean) => void };

// ================= Types =================
interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  invoicesCount: number;
  totalPurchases: number;
  balance: number;
  lastPurchase: string;
  status: 'Active' | 'New' | 'Inactive';
  type: 'Regular' | 'VIP' | 'Company';
  city: string;
}

// ================= Dynamic Mock Data =================
const getMockCustomers = (lang: 'ar' | 'en'): Customer[] => [
  { id: 'CUST-001', name: lang === 'ar' ? 'أحمد علي' : 'Ahmad Ali', phone: '0991234567', email: 'ahmad@example.com', invoicesCount: 18, totalPurchases: 4250000, balance: 0, lastPurchase: '2026-07-16', status: 'Active', type: 'Regular', city: lang === 'ar' ? 'الرياض' : 'Riyadh' },
  { id: 'CUST-002', name: lang === 'ar' ? 'شركة الأفق' : 'Horizon Co.', phone: '0559876543', email: 'info@horizon.com', invoicesCount: 45, totalPurchases: 12500000, balance: 150000, lastPurchase: '2026-07-18', status: 'Active', type: 'Company', city: lang === 'ar' ? 'جدة' : 'Jeddah' },
  { id: 'CUST-003', name: lang === 'ar' ? 'سارة خالد' : 'Sara Khalid', phone: '0501122334', email: 'sara@example.com', invoicesCount: 2, totalPurchases: 350000, balance: 0, lastPurchase: '2026-07-17', status: 'New', type: 'VIP', city: lang === 'ar' ? 'الدمام' : 'Dammam' },
  { id: 'CUST-004', name: lang === 'ar' ? 'محمود حسن' : 'Mahmoud Hassan', phone: '0544455666', email: 'mahmoud@example.com', invoicesCount: 0, totalPurchases: 0, balance: 0, lastPurchase: 'N/A', status: 'Inactive', type: 'Regular', city: lang === 'ar' ? 'مكة' : 'Mecca' },
];

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
    cancel: 'إلغاء',
    active: 'نشط',
    new: 'جديد',
    inactive: 'غير نشط',
    vip: 'مميز',
    company: 'شركة',
    regular: 'عادي',
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
    cancel: 'Cancel',
    active: 'Active',
    new: 'New',
    inactive: 'Inactive',
    vip: 'VIP',
    company: 'Company',
    regular: 'Regular',
  }
};

// ================= Main Component =================
export default function CustomersPage() {
  const { isRtl } = useOutletContext<LayoutContext>();
  const lang: 'ar' | 'en' = isRtl ? 'ar' : 'en';
  const t = translations[lang];
  const isRTL = isRtl;

  const [customers, setCustomers] = useState<Customer[]>(getMockCustomers(lang));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({ name: '', phone: '', email: '' });

  useEffect(() => { setCustomers(getMockCustomers(lang)); }, [lang]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'n') { e.preventDefault(); setIsAddModalOpen(true); }
      if (e.ctrlKey && e.key === 'f') { e.preventDefault(); document.getElementById('searchInput')?.focus(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.includes(searchTerm) || 
      c.phone.includes(searchTerm) || 
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, customers]);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.name) return;
    const newCustomer: Customer = {
      id: `CUST-00${customers.length + 1}`,
      name: newCustomerForm.name,
      phone: newCustomerForm.phone,
      email: newCustomerForm.email,
      invoicesCount: 0, totalPurchases: 0, balance: 0,
      lastPurchase: 'N/A', status: 'New', type: 'Regular', city: 'N/A'
    };
    setCustomers([newCustomer, ...customers]);
    setIsAddModalOpen(false);
    setNewCustomerForm({ name: '', phone: '', email: '' });
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

      {/* Stat Cards - DISTINCT COLORS, SQUARE */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title={t.totalCustomers} 
          value={customers.length.toString()} 
          icon={<Users size={28} />} 
          theme="blue"
        />
        <StatCard 
          title={t.newCustomers} 
          value="45" 
          icon={<UserPlus size={28} />} 
          theme="amber"
        />
        <StatCard 
          title={t.activeCustomers} 
          value="880" 
          icon={<Activity size={28} />} 
          theme="emerald"
        />
        <StatCard 
          title={t.totalSales} 
          value="12,450,000" 
          currency={t.currency} 
          icon={<DollarSign size={28} />} 
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
              {filteredCustomers.map((customer) => (
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
                        <div className="font-semibold text-slate-800 flex items-center gap-2">
                          {customer.name}
                          {customer.type === 'VIP' && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{t.vip}</span>}
                          {customer.type === 'Company' && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">{t.company}</span>}
                          {customer.type === 'Regular' && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">{t.regular}</span>}
                        </div>
                        <div className="text-xs text-slate-500">{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-slate-700">{customer.phone}</div>
                    <div className="text-xs text-slate-500">{customer.city}</div>
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
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.name}</label>
                <input type="text" required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={newCustomerForm.name} onChange={e => setNewCustomerForm({...newCustomerForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.phone}</label>
                <input type="tel" required className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={newCustomerForm.phone} onChange={e => setNewCustomerForm({...newCustomerForm, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.email}</label>
                <input type="email" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={newCustomerForm.email} onChange={e => setNewCustomerForm({...newCustomerForm, email: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all">{t.save}</button>
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
                <StatusBadge status={selectedCustomer.status} t={t} />
              </div>
            </div>
            <div className="p-8">
              <div className="mb-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b pb-3">{t.tableContact}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-700 font-medium"><Phone size={18} className="text-blue-500"/> <span dir="ltr">{selectedCustomer.phone}</span></div>
                  <div className="flex items-center gap-4 text-slate-700 font-medium"><Mail size={18} className="text-blue-500"/> {selectedCustomer.email}</div>
                  <div className="flex items-center gap-4 text-slate-700 font-medium"><MapPin size={18} className="text-blue-500"/> {selectedCustomer.city}</div>
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

// DISTINCT GRADIENT Square Stat Cards (hover-lift style matching Dashboard.tsx's HoverCard)
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
      className={`relative ${th.bg} text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer select-none overflow-hidden aspect-square`}
      style={{
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered
          ? `0 24px 40px -12px ${th.shadow}, 0 8px 16px -4px rgba(0,0,0,0.15)`
          : '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.06)',
        transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease',
      }}
    >
      <div
        className="w-14 h-14 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center mb-3"
        style={{
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-xs font-bold mb-1 opacity-80">{title}</h3>
        <p className="text-2xl font-black">{value} <span className="text-xs font-medium opacity-60">{currency}</span></p>
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