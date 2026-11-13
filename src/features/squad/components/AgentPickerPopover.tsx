import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { agents, localize } from '@/data';
import { useI18n, type TranslationKey } from '@/lib/i18n';
import type { SquadRole } from '@/types/squad';
import type { Agent } from '@/types/valorant';

interface AgentPickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (agentId: string) => void;
  slotRole: SquadRole;
  lockedAgentIds: readonly string[];
  currentLockedAgentId?: string;
}

export const AgentPickerPopover: React.FC<AgentPickerPopoverProps> = ({
  isOpen,
  onClose,
  onSelect,
  slotRole,
  lockedAgentIds,
  currentLockedAgentId,
}) => {
  const { lang, t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');

  const otherLockedSet = useMemo(() => {
    return new Set(lockedAgentIds.filter((id) => id !== currentLockedAgentId));
  }, [lockedAgentIds, currentLockedAgentId]);

  const candidateAgents = useMemo(() => {
    return agents.filter((agent) => {
      if (slotRole !== 'flex' && agent.role !== slotRole) {
        return false;
      }
      if (otherLockedSet.has(agent.id)) {
        return false;
      }
      if (!searchTerm.trim()) {
        return true;
      }
      const term = searchTerm.toLowerCase();
      const viName = localize(agent.displayName, 'vi').toLowerCase();
      const enName = localize(agent.displayName, 'en').toLowerCase();
      return viName.includes(term) || enName.includes(term);
    });
  }, [slotRole, otherLockedSet, searchTerm]);

  if (!isOpen) return null;

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('squad.pickAgent')}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl border border-val-border bg-val-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader slotRole={slotRole} onClose={onClose} />
        <div className="p-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('squad.searchAgent')}
            autoFocus
            className="w-full rounded-lg border border-val-border bg-val-bg px-3 py-2 text-sm text-val-text placeholder-val-muted/70 focus:border-val-red focus:outline-none focus:ring-1 focus:ring-val-red"
          />
        </div>
        <AgentPickerGrid
          agents={candidateAgents}
          currentLockedAgentId={currentLockedAgentId}
          lang={lang}
          onSelect={(id) => {
            onSelect(id);
            onClose();
          }}
        />
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
};

interface ModalHeaderProps {
  slotRole: SquadRole;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ slotRole, onClose }) => {
  const { t } = useI18n();
  const roleLabel = slotRole === 'flex' ? t('role.flex') : t(`role.${slotRole}` as TranslationKey);

  return (
    <div className="flex items-center justify-between border-b border-val-border p-4">
      <div>
        <h3 className="text-base font-bold text-val-text">{t('squad.pickAgent')}</h3>
        <p className="text-xs text-val-muted">{roleLabel}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg p-1 text-val-muted transition-colors hover:bg-val-border hover:text-val-text focus:outline-none focus:ring-1 focus:ring-val-red"
        aria-label={t('common.close')}
      >
        ✕
      </button>
    </div>
  );
};

interface AgentPickerGridProps {
  agents: Agent[];
  currentLockedAgentId?: string;
  lang: 'vi' | 'en';
  onSelect: (id: string) => void;
}

const AgentPickerGrid: React.FC<AgentPickerGridProps> = ({
  agents: candidateAgents,
  currentLockedAgentId,
  lang,
  onSelect,
}) => {
  const { t } = useI18n();

  if (candidateAgents.length === 0) {
    return <div className="py-8 text-center text-sm text-val-muted">{t('squad.noAgentFound')}</div>;
  }

  return (
    <div className="overflow-y-auto p-3">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {candidateAgents.map((agent) => (
          <AgentPickerItem
            key={agent.id}
            agent={agent}
            isSelected={agent.id === currentLockedAgentId}
            displayName={localize(agent.displayName, lang)}
            onSelect={() => onSelect(agent.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface AgentPickerItemProps {
  agent: Agent;
  isSelected: boolean;
  displayName: string;
  onSelect: () => void;
}

const AgentPickerItem: React.FC<AgentPickerItemProps> = ({
  agent,
  isSelected,
  displayName,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={displayName}
      data-testid={`pick-agent-${agent.id}`}
      className={`group flex flex-col items-center rounded-lg border p-2 text-center transition-all ${
        isSelected
          ? 'border-val-red bg-val-red/10'
          : 'border-val-border bg-val-bg hover:border-val-text/40 hover:bg-val-border/40'
      }`}
    >
      <img
        src={agent.displayIcon}
        alt={displayName}
        loading="lazy"
        className="h-12 w-12 rounded object-cover transition-transform group-hover:scale-105"
      />
      <span className="mt-1.5 truncate text-xs font-medium text-val-text">
        {displayName}
      </span>
    </button>
  );
};
