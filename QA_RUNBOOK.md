# QA Runbook

This runbook covers release-ready checks for route health, metadata correctness, and critical UX behavior.

## Commands

1. Install dependencies:
```bash
npm install
```

2. Run static/code checks:
```bash
npm run lint
npm run build
```

3. Run full QA suite (starts preview server internally):
```bash
npm run qa
```

Optional: run skill-map guardrails only:
```bash
npm run qa:audit
```

4. If Windows file-lock/EPERM issues appear, run lock diagnostics:
```bash
npm run qa:lock
```

5. Retry QA with safe recovery mode (stops known preview/build node processes and retries preview once):
```bash
npm run qa -- --recovery
```

## What `npm run qa` validates

- `qa:routes`
  - Critical route matrix returns `200`.
  - No explicit fallback markers (`Page Not Found`, project load error marker).
- `qa:metadata`
  - Route-specific metadata in prerendered build artifacts (`dist/**/index.html`) for critical routes:
    - `title`
    - `description`
    - `canonical`
    - `og:title`
    - `og:url`
    - `twitter:title`
- `qa:audit`
  - Skill-map guardrails for top 3 case studies (`inklink`, `prolog`, `sidequest`):
    - required `evidence_narrative` fields are present and non-empty
    - role resolver preserves design-first precedence for project cards
    - banned vague copy phrases are not present in the target case-study corpus
- `qa:browser`
  - Desktop and mobile presence checks for nav/footer, home proof strip CTA, case-study trust modules.
  - Keyboard focus traversal sanity.
  - Reduced-motion content availability.

## Troubleshooting

- If `qa:browser` fails with browser-not-installed:
```bash
npx playwright install chromium
```

- If preview server port conflict occurs:
  - Stop existing processes on `4173`.
  - Re-run `npm run qa`.

- If `spawn EPERM` or repeated `404` across all routes occurs:
  - Run `npm run qa:lock` to identify locked `dist` paths.
  - Pause OneDrive sync and close tools holding `dist` files.
  - Run `npm run qa -- --recovery`.
  - If still blocked, manually clear lock holders before rebuilding/retrying.

- If metadata checks fail:
  - Confirm prerender output exists in `dist/<route>/index.html`.
  - Re-run `npm run build` (prerender runs as part of build).
  - Optional served check: `QA_METADATA_MODE=served npm run qa:metadata`.
