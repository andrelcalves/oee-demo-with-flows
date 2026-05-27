import { IconRefresh, IconX } from '@tabler/icons-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AtlasChatPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onReset?: () => void;
  children: ReactNode;
};

export function AtlasChatPanel({ isOpen, onClose, onReset, children }: AtlasChatPanelProps) {
  return (
    <aside
      role="dialog"
      aria-label="Atlas chat panel"
      aria-hidden={!isOpen}
      className={cn(
        'fixed bottom-0 right-0 top-0 z-30 flex w-full max-w-[420px] flex-col transition-transform duration-200 ease-out',
        isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none',
      )}
      style={{
        background: 'var(--oee-card-bg)',
        borderLeft: '1px solid var(--oee-card-border)',
        boxShadow: '-8px 0 32px rgba(15, 23, 42, 0.08)',
      }}
    >
      <header
        className="flex items-center justify-between gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid var(--oee-card-border)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex size-7 items-center justify-center rounded-full text-xs font-semibold"
            style={{ background: 'var(--oee-status-day-bg)', color: 'var(--oee-status-fg)' }}
            aria-hidden
          >
            A
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">Atlas</span>
            <span className="text-[11px] text-muted-foreground">Ask about OEE data</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              aria-label="New chat"
              title="New chat"
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <IconRefresh size={16} aria-hidden />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Atlas chat"
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <IconX size={18} aria-hidden />
          </button>
        </div>
      </header>

      {children}
    </aside>
  );
}
