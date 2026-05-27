# Quickstart: OEE Monitor

## Prerequisites

- Node ≥ 20, npm ≥ 11.10.0 (see `package.json` engines)
- From repo root: `oee-demo/`

## Install and run

```bash
cd oee-demo
npm install
npm run dev
```

Open https://localhost:3001 (mkcert HTTPS).

## Verify acceptance criteria

| ID | How to verify |
|----|----------------|
| AC-001 | Dashboard shows OEE gauge, 4 KPI cards, 4 summary cards, Availability & Health, Performance, Quality sections |
| AC-002 | Daily Forecast (937) styled below target when target is 1100 |
| AC-003 | Availability section lists areas with equipment types and availability % |
| AC-004 | Performance chart shows production series and reference values |
| AC-005 | Quality chart shows concentration and HiHi/LoLo lines |
| AC-006 | Click `Pre Reaction / Pump` → list shows Pump-101A and Pump-101B |
| AC-007 | Click `DETAILS` on a row → placeholder details page |
| AC-008 | Theme toggle switches light/dark; layout preserved |

## Tests

```bash
npm test
```

## Build

```bash
npm run build
```
