import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MOCK_EQUIPMENT } from '@/data/mock-oee-data';

import { EquipmentTable } from './EquipmentTable';

const turbineRows = MOCK_EQUIPMENT.filter((row) => row.equipmentType === 'Turbine');

describe('EquipmentTable', () => {
  it('renders column headers and Turbine 1 metrics', () => {
    const onDetails = vi.fn();
    render(<EquipmentTable equipment={turbineRows} onDetails={onDetails} />);

    expect(screen.getByRole('heading', { name: 'Equipment list' })).toBeInTheDocument();
    expect(screen.getByText('Operating Time')).toBeInTheDocument();
    expect(screen.getByText('MTBF')).toBeInTheDocument();
    expect(screen.getByText('Overall Health')).toBeInTheDocument();
    expect(screen.getByText('Turbine 1')).toBeInTheDocument();
    expect(screen.getByText('348 days')).toBeInTheDocument();
    expect(screen.getByText('98%')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Detail' })).toHaveLength(turbineRows.length);
  });

  it('uses inline equipment percent bars with meter and adjacent percent', () => {
    render(<EquipmentTable equipment={[turbineRows[0]]} onDetails={vi.fn()} />);

    const meters = screen.getAllByRole('meter');
    expect(meters).toHaveLength(2);
    expect(meters[0]).toHaveAttribute('aria-valuenow', '98');
    expect(meters[1]).toHaveAttribute('aria-valuenow', '57');
    expect(screen.getByText('98%')).toBeInTheDocument();
    expect(screen.getByText('57%')).toBeInTheDocument();
  });

  it('calls onDetails when Detail is clicked', async () => {
    const user = userEvent.setup();
    const onDetails = vi.fn();
    render(<EquipmentTable equipment={turbineRows} onDetails={onDetails} />);

    await user.click(screen.getAllByRole('button', { name: 'Detail' })[0]);
    expect(onDetails).toHaveBeenCalledWith('Turbine 1');
  });
});
