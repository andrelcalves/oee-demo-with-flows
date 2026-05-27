# Tasks: OEE Monitor

**Input**: Design documents from `/specs/001-oee-monitor/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [x] T001 Add Recharts dependency in package.json
- [x] T002 [P] Create OEE types in src/types/oee.ts
- [x] T003 [P] Create mock dataset in src/data/mock-oee-data.ts

## Phase 2: Foundational

- [x] T004 Define OeeMetricsService interface in src/services/OeeMetricsService.ts
- [x] T005 Implement MockOeeMetricsService in src/services/MockOeeMetricsService.ts
- [x] T006 [P] Add OeeMetricsService context in src/services/OeeMetricsServiceContext.tsx
- [x] T007 Implement AppState types and AppStateProvider in src/state/appState.ts and src/state/AppStateProvider.tsx
- [x] T008 Wire HostApp connectToHostApp and AppStateProvider in src/App.tsx

## Phase 3: User Story 1 - Dashboard (P1) MVP

**Goal**: Full OEE dashboard per AC-001–AC-005
**Independent Test**: Dashboard renders all sections with mock data

- [x] T009 [P] [US1] Create shared format helpers in src/lib/format.ts
- [x] T010 [P] [US1] Create OeeGauge in src/components/oee/OeeGauge.tsx
- [x] T011 [P] [US1] Create KpiCard and SummaryCard in src/components/oee/KpiCard.tsx
- [x] T012 [P] [US1] Create LossBar in src/components/oee/LossBar.tsx
- [x] T013 [P] [US1] Create Breadcrumbs in src/components/oee/Breadcrumbs.tsx
- [x] T014 [P] [US1] Create ProductionTrendChart in src/components/oee/ProductionTrendChart.tsx
- [x] T015 [P] [US1] Create QualityTrendChart in src/components/oee/QualityTrendChart.tsx
- [x] T016 [US1] Implement useOeeDashboardViewModel in src/view-models/useOeeDashboardViewModel.ts
- [x] T017 [US1] Implement OeeDashboardPage in src/pages/OeeDashboardPage.tsx
- [x] T018 [US1] Add useOeeDashboardViewModel.test.ts in src/view-models/useOeeDashboardViewModel.test.tsx

## Phase 4: User Story 2 - Equipment drill-down (P2)

**Goal**: Equipment list and navigation per AC-006–AC-007
**Independent Test**: Drill-down from Pre Reaction / Pump shows table and details

- [x] T019 [P] [US2] Create EquipmentTable in src/components/equipment/EquipmentTable.tsx
- [x] T020 [US2] Implement useEquipmentListViewModel in src/view-models/useEquipmentListViewModel.ts
- [x] T021 [US2] Implement EquipmentListPage in src/pages/EquipmentListPage.tsx
- [x] T022 [US2] Implement EquipmentDetailsPage placeholder in src/pages/EquipmentDetailsPage.tsx
- [x] T023 [US2] Add useEquipmentListViewModel.test.ts in src/view-models/useEquipmentListViewModel.test.tsx

## Phase 5: User Story 3 - Theme toggle (P3)

**Goal**: Light/dark theme per AC-008
**Independent Test**: Toggle updates document class and persists in AppState

- [x] T024 [US3] Create ThemeToggle in src/components/oee/ThemeToggle.tsx
- [x] T025 [US3] Integrate ThemeToggle in dashboard and list page headers

## Phase 6: Polish

- [x] T026 Update App.tsx to render OEE pages instead of starter checklist
- [x] T027 Update App.test.tsx for OEE shell and navigation
- [x] T028 Run npm test and npm run build; fix failures

## Dependencies

```text
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
US2 depends on US1 (shared AppState, service, breadcrumbs)
US3 can run after Phase 2
```

## MVP scope

Phases 1–3 (through T018) deliver AC-001–AC-005.
