import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, UserPlus, Activity, DollarSign, Search, Plus, 
  Download, Printer, Filter, MoreVertical, ShoppingCart, 
  Eye, Edit, Trash2, X, Phone, Mail, MapPin, Calendar, Clock 
} from 'lucide-react';

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
  avatar?: string;
  city: string;
}

// ================= Mock Data =================
const MOCK_CUSTOMERS: Customer[] = [
  { id: 'CUST-001', name: 'أحمد علي', phone: '0991234567', email: 'ahmad@example.com', invoicesCount: 18, totalPurchases: 4250000, balance: 0, lastPurchase: '2026-07-16', status: 'Active', type: 'Regular', city: 'الرياض' },
  { id: 'CUST-002', name: 'شركة الأفق', phone: '0559876543', email: 'info@horizon.com', invoicesCount: 45, totalPurchases: 12500000, balance: 150000, lastPurchase: '2026-07-18', status: 'Active', type: 'Company', city: 'جدة' },
  { id: 'CUST-003', name: 'سارة خالد', phone: '0501122334', email: 'sara@example.com', invoicesCount: 2, totalPurchases: 350000, balance: 0, lastPurchase: '2026-07-17', status: 'New', type: 'VIP', city: 'الدمام' },
  { id: 'CUST-004', name: 'محمود حسن', phone: '0544455666', email: 'mahmoud@example.com', invoicesCount: 0, totalPurchases: 0, balance: 0, lastPurchase: 'N/A', status: 'Inactive', type: 'Regular', city: 'مكة' },
];

