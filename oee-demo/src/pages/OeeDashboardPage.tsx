import { Alert, AlertDescription, Loader } from '@cognite/aura/components';

import { AreaHealthPanel } from '@/components/oee/AreaHealthPanel';
import { AreaMetricsRow } from '@/components/oee/AreaMetricsRow';
import { DailyStatusBar } from '@/components/oee/DailyStatusBar';
import { KpiGaugeCard } from '@/components/oee/KpiGaugeCard';
import { LossKpiCard } from '@/components/oee/LossKpiCard';
import { MonthlyLossCard } from '@/components/oee/MonthlyLossCard';
import { OeeCard } from '@/components/oee/OeeCard';
import { OeePageHeader } from '@/components/oee/OeePageHeader';
import { PerformanceTopMetrics } from '@/components/oee/PerformanceTopMetrics';
import { ProductionTrendChart } from '@/components/oee/ProductionTrendChart';
import { QualityTrendChart } from '@/components/oee/QualityTrendChart';
import { cn } from '@/lib/utils';
import { useAppState } from '@/state/AppStateProvider';
import { useOeeDashboardViewModel } from '@/view-models/useOeeDashboardViewModel';
import type { AreaSection, ProductionLoss, ProductionTrendPoint } from '@/types/oee';

const SECTION_TITLE = 'text-xs font-semibold uppercase tracking-wide text-foreground';

type DashboardSectionsProps = {
  areaSections: AreaSection[];
  productionTrend: ProductionTrendPoint[];
  trendSeed: ProductionTrendPoint | undefined;
  areaProductionRates: ReturnType<typeof useOeeDashboardViewModel>['areaProductionRates'];
  areaQuality: ReturnType<typeof useOeeDashboardViewModel>['areaQuality'];
  availabilityLosses: ProductionLoss[];
  performanceLosses: ProductionLoss[];
  qualityLosses: ProductionLoss[];
  onEquipmentClick: (areaName: string, equipmentType: string) => void;
};

function AvailabilityHealthCard({
  areaSections,
  onEquipmentClick,
  fillHeight = false,
}: Pick<DashboardSectionsProps, 'areaSections' | 'onEquipmentClick'> & {
  fillHeight?: boolean;
}) {
  return (
    <OeeCard className={cn(fillHeight && 'flex h-full min-h-0 flex-col')}>
      <h2 className={SECTION_TITLE}>
        <span className="border-b-2 border-[var(--oee-purple-500)] pb-0.5">Availability</span>
        {' '}
        &amp; Health
      </h2>
      <div className={cn('mt-3', fillHeight && 'flex min-h-0 flex-1 flex-col')}>
        <AreaHealthPanel
          sections={areaSections}
          onEquipmentClick={onEquipmentClick}
          fillHeight={fillHeight}
        />
      </div>
    </OeeCard>
  );
}

function PerformanceCard({
  productionTrend,
  trendSeed,
}: Pick<DashboardSectionsProps, 'productionTrend' | 'trendSeed'>) {
  return (
    <OeeCard>
      <h2 className={SECTION_TITLE}>Performance</h2>
      <div className="mt-3 flex flex-col gap-3">
        <PerformanceTopMetrics
          averageHourly={trendSeed?.averageHourlyProduction ?? 0}
          target={trendSeed?.targetProduction ?? 0}
          max={trendSeed?.maxProduction ?? 0}
        />
        <ProductionTrendChart data={productionTrend} />
      </div>
    </OeeCard>
  );
}

function QualityChartCard({
  qualityTrend,
}: {
  qualityTrend: ReturnType<typeof useOeeDashboardViewModel>['qualityTrend'];
}) {
  return (
    <OeeCard>
      <h2 className={SECTION_TITLE}>Quality</h2>
      <div className="mt-3 flex flex-col gap-3">
        <p className="text-[11px] font-medium">Final Concentration of Nitric Acid</p>
        <QualityTrendChart data={qualityTrend} />
      </div>
    </OeeCard>
  );
}

function DashboardSections({
  areaSections,
  productionTrend,
  trendSeed,
  areaProductionRates,
  areaQuality,
  qualityTrend,
  availabilityLosses,
  performanceLosses,
  qualityLosses,
  onEquipmentClick,
}: DashboardSectionsProps & {
  qualityTrend: ReturnType<typeof useOeeDashboardViewModel>['qualityTrend'];
}) {
  return (
    <>
      <div className="row-span-2 flex min-h-0 flex-col self-stretch">
        <AvailabilityHealthCard
          areaSections={areaSections}
          onEquipmentClick={onEquipmentClick}
          fillHeight
        />
      </div>
      <div className="self-start">
        <PerformanceCard productionTrend={productionTrend} trendSeed={trendSeed} />
      </div>
      <div className="self-start">
        <QualityChartCard qualityTrend={qualityTrend} />
      </div>
      <OeeCard>
        <p className="mb-3 text-xs font-medium">Production Rate by Area</p>
        <AreaMetricsRow metrics={areaProductionRates} />
      </OeeCard>
      <OeeCard>
        <p className="mb-3 text-xs font-medium">Quality Parameters per Area</p>
        <AreaMetricsRow metrics={areaQuality} />
      </OeeCard>
      <MonthlyLossCard losses={availabilityLosses} />
      <MonthlyLossCard losses={performanceLosses} />
      <MonthlyLossCard losses={qualityLosses} />
    </>
  );
}

function MobileDashboardColumns(props: DashboardSectionsProps & {
  qualityTrend: ReturnType<typeof useOeeDashboardViewModel>['qualityTrend'];
}) {
  return (
    <div className="grid gap-3 xl:hidden">
      <div className="flex flex-col gap-3">
        <AvailabilityHealthCard
          areaSections={props.areaSections}
          onEquipmentClick={props.onEquipmentClick}
        />
        <MonthlyLossCard losses={props.availabilityLosses} />
      </div>
      <div className="flex flex-col gap-3">
        <PerformanceCard productionTrend={props.productionTrend} trendSeed={props.trendSeed} />
        <OeeCard>
          <p className="mb-3 text-xs font-medium">Production Rate by Area</p>
          <AreaMetricsRow metrics={props.areaProductionRates} />
        </OeeCard>
        <MonthlyLossCard losses={props.performanceLosses} />
      </div>
      <div className="flex flex-col gap-3">
        <QualityChartCard qualityTrend={props.qualityTrend} />
        <OeeCard>
          <p className="mb-3 text-xs font-medium">Quality Parameters per Area</p>
          <AreaMetricsRow metrics={props.areaQuality} />
        </OeeCard>
        <MonthlyLossCard losses={props.qualityLosses} />
      </div>
    </div>
  );
}

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
  const sectionProps: DashboardSectionsProps = {
    areaSections: vm.areaSections,
    productionTrend: vm.productionTrend,
    trendSeed,
    areaProductionRates: vm.areaProductionRates,
    areaQuality: vm.areaQuality,
    availabilityLosses: vm.availabilityLosses,
    performanceLosses: vm.performanceLosses,
    qualityLosses: vm.qualityLosses,
    onEquipmentClick: (areaName, equipmentType) => {
      void navigateToEquipmentList(areaName, equipmentType);
    },
  };

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

      <section>
        <MobileDashboardColumns {...sectionProps} qualityTrend={vm.qualityTrend} />
        <div className="hidden gap-3 xl:grid xl:grid-cols-3 xl:items-start">
          <DashboardSections {...sectionProps} qualityTrend={vm.qualityTrend} />
        </div>
      </section>
    </div>
  );
}
