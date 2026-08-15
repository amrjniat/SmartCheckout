



import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  type InvoiceStatus,
  type InvoiceListItem,
  type InvoiceDetail,
} from '../services/invoiceService'; // ⚠️ عدّل المسار حسب مكان الملف الفعلي عندك

/* =========================================================
   الأنواع (Types)
   ملاحظة: InvoiceStatus مستورد من invoiceService.ts — 3 قيم فقط
   ("مدفوعة" | "غير مدفوعة" | "ملغاة"). لا يوجد "مرتجعة" ولا
   paymentMethod بالباك إند الحقيقي، فحُذفا من هذا الملف بالكامل.
========================================================= */
type OutletCtx = { isRtl: boolean; setIsRtl: (v: boolean) => void; setPageData: React.Dispatch<React.SetStateAction<any>> };

const PAGE_SIZE = 8;
// pageSize كبير لجلب كل الفواتير دفعة واحدة — تُستخدم كمصدر وحيد للبحث/الفلترة/الترتيب/الإحصائيات
// عبر الفرونت إند بما إن الباك إند ما فيه endpoint للإجماليات ولا بحث نصي عام.
// ⚠️ حل مؤقت مقبول للحجم الحالي من البيانات فقط — يحتاج مراجعة لو كبر عدد الفواتير بشكل كبير مستقبلاً.
const FETCH_ALL_PAGE_SIZE = 1000;

