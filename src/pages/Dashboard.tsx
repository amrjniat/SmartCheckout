import StatCard from '../components/layout/dashboard/StatCard'

function Dashboard() {
  // بيانات تجريبية مؤقتة (Mock Data) لمحاكاة استجابة الـ API مستقبلاً
  const stats = [
    { title: "مبيعات اليوم", value: "2,500,000 ل.س" },
    { title: "عدد الفواتير", value: "145" },
    { title: "الربح الصافي", value: "850,000 ل.س" },
    { title: "مواد منخفضة المخزون", value: "12" }
  ]

  return (
    <div className="space-y-6">
      {/* الترويسة الخاصة بالصفحة */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">نظرة عامة</h1>
        <p className="text-gray-500 mt-1">ملخص أداء النظام لهذا اليوم.</p>
      </div>

      {/* شبكة البطاقات الإحصائية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard 
            key={index} 
            title={stat.title} 
            value={stat.value} 
          />
        ))}
      </div>

      {/* مساحة محجوزة للمكونات القادمة (جداول أو رسوم بيانية) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center min-h-[300px]">
        <p className="text-gray-400">مساحة مخصصة لجدول أحدث الحركات أو الرسوم البيانية (قيد الإنشاء)</p>
      </div>
    </div>
  )
}

export default Dashboard