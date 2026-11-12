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
      className={`flex flex-col items-center justify-center text-center p-8 rounded-xl bg-surface/50 border border-dashed border-line ${className}`}
    >
      {icon && <div className="mb-3 text-ink-muted">{icon}</div>}
      <h4 className="font-display text-base font-semibold text-ink tracking-wide">
        {title}
      </h4>
      {message && <p className="text-sm text-ink-muted mt-1 max-w-sm">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
