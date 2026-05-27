import { connectToHostApp, type ConnectToHostAppResult, type HostAppAPI } from '@cognite/app-sdk';
import { Loader } from '@cognite/aura/components';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { AppState } from '@/types/oee';
import { DEFAULT_APP_STATE } from '@/types/oee';

import { applyThemeClass, parseAppState } from './appState';

export type AppStateContextType = {
  state: AppState;
  setAppState: (next: AppState) => Promise<void>;
  navigateToDashboard: () => Promise<void>;
  navigateToEquipmentList: (areaName: string, equipmentType: string) => Promise<void>;
  navigateToEquipmentDetails: (equipmentId: string) => Promise<void>;
  toggleTheme: () => Promise<void>;
  isReady: boolean;
};

export type AppStateProviderDeps = {
  connectToHostApp: typeof connectToHostApp;
};

const defaultDeps: AppStateProviderDeps = { connectToHostApp };

export const AppStateContext = createContext<AppStateContextType | null>(null);

export function AppStateProvider({
  children,
  deps = defaultDeps,
}: {
  children: ReactNode;
  deps?: AppStateProviderDeps;
}) {
  const [state, setState] = useState<AppState>(DEFAULT_APP_STATE);
  const [isReady, setIsReady] = useState(false);
  const apiRef = useRef<HostAppAPI | null>(null);

  useEffect(() => {
    let cancelled = false;
    deps
      .connectToHostApp({ applicationName: 'oee-demo' })
      .then((result: ConnectToHostAppResult) => {
        if (cancelled) {
          return;
        }
        apiRef.current = result.api;
        const seeded = parseAppState(result.initialState);
        setState(seeded);
        applyThemeClass(seeded.theme);
        setIsReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          applyThemeClass(DEFAULT_APP_STATE.theme);
          setIsReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [deps]);

  const persistState = useCallback(async (next: AppState) => {
    setState(next);
    applyThemeClass(next.theme);
    const api = apiRef.current;
    if (api) {
      await api.syncInternalState(JSON.stringify(next));
    }
  }, []);

  const navigateToDashboard = useCallback(async () => {
    await persistState({
      page: 'dashboard',
      theme: state.theme,
    });
  }, [persistState, state.theme]);

  const navigateToEquipmentList = useCallback(
    async (areaName: string, equipmentType: string) => {
      await persistState({
        page: 'equipment-list',
        areaName,
        equipmentType,
        theme: state.theme,
      });
    },
    [persistState, state.theme]
  );

  const navigateToEquipmentDetails = useCallback(
    async (equipmentId: string) => {
      await persistState({
        ...state,
        page: 'equipment-details',
        equipmentId,
      });
    },
    [persistState, state]
  );

  const toggleTheme = useCallback(async () => {
    const theme = state.theme === 'light' ? 'dark' : 'light';
    await persistState({ ...state, theme });
  }, [persistState, state]);

  const value = useMemo(
    (): AppStateContextType => ({
      state,
      setAppState: persistState,
      navigateToDashboard,
      navigateToEquipmentList,
      navigateToEquipmentDetails,
      toggleTheme,
      isReady,
    }),
    [
      state,
      persistState,
      navigateToDashboard,
      navigateToEquipmentList,
      navigateToEquipmentDetails,
      toggleTheme,
      isReady,
    ]
  );

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size={24} />
      </div>
    );
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateContextType {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
