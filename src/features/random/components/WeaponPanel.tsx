import React, { useMemo, useState } from 'react';
import { WeaponCard } from '@/components/cards/WeaponCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { localize, weapons } from '@/data';
import { filterWeapons, type WeaponFilter } from '@/features/random/filters';
import { useRandomizer } from '@/features/random/useRandomizer';
import { PoolSelector, type PoolItem } from '@/features/single';
import { useI18n } from '@/lib/i18n';
import type { Weapon, WeaponCategory } from '@/types/valorant';
import { WEAPON_CATEGORIES } from '@/types/valorant';

const COST_PRESETS = [
  { label: 'any', max: undefined },
  { label: '≤ 1000', max: 1000 },
  { label: '≤ 2000', max: 2000 },
  { label: '≤ 3000', max: 3000 },
];

export const WeaponPanel: React.FC = () => {
  const { t, lang } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<WeaponCategory | 'all'>('all');
  const [costMax, setCostMax] = useState<number | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(weapons.map((w) => w.id)),
  );

  const filter: WeaponFilter = useMemo(
    () => ({
      category: selectedCategory,
      costMax,
      selectedIds,
    }),
    [selectedCategory, costMax, selectedIds],
  );

  const pool = useMemo(() => filterWeapons(weapons, filter), [filter]);

  const { result, isAnimating, randomize } = useRandomizer<Weapon>({
    onAnnounce: (weapon) =>
      t('a11y.resultAnnounce', { name: localize(weapon.displayName, lang) }),
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

  const selectAll = () => setSelectedIds(new Set(weapons.map((w) => w.id)));
  const deselectAll = () => setSelectedIds(new Set());

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

  const resetFilters = () => {
    setSelectedCategory('all');
    setCostMax(undefined);
    selectAll();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col gap-4 lg:col-span-1 bg-surface-hi">
          <div>
            <h2 className="font-display font-bold text-lg uppercase tracking-wider text-ink">
              {t('single.weapon.title')}
            </h2>
            <p className="text-sm text-ink-muted mt-1">{t('single.weapon.desc')}</p>
          </div>

          {/* Category selector */}
          <div className="flex flex-col gap-2 pt-1">
            <label className="text-xs font-display tracking-wider uppercase text-ink-muted">
              {t('single.filter.category')}
            </label>
            <div className="flex flex-wrap gap-1.5" role="group">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 text-xs font-display rounded-md border transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-ink text-bg-base border-ink font-bold'
                    : 'bg-surface text-ink-muted border-line hover:border-ink-muted'
                }`}
              >
                {t('common.all')}
              </button>
              {WEAPON_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-xs font-display uppercase rounded-md border transition-all ${
                    selectedCategory === cat
                      ? 'bg-val-red text-white border-val-red font-bold shadow-glow'
                      : 'bg-surface text-ink-muted border-line hover:border-ink-muted'
                  }`}
                >
                  {t(`weapon.category.${cat}` as const)}
                </button>
              ))}
            </div>
          </div>

          {/* Cost Max presets */}
          <div className="flex flex-col gap-2 pt-1">
            <label className="text-xs font-display tracking-wider uppercase text-ink-muted">
              {t('single.filter.cost')}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COST_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setCostMax(preset.max)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-all ${
                    costMax === preset.max
                      ? 'bg-val-teal text-bg-base border-val-teal font-bold shadow-glow-teal'
                      : 'bg-surface text-ink-muted border-line hover:border-ink-muted'
                  }`}
                >
                  {preset.max === undefined ? t('single.filter.anyCost') : preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-ink-muted pt-3 border-t border-line">
            <span>{t('single.filter.poolCount', { count: pool.length })}</span>
            <Badge variant="default">
              {selectedCategory === 'all' ? t('common.all') : selectedCategory}
            </Badge>
          </div>

          <div className="mt-auto pt-4">
            <Button
              variant="primary"
              size="lg"
              loading={isAnimating}
              disabled={isPoolEmpty}
              onClick={() => randomize(pool)}
              className="w-full"
            >
              {result ? t('common.reroll') : t('common.random')}
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2 flex items-center justify-center min-h-[340px]">
          {isPoolEmpty ? (
            <EmptyState
              title={t('common.empty')}
              message={
                selectedIds.size === 0
                  ? t('single.pool.emptyHint')
                  : t('single.empty.hint')
              }
              action={
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  {selectedIds.size === 0 ? t('single.pool.selectAll') : t('common.clearFilter')}
                </Button>
              }
            />
          ) : result ? (
            <div
              className={`w-full max-w-md transition-all duration-300 ${
                isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100 animate-fade-up'
              }`}
            >
              <WeaponCard weapon={result} highlight />
            </div>
          ) : (
            <div className="w-full max-w-md opacity-40 hover:opacity-75 transition-opacity">
              <WeaponCard weapon={pool[0]!} />
            </div>
          )}
        </div>
      </div>

      <PoolSelector
        items={poolItems}
        selectedIds={selectedIds}
        onToggleItem={toggleItem}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
      />
    </div>
  );
};
