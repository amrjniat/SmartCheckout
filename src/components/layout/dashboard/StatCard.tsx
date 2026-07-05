interface StatCardProps {
  title: string
  value: string
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 to-sky-700 rounded-2xl p-6 text-white shadow-lg shadow-sky-500/30 transform hover:-translate-y-1 transition-all duration-300 group select-none">
      
      {/* الدائرة الديكورية الخلفية - تمنح عمقاً وتتأثر بحركة الماوس */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 group-hover:bg-white/15 transition-all duration-500" />
      
      {/* المحتوى النصي للبطاقة */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <p className="text-xs font-semibold text-sky-100/80 tracking-wider mb-3 uppercase">
          {title}
        </p>
        <p className="text-3xl font-black tracking-tight drop-shadow-sm">
          {value}
        </p>
      </div>
    </div>
  )
}

export default StatCard