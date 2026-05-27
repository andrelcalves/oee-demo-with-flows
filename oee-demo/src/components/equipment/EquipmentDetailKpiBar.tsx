import { OeeCard } from '@/components/oee/OeeCard';
import {
  formatDecimal,
  formatPercent,
  formatPercentOneDecimal,
} from '@/lib/format';
import type { EquipmentDetailKpis } from '@/types/oee';

type EquipmentDetailKpiBarProps = {
  kpis: EquipmentDetailKpis;
};

type KpiTile = {
  label: string;
  number: string;
  unit?: string;
};

function buildTiles(kpis: EquipmentDetailKpis): KpiTile[] {
  return [
    { label: 'Operating Time', number: String(kpis.operatingTimeDays), unit: 'days' },
    { label: 'MTBF', number: String(kpis.mtbfDays), unit: 'days' },
    {
      label: 'Availability',
      number: formatPercent(kpis.availability).replace('%', ''),
      unit: '%',
    },
    {
      label: 'Days Since Last Failure',
      number: String(kpis.daysSinceLastFailure),
      unit: 'days',
    },
    { label: 'Last Failure', number: kpis.lastFailureDate },
    { label: 'MTTR', number: formatDecimal(kpis.mttrDays, 2), unit: 'days' },
    {
      label: 'Failure rate',
      number: formatDecimal(kpis.failureRatePerMonth, 3),
      unit: 'per month',
    },
    {
      label: 'Probability of Failure in 30 Days',
      number: formatPercentOneDecimal(kpis.failureProbability30Days).replace('%', ''),
      unit: '%',
    },
  ];
}

export function EquipmentDetailKpiBar({ kpis }: EquipmentDetailKpiBarProps) {
  const tiles = buildTiles(kpis);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map((tile) => (
        <OeeCard key={tile.label} padding="sm">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm text-muted-foreground">{tile.label}</p>
            <p className="flex shrink-0 items-baseline gap-1">
              <span className="text-xl font-semibold leading-none tabular-nums">
                {tile.number}
              </span>
              {tile.unit ? (
                <span className="text-xs text-muted-foreground">{tile.unit}</span>
              ) : null}
            </p>
          </div>
        </OeeCard>
      ))}
    </div>
  );
}
