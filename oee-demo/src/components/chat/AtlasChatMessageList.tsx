import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

export type ChatMessageVm = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isStreaming?: boolean;
};

type AtlasChatMessageListProps = {
  messages: ChatMessageVm[];
  suggestions?: readonly string[];
  progress?: string | null;
  error?: string | null;
  onSuggestionClick?: (text: string) => void;
};

export function AtlasChatMessageList({
  messages,
  suggestions,
  progress,
  error,
  onSuggestionClick,
}: AtlasChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, progress]);

  const isExecuting = Boolean(progress && progress.startsWith('Executing:'));

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
      <ul className="flex flex-col gap-3">
        {messages.map((message) => (
          <li
            key={message.id}
            className={cn(
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start',
            )}
          >
            <div
              className={cn(
                'max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm leading-relaxed',
                message.role === 'user'
                  ? 'bg-[color:var(--oee-purple-300)] text-foreground'
                  : 'bg-muted/60 text-foreground',
              )}
            >
              {message.text}
              {message.isStreaming ? (
                <span aria-hidden className="ml-1 inline-block w-1.5 animate-pulse">
                  ▍
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {progress ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            'mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px]',
            isExecuting ? 'text-foreground' : 'text-muted-foreground',
          )}
          style={
            isExecuting
              ? {
                  background: 'var(--oee-status-day-bg)',
                  color: 'var(--oee-status-fg)',
                }
              : undefined
          }
        >
          <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-current" />
          {progress}
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="mt-2 rounded-lg px-3 py-2 text-xs"
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            color: 'var(--oee-red)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
          }}
        >
          {error}
        </div>
      ) : null}

      {messages.length <= 1 && suggestions && suggestions.length > 0 ? (
        <div className="mt-4">
          <p className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
            Try asking
          </p>
          <ul className="flex flex-col gap-2">
            {suggestions.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onClick={() => onSuggestionClick?.(suggestion)}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-muted/60"
                  style={{ border: '1px solid var(--oee-card-border)' }}
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
