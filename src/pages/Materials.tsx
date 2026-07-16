// import React, { useState, useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';

// interface DashboardContext {
//   isRtl: boolean;
//   setIsRtl: React.Dispatch<React.SetStateAction<boolean>>;
// }

// // ==========================================
// // 1. الأنماط والواجهات البرمجية (Types & Interfaces)
// // ==========================================
// interface Product {
//   id: string;
//   name: string;
//   sku: string;
//   barcode: string;
//   category: string;
//   purchasePrice: number;
//   sellingPrice: number;
//   quantity: number;
//   minLimit: number;
//   status: 'available' | 'low' | 'out' | 'hidden';
//   supplier: string;
//   unit: string;
//   description: string;
//   image: string;
//   lastMovement: string;     
//   turnoverRate: 'fast' | 'medium' | 'slow'; 
//   isNew?: boolean;
// }

// type UserRole = 'manager' | 'storekeeper' | 'cashier';

// interface Toast {
//   id: number;
//   message: string;
//   type: 'success' | 'info' | 'warning' | 'error';
// }

// export default function ProductsManagementPage() {
//   // ==========================================
//   // 2. حالات الصفحة والمخازن الـ State
//   // ==========================================
//   const { isRtl } = useOutletContext<DashboardContext>();
//   const [activeRole, setActiveRole] = useState<UserRole>('manager'); 
//   const [isLoading, setIsLoading] = useState(true);

//   // حالات العدادات الإحصائية المتحركة
//   const [countTotal, setCountTotal] = useState(0);
//   const [countAvailable, setCountAvailable] = useState(0);
//   const [countLow, setCountLow] = useState(0);
//   const [countOut, setCountOut] = useState(0);

//   // الفلاتر والبحث
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('الكل');
//   const [filterStatus, setFilterStatus] = useState('الكل');
//   const [filterSupplier, setFilterSupplier] = useState('الكل');

//   // معالجة النوافذ المنبثقة (Modals & Drawers)
//   const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);
//   const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
//   const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);

//   // نظام التنبيهات
//   const [toasts, setToasts] = useState<Toast[]>([]);

//   // البيانات الوهمية
//   const [products, setProducts] = useState<Product[]>([
//     {
//       id: '1',
//       name: 'حليب كامل الدسم 1 ليتر',
//       sku: 'MILK-001',
//       barcode: '628100012345',
//       category: 'ألبان',
//       purchasePrice: 12000,
//       sellingPrice: 15000,
//       quantity: 110,
//       minLimit: 20,
//       status: 'available',
//       supplier: 'شركة المراعي الوطنية',
//       unit: 'قطعة',
//       description: 'حليب بقري طبيعي طازج معقم طويل الأجل ومجنس.',
//       image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=150&auto=format&fit=crop&q=60',
//       lastMovement: 'بيع - اليوم 12:40 م',
//       turnoverRate: 'fast',
//       isNew: true
//     },
//     {
//       id: '2',
//       name: 'منظف زجاج سوبر كلين',
//       sku: 'DET-552',
//       barcode: '628200098765',
//       category: 'منظفات',
//       purchasePrice: 22000,
//       sellingPrice: 28000,
//       quantity: 12,
//       minLimit: 15,
//       status: 'low',
//       supplier: 'مجموعة التوريدات الكيماوية',
//       unit: 'قطعة',
//       description: 'بخاخ منظف زجاج ومرايا فعال يزيل الدهون والأوساخ دون ترك أثر.',
//       image: 'https://images.unsplash.com/photo-1581781894090-a5b5145014b1?w=150&auto=format&fit=crop&q=60',
//       lastMovement: 'شراء - أمس 04:15 م',
//       turnoverRate: 'medium'
//     },
//     {
//       id: '3',
//       name: 'مياه معدنية نقي 500 مل',
//       sku: 'WAT-009',
//       barcode: '628300044556',
//       category: 'مشروبات',
//       purchasePrice: 1500,
//       sellingPrice: 2500,
//       quantity: 0,
//       minLimit: 50,
//       status: 'out',
//       supplier: 'مصنع مياه نقي العذبة',
//       unit: 'كرتون',
//       description: 'مياه شرب معبأة جوفية طبيعية نقية ومفلترة.',
//       image: 'https://images.unsplash.com/photo-1608885898957-a599fb1cb4a7?w=150&auto=format&fit=crop&q=60',
//       lastMovement: 'بيع - 2026-07-11',
//       turnoverRate: 'fast'
//     },
//     {
//       id: '4',
//       name: 'عصير برتقال طبيعي غازي',
//       sku: 'BEV-102',
//       barcode: '628400033221',
//       category: 'مشروبات',
//       purchasePrice: 4500,
//       sellingPrice: 6000,
//       quantity: 988,
//       minLimit: 30,
//       status: 'available',
//       supplier: 'شركة المراعي الوطنية',
//       unit: 'قطعة',
//       description: 'عصير برتقال منعش بنسبة غازية خفيفة بدون ألوان صناعية.',
//       image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=150&auto=format&fit=crop&q=60',
//       lastMovement: 'تعديل مخزن - 2026-07-09',
//       turnoverRate: 'slow'
//     }
//   ]);

//   // نموذج الحقول لملء نموذج إضافة/تعديل منتج جديد
//   const [formData, setFormData] = useState({
//     name: '', sku: '', barcode: '', category: 'مشروبات',
//     purchasePrice: 0, sellingPrice: 0, quantity: 0, minLimit: 0,
//     supplier: 'شركة المراعي الوطنية', unit: 'قطعة', description: '', image: ''
//   });

//   // ==========================================
//   // 3. التأثيرات الحركية والتحميل (Effects)
//   // ==========================================
//   useEffect(() => {
//     const loaderTimeout = setTimeout(() => {
//       setIsLoading(false);
//       animateCounter(1250, setCountTotal);
//       animateCounter(1110, setCountAvailable);
//       animateCounter(35, setCountLow);
//       animateCounter(8, setCountOut);
//     }, 1200);

//     return () => clearTimeout(loaderTimeout);
//   }, []);

//   const animateCounter = (target: number, setCounter: React.Dispatch<React.SetStateAction<number>>) => {
//     let start = 0;
//     const duration = 1000; 
//     const stepTime = Math.max(Math.floor(duration / target), 10);
//     const timer = setInterval(() => {
//       start += Math.ceil(target / 40);
//       if (start >= target) {
//         setCounter(target);
//         clearInterval(timer);
//       } else {
//         setCounter(start);
//       }
//     }, stepTime);
//   };

//   const showToast = (message: string, type: Toast['type'] = 'success') => {
//     const id = Date.now();
//     setToasts((prev) => [...prev, { id, message, type }]);
//     setTimeout(() => {
//       setToasts((prev) => prev.filter((t) => t.id !== id));
//     }, 4000);
//   };

//   // ==========================================
//   // 4. منطق الفلترة والتحكم بالصلاحيات
//   // ==========================================
//   const filteredProducts = products.filter((p) => {
//     const matchesSearch =
//       p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.barcode.includes(searchTerm);
    
//     const matchesCategory = filterCategory === 'الكل' || p.category === filterCategory;
//     const matchesStatus = filterStatus === 'الكل' || p.status === filterStatus;
//     const matchesSupplier = filterSupplier === 'الكل' || p.supplier === filterSupplier;

//     return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
//   });

//   // ==========================================
//   // 5. وظائف إدارة المنتجات والعمليات المخزنية
//   // ==========================================
//   const handleOpenAddModal = () => {
//     if (activeRole === 'cashier') {
//       showToast('خطأ: لا يملك الكاشير صلاحية الوصول للوحة الإدارة', 'error');
//       return;
//     }
//     setFormData({
//       name: '', sku: `SKU-${Math.floor(100 + Math.random() * 900)}`, barcode: String(Math.floor(628000000000 + Math.random() * 99999999)),
//       category: 'مشروبات', purchasePrice: 0, sellingPrice: 0, quantity: 1, minLimit: 5,
//       supplier: 'شركة المراعي الوطنية', unit: 'قطعة', description: '', image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=150&auto=format&fit=crop&q=60'
//     });
//     setModalMode('add');
//   };

//   const handleOpenEditModal = (product: Product, e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (activeRole === 'cashier') {
//       showToast('خطأ: الصلاحيات الحالية لا تسمح بإجراء تعديلات', 'error');
//       return;
//     }
//     setSelectedProductForEdit(product);
//     setFormData({ ...product });
//     setModalMode('edit');
//   };

//   const handleDuplicateProduct = (product: Product, e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (activeRole === 'cashier') {
//       showToast('خطأ: ليس لديك صلاحية نسخ المنتجات', 'error');
//       return;
//     }
//     const duplicated: Product = {
//       ...product,
//       id: String(products.length + 1),
//       name: `${product.name} (نسخة مكررة)`,
//       sku: `${product.sku}-COPY`,
//       barcode: String(Number(product.barcode) + 1),
//       isNew: true,
//       lastMovement: 'تم الإنشاء بالنسخ - الآن'
//     };
//     setProducts([duplicated, ...products]);
//     showToast('📄 تم استنساخ المنتج كمسودة بنجاح!');
//   };

//   const handleDeleteProduct = (id: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (activeRole === 'storekeeper') {
//       showToast('❌ عذراً: سياسة النظام تمنع أمين المستودع من حذف المنتجات نهائياً', 'warning');
//       return;
//     }
//     if (activeRole === 'cashier') {
//       showToast('خطأ: لا تملك صلاحية الحذف', 'error');
//       return;
//     }

//     setProducts(products.filter(p => p.id !== id));
//     showToast('🗑️ تم حذف المنتج بنجاح وإسقاطه من حركات المخازن.', 'warning');
//     if (drawerProduct?.id === id) setDrawerProduct(null);
//   };

//   const handleSaveProduct = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (modalMode === 'add') {
//       const statusValue = formData.quantity === 0 ? 'out' : formData.quantity <= formData.minLimit ? 'low' : 'available';
//       const newProduct: Product = {
//         id: String(products.length + 1),
//         ...formData,
//         status: statusValue,
//         lastMovement: 'إنشاء مادة جديدة - الآن',
//         turnoverRate: 'medium',
//         isNew: true
//       };
//       setProducts([newProduct, ...products]);
//       showToast('✅ تمت إضافة المنتج ونشره على السحابة بنجاح.');
//     } else if (modalMode === 'edit' && selectedProductForEdit) {
//       const statusValue = formData.quantity === 0 ? 'out' : formData.quantity <= formData.minLimit ? 'low' : 'available';
      
//       if (activeRole === 'storekeeper' && (formData.purchasePrice !== selectedProductForEdit.purchasePrice || formData.sellingPrice !== selectedProductForEdit.sellingPrice)) {
//         showToast('🔒 تم تقييد العملية: يسمح لأمين المستودع فقط بتعديل الكمية والمخزون دون الأسعار التجارية', 'warning');
//         return;
//       }

//       setProducts(products.map(p => p.id === selectedProductForEdit.id ? { 
//         ...p, 
//         ...formData, 
//         status: statusValue,
//         lastMovement: 'تحديث المخزن - الآن' 
//       } : p));
//       showToast('🔧 تم تحديث بيانات المنتج والمخزون الحالي.');
//     }
//     setModalMode(null);
//   };

//   return (
//     <div className="flex flex-col w-full font-sans relative" dir={isRtl ? 'rtl' : 'ltr'}>

//       {/* الحاضن الفعلي لمحتوى الصفحة */}
//       <div className="w-full">

