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
    <div className="flex items-center gap-6 rounded-2xl bg-card p-4 shadow-sm">
      <div
        className="relative flex size-[110px] shrink-0 items-center justify-center rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, var(--oee-card, white) 60%, transparent 61%), conic-gradient(var(--oee-pink) 0 33%, var(--oee-purple-500) 33% 66%, var(--oee-purple-700) 66% 100%)',
        }}
      >
        <div className="absolute inset-3 flex items-center justify-center rounded-full bg-card">
          <p className="px-2 text-center text-[11px] font-medium leading-tight">
            Monthly
            <br />
            Production
            <br />
            Loss
          </p>
        </div>
      </div>
      <ul className="flex flex-1 flex-wrap items-center justify-around gap-x-6 gap-y-2">
        {SEGMENTS.map((segment) => (
          <li key={segment.key} className="flex flex-col items-center gap-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span
                className="inline-block size-2 rounded-full"
                style={{ background: segment.color }}
              />
              {segment.label}
            </span>
            <span className="text-2xl font-semibold leading-none">{breakdown[segment.key]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
