import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';

import { MOCK_PRODUCTION_TREND } from '@/data/mock-oee-data';

import { ProductionTrendChart, ProductionTrendTooltip } from './ProductionTrendChart';

describe('ProductionTrendTooltip', () => {
  it('renders average, target, and maximum for the hovered hour', () => {
    const point = { ...MOCK_PRODUCTION_TREND[0], label: '08:00' };

    render(<ProductionTrendTooltip active payload={[{ payload: point }]} />);

    expect(screen.getByText('08:00')).toBeInTheDocument();
    expect(screen.getByText('Average Hourly Production')).toBeInTheDocument();
    expect(screen.getByText('Target Production')).toBeInTheDocument();
    expect(screen.getByText('Actual Maximum Production')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('46')).toBeInTheDocument();
    expect(screen.getByText('52')).toBeInTheDocument();
  });

  it('renders nothing when inactive', () => {
    const { container } = render(<ProductionTrendTooltip active={false} />);
    expect(container).toBeEmpty();
  });
});

describe('ProductionTrendChart', () => {
  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it('renders production trend chart with mock hourly data', () => {
    render(
      <div style={{ width: 400, height: 200 }}>
        <ProductionTrendChart data={MOCK_PRODUCTION_TREND} />
      </div>,
    );

    expect(screen.getByLabelText('Production trend chart')).toBeInTheDocument();
  });
});
