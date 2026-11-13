import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { localize } from '@/data';
import { useI18n } from '@/lib/i18n';
import type { GameMap } from '@/types/valorant';

export interface MapCardProps {
  map: GameMap;
  highlight?: boolean;
  className?: string;
}

export const MapCard: React.FC<MapCardProps> = ({
  map,
  highlight = false,
  className = '',
}) => {
  const { lang, t } = useI18n();
  const [imgError, setImgError] = useState(false);

  const displayName = localize(map.displayName, lang);
  const imageSrc = !imgError && map.splash ? map.splash : map.listViewIcon;

  return (
    <Card
      variant={highlight ? 'interactive' : 'elevated'}
      className={`relative overflow-hidden flex flex-col p-5 transition-all duration-300 clip-corner-tl border-white/15 bg-[#0F1923]/90 ${
        highlight ? 'border-val-red ring-1 ring-val-red shadow-glow' : ''
      } ${className}`}
      data-testid="map-card"
    >
      {/* Huge Background Watermark Name */}
      <div
        aria-hidden="true"
        data-watermark={displayName}
        className="val-watermark pointer-events-none absolute -right-4 -top-8 select-none font-display text-8xl sm:text-9xl font-black uppercase text-white/[0.04] leading-none"
      />

      <div className="flex items-center justify-between z-10">
        <Badge variant={map.active ? 'accent' : 'muted'}>
          {map.active ? t('stats.active') : t('stats.inactive')}
        </Badge>
        {map.coordinates && (
          <span className="font-mono text-xs text-white/50">{map.coordinates}</span>
        )}
      </div>

      <div className="relative my-4 h-56 sm:h-64 w-full overflow-hidden rounded-xl bg-bg-base/60">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={displayName}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-ink-muted font-display text-lg">
            {displayName}
          </div>
        )}
      </div>

      <div className="z-10 mt-auto">
        <h3 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-val-offwhite uppercase">
          {displayName}
        </h3>

        {map.sites.length > 0 && (
          <div className="mt-3 flex items-center gap-2 pt-3 border-t border-white/10">
            <span className="text-xs font-tactical tracking-wider text-white/50 mr-1 uppercase">
              {t('stats.sites', { sites: '' }).replace(/:\s*$/, '')}:
            </span>
            {map.sites.map((site) => (
              <span
                key={site}
                className="w-6 h-6 rounded bg-[#18222D] border border-white/15 text-xs font-tactical font-bold text-val-teal flex items-center justify-center shadow-sm"
              >
                {site}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
