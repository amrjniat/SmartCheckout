



import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';

interface Category {
  id: string;
  ar: string;
  en: string;
  icon: string;
}

type StockStatus = 'ok' | 'low' | 'out';

interface Product {
  id: string;
  ar: string;
  en: string;
  price: number;
  stock: number;
  categoryId: string;
  icon: string;
  isNew?: boolean;
  barcode: string;
  code: string;
}

interface CartItem extends Product {
  qty: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  balance: number;
  invoiceCount: number;
  discountEligible: boolean;
}

interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
}

type PaymentMethod = 'cash' | 'card' | 'wallet';

const CATEGORIES: Category[] = [
  { id: 'all', ar: 'الكل', en: 'All', icon: '🗂️' },
  { id: 'drinks', ar: 'مشروبات', en: 'Drinks', icon: '🥤' },
  { id: 'sweets', ar: 'حلويات', en: 'Sweets', icon: '🍫' },
  { id: 'dairy', ar: 'ألبان', en: 'Dairy', icon: '🥛' },
  { id: 'cleaning', ar: 'منظفات', en: 'Cleaning', icon: '🧴' },
  { id: 'bakery', ar: 'مخبوزات', en: 'Bakery', icon: '🍞' },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', ar: 'عصير برتقال', en: 'Orange Juice', price: 4500, stock: 40, categoryId: 'drinks', icon: '🧃', barcode: '10001', code: 'DR-01' },
  { id: 'p2', ar: 'ماء معدني', en: 'Mineral Water', price: 1000, stock: 3, categoryId: 'drinks', icon: '💧', barcode: '10002', code: 'DR-02' },
  { id: 'p3', ar: 'مشروب غازي', en: 'Soda', price: 2500, stock: 0, categoryId: 'drinks', icon: '🥤', barcode: '10003', code: 'DR-03' },
  { id: 'p4', ar: 'قهوة باردة', en: 'Iced Coffee', price: 6000, stock: 18, categoryId: 'drinks', icon: '🧋', isNew: true, barcode: '10004', code: 'DR-04' },
  { id: 'p5', ar: 'شوكولا فاخرة', en: 'Premium Chocolate', price: 8000, stock: 25, categoryId: 'sweets', icon: '🍫', barcode: '20001', code: 'SW-01' },
  { id: 'p6', ar: 'بسكويت', en: 'Biscuits', price: 1500, stock: 4, categoryId: 'sweets', icon: '🍪', barcode: '20002', code: 'SW-02' },
  { id: 'p7', ar: 'حلوى جيلي', en: 'Jelly Candy', price: 2000, stock: 60, categoryId: 'sweets', icon: '🍬', barcode: '20003', code: 'SW-03' },
  { id: 'p8', ar: 'حليب طازج', en: 'Fresh Milk', price: 3000, stock: 30, categoryId: 'dairy', icon: '🥛', barcode: '30001', code: 'DA-01' },
  { id: 'p9', ar: 'جبنة بيضاء', en: 'White Cheese', price: 9500, stock: 2, categoryId: 'dairy', icon: '🧀', barcode: '30002', code: 'DA-02' },
  { id: 'p10', ar: 'زبادي', en: 'Yogurt', price: 2200, stock: 45, categoryId: 'dairy', icon: '🥣', isNew: true, barcode: '30003', code: 'DA-03' },
  { id: 'p11', ar: 'سائل جلي', en: 'Dish Soap', price: 5000, stock: 22, categoryId: 'cleaning', icon: '🧴', barcode: '40001', code: 'CL-01' },
  { id: 'p12', ar: 'مسحوق غسيل', en: 'Detergent', price: 12000, stock: 0, categoryId: 'cleaning', icon: '🧺', barcode: '40002', code: 'CL-02' },
  { id: 'p13', ar: 'خبز عربي', en: 'Arabic Bread', price: 1000, stock: 100, categoryId: 'bakery', icon: '🍞', barcode: '50001', code: 'BK-01' },
  { id: 'p14', ar: 'كرواسان', en: 'Croissant', price: 3500, stock: 5, categoryId: 'bakery', icon: '🥐', barcode: '50002', code: 'BK-02' },
  { id: 'p15', ar: 'كيك محلى', en: 'Sweet Cake', price: 15000, stock: 8, categoryId: 'bakery', icon: '🍰', isNew: true, barcode: '50003', code: 'BK-03' },
];

