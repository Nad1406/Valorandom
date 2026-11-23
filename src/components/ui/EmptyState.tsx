import React from 'react';

export interface EmptyStateProps {
  title: string;
  message?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  action,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-sm bg-bg-base/60 border border-dashed border-white/15 ${className}`}
    >
      {icon && <div className="mb-3 text-ink-muted">{icon}</div>}
      <h4 className="font-display text-2xl font-black uppercase text-ink tracking-wide">
        {title}
      </h4>
      {message && <p className="text-sm text-ink-muted mt-1.5 max-w-sm leading-relaxed">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
