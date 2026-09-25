export default function Logo({ variant = 'full', size = 'default', className = '', animated = false }) {
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
    <div className={`relative shrink-0 group ${iconSizes[size] || iconSizes.default}`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
      >
        {/* Deep Burgundy Base Squircle */}
        <rect width="48" height="48" rx="14" fill="#581c2e" />
        
        {/* Subtle Cream Accent Border inside container */}
        <rect
          x="1.5"
          y="1.5"
          width="45"
          height="45"
          rx="12.5"
          stroke="#fdfbf7"
          strokeOpacity="0.18"
          strokeWidth="1.5"
        />

        {/* Dynamic Continuous Swap Cycle (Interlocking 'C' & 'S' Exchange Ribbon) */}
        {/* Upper Arc in Pure Warm Cream */}
        <path
          d="M14 22C14 16.477 18.477 12 24 12C29.523 12 34 16.477 34 22"
          stroke="#fdfbf7"
          strokeWidth="3.6"
          strokeLinecap="round"
          className="transition-all duration-500 group-hover:stroke-[#faf6f0]"
        />
        {/* Forward Exchange Arrow Tip (Cream) */}
        <path
          d="M30 19L34.5 22.5L30 26"
          stroke="#fdfbf7"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Lower Arc in Soft Cream / Ivory */}
        <path
          d="M34 26C34 31.523 29.523 36 24 36C18.477 36 14 31.523 14 26"
          stroke="#f4eee5"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />
        {/* Return Exchange Arrow Tip (Soft Cream) */}
        <path
          d="M18 29L13.5 25.5L18 22"
          stroke="#f4eee5"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.9"
        />

        {/* Central Core Connection Node in Pure Cream */}
        <circle cx="24" cy="24" r="3" fill="#fdfbf7" />
        <circle cx="24" cy="24" r="1.5" fill="#581c2e" />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}><IconSVG /></div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <IconSVG />
      <span className={`font-black tracking-tight font-serif text-stone-900 ${textSizes[size] || textSizes.default}`}>
        Campus<span className="text-[#581c2e] font-sans font-extrabold ml-0.5">Swap</span>
      </span>
    </div>
  );
}
