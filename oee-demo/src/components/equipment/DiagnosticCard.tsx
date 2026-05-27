import { OeeCard } from '@/components/oee/OeeCard';
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
  if (compact) {
    return (
      <OeeCard padding="sm">
        <p className="text-xs font-medium">{diagnostic.title}</p>
        <p className={cn('text-lg font-semibold', STATUS_TEXT[diagnostic.status])}>
          {diagnostic.probability}%
        </p>
      </OeeCard>
    );
  }

  return (
    <OeeCard padding="sm">
      <div className="flex gap-3">
        <div className="shrink-0">
          <OeeGauge
            value={diagnostic.probability}
            size="sm"
            variant="neutral"
            colorByValue
            ariaLabel={`${diagnostic.title} probability`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-sm font-medium leading-tight">{diagnostic.title}</p>
          <ul className="flex flex-col gap-1 text-xs">
            {diagnostic.factors.map((factor) => (
              <li key={factor.label} className="flex justify-between gap-2">
                <span className="text-[color:var(--oee-purple-500)]">{factor.label}</span>
                <span className={cn('shrink-0 font-medium tabular-nums', STATUS_TEXT[factor.status])}>
                  {factor.percent}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </OeeCard>
  );
}
