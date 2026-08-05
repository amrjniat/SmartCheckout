import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

// ==========================================
// الأنواع (Types) - مطابقة تماماً لـ ProductDto في الباك إند
// ==========================================
interface UnitOption {
  id: number;
  unitName: string;
}

interface CategoryOption {
  id: number;
  categoryName: string;
}

interface SupplierOption {
  id: number;
  supplierName: string;
}

// هذا الـ Interface يطابق ProductDto.cs حرفياً - لا تضيفوا/تحذفوا حقولاً بدون تعديل الباك إند بالتوازي
export interface ProductFormData {
  productName: string;
  productCode: string;
  barcode: string;
  purchasePrice: number;
  sellingPrice: number;
  taxRate: number;
  minStock: number;
  description: string;
  categoryId: number;
  unitId: number;
  supplierId: number;
  initialQuantity: number;
}

interface AddProductModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  productId?: number; // مطلوب فقط في وضع edit
  initialData?: Partial<ProductFormData>;
  onClose: () => void;
  onSuccess: (savedProduct: any) => void; // يُستدعى بعد نجاح الحفظ لتحديث القائمة في الصفحة الأب
}

const emptyForm: ProductFormData = {
  productName: '',
  productCode: '',
  barcode: '',
  purchasePrice: 0,
  sellingPrice: 0,
  taxRate: 0,
  minStock: 0,
  description: '',
  categoryId: 0,
  unitId: 0,
  supplierId: 0,
  initialQuantity: 0,
};

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  mode,
  productId,
  initialData,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ==========================================
  // جلب قوائم الوحدات / التصنيفات / الموردين عند فتح النافذة
  // ==========================================
  useEffect(() => {
    if (!isOpen) return;

    setErrorMessage(null);

    Promise.all([
      axiosInstance.get<UnitOption[]>('/Units'),
      axiosInstance.get<CategoryOption[]>('/Categories'),
      axiosInstance.get<SupplierOption[]>('/Suppliers'),
    ])
      .then(([unitsRes, categoriesRes, suppliersRes]) => {
        setUnits(unitsRes.data);
        setCategories(categoriesRes.data);
        setSuppliers(suppliersRes.data);
      })
      .catch((err) => {
        console.error('فشل جلب قوائم الوحدات/التصنيفات/الموردين:', err);
        setErrorMessage('تعذر تحميل قوائم الوحدة/التصنيف/المورد. تحققوا من أن الباك إند يعمل.');
      });
  }, [isOpen]);

  // تهيئة الفورم عند فتح النافذة (فارغ في وضع add، أو مملوء في وضع edit)
  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && initialData) {
      setFormData({ ...emptyForm, ...initialData });
    } else {
      setFormData(emptyForm);
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // تحقق أساسي قبل الإرسال - يمنع تكرار مشكلة الـ FK بإرسال 0
    if (!formData.unitId) {
      setErrorMessage('يرجى اختيار الوحدة.');
      return;
    }
    if (!formData.categoryId) {
      setErrorMessage('يرجى اختيار التصنيف.');
      return;
    }
    if (!formData.supplierId) {
      setErrorMessage('يرجى اختيار المورد.');
      return;
    }

    setIsSaving(true);
    try {
      const response =
        mode === 'add'
          ? await axiosInstance.post('/Products', formData)
          : await axiosInstance.put(`/Products/${productId}`, formData);

      // نُرفق أسماء التصنيف/الوحدة/المورد المختارة مع رد الباك إند الخام
      // حتى تستطيع الصفحة الأب (Materials.tsx مثلاً) عرضها في الجدول المحلي دون طلب إضافي
      const selectedCategory = categories.find((c) => c.id === formData.categoryId);
      const selectedUnit = units.find((u) => u.id === formData.unitId);
      const selectedSupplier = suppliers.find((s) => s.id === formData.supplierId);

      onSuccess({
        ...response.data,
        categoryName: selectedCategory?.categoryName,
        unitName: selectedUnit?.unitName,
        supplierName: selectedSupplier?.supplierName,
        // response.data هو كيان Product الخام من الباك إند ولا يحتوي على initialQuantity
        // (لأنها لم تُخزَّن على جدول Products نفسه، بل استُخدمت لإنشاء صف ProductWarehouse)
        // لذا نُرفقها هنا يدوياً من قيمة الفورم التي أرسلناها فعلياً
        initialQuantity: formData.initialQuantity,
      });
      onClose();
    } catch (err: any) {
      // نعرض تفاصيل الخطأ القادمة من الباك إند مباشرة (حقل details الذي بنيناه سابقاً)
      const backendMessage =
        err?.response?.data?.details || err?.response?.data?.message || 'حدث خطأ غير متوقع أثناء الحفظ.';
      setErrorMessage(backendMessage);
      console.error('فشل حفظ المنتج:', err?.response?.data || err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">
            {mode === 'add' ? '➕ إضافة منتج جديد' : '✏️ تعديل بيانات المنتج'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg leading-none"
            type="button"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* اسم المنتج */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">اسم المنتج *</label>
            <input
              type="text"
              required
              value={formData.productName}
              onChange={(e) => handleChange('productName', e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
              placeholder="مثال: مياه غازية منعشة 330 مل"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* كود المنتج */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">كود المنتج *</label>
              <input
                type="text"
                required
                value={formData.productCode}
                onChange={(e) => handleChange('productCode', e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50"
              />
            </div>

            {/* الباركود */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">الباركود</label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => handleChange('barcode', e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* التصنيف - dropdown حقيقي مرتبط بمعرّف رقمي */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">التصنيف *</label>
              <select
                required
                value={formData.categoryId || ''}
                onChange={(e) => handleChange('categoryId', Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
              >
                <option value="">اختر التصنيف</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* الوحدة - dropdown حقيقي مرتبط بمعرّف رقمي */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">الوحدة *</label>
              <select
                required
                value={formData.unitId || ''}
                onChange={(e) => handleChange('unitId', Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
              >
                <option value="">اختر الوحدة</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.unitName}
                  </option>
                ))}
              </select>
            </div>

            {/* المورد - dropdown حقيقي مرتبط بمعرّف رقمي */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">المورد *</label>
              <select
                required
                value={formData.supplierId || ''}
                onChange={(e) => handleChange('supplierId', Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
              >
                <option value="">اختر المورد</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.supplierName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* سعر الشراء */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">سعر الشراء *</label>
              <input
                type="number"
                required
                min={0}
                value={formData.purchasePrice}
                onChange={(e) => handleChange('purchasePrice', Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50"
              />
            </div>

            {/* سعر البيع */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">سعر البيع *</label>
              <input
                type="number"
                required
                min={0}
                value={formData.sellingPrice}
                onChange={(e) => handleChange('sellingPrice', Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* نسبة الضريبة */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">نسبة الضريبة (%)</label>
              <input
                type="number"
                min={0}
                value={formData.taxRate}
                onChange={(e) => handleChange('taxRate', Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50"
              />
            </div>

            {/* الحد الأدنى للمخزون */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">الحد الأدنى للمخزون</label>
              <input
                type="number"
                min={0}
                value={formData.minStock}
                onChange={(e) => handleChange('minStock', Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50"
              />
            </div>
          </div>

          {/* الكمية الافتتاحية - تُنشئ صف مخزون تلقائياً في المستودع الرئيسي عند الحفظ */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              الكمية الافتتاحية {mode === 'add' && '(المستودع الرئيسي)'}
            </label>
            <input
              type="number"
              min={0}
              value={formData.initialQuantity}
              onChange={(e) => handleChange('initialQuantity', Number(e.target.value))}
              disabled={mode === 'edit'}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-50"
              placeholder="0"
            />
            {mode === 'edit' && (
              <p className="text-[10px] text-slate-400 mt-1">
                تعديل الكمية يتم من صفحة إدارة المخزون، وليس من هنا.
              </p>
            )}
          </div>

          {/* الوصف */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">الوصف</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50"
              placeholder="اكتب تفاصيل إضافية لمساعدة أمناء المستودعات والكاشيرية..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'جاري الحفظ...' : mode === 'add' ? 'إضافة المنتج' : 'حفظ التعديلات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;