import type { CogniteClient } from '@cognite/sdk';
import type { HostAppAPI } from '@cognite/app-sdk';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import type {
  UseAtlasChatOptions,
  UseAtlasChatReturn,
} from '@/atlas-agent/react';
import { MockOeeMetricsService } from '@/services/MockOeeMetricsService';
import { OeeMetricsServiceContext } from '@/services/OeeMetricsServiceContext';
import { AppStateProvider } from '@/state/AppStateProvider';
import { useAtlasChatViewModel } from '@/chat/useAtlasChatViewModel';

vi.mock('@cognite/app-sdk/react', () => ({
  useCogniteSdk: () =>
    ({ project: 'test-project' } as unknown as CogniteClient),
}));

function makeApi(): HostAppAPI {
  return {
    getProject: vi.fn(() => Promise.resolve('test-project')),
    getBaseUrl: vi.fn(() => Promise.resolve('https://cognite.test')),
    getAccessToken: vi.fn(() => Promise.resolve('test-token')),
    getAppId: vi.fn(() => Promise.resolve('test-app-id')),
    syncInternalState: vi.fn(() => Promise.resolve(true)),
    navigateInternal: vi.fn(() => Promise.resolve(true)),
    navigateExternal: vi.fn(() => Promise.resolve(true)),
    registerAgentServer: vi.fn(() => Promise.resolve()),
    unregisterAgentServer: vi.fn(() => Promise.resolve()),
    sendAgentLayoutMode: vi.fn(() => Promise.resolve()),
    sendAgentMessage: vi.fn(() => Promise.resolve()),
  } as unknown as HostAppAPI;
}

function createWrapper(initialState?: string) {
  const service = new MockOeeMetricsService();
  const connectToHostApp = vi.fn(() =>
    Promise.resolve({ api: makeApi(), initialState }),
  );

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <OeeMetricsServiceContext.Provider value={{ oeeMetricsService: service }}>
        <AppStateProvider deps={{ connectToHostApp }}>{children}</AppStateProvider>
      </OeeMetricsServiceContext.Provider>
    );
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecordedOptions = UseAtlasChatOptions<any>;

function createFakeUseAtlasChat() {
  const recordedOptions: RecordedOptions[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fakeHook = (options: UseAtlasChatOptions<any>): UseAtlasChatReturn<any> => {
    recordedOptions.push(options);
    return {
      messages: options.initialMessages ?? [],
      send: vi.fn(() => Promise.resolve()),
      abort: vi.fn(),
      reset: vi.fn(),
      isStreaming: false,
      progress: null,
      error: null,
      setMessages: vi.fn(),
    };
  };
  return { recordedOptions, fakeHook };
}

describe('useAtlasChatViewModel', () => {
  it('registers OEE tools and forwards the configured agent id', async () => {
    const { recordedOptions, fakeHook } = createFakeUseAtlasChat();

    const { result } = renderHook(
      () =>
        useAtlasChatViewModel({
          useAtlasChat: fakeHook,
          agentExternalId: 'test-agent',
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current).toBeDefined());

    const lastCall = recordedOptions[recordedOptions.length - 1];
    expect(lastCall?.agentExternalId).toBe('test-agent');
    const toolNames = lastCall?.tools?.map((tool) => tool.name) ?? [];
    expect(toolNames).toContain('get_oee_dashboard');
    expect(lastCall?.tools?.length).toBe(7);
    expect(result.current.suggestions.length).toBeGreaterThan(0);
    expect(result.current.messages[0]?.role).toBe('assistant');
  });

  it('forwards the current page into getAppContext', async () => {
    const { recordedOptions, fakeHook } = createFakeUseAtlasChat();

    const initialState = JSON.stringify({
      page: 'equipment-details',
      equipmentId: 'Turbine 1',
      theme: 'light',
    });

    const { result } = renderHook(
      () =>
        useAtlasChatViewModel({
          useAtlasChat: fakeHook,
          agentExternalId: 'test-agent',
        }),
      { wrapper: createWrapper(initialState) },
    );

    await waitFor(() => expect(result.current).toBeDefined());

    const lastCall = recordedOptions[recordedOptions.length - 1];
    const contextJson = lastCall?.getAppContext?.();
    expect(contextJson).toBeDefined();
    const context = JSON.parse(contextJson ?? '{}');
    expect(context.page).toBe('equipment-details');
    expect(context.equipmentId).toBe('Turbine 1');
  });
});
