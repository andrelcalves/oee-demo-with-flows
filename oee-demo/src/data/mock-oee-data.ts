import type {
  AreaHealthGroup,
  AreaMetric,
  DashboardKpis,
  Equipment,
  ProductionLoss,
  ProductionTrendPoint,
  QualityTrendPoint,
} from '@/types/oee';

export const MOCK_DASHBOARD_KPIS: DashboardKpis = {
  overallOee: 54,
  availability: 80,
  performance: 75,
  quality: 90,
  monthlyProductionLoss: 954,
  dailyProductionTons: 954,
  dailyTargetTons: 1100,
  dailyForecastTons: 937,
  plantStatus: 'Running',
};

export const MOCK_AREA_HEALTH: AreaHealthGroup[] = [
  {
    areaName: 'Pre Reaction',
    equipmentType: 'Pump',
    availableCount: 1,
    totalCount: 2,
    availability: 83,
  },
  {
    areaName: 'Reaction',
    equipmentType: 'Compressor',
    availableCount: 2,
    totalCount: 2,
    availability: 100,
  },
  {
    areaName: 'Absorption',
    equipmentType: 'Cooler',
    availableCount: 1,
    totalCount: 3,
    availability: 67,
  },
];

export const MOCK_EQUIPMENT: Equipment[] = [
  {
    equipmentId: 'Pump-101A',
    description: 'Feed Transfer Pump A for pre-reaction',
    areaName: 'Pre Reaction',
    equipmentType: 'Pump',
    availability: 100,
    quality: 89,
  },
  {
    equipmentId: 'Pump-101B',
    description: 'Feed Transfer Pump B for pre-reaction',
    areaName: 'Pre Reaction',
    equipmentType: 'Pump',
    availability: 0,
    quality: 78,
  },
];

export const MOCK_PRODUCTION_LOSSES: ProductionLoss[] = [
  { category: 'Mechanical Failure', value: 600, section: 'availability' },
  { category: 'Planned Maintenance', value: 200, section: 'availability' },
  { category: 'Speed Loss', value: 450, section: 'performance' },
  { category: 'Minor Stops', value: 180, section: 'performance' },
  { category: 'Off-Spec Product', value: 320, section: 'quality' },
  { category: 'Rework', value: 150, section: 'quality' },
];

export const MOCK_PRODUCTION_TREND: ProductionTrendPoint[] = [
  { timestamp: '2026-05-20T08:00:00Z', averageHourlyProduction: 42, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-21T08:00:00Z', averageHourlyProduction: 44, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-22T08:00:00Z', averageHourlyProduction: 41, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-23T08:00:00Z', averageHourlyProduction: 45, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-24T08:00:00Z', averageHourlyProduction: 43, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-25T08:00:00Z', averageHourlyProduction: 40, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-26T08:00:00Z', averageHourlyProduction: 42, targetProduction: 46, maxProduction: 52 },
];

export const MOCK_AREA_PRODUCTION_RATES: AreaMetric[] = [
  { areaName: 'Pre Reaction', value: 210, unit: 't/d' },
  { areaName: 'Reaction', value: 380, unit: 't/d' },
  { areaName: 'Absorption', value: 364, unit: 't/d' },
];

export const MOCK_AREA_PERFORMANCE: AreaMetric[] = [
  { areaName: 'Pre Reaction', value: 72, unit: '%' },
  { areaName: 'Reaction', value: 78, unit: '%' },
  { areaName: 'Absorption', value: 74, unit: '%' },
];

export const MOCK_QUALITY_TREND: QualityTrendPoint[] = [
  { timestamp: '2026-05-20T08:00:00Z', concentration: 59.2, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-21T08:00:00Z', concentration: 59.8, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-22T08:00:00Z', concentration: 60.1, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-23T08:00:00Z', concentration: 59.5, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-24T08:00:00Z', concentration: 60.4, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-25T08:00:00Z', concentration: 59.9, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-26T08:00:00Z', concentration: 60.2, hiHiLimit: 62, loLoLimit: 57 },
];

export const MOCK_AREA_QUALITY: AreaMetric[] = [
  { areaName: 'Pre Reaction', value: 89, unit: '%' },
  { areaName: 'Reaction', value: 92, unit: '%' },
  { areaName: 'Absorption', value: 88, unit: '%' },
];
