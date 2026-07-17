// import { useState } from 'react';
// import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import Header, { type MenuItem, type TimeFilter } from '../components/layout/Header';

// export default function WarehouseLayout() {
//   const [isRtl, setIsRtl] = useState(true);
//   const [activeTimeFilter, setActiveTimeFilter] = useState<TimeFilter>('day');
  
//   const location = useLocation();
//   const navigate = useNavigate();

//   // 1. تحديد قائمة الأزرار الخاصة بالمستودع بشكل مستقل تماماً
//   const defaultMenuItems: MenuItem[] = [
//       { id: 'dash', text: isRtl ? 'الصفحه الرئيسيه' : 'Home page', path: '/dashboard' },
//       { id: 'products', text: isRtl ? 'إدارة المواد والمنتجات' : 'Products Management', path: '/products' },
//       { id: 'inventory', text: isRtl ? 'المخزون والمستودعات' : 'Inventory & Warehouses', path: null },
//       { id: 'team', text: isRtl ? 'إدارة الفريق والموظفين' : 'Team & Employees', path: null },
//       { id: 'reports', text: isRtl ? ' التقارير والتحليلات البيانية للمخزون' : 'Reports & Analytics', path: null },
//      ].map((item) => ({
//     ...item,
//     // تفعيل الزر برمجياً بناءً على المسار الحالي لتجنب أي مشاكل في إضاءة الزر
//     active: item.path !== null && location.pathname === item.path,
//   }));

//   return (
//     <div className="flex flex-col w-full h-screen overflow-hidden bg-slate-50 font-sans relative" dir={isRtl ? 'rtl' : 'ltr'}>
//       <Header
//         title={isRtl ? 'إدارة المستودعات' : 'Warehouse Management'}
//         subtitle={isRtl ? 'النظام المتخصص بمراقبة وحركة المخزون' : 'Specialized Inventory System'}
//         activeFilter={activeTimeFilter}
//         onFilterChange={setActiveTimeFilter}
//         isRtl={isRtl}
//         onToggleRtl={() => setIsRtl(!isRtl)}
//         // 2. تخصيص بيانات المسؤول لهذا القسم
//         userName="عمرو جنيات"
//         userTitle="إدارة المستودع"
//         avatarChar="ع"
//         // 3. تمرير القائمة المستقلة هنا
//         menuItems={defaultMenuItems}
//         onNavigate={(path) => {
//           if (path) navigate(path);
//         }}
//         showFilters={true}
//         showNotifications={true}
//         showUserCard={true}
//         langBtn={isRtl ? 'English' : 'العربية'}
//       />

//       {/* 4. عرض محتوى صفحات المستودع الفرعية هنا */}
//       <div className="flex-1 overflow-y-auto bg-slate-50/50">
//         <Outlet context={{ isRtl, setIsRtl }} />
//       </div>
//     </div>
//   );
// }

















// import { useState, useEffect } from 'react';
// import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import Header, { type MenuItem, type TimeFilter } from '../components/layout/Header';
// import { type PageHeaderData } from './DashboardLayout';

// // بيانات افتراضية لأمين المستودع
// const defaultWarehouseData = {
//   userName: 'عمرو جنيات',
//   userTitle: 'إدارة المستودع',
//   avatarChar: 'ع',
//   langBtn: 'English',
// };

// export default function WarehouseLayout() {
//   const [isRtl, setIsRtl] = useState(true);
//   const [activeTimeFilter, setActiveTimeFilter] = useState<TimeFilter>('day');
//   const [pageData, setPageData] = useState<PageHeaderData>({});

//   const location = useLocation();
//   const navigate = useNavigate();

//   // ✅ إعادة تعيين showHeader عند تغيير المسار لضمان ظهور الشريط افتراضياً
//   useEffect(() => {
//     setPageData(prev => ({ ...prev, showHeader: undefined }));
//   }, [location.pathname]);

//   // دمج بيانات أمين المستودع الافتراضية مع بيانات الصفحة الخاصة (إن وُجدت)
//   const headerData = {
//     ...defaultWarehouseData,
//     ...pageData,
//     userName: pageData.userName || defaultWarehouseData.userName,
//     userTitle: pageData.userTitle || defaultWarehouseData.userTitle,
//     avatarChar: pageData.avatarChar || defaultWarehouseData.avatarChar,
//     langBtn: pageData.langBtn || (isRtl ? 'English' : 'العربية'),
//   };

//   const t = {
//     title: headerData.title || (isRtl ? 'إدارة المستودعات' : 'Warehouse Management'),
//     subtitle: headerData.subtitle || (isRtl ? 'النظام المتخصص بمراقبة وحركة المخزون' : 'Specialized Inventory System'),
//   };

//   // 1. تحديد قائمة الأزرار الخاصة بالمستودع بشكل مستقل تماماً
//   const defaultMenuItems: MenuItem[] = [
//     { id: 'dash', text: isRtl ? 'الصفحه الرئيسيه' : 'Home page', path: '/dashboard' },
//     { id: 'products', text: isRtl ? 'إدارة المواد والمنتجات' : 'Products Management', path: '/warehouse/products' },
//     { id: 'inventory', text: isRtl ? 'المخزون والمستودعات' : 'Inventory & Warehouses', path: null },
//     { id: 'team', text: isRtl ? 'إدارة الفريق والموظفين' : 'Team & Employees', path: null },
//     { id: 'reports', text: isRtl ? ' التقارير والتحليلات البيانية للمخزون' : 'Reports & Analytics', path: null },
//   ].map((item) => ({
//     ...item,
//     // تفعيل الزر برمجياً بناءً على المسار الحالي لتجنب أي مشاكل في إضاءة الزر
//     active: item.path !== null && location.pathname === item.path,
//   }));

