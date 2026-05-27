# Feature Specification: OEE Monitor

**Branch**: `001-oee-monitor` | **Date**: 2026-05-26 | **Spec**: `/specs/001-oee-monitor/spec.md`  
**Input**: Feature specification from `/specs/001-oee-monitor/spec.md`

## Summary

Build an OEE Monitor web application for a nitric acid production plant. The app shows overall plant OEE, availability, performance, quality, production totals, targets, forecasts, plant status, area-level health, production loss, trend charts, and drill-down equipment lists.

## Scope

### In Scope

- Overall OEE dashboard.
- Availability, Performance, Quality, and Monthly Production Loss KPI cards.
- Daily Production, Daily Target, Daily Forecast, and Plant Status summary cards.
- Availability & Health section grouped by plant area.
- Performance section with production trend chart, area production rates, and monthly production loss.
- Quality section with nitric acid concentration chart, quality parameters by area, and monthly production loss.
- Drill-down page from an area/equipment category to an equipment list.
- Equipment list with availability and quality progress indicators.
- Breadcrumb navigation.
- Light and dark theme toggle.
- Details action for each equipment item.
- Atlas AI chat assistant for OEE-related Q&A. Users can ask questions about overall OEE, availability, performance, quality, production losses, and individual equipment; the agent answers using the same OEE metrics service that drives the dashboard.

### Out of Scope

- User authentication and authorization.
- Real-time historian integration.
- Alarm acknowledgement workflow.
- Write-back controls to plant equipment.
- Predictive maintenance model training.

## Users

- Plant operator: monitors current production status and quickly identifies degraded areas.
- Process engineer: reviews performance and quality trends.
- Maintenance engineer: drills into equipment availability and quality impact.
- Plant manager: reviews OEE, losses, production against target, and forecast.

## Primary User Flow

1. User opens the OEE Monitor dashboard.
2. App displays overall OEE and KPI cards.
3. User reviews availability, performance, quality, and production loss sections.
4. User selects an area/equipment category such as `Pre Reaction / Pump`.
5. App opens an equipment list page with equipment-level availability and quality.
6. User selects `Details` for an equipment item.
7. App opens or prepares an equipment details view.

## Functional Requirements

### Dashboard

- **FR-001**: The system shall display the page title `OEE MONITOR`.
- **FR-002**: The system shall display breadcrumbs from `Home` to `Oee Monitor` on the dashboard.
- **FR-003**: The system shall display the Overall OEE as a circular percentage gauge.
- **FR-004**: The system shall display KPI cards for Availability, Performance, Quality, and Monthly Production Loss.
- **FR-005**: The system shall display summary cards for Daily Production, Daily Target, Daily Forecast, and Plant Status.
- **FR-006**: The system shall show production quantities in tons where applicable.
- **FR-007**: The system shall highlight the Daily Forecast value when it is below the Daily Target.
- **FR-008**: The system shall display Plant Status as a readable text value, for example `Running`.

### Availability & Health

- **FR-009**: The system shall group equipment health by production area.
- **FR-010**: The system shall display area names, equipment names, availability percentages, and equipment count indicators.
- **FR-011**: The system shall display monthly production loss categories for availability-related losses.
- **FR-012**: The system shall display horizontal bars and numeric values for loss categories.

### Performance

- **FR-013**: The system shall display average hourly production, target production, and actual maximum production.
- **FR-014**: The system shall display a production trend chart over time.
- **FR-015**: The production chart shall include average hourly production, target production, and actual maximum production series or reference lines.
- **FR-016**: The system shall display production rate by area in tons per day.
- **FR-017**: The system shall display performance percentage by area.
- **FR-018**: The system shall display monthly production loss categories for performance-related losses.

### Quality

- **FR-019**: The system shall display final concentration of nitric acid as a trend chart.
- **FR-020**: The quality chart shall include nitric acid concentration, HiHi limit, and LoLo limit.
- **FR-021**: The system shall display quality parameters by area.
- **FR-022**: The system shall display monthly production loss categories for quality-related losses.

### Equipment List Drill-Down

