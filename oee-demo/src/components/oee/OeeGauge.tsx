import { cn } from '@/lib/utils';
import { formatPercent } from '@/lib/format';

type GaugeVariant = 'hero' | 'availability' | 'performance' | 'quality' | 'neutral';

type OeeGaugeProps = {
  value: number;
  ariaLabel?: string;
  size?: 'lg' | 'md' | 'sm';
  variant?: GaugeVariant;
  thickness?: number;
};

const SIZE_CONFIG = {
  lg: { dim: 160, valueClass: 'text-3xl' },
  md: { dim: 110, valueClass: 'text-xl' },
  sm: { dim: 72, valueClass: 'text-sm' },
} as const;

const VARIANT_STROKE: Record<GaugeVariant, string> = {
  hero: 'var(--oee-purple-700)',
  availability: 'var(--oee-purple-300)',
  performance: 'var(--oee-purple-500)',
  quality: 'var(--oee-purple-700)',
  neutral: 'var(--oee-purple-500)',
};

export function OeeGauge({
  value,
  ariaLabel,
  size = 'lg',
  variant = 'hero',
  thickness,
}: OeeGaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const config = SIZE_CONFIG[size];
  const stroke = thickness ?? (size === 'lg' ? 14 : size === 'md' ? 10 : 8);
  const radius = (config.dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: config.dim, height: config.dim }}
      aria-label={ariaLabel ?? `${formatPercent(clamped)}`}
    >
      <svg width={config.dim} height={config.dim} viewBox={`0 0 ${config.dim} ${config.dim}`} role="img">
        <circle
          cx={config.dim / 2}
          cy={config.dim / 2}
          r={radius}
          fill="none"
          stroke="var(--oee-track)"
          strokeWidth={stroke}
        />
        <circle
          cx={config.dim / 2}
          cy={config.dim / 2}
          r={radius}
          fill="none"
          stroke={VARIANT_STROKE[variant]}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${config.dim / 2} ${config.dim / 2})`}
        />
      </svg>
      <span
        className={cn(
          'absolute font-semibold text-foreground',
          config.valueClass
        )}
      >
        {formatPercent(clamped)}
      </span>
    </div>
  );
}