//         {/* مساحة المحتوى */}
//         <div className="p-6 space-y-6 bg-slate-50/50">
          
//           {/* محاكي شاشة منع الكاشير في حال تعيين صلاحيته */}
//           {activeRole === 'cashier' ? (
//             <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl mx-auto my-12 shadow-sm">
//               <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 text-3xl mx-auto mb-4">🔒</div>
//               <h2 className="text-lg font-black text-slate-800 mb-2">عذراً، لا تملك صلاحية دخول شاشة الإدارة</h2>
//               <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
//                 حسب السياسات الأمنية المعتمدة لنظام <span className="font-semibold">SmartCheckout</span>، يُسمح للكاشير فقط بعرض المنتجات واستدعائها داخل شاشة المبيعات الفورية (POS Screen) ولا تتاح له صلاحيات جرد المخازن أو الاطلاع على الأسعار التجارية للشركات.
//               </p>
//             </div>
//           ) : (
//             <>
//               {/* ==========================================
//                   القسم الثالث: بطاقات الإحصائيات مع عداد متحرك (Cards)
//                   ========================================== */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {/* إجمالي المنتجات */}
//                 <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
//                   <div className="space-y-1">
//                     <span className="text-xs font-bold text-slate-400">📦 إجمالي المنتجات</span>
//                     <h3 className="text-2xl font-black text-slate-800 transition-all">
//                       {isLoading ? '...' : countTotal.toLocaleString()}
//                     </h3>
//                   </div>
//                   <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">∑</div>
//                 </div>

//                 {/* متوفرة */}
//                 <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
//                   <div className="space-y-1">
//                     <span className="text-xs font-bold text-slate-400">🟢 منتجات متوفرة</span>
//                     <h3 className="text-2xl font-black text-emerald-600">
//                       {isLoading ? '...' : countAvailable.toLocaleString()}
//                     </h3>
//                   </div>
//                   <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">✓</div>
//                 </div>

//                 {/* منخفض المخزون */}
//                 <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
//                   <div className="space-y-1">
//                     <span className="text-xs font-bold text-slate-400">🟠 منخفضة المخزون</span>
//                     <h3 className="text-2xl font-black text-amber-500">
//                       {isLoading ? '...' : countLow.toLocaleString()}
//                     </h3>
//                   </div>
//                   <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">⚠️</div>
//                 </div>

//                 {/* نفدت الكمية */}
//                 <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
//                   <div className="space-y-1">
//                     <span className="text-xs font-bold text-slate-400">🔴 نفدت الكمية</span>
//                     <h3 className="text-2xl font-black text-rose-600">
//                       {isLoading ? '...' : countOut.toLocaleString()}
//                     </h3>
//                   </div>
//                   <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl">✕</div>
//                 </div>
//               </div>

//               {/* ==========================================
//                   القسم الرابع والخامس: شريط البحث، الفلاتر الذكية، وأزرار العمليات
//                   ========================================== */}
//               <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-4">
                
//                 {/* أزرار العمليات التنفيذية */}
//                 <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
//                   <div className="flex items-center gap-2">
//                     <button 
//                       onClick={handleOpenAddModal}
//                       className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
//                     >
//                       <span>➕</span> إضافة منتج جديد
//                     </button>
//                     <button onClick={() => showToast('⬆️ جاري معالجة ورفع ملف الـ Excel إلى السحابة...')} className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1">
//                       <span>⬆</span> استيراد Excel
//                     </button>
//                     <button onClick={() => showToast('⬇️ تم تصدير ملف إكسل بكامل جرد المخازن')} className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1">
//                       <span>⬇</span> تصدير Excel
//                     </button>
//                   </div>
//                   <button onClick={() => window.print()} className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1">
//                     <span>🖨</span> طباعة التقارير
//                   </button>
//                 </div>

//                 {/* شريط البحث المباشر والفلاتر */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
//                   {/* خانة البحث المتعدد الفوري بدون زر */}
//                   <div className="lg:col-span-2 relative">
//                     <input 
//                       type="text"
//                       placeholder="البحث بالاسم، الباركود، SKU، الكود الداخلي..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
//                     />
//                     <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
//                   </div>

//                   {/* فلتر التصنيفات */}
//                   <div>
//                     <select 
//                       value={filterCategory}
//                       onChange={(e) => setFilterCategory(e.target.value)}
//                       className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
//                     >
//                       <option value="الكل">كل التصنيفات</option>
//                       <option value="مشروبات">مشروبات</option>
//                       <option value="منظفات">منظفات</option>
//                       <option value="ألبان">ألبان</option>
//                     </select>
//                   </div>

//                   {/* فلتر الحالة التشغيلية للمخزون */}
//                   <div>
//                     <select
//                       value={filterStatus}
//                       onChange={(e) => setFilterStatus(e.target.value)}
//                       className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
//                     >
//                       <option value="الكل">كل الحالات المخزنية</option>
//                       <option value="available">🟢 متوفر</option>
//                       <option value="low">🟠 منخفض المخزون</option>
//                       <option value="out">🔴 نفدت الكمية</option>
//                     </select>
//                   </div>

//                   {/* فلتر الموردين */}
//                   <div>
//                     <select
//                       value={filterSupplier}
//                       onChange={(e) => setFilterSupplier(e.target.value)}
//                       className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
//                     >
//                       <option value="الكل">جميع الموردين</option>
//                       <option value="شركة المراعي الوطنية">شركة المراعي الوطنية</option>
//                       <option value="مجموعة التوريدات الكيماوية">مجموعة التوريدات الكيماوية</option>
//                       <option value="مصنع مياه نقي العذبة">مصنع مياه نقي العذبة</option>
//                     </select>
//                   </div>
//                 </div>

//               </div>

//               {/* ==========================================
//                   القسم السادس: جدول المنتجات الاحترافي مع تأثير التمرير
//                   ========================================== */}
//               <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-start border-collapse select-none">
//                     <thead>
//                       <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold border-b border-slate-100 text-right">
//                         <th className="p-3.5">صورة المنتج</th>
//                         <th className="p-3.5">اسم المنتج</th>
//                         <th className="p-3.5">SKU / الباركود</th>
//                         <th className="p-3.5">التصنيف</th>
//                         <th className="p-3.5">سعر الشراء</th>
//                         <th className="p-3.5">سعر البيع</th>
//                         <th className="p-3.5">الكمية الحالية</th>
//                         <th className="p-3.5">معدل الدوران</th>
//                         <th className="p-3.5">آخر حركة مخزنية</th>
//                         <th className="p-3.5">الحالة</th>
//                         <th className="p-3.5 text-center">العمليات</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      
//                       {/* عرض الـ Skeleton في حالة التحميل */}
//                       {isLoading ? (
//                         [1, 2, 3].map((n) => (
//                           <tr key={n} className="animate-pulse">
//                             <td className="p-4"><div className="w-10 h-10 bg-slate-200 rounded-lg"></div></td>
//                             <td className="p-4"><div className="h-3 bg-slate-200 rounded w-24"></div></td>
//                             <td className="p-4"><div className="h-3 bg-slate-200 rounded w-20"></div></td>
//                             <td className="p-4"><div className="h-3 bg-slate-200 rounded w-12"></div></td>
//                             <td className="p-4"><div className="h-3 bg-slate-200 rounded w-14"></div></td>
//                             <td className="p-4"><div className="h-3 bg-slate-200 rounded w-14"></div></td>
//                             <td className="p-4"><div className="h-3 bg-slate-200 rounded w-10"></div></td>
//                             <td className="p-4"><div className="h-3 bg-slate-200 rounded w-12"></div></td>
//                             <td className="p-4"><div className="h-3 bg-slate-200 rounded w-28"></div></td>
//                             <td className="p-4"><div className="h-5 bg-slate-200 rounded-full w-16"></div></td>
//                             <td className="p-4"><div className="h-7 bg-slate-200 rounded-lg w-24 mx-auto"></div></td>
//                           </tr>
//                         ))
//                       ) : filteredProducts.length === 0 ? (
//                         <tr>
//                           <td colSpan={11} className="p-8 text-center text-slate-400 font-bold">
//                             ⚠️ لم يتم العثور على أي منتج يطابق معايير البحث والفلترة المحددة.
//                           </td>
//                         </tr>
//                       ) : (
//                         filteredProducts.map((product) => (
//                           <tr 
//                             key={product.id} 
//                             onClick={() => setDrawerProduct(product)}
//                             className="hover:bg-blue-50/40 cursor-pointer transition-colors duration-150 group"
//                           >
//                             <td className="p-3.5 relative">
//                               <div className="relative w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
//                                 <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                
//                                 {product.status === 'low' && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-500 border border-white rounded-full"></span>}
//                                 {product.status === 'out' && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border border-white rounded-full"></span>}
//                               </div>
//                               {product.isNew && (
//                                 <span className="absolute -top-1 right-2 bg-emerald-500 text-white text-[8px] font-black px-1 rounded-sm scale-90">🟢 جديد</span>
//                               )}
//                             </td>

//                             <td className="p-3.5 font-bold text-slate-900">{product.name}</td>
//                             <td className="p-3.5 text-slate-500 font-mono">
//                               <div className="text-[10px] text-slate-400">{product.sku}</div>
//                               <div>{product.barcode}</div>
//                             </td>
//                             <td className="p-3.5 text-slate-600"><span className="bg-slate-100 px-2 py-1 rounded-md">{product.category}</span></td>
//                             <td className="p-3.5 font-bold text-slate-500">{product.purchasePrice.toLocaleString()} ل.س</td>
//                             <td className="p-3.5 font-bold text-blue-600">{product.sellingPrice.toLocaleString()} ل.س</td>
                            
//                             <td className={`p-3.5 font-black ${product.quantity <= product.minLimit ? 'text-amber-600' : 'text-slate-800'}`}>
//                               {product.quantity} <span className="text-[10px] text-slate-400 font-normal">{product.unit}</span>
//                             </td>

//                             <td className="p-3.5">
//                               <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
//                                 product.turnoverRate === 'fast' ? 'bg-indigo-50 text-indigo-600' : 
//                                 product.turnoverRate === 'medium' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-500'
//                               }`}>
//                                 {product.turnoverRate === 'fast' ? 'سريع الدوران' : product.turnoverRate === 'medium' ? 'متوسط' : 'بطيء'}
//                               </span>
//                             </td>

//                             <td className="p-3.5 text-[11px] text-slate-400 font-medium">{product.lastMovement}</td>

//                             <td className="p-3.5">
//                               {product.status === 'available' && <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] px-2 py-1 rounded-full font-bold">🟢 متوفر</span>}
//                               {product.status === 'low' && <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] px-2 py-1 rounded-full font-bold">🟠 منخفض</span>}
//                               {product.status === 'out' && <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-[10px] px-2 py-1 rounded-full font-bold">🔴 نفد</span>}
//                             </td>

//                             <td className="p-3.5 text-center">
//                               <div className="flex items-center justify-center gap-1">
//                                 <button title="عرض التفاصيل الكاملة" className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors">👁️</button>
//                                 <button onClick={(e) => handleOpenEditModal(product, e)} title="تعديل بيانات المنتج" className="p-1 text-amber-500 hover:bg-amber-50 rounded transition-colors">✏️</button>
//                                 <button onClick={(e) => handleDuplicateProduct(product, e)} title="استنساخ ونسخ المنتج" className="p-1 text-indigo-500 hover:bg-indigo-50 rounded transition-colors">📄</button>
//                                 <button 
//                                   onClick={(e) => handleDeleteProduct(product.id, e)} 
//                                   title="حذف المنتج من السحابة" 
//                                   className={`p-1 rounded transition-colors ${activeRole === 'storekeeper' ? 'text-slate-300 cursor-not-allowed' : 'text-rose-500 hover:bg-rose-50'}`}
//                                 >
//                                   🗑️
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))
//                       )}

