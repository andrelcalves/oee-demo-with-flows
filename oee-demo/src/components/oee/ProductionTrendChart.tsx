import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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
    <div className="h-64 w-full" aria-label="Production trend chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="averageHourlyProduction"
            name="Avg hourly"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="targetProduction"
            name="Target"
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="maxProduction"
            name="Max"
            stroke="hsl(var(--destructive))"
            strokeDasharray="2 6"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
