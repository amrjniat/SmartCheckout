import axiosInstance from './axiosInstance';
import { startSignalRConnection } from './signalRService';

export const login = async (username: string, password: string) => {
  const response = await axiosInstance.post('/Auth/login', {
        username,
        password
    });
    
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        startSignalRConnection();
    }
    
    return response.data;
};

export const register = async (registerData: any) => {
    try {
        // تأكد من أن مسار الـ API يطابق المسار لديك في الـ Backend (غالباً api/Auth/register)
       const response = await axiosInstance.post('/Auth/register', registerData);
        return response.data;
    } catch (error) {
        throw error;
    }
};