//                     </tbody>
//                   </table>
//                 </div>

//                 {/* ==========================================
//                     القسم السابع: الترقيم ونظام الصفحات (Pagination)
//                     ========================================== */}
//                 <div className="bg-white border-t border-slate-100 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500 font-bold">
//                   <span>إظهار 1 إلى {filteredProducts.length} من أصل {products.length} مادة مخزنية</span>
//                   <div className="flex items-center gap-1">
//                     <button className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed">السابق</button>
//                     <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/10">1</button>
//                     <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">2</button>
//                     <button className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">التالي</button>
//                   </div>
//                 </div>

//               </div>
//             </>
//           )}

//         </div>
//       </div>

//       {/* ==========================================
//           القسم الثامن: الـ Drawer الجانبي لعرض كامل تفاصيل المادة
//           ========================================== */}
//       {drawerProduct && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end transition-opacity duration-300">
//           <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left p-6 overflow-y-auto">
//             <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
//               <h2 className="text-sm font-black text-slate-800">👁️ تفاصيل مادة كرت الصنف السحابي</h2>
//               <button onClick={() => setDrawerProduct(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">✕</button>
//             </div>

//             <div className="space-y-4">
//               <div className="w-28 h-28 bg-slate-50 rounded-xl border border-slate-200 mx-auto overflow-hidden relative">
//                 <img src={drawerProduct.image} alt={drawerProduct.name} className="w-full h-full object-cover" />
//               </div>

//               <div className="text-center">
//                 <h3 className="font-black text-slate-900 text-sm">{drawerProduct.name}</h3>
//                 <span className="text-xs text-blue-600 font-mono">{drawerProduct.sku}</span>
//               </div>

//               <div className="grid grid-cols-2 gap-3 pt-2">
//                 <div className="bg-slate-50 p-2 rounded-lg text-right">
//                   <span className="block text-[10px] text-slate-400 font-bold">رقم الباركود الدولي</span>
//                   <span className="text-xs font-mono font-bold text-slate-800">{drawerProduct.barcode}</span>
//                 </div>
//                 <div className="bg-slate-50 p-2 rounded-lg text-right">
//                   <span className="block text-[10px] text-slate-400 font-bold">التصنيف الحالي</span>
//                   <span className="text-xs font-bold text-slate-800">{drawerProduct.category}</span>
//                 </div>
//                 <div className="bg-slate-50 p-2 rounded-lg text-right">
//                   <span className="block text-[10px] text-slate-400 font-bold">سعر تكلفة الشراء</span>
//                   <span className="text-xs font-bold text-slate-700">{drawerProduct.purchasePrice.toLocaleString()} ل.س</span>
//                 </div>
//                 <div className="bg-slate-50 p-2 rounded-lg text-right">
//                   <span className="block text-[10px] text-slate-400 font-bold">سعر البيع للمستهلك</span>
//                   <span className="text-xs font-bold text-blue-600">{drawerProduct.sellingPrice.toLocaleString()} ل.س</span>
//                 </div>
//                 <div className="bg-slate-50 p-2 rounded-lg text-right">
//                   <span className="block text-[10px] text-slate-400 font-bold">الكمية المتوفرة بالمستودع</span>
//                   <span className="text-xs font-black text-slate-900">{drawerProduct.quantity} ({drawerProduct.unit})</span>
//                 </div>
//                 <div className="bg-slate-50 p-2 rounded-lg text-right">
//                   <span className="block text-[10px] text-slate-400 font-bold">الحد الأدنى لطلب التوريد</span>
//                   <span className="text-xs font-bold text-amber-600">{drawerProduct.minLimit}</span>
//                 </div>
//               </div>

//               <div className="bg-slate-50 p-3 rounded-lg text-right space-y-1">
//                 <span className="block text-[10px] text-slate-400 font-bold">المورد المعتمد</span>
//                 <span className="text-xs font-bold text-slate-800">{drawerProduct.supplier}</span>
//               </div>

//               <div className="bg-slate-50 p-3 rounded-lg text-right space-y-1">
//                 <span className="block text-[10px] text-slate-400 font-bold">الوصف التجاري للمادة</span>
//                 <p className="text-xs text-slate-600 font-medium leading-relaxed">{drawerProduct.description || 'لا يوجد وصف مضاف لهذا الصنف.'}</p>
//               </div>

//               <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 space-y-1">
//                 <div>🗓️ **آخر حركة مخزنية:** {drawerProduct.lastMovement}</div>
//                 <div>👤 **رتبة آخر تعديل للبيانات:** {activeRole === 'manager' ? 'المدير العام' : 'أمين المستودع الرئيسي'}</div>
//                 <div>🛒 **آخر عملية بيع مسجلة بنقاط البيع:** اليوم منذ ساعتين</div>
//                 <div>📦 **آخر حركة توريد وشراء:** 2026-07-05</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ==========================================
//           القسم التاسع: نافذة (Modal) إضافة وتعديل المنتجات والمواد
//           ========================================== */}
//       {modalMode !== null && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
//             <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//               <h2 className="text-base font-black text-slate-800">
//                 {modalMode === 'add' ? '➕ إنشاء وإدراج بطاقة منتج سحابي' : '✏️ تعديل صنف مخزني قائم'}
//               </h2>
//               <button onClick={() => setModalMode(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">✕</button>
//             </div>

//             <form onSubmit={handleSaveProduct} className="space-y-4 text-right">
//               {activeRole === 'storekeeper' && modalMode === 'edit' && (
//                 <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-800 font-medium">
//                   🔒 تنبيه الحماية: بصفتك أمين مستودع، تم إقفال حقول أسعار البيع والشراء برمجياً، ويُسمح لك فقط بتعديل كمية الرف والحد الأدنى.
//                 </div>
//               )}

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">اسم المنتج المادة *</label>
//                   <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50" placeholder="مثال: مياه غازية منعشة 330 مل" />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">التصنيف الإداري</label>
//                   <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none" >
//                     <option value="مشروبات">مشروبات</option>
//                     <option value="منظفات">منظفات</option>
//                     <option value="ألبان">ألبان</option>
//                   </select>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">الباركود الدولي (Barcode)</label>
//                   <input type="text" required value={formData.barcode} onChange={(e) => setFormData({...formData, barcode: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50" />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">كود التخزين (SKU)</label>
//                   <input type="text" required value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50" />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">وحدة قياس الصنف</label>
//                   <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white" >
//                     <option value="قطعة">قطعة</option>
//                     <option value="كرتون">كرتون</option>
//                     <option value="كيلو">كيلو</option>
//                     <option value="لتر">لتر</option>
//                   </select>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">المورد المعتمد</label>
//                   <select value={formData.supplier} onChange={(e) => setFormData({...formData, supplier: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white" >
//                     <option value="شركة المراعي الوطنية">شركة المراعي الوطنية</option>
//                     <option value="مجموعة التوريدات الكيماوية">مجموعة التوريدات الكيماوية</option>
//                     <option value="مصنع مياه نقي العذبة">مصنع مياه نقي العذبة</option>
//                   </select>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">سعر كلفة الشراء (ل.س)</label>
//                   <input type="number" required value={formData.purchasePrice} onChange={(e) => setFormData({...formData, purchasePrice: Number(e.target.value)})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50" />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">سعر البيع الافتراضي (ل.س)</label>
//                   <input type="number" required value={formData.sellingPrice} onChange={(e) => setFormData({...formData, sellingPrice: Number(e.target.value)})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50" />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">الكمية الافتتاحية الحالية *</label>
//                   <input type="number" required value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">حد الأمان الأدنى للمخزون</label>
//                   <input type="number" required value={formData.minLimit} onChange={(e) => setFormData({...formData, minLimit: Number(e.target.value)})} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <label className="block text-xs font-bold text-slate-600">شرح ووصف كرت صنف المادة</label>
//                 <textarea rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50" placeholder="اكتب تفاصيل إضافية لمساعدة أمناء المستودعات والكاشيرية..."></textarea>
//               </div>

//               <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
//                 <button type="button" onClick={() => setModalMode(null)} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">إلغاء الأمر</button>
//                 <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm">حفظ وتأكيد التغييرات السحابية</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ==========================================
//           نظام الـ Toasts المنبثق التفاعلي اللحظي
//           ========================================== */}
//       <div className="fixed bottom-4 left-4 z-50 space-y-2 pointer-events-none max-w-sm">
//         {toasts.map((toast) => (
//           <div 
//             key={toast.id}
//             className={`p-3.5 rounded-xl shadow-lg text-xs font-bold text-white flex items-center gap-2 pointer-events-auto animate-slide-up ${
//               toast.type === 'success' ? 'bg-slate-900' : 
//               toast.type === 'warning' ? 'bg-amber-600' : 
//               toast.type === 'error' ? 'bg-rose-600' : 'bg-blue-600'
//             }`}
//           >
//             <span>{toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : toast.type === 'error' ? '🔒' : 'ℹ️'}</span>
//             <span>{toast.message}</span>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }




























// import React, { useState, useEffect } from 'react';
// import { useOutletContext, useNavigate } from 'react-router-dom';

// interface DashboardContext {
//   isRtl: boolean;
//   setIsRtl: React.Dispatch<React.SetStateAction<boolean>>;
// }

// // ==========================================
// // 1. الأنماط والواجهات البرمجية (Types & Interfaces)
// // ==========================================
// interface Product {
//   id: string;
//   name: string;
//   sku: string;
//   barcode: string;
//   category: string;
//   purchasePrice: number;
//   sellingPrice: number;
//   quantity: number;
//   minLimit: number;
//   status: 'available' | 'low' | 'out' | 'hidden';
//   supplier: string;
//   unit: string;
//   description: string;
//   image: string;
//   lastMovement: string;     
//   turnoverRate: 'fast' | 'medium' | 'slow'; 
//   isNew?: boolean;
// }

// type UserRole = 'manager' | 'storekeeper' | 'cashier';

// interface Toast {
//   id: number;
//   message: string;
//   type: 'success' | 'info' | 'warning' | 'error';
// }

// export default function ProductsManagementPage() {
//   // ==========================================
//   // 2. حالات الصفحة والمخازن الـ State
//   // ==========================================
//   const { isRtl } = useOutletContext<DashboardContext>();
//   const navigate = useNavigate();
//   const [activeRole, setActiveRole] = useState<UserRole>('manager'); 
//   const [isLoading, setIsLoading] = useState(true);

//   // حالات العدادات الإحصائية المتحركة
//   const [countTotal, setCountTotal] = useState(0);
//   const [countAvailable, setCountAvailable] = useState(0);
//   const [countLow, setCountLow] = useState(0);
//   const [countOut, setCountOut] = useState(0);

//   // الفلاتر والبحث
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('الكل');
//   const [filterStatus, setFilterStatus] = useState('الكل');
//   const [filterSupplier, setFilterSupplier] = useState('الكل');

//   // معالجة النوافذ المنبثقة (Modals & Drawers)
//   const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);
//   const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
//   const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);

//   // نظام التنبيهات
//   const [toasts, setToasts] = useState<Toast[]>([]);

