// import { useState } from 'react';
// import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import Header, { type MenuItem, type TimeFilter } from '../components/layout/Header';

// // Default admin user data
// const defaultAdminData = {
//   userName: 'عمرو عمار',
//   userTitle: 'امين المستودع',
//   avatarChar: 'ع',
//   branchName: 'فرع حمص الرئيسي',
//   langBtn: 'English',
// };

// export interface PageHeaderData {
//   userName?: string;
//   userTitle?: string;
//   avatarChar?: string;
//   branchName?: string;
//   langBtn?: string;
//   title?: string;
//   subtitle?: string;
//   menuItems?: MenuItem[];
//   showFilters?: boolean;
//   showNotifications?: boolean;
//   showUserCard?: boolean;
// }

// export default function DashboardLayout() {
//   const [isRtl, setIsRtl] = useState(true);
//   const [activeTimeFilter, setActiveTimeFilter] = useState<TimeFilter>('day');
//   const [pageData, setPageData] = useState<PageHeaderData>({});

//   const location = useLocation();
//   const navigate = useNavigate();

//   // Merge default admin data with page-specific data
//   const headerData = {
//     ...defaultAdminData,
//     ...pageData,
//     // Override with page data if provided
//     userName: pageData.userName || defaultAdminData.userName,
//     userTitle: pageData.userTitle || defaultAdminData.userTitle,
//     avatarChar: pageData.avatarChar || defaultAdminData.avatarChar,
//     branchName: pageData.branchName || defaultAdminData.branchName,
//     langBtn: pageData.langBtn || (isRtl ? 'English' : 'العربية'),
//   };

//   const t = {
//     title: headerData.title || (isRtl ? 'نظرة عامة' : 'Overview'),
//     subtitle: headerData.subtitle || (isRtl ? 'ملخص أداء النظام لليوم' : 'System performance summary for today'),
//   };

//    const defaultMenuItems: MenuItem[] = [
//     { id: 'dash', text: isRtl ? 'الصفحه الرئيسيه' : 'Home page', path: '/dashboard' },
//     { id: 'products', text: isRtl ? 'إدارة المواد والمنتجات' : 'Products Management', path: '/products' },
//     { id: 'inventory', text: isRtl ? 'المخزون والمستودعات' : 'Inventory & Warehouses', path: null },
//     { id: 'team', text: isRtl ? 'إدارة الفريق والموظفين' : 'Team & Employees', path: null },
//     { id: 'reports', text: isRtl ? ' التقارير والتحليلات البيانية للمخزون' : 'Reports & Analytics', path: null },
//    ]


//     .map((item) => ({
//         ...item,
//         active: item.path !== null && location.pathname === item.path,
//       }));
    
//       const menuItems = pageData.menuItems || defaultMenuItems;
    
//       return (
//         <div className="flex flex-col w-full h-screen overflow-hidden bg-slate-50 font-sans relative" dir={isRtl ? 'rtl' : 'ltr'}>
//           <Header
//             title={t.title}
//             subtitle={t.subtitle}
//             activeFilter={headerData.showFilters !== false ? activeTimeFilter : undefined}
//             onFilterChange={headerData.showFilters !== false ? setActiveTimeFilter : undefined}
//             isRtl={isRtl}
//             onToggleRtl={() => setIsRtl(!isRtl)}
//             userName={headerData.userName}
//             userTitle={headerData.userTitle}
//             avatarChar={headerData.avatarChar}
//             branchName={headerData.branchName}
//             menuItems={menuItems}
//             onNavigate={(path) => navigate(path)}
//             showFilters={headerData.showFilters !== false}
//             showNotifications={headerData.showNotifications !== false}
//             showUserCard={headerData.showUserCard !== false}
//             langBtn={headerData.langBtn}
//           />
    
//           <div className="flex-1 overflow-y-auto bg-slate-50/50">
//             <Outlet context={{ isRtl, setIsRtl, setPageData }} />
//           </div>
//         </div>
//       );
//     }



