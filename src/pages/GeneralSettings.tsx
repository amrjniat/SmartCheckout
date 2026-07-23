import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import {
  Building2, Settings, Receipt, Coins, Package, Languages,
  Save, Check, Search, Upload, Info, RotateCcw
} from 'lucide-react';

type LayoutContext = { isRtl: boolean; setIsRtl: (value: boolean) => void };

type TabType = 'company' | 'system' | 'invoice' | 'currency' | 'inventory' | 'language';

// ================= Translations =================
const translations = {
  ar: {
    pageTitle: 'الإعدادات العامة',
    pageSubtitle: 'إدارة جميع إعدادات SmartCheckout',
    searchSettings: 'ابحث داخل الإعدادات...',
    unsavedChanges: 'توجد تغييرات غير محفوظة',
    autoSaved: 'تم الحفظ تلقائياً',
    lastSaved: 'آخر حفظ:',
    lastSavedValue: 'منذ 5 دقائق',
    now: 'الآن',
    tabCompany: 'معلومات الشركة',
    tabSystem: 'إعدادات النظام',
    tabInvoice: 'إعدادات الفواتير',
    tabCurrency: 'العملات والضرائب',
    tabInventory: 'إعدادات المخزون',
    tabLanguage: 'اللغة والواجهة',
    companyLogo: 'شعار الشركة',
    uploadLogo: 'رفع الشعار',
    previewLogo: 'معاينة الشعار',
    remove: 'إزالة',
    logoFormats: 'الصيغ المدعومة: PNG, JPG (الأبعاد الموصى بها 200×200 بكسل)',
    lastUpdate: 'آخر تحديث: 12 مايو 2026',
    companyData: 'بيانات الشركة',
    companyName: 'اسم الشركة',
    companyNameValue: 'سوبر ماركت الأمل',
    branchName: 'اسم الفرع',
    branchNameValue: 'الفرع الرئيسي',
    contactInfo: 'معلومات التواصل',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    taxData: 'البيانات الضريبية',
    taxNumber: 'الرقم الضريبي',
    taxNumberTooltip: 'الرقم الذي سيظهر مطبوعاً على الفواتير الرسمية.',
    commercialRegister: 'السجل التجاري (اختياري)',
    address: 'العنوان',
    fullAddress: 'العنوان الكامل',
    fullAddressValue: 'دمشق، المزة، الشارع الرئيسي',
    basicSettings: 'الإعدادات الأساسية',
    systemName: 'اسم النظام (للعرض الداخلي)',
    timezone: 'المنطقة الزمنية',
    dateFormat: 'تنسيق التاريخ',
    fiscalYearStart: 'بداية السنة المالية',
    fiscalJan: '1 يناير',
    fiscalApr: '1 أبريل',
    fiscalJul: '1 يوليو',
    invoiceNumbering: 'ترقيم الفواتير',
    invoicePrefix: 'بادئة الفاتورة (Prefix)',
    invoicePadding: 'عدد الخانات (Padding)',
    nextNumber: 'الرقم القادم (للمعاينة)',
    printOptions: 'خيارات الطباعة',
    autoPrintCopies: 'عدد النسخ المطبوعة التلقائية',
    invoiceFooter: 'رسالة أسفل الفاتورة (Footer)',
    invoiceFooterValue: 'شكراً لتسوقكم معنا!',
    showLogoOnInvoice: 'إظهار شعار الشركة في الفاتورة',
    autoPrintOnPayment: 'الطباعة التلقائية فور اكتمال الدفع',
    currencySettings: 'إعدادات العملة',
    defaultCurrency: 'العملة الافتراضية',
    currencySyp: 'ليرة سورية (SYP)',
    currencyUsd: 'دولار أمريكي (USD)',
    currencySymbol: 'رمز العملة',
    currencySymbolValue: 'ل.س',
    decimalPlaces: 'عدد المنازل العشرية',
    symbolPosition: 'موضع رمز العملة',
    symbolAfter: 'بعد الرقم (1500 ل.س)',
    symbolBefore: 'قبل الرقم (ل.س 1500)',
    taxes: 'الضرائب',
    defaultTaxRate: 'نسبة الضريبة الافتراضية (%)',
    taxCalcMethod: 'طريقة احتساب الضريبة',
    taxAfterDiscount: 'بعد الخصم (موصى به)',
    taxBeforeDiscount: 'قبل الخصم',
    roundDecimals: 'تقريب الكسور العشرية إلى أقرب رقم صحيح',
    stockMovement: 'حركة المخزون والتنبيهات',
    defaultAlertThreshold: 'الحد الأدنى الافتراضي للتنبيه',
    useBarcode: 'استخدام أجهزة الباركود في واجهة الكاشير',
    autoUpdateStock: 'تحديث كمية المخزون تلقائياً بعد البيع/الاسترجاع',
    lowStockAlerts: 'تفعيل تنبيهات انخفاض المخزون (تظهر للكاشير والإدارة)',
    allowNegativeStock: 'السماح ببيع المنتجات (المخزون السالب) عند النفاذ',
    allowNegativeStockTooltip: 'في حال التفعيل، يمكن للكاشير بيع منتج رصيده 0 وسينزل الرصيد بالسالب.',
    interfaceLanguageSettings: 'إعدادات الواجهة واللغة',
    defaultLanguage: 'لغة النظام الافتراضية',
    optArabic: 'العربية (Arabic)',
    optEnglish: 'English',
    defaultDirection: 'اتجاه الواجهة الافتراضي (Direction)',
    dirRtl: 'RTL (يمين إلى يسار)',
    dirLtr: 'LTR (يسار إلى يمين)',
    cancelChanges: 'إلغاء التعديلات',
    saving: 'جاري الحفظ...',
    savedSuccess: 'تم الحفظ بنجاح',
    saveChanges: 'حفظ التغييرات',
  },
  en: {
    pageTitle: 'General Settings',
    pageSubtitle: 'Manage all SmartCheckout settings',
    searchSettings: 'Search within settings...',
    unsavedChanges: 'You have unsaved changes',
    autoSaved: 'Saved automatically',
    lastSaved: 'Last saved:',
    lastSavedValue: '5 minutes ago',
    now: 'Now',
    tabCompany: 'Company Info',
    tabSystem: 'System Settings',
    tabInvoice: 'Invoice Settings',
    tabCurrency: 'Currencies & Taxes',
    tabInventory: 'Inventory Settings',
    tabLanguage: 'Language & Interface',
    companyLogo: 'Company Logo',
    uploadLogo: 'Upload Logo',
    previewLogo: 'Preview Logo',
    remove: 'Remove',
    logoFormats: 'Supported formats: PNG, JPG (recommended 200×200 px)',
    lastUpdate: 'Last update: May 12, 2026',
    companyData: 'Company Data',
    companyName: 'Company Name',
    companyNameValue: 'Al-Amal Supermarket',
    branchName: 'Branch Name',
    branchNameValue: 'Main Branch',
    contactInfo: 'Contact Information',
    phone: 'Phone Number',
    email: 'Email Address',
    taxData: 'Tax Information',
    taxNumber: 'Tax Number',
    taxNumberTooltip: 'The number that will be printed on official invoices.',
    commercialRegister: 'Commercial Register (optional)',
    address: 'Address',
    fullAddress: 'Full Address',
    fullAddressValue: 'Damascus, Al-Mazzeh, Main Street',
    basicSettings: 'Basic Settings',
    systemName: 'System Name (internal display)',
    timezone: 'Timezone',
    dateFormat: 'Date Format',
    fiscalYearStart: 'Fiscal Year Start',
    fiscalJan: 'Jan 1',
    fiscalApr: 'Apr 1',
    fiscalJul: 'Jul 1',
    invoiceNumbering: 'Invoice Numbering',
    invoicePrefix: 'Invoice Prefix',
    invoicePadding: 'Padding (digits)',
    nextNumber: 'Next Number (preview)',
    printOptions: 'Print Options',
    autoPrintCopies: 'Auto-printed copies count',
    invoiceFooter: 'Invoice Footer Message',
    invoiceFooterValue: 'Thank you for shopping with us!',
    showLogoOnInvoice: 'Show company logo on invoice',
    autoPrintOnPayment: 'Auto-print upon payment completion',
    currencySettings: 'Currency Settings',
    defaultCurrency: 'Default Currency',
    currencySyp: 'Syrian Pound (SYP)',
    currencyUsd: 'US Dollar (USD)',
    currencySymbol: 'Currency Symbol',
    currencySymbolValue: 'SYP',
    decimalPlaces: 'Decimal Places',
    symbolPosition: 'Currency Symbol Position',
    symbolAfter: 'After number (1500 SYP)',
    symbolBefore: 'Before number (SYP 1500)',
    taxes: 'Taxes',
    defaultTaxRate: 'Default Tax Rate (%)',
    taxCalcMethod: 'Tax Calculation Method',
    taxAfterDiscount: 'After discount (recommended)',
    taxBeforeDiscount: 'Before discount',
    roundDecimals: 'Round decimals to nearest whole number',
    stockMovement: 'Stock Movement & Alerts',
    defaultAlertThreshold: 'Default Alert Threshold',
    useBarcode: 'Use barcode devices in cashier interface',
    autoUpdateStock: 'Auto-update stock quantity after sale/return',
    lowStockAlerts: 'Enable low stock alerts (shown to cashier & admin)',
    allowNegativeStock: 'Allow selling products (negative stock) when out of stock',
    allowNegativeStockTooltip: 'If enabled, the cashier can sell a product with 0 balance and the balance will go negative.',
    interfaceLanguageSettings: 'Interface & Language Settings',
    defaultLanguage: 'Default System Language',
    optArabic: 'العربية (Arabic)',
    optEnglish: 'English',
    defaultDirection: 'Default Interface Direction',
    dirRtl: 'RTL (right to left)',
    dirLtr: 'LTR (left to right)',
    cancelChanges: 'Discard Changes',
    saving: 'Saving...',
    savedSuccess: 'Saved successfully',
    saveChanges: 'Save Changes',
  },
};

