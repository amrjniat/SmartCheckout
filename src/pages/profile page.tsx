import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// تم دمج أوامر الاستيراد للأيقونات لتكون كلها في أعلى الملف
import {
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  ChevronDown,
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Package,
  TrendingUp,
  Users,
  Truck,
  FileText,
  Settings,
  UserCog,
  UserPlus,
  Database,
  Rocket,
  Mail,
  Languages,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
// أيقونات العلامات التجارية أُزيلت نهائيًا من lucide-react (v1.0+)، لذا نستخدم react-icons بدلاً منها
import { FaXTwitter, FaLinkedinIn, FaFacebookF } from "react-icons/fa6";
import type { IconType } from "react-icons";

/* ============================================================================
 * i18n — دعم اللغتين العربية (RTL) والإنجليزية (LTR)
 * كل النصوص مجمّعة هنا بحيث يسهل صيانتها أو إضافة لغة جديدة لاحقاً.
 * ========================================================================== */

type Lang = "ar" | "en";
type Dir = "rtl" | "ltr";

interface TranslationShape {
  dir: Dir;
  nav: {
    home: string;
    features: string;
    modules: string;
    howItWorks: string;
    faq: string;
    menu: string;
    switchLang: string;
  };
  auth: { login: string; register: string };
  hero: {
    badge: string;
    titleLine1: string;
    titleGradient: string;
    description: string;
    ctaStart: string;
    ctaLogin: string;
    trust1: string;
    trust2: string;
    dashboardStatus: string;
    readiness: string;
  };
  features: {
    title: string;
    titleGradient: string;
    titleSuffix: string;
    subtitle: string;
    items: { title: string; desc: string }[];
  };
  modules: {
    title: string;
    titleGradient: string;
    subtitle: string;
    items: { title: string; desc: string }[];
  };
  screenshots: {
    title: string;
    titleGradient: string;
    subtitle: string;
    items: { title: string; desc: string }[];
  };
  howItWorks: {
    title: string;
    titleGradient: string;
    titleSuffix: string;
    subtitle: string;
    steps: { title: string; desc: string }[];
  };
  faq: {
    title: string;
    titleGradient: string;
    subtitle: string;
    items: { q: string; a: string }[];
  };
  footer: {
    description: string;
    columns: { title: string; links: { label: string; href: string }[] }[];
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
    copyright: string;
    madeWith: string;
  };
}

const translations: Record<Lang, TranslationShape> = {
  ar: {
    dir: "rtl",
    nav: {
      home: "الرئيسية",
      features: "المميزات",
      modules: "الوحدات",
      howItWorks: "كيف يعمل",
      faq: "الأسئلة الشائعة",
      menu: "القائمة",
      switchLang: "English",
    },
    auth: {
      login: "تسجيل الدخول",
      register: "سجل الآن",
    },
    hero: {
      badge: "منصة سحابية متكاملة لإدارة الأعمال",
      titleLine1: "إدارة نقاط البيع والمخزون",
      titleGradient: "باحترافية وانسيابية",
      description:
        "نظام سحابي متكامل يساعد الشركات والمتاجر على إدارة المبيعات، المخزون، العملاء، الموردين، والفواتير من منصة واحدة بسرعة وأمان.",
      ctaStart: "ابدأ الآن",
      ctaLogin: "تسجيل الدخول",
      trust1: "عمليات بيع فورية",
      trust2: "أمان متقدم وصلاحيات",
      dashboardStatus: "النظام يعمل بكفاءة",
      readiness: "جاهزية",
    },
    features: {
      title: "لماذا",
      titleGradient: "POSWAVE",
      titleSuffix: "؟",
      subtitle: "كل ما تحتاجه لإدارة أعمالك في مكان واحد — بسرعة وأمان واحترافية.",
      items: [
        {
          title: "سرعة فائقة",
          desc: "تنفيذ عمليات البيع خلال ثوانٍ مع واجهة محسّنة للأداء العالي.",
        },
        {
          title: "إدارة مخزون",
          desc: "متابعة الكميات والتنبيهات التلقائية عند نفاد المنتجات.",
        },
        {
          title: "تقارير فورية",
          desc: "تقارير لحظية ورسوم بيانية تفاعلية لاتخاذ قرارات أفضل.",
        },
        {
          title: "أمان متقدم",
          desc: "صلاحيات حسب دور المستخدم وحماية كاملة لبيانات أعمالك.",
        },
      ],
    },
    modules: {
      title: "وحدات",
      titleGradient: "النظام",
      subtitle: "ثماني وحدات متكاملة تغطي كل جوانب إدارة أعمالك بكفاءة عالية.",
      items: [
        { title: "نقطة البيع", desc: "نظام بيع سريع وسهل الاستخدام" },
        { title: "إدارة المخزون", desc: "تتبع الكميات والتنبيهات" },
        { title: "إدارة العملاء", desc: "قاعدة بيانات وولاء العملاء" },
        { title: "الموردون", desc: "إدارة الموردين والطلبات" },
        { title: "الفواتير", desc: "فواتير احترافية وضرائب" },
        { title: "التقارير", desc: "تحليلات ورسوم بيانية" },
        { title: "الإعدادات", desc: "تخصيص كامل للنظام" },
        { title: "إدارة المستخدمين", desc: "صلاحيات وأدوار متعددة" },
      ],
    },
    screenshots: {
      title: "لقطات من",
      titleGradient: "النظام",
      subtitle: "واجهات مصممة بعناية لتجربة استخدام احترافية وسلسة.",
      items: [
        { title: "لوحة التحكم الرئيسية", desc: "نظرة شاملة على أداء متجرك" },
        { title: "نقطة البيع (POS)", desc: "واجهة بيع سريعة وبديهية" },
        { title: "التقارير والتحليلات", desc: "رسوم بيانية تفاعلية شاملة" },
        { title: "إدارة المخزون", desc: "تتبع المنتجات والكميات" },
      ],
    },
    howItWorks: {
      title: "كيف يعمل",
      titleGradient: "النظام",
      titleSuffix: "؟",
      subtitle: "ابدأ في ثلاث خطوات بسيطة فقط — من التسجيل إلى إدارة أعمالك.",
      steps: [
        {
          title: "أنشئ حسابك",
          desc: "سجّل في دقائق وابدأ رحلتك مع POSWAVE بدون أي تعقيد.",
        },
        {
          title: "أضف المواد والمخزون",
          desc: "أدخل منتجاتك وكمياتك واضبط إعدادات متجرك بسهولة.",
        },
        {
          title: "ابدأ البيع",
          desc: "أطلق عمليات البيع وإدارة أعمالك باحترافية كاملة.",
        },
      ],
    },
    faq: {
      title: "الأسئلة",
      titleGradient: "الشائعة",
      subtitle: "إجابات على أكثر الأسئلة التي يطرحها المستخدمون.",
      items: [
        {
          q: "ما هو POSWAVE؟",
          a: "POSWAVE هو نظام سحابي متكامل لإدارة نقاط البيع، المخزون، العملاء، الموردين، والفواتير من منصة واحدة بسرعة وأمان.",
        },
        {
          q: "هل النظام مناسب للمتاجر الصغيرة؟",
          a: "نعم، تم تصميم POSWAVE ليناسب جميع أحجام الأعمال، من المتاجر الصغيرة إلى الشركات الكبيرة، مع واجهة سهلة الاستخدام لأي مستوى.",
        },
        {
          q: "هل بياناتي آمنة؟",
          a: "بالتأكيد. نستخدم تشفيراً متقدماً وصلاحيات حسب دور المستخدم لضمان أمان بياناتك بالكامل، مع نسخ احتياطية تلقائية.",
        },
        {
          q: "هل أحتاج إلى تثبيت أي برامج؟",
          a: "لا، POSWAVE يعمل بالكامل عبر المتصفح. كل ما تحتاجه هو اتصال بالإنترنت للوصول إلى جميع ميزات النظام من أي جهاز.",
        },
        {
          q: "هل يمكنني تجربة النظام قبل الاشتراك؟",
          a: "نعم، يمكنك إنشاء حساب مجاني واستكشاف جميع الميزات قبل الالتزام بأي خطة مدفوعة.",
        },
        {
          q: "ما هي طرق الدفع المتاحة؟",
          a: "نوفر طرق دفع متعددة تشمل البطاقات الائتمانية والتحويلات البنكية، مع خطط مرنة تناسب احتياجات أعمالك.",
        },
      ],
    },
    footer: {
      description:
        "منصة سحابية متكاملة لإدارة نقاط البيع والمخزون واللوجستيات باحترافية. نظام واحد لإدارة جميع جوانب أعمالك بسرعة وأمان.",
      columns: [
        {
          title: "المنتج",
          links: [
            { label: "المميزات", href: "#features" },
            { label: "الوحدات", href: "#modules" },
            { label: "كيف يعمل", href: "#how-it-works" },
            { label: "الأسئلة الشائعة", href: "#faq" },
          ],
        },
        {
          title: "الشركة",
          links: [
            { label: "من نحن", href: "#" },
            { label: "تواصل معنا", href: "#" },
            { label: "المدونة", href: "#" },
            { label: "الوظائف", href: "#" },
          ],
        },
        {
          title: "قانوني",
          links: [
            { label: "سياسة الخصوصية", href: "#" },
            { label: "شروط الاستخدام", href: "#" },
            { label: "سياسة الاسترجاع", href: "#" },
          ],
        },
      ],
      ctaTitle: "جاهز لبدء رحلتك مع POSWAVE؟",
      ctaSubtitle: "انضم اليوم وابدأ بإدارة أعمالك باحترافية.",
      ctaButton: "ابدأ الآن مجاناً",
      copyright: "© 2026 POSWAVE. جميع الحقوق محفوظة.",
      madeWith: "صُنع باحترافية لإدارة الأعمال الحديثة.",
    },
  },
  en: {
    dir: "ltr",
    nav: {
      home: "Home",
      features: "Features",
      modules: "Modules",
      howItWorks: "How It Works",
      faq: "FAQ",
      menu: "Menu",
      switchLang: "العربية",
    },
    auth: {
      login: "Log In",
      register: "Sign Up",
    },
    hero: {
      badge: "An all-in-one cloud platform for business management",
      titleLine1: "Point of Sale & Inventory Management",
      titleGradient: "Made Professional & Effortless",
      description:
        "A complete cloud system that helps businesses and stores manage sales, inventory, customers, suppliers, and invoices from one fast, secure platform.",
      ctaStart: "Get Started",
      ctaLogin: "Log In",
      trust1: "Instant sales processing",
      trust2: "Advanced security & permissions",
      dashboardStatus: "System running smoothly",
      readiness: "Uptime",
    },
    features: {
      title: "Why",
      titleGradient: "POSWAVE",
      titleSuffix: "?",
      subtitle:
        "Everything you need to manage your business in one place — fast, secure, and professional.",
      items: [
        {
          title: "Blazing Fast",
          desc: "Complete sales transactions in seconds with a high-performance interface.",
        },
        {
          title: "Inventory Management",
          desc: "Track stock levels with automatic alerts when products run low.",
        },
        {
          title: "Real-Time Reports",
          desc: "Live reports and interactive charts for better decision-making.",
        },
        {
          title: "Advanced Security",
          desc: "Role-based permissions and complete protection for your business data.",
        },
      ],
    },
    modules: {
      title: "System",
      titleGradient: "Modules",
      subtitle:
        "Eight integrated modules covering every aspect of your business management.",
      items: [
        { title: "Point of Sale", desc: "A fast, easy-to-use sales system" },
        { title: "Inventory Management", desc: "Track quantities and get alerts" },
        { title: "Customer Management", desc: "Customer database and loyalty" },
        { title: "Suppliers", desc: "Manage suppliers and orders" },
        { title: "Invoices", desc: "Professional invoices and tax" },
        { title: "Reports", desc: "Analytics and charts" },
        { title: "Settings", desc: "Full system customization" },
        { title: "User Management", desc: "Multiple roles and permissions" },
      ],
    },
    screenshots: {
      title: "Screens from the",
      titleGradient: "System",
      subtitle: "Carefully designed interfaces for a smooth, professional experience.",
      items: [
        { title: "Main Dashboard", desc: "A complete overview of your store's performance" },
        { title: "Point of Sale (POS)", desc: "A fast, intuitive sales interface" },
        { title: "Reports & Analytics", desc: "Comprehensive interactive charts" },
        { title: "Inventory Management", desc: "Track products and quantities" },
      ],
    },
    howItWorks: {
      title: "How the",
      titleGradient: "System",
      titleSuffix: " Works",
      subtitle: "Get started in three simple steps — from sign-up to running your business.",
      steps: [
        {
          title: "Create Your Account",
          desc: "Sign up in minutes and start your POSWAVE journey hassle-free.",
        },
        {
          title: "Add Products & Inventory",
          desc: "Enter your products and quantities and easily configure your store.",
        },
        {
          title: "Start Selling",
          desc: "Launch sales operations and manage your business with full professionalism.",
        },
      ],
    },
    faq: {
      title: "Frequently Asked",
      titleGradient: "Questions",
      subtitle: "Answers to the most common questions from our users.",
      items: [
        {
          q: "What is POSWAVE?",
          a: "POSWAVE is a complete cloud system for managing point of sale, inventory, customers, suppliers, and invoices from one fast, secure platform.",
        },
        {
          q: "Is the system suitable for small stores?",
          a: "Yes, POSWAVE is designed to fit businesses of all sizes, from small shops to large companies, with an easy-to-use interface for any skill level.",
        },
        {
          q: "Is my data safe?",
          a: "Absolutely. We use advanced encryption and role-based permissions to keep your data fully secure, with automatic backups.",
        },
        {
          q: "Do I need to install any software?",
          a: "No, POSWAVE runs entirely in your browser. All you need is an internet connection to access every feature from any device.",
        },
        {
          q: "Can I try the system before subscribing?",
          a: "Yes, you can create a free account and explore all the features before committing to a paid plan.",
        },
        {
          q: "What payment methods are available?",
          a: "We offer multiple payment methods including credit cards and bank transfers, with flexible plans to fit your business needs.",
        },
      ],
    },
    footer: {
      description:
        "An all-in-one cloud platform for managing point of sale, inventory, and logistics professionally. One system to run every part of your business, fast and secure.",
      columns: [
        {
          title: "Product",
          links: [
            { label: "Features", href: "#features" },
            { label: "Modules", href: "#modules" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "FAQ", href: "#faq" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About Us", href: "#" },
            { label: "Contact Us", href: "#" },
            { label: "Blog", href: "#" },
            { label: "Careers", href: "#" },
          ],
        },
        {
          title: "Legal",
          links: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Refund Policy", href: "#" },
          ],
        },
      ],
      ctaTitle: "Ready to start your journey with POSWAVE?",
      ctaSubtitle: "Join today and start managing your business professionally.",
      ctaButton: "Start Free Now",
      copyright: "© 2026 POSWAVE. All rights reserved.",
      madeWith: "Crafted professionally for modern business management.",
    },
  },
};

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslationShape;
  dir: Dir;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  const t = translations[lang];
  const dir = t.dir;

  // نحدّث اتجاه الصفحة كاملةً عند تبديل اللغة حتى تنعكس عناصر
  // المتصفح (مثل شريط التمرير) والخطوط بشكل صحيح
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

/* ============================================================================
 * Reveal — مكوّن موحّد لأنيميشن الظهور عند التمرير (framer-motion)
 * ========================================================================== */

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

function Reveal({ children, delay = 0, y = 40, className = "" }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.77, 0, 0.175, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const LOGO_URL =
  "https://media.base44.com/images/public/user_6a4cd96a06fe9602792ec9f8/f324e49c7_image.png";

/* ============================================================================
 * Navbar
 * ========================================================================== */

export function Navbar() {
  const { t, lang, setLang, dir } = useLanguage();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t.nav.home, href: "#home" },
    { label: t.nav.features, href: "#features" },
    { label: t.nav.modules, href: "#modules" },
    { label: t.nav.howItWorks, href: "#how-it-works" },
    { label: t.nav.faq, href: "#faq" },
  ];

  const toggleLang = () => setLang(lang === "ar" ? "en" : "ar");

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#home" className="flex-shrink-0">
          <img src={LOGO_URL} alt="POSWAVE" className="h-11 md:h-12 w-auto rounded-lg" />
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth Buttons + Language Switch */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-slate-300 border border-white/15 rounded-xl hover:bg-white/5 hover:border-white/25 hover:text-white transition-all"
            aria-label={t.nav.switchLang}
          >
            <Languages size={16} />
            {t.nav.switchLang}
          </button>
          <Link
            to="/login"
            className="px-5 py-2.5 text-sm font-semibold text-slate-200 border border-white/15 rounded-xl hover:bg-white/5 hover:border-white/25 transition-all"
          >
            {t.auth.login}
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/30"
          >
            {t.auth.register}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-slate-200"
          aria-label={t.nav.menu}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden mt-3 mx-4 glass-strong rounded-2xl p-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              toggleLang();
              setMobileOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <Languages size={16} />
            {t.nav.switchLang}
          </button>
          <div className="flex flex-col gap-2 pt-3 border-t border-white/10 mt-3">
            <Link
              to="/login"
              className="px-5 py-3 text-sm font-semibold text-center text-slate-200 border border-white/15 rounded-xl"
            >
              {t.auth.login}
            </Link>
            <Link
              to="/register"
              className="px-5 py-3 text-sm font-semibold text-center text-white bg-blue-500 rounded-xl"
            >
              {t.auth.register}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ============================================================================
 * Hero
 * ========================================================================== */

const HERO_IMG =
  "https://media.base44.com/images/public/6a5209cbff76cc4449fedf9f/242ce9679_generated_90644198.png";

export function Hero() {
  const { t, dir } = useLanguage();
  const ForwardArrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/0 to-slate-950" />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <Reveal className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass text-sm text-blue-300 font-medium">
              <Sparkles size={16} />
              {t.hero.badge}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              {t.hero.titleLine1}
              <br />
              <span className="text-gradient">{t.hero.titleGradient}</span>
            </h1>

            <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-xl">
              {t.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="group px-7 py-3.5 text-base font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-400 transition-all shadow-xl shadow-blue-500/30 flex items-center gap-2"
              >
                {t.hero.ctaStart}
                <ForwardArrow
                  size={20}
                  className={`transition-transform ${
                    dir === "rtl"
                      ? "group-hover:-translate-x-1"
                      : "group-hover:translate-x-1"
                  }`}
                />
              </Link>
              <Link
                to="/login"
                className="px-7 py-3.5 text-base font-semibold text-slate-200 border border-white/15 rounded-xl hover:bg-white/5 hover:border-white/25 transition-all"
              >
                {t.hero.ctaLogin}
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-blue-400" />
                {t.hero.trust1}
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                {t.hero.trust2}
              </div>
            </div>
          </Reveal>

          {/* Dashboard Image */}
          <Reveal delay={0.2} className="order-1 lg:order-2">
            <div className="relative">
              {/* Glow behind image */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-emerald-500/10 rounded-[2rem] blur-2xl" />
              <div className="relative animate-float">
                <img
                  src={HERO_IMG}
                  alt="POSWAVE Dashboard"
                  className="w-full rounded-2xl glass-strong p-2 shadow-2xl"
                />
                {/* Floating accent cards */}
                <div
                  className={`absolute -bottom-4 glass-strong rounded-xl px-4 py-3 shadow-xl ${
                    dir === "rtl" ? "-right-4" : "-left-4"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-slate-300 font-medium">
                      {t.hero.dashboardStatus}
                    </span>
                  </div>
                </div>
                <div
                  className={`absolute -top-4 glass-strong rounded-xl px-4 py-3 shadow-xl ${
                    dir === "rtl" ? "-left-4" : "-right-4"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gradient">99.9%</span>
                    <span className="text-xs text-slate-400">{t.hero.readiness}</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * Screenshots
 * ========================================================================== */

const screenshotImages = [
  "https://media.base44.com/images/public/6a5209cbff76cc4449fedf9f/242ce9679_generated_90644198.png",
  "https://media.base44.com/images/public/6a5209cbff76cc4449fedf9f/3c5f63657_generated_d448823a.png",
  "https://media.base44.com/images/public/6a5209cbff76cc4449fedf9f/e6d08d212_generated_0b28b3f2.png",
  "https://media.base44.com/images/public/6a5209cbff76cc4449fedf9f/d799b046c_generated_a1731b35.png",
];

const screenshotIcons: LucideIcon[] = [LayoutDashboard, ShoppingCart, BarChart3, Package];

export function Screenshots() {
  const { t } = useLanguage();
  const [active, setActive] = useState<number>(0);

  const screenshots = t.screenshots.items.map((item, i) => ({
    ...item,
    img: screenshotImages[i],
    icon: screenshotIcons[i],
  }));

  return (
    <section className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />

      <div className="relative max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.screenshots.title} <span className="text-gradient">{t.screenshots.titleGradient}</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t.screenshots.subtitle}</p>
        </Reveal>

        {/* Tabs */}
        <Reveal className="flex flex-wrap justify-center gap-3 mb-10">
          {screenshots.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active === i
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "glass text-slate-300 hover:bg-white/5"
              }`}
            >
              <s.icon size={18} />
              {s.title}
            </button>
          ))}
        </Reveal>

        {/* Active Screenshot */}
        <Reveal key={active}>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/15 to-emerald-500/10 rounded-[2rem] blur-2xl" />
            <div className="relative glass-strong rounded-2xl p-2 shadow-2xl">
              <img
                src={screenshots[active].img}
                alt={screenshots[active].title}
                className="w-full rounded-xl"
              />
            </div>
            <div className="text-center mt-6">
              <h3 className="text-lg font-bold">{screenshots[active].title}</h3>
              <p className="text-sm text-slate-400 mt-1">{screenshots[active].desc}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================================
 * Features
 * ========================================================================== */

const featureIcons: LucideIcon[] = [Zap, Package, TrendingUp, ShieldCheck];
const featureStyles = [
  { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  { color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  { color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  { color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
];

export function Features() {
  const { t } = useLanguage();

  const features = t.features.items.map((item, i) => ({
    ...item,
    icon: featureIcons[i],
    ...featureStyles[i],
  }));

  return (
    <section id="features" className="relative py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.features.title} <span className="text-gradient">{t.features.titleGradient}</span>
            {t.features.titleSuffix}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t.features.subtitle}</p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div className="group h-full glass rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1">
                <div
                  className={`w-14 h-14 rounded-xl ${f.bg} ${f.border} border flex items-center justify-center mb-5`}
                >
                  <f.icon size={26} className={f.color} />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * Modules
 * ========================================================================== */

const moduleIcons: LucideIcon[] = [
  ShoppingCart,
  Package,
  Users,
  Truck,
  FileText,
  BarChart3,
  Settings,
  UserCog,
];

export function Modules() {
  const { t } = useLanguage();

  const modules = t.modules.items.map((item, i) => ({
    ...item,
    icon: moduleIcons[i],
  }));

  return (
    <section id="modules" className="relative py-24 scroll-mt-24">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />

      <div className="relative max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.modules.title} <span className="text-gradient">{t.modules.titleGradient}</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t.modules.subtitle}</p>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.06}>
              <div className="group h-full glass rounded-2xl p-6 text-center hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 cursor-default">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                  <m.icon size={28} className="text-blue-400" />
                </div>
                <h3 className="font-bold mb-1">{m.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * HowItWorks
 * ========================================================================== */

const stepIcons: LucideIcon[] = [UserPlus, Database, Rocket];

export function HowItWorks() {
  const { t, dir } = useLanguage();

  const steps = t.howItWorks.steps.map((step, i) => ({
    ...step,
    number: String(i + 1),
    icon: stepIcons[i],
  }));

  return (
    <section id="how-it-works" className="relative py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.howItWorks.title} <span className="text-gradient">{t.howItWorks.titleGradient}</span>
            {t.howItWorks.titleSuffix}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t.howItWorks.subtitle}</p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line */}
          <div
            className={`hidden md:block absolute top-16 right-[16.66%] left-[16.66%] h-px bg-gradient-to-l from-blue-500/0 via-blue-500/30 to-blue-500/0 ${
              dir === "ltr" ? "bg-gradient-to-r" : ""
            }`}
          />

          {steps.map((s, i) => (
            <Reveal key={s.number} delay={i * 0.15}>
              <div className="relative text-center">
                {/* Number Circle */}
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 rounded-2xl glass-strong flex items-center justify-center relative z-10">
                    <s.icon size={32} className="text-blue-400" />
                  </div>
                  <div
                    className={`absolute -top-2 w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center z-20 shadow-lg shadow-blue-500/40 ${
                      dir === "rtl" ? "-left-2" : "-right-2"
                    }`}
                  >
                    {s.number}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * FAQ
 * ========================================================================== */

export function FAQ() {
  const { t, dir } = useLanguage();
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="faq" className="relative py-24 scroll-mt-24">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.faq.title} <span className="text-gradient">{t.faq.titleGradient}</span>
          </h2>
          <p className="text-slate-400">{t.faq.subtitle}</p>
        </Reveal>

        <div className="space-y-4">
          {t.faq.items.map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="glass rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className={`w-full flex items-center justify-between gap-4 p-5 ${
                    dir === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  <span className="font-semibold text-slate-100">{item.q}</span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-blue-400 transition-transform duration-300 ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * Footer
 * ========================================================================== */

interface Social {
  icon: LucideIcon | IconType;
  href: string;
}

const socials: Social[] = [
  { icon: FaXTwitter, href: "#" },
  { icon: FaLinkedinIn, href: "#" },
  { icon: FaFacebookF, href: "#" },
  { icon: Mail, href: "#" },
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="relative pt-20 pb-8 overflow-hidden border-t border-white/5">
      {/* Background watermark logo */}
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src={LOGO_URL} alt="POSWAVE" className="h-14 w-auto rounded-lg mb-4" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">{t.footer.description}</p>
            <div className="flex gap-3 mt-6">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-500/20 transition-all"
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {t.footer.columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-slate-200 mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="glass-strong rounded-2xl p-8 mb-8 text-center">
          <h3 className="text-2xl font-bold mb-2">{t.footer.ctaTitle}</h3>
          <p className="text-slate-400 mb-6">{t.footer.ctaSubtitle}</p>
          <Link
            to="/register"
            className="inline-block px-7 py-3 text-base font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/30"
          >
            {t.footer.ctaButton}
          </Link>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>{t.footer.copyright}</p>
          <p>{t.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================================
 * ProfilePage — المكوّن الافتراضي الذي يجمع الصفحة كاملة
 * (تمت تغطية الصفحة بالكامل بـ LanguageProvider لتفعيل التبديل بين
 * العربية والإنجليزية في كل الأقسام دفعة واحدة)
 * ========================================================================== */

export default function ProfilePage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-950 text-slate-50 font-body overflow-x-hidden">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Modules />
          <Screenshots />
          <HowItWorks />
          <FAQ />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}