//   const menuItems = pageData.menuItems || defaultMenuItems;

//   return (
//     <div className="flex flex-col w-full h-screen overflow-hidden bg-slate-50 font-sans relative" dir={isRtl ? 'rtl' : 'ltr'}>
//       {/* ✅ يُعرض الشريط افتراضياً، ويُخفى فقط إذا طلبت الصفحة ذلك عبر setPageData({ showHeader: false }) */}
//       {headerData.showHeader !== false && (
//         <Header
//           title={t.title}
//           subtitle={t.subtitle}
//           activeFilter={headerData.showFilters !== false ? activeTimeFilter : undefined}
//           onFilterChange={headerData.showFilters !== false ? setActiveTimeFilter : undefined}
//           isRtl={isRtl}
//           onToggleRtl={() => setIsRtl(!isRtl)}
//           userName={headerData.userName}
//           userTitle={headerData.userTitle}
//           avatarChar={headerData.avatarChar}
//           menuItems={menuItems}
//           onNavigate={(path: string) => navigate(path)}
//           showFilters={headerData.showFilters !== false}
//           showNotifications={headerData.showNotifications !== false}
//           showUserCard={headerData.showUserCard !== false}
//           langBtn={headerData.langBtn}
//         />
//       )}

//       {/* عرض محتوى صفحات المستودع الفرعية هنا */}
//       <div className="flex-1 overflow-y-auto bg-slate-50/50">
//         <Outlet context={{ isRtl, setIsRtl, setPageData }} />
//       </div>
//     </div>
//   );
// }





























import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header, { type MenuItem, type TimeFilter } from '../components/layout/Header';
import { type PageHeaderData } from './DashboardLayout';

// بيانات افتراضية لأمين المستودع
const defaultWarehouseData = {
  userName: 'عمرو جنيات',
  userTitle: 'إدارة المستودع',
  avatarChar: 'ع',
  langBtn: 'English',
};

export default function WarehouseLayout() {
  const [isRtl, setIsRtl] = useState(true);
  const [activeTimeFilter, setActiveTimeFilter] = useState<TimeFilter>('day');
  const [pageData, setPageData] = useState<PageHeaderData>({});

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ إعادة تعيين showHeader عند تغيير المسار لضمان ظهور الشريط افتراضياً
  useEffect(() => {
    setPageData(prev => ({ ...prev, showHeader: undefined }));
  }, [location.pathname]);

  // دمج بيانات أمين المستودع الافتراضية مع بيانات الصفحة الخاصة (إن وُجدت)
  const headerData = {
    ...defaultWarehouseData,
    ...pageData,
    userName: pageData.userName || defaultWarehouseData.userName,
    userTitle: pageData.userTitle || defaultWarehouseData.userTitle,
    avatarChar: pageData.avatarChar || defaultWarehouseData.avatarChar,
    langBtn: pageData.langBtn || (isRtl ? 'English' : 'العربية'),
  };

  const t = {
    title: headerData.title || (isRtl ? 'إدارة المستودعات' : 'Warehouse Management'),
    subtitle: headerData.subtitle || (isRtl ? 'النظام المتخصص بمراقبة وحركة المخزون' : 'Specialized Inventory System'),
  };

  // 1. تحديد قائمة الأزرار الخاصة بالمستودع بشكل مستقل تماماً
  const defaultMenuItems: MenuItem[] = [
    { id: 'dash', text: isRtl ? 'الصفحه الرئيسيه' : 'Home page', path: '/warehouse' },
    { id: 'products', text: isRtl ? 'إدارة المواد والمنتجات' : 'Products Management', path: '/warehouse/products' },
    { id: 'inventory', text: isRtl ? 'المخزون والمستودعات' : 'Inventory & Warehouses', path: '/warehouse/inventory' },
    { id: 'team', text: isRtl ? 'الموردون' : 'Team & Employees', path:  '/warehouse/Suppliers'},
    { id: 'reports', text: isRtl ? ' التقارير والتحليلات البيانية للمخزون' : 'Reports & Analytics', path: '/warehouse/reports' },
  ].map((item) => ({
    ...item,
    // تفعيل الزر برمجياً بناءً على المسار الحالي لتجنب أي مشاكل في إضاءة الزر
    active: item.path !== null && location.pathname === item.path,
  }));

  const menuItems = pageData.menuItems || defaultMenuItems;

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-slate-50 font-sans relative" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ✅ يُعرض الشريط افتراضياً، ويُخفى فقط إذا طلبت الصفحة ذلك عبر setPageData({ showHeader: false }) */}
      {headerData.showHeader !== false && (
        <Header
          title={t.title}
          subtitle={t.subtitle}
          activeFilter={headerData.showFilters !== false ? activeTimeFilter : undefined}
          onFilterChange={headerData.showFilters !== false ? setActiveTimeFilter : undefined}
          isRtl={isRtl}
          onToggleRtl={() => setIsRtl(!isRtl)}
          userName={headerData.userName}
          userTitle={headerData.userTitle}
          avatarChar={headerData.avatarChar}
          menuItems={menuItems}
          onNavigate={(path: string) => navigate(path)}
          showFilters={headerData.showFilters !== false}
          showNotifications={headerData.showNotifications !== false}
          showUserCard={headerData.showUserCard !== false}
          langBtn={headerData.langBtn}
        />
      )}

      {/* عرض محتوى صفحات المستودع الفرعية هنا */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        <Outlet context={{ isRtl, setIsRtl, setPageData }} />
      </div>
    </div>
  );
}