export default function GeneralSettings() {
  const { isRtl } = useOutletContext<LayoutContext>();
  const lang: 'ar' | 'en' = isRtl ? 'ar' : 'en';
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<TabType>('company');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>(t.lastSavedValue);

  // Keep the "last saved" placeholder in sync with the current language
  useEffect(() => {
    setLastSaved(prev =>
      prev === translations.ar.lastSavedValue || prev === translations.en.lastSavedValue
        ? t.lastSavedValue
        : prev
    );
  }, [lang, t.lastSavedValue]);

  const handleInputChange = () => {
    setHasUnsavedChanges(true);
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setHasUnsavedChanges(false);
      setLastSaved(t.now);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1200);
  };

  const tabs = [
    { id: 'company', label: t.tabCompany, icon: Building2 },
    { id: 'system', label: t.tabSystem, icon: Settings },
    { id: 'invoice', label: t.tabInvoice, icon: Receipt },
    { id: 'currency', label: t.tabCurrency, icon: Coins },
    { id: 'inventory', label: t.tabInventory, icon: Package },
    { id: 'language', label: t.tabLanguage, icon: Languages },
  ] as const;

  const filteredTabs = tabs.filter(tab =>
    tab.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="flex h-screen bg-[#F8FAFC] text-gray-800 font-sans">

      {/* Sidebar */}
      <aside className={`w-72 bg-white ${isRtl ? 'border-l' : 'border-r'} border-gray-200 flex flex-col shadow-sm z-10`}>
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`} size={18} />
            <input
              type="text"
              placeholder={t.searchSettings}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${isRtl ? 'pl-3 pr-10' : 'pr-3 pl-10'} py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
            />
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                }`}
              >
                <Icon size={22} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">

        {/* Page Header */}
        <header className="px-8 py-6 bg-[#F8FAFC] flex justify-between items-end border-b border-gray-200 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.pageTitle}</h1>
            <p className="text-sm text-gray-500 mt-1">{t.pageSubtitle}</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {hasUnsavedChanges ? (
              <span className="flex items-center gap-1.5 text-orange-600 font-medium bg-orange-50 px-3 py-1.5 rounded-lg">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                </span>
                {t.unsavedChanges}
              </span>
            ) : isSaved ? (
              <span className="flex items-center gap-1.5 text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-lg">
                <Check size={16} /> {t.autoSaved}
              </span>
            ) : (
              <span className="text-gray-500">{t.lastSaved} {lastSaved}</span>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 pb-32">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* 1. Company Info */}
            {activeTab === 'company' && (
              <>
                <SettingsCard title={t.companyLogo}>
                  <div className="flex items-center gap-6">
                    <div className="w-28 h-28 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 hover:border-blue-400 transition-all">
                      <Upload size={28} className="mb-2 text-gray-400" />
                      <span className="text-sm font-medium">{t.uploadLogo}</span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">{t.previewLogo}</button>
                        <button className="px-4 py-2 text-red-600 bg-red-50 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">{t.remove}</button>
                      </div>
                      <p className="text-xs text-gray-500">{t.logoFormats}</p>
                      <p className="text-xs text-gray-400">{t.lastUpdate}</p>
                    </div>
                  </div>
                </SettingsCard>

                <SettingsCard title={t.companyData}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label={t.companyName} defaultValue={t.companyNameValue} onChange={handleInputChange} isRtl={isRtl} />
                    <InputField label={t.branchName} defaultValue={t.branchNameValue} onChange={handleInputChange} isRtl={isRtl} />
                  </div>
                </SettingsCard>

                <SettingsCard title={t.contactInfo}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label={t.phone} defaultValue="+963 XX XXX XXXX" dir="ltr" onChange={handleInputChange} isRtl={isRtl} />
                    <InputField label={t.email} defaultValue="info@company.com" dir="ltr" onChange={handleInputChange} isRtl={isRtl} />
                  </div>
                </SettingsCard>

                <SettingsCard title={t.taxData}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label={t.taxNumber} defaultValue="123456789" onChange={handleInputChange} tooltip={t.taxNumberTooltip} isRtl={isRtl} />
                    <InputField label={t.commercialRegister} onChange={handleInputChange} isRtl={isRtl} />
                  </div>
                </SettingsCard>

                <SettingsCard title={t.address}>
                  <InputField label={t.fullAddress} defaultValue={t.fullAddressValue} onChange={handleInputChange} isRtl={isRtl} />
                </SettingsCard>
              </>
            )}

            {/* 2. System Settings */}
            {activeTab === 'system' && (
              <SettingsCard title={t.basicSettings}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label={t.systemName} defaultValue="SmartCheckout POS" onChange={handleInputChange} isRtl={isRtl} />
                  <SelectField label={t.timezone} options={['Asia/Damascus', 'Asia/Riyadh']} dir="ltr" onChange={handleInputChange} />
                  <SelectField label={t.dateFormat} options={['DD/MM/YYYY', 'YYYY/MM/DD']} dir="ltr" onChange={handleInputChange} />
                  <SelectField label={t.fiscalYearStart} options={[t.fiscalJan, t.fiscalApr, t.fiscalJul]} onChange={handleInputChange} />
                </div>
              </SettingsCard>
            )}

            {/* 3. Invoice Settings */}
            {activeTab === 'invoice' && (
              <>
                <SettingsCard title={t.invoiceNumbering}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InputField label={t.invoicePrefix} defaultValue="INV-" dir="ltr" onChange={handleInputChange} isRtl={isRtl} />
                    <InputField label={t.invoicePadding} defaultValue="6" type="number" dir="ltr" onChange={handleInputChange} isRtl={isRtl} />
                    <InputField label={t.nextNumber} value="INV-000001" disabled dir="ltr" isRtl={isRtl} />
                  </div>
                </SettingsCard>

                <SettingsCard title={t.printOptions}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-2">
                      <InputField label={t.autoPrintCopies} defaultValue="1" type="number" onChange={handleInputChange} isRtl={isRtl} />
                      <InputField label={t.invoiceFooter} defaultValue={t.invoiceFooterValue} onChange={handleInputChange} isRtl={isRtl} />
                    </div>
                    <CheckboxField label={t.showLogoOnInvoice} defaultChecked onChange={handleInputChange} />
                    <CheckboxField label={t.autoPrintOnPayment} defaultChecked onChange={handleInputChange} />
                  </div>
                </SettingsCard>
              </>
            )}

            {/* 4. Currencies & Taxes */}
            {activeTab === 'currency' && (
              <>
                <SettingsCard title={t.currencySettings}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <SelectField label={t.defaultCurrency} options={[t.currencySyp, t.currencyUsd]} onChange={handleInputChange} />
                    <InputField label={t.currencySymbol} defaultValue={t.currencySymbolValue} onChange={handleInputChange} isRtl={isRtl} />
                    <SelectField label={t.decimalPlaces} options={['0', '1', '2', '3']} onChange={handleInputChange} />
                    <SelectField label={t.symbolPosition} options={[t.symbolAfter, t.symbolBefore]} onChange={handleInputChange} />
                  </div>
                </SettingsCard>

                <SettingsCard title={t.taxes}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                    <InputField label={t.defaultTaxRate} defaultValue="11" type="number" dir="ltr" onChange={handleInputChange} isRtl={isRtl} />
                    <SelectField label={t.taxCalcMethod} options={[t.taxAfterDiscount, t.taxBeforeDiscount]} onChange={handleInputChange} />
                  </div>
                  <CheckboxField label={t.roundDecimals} defaultChecked onChange={handleInputChange} />
                </SettingsCard>
              </>
            )}

            {/* 5. Inventory Settings */}
            {activeTab === 'inventory' && (
              <SettingsCard title={t.stockMovement}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <InputField label={t.defaultAlertThreshold} defaultValue="10" type="number" dir="ltr" onChange={handleInputChange} isRtl={isRtl} />
                </div>
                <div className="space-y-4">
                  <CheckboxField label={t.useBarcode} defaultChecked onChange={handleInputChange} />
                  <CheckboxField label={t.autoUpdateStock} defaultChecked onChange={handleInputChange} />
                  <CheckboxField label={t.lowStockAlerts} defaultChecked onChange={handleInputChange} />
                  <CheckboxField label={t.allowNegativeStock} onChange={handleInputChange} tooltip={t.allowNegativeStockTooltip} />
                </div>
              </SettingsCard>
            )}

            {/* 6. Language */}
            {activeTab === 'language' && (
              <SettingsCard title={t.interfaceLanguageSettings}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <SelectField label={t.defaultLanguage} options={[t.optArabic, t.optEnglish]} onChange={handleInputChange} />
                  <SelectField label={t.defaultDirection} options={[t.dirRtl, t.dirLtr]} dir="ltr" onChange={handleInputChange} />
                </div>
              </SettingsCard>
            )}

          </div>
        </div>

        {/* Sticky Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 px-8 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
          <button
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <RotateCcw size={18} />
            {t.cancelChanges}
          </button>

          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges && !isSaving && !isSaved}
            className={`flex items-center gap-2 px-8 py-2.5 text-sm font-medium text-white rounded-lg transition-all ${
              isSaved
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t.saving}
              </>
            ) : isSaved ? (
              <>
                <Check size={18} />
                {t.savedSuccess}
              </>
            ) : (
              <>
                <Save size={18} />
                {t.saveChanges}
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

/* ---------------- Sub Components ---------------- */

function SettingsCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-50">{title}</h3>
      {children}
    </div>
  );
}

function InputField({ label, tooltip, isRtl = true, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string, tooltip?: string, isRtl?: boolean }) {
  return (
    <div className="flex flex-col gap-2 relative group">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        {label}
        {tooltip && (
          <div className="relative flex items-center">
            <Info size={14} className="text-gray-400 hover:text-blue-500 cursor-help transition-colors" />
            <div className={`absolute bottom-full ${isRtl ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center`}>
              {tooltip}
              <div className={`absolute top-full ${isRtl ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} border-4 border-transparent border-t-gray-800`}></div>
            </div>
          </div>
        )}
      </label>
      <input
        className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all disabled:bg-gray-100 disabled:text-gray-500 text-sm"
        {...props}
      />
    </div>
  );
}

function SelectField({ label, options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, options: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm appearance-none cursor-pointer"
        {...props}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function CheckboxField({ label, tooltip, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string, tooltip?: string }) {
  return (
    <label className={`flex items-start gap-3 cursor-pointer group p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all -mx-3`}>
      <div className="pt-0.5">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer transition-colors"
          {...props}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-700 font-medium">{label}</span>
        {tooltip && <span className="text-xs text-gray-500 mt-1">{tooltip}</span>}
      </div>
    </label>
  );
}
