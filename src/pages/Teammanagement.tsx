// import React, { useState, useMemo } from 'react';
// import { 
//   Users, UserCheck, ShoppingCart, Package, 
//   Search, Plus, Download, Printer, Filter, 
//   MoreVertical, Eye, Edit, Shield, Lock, Ban, Trash2, X
// } from 'lucide-react';

// // --- 1. Types & Interfaces ---
// type Role = 'Manager' | 'Cashier' | 'Warehouse Clerk';
// type Status = 'Active' | 'Disabled' | 'Pending';

// interface Employee {
//   id: string;
//   avatar: string;
//   fullName: string;
//   username: string;
//   role: Role;
//   branch: string;
//   status: Status;
//   lastLogin: string;
// }

// // --- 2. Mock Data ---
// const mockEmployees: Employee[] = [
//   { id: '1', avatar: 'https://i.pravatar.cc/150?u=amr', fullName: 'عمرو جنيات', username: 'amr_jniat', role: 'Manager', branch: 'الفرع الرئيسي', status: 'Active', lastLogin: 'الآن' },
//   { id: '2', avatar: 'https://i.pravatar.cc/150?u=mohamed', fullName: 'محمد خالد', username: 'm_khaled', role: 'Warehouse Clerk', branch: 'مستودع الشمال', status: 'Active', lastLogin: 'منذ ساعتين' },
//   { id: '3', avatar: 'https://i.pravatar.cc/150?u=ahmed', fullName: 'أحمد علي', username: 'ahmed_ali', role: 'Cashier', branch: 'فرع المول', status: 'Disabled', lastLogin: 'منذ 5 أيام' },
// ];

// export default function EmployeeManagement() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
//   const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

//   // --- 3. Handlers ---
//   const handleAction = (action: string, employee: Employee) => {
//     // Here you would trigger modals or API calls (e.g., Toast notifications)
//     console.log(`Action: ${action} on ${employee.fullName}`);
//     if (action === 'view' || action === 'permissions') {
//       setSelectedEmployee(employee);
//       setIsSidePanelOpen(true);
//     }
//   };

//   // --- 4. Filtering Logic (Live Search) ---
//   const filteredEmployees = useMemo(() => {
//     return mockEmployees.filter(emp => 
//       emp.fullName.includes(searchTerm) || 
//       emp.username.includes(searchTerm) ||
//       emp.role.includes(searchTerm)
//     );
//   }, [searchTerm]);

//   // --- 5. UI Helpers ---
//   const getRoleIcon = (role: Role) => {
//     switch (role) {
//       case 'Manager': return <Shield className="w-4 h-4 text-purple-500" />;
//       case 'Cashier': return <ShoppingCart className="w-4 h-4 text-blue-500" />;
//       case 'Warehouse Clerk': return <Package className="w-4 h-4 text-orange-500" />;
//     }
//   };

//   const getStatusBadge = (status: Status) => {
//     switch (status) {
//       case 'Active': return <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>نشط</span>;
//       case 'Disabled': return <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>معطل</span>;
//       case 'Pending': return <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>معلق</span>;
//     }
//   };

//   return (
//     <div className="p-6 bg-gradient-to-b from-slate-50 via-white to-slate-50/70 min-h-screen font-sans" dir="rtl">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">إدارة الفريق والموظفين</h1>
//         <p className="text-gray-500 text-sm mt-1">إدارة الصلاحيات، الأدوار، وحالة المستخدمين في النظام.</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <StatCard icon={<Users className="w-6 h-6" />} title="إجمالي الموظفين" value="18" accent="blue" />
//         <StatCard icon={<UserCheck className="w-6 h-6" />} title="الموظفون النشطون" value="15" accent="emerald" />
//         <StatCard icon={<ShoppingCart className="w-6 h-6" />} title="الكاشير" value="8" accent="purple" />
//         <StatCard icon={<Package className="w-6 h-6" />} title="أمناء المستودعات" value="4" accent="orange" />
//       </div>

//       {/* Toolbar: Search & Actions */}
//       <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
//         <div className="relative w-full lg:w-1/3">
//           <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
//           <input 
//             type="text" 
//             placeholder="بحث بالاسم، البريد، أو رقم الهاتف..." 
//             className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="flex gap-2 w-full lg:w-auto overflow-x-auto">
//           <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-lg hover:from-blue-700 hover:to-indigo-900 transition-all duration-300 shadow-md shadow-blue-900/30 hover:-translate-y-0.5 whitespace-nowrap">
//             <Plus className="w-4 h-4" /> إضافة موظف
//           </button>
//           <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//             <Filter className="w-4 h-4" /> فلترة
//           </button>
//           <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//             <Download className="w-4 h-4" /> تصدير
//           </button>
//         </div>
//       </div>