const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'أحمد محمد', phone: '0999999999', balance: 50000, invoiceCount: 27, discountEligible: true },
  { id: 'c2', name: 'سارة خالد', phone: '0988888888', balance: 0, invoiceCount: 4, discountEligible: false },
  { id: 'c3', name: 'يوسف علي', phone: '0977777777', balance: 120000, invoiceCount: 52, discountEligible: true },
];

const TAX_RATE = 0.05;

const T = {
  ar: {
    title: 'شاشة البيع السريع',
    searchPlaceholder: 'ابحث بالاسم / الباركود / الكود...',
    cart: 'السلة',
    emptyCart: 'السلة فارغة — اختر منتجاً للبدء',
    subtotal: 'المجموع',
    discount: 'الخصم',
    tax: 'الضريبة',
    total: 'الإجمالي',
    pay: 'الدفع',
    cash: 'نقداً',
    card: 'بطاقة',
    wallet: 'محفظة',
    newSale: 'بيع جديد',
    addCustomer: 'إضافة عميل',
    addProduct: 'إضافة منتج',
    productName: 'اسم المنتج',
    productPrice: 'السعر',
    save: 'حفظ',
    cancel: 'إلغاء',
    deleteProduct: 'حذف المنتج',
    productDeleted: 'تم حذف المنتج بنجاح',
    holdInvoice: 'تعليق الفاتورة',
    print: 'طباعة',
    refund: 'مرتجع',
    selectCustomer: 'اختيار العميل',
    changeCustomer: 'تغيير العميل',
    noCustomer: 'بدون عميل',
    invoicesCount: 'عدد الفواتير',
    balance: 'الرصيد',
    lowStock: 'منخفض المخزون',
    outOfStock: 'غير متوفر',
    newBadge: 'جديد',
    shortcuts: 'F2 بحث · F4 عميل · F8 خصم · F9 دفع · Esc إلغاء · Ctrl+P طباعة',
    langBtn: 'English',
    close: 'إغلاق',
    saleSuccess: 'تمت عملية البيع بنجاح',
    qtyExceeds: 'الكمية المطلوبة أكبر من المتوفر',
    itemAdded: 'تمت إضافة المنتج',
    itemUnavailable: 'المنتج غير متوفر',
    discountEligible: 'يمكن تطبيق خصم لهذا العميل',
    holdSuccess: 'تم تعليق الفاتورة',
    applyDiscount: 'تطبيق خصم 10%',
    discountApplied: 'تم تطبيق الخصم',
    completeSale: 'إنهاء البيع',
    all: 'الكل',
    online: 'متصل',
    cashier: 'الكاشير',
  },
  en: {
    title: 'Quick Sale Screen',
    searchPlaceholder: 'Search by name / barcode / code...',
    cart: 'Cart',
    emptyCart: 'Cart is empty — select a product to start',
    subtotal: 'Subtotal',
    discount: 'Discount',
    tax: 'Tax',
    total: 'Total',
    pay: 'Pay',
    cash: 'Cash',
    card: 'Card',
    wallet: 'Wallet',
    newSale: 'New Sale',
    addCustomer: 'Add Customer',
    addProduct: 'Add Product',
    productName: 'Product Name',
    productPrice: 'Price',
    save: 'Save',
    cancel: 'Cancel',
    deleteProduct: 'Delete Product',
    productDeleted: 'Product deleted successfully',
    holdInvoice: 'Hold Invoice',
    print: 'Print',
    refund: 'Refund',
    selectCustomer: 'Select Customer',
    changeCustomer: 'Change Customer',
    noCustomer: 'No customer',
    invoicesCount: 'Invoices',
    balance: 'Balance',
    lowStock: 'Low stock',
    outOfStock: 'Out of stock',
    newBadge: 'New',
    shortcuts: 'F2 Search · F4 Customer · F8 Discount · F9 Pay · Esc Cancel · Ctrl+P Print',
    langBtn: 'العربية',
    close: 'Close',
    saleSuccess: 'Sale completed successfully',
    qtyExceeds: 'Requested quantity exceeds stock',
    itemAdded: 'Item added',
    itemUnavailable: 'Item unavailable',
    discountEligible: 'This customer is eligible for a discount',
    holdSuccess: 'Invoice put on hold',
    applyDiscount: 'Apply 10% discount',
    discountApplied: 'Discount applied',
    completeSale: 'Complete Sale',
    all: 'All',
    online: 'Online',
    cashier: 'Cashier',
  },
};

