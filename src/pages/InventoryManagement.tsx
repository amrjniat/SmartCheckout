// import React, { useState, useMemo } from 'react';
// import { 
//   Search, Filter, Package, ArrowDownToLine, ArrowUpFromLine, 
//   AlertTriangle, XCircle, Eye, Plus, Minus, Edit, History, 
//   X, CheckCircle, BarChart3
// } from 'lucide-react';

// // ================= Types =================
// interface StockMovement {
//   id: string;
//   date: string;
//   type: 'add' | 'subtract' | 'set';
//   quantity: number;
//   user: string;
//   reason: string;
// }

// interface ProductInventory {
//   id: string;
//   image: string;
//   name: string;
//   sku: string;
//   category: string;
//   currentQty: number;
//   minQty: number;
//   lastMovement: string;
//   lastUpdate: string;
//   history: StockMovement[];
// }

// // ================= Mock Data =================
// const mockData: ProductInventory[] = [
//   {
//     id: '1',
//     image: 'https://via.placeholder.com/40',
//     name: 'قهوة اسبريسو 1 كغ',
//     sku: 'SKU-COF-001',
//     category: 'مشروبات',
//     currentQty: 120,
//     minQty: 20,
//     lastMovement: '+50',
//     lastUpdate: '2026-07-15',
//     history: [
//       { id: 'h1', date: '2026-07-15 10:30', type: 'add', quantity: 50, user: 'أمين المستودع', reason: 'توريد جديد' },
//       { id: 'h2', date: '2026-07-14 15:20', type: 'subtract', quantity: 5, user: 'الكاشير', reason: 'مبيعات' }
//     ]
//   },
//   {
//     id: '2',
//     image: 'https://via.placeholder.com/40',
//     name: 'أكواب ورقية (شدة)',
//     sku: 'SKU-CUP-002',
//     category: 'مستهلكات',
//     currentQty: 15,
//     minQty: 50,
//     lastMovement: '-10',
//     lastUpdate: '2026-07-15',
//     history: [
//       { id: 'h3', date: '2026-07-15 09:00', type: 'subtract', quantity: 10, user: 'الكاشير', reason: 'استهلاك يومي' }
//     ]
//   },
//   {
//     id: '3',
//     image: 'https://via.placeholder.com/40',
//     name: 'حليب كامل الدسم',
//     sku: 'SKU-MILK-003',
//     category: 'مواد خام',
//     currentQty: 0,
//     minQty: 10,
//     lastMovement: '-2',
//     lastUpdate: '2026-07-14',
//     history: [
//       { id: 'h4', date: '2026-07-14 20:00', type: 'subtract', quantity: 2, user: 'الكاشير', reason: 'انتهاء الصلاحية' }
//     ]
//   }
// ];

// export default function InventoryManagement() {
//   const [inventory, setInventory] = useState<ProductInventory[]>(mockData);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
  
//   // UI States
//   const [selectedProduct, setSelectedProduct] = useState<ProductInventory | null>(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalAction, setModalAction] = useState<'add' | 'subtract' | 'set'>('add');
//   const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

//   // Modal Form State
//   const [adjustQty, setAdjustQty] = useState<number>(0);
//   const [adjustReason, setAdjustReason] = useState('');

//   // ================= Helpers =================
//   const getStatus = (qty: number, min: number) => {
//     if (qty === 0) return { label: 'نفد', color: 'bg-red-100 text-red-800', icon: '🔴' };
//     if (qty <= min) return { label: 'منخفض', color: 'bg-orange-100 text-orange-800', icon: '🟠' };
//     return { label: 'متوفر', color: 'bg-green-100 text-green-800', icon: '🟢' };
//   };

//   const showToast = (message: string) => {
//     setToast({ show: true, message });
//     setTimeout(() => setToast({ show: false, message: '' }), 3000);
//   };

//   // ================= Actions =================
//   const handleSaveAdjustment = () => {
//     if (!selectedProduct || adjustQty <= 0) return;

//     const newHistory: StockMovement = {
//       id: Date.now().toString(),
//       date: new Date().toISOString().slice(0, 16).replace('T', ' '),
//       type: modalAction,
//       quantity: adjustQty,
//       user: 'المدير', // في النظام الحقيقي يتم جلبه من الجلسة (Auth Session)
//       reason: adjustReason || (modalAction === 'add' ? 'إضافة للرصيد' : modalAction === 'subtract' ? 'سحب من الرصيد' : 'جرد وتعديل')
//     };

