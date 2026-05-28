import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { AtlasChatShell } from './AtlasChatShell';

describe('AtlasChatShell', () => {
  it('shows preview panel with disabled input when Atlas is not configured', async () => {
    const user = userEvent.setup();
    render(<AtlasChatShell />);

    await user.click(screen.getByRole('button', { name: /open atlas chat/i }));

    expect(screen.getByText(/Preview — connect Atlas to chat/i)).toBeInTheDocument();
    expect(screen.getByText(/Hi! I am Atlas/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Configure Atlas to enable chat')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'What is the current overall OEE?' })).toBeDisabled();
  });
});
