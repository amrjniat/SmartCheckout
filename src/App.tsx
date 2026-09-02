import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/profile page';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import WarehouseDashboard from './pages/WarehouseDashboard';
import CashierDashboard from './pages/CashierDashboard';
import DashboardLayout from './layouts/DashboardLayout';
import WarehouseLayout from './layouts/WarehouseLayout';
import CashierLayout from './layouts/casherlayout';
import { startSignalRConnection } from './services/signalRService'; // بدون تغيير
import ClientsPage from './pages/ClientsPage';

// استيراد صفحة البيع السريع
import QuickSalePage from './pages/QuickSaleScreen';

// استيراد صفحة الفواتير والمبيعات
import InvoicesPage from './pages/Invoices Page';

// استيراد صفحة إدارة المواد والمنتجات 
import ProductsManagementPage from './pages/Materials';

// استيراد صفحة إدارة المخزون الجديدة
import InventoryManagement from './pages/InventoryManagement';

// استيراد صفحة إدارة الموردين
import SuppliersPage from './pages/Suppliers';

// استيراد صفحة تقارير وتحليلات المخزون
import InventoryReports from './pages/WarehouseReports';
// استيراد صفحة إدارة الفريق والموظفين
import EmployeeManagement from './pages/Teammanagement';

// استيراد صفحة الإعدادات العامة
import GeneralSettings from './pages/GeneralSettings';

// استيراد صفحة الإشعارات
import NotificationsPage from './pages/Notifications';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast'; 
import sessionService from './services/sessionService';
import { ROUTES } from './constants/routes';
function App() {
  useEffect(() => {
    const token = sessionService.getToken();
    if (token) {
      startSignalRConnection();
    }
  }, []);
  return (
    <BrowserRouter basename="/SmartCheckout">
       <Toaster
         position="top-center"
         toastOptions={{
           duration: 4000,
           style: {
             borderRadius: '14px',
             background: '#0f172a',
             color: '#fff',
             fontSize: '14px',
             fontWeight: 600,
             boxShadow: '0 10px 25px rgba(15, 23, 42, 0.18)',
           },
           success: {
             style: {
               background: '#10b981',
             },
           },
           error: {
             style: {
               background: '#ef4444',
             },
           },
         }}
       />
      <Routes>
        {/* الصفحات الخارجية المستقلة */}
        <Route path="/" element={<LandingPage />} />
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.signup} element={<SignUp />} />

        {/* --- نظام الإدارة العام (محمي: Admin فقط) --- */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.dashboard} element={<Dashboard />} />
            <Route path={ROUTES.invoices} element={<InvoicesPage />} />
            <Route path={ROUTES.products} element={<ProductsManagementPage />} />
            <Route path={ROUTES.inventory} element={<InventoryManagement />} />
            <Route path={ROUTES.suppliers} element={<SuppliersPage />} />
            <Route path={ROUTES.reports} element={<InventoryReports />} />
            <Route path={ROUTES.pos} element={<QuickSalePage />} />
            <Route path="/dashboard/cashier" element={<CashierDashboard />} />
            <Route path={ROUTES.clients} element={<ClientsPage />} />
            <Route path={ROUTES.team} element={<EmployeeManagement />} />
            <Route path={ROUTES.settings} element={<GeneralSettings />} />
            <Route path={ROUTES.notifications} element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* --- نظام الكاشير المستقل (محمي: Cashier فقط) --- */}
        <Route element={<ProtectedRoute allowedRoles={['Cashier']} />}>
          <Route element={<CashierLayout />}>
            <Route path={ROUTES.cashier} element={<CashierDashboard />} />
            <Route path={ROUTES.cashierPos} element={<QuickSalePage />} />
            <Route path={ROUTES.cashierInvoices} element={<InvoicesPage />} />
            <Route path={ROUTES.cashierClients} element={<ClientsPage />} />
            <Route path={ROUTES.cashierNotifications} element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* --- نظام المستودع المستقل (محمي: Warehouse فقط) --- */}
        <Route element={<ProtectedRoute allowedRoles={['Warehouse']} />}>
          <Route element={<WarehouseLayout />}>
            <Route path={ROUTES.warehouse} element={<WarehouseDashboard />} />
            <Route path={ROUTES.warehouseProducts} element={<ProductsManagementPage />} />
            <Route path={ROUTES.warehouseInventory} element={<InventoryManagement />} />
            <Route path={ROUTES.warehouseSuppliers} element={<SuppliersPage />} />
            <Route path={ROUTES.warehouseReports} element={<InventoryReports />} />
            <Route path={ROUTES.warehouseInvoices} element={<InvoicesPage />} />
            <Route path={ROUTES.warehouseNotifications} element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* توجيه المسارات غير المعروفة إلى الصفحة الرئيسية */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;