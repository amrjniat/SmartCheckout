import axiosInstance from './axiosInstance';

// ============================================
// أنواع البيانات القادمة من الباك إند (Raw API Shapes)
// ============================================

// شكل العميل كما يرجع من GET /api/customers (القائمة المرقّمة صفحات)
interface ApiCustomerListItem {
  id: number;
  customerName: string;
  customerCode: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  address: string | null;
  openingBalance: number;
  currentBalance: number;
  totalPurchases: number;
  loyaltyPoints: number;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  invoicesCount: number;
  status: string; // "مدين" | "جديد" | "نشط" | "غير نشط"
}

interface ApiCustomersListResponse {
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  customers: ApiCustomerListItem[];
}

interface ApiCustomerStats {
  period: string;
  startDate: string;
  totalSales: number;
  activeCustomers: number;
  newCustomers: number;
  totalCustomers: number;
  customersWithDebt: number;
}

// ============================================
// النوع اللي بيستخدمه الـ Frontend (ClientsPage.tsx)
// ============================================
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  invoicesCount: number;
  totalPurchases: number;
  balance: number;
  lastPurchase: string;
  status: 'Active' | 'New' | 'Inactive';
  type: 'Regular' | 'VIP' | 'Company';
  city: string;
  isDebtor: boolean; // إضافة جديدة: بديل status "مدين" (badge مستقل بدل حالة منفصلة)
}

export interface CustomerStats {
  totalCustomers: number;
  newCustomers: number;
  activeCustomers: number;
  totalSales: number;
  customersWithDebt: number;
}

// ============================================
// دالة تحويل شكل الباك -> شكل الفرونت
// ============================================
function mapCustomerFromApi(raw: ApiCustomerListItem): Customer {
  // status العربي بيرجع من الباك، بنحوله لواحدة من القيم اللي الواجهة متوقعاها
  // "مدين" منفصلة عن الحالة الأساسية (isDebtor) عشان عميل ممكن يكون "نشط" و"مدين" في نفس الوقت
  let status: Customer['status'] = 'Active';
  if (raw.status === 'جديد') status = 'New';
  else if (raw.status === 'غير نشط') status = 'Inactive';
  else status = 'Active'; // "نشط" أو "مدين" (لأن مدين معناها نشط + عليه رصيد)

  return {
    id: raw.customerCode || `CUST-${raw.id}`,
    name: raw.customerName,
    phone: raw.mobile || raw.phone || '',
    email: raw.email || '',
    invoicesCount: raw.invoicesCount,
    totalPurchases: raw.totalPurchases,
    // في الباك: currentBalance سالب = مدين. في الواجهة: balance موجب = مبلغ مستحق
    balance: raw.currentBalance < 0 ? Math.abs(raw.currentBalance) : 0,
    lastPurchase: raw.createdAt, // ملحوظة: الباك لسه مبيرجعش تاريخ آخر عملية شراء فعلي، هنراجعها لاحقًا
    status,
    type: 'Regular', // الباك لسه معندوش عمود "type" (VIP/Company) — قيمة افتراضية مؤقتة
    city: '', // العمود مش موجود في الباك حاليًا
    isDebtor: raw.currentBalance < 0,
  };
}

// ============================================
// جلب قائمة العملاء
// ============================================
export async function fetchCustomers(params?: {
  search?: string;
  phone?: string;
  hasDebt?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<{ customers: Customer[]; totalItems: number; totalPages: number }> {
  const response = await axiosInstance.get<ApiCustomersListResponse>('/customers', {
    params: {
      search: params?.search || undefined,
      phone: params?.phone || undefined,
      hasDebt: params?.hasDebt,
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
    },
  });

  return {
    customers: response.data.customers.map(mapCustomerFromApi),
    totalItems: response.data.totalItems,
    totalPages: response.data.totalPages,
  };
}

// ============================================
// جلب إحصائيات العملاء (للكروت العلوية)
// ============================================
export async function fetchCustomerStats(): Promise<CustomerStats> {
  const response = await axiosInstance.get<ApiCustomerStats>('/customers/stats', {
    params: { period: 'month' }, // "عملاء جدد" هذا الشهر بدل اليوم فقط، أقرب لمنطق الواجهة الحالي
  });

  return {
    totalCustomers: response.data.totalCustomers,
    newCustomers: response.data.newCustomers,
    activeCustomers: response.data.activeCustomers,
    totalSales: response.data.totalSales,
    customersWithDebt: response.data.customersWithDebt,
  };
}

// ============================================
// إضافة عميل جديد
// ============================================
export interface CreateCustomerPayload {
  customerName: string;
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
}

export async function createCustomer(payload: CreateCustomerPayload): Promise<Customer> {
  const response = await axiosInstance.post('/customers', payload);
  // الباك بيرجع الـ Customer entity الخام (مش بنفس شكل القائمة)، فبنبني كائن Customer يدويًا هنا
  const raw = response.data;
  return {
    id: raw.customerCode || `CUST-${raw.id}`,
    name: raw.customerName,
    phone: raw.mobile || raw.phone || '',
    email: raw.email || '',
    invoicesCount: 0,
    totalPurchases: 0,
    balance: 0,
    lastPurchase: 'N/A',
    status: 'New',
    type: 'Regular',
    city: '',
    isDebtor: false,
  };
}