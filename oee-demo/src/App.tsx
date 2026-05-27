import { connectToHostApp } from '@cognite/app-sdk';
import { CogniteSdkProvider } from '@cognite/app-sdk/react';
import { Loader } from '@cognite/aura/components';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';

import { EquipmentDetailsPage } from '@/pages/EquipmentDetailsPage';
import { EquipmentListPage } from '@/pages/EquipmentListPage';
import { OeeDashboardPage } from '@/pages/OeeDashboardPage';
import { OeeMetricsServiceProvider } from '@/services/OeeMetricsServiceContext';
import { AppStateProvider, useAppState } from '@/state/AppStateProvider';
import type { AppStateProviderDeps } from '@/state/AppStateProvider';

const loadingFallback = (
  <main className="flex min-h-screen items-center justify-center bg-muted/50">
    <Loader size={24} />
  </main>
);

const errorFallback = (
  <main className="flex min-h-screen items-center justify-center bg-muted/50 p-8">
    <p className="text-destructive">Failed to connect to Fusion host</p>
  </main>
);

function OeeAppRouter() {
  const { state } = useAppState();

  switch (state.page) {
    case 'equipment-list':
      return <EquipmentListPage />;
    case 'equipment-details':
      return <EquipmentDetailsPage />;
    case 'dashboard':
    default:
      return <OeeDashboardPage />;
  }
}

type AppProps = {
  deps?: ComponentProps<typeof CogniteSdkProvider>['deps'];
  appStateDeps?: AppStateProviderDeps;
};

function App({ deps, appStateDeps }: AppProps) {
  const resolvedAppStateDeps = useMemo(
    (): AppStateProviderDeps => ({
      connectToHostApp: appStateDeps?.connectToHostApp ?? deps?.connectToHostApp ?? connectToHostApp,
    }),
    [appStateDeps, deps]
  );

  return (
    <CogniteSdkProvider loadingFallback={loadingFallback} errorFallback={errorFallback} deps={deps}>
      <OeeMetricsServiceProvider>
        <AppStateProvider deps={resolvedAppStateDeps}>
          <main className="min-h-screen bg-muted/50 text-foreground">
            <OeeAppRouter />
          </main>
        </AppStateProvider>
      </OeeMetricsServiceProvider>
    </CogniteSdkProvider>
  );
}

export default App;
