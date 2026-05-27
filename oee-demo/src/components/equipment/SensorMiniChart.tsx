import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { OeeCard } from '@/components/oee/OeeCard';
import { cn } from '@/lib/utils';
import type { SensorChart } from '@/types/oee';

type SensorMiniChartProps = {
  chart: SensorChart;
};

const STATUS_DOT = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-400',
  red: 'bg-red-500',
} as const;

const STATUS_LINE = {
  green: 'var(--oee-status-fg)',
  yellow: 'var(--oee-amber)',
  red: 'var(--oee-red)',
} as const;

export function SensorMiniChart({ chart }: SensorMiniChartProps) {
  const lineColor = STATUS_LINE[chart.status];
  const data = chart.data.map((point) => ({
    label: new Date(point.timestamp).getHours().toString().padStart(2, '0') + ':00',
    value: point.value,
    baseline: point.baseline,
  }));

  return (
    <OeeCard padding="sm">
      <div className="mb-1 flex items-center gap-2">
        <span className={cn('size-2 rounded-full', STATUS_DOT[chart.status])} aria-hidden />
        <p className="text-xs font-medium">{chart.title}</p>
      </div>
      <div className="mb-2 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span
            className="inline-block h-0.5 w-3 rounded-full"
            style={{ background: lineColor }}
            aria-hidden
          />
          Value
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block h-0.5 w-3 rounded-full border border-dashed"
            style={{ borderColor: 'var(--oee-purple-500)' }}
            aria-hidden
          />
          Baseline
        </span>
      </div>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" className="stroke-muted/50" />
            <XAxis dataKey="label" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 9 }} width={28} />
            <Area
              type="monotone"
              dataKey="value"
              fill="var(--oee-purple-300)"
              fillOpacity={0.25}
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={1.5}
              dot={false}
            />
            <ReferenceLine
              y={data[0]?.baseline}
              stroke="var(--oee-purple-500)"
              strokeDasharray="4 4"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </OeeCard>
  );
}