/* =========================================================
   الترجمة
========================================================= */
const translations = {
  ar: {
    pageTitle: 'الفواتير والمبيعات',
    pageSubtitle: 'إدارة جميع الفواتير الصادرة',
    newInvoice: 'فاتورة جديدة',
    exportExcel: 'Excel',
    exportPdf: 'PDF',

    statTotalInvoices: 'إجمالي الفواتير',
    statTotalSales: 'إجمالي المبيعات',
    statUnpaid: 'غير مدفوعة',
    statCancelled: 'ملغاة',

    searchPlaceholder: 'ابحث برقم الفاتورة، العميل أو المستخدم...',
    filterDate: 'التاريخ',
    filterDateAll: 'كل الفترات',
    filterDateToday: 'اليوم',
    filterDateWeek: 'هذا الأسبوع',
    filterDateMonth: 'هذا الشهر',

    filterStatus: 'حالة الفاتورة',
    statusAll: 'الكل',
    statusPaid: 'مدفوعة',
    statusUnpaid: 'غير مدفوعة',
    statusCancelled: 'ملغاة',

    resultsCount: (n: number) => `عرض ${n} فاتورة`,

    thInvoice: 'رقم الفاتورة',
    thDate: 'التاريخ',
    thTime: 'الوقت',
    thCustomer: 'العميل',
    thUser: 'المستخدم',
    thItems: 'عدد الأصناف',
    thTotal: 'الإجمالي',
    thStatus: 'الحالة',
    thActions: 'العمليات',

    actionView: 'عرض',
    actionPrint: 'طباعة',
    actionPdf: 'PDF',
    actionReturn: 'مرتجع',
    actionCancel: 'إلغاء',

    emptyTitle: 'لا توجد فواتير مطابقة للفلاتر الحالية',
    emptySubtitle: 'جرّب تعديل البحث أو إزالة بعض الفلاتر',

    loadingTitle: 'جارِ تحميل الفواتير...',
    errorTitle: 'تعذّر تحميل الفواتير',
    retry: 'إعادة المحاولة',

    pagePrev: 'السابق',
    pageNext: 'التالي',

    modalTitle: 'تفاصيل الفاتورة',
    modalInvoiceNo: 'رقم الفاتورة',
    modalDate: 'التاريخ',
    modalCustomer: 'اسم العميل',
    modalUser: 'اسم المستخدم',
    modalProduct: 'المنتج',
    modalQty: 'الكمية',
    modalPrice: 'السعر',
    modalLineTotal: 'الإجمالي',
    modalSubtotal: 'المجموع الفرعي',
    modalDiscount: 'الخصم',
    modalTax: 'الضريبة',
    modalGrandTotal: 'الإجمالي الكلي',
    modalClose: 'إغلاق',
    modalLoading: 'جارِ تحميل التفاصيل...',

    copyDone: 'تم نسخ رقم الفاتورة',
    toastCancelled: (no: string) => `تم إلغاء الفاتورة ${no}`,
    toastReturned: (no: string) => `تم تسجيل مرتجع للفاتورة ${no}`,
    toastError: 'حدث خطأ، حاول مرة أخرى',

    sortHint: 'اضغط للترتيب',
    currency: 'ل.س',
    unitItem: 'صنف',
  },
  en: {
    pageTitle: 'Sales & Invoices',
    pageSubtitle: 'Manage all issued invoices',
    newInvoice: 'New Invoice',
    exportExcel: 'Excel',
    exportPdf: 'PDF',

    statTotalInvoices: 'Total Invoices',
    statTotalSales: 'Total Sales',
    statUnpaid: 'Unpaid',
    statCancelled: 'Cancelled',

    searchPlaceholder: 'Search by invoice no., customer or user...',
    filterDate: 'Date',
    filterDateAll: 'All time',
    filterDateToday: 'Today',
    filterDateWeek: 'This week',
    filterDateMonth: 'This month',

    filterStatus: 'Invoice Status',
    statusAll: 'All',
    statusPaid: 'Paid',
    statusUnpaid: 'Unpaid',
    statusCancelled: 'Cancelled',

    resultsCount: (n: number) => `Showing ${n} invoices`,

    thInvoice: 'Invoice No.',
    thDate: 'Date',
    thTime: 'Time',
    thCustomer: 'Customer',
    thUser: 'User',
    thItems: 'Items',
    thTotal: 'Total',
    thStatus: 'Status',
    thActions: 'Actions',

    actionView: 'View',
    actionPrint: 'Print',
    actionPdf: 'PDF',
    actionReturn: 'Return',
    actionCancel: 'Cancel',

    emptyTitle: 'No invoices match the current filters',
    emptySubtitle: 'Try adjusting your search or clearing some filters',

    loadingTitle: 'Loading invoices...',
    errorTitle: 'Failed to load invoices',
    retry: 'Retry',

    pagePrev: 'Previous',
    pageNext: 'Next',

    modalTitle: 'Invoice Details',
    modalInvoiceNo: 'Invoice No.',
    modalDate: 'Date',
    modalCustomer: 'Customer Name',
    modalUser: 'User Name',
    modalProduct: 'Product',
    modalQty: 'Qty',
    modalPrice: 'Price',
    modalLineTotal: 'Total',
    modalSubtotal: 'Subtotal',
    modalDiscount: 'Discount',
    modalTax: 'Tax',
    modalGrandTotal: 'Grand Total',
    modalClose: 'Close',
    modalLoading: 'Loading details...',

    copyDone: 'Invoice number copied',
    toastCancelled: (no: string) => `Invoice ${no} cancelled`,
    toastReturned: (no: string) => `Return recorded for invoice ${no}`,
    toastError: 'Something went wrong, please try again',

    sortHint: 'Click to sort',
    currency: 'SYP',
    unitItem: 'items',
  },
};

