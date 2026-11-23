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
        className={`${iconDimensions} shrink-0 drop-shadow-[0_4px_12px_rgba(255,70,85,0.28)] transition-transform duration-150 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <polygon points="10,2 62,2 62,54 54,62 2,62 2,10" fill="#0A1017" />
        <polygon
          points="10,2 62,2 62,54 54,62 2,62 2,10"
          stroke="#ECE8E1"
          strokeOpacity="0.22"
          strokeWidth="1.5"
        />
        <line x1="2" y1="15" x2="15" y2="2" stroke="#FF4655" strokeWidth="2.5" />
        <line x1="49" y1="62" x2="62" y2="49" stroke="#FF4655" strokeWidth="2.5" />
        <polygon points="13,17 24,17 31,44 22,44" fill="#FF4655" />
        <polygon points="51,17 40,17 33,36 42,36" fill="#ECE8E1" />
        <polygon points="32,39 36.5,43.5 32,48 27.5,43.5" fill="#00E5C0" />
      </svg>

      {showText && (
        <>
          <span className="h-6 w-[1px] bg-white/15 shrink-0" aria-hidden="true" />
          <div className="flex flex-col">
            <span
              className={`font-display font-black uppercase tracking-[0.12em] leading-none ${textSize}`}
            >
              <span className="text-val-offwhite">VALO</span>
              <span className="text-val-red">RANDOM</span>
            </span>
            <div className="mt-1 flex items-center gap-1" aria-hidden="true">
              <span className="h-[2px] w-6 bg-val-red" />
              <span className="h-[2px] w-2 bg-val-teal" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
