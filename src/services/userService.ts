import axiosInstance from './axiosInstance';
import type {
  Employee,
  EmployeeDetail,
  EmployeeStats,
  EmployeesListResponse,
} from '../types/employee';

// ============================================
// خدمة إدارة الموظفين (Employee Management)
// ============================================

// جلب الإحصائيات (البطاقات الأربعة فوق الجدول)
export const getEmployeeStats = async (): Promise<EmployeeStats> => {
  const response = await axiosInstance.get<EmployeeStats>('/users/stats');
  return response.data;
};

// جلب قائمة الموظفين (مع دعم البحث والفلترة لاحقاً)
export const getEmployees = async (params?: {
  search?: string;
  roleId?: number;
  branchId?: number;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<EmployeesListResponse> => {
  const response = await axiosInstance.get<EmployeesListResponse>('/users', {
    params,
  });
  return response.data;
};

// جلب تفاصيل موظف معين (مع الصلاحيات) - للـ Side Panel
export const getEmployeeById = async (id: number): Promise<EmployeeDetail> => {
  const response = await axiosInstance.get<EmployeeDetail>(`/users/${id}`);
  return response.data;
};

// إضافة موظف جديد
export const createEmployee = async (data: {
  fullName: string;
  username: string;
  password: string;
  email?: string;
  phone?: string;
  roleId: number;
  branchId?: number;
}): Promise<{ message: string; userId: number }> => {
  const response = await axiosInstance.post('/users', data);
  return response.data;
};

// تحديث بيانات موظف
export const updateEmployee = async (
  id: number,
  data: {
    fullName?: string;
    email?: string;
    phone?: string;
    roleId?: number;
    branchId?: number;
  }
): Promise<{ message: string }> => {
  const response = await axiosInstance.put(`/users/${id}`, data);
  return response.data;
};

// تفعيل / تعطيل موظف
export const updateEmployeeStatus = async (
  id: number,
  isActive: boolean
): Promise<{ message: string }> => {
  const response = await axiosInstance.put(`/users/${id}/status`, {
    isActive,
  });
  return response.data;
};

// حذف موظف (Soft Delete)
export const deleteEmployee = async (id: number): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};