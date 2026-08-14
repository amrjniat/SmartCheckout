// import axiosInstance from './axiosInstance';
// import { startSignalRConnection } from './signalRService';

// export const login = async (username: string, password: string) => {
//   const response = await axiosInstance.post('/Auth/login', {
//         username,
//         password
//     });
    
//     if (response.data.token) {
//         sessionStorage.setItem('token', response.data.token); // ⬅️ تغيير: localStorage → sessionStorage
//         startSignalRConnection();
//     }
    
//     return response.data;
// };

// export const register = async (registerData: any) => {
//     try {
//         // تأكد من أن مسار الـ API يطابق المسار لديك في الـ Backend (غالباً api/Auth/register)
//        const response = await axiosInstance.post('/Auth/register', registerData);
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };


// import axiosInstance from './axiosInstance';
// import { startSignalRConnection } from './signalRService';

// export const login = async (username: string, password: string) => {
//   try {
//     const response = await axiosInstance.post('/Auth/login', {
//       username,
//       password,
//     });

//     // 1. التأكد من وجود التوكن وحفظه في localStorage
//     // ✅ تعديل: توحيد التخزين مع apiClient.ts و signalRService.ts
//     // كانا يستخدمان localStorage بينما هذا الملف وحده كان يستخدم sessionStorage
//     if (response.data?.token) {
//       localStorage.setItem('token', response.data.token); // كان sessionStorage

//       // حفظ بيانات المستخدم إذا كانت راجعة من الخادم (مفيدة لمعرفة Role في الصفحة)
//       if (response.data.user) {
//         localStorage.setItem('user', JSON.stringify(response.data.user)); // كان sessionStorage
//       }

//       // 2. تشغيل SignalR داخل try/catch منفصل تماماً (Safe Execution)
//       try {
//         await startSignalRConnection();
//       } catch (signalRAuthError) {
//         console.warn('⚠️ تعذر بدء اتصال SignalR، ولكنه لن يمنع عملية الدخول:', signalRAuthError);
//       }
//     }

//     return response.data;
//   } catch (error) {
//     console.error('❌ خطأ أثناء الاتصال بـ API تسجيل الدخول:', error);
//     throw error;
//   }
// };

// export const register = async (registerData: any) => {
//   try {
//     const response = await axiosInstance.post('/Auth/register', registerData);
//     return response.data;
//   } catch (error) {
//     console.error('❌ خطأ أثناء الاتصال بـ API التسجيل:', error);
//     throw error;
//   }
// };









import axiosInstance from './axiosInstance';
import { startSignalRConnection } from './signalRService';

export const login = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post('/Auth/login', {
      username,
      password,
    });

    // 1. التأكد من وجود التوكن وحفظه في sessionStorage
    // ✅ تصحيح: الرجوع لاستخدام sessionStorage (بدل localStorage) لعزل التبويبات حسب الدور
    // ملاحظة: axiosInstance.ts و signalRService.ts يجب تعديلهما بنفس الطريقة ليطابقا هذا الملف
    if (response.data?.token) {
      sessionStorage.setItem('token', response.data.token);

      // حفظ بيانات المستخدم إذا كانت راجعة من الخادم (مفيدة لمعرفة Role في الصفحة)
      if (response.data.user) {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
      }

      // 2. تشغيل SignalR داخل try/catch منفصل تماماً (Safe Execution)
      try {
        await startSignalRConnection();
      } catch (signalRAuthError) {
        console.warn('⚠️ تعذر بدء اتصال SignalR، ولكنه لن يمنع عملية الدخول:', signalRAuthError);
      }
    }

    return response.data;
  } catch (error) {
    console.error('❌ خطأ أثناء الاتصال بـ API تسجيل الدخول:', error);
    throw error;
  }
};

export const register = async (registerData: any) => {
  try {
    const response = await axiosInstance.post('/Auth/register', registerData);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ أثناء الاتصال بـ API التسجيل:', error);
    throw error;
  }
};