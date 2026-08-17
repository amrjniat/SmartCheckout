import axiosInstance from './axiosInstance';

// ============================================
// Types — مطابقة لـ DTOs و Models بالباك اند (POS.DTOs / POS.Models)
// ============================================

export interface SystemSettingsData {
  timeZone?: string;
  fiscalYearStartMonth?: number;
  dateFormat?: string;
  systemName?: string;

  invoicePrefix?: string;
  invoicePadding?: number;
  invoiceFooterMessage?: string;
  defaultPrintCopies?: number;
  showCompanyLogoOnInvoice?: boolean;
  autoPrintOnPayment?: boolean;

  defaultTaxRate?: number;
  taxCalculationMethod?: 'AfterDiscount' | 'BeforeDiscount' | string;
  decimalPlaces?: number;
  currencySymbolPosition?: 'AfterNumber' | 'BeforeNumber' | string;
  roundDecimals?: boolean;

  defaultLowStockAlert?: number;
  autoUpdateStockAfterSale?: boolean;
  autoUpdateStockAfterReturn?: boolean;
  enableLowStockAlerts?: boolean;
  allowNegativeStock?: boolean;
  useBarcodeScannerInPOS?: boolean;

  defaultLanguage?: 'ar' | 'en' | string;
  availableLanguages?: string;
  defaultDirection?: 'rtl' | 'ltr' | string;

  discountPrefix?: string;
  discountSuffix?: string;
  discountPosition?: string;
}

export interface CompanyInfoData {
  companyName?: string;
  companyNameAr?: string;
  branchName?: string;
  logoPath?: string | null;
  headerImagePath?: string;
  address?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  website?: string;
  taxNumber?: string;
  commercialRegister?: string;
  footerNote?: string;
  invoiceFooter?: string;
  currencySymbol?: string;
  currencyCode?: 'SYP' | 'USD' | string;
  timeZone?: string;
  dateFormat?: string;
}

// ============================================
// System Settings — /api/settings
// ============================================

export const getSystemSettings = async (): Promise<SystemSettingsData> => {
  const res = await axiosInstance.get('/settings');
  return res.data;
};

export const updateSystemSettings = async (
  data: Partial<SystemSettingsData>
): Promise<{ message: string; settings: SystemSettingsData }> => {
  const res = await axiosInstance.put('/settings', data);
  return res.data;
};

// ============================================
// Company Info — /api/settings/company
// ============================================

export const getCompanyInfo = async (): Promise<CompanyInfoData> => {
  const res = await axiosInstance.get('/settings/company');
  return res.data;
};

export const updateCompanyInfo = async (
  data: Partial<CompanyInfoData>
): Promise<{ message: string; company: CompanyInfoData }> => {
  const res = await axiosInstance.put('/settings/company', data);
  return res.data;
};

// ============================================
// Logo — /api/settings/logo
// ============================================

export const uploadLogo = async (
  file: File
): Promise<{ message: string; logoPath: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axiosInstance.post('/settings/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteLogo = async (): Promise<{ message: string }> => {
  const res = await axiosInstance.delete('/settings/logo');
  return res.data;
};

// ============================================
// Helper — بناء رابط كامل لصورة الشعار (الملفات الستاتيكية مو تحت /api)
// مثال: logoPath = "/images/logos/logo_xxx.png"
// ============================================

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:5157/api';

export const STATIC_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export const getLogoUrl = (logoPath?: string | null): string | null => {
  if (!logoPath) return null;
  if (logoPath.startsWith('http')) return logoPath;
  return `${STATIC_ORIGIN}${logoPath}`;
};