/**
 * useAtlasChatViewModel — wraps the vendored `useAtlasChat` hook with OEE-specific
 * context: it sources the Cognite SDK, the metrics service, and the current
 * app/page state, then exposes a flat API for the chat shell to render.
 *
 * Tests can override the chat hook via the `deps.useAtlasChat` parameter — this
 * keeps the view model decoupled from the real Atlas network transport.
 */

import { useCallback, useMemo, useRef } from 'react';

import { useCogniteSdk } from '@cognite/app-sdk/react';

import { ATLAS_AGENT_EXTERNAL_ID } from '@/config/atlas';
import { useAtlasChat as defaultUseAtlasChat } from '@/atlas-agent/react';
import type {
  ChatMessage,
  UseAtlasChatOptions,
  UseAtlasChatReturn,
} from '@/atlas-agent/react';
import type { AtlasTool } from '@/atlas-agent/types';
import { createOeeAtlasTools } from '@/chat/tools';
import { useOeeMetricsService } from '@/services/OeeMetricsServiceContext';
import { useAppState } from '@/state/AppStateProvider';
import type { AppState } from '@/types/oee';

export const ATLAS_CHAT_SUGGESTIONS = [
  'What is the current overall OEE?',
  'Why is the daily forecast below target?',
  'Summarize monthly production loss by section.',
] as const;

export const ATLAS_CHAT_WELCOME_TEXT =
  'Hi! I am Atlas. Ask me about overall OEE, equipment health, production trends, or production losses for the nitric-acid plant.';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'atlas-welcome',
  role: 'assistant',
  text: ATLAS_CHAT_WELCOME_TEXT,
  timestamp: new Date(0),
};

export type AtlasChatViewModel = {
  messages: ChatMessage[];
  send: (text: string) => Promise<void>;
  abort: () => void;
  reset: () => void;
  isStreaming: boolean;
  progress: string | null;
  error: string | null;
  suggestions: readonly string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UseAtlasChatFn = (options: UseAtlasChatOptions<any>) => UseAtlasChatReturn<any>;

export type UseAtlasChatViewModelDeps = {
  /** Override the Atlas chat hook (for tests). */
  useAtlasChat?: UseAtlasChatFn;
  /** Override the agent external id (for tests). */
  agentExternalId?: string;
};

function buildAppContext(state: AppState): string {
  return JSON.stringify({
    page: state.page,
    areaName: state.areaName,
    equipmentType: state.equipmentType,
    equipmentId: state.equipmentId,
    theme: state.theme,
  });
}

export function useAtlasChatViewModel(
  deps: UseAtlasChatViewModelDeps = {},
): AtlasChatViewModel {
  const useChatHook = deps.useAtlasChat ?? defaultUseAtlasChat;
  const agentExternalId = deps.agentExternalId ?? ATLAS_AGENT_EXTERNAL_ID;

  const sdk = useCogniteSdk();
  const service = useOeeMetricsService();
  const { state } = useAppState();

  const stateRef = useRef(state);
  stateRef.current = state;

  const tools = useMemo<AtlasTool[]>(() => createOeeAtlasTools(service), [service]);

  const initialMessages = useMemo<ChatMessage[]>(() => [WELCOME_MESSAGE], []);

  const getAppContext = useCallback(
    () => buildAppContext(stateRef.current),
    [],
  );

  const chat = useChatHook({
    client: sdk,
    agentExternalId,
    tools,
    initialMessages,
    getAppContext,
  });

  return {
    messages: chat.messages,
    send: chat.send,
    abort: chat.abort,
    reset: chat.reset,
    isStreaming: chat.isStreaming,
    progress: chat.progress,
    error: chat.error,
    suggestions: ATLAS_CHAT_SUGGESTIONS,
  };
}