//   // البيانات الوهمية
//   const [products, setProducts] = useState<Product[]>([
//     {
//       id: '1',
//       name: 'حليب كامل الدسم 1 ليتر',
//       sku: 'MILK-001',
//       barcode: '628100012345',
//       category: 'ألبان',
//       purchasePrice: 12000,
//       sellingPrice: 15000,
//       quantity: 110,
//       minLimit: 20,
//       status: 'available',
//       supplier: 'شركة المراعي الوطنية',
//       unit: 'قطعة',
//       description: 'حليب بقري طبيعي طازج معقم طويل الأجل ومجنس.',
//       image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=150&auto=format&fit=crop&q=60',
//       lastMovement: 'بيع - اليوم 12:40 م',
//       turnoverRate: 'fast',
//       isNew: true
//     },
//     {
//       id: '2',
//       name: 'منظف زجاج سوبر كلين',
//       sku: 'DET-552',
//       barcode: '628200098765',
//       category: 'منظفات',
//       purchasePrice: 22000,
//       sellingPrice: 28000,
//       quantity: 12,
//       minLimit: 15,
//       status: 'low',
//       supplier: 'مجموعة التوريدات الكيماوية',
//       unit: 'قطعة',
//       description: 'بخاخ منظف زجاج ومرايا فعال يزيل الدهون والأوساخ دون ترك أثر.',
//       image: 'https://images.unsplash.com/photo-1581781894090-a5b5145014b1?w=150&auto=format&fit=crop&q=60',
//       lastMovement: 'شراء - أمس 04:15 م',
//       turnoverRate: 'medium'
//     },
//     {
//       id: '3',
//       name: 'مياه معدنية نقي 500 مل',
//       sku: 'WAT-009',
//       barcode: '628300044556',
//       category: 'مشروبات',
//       purchasePrice: 1500,
//       sellingPrice: 2500,
//       quantity: 0,
//       minLimit: 50,
//       status: 'out',
//       supplier: 'مصنع مياه نقي العذبة',
//       unit: 'كرتون',
//       description: 'مياه شرب معبأة جوفية طبيعية نقية ومفلترة.',
//       image: 'https://images.unsplash.com/photo-1608885898957-a599fb1cb4a7?w=150&auto=format&fit=crop&q=60',
//       lastMovement: 'بيع - 2026-07-11',
//       turnoverRate: 'fast'
//     },
//     {
//       id: '4',
//       name: 'عصير برتقال طبيعي غازي',
//       sku: 'BEV-102',
//       barcode: '628400033221',
//       category: 'مشروبات',
//       purchasePrice: 4500,
//       sellingPrice: 6000,
//       quantity: 988,
//       minLimit: 30,
//       status: 'available',
//       supplier: 'شركة المراعي الوطنية',
//       unit: 'قطعة',
//       description: 'عصير برتقال منعش بنسبة غازية خفيفة بدون ألوان صناعية.',
//       image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=150&auto=format&fit=crop&q=60',
//       lastMovement: 'تعديل مخزن - 2026-07-09',
//       turnoverRate: 'slow'
//     }
//   ]);

//   // نموذج الحقول لملء نموذج إضافة/تعديل منتج جديد
//   const [formData, setFormData] = useState({
//     name: '', sku: '', barcode: '', category: 'مشروبات',
//     purchasePrice: 0, sellingPrice: 0, quantity: 0, minLimit: 0,
//     supplier: 'شركة المراعي الوطنية', unit: 'قطعة', description: '', image: ''
//   });

//   // ==========================================
//   // 3. التأثيرات الحركية والتحميل (Effects)
//   // ==========================================
//   useEffect(() => {
//     const loaderTimeout = setTimeout(() => {
//       setIsLoading(false);
//       animateCounter(1250, setCountTotal);
//       animateCounter(1110, setCountAvailable);
//       animateCounter(35, setCountLow);
//       animateCounter(8, setCountOut);
//     }, 1200);

//     return () => clearTimeout(loaderTimeout);
//   }, []);

//   const animateCounter = (target: number, setCounter: React.Dispatch<React.SetStateAction<number>>) => {
//     let start = 0;
//     const duration = 1000; 
//     const stepTime = Math.max(Math.floor(duration / target), 10);
//     const timer = setInterval(() => {
//       start += Math.ceil(target / 40);
//       if (start >= target) {
//         setCounter(target);
//         clearInterval(timer);
//       } else {
//         setCounter(start);
//       }
//     }, stepTime);
//   };

//   const showToast = (message: string, type: Toast['type'] = 'success') => {
//     const id = Date.now();
//     setToasts((prev) => [...prev, { id, message, type }]);
//     setTimeout(() => {
//       setToasts((prev) => prev.filter((t) => t.id !== id));
//     }, 4000);
//   };

//   // ==========================================
//   // 4. منطق الفلترة والتحكم بالصلاحيات
//   // ==========================================
//   const filteredProducts = products.filter((p) => {
//     const matchesSearch =
//       p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.barcode.includes(searchTerm);
    
//     const matchesCategory = filterCategory === 'الكل' || p.category === filterCategory;
//     const matchesStatus = filterStatus === 'الكل' || p.status === filterStatus;
//     const matchesSupplier = filterSupplier === 'الكل' || p.supplier === filterSupplier;

//     return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
//   });

//   // ==========================================
//   // 5. وظائف إدارة المنتجات والعمليات المخزنية
//   // ==========================================
//   const handleOpenAddModal = () => {
//     if (activeRole === 'cashier') {
//       showToast('خطأ: لا يملك الكاشير صلاحية الوصول للوحة الإدارة', 'error');
//       return;
//     }
//     setFormData({
//       name: '', sku: `SKU-${Math.floor(100 + Math.random() * 900)}`, barcode: String(Math.floor(628000000000 + Math.random() * 99999999)),
//       category: 'مشروبات', purchasePrice: 0, sellingPrice: 0, quantity: 1, minLimit: 5,
//       supplier: 'شركة المراعي الوطنية', unit: 'قطعة', description: '', image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=150&auto=format&fit=crop&q=60'
//     });
//     setModalMode('add');
//   };

//   const handleOpenEditModal = (product: Product, e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (activeRole === 'cashier') {
//       showToast('خطأ: الصلاحيات الحالية لا تسمح بإجراء تعديلات', 'error');
//       return;
//     }
//     setSelectedProductForEdit(product);
//     setFormData({ ...product });
//     setModalMode('edit');
//   };

//   const handleDuplicateProduct = (product: Product, e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (activeRole === 'cashier') {
//       showToast('خطأ: ليس لديك صلاحية نسخ المنتجات', 'error');
//       return;
//     }
//     const duplicated: Product = {
//       ...product,
//       id: String(products.length + 1),
//       name: `${product.name} (نسخة مكررة)`,
//       sku: `${product.sku}-COPY`,
//       barcode: String(Number(product.barcode) + 1),
//       isNew: true,
//       lastMovement: 'تم الإنشاء بالنسخ - الآن'
//     };
//     setProducts([duplicated, ...products]);
//     showToast('📄 تم استنساخ المنتج كمسودة بنجاح!');
//   };

//   const handleDeleteProduct = (id: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (activeRole === 'storekeeper') {
//       showToast('❌ عذراً: سياسة النظام تمنع أمين المستودع من حذف المنتجات نهائياً', 'warning');
//       return;
//     }
//     if (activeRole === 'cashier') {
//       showToast('خطأ: لا تملك صلاحية الحذف', 'error');
//       return;
//     }

//     setProducts(products.filter(p => p.id !== id));
//     showToast('🗑️ تم حذف المنتج بنجاح وإسقاطه من حركات المخازن.', 'warning');
//     if (drawerProduct?.id === id) setDrawerProduct(null);
//   };

//   const handleSaveProduct = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (modalMode === 'add') {
//       const statusValue = formData.quantity === 0 ? 'out' : formData.quantity <= formData.minLimit ? 'low' : 'available';
//       const newProduct: Product = {
//         id: String(products.length + 1),
//         ...formData,
//         status: statusValue,
//         lastMovement: 'إنشاء مادة جديدة - الآن',
//         turnoverRate: 'medium',
//         isNew: true
//       };
//       setProducts([newProduct, ...products]);
//       showToast('✅ تمت إضافة المنتج ونشره على السحابة بنجاح.');
//     } else if (modalMode === 'edit' && selectedProductForEdit) {
//       const statusValue = formData.quantity === 0 ? 'out' : formData.quantity <= formData.minLimit ? 'low' : 'available';
      
//       if (activeRole === 'storekeeper' && (formData.purchasePrice !== selectedProductForEdit.purchasePrice || formData.sellingPrice !== selectedProductForEdit.sellingPrice)) {
//         showToast('🔒 تم تقييد العملية: يسمح لأمين المستودع فقط بتعديل الكمية والمخزون دون الأسعار التجارية', 'warning');
//         return;
//       }

//       setProducts(products.map(p => p.id === selectedProductForEdit.id ? { 
//         ...p, 
//         ...formData, 
//         status: statusValue,
//         lastMovement: 'تحديث المخزن - الآن' 
//       } : p));
//       showToast('🔧 تم تحديث بيانات المنتج والمخزون الحالي.');
//     }
//     setModalMode(null);
//   };

//   return (
//     <div className="flex flex-col w-full font-sans relative" dir={isRtl ? 'rtl' : 'ltr'}>

//       {/* الحاضن الفعلي لمحتوى الصفحة */}
//       <div className="w-full">

//         {/* مساحة المحتوى */}
//         <div className="p-6 space-y-6 bg-slate-50/50">
          
//           {/* محاكي شاشة منع الكاشير في حال تعيين صلاحيته */}
//           {activeRole === 'cashier' ? (
//             <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl mx-auto my-12 shadow-sm">
//               <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 text-3xl mx-auto mb-4">🔒</div>
//               <h2 className="text-lg font-black text-slate-800 mb-2">عذراً، لا تملك صلاحية دخول شاشة الإدارة</h2>
//               <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
//                 حسب السياسات الأمنية المعتمدة لنظام <span className="font-semibold">SmartCheckout</span>، يُسمح للكاشير فقط بعرض المنتجات واستدعائها داخل شاشة المبيعات الفورية (POS Screen) ولا تتاح له صلاحيات جرد المخازن أو الاطلاع على الأسعار التجارية للشركات.
//               </p>
//             </div>
//           ) : (
//             <>
//               {/* ==========================================
//                   القسم الثالث: بطاقات الإحصائيات مع عداد متحرك (Cards)
//                   ========================================== */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {/* إجمالي المنتجات */}
//                 <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
//                   <div className="space-y-1">
//                     <span className="text-xs font-bold text-slate-400">📦 إجمالي المنتجات</span>
//                     <h3 className="text-2xl font-black text-slate-800 transition-all">
//                       {isLoading ? '...' : countTotal.toLocaleString()}
//                     </h3>
//                   </div>
//                   <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">∑</div>
//                 </div>

//                 {/* متوفرة */}
//                 <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
//                   <div className="space-y-1">
//                     <span className="text-xs font-bold text-slate-400">🟢 منتجات متوفرة</span>
//                     <h3 className="text-2xl font-black text-emerald-600">
//                       {isLoading ? '...' : countAvailable.toLocaleString()}
//                     </h3>
//                   </div>
//                   <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">✓</div>
//                 </div>

//                 {/* منخفض المخزون */}
//                 <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
//                   <div className="space-y-1">
//                     <span className="text-xs font-bold text-slate-400">🟠 منخفضة المخزون</span>
//                     <h3 className="text-2xl font-black text-amber-500">
//                       {isLoading ? '...' : countLow.toLocaleString()}
//                     </h3>
//                   </div>
//                   <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">⚠️</div>
//                 </div>

