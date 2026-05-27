/**
 * OEE Atlas client tools.
 *
 * Each tool is a thin adapter over `OeeMetricsService` — no business logic, no
 * duplicate mock data. Outputs are short human-readable summaries the agent can
 * cite verbatim; `details` carries the same payload as structured JSON for UI
 * use cases (e.g. rendering tables).
 */

import { Type, type Static } from '@sinclair/typebox';

import type { AtlasTool } from '@/atlas-agent/types';
import type { OeeMetricsService } from '@/services/OeeMetricsService';
import type {
  AreaMetric,
  AreaSection,
  DashboardKpis,
  Equipment,
  EquipmentDetail,
  LossSection,
  MonthlyLossBreakdown,
  ProductionLoss,
  ProductionTrendPoint,
  QualityTrendPoint,
} from '@/types/oee';

import { days, joinLines, pct, tons } from './formatters';

// ============================================================================
// 1. get_oee_dashboard
// ============================================================================

const DashboardParams = Type.Object({});

type DashboardDetails = {
  kpis: DashboardKpis;
  monthlyLoss: MonthlyLossBreakdown;
};

function buildDashboardOutput(kpis: DashboardKpis, loss: MonthlyLossBreakdown): string {
  return joinLines([
    'Overall OEE snapshot:',
    `- Overall OEE: ${pct(kpis.overallOee)}`,
    `- Availability: ${pct(kpis.availability)}`,
    `- Performance: ${pct(kpis.performance)}`,
    `- Quality: ${pct(kpis.quality)}`,
    `Daily production: ${tons(kpis.dailyProductionTons)} (target ${tons(kpis.dailyTargetTons)}, forecast ${tons(kpis.dailyForecastTons)}, status ${kpis.plantStatus})`,
    `Monthly production loss: ${tons(kpis.monthlyProductionLoss)} — availability ${tons(loss.availability)}, performance ${tons(loss.performance)}, quality ${tons(loss.quality)}.`,
  ]);
}

function createDashboardTool(service: OeeMetricsService): AtlasTool<typeof DashboardParams, DashboardDetails> {
  return {
    name: 'get_oee_dashboard',
    description:
      'Return overall OEE plus availability/performance/quality KPIs, daily production vs target vs forecast, plant status, and the current monthly production loss split (availability/performance/quality in tons). Call this when the user asks about the overall plant or wants a summary.',
    parameters: DashboardParams,
    execute: async () => {
      const [kpis, monthlyLoss] = await Promise.all([
        service.getDashboardKpis(),
        service.getMonthlyLossBreakdown(),
      ]);
      return {
        output: buildDashboardOutput(kpis, monthlyLoss),
        details: { kpis, monthlyLoss },
      };
    },
  };
}

// ============================================================================
// 2. get_availability_health
// ============================================================================

const AvailabilityHealthParams = Type.Object({});

type AvailabilityHealthDetails = { areas: AreaSection[] };

function buildAvailabilityHealthOutput(areas: AreaSection[]): string {
  const lines: string[] = ['Equipment availability by area:'];
  for (const area of areas) {
    lines.push(`- ${area.areaName}:`);
    for (const item of area.equipment) {
      lines.push(
        `  • ${item.equipmentType}: ${item.availableCount}/${item.totalCount} available (${pct(item.availability)})`,
      );
    }
  }
  return joinLines(lines);
}

function createAvailabilityHealthTool(
  service: OeeMetricsService,
): AtlasTool<typeof AvailabilityHealthParams, AvailabilityHealthDetails> {
  return {
    name: 'get_availability_health',
    description:
      'Return the availability section of the dashboard: for each plant area (Air, Ammonia Burn, Oxi-Absorption) list every equipment type with available/total counts and availability percent. Use this to answer "what is currently down?" or "how is area X doing?".',
    parameters: AvailabilityHealthParams,
    execute: async () => {
      const areas = await service.getAreaSections();
      return { output: buildAvailabilityHealthOutput(areas), details: { areas } };
    },
  };
}

// ============================================================================
// 3. get_production_losses
// ============================================================================

const ProductionLossesParams = Type.Object({
  section: Type.Union(
    [
      Type.Literal('availability'),
      Type.Literal('performance'),
      Type.Literal('quality'),
    ],
    {
      description:
        'Which OEE pillar to break down losses for. Use "availability" for downtime causes, "performance" for speed losses, "quality" for off-spec / rework causes.',
    },
  ),
});

type ProductionLossesDetails = { section: LossSection; losses: ProductionLoss[] };

function buildProductionLossesOutput(section: LossSection, losses: ProductionLoss[]): string {
  const total = losses.reduce((sum, loss) => sum + loss.value, 0);
  const lines: string[] = [`${capitalize(section)} losses (total ${tons(total)} this month):`];
  for (const loss of losses) {
    lines.push(`- ${loss.category}: ${tons(loss.value)}`);
  }
  return joinLines(lines);
}

