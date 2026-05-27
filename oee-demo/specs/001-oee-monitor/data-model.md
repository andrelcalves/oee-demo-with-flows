# Data Model: OEE Monitor

**Feature**: 001-oee-monitor | **Date**: 2026-05-27

## Entities

### DashboardKpis

Plant-level summary metrics for the top of the dashboard.

| Field | Type | Validation |
|-------|------|------------|
| overallOee | number | 0–100 |
| availability | number | 0–100 |
| performance | number | 0–100 |
| quality | number | 0–100 |
| monthlyProductionLoss | number | ≥ 0 (tons) |
| dailyProductionTons | number | ≥ 0 |
| dailyTargetTons | number | ≥ 0 |
| dailyForecastTons | number | ≥ 0 |
| plantStatus | string | non-empty |

### AreaHealthGroup

Availability grouping for dashboard drill-down.

| Field | Type | Validation |
|-------|------|------------|
| areaName | string | non-empty |
| equipmentType | string | non-empty |
| availableCount | number | 0 ≤ n ≤ totalCount |
| totalCount | number | ≥ 1 |
| availability | number | 0–100 |

**Identity**: `(areaName, equipmentType)` unique per dashboard.

### Equipment

| Field | Type | Validation |
|-------|------|------------|
| equipmentId | string | non-empty, unique |
| description | string | non-empty |
| areaName | string | non-empty |
| equipmentType | string | non-empty |
| availability | number | 0–100 |
| quality | number | 0–100 |

### ProductionLoss

| Field | Type | Validation |
|-------|------|------------|
| category | string | non-empty |
| value | number | ≥ 0 (tons) |
| section | enum | `availability` \| `performance` \| `quality` |

### ProductionTrendPoint

| Field | Type |
|-------|------|
| timestamp | string (ISO) |
| averageHourlyProduction | number |
| targetProduction | number |
| maxProduction | number |

### QualityTrendPoint

| Field | Type |
|-------|------|
| timestamp | string (ISO) |
| concentration | number |
| hiHiLimit | number |
| loLoLimit | number |

### AreaMetric

Performance or quality metrics per area.

| Field | Type |
|-------|------|
| areaName | string |
| value | number |
| unit | string (e.g. `t/d`, `%`) |

## Relationships

```text
DashboardKpis (1) ── displayed on ── OeeDashboardPage
AreaHealthGroup (many) ── drill-down ── Equipment (filtered by areaName + equipmentType)
ProductionLoss (many) ── grouped by ── section
ProductionTrendPoint (many) ── Performance chart
QualityTrendPoint (many) ── Quality chart
```

## AppState (host-synced)

| Field | Type | Notes |
|-------|------|-------|
| page | `dashboard` \| `equipment-list` \| `equipment-details` | Current view |
| areaName | string? | Set for list/details |
| equipmentType | string? | Set for list/details |
| equipmentId | string? | Set for details |
| theme | `light` \| `dark` | FR-029 |
