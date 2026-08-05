// import axios from 'axios';

// // رابط الـ Backend الخاص بالـ API
// const API_URL = 'http://localhost:5157/api/Products';

// // دالة جلب جميع المنتجات مع كميات المستودعات
// export const getProducts = async () => {
//   const token = localStorage.getItem('token'); 
  
//   const response = await axios.get(API_URL, {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });
  
//   return response.data;
// };



// نستورد الـ instance الخاص بنا بدلاً من مكتبة axios المباشرة
import axiosInstance from './axiosInstance';

export interface Product {
  id: number | string;
  name: string;
  stockQuantity: number;
  price?: number;
  category?: string;
}

// دالة جلب المنتجات
export const getProducts = async (): Promise<Product[]> => {
  const response = await axiosInstance.get<Product[]>('/Products');
  return response.data;
};

// دالة إضافة مادة جديدة للـ Backend
export const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  const response = await axiosInstance.post<Product>('/Products', productData);
  return response.data;
};

// دالة حذف منتج (Soft Delete) - الباك إند لا يحذفه فعلياً من قاعدة البيانات،
// بل يضع IsActive = false للحفاظ على سجل الفواتير القديمة المرتبطة بهذا المنتج
export const deleteProduct = async (id: number | string): Promise<void> => {
  await axiosInstance.delete(`/Products/${id}`);
};