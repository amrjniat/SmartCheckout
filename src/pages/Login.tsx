import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import logoImage from '../assets/photo_2026-07-02_23-29-04.jpg';
import { login } from '../services/authService';

type Language = 'ar' | 'en';

// ============================
// الترجمات / Translations
// ============================
const translations = {
  ar: {
    dir: 'rtl' as const,
    langToggleLabel: 'English',
    badge: 'POSWAVE',
    title: 'تسجيل الدخول',
    subtitle: 'أدخل اسم المستخدم لتسجيل الدخول إلى لوحة التحكم.',
    usernameLabel: 'اسم المستخدم',
    usernamePlaceholder: 'ahmed_almohammad',
    passwordLabel: 'كلمة المرور',
    submit: 'تسجيل دخول',
    submitting: 'جاري تسجيل الدخول...',
    noAccount: 'ليس لديك حساب؟',
    signupLink: 'إنشاء حساب جديد',
    heroTitleLine1: 'بناء إمبراطوريتك المالية',
    heroTitleLine2: 'يبدأ من هنا',
    heroSubtitle: 'انضم إلى آلاف المتاجر التي تعتمد على POSWAVE لإدارة مبيعاتها وتحليلاتها بدقة متناهية.',
    salesPerformance: 'أداء المبيعات',
    total: 'إجمالي',
    products: 'منتجات',
    cashiers: 'كاشير',
    totalSales: 'إجمالي المبيعات',
    payNow: 'دفع الآن',
    todayOrders: 'طلبات اليوم',
    itemsCount: 'عنصر',
    sampleProduct: 'قهوة عربية',
    currency: 'ر.س',
    chartLabels: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    successMsg: 'تم تسجيل الدخول بنجاح!',
    genericError: 'فشل تسجيل الدخول. يرجى التحقق من البيانات.',
    errors: {
      usernameRequired: 'الرجاء إدخال اسم المستخدم',
      passwordMin: 'كلمة المرور يجب أن لا تقل عن 8 أحرف',
    },
  },
  en: {
    dir: 'ltr' as const,
    langToggleLabel: 'العربية',
    badge: 'POSWAVE',
    title: 'Sign In',
    subtitle: 'Enter your username to sign in to your dashboard.',
    usernameLabel: 'Username',
    usernamePlaceholder: 'john_smith',
    passwordLabel: 'Password',
    submit: 'Sign In',
    submitting: 'Signing in...',
    noAccount: "Don't have an account?",
    signupLink: 'Create a new account',
    heroTitleLine1: 'Build your financial empire',
    heroTitleLine2: 'starts right here',
    heroSubtitle: 'Join thousands of stores relying on POSWAVE to manage their sales and analytics with pinpoint accuracy.',
    salesPerformance: 'Sales Performance',
    total: 'Total',
    products: 'Products',
    cashiers: 'Cashiers',
    totalSales: 'Total Sales',
    payNow: 'Pay Now',
    todayOrders: "Today's Orders",
    itemsCount: 'items',
    sampleProduct: 'Arabic Coffee',
    currency: 'JOD',
    chartLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    successMsg: 'Signed in successfully!',
    genericError: 'Sign in failed. Please check your credentials.',
    errors: {
      usernameRequired: 'Please enter your username',
      passwordMin: 'Password must be at least 8 characters',
    },
  },
};

type TranslationSet = typeof translations[Language];

// بناء مخطط التحقق حسب اللغة الحالية / Build the validation schema for the current language
const buildLoginSchema = (t: TranslationSet) =>
  z.object({
    username: z.string().min(1, { message: t.errors.usernameRequired }),
    password: z.string().min(8, { message: t.errors.passwordMin }),
  });

type LoginFormData = z.infer<ReturnType<typeof buildLoginSchema>>;

// نقاط بيانات مبسطة لرسم مخطط الأداء داخل معاينة لوحة التحكم
const chartPoints = [4, 22, 14, 34, 20, 44, 30, 46];

