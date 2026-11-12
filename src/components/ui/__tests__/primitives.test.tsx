import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Select,
  Skeleton,
  Toggle,
} from '@/components/ui';

describe('UI Primitives (P1-04)', () => {
  it('renders Button with variants and handles clicks', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <Button variant="primary" onClick={handleClick}>
        Click Me
      </Button>,
    );
    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button variant="primary" disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    const disabledBtn = screen.getByRole('button', { name: /disabled/i });
    expect(disabledBtn).toBeDisabled();
  });

  it('renders Card and Badge with custom content', () => {
    render(
      <Card variant="interactive" data-testid="card">
        <Badge variant="duelist">Duelist</Badge>
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveTextContent('Duelist');
  });

  it('renders Select and handles value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Select
        label="Choose Role"
        options={[
          { value: 'all', label: 'All Roles' },
          { value: 'duelist', label: 'Duelist' },
        ]}
        onChange={handleChange}
      />,
    );

    const select = screen.getByRole('combobox', { name: /choose role/i });
    expect(select).toBeInTheDocument();

    await user.selectOptions(select, 'duelist');
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders Toggle and toggles state correctly', async () => {
    const user = userEvent.setup();
    const Wrapper = () => {
      const [checked, setChecked] = useState(false);
      return (
        <Toggle
          checked={checked}
          onChange={setChecked}
          label="Active Only"
          id="test-toggle"
        />
      );
    };

    render(<Wrapper />);
    const toggleBtn = screen.getByRole('switch');
    expect(toggleBtn).toHaveAttribute('aria-checked', 'false');

    await user.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute('aria-checked', 'true');
  });

  it('renders EmptyState and Skeleton properly', () => {
    render(
      <div>
        <EmptyState title="Nothing here" message="Try searching again" />
        <Skeleton data-testid="skeleton" width={100} height={20} />
      </div>,
    );

    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByText('Try searching again')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  });
});