//                 {/* نفدت الكمية */}
//                 <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
//                   <div className="space-y-1">
//                     <span className="text-xs font-bold text-slate-400">🔴 نفدت الكمية</span>
//                     <h3 className="text-2xl font-black text-rose-600">
//                       {isLoading ? '...' : countOut.toLocaleString()}
//                     </h3>
//                   </div>
//                   <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl">✕</div>
//                 </div>
//               </div>

//               {/* ==========================================
//                   القسم الرابع والخامس: شريط البحث، الفلاتر الذكية، وأزرار العمليات
//                   ========================================== */}
//               <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-4">
                
//                 {/* أزرار العمليات التنفيذية */}
//                 <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
//                   <div className="flex items-center gap-2">
//                     <button 
//                       onClick={handleOpenAddModal}
//                       className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
//                     >
//                       <span>➕</span> إضافة منتج جديد
//                     </button>
//                     <button onClick={() => showToast('⬆️ جاري معالجة ورفع ملف الـ Excel إلى السحابة...')} className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1">
//                       <span>⬆</span> استيراد Excel
//                     </button>
//                     <button onClick={() => showToast('⬇️ تم تصدير ملف إكسل بكامل جرد المخازن')} className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1">
//                       <span>⬇</span> تصدير Excel
//                     </button>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button onClick={() => navigate('/warehouse')} className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1">
//                       <span>🏭</span> عرض لوحة المستودع
//                     </button>
//                     <button onClick={() => window.print()} className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1">
//                       <span>🖨</span> طباعة التقارير
//                     </button>
//                   </div>
//                 </div>

//                 {/* شريط البحث المباشر والفلاتر */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
//                   {/* خانة البحث المتعدد الفوري بدون زر */}
//                   <div className="lg:col-span-2 relative">
//                     <input 
//                       type="text"
//                       placeholder="البحث بالاسم، الباركود، SKU، الكود الداخلي..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
//                     />
//                     <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
//                   </div>

//                   {/* فلتر التصنيفات */}
//                   <div>
//                     <select 
//                       value={filterCategory}
//                       onChange={(e) => setFilterCategory(e.target.value)}
//                       className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
//                     >
//                       <option value="الكل">كل التصنيفات</option>
//                       <option value="مشروبات">مشروبات</option>
//                       <option value="منظفات">منظفات</option>
//                       <option value="ألبان">ألبان</option>
//                     </select>
//                   </div>

//                   {/* فلتر الحالة التشغيلية للمخزون */}
//                   <div>
//                     <select
//                       value={filterStatus}
//                       onChange={(e) => setFilterStatus(e.target.value)}
//                       className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
//                     >
//                       <option value="الكل">كل الحالات المخزنية</option>
//                       <option value="available">🟢 متوفر</option>
//                       <option value="low">🟠 منخفض المخزون</option>
//                       <option value="out">🔴 نفدت الكمية</option>
//                     </select>
//                   </div>

//                   {/* فلتر الموردين */}
//                   <div>
//                     <select
//                       value={filterSupplier}
//                       onChange={(e) => setFilterSupplier(e.target.value)}
//                       className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
//                     >
//                       <option value="الكل">جميع الموردين</option>
//                       <option value="شركة المراعي الوطنية">شركة المراعي الوطنية</option>
//                       <option value="مجموعة التوريدات الكيماوية">مجموعة التوريدات الكيماوية</option>
//                       <option value="مصنع مياه نقي العذبة">مصنع مياه نقي العذبة</option>
//                     </select>
//                   </div>
//                 </div>

//               </div>

//               {/* ==========================================
//                   القسم السادس: جدول المنتجات الاحترافي مع تأثير التمرير
//                   ========================================== */}
//               <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-start border-collapse select-none">
//                     <thead>
//                       <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold border-b border-slate-100 text-right">
//                         <th className="p-3.5">صورة المنتج</th>
//                         <th className="p-3.5">اسم المنتج</th>
//                         <th className="p-3.5">SKU / الباركود</th>
//                         <th className="p-3.5">التصنيف</th>
//                         <th className="p-3.5">سعر الشراء</th>
//                         <th className="p-3.5">سعر البيع</th>
//                         <th className="p-3.5">الكمية الحالية</th>
//                         <th className="p-3.5">معدل الدوران</th>
//                         <th className="p-3.5">آخر حركة مخزنية</th>
//                         <th className="p-3.5">الحالة</th>
//                         <th className="p-3.5 text-center">العمليات</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      
//                       {/* عرض الـ Skeleton في حالة التحميل */}
//                       {isLoading ? (
//                         [1, 2, 3].map((n) => (
//                           <tr key={n} className="animate-pulse">
//                             <td className="p-4"><div className="w-10 h-10 bg-slate-200 rounded-lg"></div></td>
//                             <td className="p-4"><div className="h-3 bg-slate-200 rounded w-24"></div></td>
//                             <td className="p-4"><div className="h-3 bg-slate-200 rounded w-20"></div></td>
//                             <td className="p-4"><div className="h-3 bg-slate-200 rounded w-12"></div></td>
//                             <td className="p-4"><div className="h-3 bg-slate-200 rounded w-14"></div></td>
//                             <td className="p-4"><div className="h-3 bg-slate-200 rounded w-14"></div></td>
//                             <td className="p-4"><div className="h-3 bg-slate-200 rounded w-10"></div></td>
//                             <td className="p-4"><div className="h-3 bg-slate-200 rounded w-12"></div></td>
//                             <td className="p-4"><div className="h-3 bg-slate-200 rounded w-28"></div></td>
//                             <td className="p-4"><div className="h-5 bg-slate-200 rounded-full w-16"></div></td>
//                             <td className="p-4"><div className="h-7 bg-slate-200 rounded-lg w-24 mx-auto"></div></td>
//                           </tr>
//                         ))
//                       ) : filteredProducts.length === 0 ? (
//                         <tr>
//                           <td colSpan={11} className="p-8 text-center text-slate-400 font-bold">
//                             ⚠️ لم يتم العثور على أي منتج يطابق معايير البحث والفلترة المحددة.
//                           </td>
//                         </tr>
//                       ) : (
//                         filteredProducts.map((product) => (
//                           <tr 
//                             key={product.id} 
//                             onClick={() => setDrawerProduct(product)}
//                             className="hover:bg-blue-50/40 cursor-pointer transition-colors duration-150 group"
//                           >
//                             <td className="p-3.5 relative">
//                               <div className="relative w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
//                                 <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                
//                                 {product.status === 'low' && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-500 border border-white rounded-full"></span>}
//                                 {product.status === 'out' && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border border-white rounded-full"></span>}
//                               </div>
//                               {product.isNew && (
//                                 <span className="absolute -top-1 right-2 bg-emerald-500 text-white text-[8px] font-black px-1 rounded-sm scale-90">🟢 جديد</span>
//                               )}
//                             </td>

//                             <td className="p-3.5 font-bold text-slate-900">{product.name}</td>
//                             <td className="p-3.5 text-slate-500 font-mono">
//                               <div className="text-[10px] text-slate-400">{product.sku}</div>
//                               <div>{product.barcode}</div>
//                             </td>
//                             <td className="p-3.5 text-slate-600"><span className="bg-slate-100 px-2 py-1 rounded-md">{product.category}</span></td>
//                             <td className="p-3.5 font-bold text-slate-500">{product.purchasePrice.toLocaleString()} ل.س</td>
//                             <td className="p-3.5 font-bold text-blue-600">{product.sellingPrice.toLocaleString()} ل.س</td>
                            
//                             <td className={`p-3.5 font-black ${product.quantity <= product.minLimit ? 'text-amber-600' : 'text-slate-800'}`}>
//                               {product.quantity} <span className="text-[10px] text-slate-400 font-normal">{product.unit}</span>
//                             </td>

//                             <td className="p-3.5">
//                               <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
//                                 product.turnoverRate === 'fast' ? 'bg-indigo-50 text-indigo-600' : 
//                                 product.turnoverRate === 'medium' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-500'
//                               }`}>
//                                 {product.turnoverRate === 'fast' ? 'سريع الدوران' : product.turnoverRate === 'medium' ? 'متوسط' : 'بطيء'}
//                               </span>
//                             </td>

//                             <td className="p-3.5 text-[11px] text-slate-400 font-medium">{product.lastMovement}</td>

//                             <td className="p-3.5">
//                               {product.status === 'available' && <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] px-2 py-1 rounded-full font-bold">🟢 متوفر</span>}
//                               {product.status === 'low' && <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] px-2 py-1 rounded-full font-bold">🟠 منخفض</span>}
//                               {product.status === 'out' && <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-[10px] px-2 py-1 rounded-full font-bold">🔴 نفد</span>}
//                             </td>

//                             <td className="p-3.5 text-center">
//                               <div className="flex items-center justify-center gap-1">
//                                 <button title="عرض التفاصيل الكاملة" className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors">👁️</button>
//                                 <button onClick={(e) => handleOpenEditModal(product, e)} title="تعديل بيانات المنتج" className="p-1 text-amber-500 hover:bg-amber-50 rounded transition-colors">✏️</button>
//                                 <button onClick={(e) => handleDuplicateProduct(product, e)} title="استنساخ ونسخ المنتج" className="p-1 text-indigo-500 hover:bg-indigo-50 rounded transition-colors">📄</button>
//                                 <button 
//                                   onClick={(e) => handleDeleteProduct(product.id, e)} 
//                                   title="حذف المنتج من السحابة" 
//                                   className={`p-1 rounded transition-colors ${activeRole === 'storekeeper' ? 'text-slate-300 cursor-not-allowed' : 'text-rose-500 hover:bg-rose-50'}`}
//                                 >
//                                   🗑️
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))
//                       )}

//                     </tbody>
//                   </table>
//                 </div>

//                 {/* ==========================================
//                     القسم السابع: الترقيم ونظام الصفحات (Pagination)
//                     ========================================== */}
//                 <div className="bg-white border-t border-slate-100 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500 font-bold">
//                   <span>إظهار 1 إلى {filteredProducts.length} من أصل {products.length} مادة مخزنية</span>
//                   <div className="flex items-center gap-1">
//                     <button className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed">السابق</button>
//                     <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/10">1</button>
//                     <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">2</button>
//                     <button className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">التالي</button>
//                   </div>
//                 </div>

//               </div>
//             </>
//           )}

//         </div>
//       </div>

//       {/* ==========================================
//           القسم الثامن: الـ Drawer الجانبي لعرض كامل تفاصيل المادة
//           ========================================== */}
//       {drawerProduct && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end transition-opacity duration-300">
//           <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left p-6 overflow-y-auto">
//             <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
//               <h2 className="text-sm font-black text-slate-800">👁️ تفاصيل مادة كرت الصنف السحابي</h2>
//               <button onClick={() => setDrawerProduct(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">✕</button>
//             </div>

//             <div className="space-y-4">
//               <div className="w-28 h-28 bg-slate-50 rounded-xl border border-slate-200 mx-auto overflow-hidden relative">
//                 <img src={drawerProduct.image} alt={drawerProduct.name} className="w-full h-full object-cover" />
//               </div>

//               <div className="text-center">
//                 <h3 className="font-black text-slate-900 text-sm">{drawerProduct.name}</h3>
//                 <span className="text-xs text-blue-600 font-mono">{drawerProduct.sku}</span>
//               </div>