function createProductionLossesTool(
  service: OeeMetricsService,
): AtlasTool<typeof ProductionLossesParams, ProductionLossesDetails> {
  return {
    name: 'get_production_losses',
    description:
      'Return the production-loss breakdown for a single OEE section: availability (downtime causes), performance (speed/throughput losses) or quality (off-spec/rework). Use this when the user asks "where are we losing tons?" or "what are the top three downtime causes?".',
    parameters: ProductionLossesParams,
    execute: async (args: Static<typeof ProductionLossesParams>) => {
      const losses = await service.getProductionLosses(args.section);
      return {
        output: buildProductionLossesOutput(args.section, losses),
        details: { section: args.section, losses },
      };
    },
  };
}

// ============================================================================
// 4. get_production_trends
// ============================================================================

const ProductionTrendsParams = Type.Object({});

type ProductionTrendsDetails = {
  trend: ProductionTrendPoint[];
  areaRates: AreaMetric[];
};

function buildProductionTrendsOutput(
  trend: ProductionTrendPoint[],
  areaRates: AreaMetric[],
): string {
  if (trend.length === 0) {
    return 'No production trend data available.';
  }
  const first = trend[0];
  const last = trend[trend.length - 1];
  const average =
    trend.reduce((sum, p) => sum + p.averageHourlyProduction, 0) / trend.length;
  const target = last.targetProduction;
  const max = last.maxProduction;

  const lines: string[] = [
    'Production trend (hourly average vs target):',
    `- Period: ${first.timestamp} → ${last.timestamp} (${trend.length} samples)`,
    `- Latest hourly production: ${last.averageHourlyProduction.toFixed(1)} t/h (target ${target.toFixed(1)}, max ${max.toFixed(1)})`,
    `- Average across period: ${average.toFixed(1)} t/h`,
    'Production rate by area:',
  ];
  for (const area of areaRates) {
    const performance =
      area.performancePercent !== undefined
        ? ` (${pct(area.performancePercent)} of target)`
        : '';
    lines.push(`  • ${area.areaName}: ${area.value.toFixed(1)} ${area.unit}${performance}`);
  }
  return joinLines(lines);
}

function createProductionTrendsTool(
  service: OeeMetricsService,
): AtlasTool<typeof ProductionTrendsParams, ProductionTrendsDetails> {
  return {
    name: 'get_production_trends',
    description:
      'Return the hourly production trend (average vs target vs max) plus the per-area production rate / target performance. Use this when the user asks how production is trending or which area is below target.',
    parameters: ProductionTrendsParams,
    execute: async () => {
      const [trend, areaRates] = await Promise.all([
        service.getProductionTrend(),
        service.getAreaProductionRates(),
      ]);
      return {
        output: buildProductionTrendsOutput(trend, areaRates),
        details: { trend, areaRates },
      };
    },
  };
}

// ============================================================================
// 5. get_quality_metrics
// ============================================================================

const QualityMetricsParams = Type.Object({});

type QualityMetricsDetails = {
  trend: QualityTrendPoint[];
  areaQuality: AreaMetric[];
};

function buildQualityMetricsOutput(
  trend: QualityTrendPoint[],
  areaQuality: AreaMetric[],
): string {
  if (trend.length === 0) {
    return 'No quality trend data available.';
  }
  const last = trend[trend.length - 1];
  const lines: string[] = [
    'Quality trend (concentration vs limits):',
    `- Latest sample: ${last.timestamp} → ${last.concentration.toFixed(2)} (lo-lo ${last.loLoLimit.toFixed(2)}, hi-hi ${last.hiHiLimit.toFixed(2)})`,
    'Quality parameters by area:',
  ];
  for (const area of areaQuality) {
    const performance =
      area.performancePercent !== undefined
        ? ` (${pct(area.performancePercent)} of spec)`
        : '';
    lines.push(`  • ${area.areaName}: ${area.value.toFixed(2)} ${area.unit}${performance}`);
  }
  return joinLines(lines);
}

function createQualityMetricsTool(
  service: OeeMetricsService,
): AtlasTool<typeof QualityMetricsParams, QualityMetricsDetails> {
  return {
    name: 'get_quality_metrics',
    description:
      'Return the latest quality trend (concentration vs hi-hi / lo-lo limits) and the per-area quality parameters. Use this when the user asks why quality is low or which area is off-spec.',
    parameters: QualityMetricsParams,
    execute: async () => {
      const [trend, areaQuality] = await Promise.all([
        service.getQualityTrend(),
        service.getAreaQualityParameters(),
      ]);
      return {
        output: buildQualityMetricsOutput(trend, areaQuality),
        details: { trend, areaQuality },
      };
    },
  };
}

// ============================================================================
// 6. get_equipment_list
// ============================================================================

const EquipmentListParams = Type.Object({
  areaName: Type.String({
    description: 'Plant area (e.g. "Air", "Ammonia Burn", "Oxi-Absorption").',
  }),
  equipmentType: Type.String({
    description: 'Equipment type within the area (e.g. "Compressor", "Turbine", "Burner").',
  }),
});

