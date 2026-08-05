export interface InventoryTransaction {
  id: string;
  item: string;
  qty: number;
  type: 'in' | 'out';
}

export const getTransactions = async (): Promise<InventoryTransaction[]> => {
  // 💡 قمنا بتعطيل طلب الـ API المؤدي لـ 404 مؤقتاً
  // const response = await axiosInstance.get('/api/Transactions');
  // return response.data;

  return []; // إرجاع مصفوفة فارغة لكي تعمل صفحة المستودع بدون أخطاء
};