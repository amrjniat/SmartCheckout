import axiosInstance from './axiosInstance';

// ============================================
// الأنواع (Types) — تطابق شكل الـ Response من WarehouseController
// ============================================

export interface WarehouseStats {
  totalProducts: number;
  totalStock: number;
  totalEntries: number;
  totalExits: number;
  lowStockItems: number;
  outOfStock: number;
}

export interface RecentMovement {
  id: number;
  movementNumber: string;
  movementType: string; // "إدخال" | "إخراج" | "جرد"
  quantity: number;
  productName: string;
  productCode: string;
  warehouseName: string;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  notes: string | null;
}

export interface MonthlySummary {
  month: string;      // "2026-01"
  monthName: string;  // "يناير"
  inbound: number;
  outbound: number;
}

export interface MostActiveProduct {
  productId: number;
  productName: string;
  totalQuantity: number;
}

export interface InventoryEvolutionPoint {
  weekLabel: string;
  totalQuantity: number;
}

export interface LowStockProduct {
  productId: number;
  productName: string;
  currentQuantity: number;
  minStock: number;
}

export interface OutOfStockProduct {
  productId: number;
  productName: string;
  lastMovementDate: string | null;
  lastMovementType: string | null;
}

export interface WarehouseKpis {
  turnoverRate: number;
  avgDailyConsumption: number;
  todayMovementsCount: number;
  avgDailyInbound: number;
}

// ============================================
// دوال الاستدعاء (Service Functions)
// كل الصفحات (Warehouse Reports, Dashboard, ...) تستورد من هنا فقط
// ============================================

export const warehouseService = {
  // 📊 لوحة التحكم
  getStats: () =>
    axiosInstance.get<WarehouseStats>('/warehouse/stats'),

  getCategoriesStatus: () =>
    axiosInstance.get('/warehouse/stats/categories'),

  getKpis: () =>
    axiosInstance.get<WarehouseKpis>('/warehouse/stats/kpis'),

  // 📋 الحركات
  getRecentMovements: (count = 10) =>
    axiosInstance.get<RecentMovement[]>('/warehouse/movements/recent', {
      params: { count },
    }),

  getMonthlySummary: (months = 6) =>
    axiosInstance.get<MonthlySummary[]>('/warehouse/movements/monthly-summary', {
      params: { months },
    }),

  getMostActiveProducts: (count = 5, period: 'week' | 'month' | 'year' = 'month') =>
    axiosInstance.get<MostActiveProduct[]>('/warehouse/products/most-active', {
      params: { count, period },
    }),

  // 📉 المخزون
  getInventoryEvolution: (weeks = 4) =>
    axiosInstance.get<InventoryEvolutionPoint[]>('/warehouse/stats/inventory-evolution', {
      params: { weeks },
    }),

  getLowStockProducts: () =>
    axiosInstance.get<LowStockProduct[]>('/warehouse/products/low-stock'),

  getOutOfStockProducts: () =>
    axiosInstance.get<OutOfStockProduct[]>('/warehouse/products/out-of-stock'),
};

export default warehouseService;