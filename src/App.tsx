// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import LandingPage from './pages/profile page' 
// import Login from './pages/Login'
// import SignUp from './pages/SignUp'
// import Dashboard from './pages/Dashboard'
// import WarehouseDashboard from './pages/WarehouseDashboard' 
// import CashierDashboard from './pages/CashierDashboard' 
// import DashboardLayout from './layouts/DashboardLayout'

// // 1. استيراد صفحة البيع السريع الجديدة (التي سننشئها في الخطوة التالية)
// import QuickSalePage from './pages/Quick Sale Screen';

// function App() {
//   return (
//     <BrowserRouter basename="/SmartCheckout">
//       <Routes>
//         {/* الصفحة الرئيسية للموقع (Landing Page) */}
//         <Route path="/" element={<LandingPage />} /> 

//         {/* صفحة المستودع */}
//         <Route path="/warehouse" element={<WarehouseDashboard />} /> 

//         {/* صفحة الكاشير */}
//         <Route path="/cashier" element={<CashierDashboard />} /> 

//         {/* 2. إضافة المسار الجديد لشاشة البيع السريع (POS) */}
//         <Route path="/pos" element={<QuickSalePage />} />

//         {/* صفحات المصادقة */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />

//         {/* الـ Layout مخصص فقط لصفحات الإدارة التي تحتاجه */}
//         <Route element={<DashboardLayout />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Route>
// <Route path="/Dashboard" element={<LandingPage />} />
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App





import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/profile page'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import WarehouseDashboard from './pages/WarehouseDashboard'
import CashierDashboard from './pages/CashierDashboard'
import DashboardLayout from './layouts/DashboardLayout'

// استيراد صفحة البيع السريع
import QuickSalePage from './pages/Quick Sale Screen'

// استيراد صفحة الفواتير والمبيعات
import InvoicesPage from './pages/Invoices Page'

// 1. استيراد صفحة إدارة المواد والمنتجات الجديدة
import ProductsManagementPage from './pages/Materials' 

function App() {
  return (
    <BrowserRouter basename="/SmartCheckout">
      <Routes>
        {/* الصفحة الرئيسية للموقع (Landing Page) */}
        <Route path="/" element={<LandingPage />} />

        {/* صفحة المستودع */}
        <Route path="/warehouse" element={<WarehouseDashboard />} />

        {/* صفحة الكاشير */}
        <Route path="/cashier" element={<CashierDashboard />} />

        {/* شاشة البيع السريع (POS) */}
        <Route path="/pos" element={<QuickSalePage />} />

        {/* صفحات المصادقة */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* الـ Layout مخصص فقط لصفحات الإدارة التي تحتاجه */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* صفحة الفواتير والمبيعات - داخل نفس الـ Layout */}
          <Route path="/invoices" element={<InvoicesPage />} />
          
          {/* 2. تسجيل مسار صفحة إدارة المنتجات الجديدة هنا لتظهر داخل الهيدر والـ Layout */}
          <Route path="/products" element={<ProductsManagementPage />} />
        </Route>

        {/* أي مسار غير معروف يُعاد توجيهه للصفحة الرئيسية بدل صفحة بيضاء فارغة */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App