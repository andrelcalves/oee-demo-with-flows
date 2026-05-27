import type {
  AreaMetric,
  AreaSection,
  DashboardKpis,
  DiagnosticCard,
  Equipment,
  EquipmentDetail,
  EquipmentDetailKpis,
  MonthlyLossBreakdown,
  ProductionLoss,
  ProductionTrendPoint,
  QualityTrendPoint,
  SensorChart,
} from '@/types/oee';

export const MOCK_DASHBOARD_KPIS: DashboardKpis = {
  overallOee: 54,
  availability: 80,
  performance: 75,
  quality: 90,
  monthlyProductionLoss: 2520,
  dailyProductionTons: 954,
  dailyTargetTons: 1100,
  dailyForecastTons: 937,
  plantStatus: 'In Production',
};

export const MOCK_MONTHLY_LOSS_BREAKDOWN: MonthlyLossBreakdown = {
  availability: 1470,
  performance: 510,
  quality: 540,
};

export const MOCK_AREA_SECTIONS: AreaSection[] = [
  {
    areaName: 'Pre Reaction',
    equipment: [
      { equipmentType: 'Pump', availability: 89, availableCount: 2, totalCount: 3 },
      { equipmentType: 'Compressor', availability: 93, availableCount: 1, totalCount: 1 },
      { equipmentType: 'Mixer', availability: 99, availableCount: 1, totalCount: 1 },
      { equipmentType: 'Turbine', availability: 57, availableCount: 1, totalCount: 2 },
    ],
  },
  {
    areaName: 'Reaction and Heat Recovery',
    equipment: [
      { equipmentType: 'Pump', availability: 45, availableCount: 1, totalCount: 3 },
      { equipmentType: 'Boiler', availability: 98, availableCount: 1, totalCount: 1 },
      { equipmentType: 'Reactor', availability: 76, availableCount: 1, totalCount: 1 },
      { equipmentType: 'Heat Exchanger', availability: 79, availableCount: 2, totalCount: 2 },
    ],
  },
  {
    areaName: 'Oxi-Absorption',
    equipment: [
      { equipmentType: 'Pump', availability: 72, availableCount: 4, totalCount: 6 },
      { equipmentType: 'Column', availability: 98, availableCount: 2, totalCount: 2 },
      { equipmentType: 'Compressor', availability: 67, availableCount: 1, totalCount: 2 },
    ],
  },
];

export const MOCK_EQUIPMENT: Equipment[] = [
  {
    equipmentId: 'Turbine 1',
    description: 'Pre-reaction turbine train A',
    areaName: 'Pre Reaction',
    equipmentType: 'Turbine',
    availability: 98,
    quality: 57,
    overallHealth: 57,
    operatingTimeDays: 348,
    mtbfDays: 87,
    daysSinceLastFailure: 25,
  },
  {
    equipmentId: 'Turbine 2',
    description: 'Pre-reaction turbine train B',
    areaName: 'Pre Reaction',
    equipmentType: 'Turbine',
    availability: 91,
    quality: 32,
    overallHealth: 32,
    operatingTimeDays: 341,
    mtbfDays: 80,
    daysSinceLastFailure: 20,
  },
  {
    equipmentId: 'Pump-101A',
    description: 'Feed Transfer Pump A for pre-reaction',
    areaName: 'Pre Reaction',
    equipmentType: 'Pump',
    availability: 100,
    quality: 89,
    overallHealth: 89,
    operatingTimeDays: 320,
    mtbfDays: 72,
    daysSinceLastFailure: 14,
  },
  {
    equipmentId: 'Pump-101B',
    description: 'Feed Transfer Pump B for pre-reaction',
    areaName: 'Pre Reaction',
    equipmentType: 'Pump',
    availability: 0,
    quality: 78,
    overallHealth: 45,
    operatingTimeDays: 298,
    mtbfDays: 65,
    daysSinceLastFailure: 42,
  },
];

