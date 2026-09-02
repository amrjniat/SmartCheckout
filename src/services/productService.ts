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



import axiosInstance from './axiosInstance';

export interface ProductWarehouseSummary {
  id?: number;
  warehouseId?: number;
  quantity?: number;
  stockQuantity?: number;
}

export interface ProductCategorySummary {
  id?: number;
  categoryName?: string;
  name?: string;
}

export interface Product {
  id: number | string;
  productName?: string;
  name?: string;
  productCode?: string;
  barcode?: string;
  price?: number;
  unitPrice?: number;
  sellingPrice?: number;
  purchasePrice?: number;
  imageUrl?: string;
  category?: string | ProductCategorySummary | null;
  categoryName?: string;
  categoryId?: number | string;
  productWarehouses?: ProductWarehouseSummary[];
  minStock?: number;
  stockQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await axiosInstance.get<Product[]>('/Products');
  return Array.isArray(response.data) ? response.data : [];
};

export const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  const response = await axiosInstance.post<Product>('/Products', productData);
  return response.data;
};

export const deleteProduct = async (id: number | string): Promise<void> => {
  await axiosInstance.delete(`/Products/${id}`);
};