# OEE Demo

OEE Monitor for a nitric‑acid plant, built as a Cognite Fusion app. Includes an
Atlas AI chat assistant that answers questions over the same OEE metrics shown
on the dashboard.

The full feature spec lives in [`specs/001-oee-monitor/spec.md`](specs/001-oee-monitor/spec.md);
the design prototypes in [`specs/001-oee-monitor/design/`](specs/001-oee-monitor/design/).

## Prerequisites

- Node.js **24** (npm 11 is bundled). The `engines` field in `package.json` is
  enforced; use `nvm install 24 && nvm use 24` if you're on Windows + `nvm-windows`.
- A Cognite Fusion environment to run inside (auth is handled by the host
  through `@cognite/app-sdk`).

## Quick start

```powershell
npm install
npm run dev      # local dev server
npm test         # unit + integration tests (Vitest)
npm run build    # type-check + production build
```

## Atlas AI chat configuration

The floating chat button (FAB) is **always visible**. Without configuration it
opens a **preview panel** (static copy, disabled input) so you can demo the
planned Atlas integration. To enable **live** chat:

1. Create or reuse a CDF Atlas agent in the same project you authenticate into
   via Fusion. Scope its system prompt to nitric‑acid OEE monitoring
   (dashboard KPIs, areas, equipment, losses).
2. Copy [`.env.example`](.env.example) to `.env` and set the agent external id:

   ```env
   VITE_ATLAS_AGENT_EXTERNAL_ID=<your-agent-external-id>
   ```

3. Restart the dev server (Vite only picks up `.env` at startup).

That's it — on every OEE page (dashboard, equipment list, equipment details) the
panel streams live answers, and the agent automatically
receives the current `page` / `areaName` / `equipmentType` / `equipmentId` as
context so references like "this equipment" resolve correctly.

### How the chat answers

The agent uses seven **client tools** that delegate to `OeeMetricsService`
(today the `MockOeeMetricsService`, later a real CDF‑backed implementation):

| Tool | Purpose |
|------|---------|
| `get_oee_dashboard` | Overall OEE, pillar KPIs, daily production vs target vs forecast, monthly loss split |
| `get_availability_health` | Per‑area equipment availability counts (e.g. "Pump: 2/3 available") |
| `get_production_losses` | Loss breakdown for a single section (`availability` \| `performance` \| `quality`) |
| `get_production_trends` | Hourly production trend + per‑area production rate |
| `get_quality_metrics` | Concentration trend + per‑area quality parameters |
| `get_equipment_list` | Equipment for a given area + type pair |
| `get_equipment_detail` | KPIs, sensors and diagnostics for one equipment id |

Tools live in [`src/chat/tools/`](src/chat/tools/), the view model in
[`src/chat/useAtlasChatViewModel.ts`](src/chat/useAtlasChatViewModel.ts), the
vendored Atlas client in [`src/atlas-agent/`](src/atlas-agent/), and the UI in
[`src/components/chat/`](src/components/chat/).

### Troubleshooting

- **Preview only (no live answers)?** `VITE_ATLAS_AGENT_EXTERNAL_ID` is empty —
  set it in `.env` and restart `npm run dev`. The FAB still appears in preview mode.
- **`Agent chat API error: 401/403`** — the agent external id is wrong, or the
  agent lives in a different CDF project than the Fusion session you're in.
- **Tools never fire** — confirm the agent's system prompt encourages tool use;
  the seven tools are sent as `clientTool` actions on every request, no
  server‑side configuration required.

## Project layout

```
src/
  App.tsx                          # router + providers
  atlas-agent/                     # vendored Atlas client (types, session, react hook)
  chat/                            # OEE Atlas tools + view model
  components/
    chat/                          # FAB, slide-over panel, message list, input
    oee/                           # gauges, cards, charts
    equipment/                     # equipment table, sensor charts, diagnostics
  config/atlas.ts                  # reads VITE_ATLAS_AGENT_EXTERNAL_ID
  data/mock-oee-data.ts            # mock dataset used by MockOeeMetricsService
  pages/                           # dashboard / list / details
  services/                        # OeeMetricsService + mock impl + provider
  state/AppStateProvider.tsx       # host-synced app state (page, theme, …)
  view-models/                     # page-level data hooks (React Query)
specs/001-oee-monitor/             # spec.md, plan.md, tasks.md, design/
```
