import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../services/axiosInstance';

// شكل المنتج كما يُرجعه الباك إند فعلياً (GET /api/Products مع include للمخزون)
interface BackendProduct {
  id: number;
  productName: string;
  productCode: string;
  barcode?: string;
  productWarehouses?: { id: number; warehouseId: number; quantity: number }[];
}

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // يُستدعى بعد نجاح التعبئة لتحديث لوحة المستودع
  warehouseId?: number; // افتراضياً المستودع الرئيسي (1)
}

const RestockModal: React.FC<RestockModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  warehouseId = 1,
}) => {
  const [allProducts, setAllProducts] = useState<BackendProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<BackendProduct | null>(null);
  const [quantity, setQuantity] = useState<string>('');

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // إعادة تهيئة كل شيء عند فتح النافذة من جديد
  useEffect(() => {
    if (!isOpen) return;
    setSearchQuery('');
    setSelectedProduct(null);
    setQuantity('');
    setErrorMessage(null);
    setSuccessMessage(null);

    setIsLoadingProducts(true);
    axiosInstance
      .get<BackendProduct[]>('/Products')
      .then((res) => setAllProducts(res.data))
      .catch((err) => {
        console.error('فشل جلب قائمة المنتجات:', err);
        setErrorMessage('تعذر تحميل قائمة المنتجات.');
      })
      .finally(() => setIsLoadingProducts(false));
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return allProducts
      .filter(
        (p) =>
          p.productName?.toLowerCase().includes(q) ||
          p.productCode?.toLowerCase().includes(q) ||
          p.barcode?.toLowerCase().includes(q)
      )
      .slice(0, 8); // نكتفي بأول 8 نتائج لتفادي قائمة طويلة
  }, [searchQuery, allProducts]);

  const currentStock = (product: BackendProduct) =>
    product.productWarehouses
      ?.filter((w) => w.warehouseId === warehouseId)
      .reduce((sum, w) => sum + (w.quantity || 0), 0) ?? 0;

  if (!isOpen) return null;

  const handleSelectProduct = (product: BackendProduct) => {
    setSelectedProduct(product);
    setSearchQuery(product.productName);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!selectedProduct) {
      setErrorMessage('يرجى اختيار منتج أولاً من نتائج البحث.');
      return;
    }
    const qtyNumber = Number(quantity);
    if (!qtyNumber || qtyNumber <= 0) {
      setErrorMessage('يرجى إدخال كمية صحيحة أكبر من صفر.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await axiosInstance.post(`/Products/${selectedProduct.id}/restock`, {
        quantity: qtyNumber,
        warehouseId,
      });

      setSuccessMessage(
        `✅ تم استلام ${qtyNumber} قطعة من "${selectedProduct.productName}". الرصيد الجديد: ${response.data.newQuantity}.`
      );

      // تفريغ الحقول للسماح باستلام منتج آخر دون إغلاق النافذة
      setSelectedProduct(null);
      setSearchQuery('');
      setQuantity('');

      onSuccess();
    } catch (err: any) {
      const backendMessage =
        err?.response?.data?.details || err?.response?.data?.message || 'حدث خطأ غير متوقع أثناء التحديث.';
      setErrorMessage(backendMessage);
      console.error('فشل استلام البضاعة:', err?.response?.data || err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">📦 استلام بضاعة</h2>
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
        {successMessage && (
          <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* البحث عن المنتج */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-600 mb-1">ابحث عن المنتج *</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedProduct(null);
              }}
              placeholder="اكتب الاسم أو الكود أو الباركود..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
              autoComplete="off"
            />

            {/* نتائج البحث */}
            {searchQuery && !selectedProduct && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {isLoadingProducts ? (
                  <div className="px-3 py-2 text-xs text-slate-400">جاري التحميل...</div>
                ) : filteredProducts.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-slate-400">لا توجد نتائج مطابقة.</div>
                ) : (
                  filteredProducts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectProduct(p)}
                      className="w-full text-right px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-0"
                    >
                      <span className="font-semibold text-slate-700">{p.productName}</span>
                      <span className="text-slate-400">الرصيد الحالي: {currentStock(p)}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* المنتج المختار */}
          {selectedProduct && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">{selectedProduct.productName}</p>
                <p className="text-[10px] text-slate-500">كود: {selectedProduct.productCode}</p>
              </div>
              <p className="text-xs text-slate-600">
                الرصيد الحالي: <span className="font-bold">{currentStock(selectedProduct)}</span>
              </p>
            </div>
          )}

          {/* الكمية المستلمة */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">الكمية المستلمة *</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="مثال: 50"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50"
              disabled={!selectedProduct}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              إغلاق
            </button>
            <button
              type="submit"
              disabled={isSaving || !selectedProduct}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSaving ? 'جاري الحفظ...' : 'تأكيد الاستلام'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestockModal;