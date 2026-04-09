# Release Notes

## Case Study Phase 2 Slice

### Highlights
- Confirmed ProLog and SideQuest Phase 2 narrative fields are wired and active:
  hero marquee copy, section-level media demos, do/don't verdict cards, and checklist sections.
- Activated and validated Phase 2 case-study presentation components in detail flow:
  `CaseStudyHeroMarquee`, `BrowserMockup`, `PrincipleVerdict`, `ChecklistSection`, and divider rhythm.
- Fixed legacy project route handling so standalone IDs resolve correctly:
  `/projects/fizzu-soda` now redirects to `/design/fizzu-soda` instead of `/case-studies/fizzu-soda`.

### Quality + Stability
- Resolved design-token lint blocker by replacing undefined `--space-14` token with `--space-12` in `ProjectDetail.css`.
- Lint and production build pass after Phase 2 integration checks.
- Route smoke checks pass for case-study, standalone design, and unknown routes.

## Hiring Conversion + Stability Update

### Highlights
- Refined homepage positioning and recruiter-first CTA language.
- Added a proof strip under the hero for role, location, availability, graduation, and strengths.
- Added case-study impact snapshots and a standardized credibility summary block.
- Expanded case-study artifact links to include available Figma links.
- Completed Home + Projects + About visual/copy polish pass with mobile readability refinements.

### SEO + Discoverability
- Implemented route-level metadata updates (title, description, canonical, OG/Twitter, robots).
- Added route-level structured data support and improved default head metadata.

### Performance + Accessibility
- Added route-level lazy loading for key pages to improve initial payload behavior.
- Added reduced-motion-aware media behavior for hover previews and case-study mockup video playback.
- Added focus-visible affordances on key work-list interactions and CTA touchpoints.

### Code Quality
- Fixed conditional hook risk in floating hero tags.
- Cleaned lint configuration scope to avoid history/worktree noise and keep checks actionable.
- Lint and production build now pass in current workspace state.
- Fixed route regression: `/projects` now renders the Projects page (no redirect to `/`).
