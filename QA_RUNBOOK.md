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

- If metadata checks fail:
  - Confirm prerender output exists in `dist/<route>/index.html`.
  - Re-run `npm run build` (prerender runs as part of build).
  - Optional served check: `QA_METADATA_MODE=served npm run qa:metadata`.
