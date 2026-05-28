import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';

import { MOCK_QUALITY_TREND } from '@/data/mock-oee-data';

import { QualityTrendChart, QualityTrendTooltip } from './QualityTrendChart';

describe('QualityTrendTooltip', () => {
  it('renders concentration, HiHi, and LoLo for the hovered hour', () => {
    const point = { ...MOCK_QUALITY_TREND[0], label: '08:00' };

    render(<QualityTrendTooltip active payload={[{ payload: point }]} />);

    expect(screen.getByText('08:00')).toBeInTheDocument();
    expect(screen.getByText('Nitric Acid Concentration')).toBeInTheDocument();
    expect(screen.getByText('HiHi')).toBeInTheDocument();
    expect(screen.getByText('LoLo')).toBeInTheDocument();
    expect(screen.getByText('57.2')).toBeInTheDocument();
    expect(screen.getByText('62')).toBeInTheDocument();
    expect(screen.getByText('57')).toBeInTheDocument();
  });

  it('renders nothing when inactive', () => {
    const { container } = render(<QualityTrendTooltip active={false} />);
    expect(container).toBeEmpty();
  });
});

describe('QualityTrendChart', () => {
  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it('renders legend and chart for mock quality trend', () => {
    render(
      <div style={{ width: 400, height: 200 }}>
        <QualityTrendChart data={MOCK_QUALITY_TREND} />
      </div>,
    );

    expect(screen.getByText('Nitric Acid Concentration')).toBeInTheDocument();
    expect(screen.getByText('HiHi')).toBeInTheDocument();
    expect(screen.getByText('LoLo')).toBeInTheDocument();
    expect(screen.getByLabelText('Nitric acid concentration trend chart')).toBeInTheDocument();
  });
});
