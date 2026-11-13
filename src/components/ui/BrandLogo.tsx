import React from 'react';

export interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconDimensions = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  }[size];

  const textSize = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        className={`${iconDimensions} shrink-0 shadow-glow transition-transform group-hover:scale-105`}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="64" height="64" rx="10" fill="#0F1923" />
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="8"
          stroke="#ECE8E1"
          strokeOpacity="0.2"
          strokeWidth="1.5"
        />
        <line x1="32" y1="5" x2="32" y2="11" stroke="#FF4655" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="53" x2="32" y2="59" stroke="#FF4655" strokeWidth="2" strokeLinecap="round" />
        <line x1="5" y1="32" x2="11" y2="32" stroke="#FF4655" strokeWidth="2" strokeLinecap="round" />
        <line x1="53" y1="32" x2="59" y2="32" stroke="#FF4655" strokeWidth="2" strokeLinecap="round" />
        <polygon points="16,16 27,16 32,47 21,47" fill="#FF4655" />
        <polygon points="48,16 37,16 34,31 43,26" fill="#ECE8E1" />
        <circle cx="32" cy="32" r="2.2" fill="#FF4655" />
      </svg>

      {showText && (
        <span
          className={`font-display font-black tracking-widest text-val-offwhite uppercase ${textSize}`}
        >
          <span>VALO</span>
          <span className="text-val-red">RANDOM</span>
        </span>
      )}
    </div>
  );
};
