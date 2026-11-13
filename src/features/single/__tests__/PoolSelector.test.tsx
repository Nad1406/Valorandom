import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '@/lib/i18n';
import { PoolSelector, type PoolItem } from '../PoolSelector';

const MOCK_ITEMS: PoolItem[] = [
  { id: 'item-1', name: 'Jett', icon: '/jett.png', subtitle: 'Duelist' },
  { id: 'item-2', name: 'Omen', icon: '/omen.png', subtitle: 'Controller' },
  { id: 'item-3', name: 'Sova', icon: '/sova.png', subtitle: 'Initiator' },
];

describe('PoolSelector Component (Phase 3.5)', () => {
  it('renders items with checkboxes and counts', () => {
    const selectedIds = new Set(['item-1', 'item-2']);
    render(
      <I18nProvider>
        <PoolSelector
          items={MOCK_ITEMS}
          selectedIds={selectedIds}
          onToggleItem={vi.fn()}
          onSelectAll={vi.fn()}
          onDeselectAll={vi.fn()}
        />
      </I18nProvider>,
    );

    expect(screen.getByText('Jett')).toBeInTheDocument();
    expect(screen.getByText('Omen')).toBeInTheDocument();
    expect(screen.getByText('Sova')).toBeInTheDocument();
    expect(screen.getByText(/đã chọn: 2\/3/i)).toBeInTheDocument();

    const jettCheckbox = screen.getByRole('checkbox', { name: 'Jett' });
    expect(jettCheckbox).toHaveAttribute('aria-checked', 'true');

    const sovaCheckbox = screen.getByRole('checkbox', { name: 'Sova' });
    expect(sovaCheckbox).toHaveAttribute('aria-checked', 'false');
  });

  it('triggers onToggleItem, onSelectAll, and onDeselectAll', () => {
    const handleToggle = vi.fn();
    const handleSelectAll = vi.fn();
    const handleDeselectAll = vi.fn();

    render(
      <I18nProvider>
        <PoolSelector
          items={MOCK_ITEMS}
          selectedIds={new Set(['item-1'])}
          onToggleItem={handleToggle}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
        />
      </I18nProvider>,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Jett' }));
    expect(handleToggle).toHaveBeenCalledWith('item-1');

    const selectAllBtn = screen.getByRole('button', { name: /^chọn tất cả$/i });
    fireEvent.click(selectAllBtn);
    expect(handleSelectAll).toHaveBeenCalled();

    const deselectAllBtn = screen.getByRole('button', { name: /^bỏ chọn tất cả$/i });
    fireEvent.click(deselectAllBtn);
    expect(handleDeselectAll).toHaveBeenCalled();
  });
});
