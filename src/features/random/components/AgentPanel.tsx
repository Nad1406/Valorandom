import React, { useMemo, useState } from 'react';
import { AgentCard } from '@/components/cards/AgentCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { agents, localize } from '@/data';
import { filterAgents, type AgentFilter } from '@/features/random/filters';
import { useRandomizer } from '@/features/random/useRandomizer';
import { PoolSelector, type PoolItem } from '@/features/single';
import { useI18n } from '@/lib/i18n';
import type { Agent, Role } from '@/types/valorant';
import { ROLES } from '@/types/valorant';

export const AgentPanel: React.FC = () => {
  const { t, lang } = useI18n();
  const [selectedRole, setSelectedRole] = useState<Role | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(agents.map((a) => a.id)),
  );

  const filter: AgentFilter = useMemo(
    () => ({ role: selectedRole, selectedIds }),
    [selectedRole, selectedIds],
  );

  const pool = useMemo(() => filterAgents(agents, filter), [filter]);

  const { result, isAnimating, randomize } = useRandomizer<Agent>({
    onAnnounce: (agent) =>
      t('a11y.resultAnnounce', { name: localize(agent.displayName, lang) }),
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

  const selectAll = () => setSelectedIds(new Set(agents.map((a) => a.id)));
  const deselectAll = () => setSelectedIds(new Set());

  const poolItems: PoolItem[] = useMemo(
    () =>
      agents.map((agent) => ({
        id: agent.id,
        name: localize(agent.displayName, lang),
        icon: agent.displayIcon,
        subtitle: localize(agent.roleName, lang),
      })),
    [lang],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col gap-4 lg:col-span-1 bg-surface-hi">
          <div>
            <h2 className="font-display font-bold text-lg uppercase tracking-wider text-ink">
              {t('single.agent.title')}
            </h2>
            <p className="text-sm text-ink-muted mt-1">{t('single.agent.desc')}</p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <label className="text-xs font-display tracking-wider uppercase text-ink-muted">
              {t('single.filter.role')}
            </label>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('single.filter.role')}>
              <button
                type="button"
                onClick={() => setSelectedRole('all')}
                className={`px-3 py-1.5 text-xs font-display rounded-md border transition-all ${
                  selectedRole === 'all'
                    ? 'bg-ink text-bg-base border-ink font-bold'
                    : 'bg-surface text-ink-muted border-line hover:border-ink-muted'
                }`}
              >
                {t('common.all')}
              </button>
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 py-1.5 text-xs font-display uppercase rounded-md border transition-all ${
                    selectedRole === role
                      ? 'bg-val-red text-white border-val-red font-bold shadow-glow'
                      : 'bg-surface text-ink-muted border-line hover:border-ink-muted'
                  }`}
                >
                  {t(`role.${role}` as const)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-ink-muted pt-3 border-t border-line">
            <span>{t('single.filter.poolCount', { count: pool.length })}</span>
            <Badge variant={selectedRole !== 'all' ? selectedRole : 'default'}>
              {selectedRole === 'all' ? t('common.all') : selectedRole}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectedIds.size === 0 ? selectAll : () => setSelectedRole('all')}
                >
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
              <AgentCard agent={result} highlight />
            </div>
          ) : (
            <div className="w-full max-w-md opacity-40 hover:opacity-75 transition-opacity">
              <AgentCard agent={pool[0]!} />
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
