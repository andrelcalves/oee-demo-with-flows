import { formatPercent } from '@/lib/format';
import type { AreaMetric } from '@/types/oee';

type AreaMetricsRowProps = {
  metrics: AreaMetric[];
};

export function AreaMetricsRow({ metrics }: AreaMetricsRowProps) {
  return (
    <ul className="grid grid-cols-3 gap-2">
      {metrics.map((metric) => (
        <li key={metric.areaName} className="flex flex-col gap-0.5">
          <span className="text-[10px] leading-tight text-muted-foreground">{metric.areaName}</span>
          <span className="flex items-baseline gap-2">
            <span className="text-base font-semibold leading-none">
              {metric.value}
              {metric.unit && metric.unit !== '%' ? (
                <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                  {metric.unit}
                </span>
              ) : null}
              {metric.unit === '%' ? '%' : ''}
            </span>
            {metric.performancePercent !== undefined ? (
              <span className="text-xs text-[color:var(--oee-purple-500)]">
                {formatPercent(metric.performancePercent)}
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