//       {/* Data Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
//         <div className="overflow-x-auto">
//           <table className="w-full text-right border-collapse">
//             <thead className="bg-gradient-to-l from-gray-50 to-white border-b border-gray-100">
//               <tr>
//                 <th className="px-6 py-4 text-sm font-semibold text-gray-600">الموظف</th>
//                 <th className="px-6 py-4 text-sm font-semibold text-gray-600">الدور</th>
//                 <th className="px-6 py-4 text-sm font-semibold text-gray-600">الفرع</th>
//                 <th className="px-6 py-4 text-sm font-semibold text-gray-600">الحالة</th>
//                 <th className="px-6 py-4 text-sm font-semibold text-gray-600">آخر دخول</th>
//                 <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">العمليات</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {filteredEmployees.map((emp) => (
//                 <tr key={emp.id} className="hover:bg-gray-50 transition-colors group">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <img src={emp.avatar} alt={emp.fullName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
//                       <div>
//                         <div className="font-medium text-gray-800">{emp.fullName}</div>
//                         <div className="text-xs text-gray-500">@{emp.username}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2 text-sm text-gray-700">
//                       {getRoleIcon(emp.role)}
//                       {emp.role}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-600">{emp.branch}</td>
//                   <td className="px-6 py-4">{getStatusBadge(emp.status)}</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{emp.lastLogin}</td>
//                   <td className="px-6 py-4 text-center">
//                     <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button onClick={() => handleAction('view', emp)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md" title="عرض">
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button onClick={() => handleAction('edit', emp)} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md" title="تعديل">
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button onClick={() => handleAction('permissions', emp)} className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md" title="الصلاحيات">
//                         <Shield className="w-4 h-4" />
//                       </button>
//                       <button onClick={() => handleAction('delete', emp)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md" title="حذف">
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Side Panel (Slide-over for SaaS feel) */}
//       {isSidePanelOpen && selectedEmployee && (
//         <div className="fixed inset-0 z-50 flex justify-end">
//           <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsSidePanelOpen(false)}></div>
//           <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-rtl">
//             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
//               <h2 className="text-xl font-bold text-gray-800">تفاصيل الموظف</h2>
//               <button onClick={() => setIsSidePanelOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <div className="p-6 overflow-y-auto flex-1">
//               <div className="flex flex-col items-center mb-8">
//                 <img src={selectedEmployee.avatar} alt="Avatar" className="w-24 h-24 rounded-full shadow-md mb-4" />
//                 <h3 className="text-lg font-bold">{selectedEmployee.fullName}</h3>
//                 <span className="text-gray-500">@{selectedEmployee.username}</span>
//                 <div className="mt-2">{getStatusBadge(selectedEmployee.status)}</div>
//               </div>

