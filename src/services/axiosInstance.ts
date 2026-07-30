import axios from 'axios';

// ============================================
// Axios Instance مركزي لكل طلبات المشروع
// ============================================

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5157/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// Request Interceptor
// يضيف الـ Authorization Header تلقائياً لكل طلب
// ============================================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

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

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;