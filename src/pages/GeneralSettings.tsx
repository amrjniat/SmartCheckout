import React, { useState, useEffect } from 'react';

import { 
  Building2, Settings, Receipt, Coins, Package, Languages, 
  Save, Check, Search, AlertCircle, Upload, Info, RotateCcw
} from 'lucide-react';

type TabType = 'company' | 'system' | 'invoice' | 'currency' | 'inventory' | 'language';

export default function GeneralSettings() {
  const [activeTab, setActiveTab] = useState<TabType>('company');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('منذ 5 دقائق');

  // محاكاة اكتشاف التغييرات عند الكتابة في أي حقل
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
      setLastSaved('الآن');
      setTimeout(() => setIsSaved(false), 3000);
    }, 1200);
  };

  const tabs = [
    { id: 'company', label: 'معلومات الشركة', icon: Building2 },
    { id: 'system', label: 'إعدادات النظام', icon: Settings },
    { id: 'invoice', label: 'إعدادات الفواتير', icon: Receipt },
    { id: 'currency', label: 'العملات والضرائب', icon: Coins },
    { id: 'inventory', label: 'إعدادات المخزون', icon: Package },
    { id: 'language', label: 'اللغة والواجهة', icon: Languages },
  ] as const;

  const filteredTabs = tabs.filter(tab => tab.label.includes(searchQuery));

  return (
    <div dir="rtl" className="flex h-screen bg-[#F8FAFC] text-gray-800 font-sans">
      
      {/* Sidebar - تم توسيعه وزيادة الفراغات */}
      <aside className="w-72 bg-white border-l border-gray-200 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="ابحث داخل الإعدادات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
            <h1 className="text-2xl font-bold text-gray-900">الإعدادات العامة</h1>
            <p className="text-sm text-gray-500 mt-1">إدارة جميع إعدادات SmartCheckout</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {hasUnsavedChanges ? (
              <span className="flex items-center gap-1.5 text-orange-600 font-medium bg-orange-50 px-3 py-1.5 rounded-lg">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                </span>
                توجد تغييرات غير محفوظة
              </span>
            ) : isSaved ? (
              <span className="flex items-center gap-1.5 text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-lg">
                <Check size={16} /> تم الحفظ تلقائياً
              </span>
            ) : (
              <span className="text-gray-500">آخر حفظ: {lastSaved}</span>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 pb-32">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* 1. معلومات الشركة */}
            {activeTab === 'company' && (
              <>
                <SettingsCard title="شعار الشركة">
                  <div className="flex items-center gap-6">
                    <div className="w-28 h-28 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 hover:border-blue-400 transition-all">
                      <Upload size={28} className="mb-2 text-gray-400" />
                      <span className="text-sm font-medium">رفع الشعار</span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">معاينة الشعار</button>
                        <button className="px-4 py-2 text-red-600 bg-red-50 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">إزالة</button>
                      </div>
                      <p className="text-xs text-gray-500">الصيغ المدعومة: PNG, JPG (الأبعاد الموصى بها 200×200 بكسل)</p>
                      <p className="text-xs text-gray-400">آخر تحديث: 12 مايو 2026</p>
                    </div>
                  </div>
                </SettingsCard>

                <SettingsCard title="بيانات الشركة">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="اسم الشركة" defaultValue="سوبر ماركت الأمل" onChange={handleInputChange} />
                    <InputField label="اسم الفرع" defaultValue="الفرع الرئيسي" onChange={handleInputChange} />
                  </div>
                </SettingsCard>

                <SettingsCard title="معلومات التواصل">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="رقم الهاتف" defaultValue="+963 XX XXX XXXX" dir="ltr" onChange={handleInputChange} />
                    <InputField label="البريد الإلكتروني" defaultValue="info@company.com" dir="ltr" onChange={handleInputChange} />
                  </div>
                </SettingsCard>

                <SettingsCard title="البيانات الضريبية">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="الرقم الضريبي" defaultValue="123456789" onChange={handleInputChange} tooltip="الرقم الذي سيظهر مطبوعاً على الفواتير الرسمية." />
                    <InputField label="السجل التجاري (اختياري)" onChange={handleInputChange} />
                  </div>
                </SettingsCard>

                <SettingsCard title="العنوان">
                  <InputField label="العنوان الكامل" defaultValue="دمشق، المزة، الشارع الرئيسي" onChange={handleInputChange} />
                </SettingsCard>
              </>
            )}

            {/* 2. إعدادات النظام */}
            {activeTab === 'system' && (
              <SettingsCard title="الإعدادات الأساسية">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="اسم النظام (للعرض الداخلي)" defaultValue="SmartCheckout POS" onChange={handleInputChange} />
                  <SelectField label="المنطقة الزمنية" options={['Asia/Damascus', 'Asia/Riyadh']} dir="ltr" onChange={handleInputChange} />
                  <SelectField label="تنسيق التاريخ" options={['DD/MM/YYYY', 'YYYY/MM/DD']} dir="ltr" onChange={handleInputChange} />
                  <SelectField label="بداية السنة المالية" options={['1 يناير', '1 أبريل', '1 يوليو']} onChange={handleInputChange} />
                </div>
              </SettingsCard>
            )}

            {/* 3. إعدادات الفواتير */}
            {activeTab === 'invoice' && (
              <>
                <SettingsCard title="ترقيم الفواتير">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InputField label="بادئة الفاتورة (Prefix)" defaultValue="INV-" dir="ltr" onChange={handleInputChange} />
                    <InputField label="عدد الخانات (Padding)" defaultValue="6" type="number" dir="ltr" onChange={handleInputChange} />
                    <InputField label="الرقم القادم (للمعاينة)" value="INV-000001" disabled dir="ltr" />
                  </div>
                </SettingsCard>

                <SettingsCard title="خيارات الطباعة">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-2">
                      <InputField label="عدد النسخ المطبوعة التلقائية" defaultValue="1" type="number" onChange={handleInputChange} />
                      <InputField label="رسالة أسفل الفاتورة (Footer)" defaultValue="شكراً لتسوقكم معنا!" onChange={handleInputChange} />
                    </div>
                    <CheckboxField label="إظهار شعار الشركة في الفاتورة" defaultChecked onChange={handleInputChange} />
                    <CheckboxField label="الطباعة التلقائية فور اكتمال الدفع" defaultChecked onChange={handleInputChange} />
                  </div>
                </SettingsCard>
              </>
            )}

            {/* 4. العملات والضرائب */}
            {activeTab === 'currency' && (
              <>
                <SettingsCard title="إعدادات العملة">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <SelectField label="العملة الافتراضية" options={['ليرة سورية (SYP)', 'دولار أمريكي (USD)']} onChange={handleInputChange} />
                    <InputField label="رمز العملة" defaultValue="ل.س" onChange={handleInputChange} />
                    <SelectField label="عدد المنازل العشرية" options={['0', '1', '2', '3']} onChange={handleInputChange} />
                    <SelectField label="موضع رمز العملة" options={['بعد الرقم (1500 ل.س)', 'قبل الرقم (ل.س 1500)']} onChange={handleInputChange} />
                  </div>
                </SettingsCard>

                <SettingsCard title="الضرائب">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                    <InputField label="نسبة الضريبة الافتراضية (%)" defaultValue="11" type="number" dir="ltr" onChange={handleInputChange} />
                    <SelectField label="طريقة احتساب الضريبة" options={['بعد الخصم (موصى به)', 'قبل الخصم']} onChange={handleInputChange} />
                  </div>
                  <CheckboxField label="تقريب الكسور العشرية إلى أقرب رقم صحيح" defaultChecked onChange={handleInputChange} />
                </SettingsCard>
              </>
            )}

            {/* 5. إعدادات المخزون */}
            {activeTab === 'inventory' && (
              <SettingsCard title="حركة المخزون والتنبيهات">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <InputField label="الحد الأدنى الافتراضي للتنبيه" defaultValue="10" type="number" dir="ltr" onChange={handleInputChange} />
                </div>
                <div className="space-y-4">
                  <CheckboxField label="استخدام أجهزة الباركود في واجهة الكاشير" defaultChecked onChange={handleInputChange} />
                  <CheckboxField label="تحديث كمية المخزون تلقائياً بعد البيع/الاسترجاع" defaultChecked onChange={handleInputChange} />
                  <CheckboxField label="تفعيل تنبيهات انخفاض المخزون (تظهر للكاشير والإدارة)" defaultChecked onChange={handleInputChange} />
                  <CheckboxField label="السماح ببيع المنتجات (المخزون السالب) عند النفاذ" onChange={handleInputChange} tooltip="في حال التفعيل، يمكن للكاشير بيع منتج رصيده 0 وسينزل الرصيد بالسالب." />
                </div>
              </SettingsCard>
            )}

            {/* 6. اللغة */}
            {activeTab === 'language' && (
              <SettingsCard title="إعدادات الواجهة واللغة">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <SelectField label="لغة النظام الافتراضية" options={['العربية (Arabic)', 'English']} onChange={handleInputChange} />
                  <SelectField label="اتجاه الواجهة الافتراضي (Direction)" options={['RTL (يمين إلى يسار)', 'LTR (يسار إلى يمين)']} dir="ltr" onChange={handleInputChange} />
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
            إلغاء التعديلات
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
                جاري الحفظ...
              </>
            ) : isSaved ? (
              <>
                <Check size={18} />
                تم الحفظ بنجاح
              </>
            ) : (
              <>
                <Save size={18} />
                حفظ التغييرات
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

/* ---------------- المكونات الفرعية (Component Architecture) ---------------- */

function SettingsCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-50">{title}</h3>
      {children}
    </div>
  );
}

function InputField({ label, tooltip, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string, tooltip?: string }) {
  return (
    <div className="flex flex-col gap-2 relative group">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        {label}
        {tooltip && (
          <div className="relative flex items-center">
            <Info size={14} className="text-gray-400 hover:text-blue-500 cursor-help transition-colors" />
            <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center">
              {tooltip}
              <div className="absolute top-full right-1/2 translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
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