type Metric = {
  label: string;
  value: number;
  color: 'pink' | 'purple' | 'dark';
};

type PerformanceTopMetricsProps = {
  averageHourly: number;
  target: number;
  max: number;
};

const COLOR_DOT: Record<Metric['color'], string> = {
  pink: 'var(--oee-pink)',
  purple: 'var(--oee-purple-500)',
  dark: 'var(--oee-purple-700)',
};

export function PerformanceTopMetrics({ averageHourly, target, max }: PerformanceTopMetricsProps) {
  const metrics: Metric[] = [
    { label: 'Average Hourly\nProduction', value: averageHourly, color: 'pink' },
    { label: 'Target\nProduction', value: target, color: 'purple' },
    { label: 'Actual Maximum\nProduction', value: max, color: 'dark' },
  ];

  return (
    <ul className="grid grid-cols-3 gap-2">
      {metrics.map((metric) => (
        <li key={metric.label} className="flex flex-col gap-1">
          <span className="flex items-start gap-1 text-[10px] text-muted-foreground">
            <span
              className="mt-1 inline-block size-2 shrink-0 rounded-full"
              style={{ background: COLOR_DOT[metric.color] }}
            />
            <span className="whitespace-pre-line leading-tight">{metric.label}</span>
          </span>
          <span className="text-xl font-semibold leading-none">{metric.value}</span>
        </li>
      ))}
    </ul>
  );
}
