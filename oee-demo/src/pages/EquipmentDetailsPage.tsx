import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription, Loader } from '@cognite/aura/components';

import { DiagnosticCard } from '@/components/equipment/DiagnosticCard';
import { EquipmentDetailKpiBar } from '@/components/equipment/EquipmentDetailKpiBar';
import { SensorMiniChart } from '@/components/equipment/SensorMiniChart';
import { OeeCard } from '@/components/oee/OeeCard';
import { OeeGauge } from '@/components/oee/OeeGauge';
import { OeePageHeader } from '@/components/oee/OeePageHeader';
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

      <EquipmentDetailKpiBar kpis={detail.kpis} />

      <div className="grid gap-4 xl:grid-cols-[1fr_minmax(280px,360px)]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {detail.sensorCharts.map((chart) => (
            <SensorMiniChart key={chart.id} chart={chart} />
          ))}
        </div>

        <aside className="flex w-full flex-col gap-3">
          <OeeCard className="flex flex-col items-center py-4">
            <p className="mb-3 text-sm font-medium">Overall Health</p>
            <OeeGauge
              value={detail.kpis.overallHealth}
              size="md"
              variant="neutral"
              colorByValue
              ariaLabel="Overall health"
            />
          </OeeCard>
          {detail.diagnostics.map((diagnostic) => (
            <DiagnosticCard key={diagnostic.id} diagnostic={diagnostic} />
          ))}
        </aside>
      </div>
    </div>
  );
}
