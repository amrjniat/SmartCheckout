import axiosInstance from './axiosInstance';

// شكل الفاتورة كما يرجعها GET /api/invoices (نفس الـ Select بالباك إند)
export interface InvoiceSummary {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: string;
  notes: string | null;
  customerName: string;
  branchName: string;
  userName: string | null;
  itemsCount: number;
}

interface GetInvoicesResponse {
  total: number;
  page: number;
  pageSize: number;
  invoices: InvoiceSummary[];
}

interface GetInvoicesParams {
  userId?: number;
  branchId?: number;
  status?: string;
  from?: string; // ISO date string
  to?: string;   // ISO date string
  page?: number;
  pageSize?: number;
}

// دالة عامة، تقبل أي فلاتر مدعومة بالباك إند
export const getInvoices = async (params: GetInvoicesParams): Promise<GetInvoicesResponse> => {
  const response = await axiosInstance.get('/Invoices', { params });
  return response.data;
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
    pageSize: 100, // كافي لعرض إحصائيات يوم واحد
  });
};