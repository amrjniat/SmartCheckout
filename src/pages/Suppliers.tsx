import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Search, Filter, Plus, Upload, Download, Printer, 
  Users, UserCheck, UserMinus, Package, DollarSign, 
  Eye, Edit, Phone, Trash, Star, X, Loader2,
  ChevronLeft, ChevronRight, Home, Building2, Mail, MapPin
} from 'lucide-react';

import { getSuppliers, addSupplier, updateSupplier, deleteSupplier } from '../services/supplierService';
import type { Supplier } from '../services/supplierService';

export interface ExtendedSupplier extends Partial<Supplier> {
  id: string | number;
  nameAr?: string;
  nameEn?: string;
  companyAr?: string;
  companyEn?: string;
  cityAr?: string;
  cityEn?: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive' | 'suspended';
  image?: string;
  productsCount?: number;
  lastSupplyDate?: string;
  rating?: number;
  totalPurchases?: number;
}

interface DashboardContext {
  isRtl: boolean;
}

const translations = {
  ar: {
    pageTitle: "إدارة الموردين",
    pageDesc: "إدارة جميع الموردين وتتبع عمليات التوريد لنظام SmartCheckout.",
    totalSuppliers: "إجمالي الموردين",
    activeSuppliers: "الموردون النشطون",
    inactiveSuppliers: "غير النشطين",
    monthlySupplies: "إجمالي المنتجات",
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
    modalAddTitle: "إضافة مورد جديد",
    modalAddSubtitle: "أدخل بيانات المورد الجديد للبدء بالتعامل معه",
    modalEditTitle: "تعديل بيانات المورد",
    modalEditSubtitle: "قم بتحديث معلومات المورد المحدد وحفظها في قاعدة البيانات",
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
    saving: "جاري الحفظ...",
    requiredNote: "الحقول المميزة بـ * إلزامية",
    noData: "لا يوجد موردون مضافون حالياً.",
    loadingData: "جاري تحميل بيانات الموردين...",
  },
  en: {
    pageTitle: "Suppliers Management",
    pageDesc: "Manage all suppliers and track supply operations for SmartCheckout.",
    totalSuppliers: "Total Suppliers",
    activeSuppliers: "Active Suppliers",
    inactiveSuppliers: "Inactive Suppliers",
    monthlySupplies: "Total Products",
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
    modalAddTitle: "Add New Supplier",
    modalAddSubtitle: "Enter the new supplier's details to get started",
    modalEditTitle: "Edit Supplier Details",
    modalEditSubtitle: "Update the selected supplier's information",
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
    saving: "Saving...",
    requiredNote: "Fields marked with * are required",
    noData: "No suppliers found.",
    loadingData: "Loading suppliers data...",
  }
};

