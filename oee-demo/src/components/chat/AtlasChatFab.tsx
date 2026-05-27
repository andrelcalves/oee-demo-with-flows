import { IconMessageCircle, IconX } from '@tabler/icons-react';

type AtlasChatFabProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function AtlasChatFab({ isOpen, onToggle }: AtlasChatFabProps) {
  const Icon = isOpen ? IconX : IconMessageCircle;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? 'Close Atlas chat' : 'Open Atlas chat'}
      aria-expanded={isOpen}
      className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--oee-status-fg)] focus-visible:ring-offset-2"
      style={{
        background: 'var(--oee-status-day-bg)',
        boxShadow: '0 8px 20px rgba(132, 204, 22, 0.35)',
        border: '2px solid var(--oee-status-fg)',
      }}
    >
      <Icon size={26} style={{ color: 'var(--oee-status-fg)' }} aria-hidden />
    </button>
  );
}
