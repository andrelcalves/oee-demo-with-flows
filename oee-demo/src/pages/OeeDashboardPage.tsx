import { Alert, AlertDescription, Loader } from '@cognite/aura/components';

import { AreaHealthPanel } from '@/components/oee/AreaHealthPanel';
import { AreaMetricsRow } from '@/components/oee/AreaMetricsRow';
import { DailyStatusBar } from '@/components/oee/DailyStatusBar';
import { KpiGaugeCard } from '@/components/oee/KpiGaugeCard';
import { LossBar } from '@/components/oee/LossBar';
import { LossKpiCard } from '@/components/oee/LossKpiCard';
import { OeePageHeader } from '@/components/oee/OeePageHeader';
import { PerformanceTopMetrics } from '@/components/oee/PerformanceTopMetrics';
import { ProductionTrendChart } from '@/components/oee/ProductionTrendChart';
import { QualityTrendChart } from '@/components/oee/QualityTrendChart';
import { useAppState } from '@/state/AppStateProvider';
import { useOeeDashboardViewModel } from '@/view-models/useOeeDashboardViewModel';

const SECTION_TITLE = 'text-xs font-semibold uppercase tracking-wide text-foreground';

export function OeeDashboardPage() {
  const { navigateToDashboard, navigateToEquipmentList } = useAppState();
  const vm = useOeeDashboardViewModel();

  if (vm.isLoading || !vm.kpis || !vm.lossBreakdown) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader size={24} />
      </div>
    );
  }

  if (vm.isError) {
    return (
      <Alert>
        <AlertDescription>Failed to load OEE dashboard data.</AlertDescription>
      </Alert>
    );
  }

  const trendSeed = vm.productionTrend[0];

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 p-4 md:p-6">
      <OeePageHeader
        title="OEE MONITOR"
        showStatusWidget
        crumbs={[
          { label: 'Home' },
          { label: 'Oee Monitor', onClick: () => void navigateToDashboard() },
        ]}
      />

      <section className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.8fr]">
        <KpiGaugeCard title="Overall OEE" value={vm.kpis.overallOee} variant="hero" />
        <KpiGaugeCard title="Availability" value={vm.kpis.availability} variant="availability" />
        <KpiGaugeCard title="Performance" value={vm.kpis.performance} variant="performance" />
        <KpiGaugeCard title="Quality" value={vm.kpis.quality} variant="quality" />
        <LossKpiCard breakdown={vm.lossBreakdown} />
      </section>

      <DailyStatusBar kpis={vm.kpis} />

      <section className="grid gap-3 xl:grid-cols-3">
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <h2 className={SECTION_TITLE}>Availability &amp; Health</h2>
            <div className="mt-3">
              <AreaHealthPanel
                sections={vm.areaSections}
                onEquipmentClick={(areaName, equipmentType) => {
                  void navigateToEquipmentList(areaName, equipmentType);
                }}
              />
            </div>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <p className="mb-3 text-xs font-medium text-muted-foreground">Monthly Production Loss</p>
            <LossBar losses={vm.availabilityLosses} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <h2 className={SECTION_TITLE}>Performance</h2>
            <div className="mt-3 flex flex-col gap-3">
              <PerformanceTopMetrics
                averageHourly={trendSeed?.averageHourlyProduction ?? 0}
                target={trendSeed?.targetProduction ?? 0}
                max={trendSeed?.maxProduction ?? 0}
              />
              <ProductionTrendChart data={vm.productionTrend} />
            </div>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <p className="mb-3 text-xs font-medium">Production Rate by Area</p>
            <AreaMetricsRow metrics={vm.areaProductionRates} />
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <p className="mb-3 text-xs font-medium text-muted-foreground">Monthly Production Loss</p>
            <LossBar losses={vm.performanceLosses} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <h2 className={SECTION_TITLE}>Quality</h2>
            <div className="mt-3 flex flex-col gap-3">
              <p className="text-[11px] font-medium">Final Concentration of Nitric Acid</p>
              <QualityTrendChart data={vm.qualityTrend} />
            </div>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <p className="mb-3 text-xs font-medium">Quality Parameters per Area</p>
            <AreaMetricsRow metrics={vm.areaQuality} />
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <p className="mb-3 text-xs font-medium text-muted-foreground">Monthly Production Loss</p>
            <LossBar losses={vm.qualityLosses} />
          </div>
        </div>
      </section>
    </div>
  );
}
