import { Navigate, Outlet } from 'react-router-dom';
import sessionService from '../services/sessionService';
import { getCurrentUserRole } from '../services/tokenUtils';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const role = getCurrentUserRole();

  if (!role) {
    if (sessionService.getToken()) {
      sessionService.clear();
    }
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    if (role === 'Cashier') return <Navigate to="/cashier" replace />;
    if (role === 'Warehouse') return <Navigate to="/warehouse" replace />;
    if (role === 'Admin') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;