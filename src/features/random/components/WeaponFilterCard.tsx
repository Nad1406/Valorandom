import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { playUiClick } from '@/lib/audio/tacticalSound';
import { useI18n } from '@/lib/i18n';
import type { WeaponCategory } from '@/types/valorant';
import { WEAPON_CATEGORIES } from '@/types/valorant';

const COST_PRESETS = [
  { label: 'any', max: undefined },
  { label: '≤ 1000', max: 1000 },
  { label: '≤ 2000', max: 2000 },
  { label: '≤ 3000', max: 3000 },
] as const;

interface WeaponFilterCardProps {
  selectedCategory: WeaponCategory | 'all';
  costMax: number | undefined;
  poolCount: number;
  onSelectCategory: (category: WeaponCategory | 'all') => void;
  onSelectCostMax: (max: number | undefined) => void;
}

export const WeaponFilterCard: React.FC<WeaponFilterCardProps> = ({
  selectedCategory,
  costMax,
  poolCount,
  onSelectCategory,
  onSelectCostMax,
}) => {
  const { t } = useI18n();

  return (
    <Card className="p-5 flex flex-col gap-4 border-white/12 bg-bg-elevated/95 clip-corner-tl">
      <div>
        <h2 className="font-display font-black text-2xl uppercase tracking-wider text-val-offwhite leading-none">
          {t('single.weapon.title')}
        </h2>
        <p className="text-xs text-ink-muted mt-1.5 font-sans">{t('single.weapon.desc')}</p>
      </div>

      <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
        <span className="text-xs font-tactical font-bold tracking-widest uppercase text-ink-muted">
          {t('single.filter.category')}
        </span>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('single.filter.category')}>
          <button
            type="button"
            aria-pressed={selectedCategory === 'all'}
            onClick={() => {
              playUiClick();
              onSelectCategory('all');
            }}
            className={`px-2.5 py-1 text-xs font-tactical font-bold tracking-widest uppercase rounded-sm border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red ${
              selectedCategory === 'all'
                ? 'bg-val-offwhite text-bg-base border-val-offwhite'
                : 'bg-bg-base/70 text-ink-muted border-white/12 hover:text-val-offwhite hover:border-white/30'
            }`}
          >
            {t('common.all')}
          </button>
          {WEAPON_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={selectedCategory === cat}
              onClick={() => {
                playUiClick();
                onSelectCategory(cat);
              }}
              className={`px-2.5 py-1 text-xs font-tactical font-bold tracking-widest uppercase rounded-sm border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red ${
                selectedCategory === cat
                  ? 'bg-val-red text-white border-val-red shadow-glow'
                  : 'bg-bg-base/70 text-ink-muted border-white/12 hover:text-val-offwhite hover:border-white/30'
              }`}
            >
              {t(`weapon.category.${cat}` as const)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
        <span className="text-xs font-tactical font-bold tracking-widest uppercase text-ink-muted">
          {t('single.filter.cost')}
        </span>
        <div className="flex gap-1.5" role="group" aria-label={t('single.filter.cost')}>
          {COST_PRESETS.map((preset) => {
            const active = costMax === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  playUiClick();
                  onSelectCostMax(preset.max);
                }}
                className={`flex-1 px-2 py-1 text-xs font-tactical font-bold tracking-wider uppercase rounded-sm border tabular-nums transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-val-gold ${
                  active
                    ? 'bg-val-gold text-bg-base border-val-gold'
                    : 'bg-bg-base/70 text-ink-muted border-white/12 hover:text-val-offwhite hover:border-white/30'
                }`}
              >
                {preset.label === 'any' ? t('single.filter.anyCost') : preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-tactical tracking-wider text-ink-muted pt-3 border-t border-white/10 tabular-nums">
        <span>{t('single.filter.poolCount', { count: poolCount })}</span>
        <Badge variant="default">
          {selectedCategory === 'all' ? t('common.all') : selectedCategory}
        </Badge>
      </div>
    </Card>
  );
};
