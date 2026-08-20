


import axiosInstance from './axiosInstance';
import { startSignalRConnection, stopSignalRConnection } from './signalRService';
import sessionService from './sessionService';

export const logout = async (): Promise<void> => {
  try {
    await stopSignalRConnection();
  } finally {
    sessionService.clear();
  }
};

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
      sessionService.setToken(response.data.token);

      // حفظ بيانات المستخدم إذا كانت راجعة من الخادم (مفيدة لمعرفة Role في الصفحة)
      if (response.data.user) {
        sessionService.setUser(response.data.user);
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

export const register = async (registerData: unknown) => {
  try {
    const response = await axiosInstance.post('/Auth/register', registerData);
    return response.data;
  } catch (error) {
    console.error('❌ خطأ أثناء الاتصال بـ API التسجيل:', error);
    throw error;
  }
};