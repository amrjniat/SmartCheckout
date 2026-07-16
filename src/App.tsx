// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import LandingPage from './pages/profile page';
// import Login from './pages/Login';
// import SignUp from './pages/SignUp';
// import Dashboard from './pages/Dashboard';
// import WarehouseDashboard from './pages/WarehouseDashboard';
// import CashierDashboard from './pages/CashierDashboard';
// import DashboardLayout from './layouts/DashboardLayout';
// import WarehouseLayout from './layouts/WarehouseLayout'; 

// // استيراد صفحة البيع السريع
// import QuickSalePage from './pages/QuickSaleScreen';

// // استيراد صفحة الفواتير والمبيعات
// import InvoicesPage from './pages/Invoices Page';

// // استيراد صفحة إدارة المواد والمنتجات 
// import ProductsManagementPage from './pages/Materials';

// // استيراد صفحة إدارة المخزون الجديدة
// import InventoryManagement from './pages/InventoryManagement';

// function App() {
//   return (
//     <BrowserRouter basename="/SmartCheckout">
//       <Routes>
//         {/* الصفحات الخارجية المستقلة */}
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />

//         {/* --- نظام الإدارة العام --- */}
//         <Route element={<DashboardLayout />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/pos" element={<QuickSalePage />} />
//           <Route path="/cashier" element={<CashierDashboard />} />
//           <Route path="/invoices" element={<InvoicesPage />} />
//           <Route path="/products" element={<ProductsManagementPage />} />
          
//           {/* مسار إدارة المخزون متاح للمدير ضمن لوحة التحكم العامة */}
//           <Route path="/inventory" element={<InventoryManagement />} />
//         </Route>

//         {/* --- نظام المستودع المستقل (تم عزله هنا) --- */}
//         <Route element={<WarehouseLayout />}>
//           <Route path="/warehouse" element={<WarehouseDashboard />} />
          
//           {/* مسار إدارة المخزون متاح لأمين المستودع ضمن لوحة المستودع */}
//           <Route path="/warehouse/inventory" element={<InventoryManagement />} />
//         </Route>

//         {/* توجيه المسارات غير المعروفة إلى الصفحة الرئيسية */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;











import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/profile page';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import WarehouseDashboard from './pages/WarehouseDashboard';
import CashierDashboard from './pages/CashierDashboard';
import DashboardLayout from './layouts/DashboardLayout';

import WarehouseLayout from './layouts/WarehouseLayout';

// استيراد صفحة البيع السريع
import QuickSalePage from './pages/QuickSaleScreen';

// استيراد صفحة الفواتير والمبيعات
import InvoicesPage from './pages/Invoices Page';

// استيراد صفحة إدارة المواد والمنتجات 
import ProductsManagementPage from './pages/Materials';

// استيراد صفحة إدارة المخزون الجديدة
import InventoryManagement from './pages/InventoryManagement';

function App() {
  return (
    <BrowserRouter basename="/SmartCheckout">
      <Routes>
        {/* الصفحات الخارجية المستقلة */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* --- نظام الإدارة العام --- */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pos" element={<QuickSalePage />} />
          <Route path="/cashier" element={<CashierDashboard />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/products" element={<ProductsManagementPage />} />

          {/* مسار إدارة المخزون متاح للمدير ضمن لوحة التحكم العامة */}
          <Route path="/inventory" element={<InventoryManagement />} />
        </Route>

        {/* --- نظام المستودع المستقل (هيدر مختلف تماماً عن نظام الإدارة العام) --- */}
        <Route element={<WarehouseLayout />}>
          <Route path="/warehouse" element={<WarehouseDashboard />} />

          {/* نفس صفحة المواد والمنتجات، بس بهيدر المستودع (لأمين المستودع) */}
          <Route path="/warehouse/products" element={<ProductsManagementPage />} />

          {/* مسار إدارة المخزون متاح لأمين المستودع ضمن لوحة المستودع */}
          <Route path="/warehouse/inventory" element={<InventoryManagement />} />
        </Route>

        {/* توجيه المسارات غير المعروفة إلى الصفحة الرئيسية */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;