import { Alert, AlertDescription, Button, Card, CardContent, CardHeader, CardTitle, Loader } from '@cognite/aura/components';

import { Breadcrumbs } from '@/components/oee/Breadcrumbs';
import { KpiCard, SummaryCard } from '@/components/oee/KpiCard';
import { LossBar } from '@/components/oee/LossBar';
import { OeeGauge } from '@/components/oee/OeeGauge';
import { ProductionTrendChart } from '@/components/oee/ProductionTrendChart';
import { QualityTrendChart } from '@/components/oee/QualityTrendChart';
import { ThemeToggle } from '@/components/oee/ThemeToggle';
import { formatMetricValue, formatPercent, formatTons } from '@/lib/format';
import { useAppState } from '@/state/AppStateProvider';
import { useOeeDashboardViewModel } from '@/view-models/useOeeDashboardViewModel';

export function OeeDashboardPage() {
  const { navigateToDashboard, navigateToEquipmentList } = useAppState();
  const vm = useOeeDashboardViewModel();

  if (vm.isLoading || !vm.kpis) {
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

  const forecastBelowTarget = vm.kpis.dailyForecastTons < vm.kpis.dailyTargetTons;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-wide">OEE MONITOR</h1>
          <Breadcrumbs
            crumbs={[
              { label: 'Home' },
              { label: 'Oee Monitor', onClick: () => void navigateToDashboard() },
            ]}
          />
        </div>
        <ThemeToggle />
      </header>

      <section className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-start">
        <Card className="flex justify-center p-6">
          <OeeGauge value={vm.kpis.overallOee} />
        </Card>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard title="Availability" value={formatPercent(vm.kpis.availability)} />
          <KpiCard title="Performance" value={formatPercent(vm.kpis.performance)} />
          <KpiCard title="Quality" value={formatPercent(vm.kpis.quality)} />
          <KpiCard
            title="Monthly Production Loss"
            value={formatTons(vm.kpis.monthlyProductionLoss)}
            subtitle="tons"
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Daily Production" value={formatTons(vm.kpis.dailyProductionTons)} />
        <SummaryCard title="Daily Target" value={formatTons(vm.kpis.dailyTargetTons)} />
        <SummaryCard
          title="Daily Forecast"
          value={formatTons(vm.kpis.dailyForecastTons)}
          belowTarget={forecastBelowTarget}
        />
        <SummaryCard title="Plant Status" value={vm.kpis.plantStatus} />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Availability &amp; Health</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ul className="flex flex-col gap-2">
              {vm.areaHealth.map((group) => (
                <li
                  key={`${group.areaName}-${group.equipmentType}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border p-3"
                >
                  <div>
                    <p className="font-medium">
                      {group.areaName} / {group.equipmentType}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {group.availableCount}/{group.totalCount} available ·{' '}
                      {formatPercent(group.availability)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void navigateToEquipmentList(group.areaName, group.equipmentType);
                    }}
                  >
                    View
                  </Button>
                </li>
              ))}
            </ul>
            <LossBar losses={vm.availabilityLosses} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ProductionTrendChart data={vm.productionTrend} />
            <ul className="grid gap-2 text-sm">
              {vm.areaProductionRates.map((metric) => (
                <li key={`prod-${metric.areaName}`} className="flex justify-between">
                  <span>{metric.areaName}</span>
                  <span>{formatMetricValue(metric.value, metric.unit)}</span>
                </li>
              ))}
              {vm.areaPerformance.map((metric) => (
                <li key={`perf-${metric.areaName}`} className="flex justify-between text-muted-foreground">
                  <span>{metric.areaName} performance</span>
                  <span>{formatMetricValue(metric.value, metric.unit)}</span>
                </li>
              ))}
            </ul>
            <LossBar losses={vm.performanceLosses} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <QualityTrendChart data={vm.qualityTrend} />
            <ul className="grid gap-2 text-sm">
              {vm.areaQuality.map((metric) => (
                <li key={`qual-${metric.areaName}`} className="flex justify-between">
                  <span>{metric.areaName}</span>
                  <span>{formatMetricValue(metric.value, metric.unit)}</span>
                </li>
              ))}
            </ul>
            <LossBar losses={vm.qualityLosses} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
