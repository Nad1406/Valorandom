import React, { createContext, useCallback, useContext, useState } from 'react';

interface LiveRegionContextValue {
  announce: (message: string) => void;
}

const LiveRegionContext = createContext<LiveRegionContextValue | null>(null);

export const LiveRegionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState<string>('');

  const announce = useCallback((msg: string) => {
    setMessage('');
    // Trigger re-render to ensure screen readers pick up duplicate text
    setTimeout(() => setMessage(msg), 50);
  }, []);

  return (
    <LiveRegionContext.Provider value={{ announce }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-testid="live-region"
      >
        {message}
      </div>
    </LiveRegionContext.Provider>
  );
};

export function useAnnounce(): (message: string) => void {
  const ctx = useContext(LiveRegionContext);
  if (!ctx) {
    return () => {};
  }
  return ctx.announce;
}
