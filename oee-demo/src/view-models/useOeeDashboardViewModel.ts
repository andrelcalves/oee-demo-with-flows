import { useQueries } from '@tanstack/react-query';
import { createContext, useContext, useMemo } from 'react';

import { useOeeMetricsService } from '@/services/OeeMetricsServiceContext';

export type OeeDashboardViewModelContextType = {
  useOeeMetricsService: typeof useOeeMetricsService;
};

const defaultContext: OeeDashboardViewModelContextType = {
  useOeeMetricsService,
};

export const OeeDashboardViewModelContext =
  createContext<OeeDashboardViewModelContextType>(defaultContext);

export function useOeeDashboardViewModel() {
  const { useOeeMetricsService: useService } = useContext(OeeDashboardViewModelContext);
  const service = useService();

  const results = useQueries({
    queries: [
      { queryKey: ['oee', 'kpis'], queryFn: () => service.getDashboardKpis() },
      { queryKey: ['oee', 'areaHealth'], queryFn: () => service.getAreaHealthGroups() },
      {
        queryKey: ['oee', 'losses', 'availability'],
        queryFn: () => service.getProductionLosses('availability'),
      },
      {
        queryKey: ['oee', 'losses', 'performance'],
        queryFn: () => service.getProductionLosses('performance'),
      },
      {
        queryKey: ['oee', 'losses', 'quality'],
        queryFn: () => service.getProductionLosses('quality'),
      },
      { queryKey: ['oee', 'productionTrend'], queryFn: () => service.getProductionTrend() },
      {
        queryKey: ['oee', 'areaProductionRates'],
        queryFn: () => service.getAreaProductionRates(),
      },
      { queryKey: ['oee', 'areaPerformance'], queryFn: () => service.getAreaPerformance() },
      { queryKey: ['oee', 'qualityTrend'], queryFn: () => service.getQualityTrend() },
      {
        queryKey: ['oee', 'areaQuality'],
        queryFn: () => service.getAreaQualityParameters(),
      },
    ],
  });

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  return useMemo(
    () => ({
      isLoading,
      isError,
      kpis: results[0].data,
      areaHealth: results[1].data ?? [],
      availabilityLosses: results[2].data ?? [],
      performanceLosses: results[3].data ?? [],
      qualityLosses: results[4].data ?? [],
      productionTrend: results[5].data ?? [],
      areaProductionRates: results[6].data ?? [],
      areaPerformance: results[7].data ?? [],
      qualityTrend: results[8].data ?? [],
      areaQuality: results[9].data ?? [],
    }),
    [isLoading, isError, results]
  );
}
