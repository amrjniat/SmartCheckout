import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { 
  Search, Filter, Plus, Upload, Download, Printer, 
  Users, UserCheck, UserMinus, Package, DollarSign, 
  Eye, Edit, Phone, Trash, Star, X,
  ChevronLeft, ChevronRight, Home, Building2, Mail, MapPin
} from 'lucide-react';

// ================= Layout Context =================
interface DashboardContext {
  isRtl: boolean;
}

type UserRole = 'manager' | 'storekeeper';

// --- Types & Interfaces ---
interface Supplier {
  id: string;
  image: string;
  name: { ar: string; en: string };
  company: { ar: string; en: string };
  phone: string;
  email: string;
  city: { ar: string; en: string };
  productsCount: number;
  lastSupplyDate: string;
  status: 'active' | 'inactive' | 'suspended';
  rating: number;
}

// --- Translation Dictionary ---
const translations = {
  ar: {
    pageTitle: "إدارة الموردين",
    pageDesc: "إدارة جميع الموردين وتتبع عمليات التوريد لنظام SmartCheckout.",
    totalSuppliers: "إجمالي الموردين",
    activeSuppliers: "الموردون النشطون",
    inactiveSuppliers: "غير النشطين",
    monthlySupplies: "توريدات الشهر",
    purchasesValue: "قيمة المشتريات",
    searchPlaceholder: "ابحث بالاسم، الشركة، الجوال...",
    filters: "فلاتر",
    addSupplier: "إضافة مورد",
    tableSupplier: "المورد",
    tableCompany: "الشركة",
    tableContact: "التواصل",
    tableProducts: "المنتجات",
    tableLastSupply: "آخر توريد",
    tableRating: "التقييم",
    tableStatus: "الحالة",
    tableActions: "العمليات",
    statusActive: "نشط",
    statusInactive: "غير نشط",
    statusSuspended: "موقوف",
    breadcrumbHome: "الرئيسية",
    breadcrumbCurrent: "الموردون",
    modalTitle: "إضافة مورد جديد",
    modalSubtitle: "أدخل بيانات المورد الجديد للبدء بالتعامل معه",
    fieldNameAr: "الاسم (عربي)",
    fieldNameEn: "الاسم (إنجليزي)",
    fieldCompanyAr: "الشركة (عربي)",
    fieldCompanyEn: "الشركة (إنجليزي)",
    fieldCityAr: "المدينة (عربي)",
    fieldCityEn: "المدينة (إنجليزي)",
    fieldPhone: "رقم الجوال",
    fieldEmail: "البريد الإلكتروني",
    fieldStatus: "الحالة",
    cancel: "إلغاء",
    save: "حفظ المورد",
    requiredNote: "الحقول المميزة بـ * إلزامية",
  },
  en: {
    pageTitle: "Suppliers Management",
    pageDesc: "Manage all suppliers and track supply operations for SmartCheckout.",
    totalSuppliers: "Total Suppliers",
    activeSuppliers: "Active Suppliers",
    inactiveSuppliers: "Inactive Suppliers",
    monthlySupplies: "Monthly Supplies",
    purchasesValue: "Purchases Value",
    searchPlaceholder: "Search by name, company, phone...",
    filters: "Filters",
    addSupplier: "Add Supplier",
    tableSupplier: "Supplier",
    tableCompany: "Company",
    tableContact: "Contact",
    tableProducts: "Products",
    tableLastSupply: "Last Supply",
    tableRating: "Rating",
    tableStatus: "Status",
    tableActions: "Actions",
    statusActive: "Active",
    statusInactive: "Inactive",
    statusSuspended: "Suspended",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Suppliers",
    modalTitle: "Add New Supplier",
    modalSubtitle: "Enter the new supplier's details to get started",
    fieldNameAr: "Name (Arabic)",
    fieldNameEn: "Name (English)",
    fieldCompanyAr: "Company (Arabic)",
    fieldCompanyEn: "Company (English)",
    fieldCityAr: "City (Arabic)",
    fieldCityEn: "City (English)",
    fieldPhone: "Phone Number",
    fieldEmail: "Email",
    fieldStatus: "Status",
    cancel: "Cancel",
    save: "Save Supplier",
    requiredNote: "Fields marked with * are required",
  }
};