//     setInventory(prev => prev.map(item => {
//       if (item.id === selectedProduct.id) {
//         let newQty = item.currentQty;
//         if (modalAction === 'add') newQty += adjustQty;
//         if (modalAction === 'subtract') newQty = Math.max(0, newQty - adjustQty);
//         if (modalAction === 'set') newQty = adjustQty;

//         return {
//           ...item,
//           currentQty: newQty,
//           lastMovement: `${modalAction === 'subtract' ? '-' : '+'}${adjustQty}`,
//           lastUpdate: new Date().toISOString().split('T')[0],
//           history: [newHistory, ...item.history]
//         };
//       }
//       return item;
//     }));

//     setIsModalOpen(false);
//     setAdjustQty(0);
//     setAdjustReason('');
//     showToast('تم تحديث المخزون بنجاح');
//   };

//   const openAdjustModal = (product: ProductInventory, action: 'add' | 'subtract' | 'set') => {
//     setSelectedProduct(product);
//     setModalAction(action);
//     setIsModalOpen(true);
//   };

//   const openHistoryDrawer = (product: ProductInventory) => {
//     setSelectedProduct(product);
//     setIsDrawerOpen(true);
//   };

//   // ================= Filters =================
//   const filteredData = useMemo(() => {
//     return inventory.filter(item => {
//       const matchSearch = item.name.includes(searchTerm) || item.sku.includes(searchTerm);
//       const status = getStatus(item.currentQty, item.minQty);
//       const matchStatus = filterStatus === 'all' || 
//                           (filterStatus === 'out' && item.currentQty === 0) ||
//                           (filterStatus === 'low' && item.currentQty > 0 && item.currentQty <= item.minQty) ||
//                           (filterStatus === 'in' && item.currentQty > item.minQty);
//       return matchSearch && matchStatus;
//     });
//   }, [inventory, searchTerm, filterStatus]);

