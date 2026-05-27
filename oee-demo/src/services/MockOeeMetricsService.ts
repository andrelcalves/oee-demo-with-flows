import {
  MOCK_AREA_HEALTH,
  MOCK_AREA_PERFORMANCE,
  MOCK_AREA_PRODUCTION_RATES,
  MOCK_AREA_QUALITY,
  MOCK_DASHBOARD_KPIS,
  MOCK_EQUIPMENT,
  MOCK_PRODUCTION_LOSSES,
  MOCK_PRODUCTION_TREND,
  MOCK_QUALITY_TREND,
} from '@/data/mock-oee-data';
import type { LossSection } from '@/types/oee';

import type { OeeMetricsService } from './OeeMetricsService';

export class MockOeeMetricsService implements OeeMetricsService {
  getDashboardKpis() {
    return Promise.resolve(MOCK_DASHBOARD_KPIS);
  }

  getAreaHealthGroups() {
    return Promise.resolve(MOCK_AREA_HEALTH);
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
    return Promise.resolve(MOCK_AREA_PERFORMANCE);
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
}
