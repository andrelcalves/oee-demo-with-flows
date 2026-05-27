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
import type { ProductionTrendPoint } from '@/types/oee';

type ProductionTrendChartProps = {
  data: ProductionTrendPoint[];
};

export function ProductionTrendChart({ data }: ProductionTrendChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    label: formatChartDate(point.timestamp),
  }));

  return (
    <div className="h-44 w-full" aria-label="Production trend chart">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--oee-track)" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.5} />
          <YAxis tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.5} />
          <Tooltip />
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
