import axios from 'axios';
import { stopSignalRConnection } from './signalRService';
import sessionService from './sessionService';
import { getValidDecodedToken } from './tokenUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5157/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionService.getToken();

    if (token && getValidDecodedToken(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const requestUrl = (error.config?.url || '').toLowerCase();
    const isLoginRequest = requestUrl.includes('/auth/login');

    if (status === 401 && !isLoginRequest) {
      try {
        await stopSignalRConnection();
      } catch (signalRStopError) {
        console.warn('⚠️ تعذر إيقاف اتصال SignalR بعد 401:', signalRStopError);
      }

      sessionService.clear();

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/SmartCheckout/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;