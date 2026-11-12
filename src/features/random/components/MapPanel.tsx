import React, { useMemo, useState } from 'react';
import { MapCard } from '@/components/cards/MapCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toggle } from '@/components/ui/Toggle';
import { localize, maps } from '@/data';
import { filterMaps, type MapFilter } from '@/features/random/filters';
import { useRandomizer } from '@/features/random/useRandomizer';
import { useI18n } from '@/lib/i18n';
import type { GameMap } from '@/types/valorant';

export const MapPanel: React.FC = () => {
  const { t, lang } = useI18n();
  const [activeOnly, setActiveOnly] = useState<boolean>(true);

  const filter: MapFilter = useMemo(
    () => ({ activeOnly }),
    [activeOnly],
  );

  const pool = useMemo(() => filterMaps(maps, filter), [filter]);

  const { result, isAnimating, randomize, reroll } = useRandomizer<GameMap>({
    onAnnounce: (map) =>
      t('a11y.resultAnnounce', { name: localize(map.displayName, lang) }),
  });

  const isPoolEmpty = pool.length === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-6 flex flex-col gap-4 lg:col-span-1 bg-surface-hi">
        <div>
          <h2 className="font-display font-bold text-lg uppercase tracking-wider text-ink">
            {t('single.map.title')}
          </h2>
          <p className="text-sm text-ink-muted mt-1">{t('single.map.desc')}</p>
        </div>

        <div className="pt-2">
          <Toggle
            id="active-maps-toggle"
            checked={activeOnly}
            onChange={setActiveOnly}
            label={t('single.filter.activeMapsOnly')}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-ink-muted pt-3 border-t border-line">
          <span>{t('single.filter.poolCount', { count: pool.length })}</span>
          <Badge variant={activeOnly ? 'accent' : 'muted'}>
            {activeOnly ? t('stats.active') : t('single.filter.allMaps')}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mt-auto pt-4">
          <Button
            variant="primary"
            size="lg"
            loading={isAnimating}
            disabled={isPoolEmpty}
            onClick={() => randomize(pool)}
            className="flex-1"
          >
            {result ? t('common.reroll') : t('common.random')}
          </Button>

          {result && (
            <Button
              variant="outline"
              size="lg"
              disabled={isAnimating || isPoolEmpty}
              onClick={() => reroll()}
            >
              ↻
            </Button>
          )}
        </div>
      </Card>

      <div className="lg:col-span-2 flex items-center justify-center min-h-[340px]">
        {isPoolEmpty ? (
          <EmptyState
            title={t('common.empty')}
            message={t('single.empty.hint')}
            action={
              <Button variant="outline" size="sm" onClick={() => setActiveOnly(false)}>
                {t('common.clearFilter')}
              </Button>
            }
          />
        ) : result ? (
          <div
            className={`w-full max-w-md transition-all duration-300 ${
              isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100 animate-fade-up'
            }`}
          >
            <MapCard map={result} highlight />
          </div>
        ) : (
          <div className="w-full max-w-md opacity-40 hover:opacity-75 transition-opacity">
            <MapCard map={pool[0]!} />
          </div>
        )}
      </div>
    </div>
  );
};
