import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { MockOeeMetricsService } from '@/services/MockOeeMetricsService';
import { OeeMetricsServiceContext } from '@/services/OeeMetricsServiceContext';

import { useEquipmentListViewModel } from './useEquipmentListViewModel';

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

describe(useEquipmentListViewModel.name, () => {
  it('loads equipment for Pre Reaction / Pump', async () => {
    const { result } = renderHook(
      () => useEquipmentListViewModel('Pre Reaction', 'Pump'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.equipment).toHaveLength(2);
    expect(result.current.equipment[0]?.equipmentId).toBe('Pump-101A');
  });
});