//               {/* Mock Permissions Checklist */}
//               <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">صلاحيات الوصول (Permissions)</h4>
//               <div className="space-y-3">
//                 {['إدارة المواد', 'إدارة المخزون', 'شاشة البيع', 'التقارير', 'إدارة الموظفين'].map((perm, idx) => (
//                   <label key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
//                     <input type="checkbox" defaultChecked={idx < 3} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
//                     <span className="text-gray-700 text-sm">{perm}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
//               <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50" onClick={() => setIsSidePanelOpen(false)}>إغلاق</button>
//               <button className="px-4 py-2 text-white bg-gradient-to-br from-blue-600 to-indigo-800 rounded-lg hover:from-blue-700 hover:to-indigo-900 transition-all duration-300 shadow-md shadow-blue-900/30">حفظ التغييرات</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Sub-component: Stat Card
// function StatCard({ icon, title, value, accent }: { icon: React.ReactNode, title: string, value: string, accent: 'blue' | 'emerald' | 'purple' | 'orange' }) {
//   const styles: Record<string, { card: string; iconBox: string; glow: string; blob: string; value: string }> = {
//     blue: {
//       card: 'from-blue-100 via-blue-50 to-indigo-100 border-blue-200/70',
//       iconBox: 'from-blue-700 to-indigo-950 shadow-blue-950/40',
//       glow: 'hover:shadow-blue-950/25',
//       blob: 'bg-blue-600/15 group-hover:bg-blue-600/25',
//       value: 'text-blue-950',
//     },
//     emerald: {
//       card: 'from-emerald-100 via-emerald-50 to-teal-100 border-emerald-200/70',
//       iconBox: 'from-emerald-700 to-teal-950 shadow-emerald-950/40',
//       glow: 'hover:shadow-emerald-950/25',
//       blob: 'bg-emerald-600/15 group-hover:bg-emerald-600/25',
//       value: 'text-emerald-950',
//     },
//     purple: {
//       card: 'from-purple-100 via-purple-50 to-fuchsia-100 border-purple-200/70',
//       iconBox: 'from-purple-700 to-fuchsia-950 shadow-purple-950/40',
//       glow: 'hover:shadow-purple-950/25',
//       blob: 'bg-purple-600/15 group-hover:bg-purple-600/25',
//       value: 'text-purple-950',
//     },
//     orange: {
//       card: 'from-orange-100 via-orange-50 to-amber-100 border-orange-200/70',
//       iconBox: 'from-orange-700 to-amber-950 shadow-orange-950/40',
//       glow: 'hover:shadow-orange-950/25',
//       blob: 'bg-orange-600/15 group-hover:bg-orange-600/25',
//       value: 'text-orange-950',
//     },
//   };
//   const s = styles[accent];
//   return (
//     <div className={`group relative bg-gradient-to-br ${s.card} border rounded-2xl p-7 flex items-center gap-5 overflow-hidden shadow-sm hover:shadow-xl ${s.glow} transition-all duration-300 hover:-translate-y-2 cursor-default`}>
//       <div className={`absolute -left-8 -top-8 w-32 h-32 rounded-full blur-2xl transition-colors duration-300 ${s.blob}`}></div>
//       <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${s.iconBox} text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
//         {icon}
//       </div>
//       <div className="relative z-10">
//         <p className="text-sm text-slate-500 font-bold">{title}</p>
//         <h3 className={`text-3xl font-black mt-1 ${s.value}`}>{value}</h3>
//       </div>
//     </div>
//   );
// }







import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, ShoppingCart, Package, 
  Search, Filter, Download,
  Eye, Edit, Shield, Ban, RotateCcw, X, Loader2, AlertTriangle
} from 'lucide-react';
import type { Employee, EmployeeDetail, EmployeeStats, ApiRoleName } from '../types/employee';
import { getEmployees, getEmployeeStats, getEmployeeById, updateEmployeeStatus } from '../services/userService';

// --- ترجمة أسماء الأدوار من الباك (إنجليزي) للعرض بالعربي ---
const roleDisplayNameAr: Record<ApiRoleName, string> = {
  Admin: 'مدير',
  Cashier: 'كاشير',
  Warehouse: 'أمين مستودع',
};

