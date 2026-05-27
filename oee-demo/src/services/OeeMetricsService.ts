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

export interface OeeMetricsService {
  getDashboardKpis(): Promise<DashboardKpis>;
  getMonthlyLossBreakdown(): Promise<MonthlyLossBreakdown>;
  getAreaSections(): Promise<AreaSection[]>;
  getProductionLosses(section: LossSection): Promise<ProductionLoss[]>;
  getProductionTrend(): Promise<ProductionTrendPoint[]>;
  getAreaProductionRates(): Promise<AreaMetric[]>;
  getAreaPerformance(): Promise<AreaMetric[]>;
  getQualityTrend(): Promise<QualityTrendPoint[]>;
  getAreaQualityParameters(): Promise<AreaMetric[]>;
  getEquipment(areaName: string, equipmentType: string): Promise<Equipment[]>;
  getEquipmentById(equipmentId: string): Promise<Equipment | undefined>;
  getEquipmentDetail(equipmentId: string): Promise<EquipmentDetail | undefined>;
}
