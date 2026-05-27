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

import { formatChartDate } from '@/lib/format';
import type { QualityTrendPoint } from '@/types/oee';

type QualityTrendChartProps = {
  data: QualityTrendPoint[];
};

export function QualityTrendChart({ data }: QualityTrendChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    label: formatChartDate(point.timestamp),
  }));

  return (
    <div className="h-44 w-full" aria-label="Nitric acid concentration trend chart">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--oee-track)" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.5} />
          <YAxis
            tick={{ fontSize: 10 }}
            stroke="currentColor"
            opacity={0.5}
            domain={['auto', 'auto']}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="concentration"
            fill="var(--oee-purple-300)"
            stroke="none"
            fillOpacity={0.45}
          />
          <Line
            type="monotone"
            dataKey="concentration"
            stroke="var(--oee-purple-700)"
            strokeWidth={2}
            dot={false}
          />
          <ReferenceLine
            y={chartData[0]?.hiHiLimit}
            stroke="var(--oee-red)"
            strokeDasharray="4 4"
          />
          <ReferenceLine
            y={chartData[0]?.loLoLimit}
            stroke="var(--oee-amber)"
            strokeDasharray="4 4"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
