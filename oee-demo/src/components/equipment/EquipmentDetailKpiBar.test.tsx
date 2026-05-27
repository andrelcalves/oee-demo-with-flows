import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MOCK_TURBINE_1_DETAIL } from '@/data/mock-oee-data';

import { EquipmentDetailKpiBar } from './EquipmentDetailKpiBar';

describe('EquipmentDetailKpiBar', () => {
  it('renders all eight KPI tiles with Turbine 1 mock values', () => {
    render(<EquipmentDetailKpiBar kpis={MOCK_TURBINE_1_DETAIL.kpis} />);

    expect(screen.getByText('Operating Time')).toBeInTheDocument();
    expect(screen.getByText('348')).toBeInTheDocument();
    expect(screen.getByText('MTBF')).toBeInTheDocument();
    expect(screen.getByText('87')).toBeInTheDocument();
    expect(screen.getByText('Days Since Last Failure')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Last Failure')).toBeInTheDocument();
    expect(screen.getByText('05/10/2024')).toBeInTheDocument();
    expect(screen.getByText('Failure rate')).toBeInTheDocument();
    expect(screen.getByText('0.345')).toBeInTheDocument();
    expect(screen.getByText('per month')).toBeInTheDocument();
    expect(screen.getByText('Probability of Failure in 30 Days')).toBeInTheDocument();
    expect(screen.getByText('46.9')).toBeInTheDocument();
  });
});
