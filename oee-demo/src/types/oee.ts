export type LossSection = 'availability' | 'performance' | 'quality';

export type AppPage = 'dashboard' | 'equipment-list' | 'equipment-details';

export type ThemeMode = 'light' | 'dark';

export type DashboardKpis = {
  overallOee: number;
  availability: number;
  performance: number;
  quality: number;
  monthlyProductionLoss: number;
  dailyProductionTons: number;
  dailyTargetTons: number;
  dailyForecastTons: number;
  plantStatus: string;
};

export type MonthlyLossBreakdown = {
  availability: number;
  performance: number;
  quality: number;
};

export type AreaEquipmentItem = {
  equipmentType: string;
  availability: number;
  availableCount: number;
  totalCount: number;
};

export type AreaSection = {
  areaName: string;
  equipment: AreaEquipmentItem[];
};

export type AreaHealthGroup = {
  areaName: string;
  equipmentType: string;
  availableCount: number;
  totalCount: number;
  availability: number;
};

export type Equipment = {
  equipmentId: string;
  description: string;
  areaName: string;
  equipmentType: string;
  availability: number;
  quality: number;
  operatingTimeDays: number;
  mtbfDays: number;
  daysSinceLastFailure: number;
  overallHealth: number;
};

export type ProductionLoss = {
  category: string;
  value: number;
  section: LossSection;
};

export type ProductionTrendPoint = {
  timestamp: string;
  averageHourlyProduction: number;
  targetProduction: number;
  maxProduction: number;
};

export type QualityTrendPoint = {
  timestamp: string;
  concentration: number;
  hiHiLimit: number;
  loLoLimit: number;
};

export type AreaMetric = {
  areaName: string;
  value: number;
  unit: string;
  performancePercent?: number;
};

export type EquipmentDetailKpis = {
  operatingTimeDays: number;
  mtbfDays: number;
  availability: number;
  daysSinceLastFailure: number;
  lastFailureDate: string;
  mttrDays: number;
  failureRatePerMonth: number;
  failureProbability30Days: number;
  overallHealth: number;
};

export type SensorChartPoint = {
  timestamp: string;
  value: number;
  baseline: number;
};

export type SensorChart = {
  id: string;
  title: string;
  status: 'green' | 'yellow' | 'red';
  data: SensorChartPoint[];
};

export type DiagnosticFactor = {
  label: string;
  percent: number;
  status: 'green' | 'yellow' | 'red';
};

export type DiagnosticCard = {
  id: string;
  title: string;
  probability: number;
  status: 'green' | 'yellow' | 'red';
  factors: DiagnosticFactor[];
};

export type EquipmentDetail = {
  equipment: Equipment;
  kpis: EquipmentDetailKpis;
  sensorCharts: SensorChart[];
  diagnostics: DiagnosticCard[];
};

export type AppState = {
  page: AppPage;
  areaName?: string;
  equipmentType?: string;
  equipmentId?: string;
  theme: ThemeMode;
};

export const DEFAULT_APP_STATE: AppState = {
  page: 'dashboard',
  theme: 'light',
};
