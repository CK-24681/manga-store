import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showBadge = true }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div id="mangazon-logo" className="inline-flex items-center gap-1.5 select-none cursor-pointer group">
      <div className="relative flex flex-col">
        <div className="flex items-baseline font-black tracking-tight leading-none">
          <span className="text-white font-extrabold font-sans">manga</span>
          <span className="text-[#FF9900] font-black italic tracking-tighter">zon</span>
          {showBadge && (
            <span className="ml-1 text-[10px] font-bold text-gray-400 border border-gray-600 rounded px-1 py-0.2 bg-[#1A2332]">
              .jp
            </span>
          )}
        </div>
        {/* Amazon-style smile swoosh shaped like a curved Japanese Katana blade */}
        <svg
          className="w-full h-3.5 -mt-0.5 text-[#FF9900] overflow-visible transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 100 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 5 5 Q 50 20 95 6"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Katana tip arrowhead */}
          <path
            d="M 90 2 L 97 7 L 91 11 Z"
            fill="currentColor"
          />
          {/* Manga sparkle dot */}
          <circle cx="8" cy="4" r="1.5" fill="#FFF" />
        </svg>
      </div>
    </div>
  );
};
