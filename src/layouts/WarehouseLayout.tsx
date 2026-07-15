import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header, { type MenuItem, type TimeFilter } from '../components/layout/Header';

export default function WarehouseLayout() {
  const [isRtl, setIsRtl] = useState(true);
  const [activeTimeFilter, setActiveTimeFilter] = useState<TimeFilter>('day');
  
  const location = useLocation();
  const navigate = useNavigate();

  // 1. تحديد قائمة الأزرار الخاصة بالمستودع بشكل مستقل تماماً
  const defaultMenuItems: MenuItem[] = [
      { id: 'dash', text: isRtl ? 'الصفحه الرئيسيه' : 'Home page', path: '/dashboard' },
      { id: 'products', text: isRtl ? 'إدارة المواد والمنتجات' : 'Products Management', path: '/products' },
      { id: 'inventory', text: isRtl ? 'المخزون والمستودعات' : 'Inventory & Warehouses', path: null },
      { id: 'team', text: isRtl ? 'إدارة الفريق والموظفين' : 'Team & Employees', path: null },
      { id: 'reports', text: isRtl ? ' التقارير والتحليلات البيانية للمخزون' : 'Reports & Analytics', path: null },
     ].map((item) => ({
    ...item,
    // تفعيل الزر برمجياً بناءً على المسار الحالي لتجنب أي مشاكل في إضاءة الزر
    active: item.path !== null && location.pathname === item.path,
  }));

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-slate-50 font-sans relative" dir={isRtl ? 'rtl' : 'ltr'}>
      <Header
        title={isRtl ? 'إدارة المستودعات' : 'Warehouse Management'}
        subtitle={isRtl ? 'النظام المتخصص بمراقبة وحركة المخزون' : 'Specialized Inventory System'}
        activeFilter={activeTimeFilter}
        onFilterChange={setActiveTimeFilter}
        isRtl={isRtl}
        onToggleRtl={() => setIsRtl(!isRtl)}
        // 2. تخصيص بيانات المسؤول لهذا القسم
        userName="عمرو جنيات"
        userTitle="إدارة المستودع"
        avatarChar="ع"
        // 3. تمرير القائمة المستقلة هنا
        menuItems={defaultMenuItems}
        onNavigate={(path) => {
          if (path) navigate(path);
        }}
        showFilters={true}
        showNotifications={true}
        showUserCard={true}
        langBtn={isRtl ? 'English' : 'العربية'}
      />

      {/* 4. عرض محتوى صفحات المستودع الفرعية هنا */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        <Outlet context={{ isRtl, setIsRtl }} />
      </div>
    </div>
  );
}