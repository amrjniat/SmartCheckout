import PoswaveLogo from './PoswaveLogo'; // تأكدي أن هذا المسار يوصل فعلياً لملف PoswaveLogo.tsx

type TimeFilter = 'day' | 'week' | 'month';

interface HeaderProps {
  title: string;
  subtitle: string;
  activeFilter?: TimeFilter;
  onFilterChange?: (filter: TimeFilter) => void;
}

export default function Header({ title, subtitle, activeFilter, onFilterChange }: HeaderProps) {
  return (
    <header className="w-full bg-[#0a1931] text-white shadow-lg px-6 py-4 select-none">
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* 🌟 الشعار الموحد (حرف P والموجة) */}
        <PoswaveLogo />

        <div className="flex items-center gap-4">
          <div className="text-left sm:text-right hidden sm:block">
            <h2 className="text-sm font-bold text-slate-200">{title}</h2>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>

          {/* أزرار الفلتر (تظهر فقط إذا تم تمريرها للمكون) */}
          {activeFilter && onFilterChange && (
            <div className="flex bg-slate-800 p-1 rounded-xl gap-1 border border-slate-700/50">
              {(['day', 'week', 'month'] as TimeFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => onFilterChange(filter)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter === 'day' ? 'اليوم' : filter === 'week' ? 'الأسبوع' : 'الشهر'}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}