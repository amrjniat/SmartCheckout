

import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Users, UserCheck, ShoppingCart, Package,
  Search, Filter, Download,
  Eye, Edit, Shield, Ban, RotateCcw, X, Loader2, AlertTriangle
} from 'lucide-react';
import type { Employee, EmployeeDetail, EmployeeStats, ApiRoleName } from '../types/employee';
import { getEmployees, getEmployeeStats, getEmployeeById, updateEmployeeStatus } from '../services/userService';

type LayoutContext = { isRtl: boolean; setIsRtl: (value: boolean) => void };

const roleDisplayNameAr: Record<ApiRoleName, string> = {
  Admin: 'مدير',
  Cashier: 'كاشير',
  Warehouse: 'أمين مستودع',
};

const roleDisplayNameEn: Record<ApiRoleName, string> = {
  Admin: 'Admin',
  Cashier: 'Cashier',
  Warehouse: 'Warehouse',
};

const translations = {
  ar: {
    pageTitle: 'إدارة الفريق والموظفين',
    pageSubtitle: 'إدارة الصلاحيات، الأدوار، وحالة المستخدمين في النظام.',
    totalEmployees: 'إجمالي الموظفين',
    activeEmployees: 'الموظفون النشطون',
    cashier: 'الكاشير',
    warehouse: 'أمناء المستودعات',
    searchPlaceholder: 'بحث بالاسم، اسم المستخدم، أو البريد...',
    filter: 'فلترة',
    export: 'تصدير',
    employee: 'الموظف',
    role: 'الدور',
    branch: 'الفرع',
    status: 'الحالة',
    lastLogin: 'آخر دخول',
    actions: 'العمليات',
    loadingList: 'جارٍ تحميل الموظفين...',
    errorList: 'حدث خطأ أثناء جلب قائمة الموظفين',
    noEmployees: 'لا يوجد موظفون مطابقون',
    view: 'عرض',
    edit: 'تعديل',
    permissions: 'الصلاحيات',
    disableAccount: 'تعطيل الحساب',
    enableAccount: 'إعادة تفعيل الحساب',
    unauthenticated: 'لم يسجل الدخول بعد',
    undefinedBranch: 'غير محدد',
    detailsTitle: 'تفاصيل الموظف',
    loadingDetails: 'جارٍ تحميل البيانات...',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    accessPermissions: 'صلاحيات الوصول',
    noPermissions: 'لا توجد صلاحيات محددة لهذا الدور',
    close: 'إغلاق',
    confirmDisable: 'تأكيد تعطيل الحساب',
    confirmEnable: 'تأكيد إعادة التفعيل',
    confirmDisableText: 'هل أنت متأكد من تعطيل حساب',
    confirmEnableText: 'هل تريد إعادة تفعيل حساب',
    confirmDisableNote: 'لن يتمكن الموظف من تسجيل الدخول، لكن جميع بياناته وسجلاته السابقة ستبقى محفوظة، ويمكنك إعادة تفعيل الحساب لاحقاً.',
    cancel: 'إلغاء',
    active: 'نشط',
    inactive: 'معطل',
    loading: 'جارٍ',
    errorAction: 'حدث خطأ أثناء تنفيذ العملية، حاول مرة أخرى',
  },
  en: {
    pageTitle: 'Team Management',
    pageSubtitle: 'Manage roles, permissions, and user status across the system.',
    totalEmployees: 'Total Employees',
    activeEmployees: 'Active Employees',
    cashier: 'Cashiers',
    warehouse: 'Warehouse Staff',
    searchPlaceholder: 'Search by name, username, or email...',
    filter: 'Filter',
    export: 'Export',
    employee: 'Employee',
    role: 'Role',
    branch: 'Branch',
    status: 'Status',
    lastLogin: 'Last Login',
    actions: 'Actions',
    loadingList: 'Loading employees...',
    errorList: 'An error occurred while fetching the employee list',
    noEmployees: 'No matching employees found',
    view: 'View',
    edit: 'Edit',
    permissions: 'Permissions',
    disableAccount: 'Disable account',
    enableAccount: 'Activate account',
    unauthenticated: 'Has not logged in yet',
    undefinedBranch: 'Not assigned',
    detailsTitle: 'Employee Details',
    loadingDetails: 'Loading data...',
    email: 'Email',
    phone: 'Phone',
    accessPermissions: 'Access Permissions',
    noPermissions: 'No permissions are defined for this role',
    close: 'Close',
    confirmDisable: 'Confirm account disable',
    confirmEnable: 'Confirm account reactivation',
    confirmDisableText: 'Are you sure you want to disable the account of',
    confirmEnableText: 'Do you want to reactivate the account of',
    confirmDisableNote: 'The employee will not be able to log in, but all previous data and records will remain saved and the account can be reactivated later.',
    cancel: 'Cancel',
    active: 'Active',
    inactive: 'Inactive',
    loading: 'Loading',
    errorAction: 'An error occurred while processing the request. Please try again',
  },
};