export const MOCK_PRODUCTION_LOSSES: ProductionLoss[] = [
  { category: 'Electrical Failure', value: 600, section: 'availability' },
  { category: 'Automation Failure', value: 450, section: 'availability' },
  { category: 'Mechanical Failure', value: 360, section: 'availability' },
  { category: 'Planned Maintenance', value: 200, section: 'availability' },
  { category: 'Turnover', value: 0, section: 'availability' },
  { category: 'Planned Activities', value: 300, section: 'performance' },
  { category: 'Setup', value: 120, section: 'performance' },
  { category: 'Unexpected Outage', value: 60, section: 'performance' },
  { category: 'Low Yield', value: 30, section: 'performance' },
  { category: 'Spec Build', value: 240, section: 'quality' },
  { category: 'Reprocessing', value: 150, section: 'quality' },
  { category: 'Product Out of Spec', value: 150, section: 'quality' },
];

const SENSOR_TIMESTAMPS = [
  '2026-05-26T08:00:00Z',
  '2026-05-26T09:00:00Z',
  '2026-05-26T10:00:00Z',
  '2026-05-26T11:00:00Z',
  '2026-05-26T12:00:00Z',
  '2026-05-26T13:00:00Z',
  '2026-05-26T14:00:00Z',
];

function sensorData(values: number[], baseline: number) {
  return SENSOR_TIMESTAMPS.map((timestamp, index) => ({
    timestamp,
    value: values[index] ?? baseline,
    baseline,
  }));
}

function chartStatus(health: number, index: number): SensorChart['status'] {
  if (health >= 80) return index % 5 === 0 ? 'yellow' : 'green';
  if (health >= 60) return index % 3 === 0 ? 'red' : 'yellow';
  return index % 2 === 0 ? 'red' : 'yellow';
}

function buildDetailKpis(equipment: Equipment): EquipmentDetailKpis {
  const health = equipment.overallHealth;
  return {
    operatingTimeDays: equipment.operatingTimeDays,
    mtbfDays: equipment.mtbfDays,
    availability: equipment.availability,
    daysSinceLastFailure: equipment.daysSinceLastFailure,
    lastFailureDate: equipment.daysSinceLastFailure > 30 ? '04/02/2024' : '05/10/2024',
    mttrDays: health < 60 ? 2.1 : health < 80 ? 1.5 : 0.85,
    failureRatePerMonth: Math.round(Math.max(0.05, (100 - health) / 150) * 1000) / 1000,
    failureProbability30Days: Math.round(Math.max(8, Math.min(92, 110 - health)) * 10) / 10,
    overallHealth: equipment.overallHealth,
  };
}

const TURBINE_SENSOR_SPECS: Array<{ id: string; title: string; values: number[]; baseline: number }> = [
  { id: 'inlet-pressure', title: 'Inlet Stem Pressure', values: [42, 44, 41, 43, 45, 44, 42], baseline: 43 },
  { id: 'outlet-pressure', title: 'Outlet Stem Pressure', values: [38, 39, 37, 40, 41, 39, 38], baseline: 39 },
  { id: 'bearing-temp', title: 'Bearing Temperature', values: [72, 74, 76, 78, 77, 75, 73], baseline: 74 },
  { id: 'x-vibration', title: 'X-Axis Vibration', values: [5.2, 5.4, 5.6, 5.5, 5.3, 5.1, 5.0], baseline: 5.2 },
  { id: 'y-vibration', title: 'Y-Axis Vibration', values: [3.1, 3.2, 3.0, 3.3, 3.2, 3.1, 3.0], baseline: 3.1 },
  { id: 'z-vibration', title: 'Z-Axis Vibration', values: [2.8, 2.9, 2.7, 2.9, 2.8, 2.7, 2.6], baseline: 2.8 },
  { id: 'inlet-flow', title: 'Inlet Stem Flow', values: [120, 122, 121, 123, 124, 122, 121], baseline: 122 },
  { id: 'outlet-flow', title: 'Outlet Stem Flow', values: [118, 119, 117, 120, 121, 119, 118], baseline: 119 },
  { id: 'casing-temp', title: 'Casing Temperature', values: [65, 66, 67, 68, 67, 66, 65], baseline: 66 },
];

