# Contract: OeeMetricsService

**Feature**: 001-oee-monitor | **Version**: v1 (mock)

## Interface

```typescript
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
```

## Types

See `src/types/oee.ts` — must stay aligned with `data-model.md`.

## Mock implementation

- **Class**: `MockOeeMetricsService` in `src/services/MockOeeMetricsService.ts`
- **Data**: `src/data/mock-oee-data.ts`
- **Errors**: Returns resolved promises; `getEquipmentById` returns `undefined` when not found (details page shows not-found state).

## Future CDF implementation

Replace `MockOeeMetricsService` with `CdfOeeMetricsService` implementing the same interface; map CDF views/time series in a follow-up feature. No contract changes required for dashboard v1.
