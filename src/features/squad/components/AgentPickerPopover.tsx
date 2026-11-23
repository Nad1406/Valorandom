import React, { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
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

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const otherLockedSet = useMemo(() => {
    return new Set(lockedAgentIds.filter((id) => id !== currentLockedAgentId));
  }, [lockedAgentIds, currentLockedAgentId]);

  const candidateAgents = useMemo(() => {
    return agents.filter((agent) => {
      if (slotRole !== 'flex' && agent.role !== slotRole) return false;
      if (otherLockedSet.has(agent.id)) return false;
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        localize(agent.displayName, 'vi').toLowerCase().includes(term) ||
        localize(agent.displayName, 'en').toLowerCase().includes(term)
      );
    });
  }, [slotRole, otherLockedSet, searchTerm]);

  if (!isOpen) return null;

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('squad.pickAgent')}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#05080D]/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-sm border border-white/20 bg-bg-elevated shadow-card clip-corner-tl"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader slotRole={slotRole} onClose={onClose} />
        <div className="border-b border-white/10 p-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('squad.searchAgent')}
              autoFocus
              className="w-full rounded-sm border border-white/15 bg-bg-base py-2 pl-9 pr-3 font-sans text-sm text-val-offwhite placeholder-ink-muted focus:border-val-red focus:outline-none focus:ring-1 focus:ring-val-red"
            />
          </div>
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
    <div className="flex items-center justify-between border-b border-white/12 px-4 py-3.5">
      <div>
        <h3 className="font-display text-2xl font-black uppercase tracking-wide text-val-offwhite leading-none">
          {t('squad.pickAgent')}
        </h3>
        <p className="mt-1 font-tactical text-xs font-bold uppercase tracking-widest text-val-teal">
          {roleLabel}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="rounded-sm border border-white/10 p-1.5 text-ink-muted transition-colors hover:border-val-red/60 hover:bg-val-red/10 hover:text-val-red focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red"
        aria-label={t('common.close')}
      >
        <X className="h-4 w-4" aria-hidden="true" />
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
    return <div className="py-10 text-center text-sm text-ink-muted">{t('squad.noAgentFound')}</div>;
  }

  return (
    <div className="custom-scrollbar overflow-y-auto p-3">
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
      className={`group flex flex-col items-center rounded-sm border p-2 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-val-red ${
        isSelected
          ? 'border-val-teal bg-val-teal/15'
          : 'border-white/12 bg-bg-base/80 hover:border-val-red/70 hover:bg-surface-hi'
      }`}
    >
      <img
        src={agent.displayIcon}
        alt={displayName}
        loading="lazy"
        className="h-12 w-12 rounded-sm object-cover transition-transform group-hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
      />
      <span className="mt-1.5 w-full truncate font-tactical text-xs font-bold uppercase tracking-wider text-val-offwhite">
        {displayName}
      </span>
    </button>
  );
};