// --- Mock Data ---
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    image: 'https://ui-avatars.com/api/?name=Ahmad+Ali&background=random',
    name: { ar: 'أحمد علي', en: 'Ahmad Ali' },
    company: { ar: 'الشركة السورية للتجارة', en: 'Syrian Trading Co.' },
    phone: '0930294602',
    email: 'ahmad@example.com',
    city: { ar: 'دمشق', en: 'Damascus' },
    productsCount: 45,
    lastSupplyDate: '2026-07-15',
    status: 'active',
    rating: 4.5,
  },
  {
    id: '2',
    image: 'https://ui-avatars.com/api/?name=Khaled+Omar&background=random',
    name: { ar: 'خالد عمر', en: 'Khaled Omar' },
    company: { ar: 'مؤسسة التقنية', en: 'Tech Foundation' },
    phone: '0999123456',
    email: 'khaled@tech.com',
    city: { ar: 'حلب', en: 'Aleppo' },
    productsCount: 12,
    lastSupplyDate: '2026-06-20',
    status: 'inactive',
    rating: 3,
  },
];

export default function SuppliersPage() {
  const context = useOutletContext<DashboardContext>();
  const isRtl = context?.isRtl ?? true; 
  const t = isRtl ? translations.ar : translations.en;
  
  const location = useLocation();

  const [activeRole, setActiveRole] = useState<UserRole>(
    location.pathname.startsWith('/warehouse') ? 'storekeeper' : 'manager'
  );

  useEffect(() => {
    setActiveRole(location.pathname.startsWith('/warehouse') ? 'storekeeper' : 'manager');
  }, [location.pathname]);

  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const emptyForm = {
    nameAr: '', nameEn: '', companyAr: '', companyEn: '',
    cityAr: '', cityEn: '', phone: '', email: '',
    status: 'active' as Supplier['status'],
  };
  const [newSupplierForm, setNewSupplierForm] = useState(emptyForm);

  const handleFormChange = (field: keyof typeof emptyForm, value: string) => {
    setNewSupplierForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSupplier = () => {
    if (!newSupplierForm.nameEn.trim() && !newSupplierForm.nameAr.trim()) return;
    if (!newSupplierForm.phone.trim()) return;

    const displayName = newSupplierForm.nameEn.trim() || newSupplierForm.nameAr.trim();
    const newSupplier: Supplier = {
      id: Date.now().toString(),
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
      name: { ar: newSupplierForm.nameAr || newSupplierForm.nameEn, en: newSupplierForm.nameEn || newSupplierForm.nameAr },
      company: { ar: newSupplierForm.companyAr, en: newSupplierForm.companyEn },
      phone: newSupplierForm.phone,
      email: newSupplierForm.email,
      city: { ar: newSupplierForm.cityAr, en: newSupplierForm.cityEn },
      productsCount: 0,
      lastSupplyDate: new Date().toISOString().slice(0, 10),
      status: newSupplierForm.status,
      rating: 0,
    };

    setSuppliers(prev => [newSupplier, ...prev]);
    setNewSupplierForm(emptyForm);
    setIsAddModalOpen(false);
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => 
      supplier.name.ar.includes(searchTerm) || 
      supplier.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.company.ar.includes(searchTerm) ||
      supplier.company.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm)
    );
  }, [searchTerm, suppliers]);

  const StatusBadge = ({ status }: { status: Supplier['status'] }) => {
    const styles = {
      active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      inactive: 'bg-slate-100 text-slate-800 border-slate-200',
      suspended: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    
    const label = status === 'active' ? t.statusActive : status === 'inactive' ? t.statusInactive : t.statusSuspended;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {label}
      </span>
    );
  };

  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill={i < Math.floor(rating) ? "currentColor" : "none"} />
        ))}
      </div>
    );
  };

  // Stats Cards Data with Deep/Dark Colors
  const statsCards = [
    { 
      title: t.totalSuppliers, 
      value: '35', 
      icon: <Users size={28} className="text-white"/>, 
      bg: 'bg-gradient-to-br from-blue-600 to-blue-800', 
      border: 'border-blue-700',
      shadow: 'hover:shadow-blue-600/40',
      textColor: 'text-blue-100'
    },
    { 
      title: t.activeSuppliers, 
      value: '30', 
      icon: <UserCheck size={28} className="text-white"/>, 
      bg: 'bg-gradient-to-br from-emerald-600 to-emerald-800', 
      border: 'border-emerald-700',
      shadow: 'hover:shadow-emerald-600/40',
      textColor: 'text-emerald-100'
    },
    { 
      title: t.inactiveSuppliers, 
      value: '5', 
      icon: <UserMinus size={28} className="text-white"/>, 
      bg: 'bg-gradient-to-br from-slate-700 to-slate-900', 
      border: 'border-slate-800',
      shadow: 'hover:shadow-slate-700/40',
      textColor: 'text-slate-300'
    },
    { 
      title: t.monthlySupplies, 
      value: '124', 
      icon: <Package size={28} className="text-white"/>, 
      bg: 'bg-gradient-to-br from-violet-600 to-violet-800', 
      border: 'border-violet-700',
      shadow: 'hover:shadow-violet-600/40',
      textColor: 'text-violet-100'
    },
    { 
      title: t.purchasesValue, 
      value: '15.8M', 
      icon: <DollarSign size={28} className="text-white"/>, 
      bg: 'bg-gradient-to-br from-amber-500 to-orange-600', 
      border: 'border-amber-600',
      shadow: 'hover:shadow-orange-500/40',
      textColor: 'text-amber-100'
    },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. Header (Global POS-style) */}
      <div className="mb-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-3">
          <span className="flex items-center gap-1.5 hover:text-slate-600 transition-colors cursor-pointer">
            <Home size={13} />
            {t.breadcrumbHome}
          </span>
          {isRtl ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
          <span className="text-blue-600 font-semibold">{t.breadcrumbCurrent}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Users size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800">{t.pageTitle}</h1>
              <p className="text-slate-500 text-sm mt-0.5">{t.pageDesc}</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className={`flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all transform hover:-translate-y-0.5 font-semibold ${activeRole !== 'manager' ? 'hidden' : ''}`}
          >
            <Plus size={20} />
            <span>{t.addSupplier}</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Cards (Deep Colors & Glassmorphism Hover) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div 
            key={index} 
            className={`relative overflow-hidden p-6 rounded-2xl border ${stat.border} ${stat.bg} flex items-center justify-between transition-all duration-300 hover:-translate-y-2 shadow-md hover:shadow-xl ${stat.shadow} cursor-pointer group`}
          >
            {/* Decorative Background Blob (Lighter to contrast with dark background) */}
            <div className={`absolute ${isRtl ? '-left-6' : '-right-6'} -top-6 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl group-hover:opacity-30 transition-opacity duration-500`}></div>
            
            <div className="relative z-10">
              <p className={`text-sm mb-2 font-bold ${stat.textColor}`}>{stat.title}</p>
              <h3 className="text-3xl font-black text-white">{stat.value}</h3>
            </div>
            
            {/* Icon with Glassmorphism Effect */}
            <div className="relative z-10 p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:bg-white/20">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 3 & 4 & 5. Toolbar */}
      <div className="bg-white p-5 rounded-t-2xl border border-slate-200 border-b-0 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="flex gap-3 w-full md:w-1/2">
          {/* Real-time Search */}
          <div className="relative w-full">
            <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-3 text-slate-400`} size={20} />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Filter Button */}
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors font-medium">
            <Filter size={18} />
            <span>{t.filters}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <button className="flex items-center gap-2 p-3 text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors shadow-sm">
            <Printer size={18} />
          </button>
          <button className="flex items-center gap-2 p-3 text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors shadow-sm">
            <Download size={18} />
          </button>
          <button className="flex items-center gap-2 p-3 text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors shadow-sm">
            <Upload size={18} />
          </button>
        </div>
      </div>

      {/* 6. Suppliers Table */}
      <div className="bg-white border border-slate-200 rounded-b-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-5">{t.tableSupplier}</th>
                <th className="p-5">{t.tableCompany}</th>
                <th className="p-5">{t.tableContact}</th>
                <th className="p-5">{t.tableProducts}</th>
                <th className="p-5">{t.tableLastSupply}</th>
                <th className="p-5">{t.tableRating}</th>
                <th className="p-5">{t.tableStatus}</th>
                <th className="p-5">{t.tableActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="p-5 flex items-center gap-4">
                    <img src={supplier.image} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                    <span className="font-bold text-slate-800">{isRtl ? supplier.name.ar : supplier.name.en}</span>
                  </td>
                  <td className="p-5 text-slate-600 font-medium">{isRtl ? supplier.company.ar : supplier.company.en}</td>
                  <td className="p-5 text-slate-600">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-slate-800">{supplier.phone}</span>
                      <span className="text-xs text-slate-400">{supplier.email}</span>
                    </div>
                  </td>
                  <td className="p-5 text-slate-800 font-bold">{supplier.productsCount}</td>
                  <td className="p-5 text-slate-600">{supplier.lastSupplyDate}</td>
                  <td className="p-5"><RatingStars rating={supplier.rating} /></td>
                  <td className="p-5"><StatusBadge status={supplier.status} /></td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelectedSupplier(supplier)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="View"><Eye size={18} /></button>
                      <button className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Edit"><Edit size={18} /></button>
                      <button className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors" title="Call"><Phone size={18} /></button>
                      {activeRole === 'manager' && (
                        <button className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors" title="Delete"><Trash size={18} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-600/20">
                  <Plus size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{t.modalTitle}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{t.modalSubtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">{t.fieldNameAr} *</label>
                  <input
                    type="text"
                    value={newSupplierForm.nameAr}
                    onChange={(e) => handleFormChange('nameAr', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 text-sm"
                    placeholder="أحمد علي"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">{t.fieldNameEn}</label>
                  <input
                    type="text"
                    value={newSupplierForm.nameEn}
                    onChange={(e) => handleFormChange('nameEn', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 text-sm"
                    placeholder="Ahmad Ali"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <Building2 size={13} /> {t.fieldCompanyAr}
                  </label>
                  <input
                    type="text"
                    value={newSupplierForm.companyAr}
                    onChange={(e) => handleFormChange('companyAr', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <Building2 size={13} /> {t.fieldCompanyEn}
                  </label>
                  <input
                    type="text"
                    value={newSupplierForm.companyEn}
                    onChange={(e) => handleFormChange('companyEn', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <Phone size={13} /> {t.fieldPhone} *
                  </label>
                  <input
                    type="tel"
                    value={newSupplierForm.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 text-sm"
                    placeholder="09xxxxxxxx"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <Mail size={13} /> {t.fieldEmail}
                  </label>
                  <input
                    type="email"
                    value={newSupplierForm.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 text-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <MapPin size={13} /> {t.fieldCityAr}
                  </label>
                  <input
                    type="text"
                    value={newSupplierForm.cityAr}
                    onChange={(e) => handleFormChange('cityAr', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <MapPin size={13} /> {t.fieldCityEn}
                  </label>
                  <input
                    type="text"
                    value={newSupplierForm.cityEn}
                    onChange={(e) => handleFormChange('cityEn', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">{t.fieldStatus}</label>
                <div className="flex gap-2">
                  {(['active', 'inactive', 'suspended'] as Supplier['status'][]).map((s) => {
                    const label = s === 'active' ? t.statusActive : s === 'inactive' ? t.statusInactive : t.statusSuspended;
                    const isSelected = newSupplierForm.status === s;
                    const colors = {
                      active: 'bg-emerald-600 border-emerald-600',
                      inactive: 'bg-slate-600 border-slate-600',
                      suspended: 'bg-orange-500 border-orange-500',
                    };
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleFormChange('status', s)}
                        className={`flex-1 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                          isSelected
                            ? `${colors[s]} text-white shadow-sm`
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-slate-400">{t.requiredNote}</p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => { setIsAddModalOpen(false); setNewSupplierForm(emptyForm); }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-100 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleAddSupplier}
                disabled={!newSupplierForm.nameAr.trim() && !newSupplierForm.nameEn.trim() || !newSupplierForm.phone.trim()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-2"
              >
                <Plus size={18} />
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}