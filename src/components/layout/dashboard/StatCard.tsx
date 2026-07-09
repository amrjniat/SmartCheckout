// import React from 'react';

// // 1. قاموس التصميم الثابت لضمان قراءة الألوان والظلال من قبل محرك Tailwind بوضوح
// const cardVariants = {
//   blue: {
//     gradient: 'from-blue-500 to-sky-600',
//     shadow: 'shadow-blue-500/15',
//   },
//   indigo: {
//     gradient: 'from-indigo-500 to-purple-600',
//     shadow: 'shadow-indigo-500/15',
//   },
//   emerald: {
//     gradient: 'from-emerald-500 to-teal-600',
//     shadow: 'shadow-emerald-500/15',
//   },
//   amber: {
//     gradient: 'from-amber-500 to-orange-600',
//     shadow: 'shadow-amber-500/15',
//   },
// };

// interface CardItemProps {
//   title: string;
//   value: string | number;
//   unit: string;
//   variant: 'blue' | 'indigo' | 'emerald' | 'amber';
//   icon: React.ReactNode;
// }

// // مكون فرعي للبطاقة الفردية لضمان كفاءة البناء ونقاء الهيكل
// function CardItem({ title, value, unit, variant, icon }: CardItemProps) {
//   const currentStyle = cardVariants[variant];

//   return (
//     <div className={`p-5 rounded-2xl text-white bg-gradient-to-br ${currentStyle.gradient} shadow-xl ${currentStyle.shadow} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between h-36 relative overflow-hidden group`}>
//       {/* تأثير الهالة الضوئية الخلفية عند التحويم */}
//       <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl transition-all duration-500 group-hover:scale-150"></div>
      
//       {/* القسم العلوي: العنوان والأيقونة المتناسقة مع حماية اتجاه العرض العربي */}
//       <div className="flex items-center justify-between" dir="rtl">
//         <span className="text-xs font-bold opacity-90 tracking-wide">{title}</span>
//         <div className="p-2 bg-white/15 rounded-xl backdrop-blur-md flex items-center justify-center">
//           {icon}
//         </div>
//       </div>

//       {/* القسم السفلي: عرض الأرقام مع ميزة منع الالتفاف للحفاظ على استقرار الواجهة */}
//       <div className="text-right mt-2" dir="rtl">
//         <h3 className="text-2xl font-black tracking-tight flex items-baseline gap-1.5 whitespace-nowrap">
//           <span>{value}</span>
//           <span className="text-[11px] font-bold opacity-75">{unit}</span>
//         </h3>
//       </div>
//     </div>
//   );
// }

// // المكون الرئيسي الشامل لشبكة الكروت الأربعة
// export default function StatsGrid() {
  
//   // 2. مصفوفة البيانات المركزية لتغذية الواجهة ديناميكياً (مطابقة تماماً لصورة image_dd2445_2.jpg)
//   const statsData: (CardItemProps & { id: string })[] = [
//     {
//       id: 'today-sales',
//       title: 'مبيعات اليوم',
//       value: '2,500,000',
//       unit: 'ل.س',
//       variant: 'blue',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//       ),
//     },
//     {
//       id: 'total-invoices',
//       title: 'عدد الفواتير',
//       value: '145',
//       unit: 'فاتورة',
//       variant: 'indigo',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//         </svg>
//       ),
//     },
//     {
//       id: 'net-profit',
//       title: 'الربح الصافي',
//       value: '850,000',
//       unit: 'ل.س',
//       variant: 'emerald',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//         </svg>
//       ),
//     },
//     {
//       id: 'low-stock',
//       title: 'مواد منخفضة المخزون',
//       value: '12',
//       unit: 'مادة',
//       variant: 'amber',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//         </svg>
//       ),
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full" dir="rtl">
//       {/* 3. توليد كروت الإحصائيات برمجياً باستخدام حلقة ماب النظيفة */}
//       {statsData.map(({ id, ...cardProps }) => (
//         <CardItem key={id} {...cardProps} />
//       ))}
//     </div>
//   );
// }




// 1. تعريف واجهة البيانات (Props Interface) ليفهمها الـ TypeScript
interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  variant: 'blue' | 'purple' | 'green' | 'orange';
}

export default function StatCard({ title, value, icon, variant }: StatCardProps) {
  
  // 2. توزيع الألوان ديناميكياً بناءً على الـ variant المطابق لـ POSWAVE
  const colorStyles = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
    green: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white',
    orange: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
  };

  // 3. أيقونات تقريبية مؤقتة للفرونت إند بناءً على نوع الكرت
  const renderIcon = () => {
    switch (icon) {
      case 'dollar': return '💵';
      case 'file': return '📄';
      case 'trending-up': return '📈';
      case 'alert': return '⚠️';
      default: return '📊';
    }
  };

  return (
    <div className={`p-6 rounded-2xl shadow-sm flex justify-between items-center transition-all hover:scale-[1.02] duration-300 ${colorStyles[variant]}`}>
      {/* القسم الأيسر للأيقونة الخلفية */}
      <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-2xl flex items-center justify-center shadow-inner">
        {renderIcon()}
      </div>
      
      {/* القسم الأيمن للنصوص والأرقام الممررة ديناميكياً */}
      <div className="text-right space-y-2">
        <p className="text-sm font-medium opacity-90">{title}</p>
        <h3 className="text-2xl font-bold tracking-wide">{value}</h3>
      </div>
    </div>
  );
}