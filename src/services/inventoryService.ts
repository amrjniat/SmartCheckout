// src/services/inventoryService.ts

import axiosInstance from './axiosInstance';

export interface AdjustStockRequest {
  warehouseId: number;
  type: 'add' | 'subtract' | 'set';
  quantity: number;
  reason?: string;
}

export const inventoryService = {
  // 1. جلب كافة المنتجات وتحويل شكل البيانات لتناسب الواجهة
  getInventory: async (warehouseId: number) => {
    const response = await axiosInstance.get('/products');
    const rawData = response.data;

    // Mapping: تحويل بيانات C# إلى الهيكل المطلوب في React
    return rawData.map((p: any) => {
      const primaryWarehouse = p.productWarehouses?.find((w: any) => w.warehouseId === warehouseId);
      const currentQty = primaryWarehouse ? primaryWarehouse.quantity : 0;

      return {
        id: p.id.toString(),
        image: p.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100',
        name: { ar: p.productName, en: p.productName },
        sku: p.productCode || p.barcode || `SKU-${p.id}`,
        category: {
          ar: p.category?.categoryName || 'عام',
          en: p.category?.categoryName || 'General'
        },
        currentQty: currentQty,
        minQty: p.minStock || 0,
        lastMovement: '0',
        lastUpdate: p.updatedAt || p.createdAt || new Date().toISOString(),
        history: [] // يتم تحميل السجل بشكل منفصل عند فتح الـ Drawer
      };
    });
  },

  // 2. تعديل الكمية (استدعاء Endpoint الـ Adjust من الكنترولر لديك)
  adjustStock: async (productId: string, data: AdjustStockRequest) => {
    const response = await axiosInstance.post(`/products/${productId}/adjust`, data);
    return response.data;
  },

  // 3. جلب سجل الحركات لمنتج معين عند فتح الـ Drawer
  getProductMovements: async (productId: string, warehouseId: number) => {
    const response = await axiosInstance.get(`/products/${productId}/movements`, {
      params: { warehouseId },
    });
    const movements = response.data;

    // Mapping لسجل الحركات
    return movements.map((m: any) => ({
      id: m.id.toString(),
      date: new Date(m.date).toLocaleString('ar-EG'),
      type: m.type,
      quantity: m.quantity,
      user: { ar: m.userName, en: m.userName },
      reason: { ar: m.reason || 'تعديل مخزون', en: m.reason || 'Stock adjustment' }
    }));
  }
};

export default inventoryService;