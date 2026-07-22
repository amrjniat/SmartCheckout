import React, { useState, useMemo } from 'react';
import { 
  Users, UserCheck, ShoppingCart, Package, 
  Search, Plus, Download, Printer, Filter, 
  MoreVertical, Eye, Edit, Shield, Lock, Ban, Trash2, X
} from 'lucide-react';

// --- 1. Types & Interfaces ---
type Role = 'Manager' | 'Cashier' | 'Warehouse Clerk';
type Status = 'Active' | 'Disabled' | 'Pending';

interface Employee {
  id: string;
  avatar: string;
  fullName: string;
  username: string;
  role: Role;
  branch: string;
  status: Status;
  lastLogin: string;
}

// --- 2. Mock Data ---
const mockEmployees: Employee[] = [
  { id: '1', avatar: 'https://i.pravatar.cc/150?u=amr', fullName: 'عمرو جنيات', username: 'amr_jniat', role: 'Manager', branch: 'الفرع الرئيسي', status: 'Active', lastLogin: 'الآن' },
  { id: '2', avatar: 'https://i.pravatar.cc/150?u=mohamed', fullName: 'محمد خالد', username: 'm_khaled', role: 'Warehouse Clerk', branch: 'مستودع الشمال', status: 'Active', lastLogin: 'منذ ساعتين' },
  { id: '3', avatar: 'https://i.pravatar.cc/150?u=ahmed', fullName: 'أحمد علي', username: 'ahmed_ali', role: 'Cashier', branch: 'فرع المول', status: 'Disabled', lastLogin: 'منذ 5 أيام' },
];

export default function EmployeeManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // --- 3. Handlers ---
  const handleAction = (action: string, employee: Employee) => {
    // Here you would trigger modals or API calls (e.g., Toast notifications)
    console.log(`Action: ${action} on ${employee.fullName}`);
    if (action === 'view' || action === 'permissions') {
      setSelectedEmployee(employee);
      setIsSidePanelOpen(true);
    }
  };

  // --- 4. Filtering Logic (Live Search) ---
  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(emp => 
      emp.fullName.includes(searchTerm) || 
      emp.username.includes(searchTerm) ||
      emp.role.includes(searchTerm)
    );
  }, [searchTerm]);

  // --- 5. UI Helpers ---
  const getRoleIcon = (role: Role) => {
    switch (role) {
      case 'Manager': return <Shield className="w-4 h-4 text-purple-500" />;
      case 'Cashier': return <ShoppingCart className="w-4 h-4 text-blue-500" />;
      case 'Warehouse Clerk': return <Package className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'Active': return <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>نشط</span>;
      case 'Disabled': return <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>معطل</span>;
      case 'Pending': return <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>معلق</span>;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إدارة الفريق والموظفين</h1>
        <p className="text-gray-500 text-sm mt-1">إدارة الصلاحيات، الأدوار، وحالة المستخدمين في النظام.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Users className="text-blue-600" />} title="إجمالي الموظفين" value="18" bgColor="bg-blue-100" />
        <StatCard icon={<UserCheck className="text-green-600" />} title="الموظفون النشطون" value="15" bgColor="bg-green-100" />
        <StatCard icon={<ShoppingCart className="text-purple-600" />} title="الكاشير" value="8" bgColor="bg-purple-100" />
        <StatCard icon={<Package className="text-orange-600" />} title="أمناء المستودعات" value="4" bgColor="bg-orange-100" />
      </div>

      {/* Toolbar: Search & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="بحث بالاسم، البريد، أو رقم الهاتف..." 
            className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" /> إضافة موظف
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" /> فلترة
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> تصدير
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
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
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt={emp.fullName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                      <div>
                        <div className="font-medium text-gray-800">{emp.fullName}</div>
                        <div className="text-xs text-gray-500">@{emp.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      {getRoleIcon(emp.role)}
                      {emp.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.branch}</td>
                  <td className="px-6 py-4">{getStatusBadge(emp.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{emp.lastLogin}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleAction('view', emp)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md" title="عرض">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleAction('edit', emp)} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md" title="تعديل">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleAction('permissions', emp)} className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md" title="الصلاحيات">
                        <Shield className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleAction('delete', emp)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md" title="حذف">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel (Slide-over for SaaS feel) */}
      {isSidePanelOpen && selectedEmployee && (
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
              <div className="flex flex-col items-center mb-8">
                <img src={selectedEmployee.avatar} alt="Avatar" className="w-24 h-24 rounded-full shadow-md mb-4" />
                <h3 className="text-lg font-bold">{selectedEmployee.fullName}</h3>
                <span className="text-gray-500">@{selectedEmployee.username}</span>
                <div className="mt-2">{getStatusBadge(selectedEmployee.status)}</div>
              </div>

              {/* Mock Permissions Checklist */}
              <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">صلاحيات الوصول (Permissions)</h4>
              <div className="space-y-3">
                {['إدارة المواد', 'إدارة المخزون', 'شاشة البيع', 'التقارير', 'إدارة الموظفين'].map((perm, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <input type="checkbox" defaultChecked={idx < 3} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                    <span className="text-gray-700 text-sm">{perm}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50" onClick={() => setIsSidePanelOpen(false)}>إغلاق</button>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm">حفظ التغييرات</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component: Stat Card
function StatCard({ icon, title, value, bgColor }: { icon: React.ReactNode, title: string, value: string, bgColor: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-full ${bgColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
      </div>
    </div>
  );
}