import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Volume1, Volume2, VolumeX } from 'lucide-react';
import { useSoundPreference } from '@/hooks/useSoundPreference';
import { playConfirmSignal, playUiClick } from '@/lib/audio/tacticalSound';
import { useI18n } from '@/lib/i18n';

function percentFromVolume(volume: number, enabled: boolean): number {
  if (!enabled || volume <= 0) return 0;
  const pct = (volume * 100 + 0.5) | 0;
  if (pct < 0) return 0;
  if (pct > 100) return 100;
  return pct;
}

export const VolumeControl: React.FC = () => {
  const { t } = useI18n();
  const { soundEnabled, volume, toggleSound, setVolume } = useSoundPreference();
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOpen = hovered || pinned;
  const isActive = soundEnabled && volume > 0;
  const displayPercent = percentFromVolume(volume, soundEnabled);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setPinned(false);
        setHovered(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPinned(false);
        setHovered(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const openHover = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setHovered(true);
  };

  const closeHover = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setHovered(false), 160);
  };

  const handleToggleMute = () => {
    const enabling = !isActive;
    toggleSound();
    if (enabling) playConfirmSignal();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value) / 100);
  };

  const handleSliderPreview = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (Number(e.currentTarget.value) > 0) playUiClick();
  };

  const VolumeIcon = !isActive ? VolumeX : displayPercent > 50 ? Volume2 : Volume1;
  const sliderStyle = { '--range-fill': `${displayPercent}%` } as React.CSSProperties;

  return (
    <div
      ref={rootRef}
      className="relative flex items-center"
      onPointerEnter={openHover}
      onPointerLeave={closeHover}
    >
      <div className="inline-flex items-center">
        <button
          type="button"
          onClick={handleToggleMute}
          className={`inline-flex items-center justify-center h-8 w-8 rounded-l-sm border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red ${
            isActive
              ? 'border-white/15 bg-bg-elevated text-val-offwhite hover:border-val-red/60 hover:text-val-red'
              : 'border-white/10 bg-bg-elevated/60 text-ink-muted hover:border-white/30 hover:text-val-offwhite'
          }`}
          aria-label={isActive ? t('sound.mute') : t('sound.unmute')}
          title={isActive ? t('sound.mute') : t('sound.unmute')}
        >
          <VolumeIcon className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => setPinned((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={t('sound.volume')}
          title={t('sound.volume')}
          className="inline-flex items-center justify-center h-8 w-5 rounded-r-sm border border-l-0 border-white/15 bg-bg-elevated text-ink-muted hover:text-val-offwhite hover:bg-surface-hi transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red"
        >
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-150 ${isOpen ? 'rotate-180 text-val-red' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 w-48 rounded-sm border border-white/15 bg-bg-elevated p-3 shadow-card clip-corner-tl z-50"
          role="group"
          aria-label={t('sound.volume')}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-tactical text-xs font-bold uppercase tracking-widest text-ink-muted">
              {t('sound.volume')}
            </span>
            <span className="font-mono text-xs font-bold tabular-nums text-val-teal">
              {displayPercent}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={displayPercent}
            style={sliderStyle}
            onChange={handleSliderChange}
            onPointerUp={handleSliderPreview}
            onKeyUp={handleSliderPreview}
            aria-label={t('sound.volume')}
            className="val-range w-full cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};
