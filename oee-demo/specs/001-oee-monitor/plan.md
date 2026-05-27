# Implementation Plan: OEE Monitor

**Branch**: `[001-oee-monitor]` | **Date**: 2026-05-27 | **Spec**: `/specs/001-oee-monitor/spec.md`
**Input**: Feature specification from `/specs/001-oee-monitor/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a desktop-oriented OEE Monitor web application that presents overall plant OEE, availability, performance, quality, production losses, production targets, quality trends, and a drill-down equipment list. The initial technical approach is a single Vite React app at the repo root, backed by a mock metrics service with contracts ready for CDF integration later, using Aura components, ViewModels, and host-synced navigation state.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: React 18, `@cognite/aura`, `@cognite/app-sdk`, `@tanstack/react-query`, Recharts (charts), Tailwind CSS 4  
**Storage**: N/A for v1 UI; metrics read from `MockOeeMetricsService`  
**Testing**: Vitest + Testing Library + happy-dom; co-located `*.test.ts(x)` next to source  
**Target Platform**: Desktop web browser (Cognite Fusion custom app)  
**Project Type**: Single-project web application (`src/` at repo root)  
**Performance Goals**: Dashboard initial render under 2 seconds with mock data; navigation to equipment list under 1 second after data is available  
**Constraints**: Read-only monitoring; no equipment write-back; host-synced page/theme state via `syncInternalState`; prefer Aura components over custom CSS  
**Scale/Scope**: Dashboard page, equipment list page, placeholder equipment details; reusable KPI, gauge, chart, loss bar, breadcrumb, and table components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- User-value first: PASS - dashboard and drill-down flows map directly to user stories.
- Independently testable slices: PASS - main dashboard, area analysis, and equipment list can each be tested independently.
- Technology-agnostic requirements: PASS - spec requirements describe behavior and outcomes, not implementation internals.
- Read-only safety boundary: PASS - v1 excludes equipment write-back controls.
- Clarifications tracked: PASS - v1 defaults documented in `research.md` (tons for loss, mock data, placeholder details).

## Project Structure

### Documentation (this feature)

```text
specs/001-oee-monitor/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
oee-demo/
├── src/
│   ├── components/
│   │   ├── oee/                   # KpiCard, OeeGauge, LossBar, Breadcrumbs, charts
│   │   └── equipment/             # EquipmentTable, EquipmentRow
│   ├── pages/
│   │   ├── OeeDashboardPage.tsx
│   │   ├── EquipmentListPage.tsx
│   │   └── EquipmentDetailsPage.tsx
│   ├── view-models/
│   │   ├── useOeeDashboardViewModel.ts
│   │   └── useEquipmentListViewModel.ts
│   ├── services/
│   │   ├── OeeMetricsService.ts          # interface
│   │   └── MockOeeMetricsService.ts
│   ├── data/
│   │   └── mock-oee-data.ts
│   ├── types/
│   │   └── oee.ts
│   ├── state/
│   │   ├── appState.ts
│   │   └── AppStateProvider.tsx
│   ├── __mocks__/
│   ├── App.tsx
│   └── main.tsx
├── vitest.config.ts
└── vite.config.ts                 # alias @ → ./src
```

**Structure Decision**: Single Vite React app at repo root; extend existing `src/` with feature folders; co-locate Vitest files; mock data service for v1 with contracts in `specs/001-oee-monitor/contracts/` ready for CDF later. Navigation uses host-synced `AppState` (no separate `frontend/` wrapper or root `tests/` directory).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
