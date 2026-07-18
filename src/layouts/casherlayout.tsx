import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header, { type MenuItem, type TimeFilter } from '../components/layout/Header';
import { type PageHeaderData } from './DashboardLayout';
const defaultWarehouseData = {
  userName: 'عمرو جنيات',
  userTitle: 'الكاشير (المحاسب)',
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
const defaultMenuItems: MenuItem[] = [
    { id: 'dash', text: isRtl ? 'الصفحه الرئيسيه' : 'Home page', path: '/cashier' },
    { id: 'pos', text: isRtl ? 'شاشة البيع السريع (POS)' : 'Quick Sale Screen (POS)', path: '/pos' },
    { id: 'sales', text: isRtl ? 'الفواتير والمبيعات' : 'Sales & Invoices', path: '/cashier/invoices' },
      { id: 'clients', text: isRtl ? 'إدارة العملاء' : 'Client Management', path: '/cashier/clients' },
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