



// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import LandingPage from './pages/profile page';
// import Login from './pages/Login';
// import SignUp from './pages/SignUp';
// import Dashboard from './pages/Dashboard';
// import WarehouseDashboard from './pages/WarehouseDashboard';
// import CashierDashboard from './pages/CashierDashboard';
// import DashboardLayout from './layouts/DashboardLayout';
// import WarehouseLayout from './layouts/WarehouseLayout';
// import CashierLayout from './layouts/casherlayout';


// import ClientsPage from './pages/ClientsPage';

// // استيراد صفحة البيع السريع
// import QuickSalePage from './pages/QuickSaleScreen';

// // استيراد صفحة الفواتير والمبيعات
// import InvoicesPage from './pages/Invoices Page';

// // استيراد صفحة إدارة المواد والمنتجات 
// import ProductsManagementPage from './pages/Materials';

// // استيراد صفحة إدارة المخزون الجديدة
// import InventoryManagement from './pages/InventoryManagement';

// // استيراد صفحة إدارة الموردين
// import SuppliersPage from './pages/Suppliers';

// // استيراد صفحة تقارير وتحليلات المخزون
// import InventoryReports from './pages/WarehouseReports';
// // استيراد صفحة إدارة الفريق والموظفين
// import EmployeeManagement from './pages/Teammanagement';

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
//           <Route path="/invoices" element={<InvoicesPage />} />
//           <Route path="/products" element={<ProductsManagementPage />} />

//           {/* مسار إدارة المخزون متاح للمدير ضمن لوحة التحكم العامة */}
//           <Route path="/inventory" element={<InventoryManagement />} />

//           {/* مسار إدارة الموردين متاح للمدير ضمن لوحة التحكم العامة */}
//           <Route path="/suppliers" element={<SuppliersPage />} />

//           {/* مسار تقارير المخزون متاح للمدير ضمن لوحة التحكم العامة */}
//           <Route path="/reports" element={<InventoryReports />} />

//           {/* نفس لوحة الكاشير، بس بهيدر الإدارة العامة (يشوفها المدير من لوحته) */}
//           <Route path="/dashboard/cashier" element={<CashierDashboard />} />

//           <Route path="/clients" element={<ClientsPage />} />
//   <Route path="/team" element={<EmployeeManagement />} />

//         </Route>

//         {/* --- نظام الكاشير المستقل (هيدر مخصص للكاشير فقط) --- */}
//         <Route element={<CashierLayout />}>
//           <Route path="/cashier" element={<CashierDashboard />} />
//           <Route path="/pos" element={<QuickSalePage />} />

//           {/* نفس صفحة الفواتير، بس بهيدر الكاشير */}
//           <Route path="/cashier/invoices" element={<InvoicesPage />} />

//           <Route path="/cashier/clients" element={<ClientsPage />} />
          
//         </Route>

//         {/* --- نظام المستودع المستقل (هيدر مختلف تماماً عن نظام الإدارة العام) --- */}
//         <Route element={<WarehouseLayout />}>
//           <Route path="/warehouse" element={<WarehouseDashboard />} />

//           {/* نفس صفحة المواد والمنتجات، بس بهيدر المستودع (لأمين المستودع) */}
//           <Route path="/warehouse/products" element={<ProductsManagementPage />} />

//           {/* مسار إدارة المخزون متاح لأمين المستودع ضمن لوحة المستودع */}
//           <Route path="/warehouse/inventory" element={<InventoryManagement />} />

//           {/* نفس صفحة الموردين، بس بهيدر المستودع (لأمين المستودع) */}
//           <Route path="/warehouse/suppliers" element={<SuppliersPage />} />

//           {/* نفس صفحة تقارير المخزون، بس بهيدر المستودع (لأمين المستودع) */}
//           <Route path="/warehouse/reports" element={<InventoryReports />} />

//           {/* نفس صفحة الفواتير، بس بهيدر المستودع (لأمين المستودع) */}
//           <Route path="/warehouse/invoices" element={<InvoicesPage />} />
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
import CashierLayout from './layouts/casherlayout';


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
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/products" element={<ProductsManagementPage />} />

          {/* مسار إدارة المخزون متاح للمدير ضمن لوحة التحكم العامة */}
          <Route path="/inventory" element={<InventoryManagement />} />

          {/* مسار إدارة الموردين متاح للمدير ضمن لوحة التحكم العامة */}
          <Route path="/suppliers" element={<SuppliersPage />} />

          {/* مسار تقارير المخزون متاح للمدير ضمن لوحة التحكم العامة */}
          <Route path="/reports" element={<InventoryReports />} />

          {/* نفس لوحة الكاشير، بس بهيدر الإدارة العامة (يشوفها المدير من لوحته) */}
          <Route path="/dashboard/cashier" element={<CashierDashboard />} />

          <Route path="/clients" element={<ClientsPage />} />
  <Route path="/team" element={<EmployeeManagement />} />

          {/* مسار الإعدادات العامة، متاح للمدير فقط ضمن لوحة التحكم العامة */}
          <Route path="/settings" element={<GeneralSettings/>} />

        </Route>

        {/* --- نظام الكاشير المستقل (هيدر مخصص للكاشير فقط) --- */}
        <Route element={<CashierLayout />}>
          <Route path="/cashier" element={<CashierDashboard />} />
          <Route path="/pos" element={<QuickSalePage />} />

          {/* نفس صفحة الفواتير، بس بهيدر الكاشير */}
          <Route path="/cashier/invoices" element={<InvoicesPage />} />

          <Route path="/cashier/clients" element={<ClientsPage />} />
          
        </Route>

        {/* --- نظام المستودع المستقل (هيدر مختلف تماماً عن نظام الإدارة العام) --- */}
        <Route element={<WarehouseLayout />}>
          <Route path="/warehouse" element={<WarehouseDashboard />} />

          {/* نفس صفحة المواد والمنتجات، بس بهيدر المستودع (لأمين المستودع) */}
          <Route path="/warehouse/products" element={<ProductsManagementPage />} />

          {/* مسار إدارة المخزون متاح لأمين المستودع ضمن لوحة المستودع */}
          <Route path="/warehouse/inventory" element={<InventoryManagement />} />

          {/* نفس صفحة الموردين، بس بهيدر المستودع (لأمين المستودع) */}
          <Route path="/warehouse/suppliers" element={<SuppliersPage />} />

          {/* نفس صفحة تقارير المخزون، بس بهيدر المستودع (لأمين المستودع) */}
          <Route path="/warehouse/reports" element={<InventoryReports />} />

          {/* نفس صفحة الفواتير، بس بهيدر المستودع (لأمين المستودع) */}
          <Route path="/warehouse/invoices" element={<InvoicesPage />} />
        </Route>

        {/* توجيه المسارات غير المعروفة إلى الصفحة الرئيسية */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;