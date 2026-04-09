# Design System Hardening Reference

This pass focuses on consistency and low-risk scaling. It does not change product features.

## Token Governance

Single source of truth for global tokens:
- `src/styles/variables.css`

Rules:
- Define global semantic tokens only in `variables.css`.
- Keep `energy.css` for behavior helpers and interaction utilities, not foundational token ownership.
- Use semantic intent first:
  - `--layout-*` for shell, reading width, section rhythm, label columns.
  - `--chip-*` for tags/pills/chips.
  - `--motion-*`, `--dur-*`, `--ease-*` for transitions and motion timing.
- Dark theme mapping must happen through token overrides (`[data-theme="dark"]`), not per-component hardcoded colors.

Deprecation policy:
- Existing aliases such as `--text-*`, `--lh-*`, `--track-*`, `--dur-ui`, and `--ease-out-premium` remain available for compatibility.
- New work should prefer primary system tokens first, then aliases only when required by legacy components.

## Component Contracts

Shared contracts now standardized:
- Page shell:
  - `page-main` utility for top/bottom page rhythm.
  - `--layout-page-max`, `--layout-reading-max`, `--layout-gutter`.
- Chip/tag primitives:
  - `--chip-*` token family.
  - Use this contract for badges, metadata pills, project tags, and compact status chips.
- Label-column layouts:
  - `--layout-label-col` for split label/content rows.

Allowed customization points:
- Per-section spacing via local custom property (example: `--home-section-gap`).
- Component-specific visual accents (gradients, decorative marks, marquee patterns).
- Variant-level overrides for hero layouts and media treatments.

Not allowed for new changes:
- Re-defining core token names in multiple files.
- One-off chip styles when `--chip-*` covers the need.
- Hardcoded transition curves/durations when motion tokens exist.

## Layout Normalization

Cross-page alignment target:
- Home/About/Case Study should share page shell rhythm, container width policy, and mobile collapse behavior.
- Split-label sections use `--layout-label-col`.
- Reading-heavy blocks should align to `--layout-reading-max`.

## Guardrails

Token consistency lint:
- `npm run lint:tokens`
- Checks for:
  - Missing token declarations (`var(--x)` used but never declared).
  - Duplicate declarations of core token families across files.

`npm run lint` now runs `lint:tokens` first.

## New Section Checklist

Before shipping a new section:
1. Tokens
   - Uses existing semantic tokens (`layout`, `chip`, `motion`, `spacing`) before adding new ones.
2. Spacing/Layout
   - Aligns to `page-main` rhythm and container conventions.
3. Metadata
   - Route metadata remains accurate (title/description/canonical/OG).
4. Accessibility
   - Keyboard focus visible and meaningful.
   - Reduced-motion behavior does not rely on animation for understanding.
5. Motion
   - Uses shared duration/easing tokens.
6. Responsive
   - Mobile/tablet/desktop checked for overflow and overlap.
