// import axios from 'axios';

// // ============================================
// // Axios Instance مركزي لكل طلبات المشروع
// // ============================================

// // ✅ تعديل: الرابط أصبح يُقرأ من متغيرات البيئة بدل التثبيت المباشر (Hardcoded)
// // أضف في ملف .env على جذر المشروع:
// //   VITE_API_URL=http://localhost:5157/api
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5157/api';

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // ============================================
// // Request Interceptor
// // يضيف الـ Authorization Header تلقائياً لكل طلب
// // ============================================
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem('token');

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // ============================================
// // Response Interceptor
// // يعالج انتهاء صلاحية التوكن (401) بشكل مركزي
// // ============================================
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     const status = error.response?.status;

//     if (status === 401) {
//       sessionStorage.removeItem('token');
//       sessionStorage.removeItem('user');

//       if (window.location.pathname !== '/login') {
//         window.location.href = '/login';
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;







// import axios from 'axios';

// // ============================================
// // Axios Instance مركزي لكل طلبات المشروع
// // ============================================

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5157/api';

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // ============================================
// // Request Interceptor
// // يضيف الـ Authorization Header تلقائياً لكل طلب
// // ✅ تعديل: توحيد المصدر مع signalRService.ts على localStorage
// // ============================================
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token'); // ✅ كان sessionStorage

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // ============================================
// // Response Interceptor
// // يعالج انتهاء صلاحية التوكن (401) بشكل مركزي
// // ============================================
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     const status = error.response?.status;

//     if (status === 401) {
//       localStorage.removeItem('token'); // ✅ كان sessionStorage
//       localStorage.removeItem('user');  // ✅ كان sessionStorage

//       if (window.location.pathname !== '/login') {
//         window.location.href = '/login';
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;












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

    if (status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;