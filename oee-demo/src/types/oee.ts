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