//               <div className="grid grid-cols-2 gap-3 pt-2">
//                 <div className="bg-slate-50 p-2 rounded-lg text-right">
//                   <span className="block text-[10px] text-slate-400 font-bold">رقم الباركود الدولي</span>
//                   <span className="text-xs font-mono font-bold text-slate-800">{drawerProduct.barcode}</span>
//                 </div>
//                 <div className="bg-slate-50 p-2 rounded-lg text-right">
//                   <span className="block text-[10px] text-slate-400 font-bold">التصنيف الحالي</span>
//                   <span className="text-xs font-bold text-slate-800">{drawerProduct.category}</span>
//                 </div>
//                 <div className="bg-slate-50 p-2 rounded-lg text-right">
//                   <span className="block text-[10px] text-slate-400 font-bold">سعر تكلفة الشراء</span>
//                   <span className="text-xs font-bold text-slate-700">{drawerProduct.purchasePrice.toLocaleString()} ل.س</span>
//                 </div>
//                 <div className="bg-slate-50 p-2 rounded-lg text-right">
//                   <span className="block text-[10px] text-slate-400 font-bold">سعر البيع للمستهلك</span>
//                   <span className="text-xs font-bold text-blue-600">{drawerProduct.sellingPrice.toLocaleString()} ل.س</span>
//                 </div>
//                 <div className="bg-slate-50 p-2 rounded-lg text-right">
//                   <span className="block text-[10px] text-slate-400 font-bold">الكمية المتوفرة بالمستودع</span>
//                   <span className="text-xs font-black text-slate-900">{drawerProduct.quantity} ({drawerProduct.unit})</span>
//                 </div>
//                 <div className="bg-slate-50 p-2 rounded-lg text-right">
//                   <span className="block text-[10px] text-slate-400 font-bold">الحد الأدنى لطلب التوريد</span>
//                   <span className="text-xs font-bold text-amber-600">{drawerProduct.minLimit}</span>
//                 </div>
//               </div>

//               <div className="bg-slate-50 p-3 rounded-lg text-right space-y-1">
//                 <span className="block text-[10px] text-slate-400 font-bold">المورد المعتمد</span>
//                 <span className="text-xs font-bold text-slate-800">{drawerProduct.supplier}</span>
//               </div>

//               <div className="bg-slate-50 p-3 rounded-lg text-right space-y-1">
//                 <span className="block text-[10px] text-slate-400 font-bold">الوصف التجاري للمادة</span>
//                 <p className="text-xs text-slate-600 font-medium leading-relaxed">{drawerProduct.description || 'لا يوجد وصف مضاف لهذا الصنف.'}</p>
//               </div>

//               <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 space-y-1">
//                 <div>🗓️ **آخر حركة مخزنية:** {drawerProduct.lastMovement}</div>
//                 <div>👤 **رتبة آخر تعديل للبيانات:** {activeRole === 'manager' ? 'المدير العام' : 'أمين المستودع الرئيسي'}</div>
//                 <div>🛒 **آخر عملية بيع مسجلة بنقاط البيع:** اليوم منذ ساعتين</div>
//                 <div>📦 **آخر حركة توريد وشراء:** 2026-07-05</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ==========================================
//           القسم التاسع: نافذة (Modal) إضافة وتعديل المنتجات والمواد
//           ========================================== */}
//       {modalMode !== null && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
//             <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//               <h2 className="text-base font-black text-slate-800">
//                 {modalMode === 'add' ? '➕ إنشاء وإدراج بطاقة منتج سحابي' : '✏️ تعديل صنف مخزني قائم'}
//               </h2>
//               <button onClick={() => setModalMode(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">✕</button>
//             </div>

//             <form onSubmit={handleSaveProduct} className="space-y-4 text-right">
//               {activeRole === 'storekeeper' && modalMode === 'edit' && (
//                 <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-800 font-medium">
//                   🔒 تنبيه الحماية: بصفتك أمين مستودع، تم إقفال حقول أسعار البيع والشراء برمجياً، ويُسمح لك فقط بتعديل كمية الرف والحد الأدنى.
//                 </div>
//               )}

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">اسم المنتج المادة *</label>
//                   <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50" placeholder="مثال: مياه غازية منعشة 330 مل" />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">التصنيف الإداري</label>
//                   <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none" >
//                     <option value="مشروبات">مشروبات</option>
//                     <option value="منظفات">منظفات</option>
//                     <option value="ألبان">ألبان</option>
//                   </select>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">الباركود الدولي (Barcode)</label>
//                   <input type="text" required value={formData.barcode} onChange={(e) => setFormData({...formData, barcode: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50" />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">كود التخزين (SKU)</label>
//                   <input type="text" required value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50" />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">وحدة قياس الصنف</label>
//                   <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white" >
//                     <option value="قطعة">قطعة</option>
//                     <option value="كرتون">كرتون</option>
//                     <option value="كيلو">كيلو</option>
//                     <option value="لتر">لتر</option>
//                   </select>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">المورد المعتمد</label>
//                   <select value={formData.supplier} onChange={(e) => setFormData({...formData, supplier: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white" >
//                     <option value="شركة المراعي الوطنية">شركة المراعي الوطنية</option>
//                     <option value="مجموعة التوريدات الكيماوية">مجموعة التوريدات الكيماوية</option>
//                     <option value="مصنع مياه نقي العذبة">مصنع مياه نقي العذبة</option>
//                   </select>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">سعر كلفة الشراء (ل.س)</label>
//                   <input type="number" required value={formData.purchasePrice} onChange={(e) => setFormData({...formData, purchasePrice: Number(e.target.value)})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50" />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">سعر البيع الافتراضي (ل.س)</label>
//                   <input type="number" required value={formData.sellingPrice} onChange={(e) => setFormData({...formData, sellingPrice: Number(e.target.value)})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50" />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">الكمية الافتتاحية الحالية *</label>
//                   <input type="number" required value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="block text-xs font-bold text-slate-600">حد الأمان الأدنى للمخزون</label>
//                   <input type="number" required value={formData.minLimit} onChange={(e) => setFormData({...formData, minLimit: Number(e.target.value)})} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <label className="block text-xs font-bold text-slate-600">شرح ووصف كرت صنف المادة</label>
//                 <textarea rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50" placeholder="اكتب تفاصيل إضافية لمساعدة أمناء المستودعات والكاشيرية..."></textarea>
//               </div>

//               <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
//                 <button type="button" onClick={() => setModalMode(null)} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">إلغاء الأمر</button>
//                 <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm">حفظ وتأكيد التغييرات السحابية</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ==========================================
//           نظام الـ Toasts المنبثق التفاعلي اللحظي
//           ========================================== */}
//       <div className="fixed bottom-4 left-4 z-50 space-y-2 pointer-events-none max-w-sm">
//         {toasts.map((toast) => (
//           <div 
//             key={toast.id}
//             className={`p-3.5 rounded-xl shadow-lg text-xs font-bold text-white flex items-center gap-2 pointer-events-auto animate-slide-up ${
//               toast.type === 'success' ? 'bg-slate-900' : 
//               toast.type === 'warning' ? 'bg-amber-600' : 
//               toast.type === 'error' ? 'bg-rose-600' : 'bg-blue-600'
//             }`}
//           >
//             <span>{toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : toast.type === 'error' ? '🔒' : 'ℹ️'}</span>
//             <span>{toast.message}</span>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }




























import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';

interface DashboardContext {
  isRtl: boolean;
  setIsRtl: React.Dispatch<React.SetStateAction<boolean>>;
  setPageData: React.Dispatch<React.SetStateAction<any>>;
}

// ==========================================
// 1. الأنماط والواجهات البرمجية (Types & Interfaces)
// ==========================================
interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  minLimit: number;
  status: 'available' | 'low' | 'out' | 'hidden';
  supplier: string;
  unit: string;
  description: string;
  image: string;
  lastMovement: string;     
  turnoverRate: 'fast' | 'medium' | 'slow'; 
  isNew?: boolean;
}

