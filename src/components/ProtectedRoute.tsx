import { Navigate, Outlet } from 'react-router-dom';
import sessionService from '../services/sessionService';
import { getCurrentUserRole } from '../services/tokenUtils';
import { ROUTES } from '../constants/routes';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const role = getCurrentUserRole();

  if (!role) {
    if (sessionService.getToken()) {
      sessionService.clear();
    }
    return <Navigate to={ROUTES.login} replace />;
  }

  if (!allowedRoles.includes(role)) {
    if (role === 'Cashier') return <Navigate to={ROUTES.cashier} replace />;
    if (role === 'Warehouse') return <Navigate to={ROUTES.warehouse} replace />;
    if (role === 'Admin') return <Navigate to={ROUTES.dashboard} replace />;
    return <Navigate to={ROUTES.login} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;