const buildChartPath = (points: number[], width: number, height: number) => {
  const step = width / (points.length - 1);
  const max = Math.max(...points);
  return points
    .map((p, i) => {
      const x = i * step;
      const y = height - (p / max) * height;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<Language>('ar');
  const t = translations[language];
  const isRTL = t.dir === 'rtl';

  // نحتفظ بمرجع للغة الحالية ليستخدمه الـ resolver عند التحقق من صحة البيانات
  const langRef = useRef(language);
  useEffect(() => {
    langRef.current = language;
  }, [language]);

  // مُحلِّل مخصص يعيد بناء مخطط Zod باللغة الحالية في كل مرة يتم التحقق فيها من النموذج
  const resolver = async (values: LoginFormData) => {
    const schema = buildLoginSchema(translations[langRef.current]);
    const result = schema.safeParse(values);
    if (result.success) {
      return { values: result.data, errors: {} };
    }
    const fieldErrors: Record<string, { type: string; message: string }> = {};
    result.error.issues.forEach((issue) => {
      const key = issue.path[0] as string;
      if (!fieldErrors[key]) {
        fieldErrors[key] = { type: issue.code, message: issue.message };
      }
    });
    return { values: {}, errors: fieldErrors };
  };

  // إعداد React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver,
    mode: 'onSubmit',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      // استدعاء دالة تسجيل الدخول التي أنشأناها في الخدمة
      await login(data.username, data.password);

      toast.success(t.successMsg);
      navigate('/'); // التحويل للوحة التحكم بعد النجاح
    } catch (error: any) {
      // عرض رسالة الخطأ التي تأتي من الباك إند إن وجدت
      const errorMessage = error.response?.data?.message || t.genericError;
      toast.error(errorMessage);
    }
  };
  const chartPath = buildChartPath(chartPoints, 220, 60);

  // فئات مساعدة لمواضع الأيقونات حسب اتجاه الصفحة
  const iconWrapperClass = isRTL
    ? 'absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors'
    : 'absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors';

  const inputPaddingClass = isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800&display=swap');
        .font-alexandria { font-family: 'Alexandria', sans-serif; }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .fade-in { opacity: 0; animation: fadeIn 0.8s ease-out forwards; }
        .fade-in-delayed { opacity: 0; animation: fadeIn 0.8s ease-out 0.3s forwards; }
        @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="flex min-h-screen font-alexandria bg-slate-50 selection:bg-blue-200 selection:text-blue-900" dir={t.dir}>

        {/* قسم نموذج تسجيل الدخول */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between px-6 sm:px-12 lg:px-20 py-10 z-10 bg-[#f8fafc] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNCkiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>

          {/* مبدل اللغة */}
          <div className={`relative z-20 flex ${isRTL ? 'justify-start' : 'justify-end'} max-w-[440px] w-full mx-auto mb-2`}>
            <button
              type="button"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-700 bg-white border border-slate-200 rounded-full px-3.5 py-1.5 shadow-sm transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.5 5.5C9 12 6 15 3 17" /></svg>
              {t.langToggleLabel}
            </button>
          </div>

          <div className={`max-w-[440px] w-full mx-auto translate-y-4 fade-in ${mounted ? '' : 'opacity-0'}`}>

            {/* الشعار المعدل المستدعى برمجياً بأعلى وضوح ونقاء */}
            <div className="flex justify-center mb-6">
              <img
                src={logoImage}
                alt="POSWAVE Logo"
                className="w-full max-w-[220px] h-auto object-contain mix-blend-multiply contrast-125 scale-105 transition-transform duration-500 hover:scale-110"
              />
            </div>

            {/* مؤشر الخطوات */}
            <div className="flex justify-center items-center gap-2 mb-6">
              <div className="h-1.5 w-8 bg-gradient-to-r from-blue-700 to-blue-500 rounded-full"></div>
              <div className="h-1.5 w-8 bg-slate-200 rounded-full"></div>
              <div className="h-1.5 w-8 bg-slate-200 rounded-full"></div>
            </div>

            {/* بطاقة النموذج */}
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10">
              <div className="mb-8 text-center">
                <h2 className="text-[26px] font-bold text-[#0b1c3c] mb-2 leading-tight">{t.title}</h2>
                <p className="text-sm text-slate-500 font-medium">{t.subtitle}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{t.usernameLabel}</label>
                  <div className="relative group">
                    <div className={iconWrapperClass}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <input
                      type="text"
                      {...register('username')}
                      className={`w-full ${inputPaddingClass} py-3.5 rounded-xl border bg-slate-50/50 hover:bg-slate-50 transition-all duration-300 text-left ${
                        errors.username ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                      } outline-none text-slate-800 text-sm`}
                      placeholder={t.usernamePlaceholder}
                      dir="ltr"
                    />
                  </div>
                  {errors.username && <span className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1">⚠ {errors.username.message as string}</span>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{t.passwordLabel}</label>
                  <div className="relative group">
                    <div className={iconWrapperClass}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <input
                      type="password"
                      {...register('password')}
                      className={`w-full ${inputPaddingClass} py-3.5 rounded-xl border bg-slate-50/50 hover:bg-slate-50 transition-all duration-300 text-left ${
                        errors.password ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                      } outline-none text-slate-800`}
                      placeholder="••••••••"
                      dir="ltr"
                    />
                  </div>
                  {errors.password && <span className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1">⚠ {errors.password.message as string}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-[15px] py-4 rounded-xl shadow-[0_8px_20px_rgb(11,28,60,0.2)] hover:shadow-[0_12px_25px_rgb(11,28,60,0.3)] transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:transform-none disabled:shadow-none mt-4 relative overflow-hidden group"
                >
                  <span className="relative">{isSubmitting ? t.submitting : t.submit}</span>
                </button>
              </form>

              <div className="mt-8 text-center border-t border-slate-100 pt-6">
                <p className="text-sm text-slate-500">
                  {t.noAccount}{' '}
                  <Link to="/signup" className="text-blue-700 hover:text-blue-900 font-bold transition-colors underline decoration-2 decoration-blue-200 underline-offset-4 hover:decoration-blue-700">
                    {t.signupLink}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          
        </div>

        {/* القسم الآخر - لوحة الهوية البصرية بخلفية العلامة المائية */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#050f24] via-[#0b1c3c] to-[#042e61] items-center justify-center p-12">

          {/* نمط العلامة المائية المتكررة POSWAVE */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDcpIiBzdHJva2Utd2lkdGg9IjEuNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KPHBhdGggZD0iTTM1IDQyIEw0MSAzMiBMNDcgNDAgTDU1IDI0IEw2MiAzNCIvPgo8L2c+Cjx0ZXh0IHg9IjQ5IiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAuNSIgZm9udC13ZWlnaHQ9IjcwMCIgbGV0dGVyLXNwYWNpbmc9IjEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiPlBPU1dBVkU8L3RleHQ+Cjwvc3ZnPgo=')",
              backgroundRepeat: 'repeat',
              backgroundSize: '150px 150px',
              maskImage: 'radial-gradient(ellipse 60% 55% at center, transparent 45%, black 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse 60% 55% at center, transparent 45%, black 85%)',
            }}
          ></div>

          <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px]"></div>
          <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] bg-cyan-400/10 rounded-full mix-blend-screen filter blur-[80px]"></div>

          <div className="relative z-10 w-full max-w-xl fade-in-delayed">

            {/* معاينة لوحة تحكم "Command Center" */}
            <div className="relative animate-float">
              <div className="bg-white rounded-[1.75rem] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-white/10">

                {/* شريط رأس اللوحة */}
                <div className="h-14 px-5 flex items-center justify-between border-b border-slate-100 bg-white">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b1c3c] text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h2v16H3V4zm4 0h1v16H7V4zm3 0h2v16h-2V4zm4 0h1v16h-1V4zm3 0h2v16h-2V4z"/></svg>
                    </div>
                    <span className="text-sm font-bold text-slate-800">Command Center</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-[0.15em] text-slate-400">{t.badge}</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                  </div>
                </div>

                <div className="grid grid-cols-[1.5fr_1fr] gap-4 p-5">

                  {/* بطاقة أداء المبيعات */}
                  <div className="rounded-[1.25rem] bg-white border border-slate-100 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-slate-700">{t.salesPerformance}</p>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5">{t.total}</span>
                    </div>
                    <svg viewBox="0 0 220 60" className="w-full h-16" preserveAspectRatio="none">
                      <path d={chartPath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex justify-between mt-1 text-[9px] text-slate-400">
                      {t.chartLabels.map((d) => (
                        <span key={d}>{d.slice(0, 3)}</span>
                      ))}
                    </div>
                  </div>

                  {/* بطاقتا إحصائيات سريعة */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[1.25rem] bg-[#0b1c3c] p-3 text-white shadow-sm flex flex-col justify-between">
                      <p className="text-[10px] uppercase text-slate-300 mb-2">{t.products}</p>
                      <p className="text-xl font-bold">42</p>
                    </div>
                    <div className="rounded-[1.25rem] bg-[#0b1c3c] p-3 text-white shadow-sm flex flex-col justify-between">
                      <p className="text-[10px] uppercase text-slate-300 mb-2">{t.cashiers}</p>
                      <p className="text-xl font-bold">124</p>
                    </div>
                  </div>

                  {/* بطاقة إجمالي المبيعات */}
                  <div className="col-span-2 rounded-[1.25rem] bg-gradient-to-l from-blue-700 to-blue-600 p-4 text-white shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-blue-100">{t.totalSales}</p>
                      <p className="text-2xl font-bold">78,000 <span className="text-sm font-semibold text-blue-100">{t.currency}</span></p>
                    </div>
                    <div className="rounded-2xl bg-white/15 p-2.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                    </div>
                  </div>

                  {/* زر الدفع وقائمة طلبات اليوم */}
                  <button type="button" className="col-span-2 rounded-[1.25rem] bg-slate-900 hover:bg-slate-800 transition-colors py-3 text-sm font-semibold text-white shadow-sm">
                    {t.payNow}
                  </button>

                  <div className="col-span-2 rounded-[1.25rem] bg-white border border-slate-100 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-slate-700">{t.todayOrders}</p>
                      <span className="text-[10px] text-slate-400">12 {t.itemsCount}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{t.sampleProduct}</p>
                        <p className="text-[10px] text-slate-400">x1</p>
                      </div>
                      <span className="text-xs font-bold text-blue-700">18 {t.currency}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-white mt-12">
              <h3 className="text-3xl font-bold mb-4 leading-snug">{t.heroTitleLine1} <br/><span className="text-blue-400">{t.heroTitleLine2}</span></h3>
              <p className="text-slate-300 text-sm max-w-[350px] mx-auto leading-relaxed">
                {t.heroSubtitle}
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Login;