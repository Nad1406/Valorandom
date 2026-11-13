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
    <Card className="p-4 sm:p-5 flex flex-col gap-4 bg-surface-hi border border-line">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-line pb-3">
        <div>
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-ink">
            {title ?? t('single.pool.title')}
          </h3>
          <p className="text-xs text-ink-muted mt-0.5">
            {t('single.pool.selectedCount', {
              count: selectedCount,
              total: items.length,
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
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
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
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
      className={`group flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all ${
        isSelected
          ? 'bg-surface border-val-teal/60 text-ink shadow-sm'
          : 'bg-bg-base/40 border-line/40 text-ink-muted opacity-45 hover:opacity-75'
      }`}
    >
      <div className="relative shrink-0 w-8 h-8 rounded bg-bg-base flex items-center justify-center overflow-hidden border border-line/50">
        {item.icon ? (
          <img
            src={item.icon}
            alt=""
            loading="lazy"
            className="w-full h-full object-contain p-0.5 transition-transform group-hover:scale-110"
          />
        ) : (
          <span className="text-[10px] text-ink-muted font-mono">
            {item.name.slice(0, 2)}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="truncate text-xs font-semibold leading-tight">
          {item.name}
        </div>
        {item.subtitle && (
          <div className="truncate text-[10px] text-ink-muted font-mono leading-tight mt-0.5">
            {item.subtitle}
          </div>
        )}
      </div>

      <span
        aria-hidden="true"
        className={`shrink-0 w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold border transition-colors ${
          isSelected
            ? 'bg-val-teal text-bg-base border-val-teal'
            : 'border-line text-transparent'
        }`}
      >
        ✓
      </span>
    </button>
  );
};
