import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import type { MonthlyLossBreakdown } from '@/types/oee';

type LossDonutChartProps = {
  breakdown: MonthlyLossBreakdown;
};

const SEGMENTS = [
  { key: 'availability' as const, label: 'Availability', color: 'hsl(270 60% 75%)' },
  { key: 'performance' as const, label: 'Performance', color: 'hsl(270 55% 55%)' },
  { key: 'quality' as const, label: 'Quality', color: 'hsl(270 50% 35%)' },
];

export function LossDonutChart({ breakdown }: LossDonutChartProps) {
  const data = SEGMENTS.map((segment) => ({
    name: segment.label,
    value: breakdown[segment.key],
    color: segment.color,
  }));

  return (
    <div className="flex flex-col items-center gap-2" aria-label="Monthly production loss breakdown">
      <p className="text-sm font-medium text-muted-foreground">Monthly Production Loss</p>
      <div className="h-36 w-full min-w-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius="55%" outerRadius="85%" paddingAngle={2}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs">
        {data.map((entry) => (
          <li key={entry.name} className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full" style={{ background: entry.color }} />
            <span>
              {entry.name}: {entry.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
