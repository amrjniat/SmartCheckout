import axiosInstance from './axiosInstance';

export interface InventoryItem {
  id: string;
  image: string;
  name: { ar: string; en: string };
  sku: string;
  category: { ar: string; en: string };
  currentQty: number;
  minQty: number;
  lastMovement: string;
  lastUpdate: string;
  history: StockMovement[];
}

export interface AdjustStockRequest {
  warehouseId: number;
  type: 'add' | 'subtract' | 'set';
  quantity: number;
  reason?: string;
}

export interface StockMovement {
  id: string;
  date: string;
  type: 'add' | 'subtract' | 'set';
  quantity: number;
  user: { ar: string; en: string };
  reason: { ar: string; en: string };
}

const normalizeInventoryList = (payload: unknown): any[] => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.data)) return record.data;
    if (Array.isArray(record.items)) return record.items;
    if (Array.isArray(record.products)) return record.products;
  }
  return [];
};

export const inventoryService = {
  getInventory: async (warehouseId: number): Promise<InventoryItem[]> => {
    const response = await axiosInstance.get('/products');
    const rawData = normalizeInventoryList(response.data);

    return rawData.map((p: any) => {
      const primaryWarehouse = Array.isArray(p.productWarehouses)
        ? p.productWarehouses.find((w: any) => Number(w.warehouseId) === Number(warehouseId))
        : null;
      const currentQty = Number(primaryWarehouse?.quantity ?? p.stockQuantity ?? 0);

      return {
        id: String(p.id ?? p.productId ?? 'unknown'),
        image: p.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100',
        name: { ar: p.productName ?? p.name ?? 'منتج', en: p.productName ?? p.name ?? 'Product' },
        sku: p.productCode || p.barcode || p.sku || `SKU-${p.id ?? p.productId ?? 'unknown'}`,
        category: {
          ar: p.category?.categoryName || p.categoryName || 'عام',
          en: p.category?.categoryName || p.categoryName || 'General',
        },
        currentQty,
        minQty: Number(p.minStock ?? 0),
        lastMovement: '0',
        lastUpdate: p.updatedAt || p.createdAt || new Date().toISOString(),
        history: [],
      };
    });
  },

  adjustStock: async (productId: string, data: AdjustStockRequest) => {
    const response = await axiosInstance.post(`/products/${productId}/adjust`, data);
    return response.data;
  },

  restockProduct: async (productId: string, warehouseId: number, quantity: number, reason?: string) => {
    const response = await axiosInstance.post(`/products/${productId}/adjust`, {
      warehouseId,
      type: 'add',
      quantity,
      reason: reason || 'استلام بضاعة',
    });
    return response.data;
  },

  getProductMovements: async (productId: string, warehouseId: number) => {
    const response = await axiosInstance.get(`/products/${productId}/movements`, {
      params: { warehouseId },
    });
    const movements = normalizeInventoryList(response.data);

    return movements.map((m: any) => ({
      id: String(m.id ?? `${productId}-${Date.now()}`),
      date: new Date(m.date ?? Date.now()).toLocaleString('ar-EG'),
      type: m.type,
      quantity: Number(m.quantity ?? 0),
      user: { ar: m.userName ?? 'مستخدم', en: m.userName ?? 'User' },
      reason: { ar: m.reason || 'تعديل مخزون', en: m.reason || 'Stock adjustment' },
    }));
  },
};

export default inventoryService;