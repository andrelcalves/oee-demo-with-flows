import { OeeGauge } from '@/components/oee/OeeGauge';
import { cn } from '@/lib/utils';
import type { DiagnosticCard as DiagnosticCardType } from '@/types/oee';

type DiagnosticCardProps = {
  diagnostic: DiagnosticCardType;
  compact?: boolean;
};

const STATUS_TEXT = {
  green: 'text-emerald-600',
  yellow: 'text-amber-600',
  red: 'text-red-600',
} as const;

export function DiagnosticCard({ diagnostic, compact = false }: DiagnosticCardProps) {
  if (!compact) {
    return (
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-sm font-medium leading-tight">{diagnostic.title}</p>
          <OeeGauge value={diagnostic.probability} size="sm" variant="performance" />
        </div>
        <ul className="flex flex-col gap-1 text-xs">
          {diagnostic.factors.map((factor) => (
            <li key={factor.label} className="flex justify-between gap-2">
              <span className="text-muted-foreground">{factor.label}</span>
              <span className={cn('font-medium', STATUS_TEXT[factor.status])}>
                {factor.percent}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-2">
      <p className="text-xs font-medium">{diagnostic.title}</p>
      <p className={cn('text-lg font-semibold', STATUS_TEXT[diagnostic.status])}>
        {diagnostic.probability}%
      </p>
    </div>
  );
}
