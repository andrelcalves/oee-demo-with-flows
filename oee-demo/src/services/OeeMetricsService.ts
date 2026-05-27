import type {
  AreaHealthGroup,
  AreaMetric,
  DashboardKpis,
  Equipment,
  LossSection,
  ProductionLoss,
  ProductionTrendPoint,
  QualityTrendPoint,
} from '@/types/oee';

export interface OeeMetricsService {
  getDashboardKpis(): Promise<DashboardKpis>;
  getAreaHealthGroups(): Promise<AreaHealthGroup[]>;
  getProductionLosses(section: LossSection): Promise<ProductionLoss[]>;
  getProductionTrend(): Promise<ProductionTrendPoint[]>;
  getAreaProductionRates(): Promise<AreaMetric[]>;
  getAreaPerformance(): Promise<AreaMetric[]>;
  getQualityTrend(): Promise<QualityTrendPoint[]>;
  getAreaQualityParameters(): Promise<AreaMetric[]>;
  getEquipment(areaName: string, equipmentType: string): Promise<Equipment[]>;
  getEquipmentById(equipmentId: string): Promise<Equipment | undefined>;
}
