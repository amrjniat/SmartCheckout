import { Navigate, Outlet } from 'react-router-dom';

interface DecodedToken {
  exp: number;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  [key: string]: any;
}

function decodeToken(token: string): DecodedToken | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

interface ProtectedRouteProps {
  allowedRoles: string[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decoded = decodeToken(token);

  if (!decoded) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  const isExpired = decoded.exp * 1000 < Date.now();
  if (isExpired) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

  if (!allowedRoles.includes(role)) {
    if (role === 'Cashier') return <Navigate to="/cashier" replace />;
    if (role === 'Warehouse') return <Navigate to="/warehouse" replace />;
    if (role === 'Admin') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;