function stockStatus(stock: number): StockStatus {
  if (stock <= 0) return 'out';
  if (stock < 5) return 'low';
  return 'ok';
}

function formatMoney(n: number) {
  return n.toLocaleString('en-US');
}

// ✅ استخدام نفس نوع السياق المُستخدم في DashboardLayout مع setPageData
interface LayoutContext {
  isRtl: boolean;
  setIsRtl: (value: boolean) => void;
  setPageData?: (data: { showHeader?: boolean }) => void;
}

export default function QuickSaleScreen() {
  // ✅ استرجاع isRtl و setPageData من DashboardLayout عبر OutletContext
  const { isRtl, setPageData } = useOutletContext<LayoutContext>();
  const t = isRtl ? T.ar : T.en;

  // ✅ إخفاء الهيدر عند فتح صفحة البيع السريع
  useEffect(() => {
    setPageData?.({ showHeader: false });
    // ✅ إعادة الهيدر عند مغادرة الصفحة
    return () => {
      setPageData?.({ showHeader: true });
    };
  }, [setPageData]);

  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [productList, setProductList] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [discountApplied, setDiscountApplied] = useState(false);
  const [payMethod, setPayMethod] = useState<PaymentMethod | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [pulseId, setPulseId] = useState<string | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);
  const toastIdRef = useRef(0);
  const notifiedEligibility = useRef<Set<string>>(new Set());

  /* initial skeleton load */
  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(id);
  }, []);

  /* ---------------------- Toasts ---------------------- */

  const pushToast = useCallback((type: Toast['type'], text: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((tt) => tt.id !== id));
    }, 2800);
  }, []);

  /* ---------------------- Derived data ---------------------- */

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return productList.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.categoryId === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        p.ar.toLowerCase().includes(q) ||
        p.en.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.code.toLowerCase().includes(q)
      );
    });
  }, [query, activeCategory, productList]);

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const discount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * TAX_RATE);
  const total = taxable + tax;

  /* ---------------------- Actions ---------------------- */

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    const priceNum = Number(newProduct.price);
    const generatedId = 'p' + Date.now();
    const newProd: Product = {
      id: generatedId,
      ar: newProduct.name,
      en: newProduct.name,
      price: priceNum,
      stock: 100,
      categoryId: activeCategory === 'all' ? 'drinks' : activeCategory,
      icon: '📦',
      barcode: Date.now().toString(),
      code: 'NEW-' + Date.now().toString().slice(-4),
      isNew: true
    };

    setProductList(prev => [newProd, ...prev]);
    setShowAddProductModal(false);
    setNewProduct({ name: '', price: '' });
    pushToast('success', `${t.itemAdded}: ${newProduct.name}`);
  };

  const handleDeleteProduct = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setProductList((prev) => prev.filter((p) => p.id !== id));
      setCart((prev) => prev.filter((c) => c.id !== id));
      pushToast('info', t.productDeleted);
    },
    [pushToast, t]
  );

  const addToCart = useCallback(
    (product: Product) => {
      if (product.stock <= 0) {
        pushToast('error', `${t.itemUnavailable}: ${isRtl ? product.ar : product.en}`);
        return;
      }
      setPulseId(product.id);
      setTimeout(() => setPulseId(null), 400);

      setCart((prev) => {
        const existing = prev.find((c) => c.id === product.id);
        if (existing) {
          if (existing.qty + 1 > product.stock) {
            pushToast('error', t.qtyExceeds);
            return prev;
          }
          return prev.map((c) => (c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
        }
        return [...prev, { ...product, qty: 1 }];
      });

      pushToast('success', `${t.itemAdded}: ${isRtl ? product.ar : product.en}`);
      if (stockStatus(product.stock) === 'low') {
        pushToast('warning', `${isRtl ? product.ar : product.en} — ${t.lowStock}`);
      }
    },
    [isRtl, pushToast, t]
  );

  const changeQty = useCallback(
    (id: string, delta: number) => {
      setCart((prev) => {
        const item = prev.find((c) => c.id === id);
        if (!item) return prev;
        const nextQty = item.qty + delta;
        if (nextQty <= 0) {
          return prev.filter((c) => c.id !== id);
        }
        if (nextQty > item.stock) {
          pushToast('error', t.qtyExceeds);
          return prev;
        }
        return prev.map((c) => (c.id === id ? { ...c, qty: nextQty } : c));
      });
    },
    [pushToast, t]
  );

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const newSale = useCallback(() => {
    setCart([]);
    setCustomer(null);
    setDiscountApplied(false);
    setPayMethod(null);
  }, []);

  const holdInvoice = useCallback(() => {
    if (cart.length === 0) return;
    pushToast('info', t.holdSuccess);
    newSale();
  }, [cart, newSale, pushToast, t]);

  const completeSale = useCallback(() => {
    if (cart.length === 0 || !payMethod) return;
    pushToast('success', t.saleSuccess);
    newSale();
  }, [cart, payMethod, newSale, pushToast, t]);

  const selectCustomer = useCallback(
    (c: Customer) => {
      setCustomer(c);
      setShowCustomerPicker(false);
      if (c.discountEligible && !notifiedEligibility.current.has(c.id)) {
        notifiedEligibility.current.add(c.id);
        pushToast('info', t.discountEligible);
      }
    },
    [pushToast, t]
  );

  /* ---------------------- Keyboard shortcuts ---------------------- */

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        setShowCustomerPicker(true);
      } else if (e.key === 'F8') {
        e.preventDefault();
        if (customer?.discountEligible) {
          setDiscountApplied((d) => !d);
          pushToast('success', t.discountApplied);
        }
      } else if (e.key === 'F9') {
        e.preventDefault();
        if (cart.length > 0) setPayMethod((p) => p ?? 'cash');
      } else if (e.key === 'Escape') {
        setShowCustomerPicker(false);
        setShowAddProductModal(false);
      } else if (e.ctrlKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        pushToast('info', t.print);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [customer, cart, pushToast, t]);

  const dir = isRtl ? 'rtl' : 'ltr';

  /* ---------------------- Render ---------------------- */

  return (
    <div dir={dir} className="flex flex-col h-full w-full bg-slate-50 text-slate-800 font-sans">
      <style>{`
        @keyframes pulseAdd { 0% { transform: scale(1); } 45% { transform: scale(0.94); } 100% { transform: scale(1); } }
        .pulse-add { animation: pulseAdd 0.35s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .toast-in { animation: slideIn 0.25s ease; }
        @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        .skeleton { background: linear-gradient(90deg, #e2e8f0 25%, #edf1f6 37%, #e2e8f0 63%); background-size: 400px 100%; animation: shimmer 1.4s infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.25); border-radius: 100px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.6); }
        @media (prefers-reduced-motion: reduce) {
          .pulse-add, .toast-in, .skeleton { animation: none !important; }
        }
      `}</style>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Categories */}
        <aside className="hidden md:flex flex-col w-44 flex-shrink-0 bg-white border-e border-slate-200 py-3 px-2 gap-1 overflow-y-auto custom-scrollbar">
          {CATEGORIES.map((c) => {
            const isActive = activeCategory === c.id;
            return (
               <button
                 key={c.id}
                 onClick={() => setActiveCategory(c.id)}
                 className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-start ${
                   isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-100'
                 }`}
               >
                 <span className="text-base">{c.icon}</span>
                 <span>{isRtl ? c.ar : c.en}</span>
               </button>
            );
          })}
        </aside>

        {/* Products */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-slate-200 bg-white flex-shrink-0">
            <div className="relative">
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
              />
              <svg className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">{t.shortcuts}</div>
          </div>

          {/* Mobile category chips */}
          <div className="flex md:hidden gap-1.5 px-3 py-2 overflow-x-auto custom-scrollbar bg-white border-b border-slate-200 flex-shrink-0">
            {CATEGORIES.map((c) => {
              const isActive = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {c.icon} {isRtl ? c.ar : c.en}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 p-3 h-36">
                    <div className="skeleton w-full h-16 rounded-xl mb-2" />
                    <div className="skeleton w-3/4 h-3 rounded mb-1.5" />
                    <div className="skeleton w-1/2 h-3 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                <span className="text-3xl">🔍</span>
                <span className="text-sm">{isRtl ? 'لا توجد نتائج' : 'No results found'}</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredProducts.map((p) => {
                  const status = stockStatus(p.stock);
                  const disabled = status === 'out';
                  return (
                    <button
                      key={p.id}
                      onClick={() => addToCart(p)}
                      disabled={disabled}
                      className={`relative text-start rounded-2xl border border-slate-200 bg-white p-3 transition-all ${
                        pulseId === p.id ? 'pulse-add' : ''
                      } ${
                        disabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:-translate-y-0.5 hover:shadow-lg hover:border-blue-200 cursor-pointer'
                      }`}
                    >
                      <div
                        role="button"
                        onClick={(e) => handleDeleteProduct(p.id, e)}
                        className="absolute top-2 start-2 text-rose-400 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-full p-1.5 z-10 transition-colors shadow-sm"
                        title={t.deleteProduct}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>

                      {status === 'low' && (
                        <span className="absolute top-2 end-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600">
                          🟠 {t.lowStock}
                        </span>
                      )}
                      {status === 'out' && (
                        <span className="absolute top-2 end-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600">
                          🔴 {t.outOfStock}
                        </span>
                      )}
                      {status === 'ok' && p.isNew && (
                        <span className="absolute top-2 end-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                          🟢 {t.newBadge}
                        </span>
                      )}

                      <div className="w-full h-16 rounded-xl bg-slate-50 flex items-center justify-center text-3xl mb-2">
                        {p.icon}
                      </div>
                      <div className="text-xs font-bold text-slate-700 truncate">{isRtl ? p.ar : p.en}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-black text-blue-600">{formatMoney(p.price)}</span>
                        <span className="text-[10px] text-slate-400">{p.stock} {isRtl ? 'قطعة' : 'pcs'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {/* Cart */}
        <aside className="w-full max-w-[340px] flex-shrink-0 bg-white border-s border-slate-200 flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
            <h2 className="font-bold text-sm text-slate-700">🛒 {t.cart}</h2>
            <span className="text-xs text-slate-400">{cart.reduce((s, c) => s + c.qty, 0)}</span>
          </div>

          {/* Customer */}
          <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0">
            {customer ? (
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">{customer.name}</span>
                  <button onClick={() => setShowCustomerPicker(true)} className="text-blue-600 font-semibold hover:underline">
                    {t.changeCustomer}
                  </button>
                </div>
                <div className="text-slate-500">📞 {customer.phone}</div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>{t.balance}: {formatMoney(customer.balance)}</span>
                  <span>{t.invoicesCount}: {customer.invoiceCount}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowCustomerPicker(true)}
                className="w-full py-2 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                👤 {t.selectCustomer}
              </button>
            )}
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2 text-center px-4">
                <span className="text-3xl">🧺</span>
                <span className="text-xs">{t.emptyCart}</span>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 rounded-xl border border-slate-100 p-2">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-lg flex-shrink-0">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-700 truncate">{isRtl ? item.ar : item.en}</div>
                      <div className="text-[11px] text-blue-600 font-semibold">{formatMoney(item.price * item.qty)}</div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => changeQty(item.id, -1)}
                        className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center transition-colors"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-xs font-bold">{item.qty}</span>
                      <button
                        onClick={() => changeQty(item.id, 1)}
                        className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-rose-400 hover:text-rose-600 transition-colors flex-shrink-0"
                      aria-label="remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="px-4 py-3 border-t border-slate-200 flex-shrink-0 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
               <span>{t.subtotal}</span>
               <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
               <span>{t.discount}</span>
               <span className={discount > 0 ? 'text-emerald-600 font-semibold' : ''}>−{formatMoney(discount)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
               <span>{t.tax} ({Math.round(TAX_RATE * 100)}%)</span>
               <span>{formatMoney(tax)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-800 pt-1.5 border-t border-slate-100">
               <span>{t.total}</span>
               <span className="text-blue-600">{formatMoney(total)}</span>
            </div>

            {customer?.discountEligible && (
              <button
                onClick={() => {
                  setDiscountApplied((d) => !d);
                  if (!discountApplied) pushToast('success', t.discountApplied);
                }}
                className={`w-full mt-1 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                  discountApplied
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {t.applyDiscount}
              </button>
            )}

            {/* Payment methods */}
            <div className="grid grid-cols-3 gap-1.5 pt-2">
              {(
                [
                  ['cash', '💵', t.cash],
                  ['card', '💳', t.card],
                  ['wallet', '📱', t.wallet],
                ] as [PaymentMethod, string, string][]
              ).map(([id, icon, label]) => (
                <button
                  key={id}
                  onClick={() => setPayMethod(id)}
                  className={`flex flex-col items-center gap-0.5 py-2 rounded-xl border text-[10px] font-bold transition-all ${
                    payMethod === id
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={completeSale}
              disabled={cart.length === 0 || !payMethod}
              className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-600/20"
            >
              {t.completeSale} · {formatMoney(total)}
            </button>
          </div>
        </aside>
      </div>

      {/* Quick actions bar */}
      <div className="flex-shrink-0 bg-white border-t border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
        <QuickAction icon="🛒" label={t.newSale} onClick={newSale} />
        <QuickAction icon="➕" label={t.addProduct} onClick={() => setShowAddProductModal(true)} />
        <QuickAction icon="👤" label={t.addCustomer} onClick={() => setShowCustomerPicker(true)} />
        <QuickAction icon="🧾" label={t.holdInvoice} onClick={holdInvoice} disabled={cart.length === 0} />
        <QuickAction icon="🖨️" label={t.print} onClick={() => pushToast('info', t.print)} />
        <QuickAction icon="↩️" label={t.refund} onClick={() => pushToast('info', t.refund)} />
        <QuickAction icon="💳" label={t.pay} onClick={completeSale} disabled={cart.length === 0 || !payMethod} highlight />
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4" onClick={() => setShowAddProductModal(false)}>
           <div
             className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl"
             onClick={(e) => e.stopPropagation()}
           >
             <h3 className="font-bold text-sm text-slate-700 mb-4">{t.addProduct}</h3>
             <div className="space-y-3">
               <div>
                 <label className="block text-xs font-semibold text-slate-500 mb-1">{t.productName}</label>
                 <input
                   type="text"
                   value={newProduct.name}
                   onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                   className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               <div>
                 <label className="block text-xs font-semibold text-slate-500 mb-1">{t.productPrice}</label>
                 <input
                   type="number"
                   value={newProduct.price}
                   onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                   className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
             </div>
             <div className="flex gap-2 mt-5">
               <button
                 onClick={handleAddProduct}
                 className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
               >
                 {t.save}
               </button>
               <button
                 onClick={() => setShowAddProductModal(false)}
                 className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
               >
                 {t.cancel}
               </button>
             </div>
           </div>
        </div>
      )}

      {/* Customer picker modal */}
      {showCustomerPicker && (
        <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4" onClick={() => setShowCustomerPicker(false)}>
          <div
            className="bg-white rounded-2xl w-full max-w-sm p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-700">{t.selectCustomer}</h3>
              <button onClick={() => setShowCustomerPicker(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <button
              onClick={() => {
                setCustomer(null);
                setShowCustomerPicker(false);
              }}
              className="w-full text-start px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 mb-1"
            >
              {t.noCustomer}
            </button>
            <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar">
              {CUSTOMERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectCustomer(c)}
                  className="w-full text-start px-3 py-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{c.name}</span>
                    {c.discountEligible && <span className="text-[10px] text-emerald-600 font-bold">🟢</span>}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">📞 {c.phone} · {t.balance} {formatMoney(c.balance)}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-4 inset-x-0 z-50 flex flex-col items-center gap-2 pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-in pointer-events-auto max-w-xs w-full text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white'
                : toast.type === 'warning'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-800 text-white'
            }`}
          >
            <span>
              {toast.type === 'success' ? '✔' : toast.type === 'error' ? '❌' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
  disabled,
  highlight,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
        highlight
          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}