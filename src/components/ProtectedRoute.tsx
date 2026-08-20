import { Navigate, Outlet } from 'react-router-dom';
import sessionService from '../services/sessionService';
import { getValidDecodedToken } from '../services/tokenUtils';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = sessionService.getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decoded = getValidDecodedToken(token);

  if (!decoded) {
    sessionService.clear();
    return <Navigate to="/login" replace />;
  }

  const roleClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  const role = typeof roleClaim === 'string' ? roleClaim : null;

  if (!role || !allowedRoles.includes(role)) {
    if (role === 'Cashier') return <Navigate to="/cashier" replace />;
    if (role === 'Warehouse') return <Navigate to="/warehouse" replace />;
    if (role === 'Admin') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;