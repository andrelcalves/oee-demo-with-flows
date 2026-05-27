import {
  MOCK_AREA_PRODUCTION_RATES,
  MOCK_AREA_QUALITY,
  MOCK_AREA_SECTIONS,
  MOCK_DASHBOARD_KPIS,
  MOCK_EQUIPMENT,
  MOCK_MONTHLY_LOSS_BREAKDOWN,
  MOCK_PRODUCTION_LOSSES,
  MOCK_PRODUCTION_TREND,
  MOCK_QUALITY_TREND,
  MOCK_TURBINE_1_DETAIL,
} from '@/data/mock-oee-data';
import type { LossSection } from '@/types/oee';

import type { OeeMetricsService } from './OeeMetricsService';

export class MockOeeMetricsService implements OeeMetricsService {
  getDashboardKpis() {
    return Promise.resolve(MOCK_DASHBOARD_KPIS);
  }

  getMonthlyLossBreakdown() {
    return Promise.resolve(MOCK_MONTHLY_LOSS_BREAKDOWN);
  }

  getAreaSections() {
    return Promise.resolve(MOCK_AREA_SECTIONS);
  }

  getProductionLosses(section: LossSection) {
    return Promise.resolve(MOCK_PRODUCTION_LOSSES.filter((loss) => loss.section === section));
  }

  getProductionTrend() {
    return Promise.resolve(MOCK_PRODUCTION_TREND);
  }

  getAreaProductionRates() {
    return Promise.resolve(MOCK_AREA_PRODUCTION_RATES);
  }

  getAreaPerformance() {
    return Promise.resolve(MOCK_AREA_PRODUCTION_RATES);
  }

  getQualityTrend() {
    return Promise.resolve(MOCK_QUALITY_TREND);
  }

  getAreaQualityParameters() {
    return Promise.resolve(MOCK_AREA_QUALITY);
  }

  getEquipment(areaName: string, equipmentType: string) {
    return Promise.resolve(
      MOCK_EQUIPMENT.filter(
        (item) => item.areaName === areaName && item.equipmentType === equipmentType
      )
    );
  }

  getEquipmentById(equipmentId: string) {
    return Promise.resolve(MOCK_EQUIPMENT.find((item) => item.equipmentId === equipmentId));
  }

  getEquipmentDetail(equipmentId: string) {
    if (equipmentId === 'Turbine 1') {
      return Promise.resolve(MOCK_TURBINE_1_DETAIL);
    }
    const equipment = MOCK_EQUIPMENT.find((item) => item.equipmentId === equipmentId);
    if (!equipment) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve({
      equipment,
      kpis: {
        operatingTimeDays: equipment.operatingTimeDays,
        mtbfDays: equipment.mtbfDays,
        availability: equipment.availability,
        daysSinceLastFailure: equipment.daysSinceLastFailure,
        lastFailureDate: '—',
        mttrDays: 0,
        failureRatePerMonth: 0,
        failureProbability30Days: 0,
        overallHealth: equipment.overallHealth,
      },
      sensorCharts: [],
      diagnostics: [],
    });
  }
}
