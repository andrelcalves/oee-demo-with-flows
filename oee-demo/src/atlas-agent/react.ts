/**
 * useAtlasChat — plug-and-play React hook for Atlas agent conversations.
 *
 * Manages session lifecycle, message state, streaming, and abort support.
 * Separate entry point from core for tree-shaking.
 */

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { CogniteClient } from '@cognite/sdk';
import { AtlasSession } from './session';
import type { AtlasTool, AtlasResponse, PythonRuntime, ToolCall } from './types';

export interface ChatMessage<TContext = unknown> {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
  toolCalls?: ToolCall[];
  context?: TContext;
}

export interface UseAtlasChatOptions<TContext = unknown> {
  client: CogniteClient | null;
  agentExternalId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tools?: AtlasTool<any, any>[];
  pythonRuntime?: PythonRuntime;
  initialMessages?: ChatMessage<TContext>[];
  onResponse?: (response: AtlasResponse) => TContext | void;
  getAppContext?: () => string | undefined;
}

export interface UseAtlasChatReturn<TContext = unknown> {
  messages: ChatMessage<TContext>[];
  send: (text: string) => Promise<void>;
  isStreaming: boolean;
  progress: string | null;
  error: string | null;
  reset: () => void;
  abort: () => void;
  setMessages: (messages: ChatMessage<TContext>[]) => void;
}

let messageCounter = 0;

function generateId(): string {
  return `msg-${Date.now()}-${++messageCounter}`;
}

export function useAtlasChat<TContext = unknown>(
  options: UseAtlasChatOptions<TContext>,
): UseAtlasChatReturn<TContext> {
  const { client, agentExternalId, tools, pythonRuntime, initialMessages, onResponse, getAppContext } = options;

  const [messages, setMessages] = useState<ChatMessage<TContext>[]>(initialMessages ?? []);
  const [isStreaming, setIsStreaming] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<AtlasSession | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const agentExternalIdRef = useRef(agentExternalId);
  const toolsRef = useRef(tools);
  const pythonRuntimeRef = useRef(pythonRuntime);
  const getAppContextRef = useRef(getAppContext);

  toolsRef.current = tools;
  pythonRuntimeRef.current = pythonRuntime;
  getAppContextRef.current = getAppContext;

  const stableGetAppContext = useMemo(
    () => () => getAppContextRef.current?.(),
    [],
  );

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const getSession = useCallback((): AtlasSession | null => {
    if (!client) return null;

    if (!sessionRef.current || agentExternalIdRef.current !== agentExternalId) {
      sessionRef.current = new AtlasSession({
        client,
        agentExternalId,
        tools: toolsRef.current,
        pythonRuntime: pythonRuntimeRef.current,
        getAppContext: stableGetAppContext,
      });
      agentExternalIdRef.current = agentExternalId;
    }

    return sessionRef.current;
  }, [client, agentExternalId, stableGetAppContext]);

  const send = useCallback(
    async (text: string) => {
      const session = getSession();
      if (!session || isStreaming) return;

      setError(null);
      setIsStreaming(true);
      setProgress('Agent thinking');

      const userMessage: ChatMessage<TContext> = {
        id: generateId(),
        role: 'user',
        text,
        timestamp: new Date(),
      };

      const assistantId = generateId();
      let accumulatedText = '';
      let assistantCreated = false;

      setMessages((prev) => [...prev, userMessage]);

      const abortController = new AbortController();
      abortRef.current = abortController;

      const updateMsg = (id: string, updates: Partial<ChatMessage<TContext>>) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        );
      };

      const finalizeAssistant = (fields: Partial<ChatMessage<TContext>>) => {
        if (assistantCreated) {
          updateMsg(assistantId, { isStreaming: false, ...fields });
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              role: 'assistant' as const,
              timestamp: new Date(),
              text: '',
              isStreaming: false,
              ...fields,
            },
          ]);
        }
      };

      try {
        const response = await session.send(
          text,
          {
            onProgress: (progressText) => {
              setProgress(progressText);
            },
            onChunk: (chunk) => {
              if (!assistantCreated) {
                assistantCreated = true;
                setMessages((prev) => [
                  ...prev,
                  {
                    id: assistantId,
                    role: 'assistant' as const,
                    text: chunk,
                    timestamp: new Date(),
                    isStreaming: true,
                  },
                ]);
              }
              accumulatedText += chunk;
              updateMsg(assistantId, { text: accumulatedText });
            },
            onToolStart: (toolName) => {
              setProgress(`Executing: ${toolName}`);
            },
          },
          abortController.signal,
        );

        finalizeAssistant({
          text:
            response.text ||
            (assistantCreated
              ? undefined
              : "I apologize, but I couldn't generate a response. Please try again."),
          toolCalls:
            response.toolCalls.length > 0
              ? response.toolCalls
              : undefined,
        });

        const ctx = onResponse?.(response);
        if (ctx !== undefined) {
          updateMsg(assistantId, { context: ctx });
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          if (assistantCreated) {
            updateMsg(assistantId, { isStreaming: false });
          }
        } else {
          const errorText =
            err instanceof Error ? err.message : 'Unknown error';
          setError(errorText);
          finalizeAssistant({ text: `Error: ${errorText}` });
        }
      } finally {
        setIsStreaming(false);
        setProgress(null);
        abortRef.current = null;
      }
    },
    [getSession, isStreaming, onResponse],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages(initialMessages ?? []);
    setIsStreaming(false);
    setProgress(null);
    setError(null);
    sessionRef.current = null;
  }, [initialMessages]);

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    messages,
    send,
    isStreaming,
    progress,
    error,
    reset,
    abort,
    setMessages,
  };
}
