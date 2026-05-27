import { formatPercent } from '@/lib/format';

type OeeGaugeProps = {
  value: number;
  label?: string;
};

export function OeeGauge({ value, label = 'Overall OEE' }: OeeGaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2" aria-label={`${label} ${formatPercent(clamped)}`}>
      <svg width="140" height="140" viewBox="0 0 140 140" role="img">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          className="text-muted"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          className="text-primary"
        />
        <text x="70" y="68" textAnchor="middle" className="fill-foreground text-2xl font-semibold">
          {formatPercent(clamped)}
        </text>
        <text x="70" y="88" textAnchor="middle" className="fill-muted-foreground text-xs">
          {label}
        </text>
      </svg>
    </div>
  );
}
