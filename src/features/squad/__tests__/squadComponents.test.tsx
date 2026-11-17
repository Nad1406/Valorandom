import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { agents } from '@/data';
import { I18nProvider } from '@/lib/i18n';
import type { SquadSlot } from '@/types/squad';
import {
  AgentPickerPopover,
  RoleSelect,
  SquadMissingRolesAlert,
  SquadSlotRow,
  SquadSlotStage,
} from '@/features/squad/components';

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
          display={{ kind: 'empty' }}
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

  it('SquadMissingRolesAlert warns when core roles are missing (Ft-26)', () => {
    render(
      <I18nProvider>
        <SquadMissingRolesAlert missingRoles={['duelist', 'sentinel']} />
      </I18nProvider>,
    );
    expect(screen.getByText(/đội hình thiếu role:/i)).toHaveTextContent(/duelist, sentinel/i);
  });

  it('AC-21.4 SquadSlotStage renders rolled agent in-place and locks it (AC-23.4)', () => {
    const jett = agents.find((a) => a.slug === 'jett')!;
    const handleLock = vi.fn();
    render(
      <I18nProvider>
        <SquadSlotStage
          display={{ kind: 'rolled', agent: jett }}
          onOpenPicker={vi.fn()}
          onLock={handleLock}
          onUnlock={vi.fn()}
        />
      </I18nProvider>,
    );

    expect(screen.getByText('Jett')).toBeInTheDocument();
    expect(screen.getByAltText('Jett')).toBeInTheDocument();
    expect(screen.getByText('Duelist')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^khóa jett$/i }));
    expect(handleLock).toHaveBeenCalledWith(jett.id);
  });

  it('AC-23.4 SquadSlotStage shows locked badge and unlock action for locked agent', () => {
    const omen = agents.find((a) => a.slug === 'omen')!;
    const handleUnlock = vi.fn();
    render(
      <I18nProvider>
        <SquadSlotStage
          display={{ kind: 'locked', agent: omen }}
          onOpenPicker={vi.fn()}
          onLock={vi.fn()}
          onUnlock={handleUnlock}
        />
      </I18nProvider>,
    );

    expect(screen.getByText('Đã khóa')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /mở khóa omen/i }));
    expect(handleUnlock).toHaveBeenCalled();
  });

  it('SquadSlotStage hides actions while rolling', () => {
    const sage = agents.find((a) => a.slug === 'sage')!;
    render(
      <I18nProvider>
        <SquadSlotStage
          display={{ kind: 'rolling', agent: sage }}
          onOpenPicker={vi.fn()}
          onLock={vi.fn()}
          onUnlock={vi.fn()}
        />
      </I18nProvider>,
    );

    expect(screen.getByText('Đang quét...')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
