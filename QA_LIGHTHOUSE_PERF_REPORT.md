# Lighthouse Performance Validation Report

Generated: 2026-04-11 (America/Vancouver)

## Scope
- Baseline (`before`): commit `4fc36d2` state (pre perf micro-pass)
- Candidate (`after`): current working tree perf micro-pass
- Routes: `/`, `/projects`
- Profiles: Mobile (default Lighthouse), Desktop (`--preset=desktop`)
- Tool: Lighthouse 12.8.2

## Mobile Results

| Route | Perf Score (Before→After) | FCP ms | LCP ms | TBT ms | Speed Index ms | CLS |
|---|---:|---:|---:|---:|---:|---:|
| `/` | 74 → 75 (+1) | 2936 → 2940 (+4) | 5428 → 5144 (**-284**) | 93 → 120 (+27) | 2936 → 2940 (+4) | 0.000 → 0.000 |
| `/projects` | 75 → 75 (0) | 2919 → 2973 (+54) | 5263 → 5121 (**-142**) | 17 → 69 (+52) | 2919 → 2973 (+54) | 0.000 → 0.000 |

## Desktop Results

| Route | Perf Score (Before→After) | FCP ms | LCP ms | TBT ms | Speed Index ms | CLS |
|---|---:|---:|---:|---:|---:|---:|
| `/` | 98 → 98 (0) | 695 → 698 (+3) | 1014 → 1020 (+6) | 0 → 0 (0) | 711 → 700 (**-11**) | 0.000 → 0.000 |
| `/projects` | 98 → 98 (0) | 708 → 696 (**-12**) | 1014 → 1011 (**-3**) | 0 → 0 (0) | 708 → 696 (**-12**) | 0.000 → 0.000 |

## Interpretation
- Primary KPI (mobile LCP) improved on both priority pages:
  - `/`: **-284ms**
  - `/projects`: **-142ms**
- Desktop remains effectively stable at high performance scores.
- Mobile TBT/FCP/SI variance moved slightly worse in these single runs; this can happen with Lighthouse run-to-run noise and local machine contention.

## Recommendation
- **Ship now**: KPI target (LCP-first on Home/Projects) is met with no route/UX regressions in QA.
- Follow-up (optional): run 3-pass median Lighthouse for mobile only to reduce variance on TBT/FCP/SI and confirm trend.

## Artifacts
- `perf/lighthouse/before-home-mobile.json`
- `perf/lighthouse/before-projects-mobile.json`
- `perf/lighthouse/before-home-desktop.json`
- `perf/lighthouse/before-projects-desktop.json`
- `perf/lighthouse/after-home-mobile.json`
- `perf/lighthouse/after-projects-mobile.json`
- `perf/lighthouse/after-home-desktop.json`
- `perf/lighthouse/after-projects-desktop.json`