type UserRole = 'manager' | 'storekeeper' | 'cashier';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export default function ProductsManagementPage() {
  // ==========================================
  // 2. حالات الصفحة والمخازن الـ State
  // ==========================================
  const { isRtl } = useOutletContext<DashboardContext>();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ تحديد الدور تلقائياً حسب المسار: /warehouse/... => أمين مستودع، غير هيك => مدير
  const [activeRole, setActiveRole] = useState<UserRole>(
    location.pathname.startsWith('/warehouse') ? 'storekeeper' : 'manager'
  );

  useEffect(() => {
    setActiveRole(location.pathname.startsWith('/warehouse') ? 'storekeeper' : 'manager');
  }, [location.pathname]);

  const [isLoading, setIsLoading] = useState(true);

  // حالات العدادات الإحصائية المتحركة
  const [countTotal, setCountTotal] = useState(0);
  const [countAvailable, setCountAvailable] = useState(0);
  const [countLow, setCountLow] = useState(0);
  const [countOut, setCountOut] = useState(0);

  // الفلاتر والبحث
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [filterSupplier, setFilterSupplier] = useState('الكل');

  // معالجة النوافذ المنبثقة (Modals & Drawers)
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);

  // نظام التنبيهات
  const [toasts, setToasts] = useState<Toast[]>([]);

  // البيانات الوهمية
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'حليب كامل الدسم 1 ليتر',
      sku: 'MILK-001',
      barcode: '628100012345',
      category: 'ألبان',
      purchasePrice: 12000,
      sellingPrice: 15000,
      quantity: 110,
      minLimit: 20,
      status: 'available',
      supplier: 'شركة المراعي الوطنية',
      unit: 'قطعة',
      description: 'حليب بقري طبيعي طازج معقم طويل الأجل ومجنس.',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=150&auto=format&fit=crop&q=60',
      lastMovement: 'بيع - اليوم 12:40 م',
      turnoverRate: 'fast',
      isNew: true
    },
    {
      id: '2',
      name: 'منظف زجاج سوبر كلين',
      sku: 'DET-552',
      barcode: '628200098765',
      category: 'منظفات',
      purchasePrice: 22000,
      sellingPrice: 28000,
      quantity: 12,
      minLimit: 15,
      status: 'low',
      supplier: 'مجموعة التوريدات الكيماوية',
      unit: 'قطعة',
      description: 'بخاخ منظف زجاج ومرايا فعال يزيل الدهون والأوساخ دون ترك أثر.',
      image: 'https://images.unsplash.com/photo-1581781894090-a5b5145014b1?w=150&auto=format&fit=crop&q=60',
      lastMovement: 'شراء - أمس 04:15 م',
      turnoverRate: 'medium'
    },
    {
      id: '3',
      name: 'مياه معدنية نقي 500 مل',
      sku: 'WAT-009',
      barcode: '628300044556',
      category: 'مشروبات',
      purchasePrice: 1500,
      sellingPrice: 2500,
      quantity: 0,
      minLimit: 50,
      status: 'out',
      supplier: 'مصنع مياه نقي العذبة',
      unit: 'كرتون',
      description: 'مياه شرب معبأة جوفية طبيعية نقية ومفلترة.',
      image: 'https://images.unsplash.com/photo-1608885898957-a599fb1cb4a7?w=150&auto=format&fit=crop&q=60',
      lastMovement: 'بيع - 2026-07-11',
      turnoverRate: 'fast'
    },
    {
      id: '4',
      name: 'عصير برتقال طبيعي غازي',
      sku: 'BEV-102',
      barcode: '628400033221',
      category: 'مشروبات',
      purchasePrice: 4500,
      sellingPrice: 6000,
      quantity: 988,
      minLimit: 30,
      status: 'available',
      supplier: 'شركة المراعي الوطنية',
      unit: 'قطعة',
      description: 'عصير برتقال منعش بنسبة غازية خفيفة بدون ألوان صناعية.',
      image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=150&auto=format&fit=crop&q=60',
      lastMovement: 'تعديل مخزن - 2026-07-09',
      turnoverRate: 'slow'
    }
  ]);

  // نموذج الحقول لملء نموذج إضافة/تعديل منتج جديد
  const [formData, setFormData] = useState({
    name: '', sku: '', barcode: '', category: 'مشروبات',
    purchasePrice: 0, sellingPrice: 0, quantity: 0, minLimit: 0,
    supplier: 'شركة المراعي الوطنية', unit: 'قطعة', description: '', image: ''
  });

  // ==========================================
  // 3. التأثيرات الحركية والتحميل (Effects)
  // ==========================================
  useEffect(() => {
    const loaderTimeout = setTimeout(() => {
      setIsLoading(false);
      animateCounter(1250, setCountTotal);
      animateCounter(1110, setCountAvailable);
      animateCounter(35, setCountLow);
      animateCounter(8, setCountOut);
    }, 1200);

    return () => clearTimeout(loaderTimeout);
  }, []);

  const animateCounter = (target: number, setCounter: React.Dispatch<React.SetStateAction<number>>) => {
    let start = 0;
    const duration = 1000; 
    const stepTime = Math.max(Math.floor(duration / target), 10);
    const timer = setInterval(() => {
      start += Math.ceil(target / 40);
      if (start >= target) {
        setCounter(target);
        clearInterval(timer);
      } else {
        setCounter(start);
      }
    }, stepTime);
  };

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // ==========================================
  // 4. منطق الفلترة والتحكم بالصلاحيات
  // ==========================================
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm);
    
    const matchesCategory = filterCategory === 'الكل' || p.category === filterCategory;
    const matchesStatus = filterStatus === 'الكل' || p.status === filterStatus;
    const matchesSupplier = filterSupplier === 'الكل' || p.supplier === filterSupplier;

    return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
  });

  // ==========================================
  // 5. وظائف إدارة المنتجات والعمليات المخزنية
  // ==========================================
  const handleOpenAddModal = () => {
    if (activeRole === 'cashier') {
      showToast('خطأ: لا يملك الكاشير صلاحية الوصول للوحة الإدارة', 'error');
      return;
    }
    setFormData({
      name: '', sku: `SKU-${Math.floor(100 + Math.random() * 900)}`, barcode: String(Math.floor(628000000000 + Math.random() * 99999999)),
      category: 'مشروبات', purchasePrice: 0, sellingPrice: 0, quantity: 1, minLimit: 5,
      supplier: 'شركة المراعي الوطنية', unit: 'قطعة', description: '', image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=150&auto=format&fit=crop&q=60'
    });
    setModalMode('add');
  };

  const handleOpenEditModal = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeRole === 'cashier') {
      showToast('خطأ: الصلاحيات الحالية لا تسمح بإجراء تعديلات', 'error');
      return;
    }
    setSelectedProductForEdit(product);
    setFormData({ ...product });
    setModalMode('edit');
  };

  const handleDuplicateProduct = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeRole === 'cashier') {
      showToast('خطأ: ليس لديك صلاحية نسخ المنتجات', 'error');
      return;
    }
    const duplicated: Product = {
      ...product,
      id: String(products.length + 1),
      name: `${product.name} (نسخة مكررة)`,
      sku: `${product.sku}-COPY`,
      barcode: String(Number(product.barcode) + 1),
      isNew: true,
      lastMovement: 'تم الإنشاء بالنسخ - الآن'
    };
    setProducts([duplicated, ...products]);
    showToast('📄 تم استنساخ المنتج كمسودة بنجاح!');
  };

  const handleDeleteProduct = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeRole === 'storekeeper') {
      showToast('❌ عذراً: سياسة النظام تمنع أمين المستودع من حذف المنتجات نهائياً', 'warning');
      return;
    }
    if (activeRole === 'cashier') {
      showToast('خطأ: لا تملك صلاحية الحذف', 'error');
      return;
    }

    setProducts(products.filter(p => p.id !== id));
    showToast('🗑️ تم حذف المنتج بنجاح وإسقاطه من حركات المخازن.', 'warning');
    if (drawerProduct?.id === id) setDrawerProduct(null);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const statusValue = formData.quantity === 0 ? 'out' : formData.quantity <= formData.minLimit ? 'low' : 'available';
      const newProduct: Product = {
        id: String(products.length + 1),
        ...formData,
        status: statusValue,
        lastMovement: 'إنشاء مادة جديدة - الآن',
        turnoverRate: 'medium',
        isNew: true
      };
      setProducts([newProduct, ...products]);
      showToast('✅ تمت إضافة المنتج ونشره على السحابة بنجاح.');
    } else if (modalMode === 'edit' && selectedProductForEdit) {
      const statusValue = formData.quantity === 0 ? 'out' : formData.quantity <= formData.minLimit ? 'low' : 'available';
      
      if (activeRole === 'storekeeper' && (formData.purchasePrice !== selectedProductForEdit.purchasePrice || formData.sellingPrice !== selectedProductForEdit.sellingPrice)) {
        showToast('🔒 تم تقييد العملية: يسمح لأمين المستودع فقط بتعديل الكمية والمخزون دون الأسعار التجارية', 'warning');
        return;
      }

      setProducts(products.map(p => p.id === selectedProductForEdit.id ? { 
        ...p, 
        ...formData, 
        status: statusValue,
        lastMovement: 'تحديث المخزن - الآن' 
      } : p));
      showToast('🔧 تم تحديث بيانات المنتج والمخزون الحالي.');
    }
    setModalMode(null);
  };

  return (
    <div className="flex flex-col w-full font-sans relative" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* الحاضن الفعلي لمحتوى الصفحة */}
      <div className="w-full">

        {/* مساحة المحتوى */}
        <div className="p-6 space-y-6 bg-slate-50/50">
          
          {/* محاكي شاشة منع الكاشير في حال تعيين صلاحيته */}
          {activeRole === 'cashier' ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl mx-auto my-12 shadow-sm">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 text-3xl mx-auto mb-4">🔒</div>
              <h2 className="text-lg font-black text-slate-800 mb-2">عذراً، لا تملك صلاحية دخول شاشة الإدارة</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                حسب السياسات الأمنية المعتمدة لنظام <span className="font-semibold">SmartCheckout</span>، يُسمح للكاشير فقط بعرض المنتجات واستدعائها داخل شاشة المبيعات الفورية (POS Screen) ولا تتاح له صلاحيات جرد المخازن أو الاطلاع على الأسعار التجارية للشركات.
              </p>
            </div>
          ) : (
            <>
              {/* ==========================================
                  القسم الثالث: بطاقات الإحصائيات مع عداد متحرك (Cards)
                  ========================================== */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* إجمالي المنتجات */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400">📦 إجمالي المنتجات</span>
                    <h3 className="text-2xl font-black text-slate-800 transition-all">
                      {isLoading ? '...' : countTotal.toLocaleString()}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">∑</div>
                </div>

                {/* متوفرة */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400">🟢 منتجات متوفرة</span>
                    <h3 className="text-2xl font-black text-emerald-600">
                      {isLoading ? '...' : countAvailable.toLocaleString()}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">✓</div>
                </div>

                {/* منخفض المخزون */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400">🟠 منخفضة المخزون</span>
                    <h3 className="text-2xl font-black text-amber-500">
                      {isLoading ? '...' : countLow.toLocaleString()}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">⚠️</div>
                </div>

                {/* نفدت الكمية */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400">🔴 نفدت الكمية</span>
                    <h3 className="text-2xl font-black text-rose-600">
                      {isLoading ? '...' : countOut.toLocaleString()}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl">✕</div>
                </div>
              </div>

              {/* ==========================================
                  القسم الرابع والخامس: شريط البحث، الفلاتر الذكية، وأزرار العمليات
                  ========================================== */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-4">
                
                {/* أزرار العمليات التنفيذية */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleOpenAddModal}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>➕</span> إضافة منتج جديد
                    </button>
                    <button onClick={() => showToast('⬆️ جاري معالجة ورفع ملف الـ Excel إلى السحابة...')} className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1">
                      <span>⬆</span> استيراد Excel
                    </button>
                    <button onClick={() => showToast('⬇️ تم تصدير ملف إكسل بكامل جرد المخازن')} className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1">
                      <span>⬇</span> تصدير Excel
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/warehouse')} className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1">
                      <span>🏭</span> عرض لوحة المستودع
                    </button>
                    <button onClick={() => window.print()} className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1">
                      <span>🖨</span> طباعة التقارير
                    </button>
                  </div>
                </div>

                {/* شريط البحث المباشر والفلاتر */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* خانة البحث المتعدد الفوري بدون زر */}
                  <div className="lg:col-span-2 relative">
                    <input 
                      type="text"
                      placeholder="البحث بالاسم، الباركود، SKU، الكود الداخلي..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                    />
                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
                  </div>

                  {/* فلتر التصنيفات */}
                  <div>
                    <select 
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="الكل">كل التصنيفات</option>
                      <option value="مشروبات">مشروبات</option>
                      <option value="منظفات">منظفات</option>
                      <option value="ألبان">ألبان</option>
                    </select>
                  </div>

                  {/* فلتر الحالة التشغيلية للمخزون */}
                  <div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="الكل">كل الحالات المخزنية</option>
                      <option value="available">🟢 متوفر</option>
                      <option value="low">🟠 منخفض المخزون</option>
                      <option value="out">🔴 نفدت الكمية</option>
                    </select>
                  </div>

                  {/* فلتر الموردين */}
                  <div>
                    <select
                      value={filterSupplier}
                      onChange={(e) => setFilterSupplier(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="الكل">جميع الموردين</option>
                      <option value="شركة المراعي الوطنية">شركة المراعي الوطنية</option>
                      <option value="مجموعة التوريدات الكيماوية">مجموعة التوريدات الكيماوية</option>
                      <option value="مصنع مياه نقي العذبة">مصنع مياه نقي العذبة</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* ==========================================
                  القسم السادس: جدول المنتجات الاحترافي مع تأثير التمرير
                  ========================================== */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-start border-collapse select-none">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold border-b border-slate-100 text-right">
                        <th className="p-3.5">صورة المنتج</th>
                        <th className="p-3.5">اسم المنتج</th>
                        <th className="p-3.5">SKU / الباركود</th>
                        <th className="p-3.5">التصنيف</th>
                        <th className="p-3.5">سعر الشراء</th>
                        <th className="p-3.5">سعر البيع</th>
                        <th className="p-3.5">الكمية الحالية</th>
                        <th className="p-3.5">معدل الدوران</th>
                        <th className="p-3.5">آخر حركة مخزنية</th>
                        <th className="p-3.5">الحالة</th>
                        <th className="p-3.5 text-center">العمليات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      
                      {/* عرض الـ Skeleton في حالة التحميل */}
                      {isLoading ? (
                        [1, 2, 3].map((n) => (
                          <tr key={n} className="animate-pulse">
                            <td className="p-4"><div className="w-10 h-10 bg-slate-200 rounded-lg"></div></td>
                            <td className="p-4"><div className="h-3 bg-slate-200 rounded w-24"></div></td>
                            <td className="p-4"><div className="h-3 bg-slate-200 rounded w-20"></div></td>
                            <td className="p-4"><div className="h-3 bg-slate-200 rounded w-12"></div></td>
                            <td className="p-4"><div className="h-3 bg-slate-200 rounded w-14"></div></td>
                            <td className="p-4"><div className="h-3 bg-slate-200 rounded w-14"></div></td>
                            <td className="p-4"><div className="h-3 bg-slate-200 rounded w-10"></div></td>
                            <td className="p-4"><div className="h-3 bg-slate-200 rounded w-12"></div></td>
                            <td className="p-4"><div className="h-3 bg-slate-200 rounded w-28"></div></td>
                            <td className="p-4"><div className="h-5 bg-slate-200 rounded-full w-16"></div></td>
                            <td className="p-4"><div className="h-7 bg-slate-200 rounded-lg w-24 mx-auto"></div></td>
                          </tr>
                        ))
                      ) : filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="p-8 text-center text-slate-400 font-bold">
                            ⚠️ لم يتم العثور على أي منتج يطابق معايير البحث والفلترة المحددة.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => (
                          <tr 
                            key={product.id} 
                            onClick={() => setDrawerProduct(product)}
                            className="hover:bg-blue-50/40 cursor-pointer transition-colors duration-150 group"
                          >
                            <td className="p-3.5 relative">
                              <div className="relative w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                
                                {product.status === 'low' && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-500 border border-white rounded-full"></span>}
                                {product.status === 'out' && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border border-white rounded-full"></span>}
                              </div>
                              {product.isNew && (
                                <span className="absolute -top-1 right-2 bg-emerald-500 text-white text-[8px] font-black px-1 rounded-sm scale-90">🟢 جديد</span>
                              )}
                            </td>

                            <td className="p-3.5 font-bold text-slate-900">{product.name}</td>
                            <td className="p-3.5 text-slate-500 font-mono">
                              <div className="text-[10px] text-slate-400">{product.sku}</div>
                              <div>{product.barcode}</div>
                            </td>
                            <td className="p-3.5 text-slate-600"><span className="bg-slate-100 px-2 py-1 rounded-md">{product.category}</span></td>
                            <td className="p-3.5 font-bold text-slate-500">{product.purchasePrice.toLocaleString()} ل.س</td>
                            <td className="p-3.5 font-bold text-blue-600">{product.sellingPrice.toLocaleString()} ل.س</td>
                            
                            <td className={`p-3.5 font-black ${product.quantity <= product.minLimit ? 'text-amber-600' : 'text-slate-800'}`}>
                              {product.quantity} <span className="text-[10px] text-slate-400 font-normal">{product.unit}</span>
                            </td>

                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                product.turnoverRate === 'fast' ? 'bg-indigo-50 text-indigo-600' : 
                                product.turnoverRate === 'medium' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {product.turnoverRate === 'fast' ? 'سريع الدوران' : product.turnoverRate === 'medium' ? 'متوسط' : 'بطيء'}
                              </span>
                            </td>

                            <td className="p-3.5 text-[11px] text-slate-400 font-medium">{product.lastMovement}</td>

                            <td className="p-3.5">
                              {product.status === 'available' && <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] px-2 py-1 rounded-full font-bold">🟢 متوفر</span>}
                              {product.status === 'low' && <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] px-2 py-1 rounded-full font-bold">🟠 منخفض</span>}
                              {product.status === 'out' && <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-[10px] px-2 py-1 rounded-full font-bold">🔴 نفد</span>}
                            </td>

                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button title="عرض التفاصيل الكاملة" className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors">👁️</button>
                                <button onClick={(e) => handleOpenEditModal(product, e)} title="تعديل بيانات المنتج" className="p-1 text-amber-500 hover:bg-amber-50 rounded transition-colors">✏️</button>
                                <button onClick={(e) => handleDuplicateProduct(product, e)} title="استنساخ ونسخ المنتج" className="p-1 text-indigo-500 hover:bg-indigo-50 rounded transition-colors">📄</button>
                                <button 
                                  onClick={(e) => handleDeleteProduct(product.id, e)} 
                                  title="حذف المنتج من السحابة" 
                                  className={`p-1 rounded transition-colors ${activeRole === 'storekeeper' ? 'text-slate-300 cursor-not-allowed' : 'text-rose-500 hover:bg-rose-50'}`}
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}

                    </tbody>
                  </table>
                </div>

                {/* ==========================================
                    القسم السابع: الترقيم ونظام الصفحات (Pagination)
                    ========================================== */}
                <div className="bg-white border-t border-slate-100 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>إظهار 1 إلى {filteredProducts.length} من أصل {products.length} مادة مخزنية</span>
                  <div className="flex items-center gap-1">
                    <button className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed">السابق</button>
                    <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/10">1</button>
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">2</button>
                    <button className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">التالي</button>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </div>

      {/* ==========================================
          القسم الثامن: الـ Drawer الجانبي لعرض كامل تفاصيل المادة
          ========================================== */}
      {drawerProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end transition-opacity duration-300">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left p-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h2 className="text-sm font-black text-slate-800">👁️ تفاصيل مادة كرت الصنف السحابي</h2>
              <button onClick={() => setDrawerProduct(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">✕</button>
            </div>

            <div className="space-y-4">
              <div className="w-28 h-28 bg-slate-50 rounded-xl border border-slate-200 mx-auto overflow-hidden relative">
                <img src={drawerProduct.image} alt={drawerProduct.name} className="w-full h-full object-cover" />
              </div>

              <div className="text-center">
                <h3 className="font-black text-slate-900 text-sm">{drawerProduct.name}</h3>
                <span className="text-xs text-blue-600 font-mono">{drawerProduct.sku}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 p-2 rounded-lg text-right">
                  <span className="block text-[10px] text-slate-400 font-bold">رقم الباركود الدولي</span>
                  <span className="text-xs font-mono font-bold text-slate-800">{drawerProduct.barcode}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg text-right">
                  <span className="block text-[10px] text-slate-400 font-bold">التصنيف الحالي</span>
                  <span className="text-xs font-bold text-slate-800">{drawerProduct.category}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg text-right">
                  <span className="block text-[10px] text-slate-400 font-bold">سعر تكلفة الشراء</span>
                  <span className="text-xs font-bold text-slate-700">{drawerProduct.purchasePrice.toLocaleString()} ل.س</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg text-right">
                  <span className="block text-[10px] text-slate-400 font-bold">سعر البيع للمستهلك</span>
                  <span className="text-xs font-bold text-blue-600">{drawerProduct.sellingPrice.toLocaleString()} ل.س</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg text-right">
                  <span className="block text-[10px] text-slate-400 font-bold">الكمية المتوفرة بالمستودع</span>
                  <span className="text-xs font-black text-slate-900">{drawerProduct.quantity} ({drawerProduct.unit})</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg text-right">
                  <span className="block text-[10px] text-slate-400 font-bold">الحد الأدنى لطلب التوريد</span>
                  <span className="text-xs font-bold text-amber-600">{drawerProduct.minLimit}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg text-right space-y-1">
                <span className="block text-[10px] text-slate-400 font-bold">المورد المعتمد</span>
                <span className="text-xs font-bold text-slate-800">{drawerProduct.supplier}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg text-right space-y-1">
                <span className="block text-[10px] text-slate-400 font-bold">الوصف التجاري للمادة</span>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{drawerProduct.description || 'لا يوجد وصف مضاف لهذا الصنف.'}</p>
              </div>

              <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 space-y-1">
                <div>🗓️ **آخر حركة مخزنية:** {drawerProduct.lastMovement}</div>
                <div>👤 **رتبة آخر تعديل للبيانات:** {activeRole === 'manager' ? 'المدير العام' : 'أمين المستودع الرئيسي'}</div>
                <div>🛒 **آخر عملية بيع مسجلة بنقاط البيع:** اليوم منذ ساعتين</div>
                <div>📦 **آخر حركة توريد وشراء:** 2026-07-05</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          القسم التاسع: نافذة (Modal) إضافة وتعديل المنتجات والمواد
          ========================================== */}
      {modalMode !== null && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-800">
                {modalMode === 'add' ? '➕ إنشاء وإدراج بطاقة منتج سحابي' : '✏️ تعديل صنف مخزني قائم'}
              </h2>
              <button onClick={() => setModalMode(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-right">
              {activeRole === 'storekeeper' && modalMode === 'edit' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-800 font-medium">
                  🔒 تنبيه الحماية: بصفتك أمين مستودع، تم إقفال حقول أسعار البيع والشراء برمجياً، ويُسمح لك فقط بتعديل كمية الرف والحد الأدنى.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600">اسم المنتج المادة *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50" placeholder="مثال: مياه غازية منعشة 330 مل" />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600">التصنيف الإداري</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none" >
                    <option value="مشروبات">مشروبات</option>
                    <option value="منظفات">منظفات</option>
                    <option value="ألبان">ألبان</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600">الباركود الدولي (Barcode)</label>
                  <input type="text" required value={formData.barcode} onChange={(e) => setFormData({...formData, barcode: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50" />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600">كود التخزين (SKU)</label>
                  <input type="text" required value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50" />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600">وحدة قياس الصنف</label>
                  <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white" >
                    <option value="قطعة">قطعة</option>
                    <option value="كرتون">كرتون</option>
                    <option value="كيلو">كيلو</option>
                    <option value="لتر">لتر</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600">المورد المعتمد</label>
                  <select value={formData.supplier} onChange={(e) => setFormData({...formData, supplier: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white" >
                    <option value="شركة المراعي الوطنية">شركة المراعي الوطنية</option>
                    <option value="مجموعة التوريدات الكيماوية">مجموعة التوريدات الكيماوية</option>
                    <option value="مصنع مياه نقي العذبة">مصنع مياه نقي العذبة</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600">سعر كلفة الشراء (ل.س)</label>
                  <input type="number" required value={formData.purchasePrice} onChange={(e) => setFormData({...formData, purchasePrice: Number(e.target.value)})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50" />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600">سعر البيع الافتراضي (ل.س)</label>
                  <input type="number" required value={formData.sellingPrice} onChange={(e) => setFormData({...formData, sellingPrice: Number(e.target.value)})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50" />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600">الكمية الافتتاحية الحالية *</label>
                  <input type="number" required value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600">حد الأمان الأدنى للمخزون</label>
                  <input type="number" required value={formData.minLimit} onChange={(e) => setFormData({...formData, minLimit: Number(e.target.value)})} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600">شرح ووصف كرت صنف المادة</label>
                <textarea rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} disabled={activeRole === 'storekeeper' && modalMode === 'edit'} className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50" placeholder="اكتب تفاصيل إضافية لمساعدة أمناء المستودعات والكاشيرية..."></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button type="button" onClick={() => setModalMode(null)} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">إلغاء الأمر</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm">حفظ وتأكيد التغييرات السحابية</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          نظام الـ Toasts المنبثق التفاعلي اللحظي
          ========================================== */}
      <div className="fixed bottom-4 left-4 z-50 space-y-2 pointer-events-none max-w-sm">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`p-3.5 rounded-xl shadow-lg text-xs font-bold text-white flex items-center gap-2 pointer-events-auto animate-slide-up ${
              toast.type === 'success' ? 'bg-slate-900' : 
              toast.type === 'warning' ? 'bg-amber-600' : 
              toast.type === 'error' ? 'bg-rose-600' : 'bg-blue-600'
            }`}
          >
            <span>{toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : toast.type === 'error' ? '🔒' : 'ℹ️'}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}