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
import type { QualityTrendPoint } from '@/types/oee';

type QualityTrendChartProps = {
  data: QualityTrendPoint[];
};

export function QualityTrendChart({ data }: QualityTrendChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    label: formatChartHour(point.timestamp),
  }));

  const hiHiLimit = chartData[0]?.hiHiLimit ?? 62;
  const loLoLimit = chartData[0]?.loLoLimit ?? 57;
  const yDomain: [number, number] = [loLoLimit - 2, hiHiLimit + 2];

  return (
    <div className="flex flex-col gap-2" aria-label="Nitric acid concentration trend chart">
      <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block size-2 rounded-full"
            style={{ background: 'var(--oee-purple-700)' }}
            aria-hidden
          />
          Nitric Acid Concentration
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-0.5 w-4 rounded-full border border-dashed"
            style={{ borderColor: 'var(--oee-red)' }}
            aria-hidden
          />
          HiHi
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-0.5 w-4 rounded-full border border-dashed"
            style={{ borderColor: 'var(--oee-amber)' }}
            aria-hidden
          />
          LoLo
        </span>
      </div>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--oee-track)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.5} />
            <YAxis
              tick={{ fontSize: 10 }}
              stroke="currentColor"
              opacity={0.5}
              domain={yDomain}
              hide
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
            <ReferenceLine y={hiHiLimit} stroke="var(--oee-red)" strokeDasharray="4 4" />
            <ReferenceLine y={loLoLimit} stroke="var(--oee-amber)" strokeDasharray="4 4" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
