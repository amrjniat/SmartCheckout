import axios from 'axios';

// رابط الـ Backend الخاص بالـ API
const API_URL = 'http://localhost:5157/api/Products';

// دالة جلب جميع المنتجات مع كميات المستودعات
export const getProducts = async () => {
  const token = localStorage.getItem('token'); 
  
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data;
};