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
import { TacticalRollOverlay } from '@/features/single/TacticalRollOverlay';
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
    () => ({ category: selectedCategory, costMax, selectedIds }),
    [selectedCategory, costMax, selectedIds],
  );

  const pool = useMemo(() => filterWeapons(weapons, filter), [filter]);

  const { result, isAnimating, rollingItem, randomize } = useRandomizer<Weapon>({
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

  const displayedWeapon = rollingItem ?? result ?? (pool.length > 0 ? pool[0] : null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Hero Showcase Stage (~60%) */}
      <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-center justify-center gap-6">
        <div className="relative w-full max-w-lg min-h-[460px] flex items-center justify-center">
          <TacticalRollOverlay
            isRolling={isAnimating}
            currentItemName={rollingItem ? localize(rollingItem.displayName, lang) : undefined}
          />

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
                    onClick={
                      selectedIds.size === 0
                        ? selectAll
                        : () => {
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
              className={`w-full transition-all duration-300 ${
                isAnimating ? 'opacity-40 scale-95' : 'opacity-100 scale-100 animate-fade-up'
              }`}
            >
              <WeaponCard weapon={displayedWeapon} highlight={Boolean(result)} />
            </div>
          ) : null}
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
              {t('single.weapon.title')}
            </h2>
            <p className="text-xs text-white/50 mt-1 font-sans">{t('single.weapon.desc')}</p>
          </div>

          {/* Category selector */}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <label className="text-xs font-tactical font-bold tracking-widest uppercase text-white/60">
              // {t('single.filter.category')}
            </label>
            <div className="flex flex-wrap gap-1.5" role="group">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 text-xs font-tactical font-bold uppercase rounded border transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-val-offwhite text-[#0F1923] border-val-offwhite'
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'
                }`}
              >
                {t('common.all')}
              </button>
              {WEAPON_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-xs font-tactical font-bold uppercase rounded border transition-all ${
                    selectedCategory === cat
                      ? 'bg-val-red text-white border-val-red shadow-glow'
                      : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'
                  }`}
                >
                  {t(`weapon.category.${cat}` as const)}
                </button>
              ))}
            </div>
          </div>

          {/* Cost filter */}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <label className="text-xs font-tactical font-bold tracking-widest uppercase text-white/60">
              // {t('single.filter.cost')}
            </label>
            <div className="flex gap-1.5">
              {COST_PRESETS.map((preset) => {
                const active = costMax === preset.max;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setCostMax(preset.max)}
                    className={`flex-1 px-2 py-1 text-xs font-tactical font-bold uppercase rounded border transition-all ${
                      active
                        ? 'bg-val-gold text-[#0F1923] border-val-gold font-bold'
                        : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {preset.label === 'any' ? t('single.filter.anyCost') : preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pool Count */}
          <div className="flex items-center justify-between text-xs font-tactical tracking-wider text-white/60 pt-2 border-t border-white/10">
            <span>{t('single.filter.poolCount', { count: pool.length })}</span>
            <Badge variant="default">
              {selectedCategory === 'all' ? t('common.all') : selectedCategory}
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
