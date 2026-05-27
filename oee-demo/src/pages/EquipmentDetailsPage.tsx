import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription, Card, CardContent, Loader } from '@cognite/aura/components';

import { DiagnosticCard } from '@/components/equipment/DiagnosticCard';
import { SensorMiniChart } from '@/components/equipment/SensorMiniChart';
import { OeeGauge } from '@/components/oee/OeeGauge';
import { OeePageHeader } from '@/components/oee/OeePageHeader';
import { formatPercent } from '@/lib/format';
import { useOeeMetricsService } from '@/services/OeeMetricsServiceContext';
import { useAppState } from '@/state/AppStateProvider';

export function EquipmentDetailsPage() {
  const { state, navigateToDashboard, navigateToEquipmentList } = useAppState();
  const service = useOeeMetricsService();
  const equipmentId = state.equipmentId ?? '';

  const query = useQuery({
    queryKey: ['oee', 'equipment-detail', equipmentId],
    queryFn: () => service.getEquipmentDetail(equipmentId),
    enabled: Boolean(equipmentId),
  });

  const areaName = state.areaName ?? 'Pre Reaction';
  const equipmentType = state.equipmentType ?? 'Turbine';

  if (query.isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader size={24} />
      </div>
    );
  }

  const detail = query.data;

  if (!detail) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <Alert>
          <AlertDescription>Equipment not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const kpiTiles = [
    { label: 'Operating Time', value: `${detail.kpis.operatingTimeDays} days` },
    { label: 'MTBF', value: `${detail.kpis.mtbfDays} days` },
    { label: 'Availability', value: formatPercent(detail.kpis.availability) },
    { label: 'Days Since Last Failure', value: `${detail.kpis.daysSinceLastFailure} days` },
    { label: 'Last Failure', value: detail.kpis.lastFailureDate },
    { label: 'MTTR', value: `${detail.kpis.mttrDays} days` },
    {
      label: 'Failure rate',
      value: `${detail.kpis.failureRatePerMonth} per month`,
    },
    {
      label: 'Probability of Failure in 30 Days',
      value: formatPercent(detail.kpis.failureProbability30Days),
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 p-4 md:p-6">
      <OeePageHeader
        title={`OEE MONITOR / Equipment / ${detail.equipment.equipmentId}`}
        crumbs={[
          { label: 'Home' },
          { label: 'Oee Monitor', onClick: () => void navigateToDashboard() },
          {
            label: 'Equipment',
            onClick: () => {
              void navigateToEquipmentList(areaName, equipmentType);
            },
          },
          { label: detail.equipment.equipmentId },
        ]}
      />

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {kpiTiles.map((tile) => (
          <Card key={tile.label} className="border-border">
            <CardContent className="px-4 py-3">
              <p className="text-xs text-muted-foreground">{tile.label}</p>
              <p className="text-sm font-semibold">{tile.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {detail.sensorCharts.map((chart) => (
            <SensorMiniChart key={chart.id} chart={chart} />
          ))}
        </div>

        <aside className="flex flex-col gap-3">
          <Card className="border-border">
            <CardContent className="flex flex-col items-center py-4">
              <p className="mb-2 text-sm font-medium">Overall Health</p>
              <OeeGauge value={detail.kpis.overallHealth} size="md" variant="quality" />
            </CardContent>
          </Card>
          {detail.diagnostics.map((diagnostic) => (
            <DiagnosticCard key={diagnostic.id} diagnostic={diagnostic} />
          ))}
        </aside>
      </div>
    </div>
  );
}
