export default function Logo({ variant = 'full', size = 'default', className = '' }) {
  // Size presets
  const iconSizes = {
    sm: 'w-6 h-6',
    default: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    default: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  const IconSVG = () => (
    <div className={`relative shrink-0 ${iconSizes[size] || iconSizes.default}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Rounded Modern Squircle Container */}
        <rect width="40" height="40" rx="11" fill="#1e1b4b" />
        
        {/* Upper Exchange Arc (Deep Indigo to Emerald Glow) */}
        <path
          d="M13 18C13 14.134 16.134 11 20 11C23.866 11 27 14.134 27 18"
          stroke="#10b981"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M25 15L28 18L31 15"
          stroke="#10b981"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Lower Return Arc (Warm Amber Accent) */}
        <path
          d="M27 22C27 25.866 23.866 29 20 29C16.134 29 13 25.866 13 22"
          stroke="#f59e0b"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M15 25L12 22L9 25"
          stroke="#f59e0b"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Intersect Node */}
        <circle cx="20" cy="20" r="2.5" fill="#ffffff" />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}><IconSVG /></div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <IconSVG />
      <span className={`font-extrabold tracking-tight font-display text-slate-900 ${textSizes[size] || textSizes.default}`}>
        Campus<span className="text-indigo-600">Swap</span>
      </span>
    </div>
  );
}
