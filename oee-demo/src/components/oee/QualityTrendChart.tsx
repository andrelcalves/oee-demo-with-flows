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
    <div className="h-64 w-full" aria-label="Nitric acid concentration trend chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="concentration"
            name="Concentration"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="hiHiLimit"
            name="HiHi"
            stroke="hsl(var(--destructive))"
            strokeDasharray="4 4"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="loLoLimit"
            name="LoLo"
            stroke="hsl(var(--destructive))"
            strokeDasharray="2 6"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
