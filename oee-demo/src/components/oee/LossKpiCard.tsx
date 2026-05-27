import { OeeCard } from '@/components/oee/OeeCard';
import type { MonthlyLossBreakdown } from '@/types/oee';

type LossKpiCardProps = {
  breakdown: MonthlyLossBreakdown;
};

const SEGMENTS = [
  { key: 'availability' as const, label: 'Availability', color: 'var(--oee-pink)' },
  { key: 'performance' as const, label: 'Performance', color: 'var(--oee-purple-500)' },
  { key: 'quality' as const, label: 'Quality', color: 'var(--oee-purple-700)' },
];

export function LossKpiCard({ breakdown }: LossKpiCardProps) {
  return (
    <OeeCard className="flex items-center gap-4 py-3">
      <div
        className="relative flex size-[110px] shrink-0 items-center justify-center rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, var(--oee-card-bg) 60%, transparent 61%), conic-gradient(var(--oee-pink) 0 33%, var(--oee-purple-500) 33% 66%, var(--oee-purple-700) 66% 100%)',
        }}
      >
        <div
          className="absolute inset-3 flex items-center justify-center rounded-full"
          style={{ background: 'var(--oee-card-bg)' }}
        >
          <p className="px-2 text-center text-[11px] font-medium leading-tight">
            Monthly
            <br />
            Production
            <br />
            Loss
          </p>
        </div>
      </div>
      <ul className="flex min-w-0 flex-1 flex-col gap-3">
        {SEGMENTS.map((segment) => (
          <li
            key={segment.key}
            className="flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className="inline-block size-2.5 shrink-0 rounded-full"
                style={{ background: segment.color }}
              />
              {segment.label}
            </span>
            <span className="text-2xl font-semibold leading-none tabular-nums">
              {breakdown[segment.key].toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </OeeCard>
  );
}
