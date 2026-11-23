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
import { TacticalRollOverlay } from '@/features/single/TacticalRollOverlay';
import { playUiClick } from '@/lib/audio/tacticalSound';
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

  const { result, isAnimating, rollingItem, randomize } = useRandomizer<Agent>({
    onAnnounce: (agent) =>
      t('a11y.resultAnnounce', { name: localize(agent.displayName, lang) }),
  });

  const isPoolEmpty = pool.length === 0;
  const selectRole = (role: Role | 'all') => {
    playUiClick();
    setSelectedRole(role);
  };

  const selectAll = () => {
    playUiClick();
    setSelectedIds(new Set(agents.map((a) => a.id)));
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
      agents.map((agent) => ({
        id: agent.id,
        name: localize(agent.displayName, lang),
        icon: agent.displayIcon,
        subtitle: localize(agent.roleName, lang),
      })),
    [lang],
  );

  const displayedAgent = rollingItem ?? result ?? (pool.length > 0 ? pool[0] : null);

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
                    onClick={selectedIds.size === 0 ? selectAll : () => selectRole('all')}
                  >
                    {selectedIds.size === 0 ? t('single.pool.selectAll') : t('common.clearFilter')}
                  </Button>
                }
              />
            </Card>
          ) : displayedAgent ? (
            <div
              className={`w-full transition-all duration-200 motion-reduce:transition-none ${
                isAnimating ? 'opacity-35 scale-[0.98]' : 'opacity-100 scale-100 animate-fade-up motion-reduce:animate-none'
              }`}
            >
              <AgentCard agent={displayedAgent} highlight={Boolean(result)} />
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
        <Card className="p-5 flex flex-col gap-4 border-white/12 bg-bg-elevated/95 clip-corner-tl">
          <div>
            <h2 className="font-display font-black text-2xl uppercase tracking-wider text-val-offwhite leading-none">
              {t('single.agent.title')}
            </h2>
            <p className="text-xs text-ink-muted mt-1.5 font-sans">{t('single.agent.desc')}</p>
          </div>

          <div className="flex flex-col gap-2.5 pt-3 border-t border-white/10">
            <span className="text-xs font-tactical font-bold tracking-widest uppercase text-ink-muted">
              {t('single.filter.role')}
            </span>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('single.filter.role')}>
              <button
                type="button"
                aria-pressed={selectedRole === 'all'}
                onClick={() => selectRole('all')}
                className={`px-3 py-1.5 text-xs font-tactical font-bold tracking-widest uppercase rounded-sm border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red ${
                  selectedRole === 'all'
                    ? 'bg-val-offwhite text-bg-base border-val-offwhite'
                    : 'bg-bg-base/70 text-ink-muted border-white/12 hover:text-val-offwhite hover:border-white/30'
                }`}
              >
                {t('common.all')}
              </button>
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  aria-pressed={selectedRole === role}
                  onClick={() => selectRole(role)}
                  className={`px-3 py-1.5 text-xs font-tactical font-bold tracking-widest uppercase rounded-sm border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red ${
                    selectedRole === role
                      ? 'bg-val-red text-white border-val-red shadow-glow'
                      : 'bg-bg-base/70 text-ink-muted border-white/12 hover:text-val-offwhite hover:border-white/30'
                  }`}
                >
                  {t(`role.${role}` as const)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-tactical tracking-wider text-ink-muted pt-3 border-t border-white/10 tabular-nums">
            <span>{t('single.filter.poolCount', { count: pool.length })}</span>
            <Badge variant={selectedRole !== 'all' ? selectedRole : 'default'}>
              {selectedRole === 'all' ? t('common.all') : selectedRole}
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
