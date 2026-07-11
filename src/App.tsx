import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/profile page' // استيراد صفحة الهبوط التي غيرت اسمها
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import WarehouseDashboard from './pages/WarehouseDashboard' 
import CashierDashboard from './pages/CashierDashboard' 
import DashboardLayout from './layouts/DashboardLayout'

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
        
        {/* صفحات المصادقة */}
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