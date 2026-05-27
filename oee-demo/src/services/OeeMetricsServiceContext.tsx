import { createContext, useContext, type ReactNode } from 'react';

import { MockOeeMetricsService } from './MockOeeMetricsService';
import type { OeeMetricsService } from './OeeMetricsService';

export type OeeMetricsServiceContextType = {
  oeeMetricsService: OeeMetricsService;
};

const defaultService = new MockOeeMetricsService();

export const OeeMetricsServiceContext = createContext<OeeMetricsServiceContextType>({
  oeeMetricsService: defaultService,
});

export function OeeMetricsServiceProvider({
  children,
  oeeMetricsService = defaultService,
}: {
  children: ReactNode;
  oeeMetricsService?: OeeMetricsService;
}) {
  return (
    <OeeMetricsServiceContext.Provider value={{ oeeMetricsService }}>
      {children}
    </OeeMetricsServiceContext.Provider>
  );
}

export function useOeeMetricsService(): OeeMetricsService {
  return useContext(OeeMetricsServiceContext).oeeMetricsService;
}
