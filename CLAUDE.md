# Portfolio — Quick Reference

## Project Types

| Type | Route | Data source |
|---|---|---|
| Case study | `/projects/:id` | `src/assets/case_studies_standardized.json` → `ProjectDetail.jsx` |
| Standalone | `/design/:slug` | `public/projects/{id}/data.json` → `ProjectLayout.jsx` |

Current case studies: `prolog`, `inklink`, `sidequest`
Current standalone: `fizzu-soda`, `sap`

---

## Adding a New Project

### Case study (e.g. a new UX project)
1. Add an entry to `src/assets/case_studies_standardized.json` under `case_studies`
2. Add a row to `public/projects.json` (for the listing page thumbnail)
3. Create `public/projects/{id}/data.json` if you need supplemental embeds or video
4. Drop any images into `public/projects/{id}/images/`

### Standalone project (e.g. a motion/design piece)
1. Create `public/projects/{slug}/data.json` — follow the SAP or fizzu-soda format
2. Add the slug to `STANDALONE_PROJECT_IDS` in `src/App.jsx`
3. Add a row to `public/projects.json`
4. Put assets in `public/projects/{slug}/`

---

## Key Files

```
src/
  App.jsx                          — Routes + STANDALONE_PROJECT_IDS list
  assets/
    case_studies_standardized.json — All case study content
  utils/
    projectDataMapper.js           — Maps JSON → component props
  pages/
    ProjectDetail.jsx              — Case study renderer
    ProjectLayout.jsx              — Standalone project renderer
    Home.jsx                       — Homepage
    Projects.jsx                   — /projects listing
  components/
    FigmaEmbed.jsx / .css          — Lazy iframe with expand modal
    Navigation.jsx / .css          — Top nav
    PreviewPanel.jsx               — Hover preview on home
  styles/
    index.css                      — Design tokens (colors, spacing, type)
    App.css                        — Page transitions

public/
  projects.json                    — Master project list (id, title, thumbnail)
  projects/{id}/
    data.json                      — Supplemental data (video, embeds)
    images/                        — Project images (use absolute /projects/... paths)
```

---

## Figma Embeds

Use `FigmaEmbed` anywhere inside `ProjectDetail.jsx`:
```jsx
<FigmaEmbed
  src="https://embed.figma.com/..."
  title="My embed"
  type="figma-design"   // figma-design | figma-slides | figma-proto
  caption="Optional caption"
/>
```

Embed URLs come from Figma → Share → Embed → copy the `src` from the iframe code.

---

## Image Paths

Always use absolute paths starting with `/projects/...` so they work in both dev and production.

```json
{ "src": "/projects/inklink/images/Home.svg", "alt": "..." }
```

---

## Broken images you'll need to fix when ready

- ProLog case study: `lofi-1.png`, `lofi-2.png`, `hifi-1.png`–`hifi-3.png` — export from Figma and drop in `public/projects/prolog/`
- SideQuest case study: `lofi-1.png`, `hifi-1.png`–`hifi-4.png` — same, drop in `public/projects/sidequest/`
- All project thumbnail icons: `projects/{id}/icon.svg` referenced in `public/projects.json` — needs icons exported per project
