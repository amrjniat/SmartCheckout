import axiosInstance from './axiosInstance';

// 1. تعريف واجهة المورد (يجب أن تتطابق مع خصائص الـ DTO أو الـ Model المرتجع من الـ ASP.NET Backend)
export interface Supplier {
  id: string | number; 
  image: string;
  // قمنا بفصل الكائنات المعقدة لتسهيل التعامل مع الـ Backend
  nameAr: string;
  nameEn: string;
  companyAr: string;
  companyEn: string;
  phone: string;
  email: string;
  cityAr: string;
  cityEn: string;
  productsCount: number;
  lastSupplyDate: string;
  status: 'active' | 'inactive' | 'suspended';
  rating: number;
}

// 2. دالة جلب جميع الموردين
export const getSuppliers = async (): Promise<Supplier[]> => {
  // افترضنا أن اسم الـ Controller هو Suppliers
  const response = await axiosInstance.get<Supplier[]>('/Suppliers');
  return response.data;
};

// 3. دالة إضافة مورد جديد
// نستخدم Omit لاستبعاد الحقول التي يقوم الباك إند بتوليدها تلقائياً (مثل id, productsCount, rating)
export const addSupplier = async (supplierData: Omit<Supplier, 'id' | 'productsCount' | 'lastSupplyDate' | 'rating' | 'image'>): Promise<Supplier> => {
  const response = await axiosInstance.post<Supplier>('/Suppliers', supplierData);
  return response.data;
};

// 4. دالة تعديل مورد موجود (هذه الدالة التي كانت تسبب الخطأ لعدم وجودها)
export const updateSupplier = async (id: string | number, supplierData: Partial<Supplier>): Promise<Supplier> => {
  const response = await axiosInstance.put<Supplier>(`/Suppliers/${id}`, supplierData);
  return response.data;
};

// 5. (اختياري مستقبلاً) دالة حذف مورد
export const deleteSupplier = async (id: string | number): Promise<void> => {
  await axiosInstance.delete(`/Suppliers/${id}`);
};