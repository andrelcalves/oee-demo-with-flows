import { IconPlayerStopFilled, IconSend2 } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type AtlasChatInputProps = {
  onSend: (text: string) => void;
  onAbort?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

const MAX_HEIGHT = 120;

export function AtlasChatInput({
  onSend,
  onAbort,
  isStreaming = false,
  disabled = false,
  placeholder = 'Ask about OEE, equipment, or losses...',
}: AtlasChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [value, autoResize]);

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled || isStreaming) return;
    onSend(trimmed);
    setValue('');
  }, [value, disabled, isStreaming, onSend]);

  return (
    <form
      className="flex items-end gap-2 px-4 py-3"
      style={{ borderTop: '1px solid var(--oee-card-border)' }}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        rows={1}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        className="flex-1 resize-none rounded-2xl bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--oee-purple-500)]"
        style={{ border: '1px solid var(--oee-card-border)', maxHeight: MAX_HEIGHT }}
        aria-label="Chat message"
      />
      {isStreaming && onAbort ? (
        <button
          type="button"
          onClick={onAbort}
          aria-label="Stop response"
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--oee-red)' }}
        >
          <IconPlayerStopFilled size={16} aria-hidden />
        </button>
      ) : (
        <button
          type="submit"
          aria-label="Send message"
          disabled={disabled || !value.trim()}
          className="flex size-9 shrink-0 items-center justify-center rounded-full transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: 'var(--oee-status-fg)', color: 'white' }}
        >
          <IconSend2 size={16} aria-hidden />
        </button>
      )}
    </form>
  );
}
