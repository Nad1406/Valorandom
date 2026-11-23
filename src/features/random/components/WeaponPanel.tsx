import React, { useMemo, useState } from 'react';
import { WeaponCard } from '@/components/cards/WeaponCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { localize, weapons } from '@/data';
import { filterWeapons, type WeaponFilter } from '@/features/random/filters';
import { useRandomizer } from '@/features/random/useRandomizer';
import { PoolSelector, type PoolItem } from '@/features/single';
import { TacticalRollOverlay } from '@/features/single/TacticalRollOverlay';
import { playUiClick } from '@/lib/audio/tacticalSound';
import { useI18n } from '@/lib/i18n';
import type { Weapon, WeaponCategory } from '@/types/valorant';
import { WeaponFilterCard } from './WeaponFilterCard';

export const WeaponPanel: React.FC = () => {
  const { t, lang } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<WeaponCategory | 'all'>('all');
  const [costMax, setCostMax] = useState<number | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(weapons.map((w) => w.id)),
  );

  const filter: WeaponFilter = useMemo(
    () => ({ category: selectedCategory, costMax, selectedIds }),
    [selectedCategory, costMax, selectedIds],
  );
  const pool = useMemo(() => filterWeapons(weapons, filter), [filter]);

  const { result, isAnimating, rollingItem, randomize } = useRandomizer<Weapon>({
    onAnnounce: (weapon) =>
      t('a11y.resultAnnounce', { name: localize(weapon.displayName, lang) }),
  });

  const isPoolEmpty = pool.length === 0;
  const selectAll = () => {
    playUiClick();
    setSelectedIds(new Set(weapons.map((w) => w.id)));
  };
  const deselectAll = () => {
    playUiClick();
    setSelectedIds(new Set());
  };
  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const poolItems: PoolItem[] = useMemo(
    () =>
      weapons.map((weapon) => ({
        id: weapon.id,
        name: localize(weapon.displayName, lang),
        icon: weapon.displayIcon,
        subtitle: `${weapon.cost} creds`,
      })),
    [lang],
  );

  const displayedWeapon = rollingItem ?? result ?? (pool.length > 0 ? pool[0] : null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 flex flex-col items-center justify-center gap-6">
        <div className="relative w-full max-w-lg min-h-[460px] flex items-center justify-center">
          {isPoolEmpty ? (
            <Card className="w-full p-8 border-white/12 bg-bg-elevated/95">
              <EmptyState
                title={t('common.empty')}
                message={selectedIds.size === 0 ? t('single.pool.emptyHint') : t('single.empty.hint')}
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={
                      selectedIds.size === 0
                        ? selectAll
                        : () => {
                            playUiClick();
                            setSelectedCategory('all');
                            setCostMax(undefined);
                          }
                    }
                  >
                    {selectedIds.size === 0 ? t('single.pool.selectAll') : t('common.clearFilter')}
                  </Button>
                }
              />
            </Card>
          ) : displayedWeapon ? (
            <div
              className={`w-full transition-all duration-200 motion-reduce:transition-none ${
                isAnimating ? 'opacity-35 scale-[0.98]' : 'opacity-100 scale-100 animate-fade-up motion-reduce:animate-none'
              }`}
            >
              <WeaponCard weapon={displayedWeapon} highlight={Boolean(result)} />
            </div>
          ) : null}

          <TacticalRollOverlay
            isRolling={isAnimating}
            currentItemName={rollingItem ? localize(rollingItem.displayName, lang) : undefined}
          />
        </div>

        <button
          type="button"
          disabled={isPoolEmpty || isAnimating}
          onClick={() => randomize(pool)}
          className="val-btn-match w-full max-w-md text-base sm:text-lg clip-tactical"
        >
          {isAnimating ? t('single.scanning') : result ? t('common.reroll') : t('common.random')}
        </button>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-5">
        <WeaponFilterCard
          selectedCategory={selectedCategory}
          costMax={costMax}
          poolCount={pool.length}
          onSelectCategory={setSelectedCategory}
          onSelectCostMax={setCostMax}
        />

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
