import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { agents } from '@/data';
import { I18nProvider } from '@/lib/i18n';
import type { SquadResult, SquadSlot } from '@/types/squad';
import {
  AgentPickerPopover,
  RoleSelect,
  SquadResultTable,
  SquadSlotRow,
} from '../components';

describe('Squad UI Subcomponents (P3-03, P3-04, P3-05, Ft-26)', () => {
  it('RoleSelect triggers onChange when selecting a different role', () => {
    const handleChange = vi.fn();
    render(
      <I18nProvider>
        <RoleSelect id="test-role" value="flex" onChange={handleChange} />
      </I18nProvider>,
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'duelist' } });
    expect(handleChange).toHaveBeenCalledWith('duelist');
  });

  it('AgentPickerPopover filters agents by role and searches by query (AC-23.3)', () => {
    const handleSelect = vi.fn();
    const handleClose = vi.fn();

    render(
      <I18nProvider>
        <AgentPickerPopover
          isOpen={true}
          onClose={handleClose}
          onSelect={handleSelect}
          slotRole="controller"
          lockedAgentIds={[]}
        />
      </I18nProvider>,
    );

    // Omen is controller
    expect(screen.getByRole('button', { name: /omen/i })).toBeInTheDocument();
    // Jett is duelist -> should not appear for controller slot
    expect(screen.queryByRole('button', { name: /jett/i })).not.toBeInTheDocument();

    // Type in search box
    const searchInput = screen.getByPlaceholderText(/tìm kiếm đặc vụ/i);
    fireEvent.change(searchInput, { target: { value: 'viper' } });

    expect(screen.getByRole('button', { name: /viper/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /omen/i })).not.toBeInTheDocument();

    // Select Viper
    fireEvent.click(screen.getByRole('button', { name: /viper/i }));
    expect(handleSelect).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });

  it('AgentPickerPopover excludes agents already locked in other slots (AC-23.3)', () => {
    const omen = agents.find((a) => a.slug === 'omen')!;

    render(
      <I18nProvider>
        <AgentPickerPopover
          isOpen={true}
          onClose={vi.fn()}
          onSelect={vi.fn()}
          slotRole="controller"
          lockedAgentIds={[omen.id]}
        />
      </I18nProvider>,
    );

    // Omen is locked in another slot, so it should not appear
    expect(screen.queryByRole('button', { name: /omen/i })).not.toBeInTheDocument();
  });

  it('SquadSlotRow renders slot row and handles name update and remove', () => {
    const slot: SquadSlot = {
      id: 'slot-1',
      name: 'Agent Viper',
      role: 'controller',
      lockedAgentId: null,
    };
    const handleUpdateName = vi.fn();
    const handleRemove = vi.fn();

    render(
      <I18nProvider>
        <SquadSlotRow
          slot={slot}
          index={0}
          allLockedAgentIds={[]}
          canRemove={true}
          onUpdateName={handleUpdateName}
          onUpdateRole={vi.fn()}
          onLockAgent={vi.fn()}
          onUnlockAgent={vi.fn()}
          onRemoveSlot={handleRemove}
        />
      </I18nProvider>,
    );

    const nameInput = screen.getByDisplayValue('Agent Viper');
    fireEvent.change(nameInput, { target: { value: 'Viper Queen' } });
    expect(handleUpdateName).toHaveBeenCalledWith('slot-1', 'Viper Queen');

    const removeBtn = screen.getByRole('button', { name: /xóa slot/i });
    fireEvent.click(removeBtn);
    expect(handleRemove).toHaveBeenCalledWith('slot-1');
  });

  it('SquadResultTable renders results and warns when core roles are missing (Ft-26)', () => {
    const omen = agents.find((a) => a.slug === 'omen')!;
    const viper = agents.find((a) => a.slug === 'viper')!;

    const result: SquadResult = {
      bySlot: {
        'slot-1': omen,
        'slot-2': viper,
      },
      order: ['slot-1', 'slot-2'],
      warnings: [
        { code: 'TEAM_MISSING_ROLE', role: 'duelist' },
        { code: 'TEAM_MISSING_ROLE', role: 'sentinel' },
      ],
    };

    const slots: SquadSlot[] = [
      { id: 'slot-1', name: 'Player 1', role: 'controller', lockedAgentId: null },
      { id: 'slot-2', name: 'Player 2', role: 'controller', lockedAgentId: null },
    ];

    render(
      <I18nProvider>
        <SquadResultTable result={result} slots={slots} />
      </I18nProvider>,
    );

    expect(screen.getByText(/đội hình thiếu role:/i)).toBeInTheDocument();
    expect(screen.getByText('Omen')).toBeInTheDocument();
    expect(screen.getByText('Viper')).toBeInTheDocument();
  });
});
