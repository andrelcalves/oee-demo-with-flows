import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';

import { MOCK_QUALITY_TREND } from '@/data/mock-oee-data';

import { QualityTrendChart } from './QualityTrendChart';

describe('QualityTrendChart', () => {
  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it('renders legend and hourly labels for mock quality trend', () => {
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
