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
      className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-val-red/60 bg-[#0F1923]/90 p-6 backdrop-blur-md shadow-glow pointer-events-none"
    >
      {/* High-speed scanline beam */}
      <div className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-val-red to-transparent opacity-90 shadow-glow animate-scan" />

      {/* Tactical radar/target crosshairs */}
      <div className="pointer-events-none absolute inset-4 border border-white/10">
        <span className="absolute top-0 left-0 -translate-x-1 -translate-y-1 font-mono text-xs text-val-red">
          +
        </span>
        <span className="absolute top-0 right-0 translate-x-1 -translate-y-1 font-mono text-xs text-val-red">
          +
        </span>
        <span className="absolute bottom-0 left-0 -translate-x-1 translate-y-1 font-mono text-xs text-val-red">
          +
        </span>
        <span className="absolute bottom-0 right-0 translate-x-1 translate-y-1 font-mono text-xs text-val-red">
          +
        </span>
      </div>

      {/* Scanning status banner */}
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-val-red animate-ping" />
        <span className="font-tactical text-sm sm:text-base tracking-widest text-val-red uppercase font-bold animate-pulse">
          {t('single.scanning')}
        </span>
      </div>

      {/* Candidate item preview text */}
      {currentItemName && (
        <div className="mt-3 text-center">
          <p className="font-display text-4xl sm:text-6xl font-black uppercase tracking-wider text-val-offwhite transition-transform duration-75">
            {currentItemName}
          </p>
        </div>
      )}

      {/* Bottom tactical code */}
      <div className="mt-4 font-mono text-[11px] tracking-widest text-white/40 uppercase">
        // SYSTEM_LOCK // ROULETTE_ACTIVE
      </div>
    </div>
  );
};
