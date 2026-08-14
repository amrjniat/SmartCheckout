import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  BranchId?: string;
  FullName?: string;
  [key: string]: any; // باقي الـ Claims (نوعها URI طويل زي ClaimTypes.Role)
}

export const getBranchIdFromToken = (): number | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded.BranchId) return null;
    return parseInt(decoded.BranchId, 10);
  } catch (err) {
    console.error('فشل فك التوكن:', err);
    return null;
  }
};