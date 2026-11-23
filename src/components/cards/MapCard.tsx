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
  const sitesLabel = t('stats.sites', { sites: '' }).replace(/:\s*$/, '');

  return (
    <Card
      variant={highlight ? 'interactive' : 'elevated'}
      className={`relative overflow-hidden flex flex-col p-5 transition-colors duration-200 clip-corner-tl border-white/15 bg-bg-elevated/95 ${
        highlight ? 'border-val-red ring-1 ring-val-red/70 shadow-glow' : ''
      } ${className}`}
      data-testid="map-card"
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${
          map.active ? 'bg-val-teal' : 'bg-white/20'
        }`}
      />

      <div
        aria-hidden="true"
        data-watermark={displayName}
        className="val-watermark pointer-events-none absolute -right-3 -top-6 select-none font-display text-8xl sm:text-9xl font-black uppercase text-white/[0.035] leading-none"
      />

      <div className="flex items-center justify-between gap-2 z-10">
        <Badge variant={map.active ? 'accent' : 'muted'}>
          {map.active ? t('stats.active') : t('stats.inactive')}
        </Badge>
        {map.coordinates && (
          <span className="font-mono text-xs text-ink-muted tabular-nums">
            {map.coordinates}
          </span>
        )}
      </div>

      <div className="relative my-4 h-56 sm:h-64 w-full overflow-hidden rounded-sm border border-white/10 bg-bg-base/80">
        {imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt={displayName}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg-base/85 to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-ink-muted font-display text-lg">
            {displayName}
          </div>
        )}
      </div>

      <div className="z-10 mt-auto">
        <h3 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-val-offwhite uppercase leading-none">
          {displayName}
        </h3>

        {map.sites.length > 0 && (
          <div className="mt-4 flex items-center gap-2 pt-3 border-t border-white/10">
            <span className="text-xs font-tactical font-bold tracking-widest text-ink-muted mr-1 uppercase">
              {sitesLabel}:
            </span>
            {map.sites.map((site) => (
              <span
                key={site}
                className="w-7 h-7 rounded-sm bg-bg-base border border-white/20 text-xs font-tactical font-bold text-val-teal flex items-center justify-center tabular-nums"
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
