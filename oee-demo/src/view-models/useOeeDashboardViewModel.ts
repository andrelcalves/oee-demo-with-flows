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
      { queryKey: ['oee', 'lossBreakdown'], queryFn: () => service.getMonthlyLossBreakdown() },
      { queryKey: ['oee', 'areaSections'], queryFn: () => service.getAreaSections() },
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
      lossBreakdown: results[1].data,
      areaSections: results[2].data ?? [],
      availabilityLosses: results[3].data ?? [],
      performanceLosses: results[4].data ?? [],
      qualityLosses: results[5].data ?? [],
      productionTrend: results[6].data ?? [],
      areaProductionRates: results[7].data ?? [],
      qualityTrend: results[8].data ?? [],
      areaQuality: results[9].data ?? [],
    }),
    [isLoading, isError, results]
  );
}