//   // ================= Render =================
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-sans text-right" dir="rtl">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">إدارة المخزون</h1>
//         <p className="text-gray-500 mt-1">متابعة كميات المنتجات وحركات الإدخال والإخراج والتنبيهات.</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
//         {[
//           { title: 'إجمالي المنتجات', value: inventory.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
//           { title: 'الوارد اليوم', value: '85 عملية', icon: ArrowDownToLine, color: 'text-green-600', bg: 'bg-green-100' },
//           { title: 'الصادر اليوم', value: '63 عملية', icon: ArrowUpFromLine, color: 'text-purple-600', bg: 'bg-purple-100' },
//           { title: 'مواد منخفضة', value: inventory.filter(i => i.currentQty > 0 && i.currentQty <= i.minQty).length, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
//           { title: 'نفدت الكمية', value: inventory.filter(i => i.currentQty === 0).length, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
//         ].map((stat, idx) => (
//           <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
//             <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
//               <stat.icon size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">{stat.title}</p>
//               <p className="text-xl font-bold text-gray-800">{stat.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Simple Chart / Bar */}
//       <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-6">
//         <div className="flex items-center gap-2 text-sm font-medium text-gray-600 w-32">
//           <BarChart3 size={18} /> حركة الأسبوع
//         </div>
//         <div className="flex-1 space-y-2">
//           <div className="flex items-center gap-2">
//             <span className="text-xs text-gray-500 w-12">الوارد</span>
//             <div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden">
//               <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-xs text-gray-500 w-12">الصادر</span>
//             <div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden">
//               <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }}></div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters & Search */}
//       <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
//         <div className="relative w-full md:w-1/3">
//           <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
//           <input 
//             type="text" 
//             placeholder="البحث بالاسم، الباركود، أو SKU..." 
//             className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="flex gap-2 w-full md:w-auto">
//           <select 
//             className="border rounded-lg px-4 py-2 bg-gray-50 outline-none"
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//           >
//             <option value="all">جميع الحالات</option>
//             <option value="in">متوفر</option>
//             <option value="low">منخفض</option>
//             <option value="out">نفد</option>
//           </select>
//           <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
//             <Filter size={18} /> فلاتر متقدمة
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-right">
//             <thead className="bg-gray-50 text-gray-600 border-b">
//               <tr>
//                 <th className="px-4 py-3 font-medium">المنتج</th>
//                 <th className="px-4 py-3 font-medium">SKU</th>
//                 <th className="px-4 py-3 font-medium">الكمية الحالية</th>
//                 <th className="px-4 py-3 font-medium">الحد الأدنى</th>
//                 <th className="px-4 py-3 font-medium">آخر حركة</th>
//                 <th className="px-4 py-3 font-medium">الحالة</th>
//                 <th className="px-4 py-3 font-medium text-center">العمليات</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredData.map((item) => {
//                 const status = getStatus(item.currentQty, item.minQty);
//                 return (
//                   <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
//                     <td className="px-4 py-3 flex items-center gap-3">
//                       <img src={item.image} alt={item.name} className="w-10 h-10 rounded border" />
//                       <span className="font-medium text-gray-800">{item.name}</span>
//                     </td>
//                     <td className="px-4 py-3 text-gray-500">{item.sku}</td>
//                     <td className="px-4 py-3 font-bold text-gray-700">{item.currentQty}</td>
//                     <td className="px-4 py-3 text-gray-500">{item.minQty}</td>
//                     <td className="px-4 py-3">
//                       <span className={`text-xs font-bold ${item.lastMovement.startsWith('+') ? 'text-green-600' : 'text-red-600'}`} dir="ltr">
//                         {item.lastMovement}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max ${status.color}`}>
//                         {status.icon} {status.label}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button onClick={() => openAdjustModal(item, 'add')} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200" title="إضافة كمية"><Plus size={16}/></button>
//                         <button onClick={() => openAdjustModal(item, 'subtract')} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200" title="سحب كمية"><Minus size={16}/></button>
//                         <button onClick={() => openAdjustModal(item, 'set')} className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" title="جرد/تعديل"><Edit size={16}/></button>
//                         <button onClick={() => openHistoryDrawer(item)} className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" title="سجل الحركات"><History size={16}/></button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Drawer: History */}
//       {isDrawerOpen && selectedProduct && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
//           <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right">
//             <div className="p-4 border-b flex justify-between items-center bg-gray-50">
//               <h2 className="font-bold text-lg flex items-center gap-2">
//                 <History size={20} className="text-gray-500"/> سجل حركات المخزون
//               </h2>
//               <button onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
//             </div>
//             <div className="p-4 border-b flex items-center gap-4">
//                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-16 h-16 rounded border" />
//                <div>
//                  <h3 className="font-bold text-gray-800">{selectedProduct.name}</h3>
//                  <p className="text-sm text-gray-500">الكمية الحالية: <span className="font-bold">{selectedProduct.currentQty}</span></p>
//                  <p className="text-sm text-gray-500">الحد الأدنى: {selectedProduct.minQty}</p>
//                </div>
//             </div>
//             <div className="p-4 flex-1 overflow-y-auto">
//               <table className="w-full text-sm text-right">
//                 <thead className="text-gray-500 mb-2 border-b">
//                   <tr>
//                     <th className="pb-2 font-medium">التاريخ</th>
//                     <th className="pb-2 font-medium">العملية</th>
//                     <th className="pb-2 font-medium">الكمية</th>
//                     <th className="pb-2 font-medium">المستخدم</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {selectedProduct.history.map((hist) => (
//                     <tr key={hist.id} className="text-gray-700">
//                       <td className="py-3 text-xs">{hist.date}</td>
//                       <td className="py-3">{hist.reason}</td>
//                       <td className="py-3 font-bold" dir="ltr">
//                         {hist.type === 'add' ? <span className="text-green-600">+{hist.quantity}</span> :
//                          hist.type === 'subtract' ? <span className="text-red-600">-{hist.quantity}</span> :
//                          <span className="text-blue-600">={hist.quantity}</span>}
//                       </td>
//                       <td className="py-3 text-xs text-gray-500">{hist.user}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal: Adjust Quantity */}
//       {isModalOpen && selectedProduct && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
//             <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
//               <h3 className="font-bold">
//                 {modalAction === 'add' ? 'إضافة كمية' : modalAction === 'subtract' ? 'سحب كمية' : 'تعديل الرصيد (جرد)'}
//               </h3>
//               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
//             </div>
//             <div className="p-4 space-y-4">
//               <div className="p-3 bg-gray-50 rounded border text-sm flex justify-between">
//                 <span className="font-medium text-gray-700">{selectedProduct.name}</span>
//                 <span className="text-gray-500">الرصيد الحالي: <strong className="text-gray-800">{selectedProduct.currentQty}</strong></span>
//               </div>
//               <div>
//                 <label className="block text-sm text-gray-600 mb-1">الكمية</label>
//                 <input 
//                   type="number" 
//                   className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//                   value={adjustQty || ''}
//                   onChange={(e) => setAdjustQty(Number(e.target.value))}
//                   min="1"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm text-gray-600 mb-1">السبب / الملاحظات (اختياري)</label>
//                 <input 
//                   type="text" 
//                   className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="مثال: فاتورة شراء، تالف، تسوية جرد..."
//                   value={adjustReason}
//                   onChange={(e) => setAdjustReason(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="p-4 border-t bg-gray-50 flex gap-2">
//               <button 
//                 onClick={handleSaveAdjustment}
//                 className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//               >
//                 حفظ التعديل
//               </button>
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
//               >
//                 إلغاء
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Toast Notification */}
//       {toast.show && (
//         <div className="fixed bottom-6 left-6 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up z-50">
//           <CheckCircle className="text-green-400" size={20} />
//           <span>{toast.message}</span>
//         </div>
//       )}
//     </div>
//   );
// }








