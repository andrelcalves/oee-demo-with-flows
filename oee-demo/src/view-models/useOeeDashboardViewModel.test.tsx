import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { MockOeeMetricsService } from '@/services/MockOeeMetricsService';
import { OeeMetricsServiceContext } from '@/services/OeeMetricsServiceContext';

import { useOeeDashboardViewModel } from './useOeeDashboardViewModel';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const service = new MockOeeMetricsService();

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <OeeMetricsServiceContext.Provider value={{ oeeMetricsService: service }}>
          {children}
        </OeeMetricsServiceContext.Provider>
      </QueryClientProvider>
    );
  };
}

describe(useOeeDashboardViewModel.name, () => {
  it('loads dashboard kpis, loss breakdown, and area sections', async () => {
    const { result } = renderHook(() => useOeeDashboardViewModel(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.kpis?.overallOee).toBe(54);
    expect(result.current.lossBreakdown?.availability).toBe(1470);
    expect(result.current.areaSections.length).toBeGreaterThan(0);
    expect(result.current.productionTrend.length).toBeGreaterThan(0);
  });
});