- **FR-023**: The system shall provide navigation from dashboard area/equipment groups to an equipment list page.
- **FR-024**: The equipment list page shall display the title `OEE MONITOR - {Area} / {Equipment Type}`.
- **FR-025**: The equipment list page shall display breadcrumbs from `Home` to `Oee Monitor` to `{Area} / {Equipment Type}`.
- **FR-026**: The equipment list shall include columns for Equipment, Description, Availability, Quality, and Details.
- **FR-027**: Availability and Quality shall be displayed as progress bars with percentage labels.
- **FR-028**: Each equipment row shall include a `DETAILS` action.

### Theme

- **FR-029**: The system shall support light and dark theme mode.
- **FR-030**: The current theme shall be visually indicated by an icon toggle.

### Atlas Chat Assistant

- **FR-031**: The system shall expose a floating chat button (Atlas FAB) on every OEE screen — dashboard, equipment list, and equipment details — when an Atlas agent has been configured.
- **FR-032**: The chat button shall toggle a right-side slide-over panel containing a message list, a textarea input, and suggested prompts.
- **FR-033**: The chat panel shall be hidden when `VITE_ATLAS_AGENT_EXTERNAL_ID` is empty, so the demo runs without an Atlas agent.
- **FR-034**: User messages shall be sent to the configured Atlas agent, and assistant responses shall stream into the panel.
- **FR-035**: The agent shall receive the current view as `appContext` (current `page`, `areaName`, `equipmentType`, `equipmentId`, and `theme`) so it can interpret references such as "this equipment" or "this area".
- **FR-036**: The agent shall be able to query the dashboard KPIs, monthly loss breakdown, area availability health, production losses by section, production trends + area rates, quality trends + area parameters, equipment lists, and equipment detail through client tools that delegate to the OEE metrics service.
- **FR-037**: Tool invocations shall surface a progress indicator (e.g. `Executing: get_oee_dashboard`) while running, and the user shall be able to stop a streaming response or start a new conversation from the panel.

## Data Requirements

### Dashboard KPI Data

| Field | Type | Example |
| --- | --- | --- |
| overallOee | percentage | 54 |
| availability | percentage | 80 |
| performance | percentage | 75 |
| quality | percentage | 90 |
| monthlyProductionLoss | number | 954 |
| dailyProductionTons | number | 954 |
| dailyTargetTons | number | 1100 |
| dailyForecastTons | number | 937 |
| plantStatus | string | Running |

### Area Health Data

| Field | Type | Example |
| --- | --- | --- |
| areaName | string | Pre-Reaction |
| equipmentType | string | Pump |
| availableCount | number | 1 |
| totalCount | number | 2 |
| availability | percentage | 83 |

### Equipment Data

| Field | Type | Example |
| --- | --- | --- |
| equipmentId | string | Pump-101A |
| description | string | Feed Transfer Pump A for pre-reaction |
| areaName | string | Pre Reaction |
| equipmentType | string | Pump |
| availability | percentage | 100 |
| quality | percentage | 89 |

### Loss Data

| Field | Type | Example |
| --- | --- | --- |
| category | string | Mechanical Failure |
| value | number | 600 |
| area | string | Availability |

## Non-Functional Requirements

- **NFR-001**: The dashboard shall load in under 2 seconds with mock or cached data.
- **NFR-002**: The UI shall be responsive down to tablet-width layouts.
- **NFR-003**: Numeric values shall use consistent formatting and units.
- **NFR-004**: Charts shall remain readable in light and dark mode.
- **NFR-005**: Cards and charts shall have clear labels and legends.
- **NFR-006**: Components shall be reusable for KPI cards, gauges, bar indicators, breadcrumbs, and charts.
- **NFR-007**: The application shall not expose plant control actions.

## Acceptance Criteria

### AC-001: Dashboard Loads

Given the user opens the OEE Monitor app, when the dashboard loads, then the user sees the overall OEE gauge, four KPI cards, four summary cards, and the three main sections: Availability & Health, Performance, and Quality.

### AC-002: Production Forecast Warning

Given the Daily Forecast is lower than the Daily Target, when the dashboard renders, then the forecast value is visually emphasized as below target.

### AC-003: Availability Section

Given availability data exists for plant areas, when the dashboard renders, then each area shows equipment types, count indicators, and availability percentages.

### AC-004: Performance Section

Given production trend data exists, when the dashboard renders, then the performance chart shows actual average production plus target and maximum reference values.

### AC-005: Quality Section

Given nitric acid concentration data exists, when the dashboard renders, then the quality chart shows concentration values and HiHi/LoLo threshold lines.

### AC-006: Equipment Drill-Down