import React, { useState, useMemo } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { 
  Search, Filter, Package, ArrowDownToLine, ArrowUpFromLine, 
  AlertTriangle, XCircle, Eye, Plus, Minus, Edit, History, 
  X, CheckCircle, BarChart3
} from 'lucide-react';

// ================= Layout Context =================
interface DashboardContext {
  isRtl: boolean;
}

type UserRole = 'manager' | 'storekeeper';

// ================= Types =================
interface StockMovement {
  id: string;
  date: string;
  type: 'add' | 'subtract' | 'set';
  quantity: number;
  user: string;
  reason: string;
}

interface ProductInventory {
  id: string;
  image: string;
  name: string;
  sku: string;
  category: string;
  currentQty: number;
  minQty: number;
  lastMovement: string;
  lastUpdate: string;
  history: StockMovement[];
}

// ================= Mock Data =================
const mockData: ProductInventory[] = [
  {
    id: '1',
    image: 'https://via.placeholder.com/40',
    name: 'قهوة اسبريسو 1 كغ',
    sku: 'SKU-COF-001',
    category: 'مشروبات',
    currentQty: 120,
    minQty: 20,
    lastMovement: '+50',
    lastUpdate: '2026-07-15',
    history: [
      { id: 'h1', date: '2026-07-15 10:30', type: 'add', quantity: 50, user: 'أمين المستودع', reason: 'توريد جديد' },
      { id: 'h2', date: '2026-07-14 15:20', type: 'subtract', quantity: 5, user: 'الكاشير', reason: 'مبيعات' }
    ]
  },
  {
    id: '2',
    image: 'https://via.placeholder.com/40',
    name: 'أكواب ورقية (شدة)',
    sku: 'SKU-CUP-002',
    category: 'مستهلكات',
    currentQty: 15,
    minQty: 50,
    lastMovement: '-10',
    lastUpdate: '2026-07-15',
    history: [
      { id: 'h3', date: '2026-07-15 09:00', type: 'subtract', quantity: 10, user: 'الكاشير', reason: 'استهلاك يومي' }
    ]
  },
  {
    id: '3',
    image: 'https://via.placeholder.com/40',
    name: 'حليب كامل الدسم',
    sku: 'SKU-MILK-003',
    category: 'مواد خام',
    currentQty: 0,
    minQty: 10,
    lastMovement: '-2',
    lastUpdate: '2026-07-14',
    history: [
      { id: 'h4', date: '2026-07-14 20:00', type: 'subtract', quantity: 2, user: 'الكاشير', reason: 'انتهاء الصلاحية' }
    ]
  }
];

