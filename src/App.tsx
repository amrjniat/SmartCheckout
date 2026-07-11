// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Login from './pages/Login'
// import SignUp from './pages/SignUp'
// import Dashboard from './pages/Dashboard'
// import WarehouseDashboard from './pages/WarehouseDashboard' 
// import CashierDashboard from './pages/CashierDashboard' // 1. استيراد صفحة الكاشير الجديدة[cite: 3]
// import DashboardLayout from './layouts/DashboardLayout'

// function App() {
//   return (
//     <BrowserRouter basename="/SmartCheckout">
//       <Routes>
        
//         {/* تم التبديل: جعل الداشبورد (الذي قمنا بتعديله) هو الصفحة الرئيسية لتسهيل الاختبار */}
//         <Route element={<DashboardLayout />}>
//         <Route path="/" element={<Dashboard />} />
//         </Route>
        
//         {/* صفحة المستودع تم نقلها لمسار فرعي */}
//         <Route path="/warehouse" element={<WarehouseDashboard />} /> 
        
//         {/* 2. إضافة مسار الكاشير كمسار مستقل ومباشر[cite: 3] */}
//         <Route path="/cashier" element={<CashierDashboard />} /> 
        
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
        
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App




import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import WarehouseDashboard from './pages/WarehouseDashboard' 
import CashierDashboard from './pages/CashierDashboard' // 1. استيراد صفحة الكاشير الجديدة
import DashboardLayout from './layouts/DashboardLayout'

function App() {
  return (
    <BrowserRouter basename="/SmartCheckout">
      <Routes>
        
        {/* صفحة المستودع كمسار رئيسي مستقل */}
        <Route path="/" element={<WarehouseDashboard />} /> 
        
        {/* 2. إضافة مسار الكاشير كمسار مستقل ومباشر */}
        <Route path="/cashier" element={<CashierDashboard />} /> 
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* الـ Layout مخصص فقط لصفحات الإدارة التي تحتاجه */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App