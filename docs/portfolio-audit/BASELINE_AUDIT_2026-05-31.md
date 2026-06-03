# Portfolio Baseline Audit (2026-05-31)

Scope: `InkLink`, `SideQuest`, `ProLog` only.

Superseded note (2026-06-02): Keep this document as historical context only. The current hiring-readiness reference is [HIRING_READINESS_BASELINE_2026-06-01.md](/C:/Users/leana/OneDrive/Desktop/Portfolio/docs/portfolio-audit/HIRING_READINESS_BASELINE_2026-06-01.md), which reflects the current About-page contact/resume handoff, design-first positioning, and browser-verified recruiter flow.

## Target Positioning

- Positioning statement: UI/UX designer with product thinking, research-informed decisions, strong visual systems, and frontend fluency as a support skill.
- Primary roles: UI/UX Designer, Product Designer, UX Research + Product hybrid.
- De-emphasize: frontend-first identity.

## Baseline Skill Matrix (Visible Portfolio Evidence)

| Skill | Current (1-5) | Desired (1-5) | Evidence currently shown | Gap | Action |
| --- | --- | --- | --- | --- | --- |
| UX Research | 3 | 4 | Methods/findings + validation sections on top 3 | Decision linkage is inconsistent across sections | Add explicit assumption -> evidence -> design response blocks |
| Problem Framing | 3 | 4 | Problem sections exist on all top 3 | Not always concise in first screenful | Tighten opening summaries and first-paragraph framing |
| Interaction Design | 4 | 4 | Strong prototypes, flows, and states | Some rationale is implicit | Add “why this interaction” captions for key states |
| UI Design | 4 | 5 | High-fidelity visuals and hierarchy | Cross-project presentation consistency | Standardize card/value-statement structure and section rhythm |
| Product Thinking | 2 | 4 | Outcomes and validation present | Tradeoffs/cuts underrepresented | Add “what was cut” and “next iteration” in top 3 |
| Content Design / UX Writing | 3 | 4 | Improved concise section copy | Value statements vary in strength | Enforce evidence-first copy guardrails |
| Usability Testing | 3 | 4 | Validation methods/outcomes in all 3 | Evidence density varies by project | Add explicit “research changed direction” statements |
| Frontend (support) | 3 | 3 | Reliable interactions/performance | Can overshadow design in copy | Keep frontend mention secondary in hero/metadata |

## Project Baseline Scores

| Project | Score /5 | Strength | Weakness | Next action |
| --- | --- | --- | --- | --- |
| InkLink | 3.8 | Clear collaborative writing problem and polished final states | Pivot rationale not consistently explicit | Add structured evidence narrative and cut-list |
| SideQuest | 3.7 | Strong concept framing and quick-start simplification | Tradeoff depth not visible enough | Add assumption/decision chain + next-iteration test plan |
| ProLog | 3.4 | Strong domain complexity and user need relevance | Role framing surfaced as developer-first in previews | Enforce design-first display role precedence and evidence narrative |

Update (2026-06-01): Top-3 media captions and comparison narratives were refreshed for consistent decision-evidence clarity across hook, research, design response, and validation sections.

Update (2026-06-02): The remaining route and positioning risks noted here have been resolved in the live structure. `/contact` now remains an alias to `/about`, `/resume` now lands on `/about#resume`, and the About page owns the primary contact/resume handoff without reintroducing a standalone resume or contact page.

## Prioritized Backlog

| Priority | Area | Gap | Implementation task | Status |
| --- | --- | --- | --- | --- |
| P0 | Positioning | Hero + metadata still risk frontend-heavy interpretation | Update homepage descriptor/subline and route metadata to design-first framing | Complete |
| P0 | Case-study evidence | Top 3 missing explicit assumption/pivot/cut/next fields | Add `evidence_narrative` fields and render decision evidence section | Complete |
| P0 | Card model | Mixed-role projects can surface non-design-first role | Add deterministic display-role priority and role/scope/year ordering | Complete |
| P1 | Guardrails | No automated checks for evidence completeness and copy quality | Add audit guardrail script and wire into QA command | Complete |
| P1 | Runbook | QA docs missing audit gate coverage | Update QA runbook with audit guardrail checks | Complete |
| P2 | Content polish | Remaining narrative variance across older sections | Continue tightening legacy copy to evidence-first pattern | Complete |

## Recruiter Scan Baseline

### 10-second scan
- [x] Role is clear at a glance after hero copy update.
- [x] First-click work path is visible.
- [x] Contact/resume actions are discoverable.

### 30-second scan
- [x] Core strengths (research, product thinking, visual execution) are identifiable.
- [x] Top 3 case studies are differentiated.
- [x] Hiring handoff remains clear.

### 2-minute scan
- [x] Each top case now includes explicit decision evidence chain.
- [x] Outcome claims remain qualitative/honest.
- [x] Ownership is clearer in project-card metadata and case headers.

## Historical Status

- Treat the gaps and actions above as the pre-refresh baseline that led to the June hiring-readiness baseline.
- Do not reopen the resolved frontend-first positioning or standalone contact/resume page concerns unless a new regression appears in guardrails or browser QA.