Given the user selects `Pre Reaction / Pump`, when the equipment list page opens, then the page title and breadcrumbs show `Pre Reaction / Pump` and the table shows Pump-101A and Pump-101B with availability and quality percentages.

### AC-007: Equipment Details Action

Given the user is on the equipment list page, when the user selects `DETAILS` on an equipment row, then the app navigates to or opens details for that equipment.

### AC-008: Theme Toggle

Given the user toggles the theme icon, when the theme changes, then the UI colors update while preserving all displayed data and layout.

### AC-009: Atlas Chat FAB Visibility

Given the user opens the app, when `VITE_ATLAS_AGENT_EXTERNAL_ID` is empty, then no chat FAB is rendered. When the variable is set to a valid agent external ID, then the FAB is visible on the dashboard, equipment list, and equipment details pages.

### AC-010: Atlas Answers from OEE Data

Given the user is on the dashboard and asks "What is the daily forecast vs target?", when the Atlas agent invokes `get_oee_dashboard`, then the assistant reply cites the same values shown on the daily strip (e.g. 937 tons forecast vs 1100 tons target from mock data).

### AC-011: Atlas Uses View Context

Given the user navigates to the Turbine 1 details page and asks "Summarize this equipment", when the assistant streams a reply, then the response is scoped to Turbine 1 because `appContext` carries `page=equipment-details` and `equipmentId=Turbine 1`.

## Initial Mock Data

- Overall OEE: 54%.
- Availability: 80%.
- Performance: 75%.
- Quality: 90%.
- Monthly Production Loss: 954.
- Daily Production: 954 tons.
- Daily Target: 1100 tons.
- Daily Forecast: 937 tons.
- Plant Status: Running.
- Equipment list for Pre Reaction / Pump:
  - Pump-101A: Feed Transfer Pump A for pre-reaction, Availability 100%, Quality 89%.
  - Pump-101B: Feed Transfer Pump B for pre-reaction, Availability 0%, Quality 78%.

## UI Reference (prototype)

Visual source of truth: [`design/`](design/). Prototype wins over earlier simplified layouts.

| Screen | Light | Dark | Notes |
|--------|-------|------|-------|
| Dashboard | [OEE monitor - light.png](design/OEE%20monitor%20-%20light.png) | [OEE monitor - dark.png](design/OEE%20monitor%20-%20dark.png) | KPI row, donut loss, three columns |
| Equipment list | [Equipment list-light.png](design/Equipment%20list-light.png) | [Equipment list - dark.png](design/Equipment%20list%20-%20dark.png) | MTBF, operating time, overall health |
| Equipment detail | [Turbine 1 - light.png](design/Turbine%201%20-%20light.png) | [Turbine 1 - dark.png](design/Turbine%201%20-%20dark.png) | Sensor grid + diagnostics sidebar |

### Dashboard (from prototype)

- Header: `OEE MONITOR`, optional status widget (weather/time), theme toggle.
- KPI row: large Overall OEE gauge; Availability / Performance / Quality pillar gauges; monthly loss **donut** (Availability, Performance, Quality segments).
- Daily strip: Daily Production, Daily Target, Daily Forecast, Plant Status (`In Production`).
- Three columns: **Availability & Health** (areas with equipment lines and x/y counts), **Performance** (line chart, T/D rates, loss bars), **Quality** (concentration chart, area %, loss bars).

### Equipment list (from prototype)

- Title: `OEE MONITOR / Equipment`.
- Columns: Equipment, Operating Time, MTBF, Days Since Last Failure, Availability (bar), Overall Health (bar), Detail button.
- Example: Turbine 1 (98% / 57%), Turbine 2 (91% / 32%).

### Equipment detail (from prototype)

- Title: `OEE MONITOR / Equipment / {name}` (e.g. Turbine 1).
- KPI tiles: operating time, MTBF, availability, failure metrics.
- Grid of sensor trend charts; sidebar with overall health gauge and diagnostic cards.

## Resolved (v2 from prototype)

- Monthly Production Loss breakdown: tons; donut shows Availability / Performance / Quality segments.
- Equipment Details: full diagnostic layout per Turbine 1 prototype (mock sensor data for v1).
- Plant status label: `In Production`.
- Warning colors: green / yellow / red status dots on charts and diagnostics.

## Open Questions

- What historian/API will provide live production, equipment, and quality data?