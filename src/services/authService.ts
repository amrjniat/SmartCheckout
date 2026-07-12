
import axios from 'axios';

const API_URL = 'http://localhost:5157/api';

// لاحظ كلمة "export" في البداية
export const login = async (username: string, password: string) => {
    const response = await axios.post(`${API_URL}/Auth/login`, {
        username,
        password
    });
    
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
};
export const register = async (registerData: any) => {
    try {
        // تأكد من أن مسار الـ API يطابق المسار لديك في الـ Backend (غالباً api/Auth/register)
        const response = await axios.post('http://localhost:5157/api/Auth/register', registerData);
        return response.data;
    } catch (error) {
        throw error;
    }
};