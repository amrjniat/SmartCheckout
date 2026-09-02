export const ROUTES = {
  login: '/login',
  signup: '/signup',

  dashboard: '/dashboard',
  pos: '/pos',
  products: '/products',
  inventory: '/inventory',
  suppliers: '/suppliers',
  invoices: '/invoices',
  clients: '/clients',
  team: '/team',
  reports: '/reports',
  settings: '/settings',
  notifications: '/notifications',

  cashier: '/cashier',
  cashierPos: '/cashier/pos',
  cashierInvoices: '/cashier/invoices',
  cashierClients: '/cashier/clients',
  cashierNotifications: '/cashier/notifications',

  warehouse: '/warehouse',
  warehouseProducts: '/warehouse/products',
  warehouseInventory: '/warehouse/inventory',
  warehouseSuppliers: '/warehouse/suppliers',
  warehouseReports: '/warehouse/reports',
  warehouseInvoices: '/warehouse/invoices',
  warehouseNotifications: '/warehouse/notifications',
} as const;

export type RouteKey = keyof typeof ROUTES;
