import { IconCloud } from '@tabler/icons-react';

export function StatusWidget() {
  return (
    <div className="flex items-center gap-1 rounded-full p-1 shadow-sm" style={{ background: 'var(--oee-status-bg)' }}>
      <div className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
        <IconCloud size={18} aria-hidden style={{ color: 'var(--oee-status-fg)' }} />
        <span>45°F</span>
        <span className="text-[10px] text-muted-foreground">
          47°
          <br />
          28°
        </span>
      </div>
      <div
        className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-foreground"
        style={{ background: 'var(--oee-status-day-bg)' }}
      >
        <span className="font-semibold">THU</span>
        <span className="font-semibold">10:49</span>
        <span className="text-[10px] text-muted-foreground">2025/01/21</span>
      </div>
    </div>
  );
}
