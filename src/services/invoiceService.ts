// import axiosInstance from './axiosInstance';

// // شكل الفاتورة كما يرجعها GET /api/invoices
// export interface InvoiceSummary {
//   id: number;
//   invoiceNumber: string;
//   invoiceDate: string;
//   subTotal: number;
//   taxAmount: number;
//   discountAmount: number;
//   totalAmount: number;
//   status: string;
//   notes: string | null;
//   customerName: string;
//   branchName: string;
//   userName: string | null;
//   itemsCount: number;
// }

// interface GetInvoicesResponse {
//   total: number;
//   page: number;
//   pageSize: number;
//   invoices: InvoiceSummary[];
// }

// interface GetInvoicesParams {
//   userId?: number;
//   branchId?: number;
//   status?: string;
//   from?: string; // ISO date string
//   to?: string;   // ISO date string
//   page?: number;
//   pageSize?: number;
// }

// // دالة عامة
// export const getInvoices = async (params: GetInvoicesParams): Promise<GetInvoicesResponse> => {
//   const response = await axiosInstance.get('/Invoices', { params });
//   return response.data;
// };

// // دالة مخصصة لصفحة الكاشير: فواتير اليوم للمستخدم الحالي فقط
// export const getTodayInvoicesForUser = async (
//   userId: number,
//   branchId: number
// ): Promise<GetInvoicesResponse> => {
//   const now = new Date();
//   const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
//   const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

//   return getInvoices({
//     userId,
//     branchId,
//     from: startOfDay,
//     to: endOfDay,
//     page: 1,
//     pageSize: 100,
//   });
// };

// // ✅ الدالة الجديدة: تجلب كل فواتير الفرع اليوم (بدون فلترة حسب المستخدم)
// export const getTodayInvoicesForBranch = async (
//   branchId: number
// ): Promise<GetInvoicesResponse> => {
//   const now = new Date();
//   const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
//   const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

//   return getInvoices({
//     branchId,
//     from: startOfDay,
//     to: endOfDay,
//     page: 1,
//     pageSize: 100,
//   });
// };




import axiosInstance from './axiosInstance';

// ============================================
// أنواع البيانات (Types)
// ============================================

// ✅ القيم الرسمية الوحيدة المسموحة لحالة الفاتورة (موثقة بتعليق داخل Invoice.cs بالباك إند)
// ملاحظة: الباك إند (UpdateStatus action) لا يتحقق من هذه القيمة إطلاقاً —
// الالتزام بها مسؤولية الفرونت إند بالكامل عبر هذا الـ type.
export type InvoiceStatus = 'مدفوعة' | 'غير مدفوعة' | 'ملغاة';

// شكل الفاتورة كما يرجعها GET /api/invoices (نفس الاسم الأصلي InvoiceSummary — محفوظ للتوافق
// مع الملفات القديمة مثل CashierDashboard.tsx)
export interface InvoiceSummary {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  notes: string | null;
  customerName: string;
  branchName: string;
  userName: string | null;
  itemsCount: number;
}

// اسم بديل لنفس النوع — يُستخدم بصفحة Invoices.tsx الجديدة
export type InvoiceListItem = InvoiceSummary;

interface GetInvoicesResponse {
  total: number;
  page: number;
  pageSize: number;
  invoices: InvoiceSummary[];
}

export type InvoicesListResponse = GetInvoicesResponse;

interface GetInvoicesParams {
  userId?: number; // ⚠️ الباك إند الحالي (GetAll) لا يدعم هذا الفلتر فعلياً — محفوظ للتوافق فقط، راجع الملاحظة أعلاه
  customerId?: number;
  branchId?: number;
  status?: InvoiceStatus;
  from?: string; // ISO date string
  to?: string; // ISO date string
  page?: number;
  pageSize?: number;
}

export interface InvoiceItemDetail {
  id: number;
  invoiceId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  taxAmount: number;
  product: any; // كائن المنتج الكامل — يمكن تدقيقه لاحقاً حسب الحاجة الفعلية بالواجهة
}

export interface InvoiceDetail {
  id: number;
  invoiceNumber: string;
  customerId: number;
  branchId: number;
  userId: number | null;
  invoiceDate: string;
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  notes: string | null;
  customer: any; // كائن العميل الكامل
  branch: any; // كائن الفرع الكامل
  user: any; // كائن المستخدم — ⚠️ يحتوي passwordHash بالـ response الحالي من الباك إند، لا يُعرض بالواجهة
  invoiceItems: InvoiceItemDetail[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

// ============================================
// دوال الخدمة (Service Functions)
// ============================================

// دالة عامة — GET /api/invoices
export const getInvoices = async (params: GetInvoicesParams = {}): Promise<GetInvoicesResponse> => {
  try {
    const response = await axiosInstance.get('/Invoices', { params });
    return response.data;
  } catch (error) {
    console.error('❌ خطأ أثناء جلب قائمة الفواتير:', error);
    throw error;
  }
};

// دالة مخصصة لصفحة الكاشير: فواتير اليوم للمستخدم الحالي فقط
export const getTodayInvoicesForUser = async (
  userId: number,
  branchId: number
): Promise<GetInvoicesResponse> => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

  return getInvoices({
    userId,
    branchId,
    from: startOfDay,
    to: endOfDay,
    page: 1,
    pageSize: 100,
  });
};

// تجلب كل فواتير الفرع اليوم (بدون فلترة حسب المستخدم)
export const getTodayInvoicesForBranch = async (branchId: number): Promise<GetInvoicesResponse> => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

  return getInvoices({
    branchId,
    from: startOfDay,
    to: endOfDay,
    page: 1,
    pageSize: 100,
  });
};

// GET /api/Invoices/{id} — تفاصيل فاتورة واحدة كاملة (تُستخدم عند فتح الـ Modal)
export const getInvoiceById = async (id: number): Promise<InvoiceDetail> => {
  try {
    const response = await axiosInstance.get(`/Invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ خطأ أثناء جلب تفاصيل الفاتورة رقم ${id}:`, error);
    throw error;
  }
};

// PUT /api/Invoices/{id}/status — تحديث حالة فاتورة
export const updateInvoiceStatus = async (
  id: number,
  status: InvoiceStatus
): Promise<{ message: string; invoice: InvoiceDetail }> => {
  try {
    const response = await axiosInstance.put(`/Invoices/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`❌ خطأ أثناء تحديث حالة الفاتورة رقم ${id}:`, error);
    throw error;
  }
};

// DELETE /api/Invoices/{id} — حذف ناعم (soft delete)
// ⚠️ هذا الـ endpoint محصور بالباك إند بدور "مدير النظام" فقط ([Authorize(Roles = "مدير النظام")]).
// يجب إخفاء زر الحذف بالواجهة لأي مستخدم دوره غير ذلك، حتى لا يصطدم بخطأ 403.
export const deleteInvoice = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete(`/Invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ خطأ أثناء حذف الفاتورة رقم ${id}:`, error);
    throw error;
  }
};