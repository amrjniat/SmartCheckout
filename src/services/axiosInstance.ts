



import axios from 'axios';

// ============================================
// Axios Instance مركزي لكل طلبات المشروع
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5157/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// Request Interceptor
// يضيف الـ Authorization Header تلقائياً لكل طلب
// ✅ تصحيح: الرجوع لـ sessionStorage (بدل localStorage) ليطابق authService.ts
// ============================================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// Response Interceptor
// يعالج انتهاء صلاحية التوكن (401) بشكل مركزي
// ============================================
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const requestUrl = (error.config?.url || '').toLowerCase();
    const isLoginRequest = requestUrl.includes('/auth/login');

    if (status === 401 && !isLoginRequest) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');

      // ✅ تصحيح: نتحقق من "احتواء" المسار بدل المطابقة الكاملة
      // بسبب وجود basename="/SmartCheckout" بالـ BrowserRouter
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/SmartCheckout/login';
      }
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;