export default function InventoryManagement() {
  const { isRtl } = useOutletContext<DashboardContext>();
  const location = useLocation();

  // ✅ تحديد الدور تلقائياً حسب المسار: /warehouse/... => أمين مستودع، غير هيك => مدير
  const [activeRole, setActiveRole] = useState<UserRole>(
    location.pathname.startsWith('/warehouse') ? 'storekeeper' : 'manager'
  );

  React.useEffect(() => {
    setActiveRole(location.pathname.startsWith('/warehouse') ? 'storekeeper' : 'manager');
  }, [location.pathname]);

  const [inventory, setInventory] = useState<ProductInventory[]>(mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // UI States
  const [selectedProduct, setSelectedProduct] = useState<ProductInventory | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'add' | 'subtract' | 'set'>('add');
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  // Modal Form State
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('');

  // ================= Helpers =================
  const getStatus = (qty: number, min: number) => {
    if (qty === 0) return { label: 'نفد', color: 'bg-red-100 text-red-800', icon: '🔴' };
    if (qty <= min) return { label: 'منخفض', color: 'bg-orange-100 text-orange-800', icon: '🟠' };
    return { label: 'متوفر', color: 'bg-green-100 text-green-800', icon: '🟢' };
  };

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // ================= Actions =================
  const handleSaveAdjustment = () => {
    if (!selectedProduct || adjustQty <= 0) return;

    const newHistory: StockMovement = {
      id: Date.now().toString(),
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      type: modalAction,
      quantity: adjustQty,
      user: 'المدير', // في النظام الحقيقي يتم جلبه من الجلسة (Auth Session)
      reason: adjustReason || (modalAction === 'add' ? 'إضافة للرصيد' : modalAction === 'subtract' ? 'سحب من الرصيد' : 'جرد وتعديل')
    };

    setInventory(prev => prev.map(item => {
      if (item.id === selectedProduct.id) {
        let newQty = item.currentQty;
        if (modalAction === 'add') newQty += adjustQty;
        if (modalAction === 'subtract') newQty = Math.max(0, newQty - adjustQty);
        if (modalAction === 'set') newQty = adjustQty;

        return {
          ...item,
          currentQty: newQty,
          lastMovement: `${modalAction === 'subtract' ? '-' : '+'}${adjustQty}`,
          lastUpdate: new Date().toISOString().split('T')[0],
          history: [newHistory, ...item.history]
        };
      }
      return item;
    }));

    setIsModalOpen(false);
    setAdjustQty(0);
    setAdjustReason('');
    showToast('تم تحديث المخزون بنجاح');
  };

  const openAdjustModal = (product: ProductInventory, action: 'add' | 'subtract' | 'set') => {
    setSelectedProduct(product);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const openHistoryDrawer = (product: ProductInventory) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  // ================= Filters =================
  const filteredData = useMemo(() => {
    return inventory.filter(item => {
      const matchSearch = item.name.includes(searchTerm) || item.sku.includes(searchTerm);
      const status = getStatus(item.currentQty, item.minQty);
      const matchStatus = filterStatus === 'all' || 
                          (filterStatus === 'out' && item.currentQty === 0) ||
                          (filterStatus === 'low' && item.currentQty > 0 && item.currentQty <= item.minQty) ||
                          (filterStatus === 'in' && item.currentQty > item.minQty);
      return matchSearch && matchStatus;
    });
  }, [inventory, searchTerm, filterStatus]);

  // ================= Render =================
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-right" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إدارة المخزون</h1>
        <p className="text-gray-500 mt-1">متابعة كميات المنتجات وحركات الإدخال والإخراج والتنبيهات.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {[
          { title: 'إجمالي المنتجات', value: inventory.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
          { title: 'الوارد اليوم', value: '85 عملية', icon: ArrowDownToLine, color: 'text-green-600', bg: 'bg-green-100' },
          { title: 'الصادر اليوم', value: '63 عملية', icon: ArrowUpFromLine, color: 'text-purple-600', bg: 'bg-purple-100' },
          { title: 'مواد منخفضة', value: inventory.filter(i => i.currentQty > 0 && i.currentQty <= i.minQty).length, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
          { title: 'نفدت الكمية', value: inventory.filter(i => i.currentQty === 0).length, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Chart / Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 w-32">
          <BarChart3 size={18} /> حركة الأسبوع
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-12">الوارد</span>
            <div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-12">الصادر</span>
            <div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="البحث بالاسم، الباركود، أو SKU..." 
            className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            className="border rounded-lg px-4 py-2 bg-gray-50 outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">جميع الحالات</option>
            <option value="in">متوفر</option>
            <option value="low">منخفض</option>
            <option value="out">نفد</option>
          </select>
          <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
            <Filter size={18} /> فلاتر متقدمة
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="px-4 py-3 font-medium">المنتج</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">الكمية الحالية</th>
                <th className="px-4 py-3 font-medium">الحد الأدنى</th>
                <th className="px-4 py-3 font-medium">آخر حركة</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium text-center">العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => {
                const status = getStatus(item.currentQty, item.minQty);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded border" />
                      <span className="font-medium text-gray-800">{item.name}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item.sku}</td>
                    <td className="px-4 py-3 font-bold text-gray-700">{item.currentQty}</td>
                    <td className="px-4 py-3 text-gray-500">{item.minQty}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${item.lastMovement.startsWith('+') ? 'text-green-600' : 'text-red-600'}`} dir="ltr">
                        {item.lastMovement}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max ${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openAdjustModal(item, 'add')} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200" title="إضافة كمية"><Plus size={16}/></button>
                        <button onClick={() => openAdjustModal(item, 'subtract')} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200" title="سحب كمية"><Minus size={16}/></button>
                        {activeRole === 'manager' && (
                          <button onClick={() => openAdjustModal(item, 'set')} className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" title="جرد/تعديل"><Edit size={16}/></button>
                        )}
                        <button onClick={() => openHistoryDrawer(item)} className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" title="سجل الحركات"><History size={16}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer: History */}
      {isDrawerOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <History size={20} className="text-gray-500"/> سجل حركات المخزون
              </h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>
            <div className="p-4 border-b flex items-center gap-4">
               <img src={selectedProduct.image} alt={selectedProduct.name} className="w-16 h-16 rounded border" />
               <div>
                 <h3 className="font-bold text-gray-800">{selectedProduct.name}</h3>
                 <p className="text-sm text-gray-500">الكمية الحالية: <span className="font-bold">{selectedProduct.currentQty}</span></p>
                 <p className="text-sm text-gray-500">الحد الأدنى: {selectedProduct.minQty}</p>
               </div>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <table className="w-full text-sm text-right">
                <thead className="text-gray-500 mb-2 border-b">
                  <tr>
                    <th className="pb-2 font-medium">التاريخ</th>
                    <th className="pb-2 font-medium">العملية</th>
                    <th className="pb-2 font-medium">الكمية</th>
                    <th className="pb-2 font-medium">المستخدم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {selectedProduct.history.map((hist) => (
                    <tr key={hist.id} className="text-gray-700">
                      <td className="py-3 text-xs">{hist.date}</td>
                      <td className="py-3">{hist.reason}</td>
                      <td className="py-3 font-bold" dir="ltr">
                        {hist.type === 'add' ? <span className="text-green-600">+{hist.quantity}</span> :
                         hist.type === 'subtract' ? <span className="text-red-600">-{hist.quantity}</span> :
                         <span className="text-blue-600">={hist.quantity}</span>}
                      </td>
                      <td className="py-3 text-xs text-gray-500">{hist.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adjust Quantity */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold">
                {modalAction === 'add' ? 'إضافة كمية' : modalAction === 'subtract' ? 'سحب كمية' : 'تعديل الرصيد (جرد)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="p-3 bg-gray-50 rounded border text-sm flex justify-between">
                <span className="font-medium text-gray-700">{selectedProduct.name}</span>
                <span className="text-gray-500">الرصيد الحالي: <strong className="text-gray-800">{selectedProduct.currentQty}</strong></span>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">الكمية</label>
                <input 
                  type="number" 
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  value={adjustQty || ''}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">السبب / الملاحظات (اختياري)</label>
                <input 
                  type="text" 
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: فاتورة شراء، تالف، تسوية جرد..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                />
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex gap-2">
              <button 
                onClick={handleSaveAdjustment}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                حفظ التعديل
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 left-6 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up z-50">
          <CheckCircle className="text-green-400" size={20} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}