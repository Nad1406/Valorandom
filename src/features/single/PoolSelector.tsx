import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useI18n } from '@/lib/i18n';

export interface PoolItem {
  id: string;
  name: string;
  icon: string;
  subtitle?: string;
}

export interface PoolSelectorProps {
  items: readonly PoolItem[];
  selectedIds: ReadonlySet<string>;
  onToggleItem: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  title?: string;
}

export const PoolSelector: React.FC<PoolSelectorProps> = ({
  items,
  selectedIds,
  onToggleItem,
  onSelectAll,
  onDeselectAll,
  title,
}) => {
  const { t } = useI18n();
  const selectedCount = items.filter((item) => selectedIds.has(item.id)).length;
  const isAllSelected = selectedCount === items.length;
  const isNoneSelected = selectedCount === 0;

  return (
    <Card
      data-testid="pool-selector"
      className="p-4 flex flex-col gap-3 bg-[#0F1923]/90 border border-white/10 clip-corner-tl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/10 pb-2.5">
        <div>
          <h3 className="font-tactical font-bold text-sm uppercase tracking-widest text-val-offwhite">
            // {title ?? t('single.pool.title')}
          </h3>
          <p className="font-tactical text-xs text-white/50 tracking-wider mt-0.5">
            {t('single.pool.selectedCount', {
              count: selectedCount,
              total: items.length,
            })}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSelectAll}
            disabled={isAllSelected}
            className="text-xs px-2.5 py-1 font-tactical tracking-wider uppercase"
          >
            {t('single.pool.selectAll')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeselectAll}
            disabled={isNoneSelected}
            className="text-xs px-2.5 py-1 font-tactical tracking-wider uppercase text-white/40 hover:text-val-red"
          >
            {t('single.pool.deselectAll')}
          </Button>
        </div>
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1"
        role="group"
        aria-label={title ?? t('single.pool.title')}
      >
        {items.map((item) => {
          const isSelected = selectedIds.has(item.id);
          return (
            <PoolSelectorItem
              key={item.id}
              item={item}
              isSelected={isSelected}
              onToggle={() => onToggleItem(item.id)}
            />
          );
        })}
      </div>
    </Card>
  );
};

interface PoolSelectorItemProps {
  item: PoolItem;
  isSelected: boolean;
  onToggle: () => void;
}

const PoolSelectorItem: React.FC<PoolSelectorItemProps> = ({
  item,
  isSelected,
  onToggle,
}) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      aria-label={item.name}
      onClick={onToggle}
      className={`group flex items-center gap-2 p-1.5 rounded border text-left transition-all ${
        isSelected
          ? 'bg-[#18222D] border-val-teal/60 text-val-offwhite shadow-sm'
          : 'bg-black/30 border-white/5 text-white/40 opacity-40 hover:opacity-75'
      }`}
    >
      <div className="relative shrink-0 w-7 h-7 rounded bg-[#0F1923] flex items-center justify-center overflow-hidden border border-white/10">
        {item.icon ? (
          <img
            src={item.icon}
            alt=""
            loading="lazy"
            className="w-full h-full object-contain p-0.5 transition-transform group-hover:scale-110"
          />
        ) : (
          <span className="text-[10px] text-white/40 font-mono">
            {item.name.slice(0, 2)}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="truncate text-xs font-tactical font-bold uppercase tracking-wider leading-tight">
          {item.name}
        </div>
        {item.subtitle && (
          <div className="truncate text-[10px] text-white/40 font-mono leading-tight mt-0.5">
            {item.subtitle}
          </div>
        )}
      </div>

      <span
        aria-hidden="true"
        className={`shrink-0 w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[9px] font-bold border transition-colors ${
          isSelected
            ? 'bg-val-teal text-[#0F1923] border-val-teal'
            : 'border-white/20 text-transparent'
        }`}
      >
        ✓
      </span>
    </button>
  );
};
