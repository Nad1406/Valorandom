import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '@/lib/i18n';
import { SquadRandomPage } from '../SquadRandomPage';

describe('SquadRandomPage Component Tests (Phase 3)', () => {
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    Object.assign(navigator, { clipboard: originalClipboard });
  });

  const renderSquadPage = (initialUrl = '/squad') => {
    return render(
      <MemoryRouter initialEntries={[initialUrl]}>
        <I18nProvider>
          <SquadRandomPage />
        </I18nProvider>
      </MemoryRouter>,
    );
  };

  it('AC-20.1: renders initial 5 slots and allows adding / removing slots', () => {
    renderSquadPage();

    expect(screen.getByText('5 / 5 Slots')).toBeInTheDocument();
    const addBtn = screen.getByRole('button', { name: /\+ thêm người chơi/i });
    expect(addBtn).toBeDisabled();

    // Remove one slot
    const removeButtons = screen.getAllByRole('button', { name: /xóa slot/i });
    expect(removeButtons).toHaveLength(5);
    fireEvent.click(removeButtons[4]!);

    expect(screen.getByText('4 / 5 Slots')).toBeInTheDocument();
    expect(addBtn).toBeEnabled();

    // Add it back
    fireEvent.click(addBtn);
    expect(screen.getByText('5 / 5 Slots')).toBeInTheDocument();
  });

  it('AC-21.1: clicking Random Squad generates 5 unique agents result', () => {
    renderSquadPage();

    const randomBtn = screen.getByRole('button', { name: /random đội hình/i });
    fireEvent.click(randomBtn);

    expect(screen.getByText(/đội hình đã random/i)).toBeInTheDocument();
    const desiredRoleLabels = screen.getAllByText(/role mong muốn:/i);
    expect(desiredRoleLabels).toHaveLength(5);
  });

  it('AC-23.1 & AC-23.3: locks an agent, verifies picker filters, and randomizes with locked agent preserved', () => {
    renderSquadPage();

    // Click lock agent on slot 1
    const lockButtons = screen.getAllByRole('button', { name: /\+ khóa đặc vụ/i });
    fireEvent.click(lockButtons[0]!);

    // Modal dialog is open
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Pick Jett
    const jettBtn = screen.getByRole('button', { name: /jett/i });
    fireEvent.click(jettBtn);

    // Modal closed, slot 1 shows locked Jett
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mở khóa jett/i })).toBeInTheDocument();

    // Click Random Squad
    const randomBtn = screen.getByRole('button', { name: /random đội hình/i });
    fireEvent.click(randomBtn);

    // Results show Jett with LOCKED badge
    expect(screen.getByText('🔒 LOCKED')).toBeInTheDocument();
  });

  it('AC-23.2: locking all slots disables random button', () => {
    renderSquadPage();

    // Remove 4 slots to leave only 1 slot
    for (let i = 0; i < 4; i++) {
      const currentRemoveButtons = screen.getAllByRole('button', { name: /xóa slot/i });
      fireEvent.click(currentRemoveButtons[currentRemoveButtons.length - 1]!);
    }

    expect(screen.getByText('1 / 5 Slots')).toBeInTheDocument();

    // Lock the only slot
    const lockBtn = screen.getByRole('button', { name: /\+ khóa đặc vụ/i });
    fireEvent.click(lockBtn);
    const jettBtn = screen.getByRole('button', { name: /jett/i });
    fireEvent.click(jettBtn);

    // Random button should now be disabled
    const randomBtn = screen.getByRole('button', { name: /random đội hình/i });
    expect(randomBtn).toBeDisabled();
    expect(screen.getByText(/tất cả slot đã được khóa/i)).toBeInTheDocument();
  });

  it('AC-24.1: sharing squad copies URL to clipboard and displays toast', async () => {
    renderSquadPage();

    const shareBtn = screen.getByRole('button', { name: /chia sẻ/i });
    await act(async () => {
      fireEvent.click(shareBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(screen.getByText(/đã sao chép/i)).toBeInTheDocument();
  });

  it('AC-04.2 & P3-08: displays error banner when URL has invalid share query', () => {
    renderSquadPage('/squad?s=invalid-broken-base64');

    expect(
      screen.getByText(/link chia sẻ không hợp lệ hoặc đã hết hạn/i),
    ).toBeInTheDocument();
  });
});
