import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useMemo } from 'react';

import { useOeeMetricsService } from '@/services/OeeMetricsServiceContext';

export type EquipmentListViewModelContextType = {
  useOeeMetricsService: typeof useOeeMetricsService;
};

const defaultContext: EquipmentListViewModelContextType = {
  useOeeMetricsService,
};

export const EquipmentListViewModelContext =
  createContext<EquipmentListViewModelContextType>(defaultContext);

export function useEquipmentListViewModel(areaName: string, equipmentType: string) {
  const { useOeeMetricsService: useService } = useContext(EquipmentListViewModelContext);
  const service = useService();

  const query = useQuery({
    queryKey: ['oee', 'equipment', areaName, equipmentType],
    queryFn: () => service.getEquipment(areaName, equipmentType),
    enabled: Boolean(areaName && equipmentType),
  });

  return useMemo(
    () => ({
      isLoading: query.isLoading,
      isError: query.isError,
      equipment: query.data ?? [],
    }),
    [query.isLoading, query.isError, query.data]
  );
}
