# Release Notes

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