const PUMP_SENSOR_SPECS: Array<{ id: string; title: string; values: number[]; baseline: number }> = [
  { id: 'suction-pressure', title: 'Suction Pressure', values: [28, 29, 27, 30, 29, 28, 27], baseline: 28 },
  { id: 'discharge-pressure', title: 'Discharge Pressure', values: [52, 54, 51, 53, 55, 54, 52], baseline: 53 },
  { id: 'motor-temp', title: 'Motor Temperature', values: [48, 49, 47, 50, 49, 48, 47], baseline: 48 },
  { id: 'bearing-temp', title: 'Bearing Temperature', values: [55, 56, 54, 57, 56, 55, 54], baseline: 55 },
  { id: 'vibration', title: 'Vibration', values: [2.1, 2.2, 2.0, 2.3, 2.1, 2.0, 1.9], baseline: 2.1 },
  { id: 'flow-rate', title: 'Flow Rate', values: [95, 97, 94, 98, 96, 95, 94], baseline: 96 },
  { id: 'motor-current', title: 'Motor Current', values: [42, 43, 41, 44, 43, 42, 41], baseline: 42 },
  { id: 'seal-temp', title: 'Seal Temperature', values: [38, 39, 37, 40, 39, 38, 37], baseline: 38 },
  { id: 'npsh', title: 'NPSH Margin', values: [12, 13, 11, 14, 12, 11, 10], baseline: 12 },
];

function buildSensorCharts(equipment: Equipment): SensorChart[] {
  const specs = equipment.equipmentType === 'Pump' ? PUMP_SENSOR_SPECS : TURBINE_SENSOR_SPECS;
  const prefix = equipment.equipmentId.replace(/\s+/g, '-').toLowerCase();

  return specs.map((spec, index) => ({
    id: `${prefix}-${spec.id}`,
    title: spec.title,
    status: chartStatus(equipment.overallHealth, index),
    data: sensorData(spec.values, spec.baseline),
  }));
}

function buildDiagnostics(equipment: Equipment): DiagnosticCard[] {
  const health = equipment.overallHealth;
  const riskStatus = health >= 80 ? 'green' : health >= 60 ? 'yellow' : 'red';
  const highRisk = health < 60;

  return [
    {
      id: `${equipment.equipmentId}-bearing`,
      title: 'Bearing Wear',
      probability: highRisk ? 68 : health >= 80 ? 8 : 24,
      status: highRisk ? 'red' : health >= 80 ? 'green' : 'yellow',
      factors: [
        { label: 'Vibration', percent: highRisk ? 72 : 15, status: highRisk ? 'red' : 'green' },
        { label: 'Bearing Temp', percent: highRisk ? 55 : 10, status: highRisk ? 'yellow' : 'green' },
      ],
    },
    {
      id: `${equipment.equipmentId}-seal`,
      title: equipment.equipmentType === 'Pump' ? 'Seal Degradation' : 'Pressure Control System Failure',
      probability: highRisk ? 75 : health >= 80 ? 12 : 38,
      status: riskStatus,
      factors: [
        {
          label: equipment.equipmentType === 'Pump' ? 'Discharge Pressure' : 'Inlet Stem Pressure',
          percent: highRisk ? 65 : 20,
          status: highRisk ? 'red' : 'yellow',
        },
        {
          label: equipment.equipmentType === 'Pump' ? 'Suction Pressure' : 'Outlet Stem Pressure',
          percent: highRisk ? 48 : 15,
          status: highRisk ? 'yellow' : 'green',
        },
      ],
    },
    {
      id: `${equipment.equipmentId}-motor`,
      title: equipment.equipmentType === 'Pump' ? 'Motor Overload' : 'Overheating',
      probability: highRisk ? 82 : health >= 80 ? 5 : 42,
      status: highRisk ? 'red' : health >= 80 ? 'green' : 'yellow',
      factors: [
        {
          label: equipment.equipmentType === 'Pump' ? 'Motor Current' : 'Bearing Temperature',
          percent: highRisk ? 88 : 12,
          status: highRisk ? 'red' : 'green',
        },
        {
          label: equipment.equipmentType === 'Pump' ? 'Motor Temperature' : 'Casing Temperature',
          percent: highRisk ? 70 : 18,
          status: highRisk ? 'yellow' : 'green',
        },
      ],
    },
  ];
}

