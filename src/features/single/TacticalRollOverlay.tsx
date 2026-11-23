import React from 'react';
import { useI18n } from '@/lib/i18n';

interface TacticalRollOverlayProps {
  isRolling: boolean;
  currentItemName?: string;
}

export const TacticalRollOverlay: React.FC<TacticalRollOverlayProps> = ({
  isRolling,
  currentItemName,
}) => {
  const { t } = useI18n();

  if (!isRolling) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden rounded-sm border border-val-red/70 bg-bg-elevated/92 p-6 backdrop-blur-md shadow-glow pointer-events-none clip-corner-tl"
    >
      {/* Scanline beam */}
      <div className="pointer-events-none absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-val-red to-transparent opacity-90 animate-scan motion-reduce:animate-none" />

      {/* Tactical corner brackets */}
      <div className="pointer-events-none absolute inset-3 border border-white/10">
        <span className="absolute -top-[1px] -left-[1px] h-3 w-3 border-t-2 border-l-2 border-val-red" />
        <span className="absolute -top-[1px] -right-[1px] h-3 w-3 border-t-2 border-r-2 border-val-red" />
        <span className="absolute -bottom-[1px] -left-[1px] h-3 w-3 border-b-2 border-l-2 border-val-red" />
        <span className="absolute -bottom-[1px] -right-[1px] h-3 w-3 border-b-2 border-r-2 border-val-red" />
      </div>

      <div className="flex items-center gap-2.5">
        <span className="h-2.5 w-2.5 rounded-sm bg-val-red animate-pulse motion-reduce:animate-none" />
        <span className="font-tactical text-sm sm:text-base tracking-widest text-val-red uppercase font-bold">
          {t('single.scanning')}
        </span>
      </div>

      {currentItemName && (
        <div className="mt-3 text-center">
          <p className="font-display text-5xl sm:text-6xl font-black uppercase tracking-tight text-val-offwhite leading-none">
            {currentItemName}
          </p>
        </div>
      )}

      <div className="mt-4 font-tactical text-xs font-bold tracking-widest text-ink-muted uppercase">
        {t('single.rollStatusCode')}
      </div>
    </div>
  );
};