// ================= Components =================

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // Keyboard Shortcuts Hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'n') { e.preventDefault(); alert('فتح نافذة إضافة عميل جديد'); }
      if (e.ctrlKey && e.key === 'f') { e.preventDefault(); document.getElementById('searchInput')?.focus(); }
      if (e.ctrlKey && e.key === 'p') { e.preventDefault(); window.print(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Instant Search Logic
  const filteredCustomers = useMemo(() => {
    return MOCK_CUSTOMERS.filter(c => 
      c.name.includes(searchTerm) || 
      c.phone.includes(searchTerm) || 
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const openCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsSidePanelOpen(true);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-right" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة العملاء</h1>
          <p className="text-sm text-slate-500">نظرة شاملة على بيانات وعمليات عملائك</p>
        </div>
        <div className="flex gap-2">
           <span className="text-xs text-slate-400 bg-white px-2 py-1 rounded border">Ctrl+N للإضافة</span>
           <span className="text-xs text-slate-400 bg-white px-2 py-1 rounded border">Ctrl+F للبحث</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="إجمالي العملاء" value="1,250" icon={<Users size={20} />} color="text-blue-600" bg="bg-blue-100" />
        <StatCard title="عملاء جدد (الشهر)" value="45" icon={<UserPlus size={20} />} color="text-amber-600" bg="bg-amber-100" />
        <StatCard title="عملاء نشطون (30 يوم)" value="880" icon={<Activity size={20} />} color="text-emerald-600" bg="bg-emerald-100" />
        <StatCard title="إجمالي المبيعات" value="12,450,000" currency="ر.س" icon={<DollarSign size={20} />} color="text-indigo-600" bg="bg-indigo-100" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6 border border-slate-200">
        <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
          <Search className="absolute right-3 top-2.5 text-slate-400" size={18} />
          <input 
            id="searchInput"
            type="text" 
            placeholder="ابحث بالاسم، الهاتف، أو رقم العميل..." 
            className="w-full pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors">
            <Filter size={16} /> فلترة
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors">
            <Download size={16} /> تصدير
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors">
            <Printer size={16} /> طباعة
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors">
            <Plus size={16} /> عميل جديد
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
            <tr>
              <th className="p-4 font-semibold">العميل</th>
              <th className="p-4 font-semibold">معلومات الاتصال</th>
              <th className="p-4 font-semibold">المشتريات / الفواتير</th>
              <th className="p-4 font-semibold">الرصيد المستحق</th>
              <th className="p-4 font-semibold">الحالة</th>
              <th className="p-4 font-semibold">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr 
                key={customer.id} 
                className="border-b border-slate-100 hover:bg-slate-50 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
                onClick={() => openCustomerDetails(customer)}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 flex items-center gap-2">
                        {customer.name}
                        {customer.type === 'VIP' && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded">⭐ مميز</span>}
                        {customer.type === 'Company' && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 rounded">🏢 شركة</span>}
                      </div>
                      <div className="text-xs text-slate-500">{customer.id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-slate-700">{customer.phone}</div>
                  <div className="text-xs text-slate-500">{customer.city}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-semibold text-slate-800">{customer.totalPurchases.toLocaleString()} ر.س</div>
                  <div className="text-xs text-slate-500">{customer.invoicesCount} فواتير</div>
                </td>
                <td className="p-4">
                  {customer.balance > 0 ? (
                    <span className="text-sm font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100">
                      {customer.balance.toLocaleString()} ر.س
                    </span>
                  ) : (
                    <span className="text-sm text-slate-500">0 ر.س</span>
                  )}
                </td>
                <td className="p-4">
                  <StatusBadge status={customer.status} />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded tooltip" title="بدء بيع">
                      <ShoppingCart size={16} />
                    </button>
                    <button className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded tooltip" title="عرض الفواتير">
                      <Eye size={16} />
                    </button>
                    <button className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded tooltip" title="تعديل">
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side Panel (Drawer) */}
      {isSidePanelOpen && selectedCustomer && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsSidePanelOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-r border-slate-200 overflow-y-auto">
            
            {/* Panel Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50 relative">
              <button onClick={() => setIsSidePanelOpen(false)} className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-700 bg-white rounded-full shadow-sm">
                <X size={18} />
              </button>
              
              <div className="flex flex-col items-center mt-4">
                <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold mb-3 shadow-inner">
                   {selectedCustomer.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">{selectedCustomer.name}</h2>
                <StatusBadge status={selectedCustomer.status} />
                
                <div className="flex gap-2 mt-4 w-full">
                  <button className="flex-1 flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                    <ShoppingCart size={16} /> بيع جديد
                  </button>
                  <button className="flex-1 flex justify-center items-center gap-2 bg-slate-100 text-slate-700 py-2 rounded-md hover:bg-slate-200 transition">
                    <Edit size={16} /> تعديل
                  </button>
                </div>
              </div>
            </div>

            {/* Panel Content (Tabs Simulation) */}
            <div className="p-6">
              {/* Contact Info */}
              <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-3 border-b pb-2">معلومات التواصل</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600"><Phone size={16} className="text-slate-400"/> {selectedCustomer.phone}</div>
                  <div className="flex items-center gap-3 text-sm text-slate-600"><Mail size={16} className="text-slate-400"/> {selectedCustomer.email}</div>
                  <div className="flex items-center gap-3 text-sm text-slate-600"><MapPin size={16} className="text-slate-400"/> {selectedCustomer.city}</div>
                </div>
              </div>

              {/* Quick Stats Overview */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-800 mb-3">نظرة عامة (Overview)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-center">
                    <div className="text-xs text-slate-500 mb-1">إجمالي المشتريات</div>
                    <div className="font-bold text-slate-800">{selectedCustomer.totalPurchases.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-center">
                    <div className="text-xs text-slate-500 mb-1">عدد الفواتير</div>
                    <div className="font-bold text-slate-800">{selectedCustomer.invoicesCount}</div>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-center col-span-2 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs text-slate-500"><Clock size={14}/> آخر شراء</div>
                    <div className="font-bold text-sm text-slate-800">{selectedCustomer.lastPurchase}</div>
                  </div>
                </div>
              </div>

              {/* Tabs Menu Placeholder */}
              <div className="flex border-b border-slate-200 mb-4">
                <button className="pb-2 px-4 border-b-2 border-blue-600 text-blue-600 text-sm font-semibold">الفواتير</button>
                <button className="pb-2 px-4 text-slate-500 hover:text-slate-700 text-sm font-semibold">المدفوعات</button>
                <button className="pb-2 px-4 text-slate-500 hover:text-slate-700 text-sm font-semibold">ملاحظات</button>
              </div>
              
              <div className="text-center text-sm text-slate-400 py-8">
                محتوى التبويب يعرض هنا...
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ================= Sub Components =================

const StatCard = ({ title, value, icon, color, bg, currency = '' }: any) => (
  <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-full ${bg} ${color} flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <h3 className="text-slate-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-slate-800">{value} <span className="text-sm font-normal text-slate-500">{currency}</span></p>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  switch(status) {
    case 'Active': return <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> نشط</span>;
    case 'New': return <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> جديد</span>;
    case 'Inactive': return <span className="bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> غير نشط</span>;
    default: return null;
  }
};