/** Build a full equipment detail payload for any mock equipment row. */
export function buildEquipmentDetail(equipment: Equipment): EquipmentDetail {
  return {
    equipment,
    kpis: buildDetailKpis(equipment),
    sensorCharts: buildSensorCharts(equipment),
    diagnostics: buildDiagnostics(equipment),
  };
}

export const MOCK_TURBINE_1_DETAIL: EquipmentDetail = {
  equipment: MOCK_EQUIPMENT[0],
  kpis: {
    operatingTimeDays: 348,
    mtbfDays: 87,
    availability: 98,
    daysSinceLastFailure: 25,
    lastFailureDate: '05/10/2024',
    mttrDays: 1.75,
    failureRatePerMonth: 0.345,
    failureProbability30Days: 46.9,
    overallHealth: 57,
  },
  sensorCharts: [
    { id: 'inlet-pressure', title: 'Inlet Stem Pressure', status: 'yellow', data: sensorData([42, 44, 41, 43, 45, 44, 42], 43) },
    { id: 'outlet-pressure', title: 'Outlet Stem Pressure', status: 'yellow', data: sensorData([38, 39, 37, 40, 41, 39, 38], 39) },
    { id: 'bearing-temp', title: 'Bearing Temperature', status: 'red', data: sensorData([72, 74, 76, 78, 77, 75, 73], 74) },
    { id: 'x-vibration', title: 'X-Axis Vibration', status: 'red', data: sensorData([5.2, 5.4, 5.6, 5.5, 5.3, 5.1, 5.0], 5.2) },
    { id: 'y-vibration', title: 'Y-Axis Vibration', status: 'yellow', data: sensorData([3.1, 3.2, 3.0, 3.3, 3.2, 3.1, 3.0], 3.1) },
    { id: 'z-vibration', title: 'Z-Axis Vibration', status: 'yellow', data: sensorData([2.8, 2.9, 2.7, 2.9, 2.8, 2.7, 2.6], 2.8) },
    { id: 'inlet-flow', title: 'Inlet Stem Flow', status: 'green', data: sensorData([120, 122, 121, 123, 124, 122, 121], 122) },
    { id: 'outlet-flow', title: 'Outlet Stem Flow', status: 'green', data: sensorData([118, 119, 117, 120, 121, 119, 118], 119) },
    { id: 'casing-temp', title: 'Casing Temperature', status: 'yellow', data: sensorData([65, 66, 67, 68, 67, 66, 65], 66) },
  ],
  diagnostics: [
    {
      id: 'bearing-wear-1',
      title: 'Bearing Wear',
      probability: 2,
      status: 'green',
      factors: [
        { label: 'X-Axis Vibration', percent: 95, status: 'green' },
        { label: 'Y-Axis Vibration', percent: 100, status: 'green' },
        { label: 'Bearing Temp', percent: 100, status: 'green' },
      ],
    },
    {
      id: 'pressure-failure',
      title: 'Pressure Control System Failure',
      probability: 75,
      status: 'red',
      factors: [
        { label: 'Inlet Stem Pressure', percent: 35, status: 'red' },
        { label: 'Outlet Stem Pressure', percent: 50, status: 'yellow' },
      ],
    },
    {
      id: 'overheating',
      title: 'Overheating',
      probability: 82,
      status: 'red',
      factors: [
        { label: 'Inlet Stem Pressure', percent: 35, status: 'red' },
        { label: 'Outlet Stem Pressure', percent: 50, status: 'yellow' },
        { label: 'Bearing Temp', percent: 100, status: 'green' },
      ],
    },
    {
      id: 'blade-erosion',
      title: 'Blade Erosion',
      probability: 73,
      status: 'red',
      factors: [
        { label: 'Inlet Stem Pressure', percent: 35, status: 'red' },
        { label: 'Outlet Stem Pressure', percent: 50, status: 'yellow' },
      ],
    },
    {
      id: 'misalignment',
      title: 'Misalignment of Rotating Components',
      probability: 13,
      status: 'yellow',
      factors: [
        { label: 'X-Axis Vibration', percent: 95, status: 'green' },
        { label: 'Y-Axis Vibration', percent: 100, status: 'green' },
        { label: 'Z-Axis Vibration', percent: 100, status: 'green' },
      ],
    },
  ],
};

