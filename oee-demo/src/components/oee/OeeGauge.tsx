import { cn } from '@/lib/utils';
import { formatPercent } from '@/lib/format';

type GaugeVariant = 'hero' | 'availability' | 'performance' | 'quality' | 'neutral';

type OeeGaugeProps = {
  value: number;
  ariaLabel?: string;
  size?: 'lg' | 'md' | 'sm';
  variant?: GaugeVariant;
  thickness?: number;
  arc?: 'full' | 'semicircle';
  /** When true, stroke color follows health thresholds (red / yellow / green). */
  colorByValue?: boolean;
};

type SizeConfig = {
  dim: number;
  valueClass: string;
  semicircleHeight: number;
};

const SIZE_CONFIG: Record<'lg' | 'md' | 'sm', SizeConfig> = {
  lg: { dim: 160, valueClass: 'text-3xl', semicircleHeight: 92 },
  md: { dim: 110, valueClass: 'text-xl', semicircleHeight: 64 },
  sm: { dim: 72, valueClass: 'text-sm', semicircleHeight: 44 },
};

const VARIANT_STROKE: Record<GaugeVariant, string> = {
  hero: 'var(--oee-purple-700)',
  availability: 'var(--oee-purple-500)',
  performance: 'var(--oee-purple-500)',
  quality: 'var(--oee-purple-500)',
  neutral: 'var(--oee-purple-500)',
};

const HERO_GRADIENT_ID = 'oee-gauge-hero-gradient';

export function getHealthStroke(value: number): string {
  if (value < 60) return 'var(--oee-red)';
  if (value < 80) return 'var(--oee-amber)';
  return 'var(--oee-status-fg)';
}

function resolveStroke(variant: GaugeVariant, clamped: number, colorByValue?: boolean): string {
  if (colorByValue) return getHealthStroke(clamped);
  return VARIANT_STROKE[variant];
}

function FullGauge({
  clamped,
  config,
  stroke,
  radius,
  variant,
  ariaLabel,
  colorByValue,
}: {
  clamped: number;
  config: SizeConfig;
  stroke: number;
  radius: number;
  variant: GaugeVariant;
  ariaLabel?: string;
  colorByValue?: boolean;
}) {
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const cx = config.dim / 2;
  const cy = config.dim / 2;
  const progressStroke = resolveStroke(variant, clamped, colorByValue);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: config.dim, height: config.dim }}
      aria-label={ariaLabel ?? formatPercent(clamped)}
    >
      <svg width={config.dim} height={config.dim} viewBox={`0 0 ${config.dim} ${config.dim}`} role="img">
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--oee-track)"
          strokeWidth={stroke}
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={progressStroke}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      <span
        className={cn('absolute font-semibold text-foreground', config.valueClass)}
        style={colorByValue ? { color: progressStroke } : undefined}
      >
        {formatPercent(clamped)}
      </span>
    </div>
  );
}

function SemicircleGauge({
  clamped,
  config,
  stroke,
  radius,
  ariaLabel,
}: {
  clamped: number;
  config: SizeConfig;
  stroke: number;
  radius: number;
  ariaLabel?: string;
}) {
  const width = config.dim;
  const height = config.semicircleHeight;
  const cx = width / 2;
  const cy = height - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const semicircleLength = Math.PI * radius;
  const progressLength = (clamped / 100) * semicircleLength;
  const trackDash = `${semicircleLength} ${circumference}`;
  const progressDash = `${progressLength} ${circumference}`;

  return (
    <div
      className="relative flex items-end justify-center"
      style={{ width, height }}
      aria-label={ariaLabel ?? formatPercent(clamped)}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" className="overflow-visible">
        <defs>
          <linearGradient id={HERO_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--oee-purple-300)" />
            <stop offset="100%" stopColor="var(--oee-purple-700)" />
          </linearGradient>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--oee-track)"
          strokeWidth={stroke}
          strokeDasharray={trackDash}
          strokeLinecap="round"
          transform={`rotate(180 ${cx} ${cy})`}
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={`url(#${HERO_GRADIENT_ID})`}
          strokeWidth={stroke}
          strokeDasharray={progressDash}
          strokeLinecap="round"
          transform={`rotate(180 ${cx} ${cy})`}
        />
      </svg>
      <span
        className={cn(
          'absolute left-1/2 -translate-x-1/2 font-semibold text-foreground',
          config.valueClass,
        )}
        style={{ bottom: stroke }}
      >
        {formatPercent(clamped)}
      </span>
    </div>
  );
}

export function OeeGauge({
  value,
  ariaLabel,
  size = 'lg',
  variant = 'hero',
  thickness,
  arc = 'full',
  colorByValue = false,
}: OeeGaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const config = SIZE_CONFIG[size];
  const stroke = thickness ?? (size === 'lg' ? 14 : size === 'md' ? 10 : 8);
  const radius = (config.dim - stroke) / 2;

  if (arc === 'semicircle') {
    return (
      <SemicircleGauge
        clamped={clamped}
        config={config}
        stroke={stroke}
        radius={radius}
        ariaLabel={ariaLabel}
      />
    );
  }

  return (
    <FullGauge
      clamped={clamped}
      config={config}
      stroke={stroke}
      radius={radius}
      variant={variant}
      ariaLabel={ariaLabel}
      colorByValue={colorByValue}
    />
  );
}
