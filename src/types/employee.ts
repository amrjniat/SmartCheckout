// ============================================
// أنواع بيانات الموظفين (تطابق DTOs الباك-إند)
// ============================================

export type ApiRoleName = 'Admin' | 'Cashier' | 'Warehouse';

export interface Employee {
  id: number;
  fullName: string;
  username: string;
  email: string | null;
  phone: string | null;
  roleId: number;
  roleName: ApiRoleName;
  branchId: number | null;
  branchName: string | null;
  isActive: boolean;
  isLocked: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export interface EmployeeDetail extends Employee {
  permissions: string[];
}

export interface RoleCount {
  roleId: number;
  roleName: ApiRoleName;
  count: number;
}

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  disabledEmployees: number;
  roleBreakdown: RoleCount[];
}

export interface EmployeesListResponse {
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  users: Employee[];
}