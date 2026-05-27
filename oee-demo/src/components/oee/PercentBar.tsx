import { cn } from '@/lib/utils';
import { formatPercent } from '@/lib/format';

type PercentBarProps = {
  value: number;
  label: string;
};

export function PercentBar({ value, label }: PercentBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const isLow = clamped < 50;

  return (
    <div className="flex min-w-[120px] flex-col gap-1">
      <div className="flex justify-between text-xs">
        <span className="sr-only">{label}</span>
        <span className={cn(isLow && 'text-destructive')}>{formatPercent(clamped)}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full', isLow ? 'bg-destructive/70' : 'bg-primary')}
          style={{ width: `${clamped}%` }}
          role="meter"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  );
}