export const MOCK_PRODUCTION_TREND: ProductionTrendPoint[] = [
  { timestamp: '2026-05-26T08:00:00Z', averageHourlyProduction: 42, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-26T09:00:00Z', averageHourlyProduction: 44, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-26T10:00:00Z', averageHourlyProduction: 41, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-26T11:00:00Z', averageHourlyProduction: 45, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-26T12:00:00Z', averageHourlyProduction: 43, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-26T13:00:00Z', averageHourlyProduction: 40, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-26T14:00:00Z', averageHourlyProduction: 42, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-26T15:00:00Z', averageHourlyProduction: 44, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-26T16:00:00Z', averageHourlyProduction: 43, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-26T17:00:00Z', averageHourlyProduction: 41, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-26T18:00:00Z', averageHourlyProduction: 42, targetProduction: 46, maxProduction: 52 },
  { timestamp: '2026-05-26T19:00:00Z', averageHourlyProduction: 43, targetProduction: 46, maxProduction: 52 },
];

export const MOCK_AREA_PRODUCTION_RATES: AreaMetric[] = [
  { areaName: 'Pre-reaction', value: 947, unit: 'T/D', performancePercent: 97 },
  { areaName: 'Reaction and heat recover', value: 938, unit: 'T/D', performancePercent: 68 },
  { areaName: 'Oxi-Absorption', value: 964, unit: 'T/D', performancePercent: 93 },
];

export const MOCK_AREA_PERFORMANCE: AreaMetric[] = MOCK_AREA_PRODUCTION_RATES;

export const MOCK_QUALITY_TREND: QualityTrendPoint[] = [
  { timestamp: '2026-05-26T08:00:00Z', concentration: 57.2, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-26T09:00:00Z', concentration: 57.5, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-26T10:00:00Z', concentration: 57.1, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-26T11:00:00Z', concentration: 57.8, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-26T12:00:00Z', concentration: 61.2, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-26T13:00:00Z', concentration: 59.6, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-26T14:00:00Z', concentration: 59.7, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-26T15:00:00Z', concentration: 58.9, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-26T16:00:00Z', concentration: 59.5, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-26T17:00:00Z', concentration: 58.4, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-26T18:00:00Z', concentration: 58.3, hiHiLimit: 62, loLoLimit: 57 },
  { timestamp: '2026-05-26T19:00:00Z', concentration: 58.2, hiHiLimit: 62, loLoLimit: 57 },
];

export const MOCK_AREA_QUALITY: AreaMetric[] = [
  { areaName: 'Pre-reaction', value: 97, unit: '%' },
  { areaName: 'Reaction and heat recover', value: 68, unit: '%' },
  { areaName: 'Oxi-Absorption', value: 93, unit: '%' },
];