/* =========================================================
   عناصر مساعدة (Icons)
========================================================= */
const Icon = {
  Search: (p: { className?: string }) => (
    <svg className={p.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
    </svg>
  ),
  Invoice: (p: { className?: string }) => (
    <svg className={p.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Cash: (p: { className?: string }) => (
    <svg className={p.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2m9-8a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Return: (p: { className?: string }) => (
    <svg className={p.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Clock: (p: { className?: string }) => (
    <svg className={p.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Eye: (p: { className?: string }) => (
    <svg className={p.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Print: (p: { className?: string }) => (
    <svg className={p.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a1 1 0 001-1v-4H8v4a1 1 0 001 1zm8-12V5a1 1 0 00-1-1H8a1 1 0 00-1 1v4h10z" />
    </svg>
  ),
  Pdf: (p: { className?: string }) => (
    <svg className={p.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
    </svg>
  ),
  Ban: (p: { className?: string }) => (
    <svg className={p.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 105.636 5.636a9 9 0 0012.728 12.728zM5.636 5.636l12.728 12.728" />
    </svg>
  ),
  Copy: (p: { className?: string }) => (
    <svg className={p.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Close: (p: { className?: string }) => (
    <svg className={p.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Sort: (p: { className?: string }) => (
    <svg className={p.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    </svg>
  ),
  Empty: (p: { className?: string }) => (
    <svg className={p.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-9a9 9 0 100 18 9 9 0 000-18zm0 5v4l2.5 2.5" />
    </svg>
  ),
  Alert: (p: { className?: string }) => (
    <svg className={p.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
};

/* =========================================================
   شارة الحالة
========================================================= */
function StatusBadge({ status, t }: { status: InvoiceStatus; t: typeof translations.ar }) {
  const map: Record<InvoiceStatus, { label: string; cls: string; dot: string }> = {
    'مدفوعة': { label: t.statusPaid, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    'غير مدفوعة': { label: t.statusUnpaid, cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    'ملغاة': { label: t.statusCancelled, cls: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  };
  const s = map[status];
  if (!s) {
    // قيمة غير متوقعة قادمة من الباك إند (بما إنه لا يتحقق من status) — نعرضها كما هي بدون كسر الواجهة
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-slate-50 text-slate-600 border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        {status}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

/* =========================================================
   Toast
========================================================= */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2800);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 inset-x-0 flex justify-center z-[60] px-4 pointer-events-none">
      <div className="bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl shadow-black/20 flex items-center gap-2 animate-[fadeIn_0.2s_ease-out] pointer-events-auto">
        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
        {message}
      </div>
    </div>
  );
}

/* =========================================================
   المكوّن الرئيسي
========================================================= */
export default function Invoices() {
  const ctx = useOutletContext<OutletCtx | null>();
  const isRtl = ctx?.isRtl ?? true;
  const setPageData = ctx?.setPageData;
  const t = isRtl ? translations.ar : translations.en;

  useEffect(() => {
    setPageData?.({ showHeader: true });
  }, [setPageData]);

  // ===== بيانات الفواتير (من الـ API الحقيقي) =====
  const [allInvoices, setAllInvoices] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInvoices({ pageSize: FETCH_ALL_PAGE_SIZE });
      setAllInvoices(res.invoices);
    } catch (err) {
      console.error('❌ خطأ أثناء جلب الفواتير:', err);
      setError(t.errorTitle);
    } finally {
      setLoading(false);
    }
  }, [t.errorTitle]);

  useEffect(() => {
    loadInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== فلاتر وبحث =====
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');

  const [sortKey, setSortKey] = useState<'date' | 'total' | 'customer'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const [page, setPage] = useState(1);

  // ===== نافذة التفاصيل =====
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState<InvoiceDetail | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  // يتتبّع رقم الفاتورة قيد التحديث حالياً (لتعطيل أزرارها أثناء الطلب ومنع نقرات مكررة)
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const today = new Date();
    return allInvoices.filter((inv) => {
      if (q) {
        const hay = [inv.invoiceNumber, inv.customerName, inv.userName ?? '']
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      if (dateFilter !== 'all') {
        const d = new Date(inv.invoiceDate);
        const diffDays = Math.floor((today.getTime() - d.getTime()) / 86400000);
        if (dateFilter === 'today' && diffDays !== 0) return false;
        if (dateFilter === 'week' && diffDays > 7) return false;
        if (dateFilter === 'month' && diffDays > 30) return false;
      }
      return true;
    });
  }, [allInvoices, search, statusFilter, dateFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date') cmp = a.invoiceDate.localeCompare(b.invoiceDate);
      else if (sortKey === 'total') cmp = a.totalAmount - b.totalAmount;
      else cmp = a.customerName.localeCompare(b.customerName);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, dateFilter]);

  // ===== الإحصائيات — تُحسب على كامل الفواتير المجلوبة، بمعزل عن فلاتر البحث/الجدول =====
  const stats = useMemo(() => {
    const totalInvoices = allInvoices.length;
    const totalSales = allInvoices
      .filter((inv) => inv.status === 'مدفوعة')
      .reduce((s, inv) => s + inv.totalAmount, 0);
    const unpaid = allInvoices.filter((inv) => inv.status === 'غير مدفوعة').length;
    const cancelled = allInvoices.filter((inv) => inv.status === 'ملغاة').length;
    return { totalInvoices, totalSales, unpaid, cancelled };
  }, [allInvoices]);

  function toggleSort(key: 'date' | 'total' | 'customer') {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function handleCopy(inv: InvoiceListItem) {
    navigator.clipboard?.writeText(inv.invoiceNumber).catch(() => {});
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  async function handleOpenInvoice(id: number) {
    setSelectedInvoiceId(id);
    setSelectedInvoiceDetail(null);
    setModalLoading(true);
    try {
      const detail = await getInvoiceById(id);
      setSelectedInvoiceDetail(detail);
    } catch (err) {
      console.error(`❌ خطأ أثناء جلب تفاصيل الفاتورة رقم ${id}:`, err);
      setToast(t.toastError);
      setSelectedInvoiceId(null);
    } finally {
      setModalLoading(false);
    }
  }

  // تحديث الحالة محلياً بعد نجاح الطلب — بدون إعادة جلب كامل القائمة من الخادم
  function applyStatusLocally(id: number, status: InvoiceStatus) {
    setAllInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
  }

  async function handleCancel(inv: InvoiceListItem) {
    setUpdatingId(inv.id);
    try {
      await updateInvoiceStatus(inv.id, 'ملغاة');
      applyStatusLocally(inv.id, 'ملغاة');
      setToast(t.toastCancelled(inv.invoiceNumber));
    } catch (err) {
      console.error(`❌ خطأ أثناء إلغاء الفاتورة رقم ${inv.id}:`, err);
      setToast(t.toastError);
    } finally {
      setUpdatingId(null);
    }
  }

  // "مرتجع": لا توجد حالة "مرتجعة" بالباك إند — الإجراء يعيد الفاتورة إلى "غير مدفوعة"
  async function handleReturn(inv: InvoiceListItem) {
    setUpdatingId(inv.id);
    try {
      await updateInvoiceStatus(inv.id, 'غير مدفوعة');
      applyStatusLocally(inv.id, 'غير مدفوعة');
      setToast(t.toastReturned(inv.invoiceNumber));
    } catch (err) {
      console.error(`❌ خطأ أثناء تسجيل مرتجع للفاتورة رقم ${inv.id}:`, err);
      setToast(t.toastError);
    } finally {
      setUpdatingId(null);
    }
  }

  const numberFmt = (n: number) => n.toLocaleString(isRtl ? 'ar-SY' : 'en-US');

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(isRtl ? 'ar-SY' : 'en-US');
  };
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString(isRtl ? 'ar-SY' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const clearFilters = () => {
    setSearch('');
    setDateFilter('all');
    setStatusFilter('all');
  };

  const selectedInvoiceListItem = allInvoices.find((inv) => inv.id === selectedInvoiceId) ?? null;

  return (
    <div className="w-full min-h-full px-4 sm:px-6 py-6 space-y-5 bg-gradient-to-b from-slate-50 via-white to-slate-50/70" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ===== عنوان الصفحة + أزرار العمليات ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">{t.pageTitle}</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{t.pageSubtitle}</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setToast(`${t.exportExcel} ✓`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            <Icon.Invoice className="w-4 h-4" />
            {t.exportExcel}
          </button>
          <button
            onClick={() => setToast(`${t.exportPdf} ✓`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            <Icon.Pdf className="w-4 h-4" />
            {t.exportPdf}
          </button>

          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white text-xs font-bold hover:from-blue-700 hover:to-indigo-900 transition-all duration-300 shadow-md shadow-blue-900/30 hover:-translate-y-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {t.newInvoice}
          </button>
        </div>
      </div>

      {/* ===== بطاقات إحصائية ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Icon.Invoice className="w-5 h-5" />} label={t.statTotalInvoices} value={numberFmt(stats.totalInvoices)} accent="blue" />
        <StatCard
          icon={<Icon.Cash className="w-5 h-5" />}
          label={t.statTotalSales}
          value={`${numberFmt(stats.totalSales)} ${t.currency}`}
          accent="emerald"
        />
        <StatCard icon={<Icon.Clock className="w-5 h-5" />} label={t.statUnpaid} value={numberFmt(stats.unpaid)} accent="amber" />
        <StatCard icon={<Icon.Ban className="w-5 h-5" />} label={t.statCancelled} value={numberFmt(stats.cancelled)} accent="purple" />
      </div>

      {/* ===== البحث + الفلاتر ===== */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative">
          <Icon.Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 ps-10 pe-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <FilterSelect
            value={dateFilter}
            onChange={(v) => setDateFilter(v as typeof dateFilter)}
            options={[
              { value: 'all', label: t.filterDateAll },
              { value: 'today', label: t.filterDateToday },
              { value: 'week', label: t.filterDateWeek },
              { value: 'month', label: t.filterDateMonth },
            ]}
          />
          <FilterSelect
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as typeof statusFilter)}
            options={[
              { value: 'all', label: t.statusAll },
              { value: 'مدفوعة', label: t.statusPaid },
              { value: 'غير مدفوعة', label: t.statusUnpaid },
              { value: 'ملغاة', label: t.statusCancelled },
            ]}
          />

          <div className="ms-auto flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">{t.resultsCount(sorted.length)}</span>
            {(search || dateFilter !== 'all' || statusFilter !== 'all') && (
              <button onClick={clearFilters} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                {isRtl ? 'إزالة الفلاتر' : 'Clear filters'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== حالة الخطأ ===== */}
      {error && !loading && (
        <div className="bg-white border border-rose-100 rounded-2xl p-8 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400">
            <Icon.Alert className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-700">{error}</p>
          <button
            onClick={loadInvoices}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            {t.retry}
          </button>
        </div>
      )}

      {/* ===== حالة التحميل ===== */}
      {loading && (
        <div className="bg-white border border-slate-100 rounded-2xl p-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400">{t.loadingTitle}</p>
        </div>
      )}

      {/* ===== جدول الفواتير ===== */}
      {!loading && !error && (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-gradient-to-l from-slate-50 to-white">
                  <Th>{t.thInvoice}</Th>
                  <ThSortable label={t.thDate} active={sortKey === 'date'} dir={sortDir} onClick={() => toggleSort('date')} />
                  <Th className="hidden md:table-cell">{t.thTime}</Th>
                  <ThSortable label={t.thCustomer} active={sortKey === 'customer'} dir={sortDir} onClick={() => toggleSort('customer')} />
                  <Th className="hidden lg:table-cell">{t.thUser}</Th>
                  <Th className="hidden md:table-cell">{t.thItems}</Th>
                  <ThSortable label={t.thTotal} active={sortKey === 'total'} dir={sortDir} onClick={() => toggleSort('total')} />
                  <Th>{t.thStatus}</Th>
                  <Th className="text-end">{t.thActions}</Th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((inv) => {
                  const isUpdating = updatingId === inv.id;
                  return (
                    <tr key={inv.id} className="border-b border-slate-50 last:border-0 hover:bg-blue-50/30 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handleOpenInvoice(inv.id)} className="font-bold text-blue-600 hover:underline text-xs">
                            {inv.invoiceNumber}
                          </button>
                          <button
                            onClick={() => handleCopy(inv)}
                            className="p-1 rounded-md text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                            title={t.copyDone}
                          >
                            {copiedId === inv.id ? (
                              <span className="text-[10px] font-bold text-emerald-500">✓</span>
                            ) : (
                              <Icon.Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{formatDate(inv.invoiceDate)}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell whitespace-nowrap">{formatTime(inv.invoiceDate)}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium text-xs">{inv.customerName}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">{inv.userName ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">
                        {inv.itemsCount} {t.unitItem}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800 text-xs whitespace-nowrap">
                        {numberFmt(inv.totalAmount)} <span className="text-slate-400 font-medium">{t.currency}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={inv.status} t={t} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <RowAction title={t.actionView} onClick={() => handleOpenInvoice(inv.id)}>
                            <Icon.Eye className="w-4 h-4" />
                          </RowAction>
                          <RowAction title={t.actionPrint} onClick={() => setToast(`${t.actionPrint} ${inv.invoiceNumber} ✓`)}>
                            <Icon.Print className="w-4 h-4" />
                          </RowAction>
                          <RowAction title={t.actionPdf} onClick={() => setToast(`PDF ${inv.invoiceNumber} ✓`)}>
                            <Icon.Pdf className="w-4 h-4" />
                          </RowAction>
                          {inv.status !== 'غير مدفوعة' && inv.status !== 'ملغاة' && (
                            <RowAction title={t.actionReturn} onClick={() => handleReturn(inv)} disabled={isUpdating}>
                              <Icon.Return className="w-4 h-4" />
                            </RowAction>
                          )}
                          {inv.status !== 'ملغاة' && (
                            <RowAction title={t.actionCancel} danger onClick={() => handleCancel(inv)} disabled={isUpdating}>
                              <Icon.Ban className="w-4 h-4" />
                            </RowAction>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pageItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-3">
                <Icon.Empty className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-slate-600">{t.emptyTitle}</p>
              <p className="text-xs text-slate-400 mt-1">{t.emptySubtitle}</p>
            </div>
          )}

          {/* ===== Pagination ===== */}
          {pageItems.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <button
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                {t.pagePrev}
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all duration-200 ${
                      currentPage === i + 1 ? 'bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-sm shadow-blue-900/30' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                {t.pageNext}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===== نافذة تفاصيل الفاتورة ===== */}
      {selectedInvoiceId !== null && (
        <InvoiceModal
          detail={selectedInvoiceDetail}
          fallbackNumber={selectedInvoiceListItem?.invoiceNumber}
          loading={modalLoading}
          onClose={() => {
            setSelectedInvoiceId(null);
            setSelectedInvoiceDetail(null);
          }}
          t={t}
          numberFmt={numberFmt}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

/* =========================================================
   بطاقة إحصائية
========================================================= */
function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: 'blue' | 'emerald' | 'purple' | 'amber';
}) {
  const styles: Record<string, { card: string; iconBox: string; glow: string; blob: string; value: string }> = {
    blue: {
      card: 'from-blue-100 via-blue-50 to-indigo-100 border-blue-200/70',
      iconBox: 'from-blue-700 to-indigo-950 shadow-blue-950/40',
      glow: 'hover:shadow-blue-950/25',
      blob: 'bg-blue-600/15 group-hover:bg-blue-600/25',
      value: 'text-blue-950',
    },
    emerald: {
      card: 'from-emerald-100 via-emerald-50 to-teal-100 border-emerald-200/70',
      iconBox: 'from-emerald-700 to-teal-950 shadow-emerald-950/40',
      glow: 'hover:shadow-emerald-950/25',
      blob: 'bg-emerald-600/15 group-hover:bg-emerald-600/25',
      value: 'text-emerald-950',
    },
    purple: {
      card: 'from-purple-100 via-purple-50 to-fuchsia-100 border-purple-200/70',
      iconBox: 'from-purple-700 to-fuchsia-950 shadow-purple-950/40',
      glow: 'hover:shadow-purple-950/25',
      blob: 'bg-purple-600/15 group-hover:bg-purple-600/25',
      value: 'text-purple-950',
    },
    amber: {
      card: 'from-amber-100 via-amber-50 to-orange-100 border-amber-200/70',
      iconBox: 'from-amber-700 to-orange-950 shadow-amber-950/40',
      glow: 'hover:shadow-amber-950/25',
      blob: 'bg-amber-600/15 group-hover:bg-amber-600/25',
      value: 'text-amber-950',
    },
  };
  const s = styles[accent];
  return (
    <div
      className={`group relative bg-gradient-to-br ${s.card} border rounded-2xl p-5 flex items-center gap-4 overflow-hidden shadow-sm hover:shadow-xl ${s.glow} transition-all duration-300 hover:-translate-y-2 cursor-default`}
    >
      <div className={`absolute -left-7 -top-7 w-28 h-28 rounded-full blur-2xl transition-colors duration-300 ${s.blob}`}></div>
      <div
        className={`relative z-10 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${s.iconBox} text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 [&_svg]:w-6 [&_svg]:h-6`}
      >
        {icon}
      </div>
      <div className="min-w-0 relative z-10">
        <p className="text-[13px] font-bold text-slate-500 truncate">{label}</p>
        <p className={`text-2xl font-black truncate ${s.value}`}>{value}</p>
      </div>
    </div>
  );
}

/* =========================================================
   قائمة فلترة
========================================================= */
function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition-all cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/* =========================================================
   خلايا رأس الجدول
========================================================= */
function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 text-start text-[11px] font-bold text-slate-400 uppercase tracking-wide ${className}`}>{children}</th>
  );
}

function ThSortable({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: 'asc' | 'desc';
  onClick: () => void;
}) {
  return (
    <th className="px-4 py-3 text-start text-[11px] font-bold text-slate-400 uppercase tracking-wide">
      <button onClick={onClick} className={`flex items-center gap-1 hover:text-slate-700 transition-colors ${active ? 'text-blue-600' : ''}`}>
        {label}
        <Icon.Sort className={`w-3 h-3 transition-transform ${active && dir === 'asc' ? 'rotate-180' : ''}`} />
      </button>
    </th>
  );
}

/* =========================================================
   زر إجراء داخل الصف
========================================================= */
function RowAction({
  children,
  title,
  onClick,
  danger,
  disabled,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        danger ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      {children}
    </button>
  );
}

/* =========================================================
   نافذة تفاصيل الفاتورة (Modal)
========================================================= */
function InvoiceModal({
  detail,
  fallbackNumber,
  loading,
  onClose,
  t,
  numberFmt,
  formatDate,
  formatTime,
}: {
  detail: InvoiceDetail | null;
  fallbackNumber?: string;
  loading: boolean;
  onClose: () => void;
  t: typeof translations.ar;
  numberFmt: (n: number) => string;
  formatDate: (iso: string) => string;
  formatTime: (iso: string) => string;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={overlayRef}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]"
    >
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[88vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-black text-slate-800">{t.modalTitle}</h2>
            <p className="text-xs text-slate-400 font-bold mt-0.5">{detail?.invoiceNumber ?? fallbackNumber ?? ''}</p>
          </div>
          <div className="flex items-center gap-2">
            {detail && <StatusBadge status={detail.status} t={t} />}
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <Icon.Close className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading || !detail ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-400">{t.modalLoading}</p>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto px-5 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <InfoField label={t.modalInvoiceNo} value={detail.invoiceNumber} />
                <InfoField label={t.modalDate} value={`${formatDate(detail.invoiceDate)} - ${formatTime(detail.invoiceDate)}`} />
                <InfoField label={t.modalCustomer} value={detail.customer?.customerName ?? '—'} />
                <InfoField label={t.modalUser} value={detail.user?.fullName ?? '—'} />
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-3 py-2 text-start font-bold text-slate-400">{t.modalProduct}</th>
                      <th className="px-3 py-2 text-center font-bold text-slate-400">{t.modalQty}</th>
                      <th className="px-3 py-2 text-end font-bold text-slate-400">{t.modalPrice}</th>
                      <th className="px-3 py-2 text-end font-bold text-slate-400">{t.modalLineTotal}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.invoiceItems.map((it) => (
                      <tr key={it.id} className="border-b border-slate-50 last:border-0">
                        {/* ⚠️ اسم حقل المنتج مفترض (productName) — عدّله لو الاسم الفعلي بموديل Product مختلف */}
                        <td className="px-3 py-2 text-slate-700 font-medium">{it.product?.productName ?? '—'}</td>
                        <td className="px-3 py-2 text-center text-slate-500">{it.quantity}</td>
                        <td className="px-3 py-2 text-end text-slate-500">{numberFmt(it.unitPrice)}</td>
                        <td className="px-3 py-2 text-end font-bold text-slate-700">{numberFmt(it.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>{t.modalSubtotal}</span>
                  <span className="font-bold text-slate-700">
                    {numberFmt(detail.subTotal)} {t.currency}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>{t.modalDiscount}</span>
                  <span className="font-bold text-rose-500">
                    -{numberFmt(detail.discountAmount)} {t.currency}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>{t.modalTax}</span>
                  <span className="font-bold text-slate-700">
                    {numberFmt(detail.taxAmount)} {t.currency}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 text-sm">
                  <span className="font-black text-slate-800">{t.modalGrandTotal}</span>
                  <span className="font-black text-blue-600">
                    {numberFmt(detail.totalAmount)} {t.currency}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-slate-100 flex items-center gap-2.5">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                {t.modalClose}
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5">
                <Icon.Print className="w-4 h-4" />
                {t.actionPrint}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl px-3 py-2">
      <p className="text-[10px] font-bold text-slate-400">{label}</p>
      <p className="text-xs font-bold text-slate-700 mt-0.5">{value}</p>
    </div>
  );
}