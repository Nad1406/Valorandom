import React from 'react';

export interface TooltipProps {
  content: string;
  children: React.ReactElement;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, className = '' }) => {
  return (
    <div className={`relative group inline-flex ${className}`}>
      {children}
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block group-focus-within:block z-30 px-2.5 py-1 text-xs text-ink bg-surface-hi border border-line rounded shadow-lg whitespace-nowrap"
      >
        {content}
      </div>
    </div>
  );
};
