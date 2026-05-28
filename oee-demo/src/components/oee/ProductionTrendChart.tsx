import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatChartHour } from '@/lib/format';
import type { ProductionTrendPoint } from '@/types/oee';

type ProductionChartPoint = ProductionTrendPoint & { label: string };

type ProductionTrendChartProps = {
  data: ProductionTrendPoint[];
};

type ProductionTrendTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: ProductionChartPoint }>;
};

const TOOLTIP_METRICS = [
  {
    label: 'Average Hourly Production',
    color: 'var(--oee-pink)',
    getValue: (point: ProductionChartPoint) => point.averageHourlyProduction,
  },
  {
    label: 'Target Production',
    color: 'var(--oee-purple-500)',
    getValue: (point: ProductionChartPoint) => point.targetProduction,
  },
  {
    label: 'Actual Maximum Production',
    color: 'var(--oee-purple-700)',
    getValue: (point: ProductionChartPoint) => point.maxProduction,
  },
] as const;

export function ProductionTrendTooltip({ active, payload }: ProductionTrendTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-md"
      style={{
        background: 'var(--oee-card-bg)',
        borderColor: 'var(--oee-card-border)',
      }}
    >
      <p className="mb-2 font-medium text-foreground">{point.label}</p>
      <ul className="flex flex-col gap-1.5">
        {TOOLTIP_METRICS.map((metric) => (
          <li key={metric.label} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className="inline-block size-2 shrink-0 rounded-full"
                style={{ background: metric.color }}
                aria-hidden
              />
              {metric.label}
            </span>
            <span className="font-semibold tabular-nums text-foreground">
              {metric.getValue(point)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductionTrendChart({ data }: ProductionTrendChartProps) {
  const chartData: ProductionChartPoint[] = data.map((point) => ({
    ...point,
    label: formatChartHour(point.timestamp),
  }));

  return (
    <div className="h-44 w-full" aria-label="Production trend chart">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--oee-track)" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.5} />
          <YAxis tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.5} />
          <Tooltip content={<ProductionTrendTooltip />} />
          <Area
            type="monotone"
            dataKey="averageHourlyProduction"
            fill="var(--oee-purple-300)"
            stroke="none"
            fillOpacity={0.45}
          />
          <Line
            type="monotone"
            dataKey="averageHourlyProduction"
            stroke="var(--oee-red)"
            strokeWidth={2}
            dot={false}
          />
          <ReferenceLine
            y={chartData[0]?.targetProduction}
            stroke="var(--oee-blue)"
            strokeDasharray="4 4"
          />
          <ReferenceLine
            y={chartData[0]?.maxProduction}
            stroke="var(--oee-purple-500)"
            strokeDasharray="2 6"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
