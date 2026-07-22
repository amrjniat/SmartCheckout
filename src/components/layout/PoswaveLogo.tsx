
import { useId } from 'react';

interface PoswaveLogoProps {
  className?: string;
  /** horizontal: للهيدر (أيقونة بجانب النص) — vertical: للسايدبار (أيقونة فوق النص) */
  layout?: 'horizontal' | 'vertical';
  /** حجم الأيقونة بالبكسل */
  iconSize?: number;
}

export default function PoswaveLogo({
  className = '',
  layout = 'horizontal',
  iconSize = 56,
}: PoswaveLogoProps) {
  // معرّفات فريدة لكل تدرج لوني لتفادي أي تعارض عند تكرار الشعار أكثر من مرة بنفس الصفحة
  const mainBlueId = useId();
  const silverSwooshId = useId();
  const wavyArrowId = useId();

  const isVertical = layout === 'vertical';

  return (
    <div
      className={`flex ${isVertical ? 'flex-col items-center text-center' : 'flex-row items-center text-right'} gap-3 cursor-pointer group ${className}`}
    >
      {/* الأيقونة: حرف P + الموجة الفضية + السهم + رموز العملات */}
      <div
        className="relative flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full object-contain drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={mainBlueId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#004e92" />
              <stop offset="50%" stopColor="#00a8e8" />
              <stop offset="100%" stopColor="#00c6ff" />
            </linearGradient>
            <linearGradient id={silverSwooshId} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7a9eb5" />
              <stop offset="50%" stopColor="#d4e4ef" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id={wavyArrowId} x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#002f6c" />
              <stop offset="60%" stopColor="#0072ce" />
              <stop offset="100%" stopColor="#33a1fd" />
            </linearGradient>
          </defs>

          <path
            d="M120 40 C155 45, 185 85, 170 130 C155 170, 110 185, 90 160 C120 155, 150 120, 140 85 C135 70, 120 50, 100 55"
            fill={`url(#${silverSwooshId})`}
            opacity="0.85"
          />
          <path
            d="M110 60 C135 65, 160 95, 150 130 C140 160, 115 170, 95 150 C115 145, 135 120, 125 95 C120 85, 110 70, 95 75"
            fill={`url(#${mainBlueId})`}
            opacity="0.9"
          />
          <path
            d="M50 40 H115 C135 40, 145 55, 145 75 C145 95, 130 110, 110 110 H75 V170 H50 V40 Z"
            fill={`url(#${mainBlueId})`}
          />
          <path d="M75 60 H110 C118 60, 122 65, 122 75 C122 85, 118 90, 110 90 H75 V60 Z" fill="#0a1931" />

          <text x="62" y="76" fill="#4fc3f7" fontSize="24" fontWeight="900">$</text>
          <text x="82" y="81" fill="#90caf9" fontSize="20" fontWeight="900">€</text>
          <text x="104" y="88" fill="#b0bec5" fontSize="19" fontWeight="900">£</text>

          <path
            d="M30 120 Q65 145, 95 100 T160 55 L145 45 L185 45 L180 85 L168 70 Q130 100, 95 125 Z"
            fill={`url(#${wavyArrowId})`}
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* النصوص */}
      <div className={`flex flex-col ${isVertical ? 'items-center -space-y-0.5 mt-1' : 'items-start -space-y-1'}`}>
        <span className="text-2xl font-black tracking-tight text-white uppercase font-sans">POSWAVE</span>
        <span className="text-[11px] text-cyan-400 font-extrabold tracking-wider uppercase font-sans">
          STORES &amp; LOGISTICS
        </span>
      </div>
    </div>
  );
}