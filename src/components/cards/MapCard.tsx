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
      className={`relative overflow-hidden flex flex-col p-4 transition-all duration-300 ${highlight ? 'border-val-red ring-1 ring-val-red shadow-glow' : ''} ${className}`}
      data-testid="map-card"
    >
      <div className="flex items-center justify-between z-10">
        <Badge variant={map.active ? 'accent' : 'muted'}>
          {map.active ? t('stats.active') : t('stats.inactive')}
        </Badge>
        {map.coordinates && (
          <span className="text-xs font-mono text-ink-muted">{map.coordinates}</span>
        )}
      </div>

      <div className="relative my-3 h-48 w-full overflow-hidden rounded-lg bg-bg-base/60">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={displayName}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-ink-muted font-display text-sm">
            {displayName}
          </div>
        )}
      </div>

      <div className="z-10 mt-auto">
        <h3 className="font-display text-2xl font-bold tracking-wider text-ink uppercase">
          {displayName}
        </h3>

        {map.sites.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-line/60">
            <span className="text-xs text-ink-muted mr-1">
              {t('stats.sites', { sites: '' }).replace(/:\s*$/, '')}:
            </span>
            {map.sites.map((site) => (
              <span
                key={site}
                className="w-5 h-5 rounded bg-surface border border-line text-[11px] font-bold font-display text-val-teal flex items-center justify-center"
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
