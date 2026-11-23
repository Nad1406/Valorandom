import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { playUiClick } from '@/lib/audio/tacticalSound';
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
      className="p-4 flex flex-col gap-3 bg-bg-elevated/95 border border-white/12 clip-corner-tl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/10 pb-2.5">
        <div>
          <h3 className="font-tactical font-bold text-sm uppercase tracking-widest text-val-offwhite">
            {title ?? t('single.pool.title')}
          </h3>
          <p className="font-tactical text-xs text-ink-muted tracking-wider mt-0.5 tabular-nums">
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
            className="text-xs px-2.5 py-1"
          >
            {t('single.pool.selectAll')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeselectAll}
            disabled={isNoneSelected}
            className="text-xs px-2.5 py-1 text-ink-muted hover:text-val-red"
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
              onToggle={() => {
                playUiClick();
                onToggleItem(item.id);
              }}
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
      className={`group flex items-center gap-2 p-1.5 rounded-sm border text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red ${
        isSelected
          ? 'bg-surface-hi border-val-teal/60 text-val-offwhite'
          : 'bg-bg-base/70 border-white/10 text-ink-muted opacity-60 hover:opacity-95 hover:border-white/25'
      }`}
    >
      <div className="relative shrink-0 w-7 h-7 rounded-sm bg-bg-base flex items-center justify-center overflow-hidden border border-white/12">
        {item.icon ? (
          <img
            src={item.icon}
            alt=""
            loading="lazy"
            className="w-full h-full object-contain p-0.5 transition-transform group-hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100"
          />
        ) : (
          <span className="text-[10px] text-ink-muted font-mono">
            {item.name.slice(0, 2)}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="truncate text-xs font-tactical font-bold uppercase tracking-wider leading-tight">
          {item.name}
        </div>
        {item.subtitle && (
          <div className="truncate text-[10px] text-ink-muted font-mono leading-tight mt-0.5 tabular-nums">
            {item.subtitle}
          </div>
        )}
      </div>

      <span
        aria-hidden="true"
        className={`shrink-0 w-4 h-4 rounded-sm flex items-center justify-center border transition-colors ${
          isSelected
            ? 'bg-val-teal text-bg-base border-val-teal'
            : 'border-white/25 text-transparent'
        }`}
      >
        <Check className="w-3 h-3" strokeWidth={3} />
      </span>
    </button>
  );
};