export default function EmployeeManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetail | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // --- حالة نافذة تأكيد التعطيل/التفعيل ---
  const [confirmTarget, setConfirmTarget] = useState<Employee | null>(null);
  const [confirmActionType, setConfirmActionType] = useState<'disable' | 'enable' | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // --- جلب الإحصائيات ---
  const fetchStats = async () => {
    try {
      setIsLoadingStats(true);
      const data = await getEmployeeStats();
      setStats(data);
    } catch (err) {
      console.error('فشل جلب الإحصائيات:', err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // --- جلب قائمة الموظفين (مع بحث مؤجل Debounce) ---
  const fetchEmployees = async () => {
    try {
      setIsLoadingList(true);
      setListError(null);
      const data = await getEmployees({ search: searchTerm || undefined });
      setEmployees(data.users);
    } catch (err) {
      console.error('فشل جلب الموظفين:', err);
      setListError('حدث خطأ أثناء جلب قائمة الموظفين');
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- فتح لوحة التفاصيل ---
  const handleViewDetails = async (employee: Employee) => {
    setIsSidePanelOpen(true);
    setIsLoadingDetail(true);
    setSelectedEmployee(null);
    try {
      const detail = await getEmployeeById(employee.id);
      setSelectedEmployee(detail);
    } catch (err) {
      console.error('فشل جلب تفاصيل الموظف:', err);
      setIsSidePanelOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // --- فتح نافذة تأكيد التعطيل / التفعيل ---
  const openConfirm = (employee: Employee, type: 'disable' | 'enable') => {
    setConfirmTarget(employee);
    setConfirmActionType(type);
    setActionError(null);
  };

  const closeConfirm = () => {
    if (isProcessingAction) return; // منع الإغلاق أثناء التنفيذ
    setConfirmTarget(null);
    setConfirmActionType(null);
    setActionError(null);
  };

  // --- تنفيذ التعطيل / التفعيل فعلياً ---
  const handleConfirmAction = async () => {
    if (!confirmTarget || !confirmActionType) return;

    setIsProcessingAction(true);
    setActionError(null);
    try {
      const newIsActive = confirmActionType === 'enable';
      await updateEmployeeStatus(confirmTarget.id, newIsActive);

      // تحديث القائمة والإحصائيات محلياً بدون إعادة تحميل كاملة
      setEmployees(prev =>
        prev.map(emp =>
          emp.id === confirmTarget.id ? { ...emp, isActive: newIsActive } : emp
        )
      );
      await fetchStats();

      setConfirmTarget(null);
      setConfirmActionType(null);
    } catch (err) {
      console.error('فشل تنفيذ العملية:', err);
      setActionError('حدث خطأ أثناء تنفيذ العملية، حاول مرة أخرى');
    } finally {
      setIsProcessingAction(false);
    }
  };

  // --- UI Helpers ---
  const getRoleIcon = (role: ApiRoleName) => {
    switch (role) {
      case 'Admin': return <Shield className="w-4 h-4 text-purple-500" />;
      case 'Cashier': return <ShoppingCart className="w-4 h-4 text-blue-500" />;
      case 'Warehouse': return <Package className="w-4 h-4 text-orange-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full flex items-center gap-1 w-fit"><span className="w-2 h-2 rounded-full bg-green-500"></span>نشط</span>
      : <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full flex items-center gap-1 w-fit"><span className="w-2 h-2 rounded-full bg-red-500"></span>معطل</span>;
  };

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return 'لم يسجل الدخول بعد';
    return new Date(lastLogin).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const cashierCount = stats?.roleBreakdown.find(r => r.roleName === 'Cashier')?.count ?? 0;
  const warehouseCount = stats?.roleBreakdown.find(r => r.roleName === 'Warehouse')?.count ?? 0;

  return (
    <div className="p-6 bg-gradient-to-b from-slate-50 via-white to-slate-50/70 min-h-screen font-sans" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إدارة الفريق والموظفين</h1>
        <p className="text-gray-500 text-sm mt-1">إدارة الصلاحيات، الأدوار، وحالة المستخدمين في النظام.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Users className="w-6 h-6" />} title="إجمالي الموظفين" value={isLoadingStats ? '...' : String(stats?.totalEmployees ?? 0)} accent="blue" />
        <StatCard icon={<UserCheck className="w-6 h-6" />} title="الموظفون النشطون" value={isLoadingStats ? '...' : String(stats?.activeEmployees ?? 0)} accent="emerald" />
        <StatCard icon={<ShoppingCart className="w-6 h-6" />} title="الكاشير" value={isLoadingStats ? '...' : String(cashierCount)} accent="purple" />
        <StatCard icon={<Package className="w-6 h-6" />} title="أمناء المستودعات" value={isLoadingStats ? '...' : String(warehouseCount)} accent="orange" />
      </div>

      {/* Toolbar: Search & Actions (تم حذف زر إضافة موظف) */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="بحث بالاسم، اسم المستخدم، أو البريد..." 
            className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" /> فلترة
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> تصدير
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-gradient-to-l from-gray-50 to-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الموظف</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الدور</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الفرع</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">الحالة</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">آخر دخول</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoadingList && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    جاري تحميل الموظفين...
                  </td>
                </tr>
              )}

              {!isLoadingList && listError && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-red-500">{listError}</td>
                </tr>
              )}

              {!isLoadingList && !listError && employees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">لا يوجد موظفون مطابقون</td>
                </tr>
              )}

              {!isLoadingList && !listError && employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={`https://i.pravatar.cc/150?u=${emp.username}`} alt={emp.fullName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                      <div>
                        <div className="font-medium text-gray-800">{emp.fullName}</div>
                        <div className="text-xs text-gray-500">@{emp.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      {getRoleIcon(emp.roleName)}
                      {roleDisplayNameAr[emp.roleName] ?? emp.roleName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.branchName ?? 'غير محدد'}</td>
                  <td className="px-6 py-4">{getStatusBadge(emp.isActive)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatLastLogin(emp.lastLogin)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleViewDetails(emp)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md" title="عرض">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => console.log('تعديل - سيتم ربطه لاحقاً')} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md" title="تعديل">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleViewDetails(emp)} className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md" title="الصلاحيات">
                        <Shield className="w-4 h-4" />
                      </button>

                      {/* زر التعطيل / إعادة التفعيل الفعلي */}
                      {emp.isActive ? (
                        <button onClick={() => openConfirm(emp, 'disable')} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md" title="تعطيل الحساب">
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={() => openConfirm(emp, 'enable')} className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md" title="إعادة تفعيل الحساب">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel (Slide-over) */}
      {isSidePanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsSidePanelOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-rtl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">تفاصيل الموظف</h2>
              <button onClick={() => setIsSidePanelOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {isLoadingDetail && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-3" />
                  جاري تحميل البيانات...
                </div>
              )}

              {!isLoadingDetail && selectedEmployee && (
                <>
                  <div className="flex flex-col items-center mb-8">
                    <img src={`https://i.pravatar.cc/150?u=${selectedEmployee.username}`} alt="Avatar" className="w-24 h-24 rounded-full shadow-md mb-4" />
                    <h3 className="text-lg font-bold">{selectedEmployee.fullName}</h3>
                    <span className="text-gray-500">@{selectedEmployee.username}</span>
                    <div className="mt-2">{getStatusBadge(selectedEmployee.isActive)}</div>
                  </div>

                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">الدور</span>
                      <span className="font-medium text-gray-800">{roleDisplayNameAr[selectedEmployee.roleName] ?? selectedEmployee.roleName}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">الفرع</span>
                      <span className="font-medium text-gray-800">{selectedEmployee.branchName ?? 'غير محدد'}</span>
                    </div>
                    {selectedEmployee.email && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">البريد الإلكتروني</span>
                        <span className="font-medium text-gray-800">{selectedEmployee.email}</span>
                      </div>
                    )}
                    {selectedEmployee.phone && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">الهاتف</span>
                        <span className="font-medium text-gray-800">{selectedEmployee.phone}</span>
                      </div>
                    )}
                  </div>

                  <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">صلاحيات الوصول (Permissions)</h4>
                  {selectedEmployee.permissions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.permissions.map((perm, idx) => (
                        <span key={idx} className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-full">
                          {perm}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">لا توجد صلاحيات محددة لهذا الدور</p>
                  )}
                </>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50" onClick={() => setIsSidePanelOpen(false)}>إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog: تعطيل / إعادة تفعيل */}
      {confirmTarget && confirmActionType && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={closeConfirm}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${confirmActionType === 'disable' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                {confirmActionType === 'disable' ? 'تأكيد تعطيل الحساب' : 'تأكيد إعادة التفعيل'}
              </h3>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              {confirmActionType === 'disable'
                ? <>هل أنت متأكد من تعطيل حساب <span className="font-bold text-gray-800">{confirmTarget.fullName}</span>؟</>
                : <>هل تريد إعادة تفعيل حساب <span className="font-bold text-gray-800">{confirmTarget.fullName}</span>؟</>
              }
            </p>
            {confirmActionType === 'disable' && (
              <p className="text-xs text-gray-400 mb-4">
                لن يتمكن الموظف من تسجيل الدخول، لكن جميع بياناته وسجلاته السابقة ستبقى محفوظة، ويمكنك إعادة تفعيل الحساب لاحقاً.
              </p>
            )}

            {actionError && (
              <p className="text-sm text-red-500 mb-3">{actionError}</p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={closeConfirm}
                disabled={isProcessingAction}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isProcessingAction}
                className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60 ${
                  confirmActionType === 'disable' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isProcessingAction && <Loader2 className="w-4 h-4 animate-spin" />}
                {confirmActionType === 'disable' ? 'تعطيل الحساب' : 'إعادة التفعيل'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component: Stat Card
function StatCard({ icon, title, value, accent }: { icon: React.ReactNode, title: string, value: string, accent: 'blue' | 'emerald' | 'purple' | 'orange' }) {
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
    orange: {
      card: 'from-orange-100 via-orange-50 to-amber-100 border-orange-200/70',
      iconBox: 'from-orange-700 to-amber-950 shadow-orange-950/40',
      glow: 'hover:shadow-orange-950/25',
      blob: 'bg-orange-600/15 group-hover:bg-orange-600/25',
      value: 'text-orange-950',
    },
  };
  const s = styles[accent];
  return (
    <div className={`group relative bg-gradient-to-br ${s.card} border rounded-2xl p-7 flex items-center gap-5 overflow-hidden shadow-sm hover:shadow-xl ${s.glow} transition-all duration-300 hover:-translate-y-2 cursor-default`}>
      <div className={`absolute -left-8 -top-8 w-32 h-32 rounded-full blur-2xl transition-colors duration-300 ${s.blob}`}></div>
      <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${s.iconBox} text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        {icon}
      </div>
      <div className="relative z-10">
        <p className="text-sm text-slate-500 font-bold">{title}</p>
        <h3 className={`text-3xl font-black mt-1 ${s.value}`}>{value}</h3>
      </div>
    </div>
  );
}