import React, { useState, useEffect } from 'react';
import { 
  Package, AlertTriangle, XCircle, TrendingDown, TrendingUp, 
  Download, FileText, Printer, RefreshCw, Bell, Activity, Layers,
  PieChart as PieChartIcon 
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// --- البيانات الوهمية (Mock Data) ---
const movementData = [
  { name: 'يناير', inbound: 400, outbound: 240 },
  { name: 'فبراير', inbound: 300, outbound: 139 },
  { name: 'مارس', inbound: 200, outbound: 800 },
  { name: 'أبريل', inbound: 278, outbound: 390 },
  { name: 'مايو', inbound: 189, outbound: 480 },
  { name: 'يونيو', inbound: 239, outbound: 380 },
];

const statusData = [
  { name: 'متوفر', value: 1233, color: '#10B981' },
  { name: 'منخفض', value: 12, color: '#F97316' },
  { name: 'نافد', value: 5, color: '#EF4444' },
];

const activeProductsData = [
  { name: 'قهوة', amount: 850 },
  { name: 'سكر', amount: 620 },
  { name: 'شاي', amount: 450 },
  { name: 'حليب', amount: 310 },
];

const inventoryEvolutionData = [
  { name: 'الأسبوع 1', total: 15000 },
  { name: 'الأسبوع 2', total: 16500 },
  { name: 'الأسبوع 3', total: 18000 },
  { name: 'الأسبوع 4', total: 18540 },
];

const lowStockProducts = [
  { id: 1, name: 'سكر 1 كجم', current: 12, min: 30 },
  { id: 2, name: 'قهوة عربية', current: 5, min: 20 },
  { id: 3, name: 'أكواب ورقية', current: 15, min: 50 },
];

const outOfStockProducts = [
  { id: 1, name: 'حليب مبستر', lastAction: 'منذ يومين' },
  { id: 2, name: 'زيت زيتون', lastAction: 'منذ أسبوع' },
];

const recentMovements = [
  { id: 1, date: 'اليوم', type: 'وارد', product: 'قهوة', qty: '+50', color: 'text-green-600' },
  { id: 2, date: 'اليوم', type: 'صادر', product: 'سكر', qty: '-12', color: 'text-blue-600' },
  { id: 3, date: 'أمس', type: 'صادر', product: 'شاي', qty: '-5', color: 'text-blue-600' },
];

// --- المكون الرئيسي ---
export default function InventoryReports() {
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const fetchData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1200);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleExport = (type: string) => {
    showToast(`تم بدء تصدير التقرير بصيغة ${type}`);
  };

  if (isLoading) {
    return (
      <div dir="rtl" className="p-6 min-h-screen bg-slate-100 flex flex-col gap-6 animate-pulse">
        <div className="h-16 bg-gray-300 rounded-xl"></div>
        <div className="h-12 bg-gray-300 rounded-xl w-1/2"></div>
        <div className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-gray-300 rounded-xl"></div>)}
        </div>
        <div className="h-64 bg-gray-300 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-6 min-h-screen bg-slate-100 font-sans text-gray-900">
      
      {/* التنبيهات الذكية */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-xl z-50 transition-all">
          {toastMessage}
        </div>
      )}
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-3 bg-red-100 text-red-800 p-3 rounded-lg border border-red-200 shadow-sm">
          <AlertTriangle size={20} className="text-red-500" />
          <span className="font-semibold text-sm">تنبيه حرج: يوجد 5 منتجات نافدة تماماً من المستودع تحتاج لإجراء فوري.</span>
        </div>
        <div className="flex items-center gap-3 bg-green-100 text-green-800 p-3 rounded-lg border border-green-200 shadow-sm">
          <Bell size={20} className="text-green-500" />
          <span className="font-semibold text-sm">إشعار: تم استلام 3 شحنات توريد جديدة بنجاح اليوم.</span>
        </div>
      </div>

      {/* الرأس (Header) والأزرار */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تقارير وتحليلات المخزون</h1>
          <p className="text-sm text-gray-600 mt-1">نظرة شاملة لحالة المخزون وحركة المنتجات</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => handleExport('PDF')} className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md">
            <FileText size={16} className="text-red-500" /> PDF
          </button>
          <button onClick={() => handleExport('Excel')} className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md">
            <Download size={16} className="text-green-600" /> Excel
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md">
            <Printer size={16} className="text-gray-600" /> طباعة
          </button>
          <button onClick={() => { fetchData(); showToast('تم تحديث البيانات بنجاح'); }} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md">
            <RefreshCw size={16} /> تحديث
          </button>
        </div>
      </div>

      {/* الفلاتر */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">الفترة الزمنية</label>
          <select className="w-full bg-gray-100 border border-gray-300 text-gray-800 py-2 px-3 rounded-lg text-sm outline-none focus:border-blue-600">
            <option>هذا الشهر</option>
            <option>هذا الأسبوع</option>
            <option>اليوم</option>
            <option>هذا العام</option>
            <option>فترة مخصصة...</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">التصنيف</label>
          <select className="w-full bg-gray-100 border border-gray-300 text-gray-800 py-2 px-3 rounded-lg text-sm outline-none focus:border-blue-600">
            <option>جميع التصنيفات</option>
            <option>مشروبات</option>
            <option>مواد غذائية</option>
            <option>منظفات</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">الحالة</label>
          <select className="w-full bg-gray-100 border border-gray-300 text-gray-800 py-2 px-3 rounded-lg text-sm outline-none focus:border-blue-600">
            <option>جميع المنتجات</option>
            <option>متوفر</option>
            <option>منخفض المخزون</option>
            <option>نافد</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">المستودع</label>
          <select className="w-full bg-gray-100 border border-gray-300 text-gray-800 py-2 px-3 rounded-lg text-sm outline-none focus:border-blue-600">
            <option>المستودع الرئيسي (الرياض)</option>
            <option>مستودع التبريد</option>
          </select>
        </div>
      </div>

      {/* بطاقات الإحصائيات الست الملونة والمحسنة */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        
        <StatCard 
          title="إجمالي المنتجات" 
          value="1,250" 
          icon={<Package size={22} />} 
          bg="bg-gradient-to-bl from-slate-200 to-slate-50" 
          borderColor="border-slate-300 hover:border-slate-400"
          textColor="text-slate-900" 
          iconStyle="bg-slate-300 text-slate-800"
          hoverShadow="hover:shadow-slate-200/50"
        />

        <StatCard 
          title="إجمالي الكمية بالمخزن" 
          value="18,540" 
          icon={<Layers size={22} />} 
          bg="bg-gradient-to-bl from-indigo-200 to-indigo-50" 
          borderColor="border-indigo-300 hover:border-indigo-400"
          textColor="text-indigo-900" 
          iconStyle="bg-indigo-300 text-indigo-800"
          hoverShadow="hover:shadow-indigo-200/50"
        />

        <StatCard 
          title="منخفض المخزون" 
          value="12" 
          icon={<TrendingDown size={22} />} 
          bg="bg-gradient-to-bl from-amber-200 to-amber-50" 
          borderColor="border-amber-300 hover:border-amber-500"
          textColor="text-amber-900" 
          iconStyle="bg-amber-300 text-amber-800"
          hoverShadow="hover:shadow-amber-200/50"
        />

        <StatCard 
          title="منتجات نافدة" 
          value="5" 
          icon={<XCircle size={22} />} 
          bg="bg-gradient-to-bl from-red-200 to-red-50" 
          borderColor="border-red-300 hover:border-red-500"
          textColor="text-red-900" 
          iconStyle="bg-red-300 text-red-800"
          hoverShadow="hover:shadow-red-200/50"
        />

        <StatCard 
          title="الوارد هذا الشهر" 
          value="2,450" 
          icon={<Download size={22} />} 
          bg="bg-gradient-to-bl from-emerald-200 to-emerald-50" 
          borderColor="border-emerald-300 hover:border-emerald-500"
          textColor="text-emerald-900" 
          iconStyle="bg-emerald-300 text-emerald-800"
          hoverShadow="hover:shadow-emerald-200/50"
        />

        <StatCard 
          title="الصادر هذا الشهر" 
          value="1,980" 
          icon={<TrendingUp size={22} />} 
          bg="bg-gradient-to-bl from-sky-200 to-sky-50" 
          borderColor="border-sky-300 hover:border-sky-500"
          textColor="text-sky-900" 
          iconStyle="bg-sky-300 text-sky-800"
          hoverShadow="hover:shadow-sky-200/50"
        />
      </div>

      {/* مؤشرات الأداء KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="معدل دوران المخزون" value="85%" colorTheme="violet" />
        <KpiCard label="متوسط الاستهلاك اليومي" value="120 قطعة" colorTheme="orange" />
        <KpiCard label="عدد الحركات اليوم" value="48 حركة" colorTheme="blue" />
        <KpiCard label="متوسط الوارد اليومي" value="75 قطعة" colorTheme="teal" />
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 1. حركة الوارد والصادر */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transform hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Activity size={20} className="text-blue-500"/> حركة الوارد والصادر</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={movementData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Line type="monotone" name="الوارد" dataKey="inbound" stroke="#10B981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                <Line type="monotone" name="الصادر" dataKey="outbound" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. توزيع المنتجات حسب الحالة */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transform hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-purple-500"/> توزيع حالة المنتجات
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label={({name, percent}) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. المنتجات الأكثر حركة */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transform hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Activity size={20} className="text-orange-500"/> المنتجات الأكثر حركة (استهلاكاً)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeProductsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#CBD5E1" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#334155', fontSize: 14, fontWeight: 500}} />
                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="amount" name="الكمية المستهلكة" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. تطور المخزون */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transform hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ease-out cursor-pointer">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-indigo-500"/> تطور إجمالي المخزون</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inventoryEvolutionData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} domain={['dataMin - 1000', 'dataMax + 1000']} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" name="إجمالي القطع" dataKey="total" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* الجداول */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* جدول المنتجات منخفضة المخزون والنافدة */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transform hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ease-out">
            <div className="bg-orange-100 border-b border-orange-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-orange-800 flex items-center gap-2"><AlertTriangle size={18}/> منتجات تحتاج لإعادة طلب (منخفضة)</h3>
              <span className="bg-orange-300 text-orange-900 text-xs font-bold px-2 py-1 rounded-full">{lowStockProducts.length} منتجات</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 font-medium">المنتج</th>
                    <th className="px-6 py-3 font-medium">الكمية الحالية</th>
                    <th className="px-6 py-3 font-medium">الحد الأدنى</th>
                    <th className="px-6 py-3 font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lowStockProducts.map(item => (
                    <tr key={item.id} className="hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                      <td className="px-6 py-4 font-bold text-orange-700">{item.current}</td>
                      <td className="px-6 py-4 text-gray-600">{item.min}</td>
                      <td className="px-6 py-4">
                        <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs font-medium">اطلب الآن</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transform hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ease-out">
            <div className="bg-red-100 border-b border-red-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-red-900 flex items-center gap-2"><XCircle size={18}/> المنتجات النافدة</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 font-medium">المنتج</th>
                    <th className="px-6 py-3 font-medium">آخر عملية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {outOfStockProducts.map(item => (
                    <tr key={item.id} className="hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                      <td className="px-6 py-4 text-gray-600">{item.lastAction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* جدول آخر الحركات */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-1 flex flex-col transform hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ease-out">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">آخر حركات المخزون</h3>
          </div>
          <div className="p-0 overflow-x-auto flex-1">
             <table className="w-full text-right text-sm">
                <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-medium">التاريخ</th>
                    <th className="px-4 py-3 font-medium">العملية</th>
                    <th className="px-4 py-3 font-medium">المنتج</th>
                    <th className="px-4 py-3 font-medium">الكمية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentMovements.map(item => (
                    <tr key={item.id} className="hover:bg-gray-100 transition-colors">
                      <td className="px-4 py-3 text-gray-600 text-xs">{item.date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${item.type === 'وارد' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{item.product}</td>
                      <td className={`px-4 py-3 font-bold ${item.color} dir-ltr text-left`}>{item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-100 text-center">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">عرض السجل كاملاً &larr;</button>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- المكونات المساعدة ---
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bg: string;
  borderColor: string;
  textColor: string;
  iconStyle: string;
  hoverShadow: string;
}

function StatCard({ title, value, icon, bg, borderColor, textColor, iconStyle, hoverShadow }: StatCardProps) {
  return (
    <div className={`
      ${bg} ${borderColor} p-5 rounded-xl border
      transform hover:-translate-y-2 hover:shadow-2xl ${hoverShadow}
      transition-all duration-300 ease-out cursor-pointer
      flex flex-col justify-between shadow-sm min-h-[110px]
    `}>
      <div className="flex justify-between items-start w-full mb-2">
        <p className="text-xs font-bold text-gray-600 tracking-wide">{title}</p>
        <div className={`${iconStyle} p-2 rounded-lg shadow-inner transition-transform duration-300 hover:scale-110`}>
          {icon}
        </div>
      </div>
      <div>
        <h4 className={`text-3xl font-black ${textColor}`}>{value}</h4>
      </div>
    </div>
  );
}

function KpiCard({ label, value, colorTheme }: { label: string, value: string, colorTheme: 'violet' | 'orange' | 'blue' | 'teal' }) {
  const themeStyles = {
    violet: "hover:border-violet-300 hover:shadow-violet-100 border-l-4 border-l-violet-500",
    orange: "hover:border-orange-300 hover:shadow-orange-100 border-l-4 border-l-orange-500",
    blue: "hover:border-blue-300 hover:shadow-blue-100 border-l-4 border-l-blue-500",
    teal: "hover:border-teal-300 hover:shadow-teal-100 border-l-4 border-l-teal-500",
  };

  return (
    <div className={`
      bg-white border border-gray-200 p-4 rounded-xl shadow-sm
      flex flex-col justify-center items-start text-right
      transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer
      ${themeStyles[colorTheme]}
    `}>
      <span className="text-xs font-semibold text-gray-500 mb-2">{label}</span>
      <span className="text-xl font-bold text-gray-900">{value}</span>
    </div>
  );
}