type EquipmentListDetails = { equipment: Equipment[] };

function buildEquipmentListOutput(
  areaName: string,
  equipmentType: string,
  equipment: Equipment[],
): string {
  if (equipment.length === 0) {
    return `No equipment found for area "${areaName}" / type "${equipmentType}".`;
  }
  const lines: string[] = [
    `${equipmentType} units in ${areaName} (${equipment.length}):`,
  ];
  for (const item of equipment) {
    lines.push(
      `- ${item.equipmentId} — health ${pct(item.overallHealth)}, availability ${pct(item.availability)}, quality ${pct(item.quality)}, ${days(item.daysSinceLastFailure)} since last failure`,
    );
  }
  return joinLines(lines);
}

function createEquipmentListTool(
  service: OeeMetricsService,
): AtlasTool<typeof EquipmentListParams, EquipmentListDetails> {
  return {
    name: 'get_equipment_list',
    description:
      'Return the list of equipment matching an area + equipment type, including overall health, availability, quality and days since last failure. Use this when the user asks about a specific area/type pair, e.g. "show me the compressors in Air".',
    parameters: EquipmentListParams,
    execute: async (args: Static<typeof EquipmentListParams>) => {
      const equipment = await service.getEquipment(args.areaName, args.equipmentType);
      return {
        output: buildEquipmentListOutput(args.areaName, args.equipmentType, equipment),
        details: { equipment },
      };
    },
  };
}

// ============================================================================
// 7. get_equipment_detail
// ============================================================================

const EquipmentDetailParams = Type.Object({
  equipmentId: Type.String({
    description: 'Equipment identifier (e.g. "Turbine 1", "Compressor 2").',
  }),
});

type EquipmentDetailDetails = { detail: EquipmentDetail };

function buildEquipmentDetailOutput(detail: EquipmentDetail): string {
  const { equipment, kpis, sensorCharts, diagnostics } = detail;
  const lines: string[] = [
    `${equipment.equipmentId} — ${equipment.description}`,
    `Area: ${equipment.areaName} / Type: ${equipment.equipmentType}`,
    `Health: ${pct(kpis.overallHealth)} (availability ${pct(kpis.availability)})`,
    `Operating time: ${days(kpis.operatingTimeDays)}, MTBF: ${days(kpis.mtbfDays)}, MTTR: ${days(kpis.mttrDays)}`,
    `Last failure: ${kpis.lastFailureDate} (${days(kpis.daysSinceLastFailure)} ago)`,
    `Failure rate: ${kpis.failureRatePerMonth.toFixed(2)} / month, 30-day failure probability: ${pct(kpis.failureProbability30Days * 100)}`,
  ];

  if (sensorCharts.length > 0) {
    lines.push('Sensors:');
    for (const chart of sensorCharts) {
      const last = chart.data[chart.data.length - 1];
      const lastValue = last ? ` (latest ${last.value.toFixed(2)}, baseline ${last.baseline.toFixed(2)})` : '';
      lines.push(`  • ${chart.title} — ${chart.status}${lastValue}`);
    }
  }

  if (diagnostics.length > 0) {
    lines.push('Diagnostics:');
    for (const card of diagnostics) {
      lines.push(`  • ${card.title}: ${pct(card.probability)} probability (${card.status})`);
      for (const factor of card.factors) {
        lines.push(`    - ${factor.label}: ${pct(factor.percent)} (${factor.status})`);
      }
    }
  }

  return joinLines(lines);
}

function createEquipmentDetailTool(
  service: OeeMetricsService,
): AtlasTool<typeof EquipmentDetailParams, EquipmentDetailDetails> {
  return {
    name: 'get_equipment_detail',
    description:
      'Return the detailed KPI block, sensor readings and diagnostic factors for a single piece of equipment. Use this when the user is on the equipment-details page or asks about a specific equipment ID.',
    parameters: EquipmentDetailParams,
    execute: async (args: Static<typeof EquipmentDetailParams>) => {
      const detail = await service.getEquipmentDetail(args.equipmentId);
      if (!detail) {
        return {
          output: `No equipment found with id "${args.equipmentId}".`,
        };
      }
      return { output: buildEquipmentDetailOutput(detail), details: { detail } };
    },
  };
}

// ============================================================================
// Factory
// ============================================================================

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Build the full OEE Atlas tool array for the given metrics service.
 *
 * Each tool calls existing methods on `OeeMetricsService` — never duplicates the
 * mock data — so the same toolset works for the mock service today and for a
 * real CDF-backed service later without changes here.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createOeeAtlasTools(service: OeeMetricsService): AtlasTool<any, any>[] {
  return [
    createDashboardTool(service),
    createAvailabilityHealthTool(service),
    createProductionLossesTool(service),
    createProductionTrendsTool(service),
    createQualityMetricsTool(service),
    createEquipmentListTool(service),
    createEquipmentDetailTool(service),
  ];
}
