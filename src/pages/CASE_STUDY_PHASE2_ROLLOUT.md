# Phase 2 Rollout Checklist (ProLog + SideQuest)

## Structure
- [x] Add `hero.marqueeText` copy.
- [x] Add section-level `media_demo` blocks for at least research + solution.
- [x] Add section-level `verdict.do` and `verdict.dont` pairs.
- [x] Add root-level `checklist` section with 4-6 items.

## Content Quality
- [x] Keep paragraphs to 2-3 sentences for scannability.
- [x] Ensure title includes work type when appropriate.
- [x] Confirm role/team metadata is explicit in hero meta bar.
- [x] Ensure each major image has a caption.
- [x] Ensure validation/outcome statements are present and factual.

## Visual QA
- [x] Verify browser mockup appears for configured `media_demo`.
- [x] Verify do/don't cards show 2-column desktop and 1-column mobile.
- [x] Verify large outlined section numerals render in each section index.
- [x] Verify checklist section spacing and divider rhythm.

## Motion QA
- [x] Verify marquee loops and stops for `prefers-reduced-motion`.
- [x] Verify browser mockup reveal (fade + slight scale).
- [x] Verify do/don't stagger animation.
- [x] Verify checklist item sequential reveal.

## Integration Notes (2026-04-09)
- `ProjectDetail` currently activates Phase 2 components across case-study sections:
  `CaseStudyHeroMarquee`, `BrowserMockup`, `PrincipleVerdict`, `ChecklistSection`, `DecorativeDivider`.
- Legacy project route redirect now resolves standalone IDs correctly:
  `/projects/fizzu-soda` -> `/design/fizzu-soda`, while case-study IDs continue to `/case-studies/:id`.
- Token lint gate was fixed by replacing undefined `--space-14` with `--space-12` in `ProjectDetail.css`.
