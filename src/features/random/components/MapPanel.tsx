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
import { PoolSelector, type PoolItem } from '@/features/single';
import { TacticalRollOverlay } from '@/features/single/TacticalRollOverlay';
import { useI18n } from '@/lib/i18n';
import type { GameMap } from '@/types/valorant';

export const MapPanel: React.FC = () => {
  const { t, lang } = useI18n();
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(maps.map((m) => m.id)),
  );

  const filter: MapFilter = useMemo(
    () => ({ activeOnly, selectedIds }),
    [activeOnly, selectedIds],
  );

  const pool = useMemo(() => filterMaps(maps, filter), [filter]);

  const { result, isAnimating, rollingItem, randomize } = useRandomizer<GameMap>({
    onAnnounce: (map) =>
      t('a11y.resultAnnounce', { name: localize(map.displayName, lang) }),
  });

  const isPoolEmpty = pool.length === 0;

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(maps.map((m) => m.id)));
  const deselectAll = () => setSelectedIds(new Set());

  const poolItems: PoolItem[] = useMemo(
    () =>
      maps.map((map) => ({
        id: map.id,
        name: localize(map.displayName, lang),
        icon: map.listViewIcon || map.splash,
        subtitle: map.sites.length > 0 ? `${map.sites.join('/')} Sites` : undefined,
      })),
    [lang],
  );

  const displayedMap = rollingItem ?? result ?? (pool.length > 0 ? pool[0] : null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Hero Showcase Stage (~60%) */}
      <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-center justify-center gap-6">
        <div className="relative w-full max-w-lg min-h-[460px] flex items-center justify-center">
          {isPoolEmpty ? (
            <Card className="w-full p-8 border-white/10 bg-[#0F1923]/90">
              <EmptyState
                title={t('common.empty')}
                message={
                  selectedIds.size === 0
                    ? t('single.pool.emptyHint')
                    : t('single.empty.hint')
                }
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectedIds.size === 0 ? selectAll : () => setActiveOnly(false)}
                  >
                    {selectedIds.size === 0 ? t('single.pool.selectAll') : t('common.clearFilter')}
                  </Button>
                }
              />
            </Card>
          ) : displayedMap ? (
            <div
              className={`w-full transition-all duration-300 ${
                isAnimating ? 'opacity-40 scale-95' : 'opacity-100 scale-100 animate-fade-up'
              }`}
            >
              <MapCard map={displayedMap} highlight={Boolean(result)} />
            </div>
          ) : null}

          <TacticalRollOverlay
            isRolling={isAnimating}
            currentItemName={rollingItem ? localize(rollingItem.displayName, lang) : undefined}
          />
        </div>

        {/* Tactical "FIND MATCH" Style Random Button */}
        <button
          type="button"
          disabled={isPoolEmpty || isAnimating}
          onClick={() => randomize(pool)}
          className="val-btn-match w-full max-w-md text-base sm:text-lg clip-tactical"
        >
          {isAnimating
            ? t('single.scanning')
            : result
              ? t('common.reroll')
              : t('common.random')}
        </button>
      </div>

      {/* Right: Control & Pool Sidebar (~40%) */}
      <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-5">
        <Card className="p-5 flex flex-col gap-4 border-white/10 bg-[#0F1923]/90 clip-corner-tl">
          <div>
            <h2 className="font-display font-black text-2xl uppercase tracking-wider text-val-offwhite">
              {t('single.map.title')}
            </h2>
            <p className="text-xs text-white/50 mt-1 font-sans">{t('single.map.desc')}</p>
          </div>

          <div className="py-2 border-y border-white/10">
            <Toggle
              checked={activeOnly}
              onChange={setActiveOnly}
              label={t('single.filter.activeMapsOnly')}
              id="active-maps-toggle"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-tactical tracking-wider text-white/60 pt-1">
            <span>{t('single.filter.poolCount', { count: pool.length })}</span>
            <Badge variant={activeOnly ? 'accent' : 'default'}>
              {activeOnly ? t('single.filter.activeMapsOnly') : t('single.filter.allMaps')}
            </Badge>
          </div>
        </Card>

        <PoolSelector
          items={poolItems}
          selectedIds={selectedIds}
          onToggleItem={toggleItem}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
        />
      </div>
    </div>
  );
};
