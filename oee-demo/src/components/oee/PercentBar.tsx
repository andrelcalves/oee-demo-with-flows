import { cn } from '@/lib/utils';
import { formatPercent } from '@/lib/format';

type PercentBarProps = {
  value: number;
  label: string;
  variant?: 'default' | 'equipment';
  layout?: 'stacked' | 'inline';
};

export function PercentBar({
  value,
  label,
  variant = 'default',
  layout = 'stacked',
}: PercentBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const isLow = variant === 'default' && clamped < 50;
  const isEquipment = variant === 'equipment';

  const fillClass = isEquipment
    ? undefined
    : cn(isLow ? 'bg-destructive/70' : 'bg-primary');

  const fillStyle = isEquipment
    ? { width: `${clamped}%`, background: 'var(--oee-bar-fill)' }
    : { width: `${clamped}%` };

  const meter = (
    <div
      className={cn('h-full rounded-full', fillClass)}
      style={fillStyle}
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    />
  );

  const percentLabel = (
    <span
      className={cn(
        'shrink-0 text-xs tabular-nums',
        isLow && 'text-destructive',
        isEquipment && 'text-foreground',
      )}
    >
      {formatPercent(clamped)}
    </span>
  );

  const trackClass = cn(
    'h-2 overflow-hidden rounded-full',
    layout === 'inline' ? 'min-w-0 flex-1' : 'w-full',
    !isEquipment && 'bg-muted',
  );

  const trackStyle = isEquipment ? { background: 'var(--oee-bar-track)' } : undefined;

  const track = (
    <div className={trackClass} style={trackStyle}>
      {meter}
    </div>
  );

  if (layout === 'inline') {
    return (
      <div className="flex min-w-[140px] items-center gap-2">
        <span className="sr-only">{label}</span>
        {track}
        {percentLabel}
      </div>
    );
  }

  return (
    <div className="flex min-w-[120px] flex-col gap-1">
      <div className="flex justify-between text-xs">
        <span className="sr-only">{label}</span>
        {percentLabel}
      </div>
      {track}
    </div>
  );
}
