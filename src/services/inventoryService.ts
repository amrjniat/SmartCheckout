// src/services/inventoryService.ts

// const API_BASE_URL = 'http://localhost:5157/api/products';

// export interface AdjustStockRequest {
//   warehouseId: number;
//   type: 'add' | 'subtract' | 'set';
//   quantity: number;
//   reason?: string;
// }

// export const inventoryService = {
//   // 1. جلب كافة المنتجات وتحويل شكل البيانات لتناسب الواجهة
//   getInventory: async () => {
//     const token = localStorage.getItem('token');
//     const response = await fetch(API_BASE_URL, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) throw new Error('فشل جلب بيانات المخزون');

//     const rawData = await response.json();

//     // Mapping: تحويل بيانات C# إلى الهيكل المطلوب في React
//     return rawData.map((p: any) => {
//       // استخراج الكمية الحالية من المستودع الأول (Default WarehouseId = 1)
//       const primaryWarehouse = p.productWarehouses?.find((w: any) => w.warehouseId === 1);
//       const currentQty = primaryWarehouse ? primaryWarehouse.quantity : 0;

//       return {
//         id: p.id.toString(),
//         image: p.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100',
//         name: { ar: p.productName, en: p.productName },
//         sku: p.productCode || p.barcode || `SKU-${p.id}`,
//         category: { 
//           ar: p.category?.categoryName || 'عام', 
//           en: p.category?.categoryName || 'General' 
//         },
//         currentQty: currentQty,
//         minQty: p.minStock || 0,
//         lastMovement: '0',
//         lastUpdate: p.updatedAt || p.createdAt || new Date().toISOString(),
//         history: [] // يتم تحميل السجل بشكل منفصل عند فتح الـ Drawer
//       };
//     });
//   },

//   // 2. تعديل الكمية (استدعاء Endpoint الـ Adjust من الكنترولر لديك)
//   adjustStock: async (productId: string, data: AdjustStockRequest) => {
//     const token = localStorage.getItem('token');
//     const response = await fetch(`${API_BASE_URL}/${productId}/adjust`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) throw new Error('فشل تعديل الكمية');
//     return response.json();
//   },

//   // 3. جلب سجل الحركات لمنتج معين عند فتح الـ Drawer
//   getProductMovements: async (productId: string, warehouseId: number = 1) => {
//     const token = localStorage.getItem('token');
//     const response = await fetch(`${API_BASE_URL}/${productId}/movements?warehouseId=${warehouseId}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) throw new Error('فشل جلب سجل الحركات');
    
//     const movements = await response.json();

//     // Mapping لسجل الحركات
//     return movements.map((m: any) => ({
//       id: m.id.toString(),
//       date: new Date(m.date).toLocaleString('ar-EG'),
//       type: m.type,
//       quantity: m.quantity,
//       user: { ar: m.userName, en: m.userName },
//       reason: { ar: m.reason || 'تعديل مخزون', en: m.reason || 'Stock adjustment' }
//     }));
//   }
// };








// src/services/inventoryService.ts

const API_BASE_URL = 'http://localhost:5157/api/products';

export interface AdjustStockRequest {
  warehouseId: number;
  type: 'add' | 'subtract' | 'set';
  quantity: number;
  reason?: string;
}

export const inventoryService = {
  // 1. جلب كافة المنتجات وتحويل شكل البيانات لتناسب الواجهة
  getInventory: async () => {
    // ✅ تصحيح: القراءة من sessionStorage بدل localStorage لتطابق authService.ts
    const token = sessionStorage.getItem('token');
    const response = await fetch(API_BASE_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('فشل جلب بيانات المخزون');

    const rawData = await response.json();

    // Mapping: تحويل بيانات C# إلى الهيكل المطلوب في React
    return rawData.map((p: any) => {
      // استخراج الكمية الحالية من المستودع الأول (Default WarehouseId = 1)
      const primaryWarehouse = p.productWarehouses?.find((w: any) => w.warehouseId === 1);
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
    // ✅ تصحيح: القراءة من sessionStorage بدل localStorage
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/${productId}/adjust`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('فشل تعديل الكمية');
    return response.json();
  },

  // 3. جلب سجل الحركات لمنتج معين عند فتح الـ Drawer
  getProductMovements: async (productId: string, warehouseId: number = 1) => {
    // ✅ تصحيح: القراءة من sessionStorage بدل localStorage
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/${productId}/movements?warehouseId=${warehouseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('فشل جلب سجل الحركات');
    
    const movements = await response.json();

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