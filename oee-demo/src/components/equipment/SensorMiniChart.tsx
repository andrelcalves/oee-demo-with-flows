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

export function SensorMiniChart({ chart }: SensorMiniChartProps) {
  const data = chart.data.map((point) => ({
    label: new Date(point.timestamp).getHours().toString().padStart(2, '0') + ':00',
    value: point.value,
    baseline: point.baseline,
  }));

  return (
    <div className="rounded-lg border border-border bg-card p-2">
      <div className="mb-1 flex items-center gap-2">
        <span className={cn('size-2 rounded-full', STATUS_DOT[chart.status])} aria-hidden />
        <p className="text-xs font-medium">{chart.title}</p>
      </div>
      <div className="h-28 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" className="stroke-muted/50" />
            <XAxis dataKey="label" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 9 }} width={28} />
            <Area
              type="monotone"
              dataKey="value"
              fill="hsl(var(--primary) / 0.15)"
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--destructive))"
              strokeWidth={1.5}
              dot={false}
            />
            <ReferenceLine
              y={data[0]?.baseline}
              stroke="hsl(var(--primary))"
              strokeDasharray="4 4"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
