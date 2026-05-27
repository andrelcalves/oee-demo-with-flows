import { OeeCard } from '@/components/oee/OeeCard';
import { cn } from '@/lib/utils';
import type { DashboardKpis } from '@/types/oee';

type DailyStatusBarProps = {
  kpis: DashboardKpis;
};

function formatTonsValue(value: number) {
  return { number: value.toLocaleString(), unit: 'Tons' };
}

export function DailyStatusBar({ kpis }: DailyStatusBarProps) {
  const forecastBelowTarget = kpis.dailyForecastTons < kpis.dailyTargetTons;

  const items = [
    { label: 'Daily Production', value: formatTonsValue(kpis.dailyProductionTons), warn: false },
    { label: 'Daily Target', value: formatTonsValue(kpis.dailyTargetTons), warn: false },
    {
      label: 'Daily Forecast',
      value: formatTonsValue(kpis.dailyForecastTons),
      warn: forecastBelowTarget,
    },
    { label: 'Plant Status', value: { number: kpis.plantStatus, unit: '' }, warn: false },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <OeeCard key={item.label} padding="sm">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="flex items-baseline gap-1">
              <span
                className={cn(
                  'text-xl font-semibold leading-none',
                  item.warn && 'text-[color:var(--oee-red)]'
                )}
              >
                {item.value.number}
              </span>
              {item.value.unit ? (
                <span className="text-xs text-muted-foreground">{item.value.unit}</span>
              ) : null}
            </p>
          </div>
        </OeeCard>
      ))}
    </div>
  );
}
