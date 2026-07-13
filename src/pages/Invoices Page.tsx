import { useState, useMemo, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

/* =========================================================
   الأنواع (Types)
========================================================= */
type PaymentMethod = 'cash' | 'card' | 'wallet';
type InvoiceStatus = 'paid' | 'pending' | 'cancelled' | 'returned';
type UserRole = 'manager' | 'cashier';

interface InvoiceItem {
  id: string;
  name: { ar: string; en: string };
  qty: number;
  price: number;
}

interface Invoice {
  id: string;
  invoiceNo: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  customerName: { ar: string; en: string };
  customerPhone: string;
  cashier: { ar: string; en: string };
  paymentMethod: PaymentMethod;
  status: InvoiceStatus;
  discount: number;
  taxRate: number; // percentage
  items: InvoiceItem[];
}

type OutletCtx = { isRtl: boolean; setIsRtl: (v: boolean) => void };

/* =========================================================
   بيانات تجريبية (Mock data)
========================================================= */
const CASHIERS = [
  { ar: 'عمرو عمار', en: 'Amr Ammar' },
  { ar: 'ليلى حسن', en: 'Layla Hassan' },
  { ar: 'كريم صالح', en: 'Kareem Saleh' },
];

const CUSTOMERS = [
  { ar: 'أحمد علي', en: 'Ahmad Ali' },
  { ar: 'سارة محمود', en: 'Sara Mahmoud' },
  { ar: 'زبون نقدي', en: 'Walk-in Customer' },
  { ar: 'رامي خالد', en: 'Rami Khaled' },
  { ar: 'نور الدين', en: 'Nour Eddin' },
];

const PRODUCT_POOL = [
  { ar: 'أرز بسمتي 5 كغ', en: 'Basmati Rice 5kg', price: 42000 },
  { ar: 'زيت دوار الشمس 1.8 ل', en: 'Sunflower Oil 1.8L', price: 28000 },
  { ar: 'سكر أبيض 1 كغ', en: 'White Sugar 1kg', price: 8500 },
  { ar: 'شاي أحمر 400غ', en: 'Black Tea 400g', price: 15000 },
  { ar: 'معجون طماطم', en: 'Tomato Paste', price: 6000 },
  { ar: 'صابون غسيل', en: 'Laundry Soap', price: 4500 },
  { ar: 'حليب بودرة', en: 'Powdered Milk', price: 32000 },
  { ar: 'مياه معدنية 1.5 ل', en: 'Mineral Water 1.5L', price: 2000 },
];

function seedInvoices(): Invoice[] {
  const statuses: InvoiceStatus[] = ['paid', 'paid', 'paid', 'pending', 'cancelled', 'returned'];
  const methods: PaymentMethod[] = ['cash', 'cash', 'card', 'wallet'];
  const list: Invoice[] = [];
  for (let i = 0; i < 34; i++) {
    const itemCount = 1 + (i % 5);
    const items: InvoiceItem[] = Array.from({ length: itemCount }).map((_, idx) => {
      const p = PRODUCT_POOL[(i + idx) % PRODUCT_POOL.length];
      return {
        id: `${i}-${idx}`,
        name: { ar: p.ar, en: p.en },
        qty: 1 + ((i + idx) % 3),
        price: p.price,
      };
    });
    const dayOffset = i % 12;
    const d = new Date(2026, 6, 13 - dayOffset);
    list.push({
      id: `inv-${i}`,
      invoiceNo: `INV-${(1042 - i).toString().padStart(4, '0')}`,
      date: d.toISOString().slice(0, 10),
      time: `${(8 + (i % 10)).toString().padStart(2, '0')}:${((i * 7) % 60).toString().padStart(2, '0')}`,
      customerName: CUSTOMERS[i % CUSTOMERS.length],
      customerPhone: `09${(30000000 + i * 137).toString().slice(0, 8)}`,
      cashier: CASHIERS[i % CASHIERS.length],
      paymentMethod: methods[i % methods.length],
      status: statuses[i % statuses.length],
      discount: i % 4 === 0 ? 5000 : 0,
      taxRate: 0,
      items,
    });
  }
  return list;
}

const ALL_INVOICES = seedInvoices();
const PAGE_SIZE = 8;

/* =========================================================
   الترجمة
========================================================= */
const translations = {
  ar: {
    pageTitle: 'الفواتير والمبيعات',
    pageSubtitle: 'إدارة جميع الفواتير الصادرة والمرتجعات',
    newInvoice: 'فاتورة جديدة',
    exportExcel: 'Excel',
    exportPdf: 'PDF',

    statTotalInvoices: 'إجمالي الفواتير',
    statTotalSales: 'إجمالي المبيعات',
    statReturns: 'المرتجعات',
    statPending: 'الفواتير المعلقة',

    searchPlaceholder: 'ابحث برقم الفاتورة، العميل، الهاتف أو الكاشير...',
    filterDate: 'التاريخ',
    filterDateAll: 'كل الفترات',
    filterDateToday: 'اليوم',
    filterDateWeek: 'هذا الأسبوع',
    filterDateMonth: 'هذا الشهر',

    filterStatus: 'حالة الفاتورة',
    statusAll: 'الكل',
    statusPaid: 'مدفوعة',
    statusPending: 'معلقة',
    statusCancelled: 'ملغاة',
    statusReturned: 'مرتجعة',

    filterPayment: 'طريقة الدفع',
    paymentAll: 'الكل',
    paymentCash: 'نقدي',
    paymentCard: 'بطاقة',
    paymentWallet: 'محفظة إلكترونية',

    filterCashier: 'الكاشير',
    cashierAll: 'كل الكاشيرين',

    resultsCount: (n: number) => `عرض ${n} فاتورة`,

    thInvoice: 'رقم الفاتورة',
    thDate: 'التاريخ',
    thTime: 'الوقت',
    thCustomer: 'العميل',
    thCashier: 'الكاشير',
    thItems: 'عدد المنتجات',
    thPayment: 'طريقة الدفع',
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

    pagePrev: 'السابق',
    pageNext: 'التالي',
    pageOf: (p: number, total: number) => `صفحة ${p} من ${total}`,

    modalTitle: 'تفاصيل الفاتورة',
    modalInvoiceNo: 'رقم الفاتورة',
    modalDate: 'التاريخ',
    modalCustomer: 'اسم العميل',
    modalCashier: 'اسم الكاشير',
    modalProduct: 'المنتج',
    modalQty: 'الكمية',
    modalPrice: 'السعر',
    modalLineTotal: 'الإجمالي',
    modalSubtotal: 'المجموع',
    modalDiscount: 'الخصم',
    modalTax: 'الضريبة',
    modalGrandTotal: 'الإجمالي',
    modalPaymentMethod: 'طريقة الدفع',
    modalClose: 'إغلاق',

    copyDone: 'تم نسخ رقم الفاتورة',
    toastCancelled: (no: string) => `تم إلغاء الفاتورة ${no}`,
    toastReturned: (no: string) => `تم تسجيل مرتجع للفاتورة ${no}`,

    role: 'الدور',
    roleManager: 'مدير',
    roleCashier: 'كاشير',

    sortHint: 'اضغط للترتيب',
    currency: 'ل.س',
    unitItem: 'مادة',
    noPermission: 'لا تملك صلاحية القيام بهذا الإجراء',
  },
  en: {
    pageTitle: 'Sales & Invoices',
    pageSubtitle: 'Manage all issued invoices and returns',
    newInvoice: 'New Invoice',
    exportExcel: 'Excel',
    exportPdf: 'PDF',

    statTotalInvoices: 'Total Invoices',
    statTotalSales: 'Total Sales',
    statReturns: 'Returns',
    statPending: 'Pending Invoices',

    searchPlaceholder: 'Search by invoice no., customer, phone or cashier...',
    filterDate: 'Date',
    filterDateAll: 'All time',
    filterDateToday: 'Today',
    filterDateWeek: 'This week',
    filterDateMonth: 'This month',

    filterStatus: 'Invoice Status',
    statusAll: 'All',
    statusPaid: 'Paid',
    statusPending: 'Pending',
    statusCancelled: 'Cancelled',
    statusReturned: 'Returned',

    filterPayment: 'Payment Method',
    paymentAll: 'All',
    paymentCash: 'Cash',
    paymentCard: 'Card',
    paymentWallet: 'E-Wallet',

    filterCashier: 'Cashier',
    cashierAll: 'All cashiers',

    resultsCount: (n: number) => `Showing ${n} invoices`,

    thInvoice: 'Invoice No.',
    thDate: 'Date',
    thTime: 'Time',
    thCustomer: 'Customer',
    thCashier: 'Cashier',
    thItems: 'Items',
    thPayment: 'Payment',
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

    pagePrev: 'Previous',
    pageNext: 'Next',
    pageOf: (p: number, total: number) => `Page ${p} of ${total}`,

    modalTitle: 'Invoice Details',
    modalInvoiceNo: 'Invoice No.',
    modalDate: 'Date',
    modalCustomer: 'Customer Name',
    modalCashier: 'Cashier Name',
    modalProduct: 'Product',
    modalQty: 'Qty',
    modalPrice: 'Price',
    modalLineTotal: 'Total',
    modalSubtotal: 'Subtotal',
    modalDiscount: 'Discount',
    modalTax: 'Tax',
    modalGrandTotal: 'Grand Total',
    modalPaymentMethod: 'Payment Method',
    modalClose: 'Close',

    copyDone: 'Invoice number copied',
    toastCancelled: (no: string) => `Invoice ${no} cancelled`,
    toastReturned: (no: string) => `Return recorded for invoice ${no}`,

    role: 'Role',
    roleManager: 'Manager',
    roleCashier: 'Cashier',

    sortHint: 'Click to sort',
    currency: 'SYP',
    unitItem: 'items',
    noPermission: "You don't have permission for this action",
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
};

/* =========================================================
   شارة الحالة
========================================================= */
function StatusBadge({ status, t }: { status: InvoiceStatus; t: typeof translations.ar }) {
  const map: Record<InvoiceStatus, { label: string; cls: string; dot: string }> = {
    paid: { label: t.statusPaid, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    pending: { label: t.statusPending, cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    cancelled: { label: t.statusCancelled, cls: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
    returned: { label: t.statusReturned, cls: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  };
  const s = map[status];
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
  const t = isRtl ? translations.ar : translations.en;
  const lang: 'ar' | 'en' = isRtl ? 'ar' : 'en';

  const [role, setRole] = useState<UserRole>('manager');
  const currentCashier = CASHIERS[0]; // يمثل الكاشير الحالي المسجل دخوله

  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | PaymentMethod>('all');
  const [cashierFilter, setCashierFilter] = useState<string>('all');

  const [sortKey, setSortKey] = useState<'date' | 'total' | 'customer'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const [page, setPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, InvoiceStatus>>({});

  const todayStr = '2026-07-13';

  function invoiceTotal(inv: Invoice) {
    const subtotal = inv.items.reduce((sum, it) => sum + it.qty * it.price, 0);
    const tax = (subtotal - inv.discount) * (inv.taxRate / 100);
    return subtotal - inv.discount + tax;
  }

  const scoped = useMemo(() => {
    if (role === 'cashier') {
      return ALL_INVOICES.filter((inv) => inv.cashier.en === currentCashier.en);
    }
    return ALL_INVOICES;
  }, [role]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return scoped.filter((inv) => {
      const status = statusOverrides[inv.id] ?? inv.status;
      if (q) {
        const hay = [
          inv.invoiceNo,
          inv.customerName.ar,
          inv.customerName.en,
          inv.customerPhone,
          inv.cashier.ar,
          inv.cashier.en,
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (statusFilter !== 'all' && status !== statusFilter) return false;
      if (paymentFilter !== 'all' && inv.paymentMethod !== paymentFilter) return false;
      if (cashierFilter !== 'all' && inv.cashier.en !== cashierFilter) return false;
      if (dateFilter !== 'all') {
        const d = new Date(inv.date);
        const today = new Date(todayStr);
        const diffDays = Math.floor((today.getTime() - d.getTime()) / 86400000);
        if (dateFilter === 'today' && diffDays !== 0) return false;
        if (dateFilter === 'week' && diffDays > 7) return false;
        if (dateFilter === 'month' && diffDays > 30) return false;
      }
      return true;
    });
  }, [scoped, search, statusFilter, paymentFilter, cashierFilter, dateFilter, statusOverrides]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date') cmp = `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);
      else if (sortKey === 'total') cmp = invoiceTotal(a) - invoiceTotal(b);
      else cmp = a.customerName.en.localeCompare(b.customerName.en);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, paymentFilter, cashierFilter, dateFilter, role]);

  const stats = useMemo(() => {
    const totalInvoices = scoped.length;
    const totalSales = scoped
      .filter((inv) => (statusOverrides[inv.id] ?? inv.status) === 'paid')
      .reduce((s, inv) => s + invoiceTotal(inv), 0);
    const returns = scoped.filter((inv) => (statusOverrides[inv.id] ?? inv.status) === 'returned').length;
    const pending = scoped.filter((inv) => (statusOverrides[inv.id] ?? inv.status) === 'pending').length;
    return { totalInvoices, totalSales, returns, pending };
  }, [scoped, statusOverrides]);

  function toggleSort(key: 'date' | 'total' | 'customer') {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function handleCopy(inv: Invoice) {
    navigator.clipboard?.writeText(inv.invoiceNo).catch(() => {});
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function handleCancel(inv: Invoice) {
    if (role !== 'manager') {
      setToast(t.noPermission);
      return;
    }
    setStatusOverrides((prev) => ({ ...prev, [inv.id]: 'cancelled' }));
    setToast(t.toastCancelled(inv.invoiceNo));
  }

  function handleReturn(inv: Invoice) {
    setStatusOverrides((prev) => ({ ...prev, [inv.id]: 'returned' }));
    setToast(t.toastReturned(inv.invoiceNo));
  }

  const paymentLabel = (m: PaymentMethod) =>
    m === 'cash' ? t.paymentCash : m === 'card' ? t.paymentCard : t.paymentWallet;

  const numberFmt = (n: number) => n.toLocaleString(isRtl ? 'ar-SY' : 'en-US');

  const clearFilters = () => {
    setSearch('');
    setDateFilter('all');
    setStatusFilter('all');
    setPaymentFilter('all');
    setCashierFilter('all');
  };

  return (
    <div className="w-full min-h-full px-4 sm:px-6 py-6 space-y-5" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ===== عنوان الصفحة + أزرار العمليات ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">{t.pageTitle}</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{t.pageSubtitle}</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* تبديل الدور - لغرض العرض التوضيحي للصلاحيات */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setRole('manager')}
              className={`px-3 py-1.5 rounded-lg transition-all ${role === 'manager' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {t.roleManager}
            </button>
            <button
              onClick={() => setRole('cashier')}
              className={`px-3 py-1.5 rounded-lg transition-all ${role === 'cashier' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {t.roleCashier}
            </button>
          </div>

          {role === 'manager' && (
            <>
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
            </>
          )}

          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/30">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {t.newInvoice}
          </button>
        </div>
      </div>

      {/* ===== بطاقات إحصائية ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Icon.Invoice className="w-5 h-5" />}
          label={t.statTotalInvoices}
          value={numberFmt(stats.totalInvoices)}
          accent="blue"
        />
        <StatCard
          icon={<Icon.Cash className="w-5 h-5" />}
          label={t.statTotalSales}
          value={`${numberFmt(stats.totalSales)} ${t.currency}`}
          accent="emerald"
        />
        <StatCard icon={<Icon.Return className="w-5 h-5" />} label={t.statReturns} value={numberFmt(stats.returns)} accent="purple" />
        <StatCard icon={<Icon.Clock className="w-5 h-5" />} label={t.statPending} value={numberFmt(stats.pending)} accent="amber" />
      </div>

      {/* ===== البحث + الفلاتر ===== */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3">
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
              { value: 'paid', label: t.statusPaid },
              { value: 'pending', label: t.statusPending },
              { value: 'cancelled', label: t.statusCancelled },
              { value: 'returned', label: t.statusReturned },
            ]}
          />
          <FilterSelect
            value={paymentFilter}
            onChange={(v) => setPaymentFilter(v as typeof paymentFilter)}
            options={[
              { value: 'all', label: t.paymentAll },
              { value: 'cash', label: t.paymentCash },
              { value: 'card', label: t.paymentCard },
              { value: 'wallet', label: t.paymentWallet },
            ]}
          />
          {role === 'manager' && (
            <FilterSelect
              value={cashierFilter}
              onChange={(v) => setCashierFilter(v)}
              options={[
                { value: 'all', label: t.cashierAll },
                ...CASHIERS.map((c) => ({ value: c.en, label: c[lang] })),
              ]}
            />
          )}

          <div className="ms-auto flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">{t.resultsCount(sorted.length)}</span>
            {(search || dateFilter !== 'all' || statusFilter !== 'all' || paymentFilter !== 'all' || cashierFilter !== 'all') && (
              <button onClick={clearFilters} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                {isRtl ? 'إزالة الفلاتر' : 'Clear filters'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== جدول الفواتير ===== */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <Th>{t.thInvoice}</Th>
                <ThSortable label={t.thDate} active={sortKey === 'date'} dir={sortDir} onClick={() => toggleSort('date')} />
                <Th className="hidden md:table-cell">{t.thTime}</Th>
                <ThSortable label={t.thCustomer} active={sortKey === 'customer'} dir={sortDir} onClick={() => toggleSort('customer')} />
                <Th className="hidden lg:table-cell">{t.thCashier}</Th>
                <Th className="hidden md:table-cell">{t.thItems}</Th>
                <Th className="hidden sm:table-cell">{t.thPayment}</Th>
                <ThSortable label={t.thTotal} active={sortKey === 'total'} dir={sortDir} onClick={() => toggleSort('total')} />
                <Th>{t.thStatus}</Th>
                <Th className="text-end">{t.thActions}</Th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((inv) => {
                const status = statusOverrides[inv.id] ?? inv.status;
                const total = invoiceTotal(inv);
                return (
                  <tr key={inv.id} className="border-b border-slate-50 last:border-0 hover:bg-blue-50/30 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="font-bold text-blue-600 hover:underline text-xs"
                        >
                          {inv.invoiceNo}
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
                    <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{inv.date}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell whitespace-nowrap">{inv.time}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium text-xs">{inv.customerName[lang]}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">{inv.cashier[lang]}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">
                      {inv.items.reduce((s, it) => s + it.qty, 0)} {t.unitItem}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden sm:table-cell">{paymentLabel(inv.paymentMethod)}</td>
                    <td className="px-4 py-3 font-bold text-slate-800 text-xs whitespace-nowrap">
                      {numberFmt(total)} <span className="text-slate-400 font-medium">{t.currency}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={status} t={t} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <RowAction title={t.actionView} onClick={() => setSelectedInvoice(inv)}>
                          <Icon.Eye className="w-4 h-4" />
                        </RowAction>
                        <RowAction title={t.actionPrint} onClick={() => setToast(`${t.actionPrint} ${inv.invoiceNo} ✓`)}>
                          <Icon.Print className="w-4 h-4" />
                        </RowAction>
                        <RowAction title={t.actionPdf} onClick={() => setToast(`PDF ${inv.invoiceNo} ✓`)}>
                          <Icon.Pdf className="w-4 h-4" />
                        </RowAction>
                        {status !== 'returned' && status !== 'cancelled' && (
                          <RowAction title={t.actionReturn} onClick={() => handleReturn(inv)}>
                            <Icon.Return className="w-4 h-4" />
                          </RowAction>
                        )}
                        {role === 'manager' && status !== 'cancelled' && (
                          <RowAction title={t.actionCancel} danger onClick={() => handleCancel(inv)}>
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
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'
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

      {/* ===== نافذة تفاصيل الفاتورة ===== */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          status={statusOverrides[selectedInvoice.id] ?? selectedInvoice.status}
          onClose={() => setSelectedInvoice(null)}
          t={t}
          lang={lang}
          numberFmt={numberFmt}
          paymentLabel={paymentLabel}
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
  const styles: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md hover:shadow-slate-200/60 transition-shadow">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${styles[accent]}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-slate-400 truncate">{label}</p>
        <p className="text-lg font-black text-slate-800 truncate">{value}</p>
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
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-colors ${
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
  invoice,
  status,
  onClose,
  t,
  lang,
  numberFmt,
  paymentLabel,
}: {
  invoice: Invoice;
  status: InvoiceStatus;
  onClose: () => void;
  t: typeof translations.ar;
  lang: 'ar' | 'en';
  numberFmt: (n: number) => string;
  paymentLabel: (m: PaymentMethod) => string;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const subtotal = invoice.items.reduce((s, it) => s + it.qty * it.price, 0);
  const tax = (subtotal - invoice.discount) * (invoice.taxRate / 100);
  const grandTotal = subtotal - invoice.discount + tax;

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
            <p className="text-xs text-slate-400 font-bold mt-0.5">{invoice.invoiceNo}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={status} t={t} />
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <Icon.Close className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <InfoField label={t.modalInvoiceNo} value={invoice.invoiceNo} />
            <InfoField label={t.modalDate} value={`${invoice.date} - ${invoice.time}`} />
            <InfoField label={t.modalCustomer} value={invoice.customerName[lang]} />
            <InfoField label={t.modalCashier} value={invoice.cashier[lang]} />
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
                {invoice.items.map((it) => (
                  <tr key={it.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-3 py-2 text-slate-700 font-medium">{it.name[lang]}</td>
                    <td className="px-3 py-2 text-center text-slate-500">{it.qty}</td>
                    <td className="px-3 py-2 text-end text-slate-500">{numberFmt(it.price)}</td>
                    <td className="px-3 py-2 text-end font-bold text-slate-700">{numberFmt(it.qty * it.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>{t.modalSubtotal}</span>
              <span className="font-bold text-slate-700">
                {numberFmt(subtotal)} {t.currency}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>{t.modalDiscount}</span>
              <span className="font-bold text-rose-500">
                -{numberFmt(invoice.discount)} {t.currency}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>{t.modalTax}</span>
              <span className="font-bold text-slate-700">
                {numberFmt(tax)} {t.currency}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 text-sm">
              <span className="font-black text-slate-800">{t.modalGrandTotal}</span>
              <span className="font-black text-blue-600">
                {numberFmt(grandTotal)} {t.currency}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2.5">
            <span className="text-xs font-bold text-slate-500">{t.modalPaymentMethod}</span>
            <span className="text-xs font-black text-slate-800">{paymentLabel(invoice.paymentMethod)}</span>
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