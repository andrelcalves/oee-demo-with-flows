# Research: OEE Monitor

**Feature**: 001-oee-monitor | **Date**: 2026-05-27

## Routing / navigation

**Decision**: Host-synced `AppState` with a `page` field (`dashboard` | `equipment-list` | `equipment-details`) plus `areaName`, `equipmentType`, and `equipmentId` when drilling down. No `react-router` dependency.

**Rationale**: Only three views; CLAUDE.md requires reload/share persistence via `syncInternalState`. Avoids an extra dependency.

**Alternatives considered**: `react-router-dom` — rejected for v1 scope; URL routing is owned by the Fusion host.

## Charts

**Decision**: [Recharts](https://recharts.org/) for production trend and nitric acid concentration charts.

**Rationale**: React-first, supports reference lines (targets, HiHi/LoLo), themeable via CSS variables / `stroke` colors for light and dark mode (NFR-004).

**Alternatives considered**: Chart.js — heavier integration with React; raw SVG — more work for legends and tooltips.

## v1 defaults (open spec questions)

| Question | v1 default |
|----------|------------|
| Monthly Production Loss unit | Tons (consistent with daily production fields) |
| Data source | `MockOeeMetricsService` reading `src/data/mock-oee-data.ts` |
| Warning / alarm colors | Aura semantic tokens: below-target forecast uses `text-destructive`; availability &lt; 50% uses muted destructive styling on progress bars |
| Equipment Details page | Full Turbine 1 layout per `design/Turbine 1 - *.png` (mock sensors/diagnostics) |
| Visual reference | `specs/001-oee-monitor/design/*.png` — prototype wins for layout and labels |
| Plant status | `In Production` |
| Equipment list columns | Operating Time, MTBF, Days Since Last Failure, Availability, Overall Health, Detail |

## Theme

**Decision**: Host-synced `theme: 'light' | 'dark'` in `AppState`; toggle applies `dark` class on `document.documentElement` (Tailwind dark mode).

**Rationale**: FR-029/FR-030; persists across reload when host restores `initialState`.

## Refresh

**Decision**: Static mock data for v1; React Query `staleTime` 5 minutes (existing `main.tsx` defaults). No polling.

**Rationale**: Out of scope per spec (no real-time historian).

## UI alignment (prototype v2)

**Decision**: Match `design/` screenshots for dashboard, equipment list, and Turbine detail using Aura + Tailwind; purple accent via `text-primary` / chart strokes.

**Charts added**: Recharts `PieChart` for monthly loss donut; existing line charts for production/quality/sensors.

**Layout**: Full-width dashboard (`max-w-[1600px]`); equipment detail uses 2-column grid (charts + diagnostics sidebar).