const StatusBadge = ({ status, t }: { status: ExtendedSupplier['status']; t: typeof translations.ar }) => {
  const styles = {
    active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    inactive: 'bg-slate-100 text-slate-800 border-slate-200',
    suspended: 'bg-orange-100 text-orange-800 border-orange-200',
  };
  
  const label = status === 'active' ? t.statusActive : status === 'inactive' ? t.statusInactive : t.statusSuspended;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.inactive}`}>
      {label}
    </span>
  );
};

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex text-amber-400">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={14} fill={i < Math.floor(rating || 0) ? "currentColor" : "none"} />
    ))}
  </div>
);

export default function SuppliersPage() {
  const context = useOutletContext<DashboardContext>();
  const isRtl = context?.isRtl ?? true; 
  const t = isRtl ? translations.ar : translations.en;

  const [suppliers, setSuppliers] = useState<ExtendedSupplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const emptyForm = useMemo(() => ({
    nameAr: '', nameEn: '', companyAr: '', companyEn: '',
    cityAr: '', cityEn: '', phone: '', email: '',
    status: 'active' as ExtendedSupplier['status'],
  }), []);

  const [supplierForm, setSupplierForm] = useState(emptyForm);

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await getSuppliers();
      setSuppliers((data as ExtendedSupplier[]) || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleFormChange = (field: keyof typeof emptyForm, value: string) => {
    setSupplierForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setSupplierForm(emptyForm);
    setEditingId(null);
  };

  const resetAndCloseModal = () => {
    setIsModalOpen(false);
    setSupplierForm(emptyForm);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    setEditingId(null);
    setSupplierForm(emptyForm);
    setActionError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (supplier: ExtendedSupplier) => {
    setModalMode('edit');
    setEditingId(supplier.id); 
    setActionError(null);
    setSupplierForm({
      nameAr: supplier.nameAr || '',
      nameEn: supplier.nameEn || '',
      companyAr: supplier.companyAr || '',
      companyEn: supplier.companyEn || '',
      cityAr: supplier.cityAr || '',
      cityEn: supplier.cityEn || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      status: supplier.status || 'active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierForm.nameEn.trim() && !supplierForm.nameAr.trim()) return;
    if (!supplierForm.phone.trim()) return;

    setActionError(null);
    try {
      setIsSubmitting(true);
      const payload = { ...supplierForm };

      if (modalMode === 'add') {
        await addSupplier(payload);
      } else if (modalMode === 'edit' && editingId !== null) {
        await updateSupplier(editingId, payload);
      }

      await loadSuppliers();

      setIsSubmitting(false);
      resetAndCloseModal();
    } catch (error) {
      console.error(`Error ${modalMode === 'add' ? 'adding' : 'updating'} supplier:`, error);
      setActionError(modalMode === 'add' ? 'تعذر إضافة المورد. تحقق من بيانات الإدخال أو اتصال الخادم.' : 'تعذر تحديث المورد. تحقق من البيانات أو اتصال الخادم.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (supplier: ExtendedSupplier) => {
    const supplierName = supplier.nameAr || supplier.nameEn || 'supplier';
    const confirmDelete = window.confirm(`Delete ${supplierName}?`);

    if (!confirmDelete) return;

    try {
      await deleteSupplier(supplier.id);
      await loadSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
      setActionError('تعذر حذف المورد من قاعدة البيانات. تأكد من أن الباك-إند يدعم الحذف النهائي لهذا المورد.');
    }
  };

  const filteredSuppliers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return suppliers;

    return suppliers.filter(supplier => {
      const phoneStr = supplier.phone ? String(supplier.phone) : '';
      return (
        (supplier.nameAr && supplier.nameAr.includes(term)) ||
        (supplier.nameEn && supplier.nameEn.toLowerCase().includes(term)) ||
        (supplier.companyAr && supplier.companyAr.includes(term)) ||
        (supplier.companyEn && supplier.companyEn.toLowerCase().includes(term)) ||
        phoneStr.includes(term)
      );
    });
  }, [searchTerm, suppliers]); 

  const statsCards = useMemo(() => {
    const total = suppliers.length;
    const active = suppliers.filter(s => s.status === 'active').length;
    const inactive = suppliers.filter(s => s.status === 'inactive').length;
    
    const totalProducts = suppliers.reduce((acc, curr) => acc + (curr.productsCount || 0), 0);
    const totalPurchasesValue = suppliers.reduce((acc, curr) => acc + (curr.totalPurchases || 0), 0);

    return [
      { 
        id: 'total',
        title: t.totalSuppliers, 
        value: total.toString(), 
        icon: <Users size={28} className="text-white"/>, 
        bg: 'bg-gradient-to-br from-blue-600 to-blue-800', 
        border: 'border-blue-700',
        shadow: 'hover:shadow-blue-600/40',
        textColor: 'text-blue-100'
      },
      { 
        id: 'active',
        title: t.activeSuppliers, 
        value: active.toString(), 
        icon: <UserCheck size={28} className="text-white"/>, 
        bg: 'bg-gradient-to-br from-emerald-600 to-emerald-800', 
        border: 'border-emerald-700',
        shadow: 'hover:shadow-emerald-600/40',
        textColor: 'text-emerald-100'
      },
      { 
        id: 'inactive',
        title: t.inactiveSuppliers, 
        value: inactive.toString(), 
        icon: <UserMinus size={28} className="text-white"/>, 
        bg: 'bg-gradient-to-br from-slate-700 to-slate-900', 
        border: 'border-slate-800',
        shadow: 'hover:shadow-slate-700/40',
        textColor: 'text-slate-300'
      },
      { 
        id: 'products',
        title: t.monthlySupplies, 
        value: totalProducts.toString(), 
        icon: <Package size={28} className="text-white"/>, 
        bg: 'bg-gradient-to-br from-violet-600 to-violet-800', 
        border: 'border-violet-700',
        shadow: 'hover:shadow-violet-600/40',
        textColor: 'text-violet-100'
      },
      { 
        id: 'purchases',
        title: t.purchasesValue, 
        value: `$${totalPurchasesValue.toLocaleString()}`, 
        icon: <DollarSign size={28} className="text-white"/>, 
        bg: 'bg-gradient-to-br from-amber-500 to-orange-600', 
        border: 'border-amber-600',
        shadow: 'hover:shadow-orange-500/40',
        textColor: 'text-amber-100'
      },
    ];
  }, [suppliers, t]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header & Breadcrumbs */}
      <div className="mb-8">
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

          {/* زر إضافة مورد معروض دائماً */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all transform hover:-translate-y-0.5 font-semibold"
          >
            <Plus size={20} />
            <span>{t.addSupplier}</span>
          </button>
        </div>
      </div>

      {/* Cards Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {statsCards.map((stat) => (
          <div 
            key={stat.id} 
            className={`relative overflow-hidden p-6 rounded-2xl border ${stat.border} ${stat.bg} flex items-center justify-between transition-all duration-300 hover:-translate-y-2 shadow-md hover:shadow-xl ${stat.shadow} cursor-pointer group`}
          >
            <div className={`absolute ${isRtl ? '-left-6' : '-right-6'} -top-6 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl group-hover:opacity-30 transition-opacity duration-500`}></div>
            
            <div className="relative z-10">
              <p className={`text-sm mb-2 font-bold ${stat.textColor}`}>{stat.title}</p>
              <h3 className="text-3xl font-black text-white">{stat.value}</h3>
            </div>
            
            <div className="relative z-10 p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:bg-white/20">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Actions Bar */}
      <div className="bg-white p-5 rounded-t-2xl border border-slate-200 border-b-0 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="flex gap-3 w-full md:w-1/2">
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
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors font-medium">
            <Filter size={18} />
            <span>{t.filters}</span>
          </button>
        </div>

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

      {/* Table Data */}
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
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={20} className="animate-spin text-blue-600" />
                      <span>{t.loadingData}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    {t.noData}
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="p-5 flex items-center gap-4">
                      {supplier.image ? (
                        <img 
                          src={supplier.image} 
                          alt="Avatar" 
                          className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                          {(supplier.nameAr || supplier.nameEn || 'S').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-bold text-slate-800">
                        {isRtl ? supplier.nameAr || supplier.nameEn : supplier.nameEn || supplier.nameAr}
                      </span>
                    </td>
                    <td className="p-5 text-slate-600 font-medium">
                      {isRtl ? supplier.companyAr || supplier.companyEn : supplier.companyEn || supplier.companyAr}
                    </td>
                    <td className="p-5 text-slate-600">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-800">{supplier.phone}</span>
                        <span className="text-xs text-slate-400">{supplier.email || '-'}</span>
                      </div>
                    </td>
                    <td className="p-5 text-slate-800 font-bold">{supplier.productsCount || 0}</td>
                    <td className="p-5 text-slate-600">{supplier.lastSupplyDate || '-'}</td>
                    <td className="p-5"><RatingStars rating={supplier.rating || 0} /></td>
                    <td className="p-5"><StatusBadge status={supplier.status} t={t} /></td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="View"><Eye size={18} /></button>
                        
                        <button 
                          onClick={() => handleOpenEdit(supplier)} 
                          className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        
                        <button className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors" title="Call"><Phone size={18} /></button>
                        <button
                          type="button"
                          onClick={() => handleDelete(supplier)}
                          className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Supplier */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-600/20">
                  {modalMode === 'add' ? <Plus size={22} className="text-white" /> : <Edit size={22} className="text-white" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    {modalMode === 'add' ? t.modalAddTitle : t.modalEditTitle}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {modalMode === 'add' ? t.modalAddSubtitle : t.modalEditSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {actionError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {actionError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">{t.fieldNameAr} *</label>
                  <input
                    type="text"
                    value={supplierForm.nameAr}
                    onChange={(e) => handleFormChange('nameAr', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 text-sm"
                    placeholder="أحمد علي"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">{t.fieldNameEn}</label>
                  <input
                    type="text"
                    value={supplierForm.nameEn}
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
                    value={supplierForm.companyAr}
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
                    value={supplierForm.companyEn}
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
                    value={supplierForm.phone}
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
                    value={supplierForm.email}
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
                    value={supplierForm.cityAr}
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
                    value={supplierForm.cityEn}
                    onChange={(e) => handleFormChange('cityEn', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">{t.fieldStatus}</label>
                <div className="flex gap-2">
                  {(['active', 'inactive', 'suspended'] as ExtendedSupplier['status'][]).map((s) => {
                    const label = s === 'active' ? t.statusActive : s === 'inactive' ? t.statusInactive : t.statusSuspended;
                    const isSelected = supplierForm.status === s;
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

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (!supplierForm.nameAr.trim() && !supplierForm.nameEn.trim()) || !supplierForm.phone.trim()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{t.saving}</span>
                  </>
                ) : (
                  <>
                    {modalMode === 'add' ? <Plus size={18} /> : <Edit size={18} />}
                    <span>{t.save}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}