export default function EmployeeManagement() {
  const { isRtl } = useOutletContext<LayoutContext>();
  const t = translations[isRtl ? 'ar' : 'en'];

  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetail | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const [confirmTarget, setConfirmTarget] = useState<Employee | null>(null);
  const [confirmActionType, setConfirmActionType] = useState<'disable' | 'enable' | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoadingStats(true);
      const data = await getEmployeeStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch employee statistics:', err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoadingList(true);
      setListError(null);
      const data = await getEmployees({ search: searchTerm || undefined });
      setEmployees(data.users);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setListError(t.errorList);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, isRtl]);

  const handleViewDetails = async (employee: Employee) => {
    setIsSidePanelOpen(true);
    setIsLoadingDetail(true);
    setSelectedEmployee(null);
    try {
      const detail = await getEmployeeById(employee.id);
      setSelectedEmployee(detail);
    } catch (err) {
      console.error('Failed to fetch employee details:', err);
      setIsSidePanelOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const openConfirm = (employee: Employee, type: 'disable' | 'enable') => {
    setConfirmTarget(employee);
    setConfirmActionType(type);
    setActionError(null);
  };

  const closeConfirm = () => {
    if (isProcessingAction) return;
    setConfirmTarget(null);
    setConfirmActionType(null);
    setActionError(null);
  };

  const handleConfirmAction = async () => {
    if (!confirmTarget || !confirmActionType) return;

    setIsProcessingAction(true);
    setActionError(null);
    try {
      const newIsActive = confirmActionType === 'enable';
      await updateEmployeeStatus(confirmTarget.id, newIsActive);

      setEmployees(prev =>
        prev.map(emp =>
          emp.id === confirmTarget.id ? { ...emp, isActive: newIsActive } : emp
        )
      );
      await fetchStats();

      setConfirmTarget(null);
      setConfirmActionType(null);
    } catch (err) {
      console.error('Failed to process employee action:', err);
      setActionError(t.errorAction);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const getRoleIcon = (role: ApiRoleName) => {
    switch (role) {
      case 'Admin': return <Shield className="w-4 h-4 text-purple-500" />;
      case 'Cashier': return <ShoppingCart className="w-4 h-4 text-blue-500" />;
      case 'Warehouse': return <Package className="w-4 h-4 text-orange-500" />;
      default: return null;
    }
  };

  const getRoleDisplayName = (role: ApiRoleName) => (isRtl ? roleDisplayNameAr[role] : roleDisplayNameEn[role]);

  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full flex items-center gap-1 w-fit"><span className="w-2 h-2 rounded-full bg-green-500"></span>{t.active}</span>
      : <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full flex items-center gap-1 w-fit"><span className="w-2 h-2 rounded-full bg-red-500"></span>{t.inactive}</span>;
  };

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return t.unauthenticated;
    return new Date(lastLogin).toLocaleString(isRtl ? 'ar-EG' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const cashierCount = stats?.roleBreakdown.find(r => r.roleName === 'Cashier')?.count ?? 0;
  const warehouseCount = stats?.roleBreakdown.find(r => r.roleName === 'Warehouse')?.count ?? 0;

  return (
    <div className="p-6 bg-gradient-to-b from-slate-50 via-white to-slate-50/70 min-h-screen font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t.pageTitle}</h1>
        <p className="text-gray-500 text-sm mt-1">{t.pageSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Users className="w-6 h-6" />} title={t.totalEmployees} value={isLoadingStats ? '...' : String(stats?.totalEmployees ?? 0)} accent="blue" />
        <StatCard icon={<UserCheck className="w-6 h-6" />} title={t.activeEmployees} value={isLoadingStats ? '...' : String(stats?.activeEmployees ?? 0)} accent="emerald" />
        <StatCard icon={<ShoppingCart className="w-6 h-6" />} title={t.cashier} value={isLoadingStats ? '...' : String(cashierCount)} accent="purple" />
        <StatCard icon={<Package className="w-6 h-6" />} title={t.warehouse} value={isLoadingStats ? '...' : String(warehouseCount)} accent="orange" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
        <div className="relative w-full lg:w-1/3">
          <Search className={`absolute top-2.5 text-gray-400 w-5 h-5 ${isRtl ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className={`w-full py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${isRtl ? 'pl-4 pr-10' : 'pr-4 pl-10'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" /> {t.filter}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> {t.export}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="overflow-x-auto">
          <table className={`w-full border-collapse ${isRtl ? 'text-right' : 'text-left'}`}>
            <thead className="bg-gradient-to-l from-gray-50 to-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">{t.employee}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">{t.role}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">{t.branch}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">{t.status}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">{t.lastLogin}</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoadingList && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    {t.loadingList}
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
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">{t.noEmployees}</td>
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
                      {getRoleDisplayName(emp.roleName)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.branchName ?? t.undefinedBranch}</td>
                  <td className="px-6 py-4">{getStatusBadge(emp.isActive)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatLastLogin(emp.lastLogin)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleViewDetails(emp)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md" title={t.view}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => console.log('Edit action - to be connected later')} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md" title={t.edit}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleViewDetails(emp)} className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md" title={t.permissions}>
                        <Shield className="w-4 h-4" />
                      </button>

                      {emp.isActive ? (
                        <button onClick={() => openConfirm(emp, 'disable')} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md" title={t.disableAccount}>
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={() => openConfirm(emp, 'enable')} className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md" title={t.enableAccount}>
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

      {isSidePanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsSidePanelOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-rtl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">{t.detailsTitle}</h2>
              <button onClick={() => setIsSidePanelOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {isLoadingDetail && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-3" />
                  {t.loadingDetails}
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
                      <span className="text-gray-500">{t.role}</span>
                      <span className="font-medium text-gray-800">{getRoleDisplayName(selectedEmployee.roleName)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">{t.branch}</span>
                      <span className="font-medium text-gray-800">{selectedEmployee.branchName ?? t.undefinedBranch}</span>
                    </div>
                    {selectedEmployee.email && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">{t.email}</span>
                        <span className="font-medium text-gray-800">{selectedEmployee.email}</span>
                      </div>
                    )}
                    {selectedEmployee.phone && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">{t.phone}</span>
                        <span className="font-medium text-gray-800">{selectedEmployee.phone}</span>
                      </div>
                    )}
                  </div>

                  <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">{t.accessPermissions}</h4>
                  {selectedEmployee.permissions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.permissions.map((perm, idx) => (
                        <span key={idx} className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-full">
                          {perm}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">{t.noPermissions}</p>
                  )}
                </>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50" onClick={() => setIsSidePanelOpen(false)}>{t.close}</button>
            </div>
          </div>
        </div>
      )}

      {confirmTarget && confirmActionType && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={closeConfirm}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${confirmActionType === 'disable' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                {confirmActionType === 'disable' ? t.confirmDisable : t.confirmEnable}
              </h3>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              {confirmActionType === 'disable'
                ? <>{t.confirmDisableText} <span className="font-bold text-gray-800">{confirmTarget.fullName}</span>?</>
                : <>{t.confirmEnableText} <span className="font-bold text-gray-800">{confirmTarget.fullName}</span>?</>
              }
            </p>
            {confirmActionType === 'disable' && (
              <p className="text-xs text-gray-400 mb-4">{t.confirmDisableNote}</p>
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
                {t.cancel}
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isProcessingAction}
                className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60 ${
                  confirmActionType === 'disable' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isProcessingAction && <Loader2 className="w-4 h-4 animate-spin" />}
                {confirmActionType === 'disable' ? t.disableAccount : t.enableAccount}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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