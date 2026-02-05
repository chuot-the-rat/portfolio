# Portfolio Content Structure Update

## Summary of Changes

Projects now support two formats:

1. **Full Case Studies** - In-depth project documentation with Research, Lo-Fi, Iterations, Solution, and Impact sections
2. **Compact Projects** - Minimal editorial layouts for smaller projects (packaging, illustrations, concepts)

---

## Project Formats

### Format Detection

Projects automatically render in the appropriate format based on the `format` field:

```json
{
    "format": "compact" // Renders as compact project
}
```

Omit `format` or set to anything else for full case study layout.

---

## Compact Project Format (New!)

### Purpose

For smaller projects like packaging designs, illustrations, or concept work that don't need full case study sections.

### Features

- Clean, minimal, editorial layout
- Free-floating hero image with subtle hover effects
- 2-4 bullet highlights (what, tools, concept)
- Optional gallery of additional images
- Optional CTA links (Behance, Dribbble, live site)
- Jackie Hu–style negative space and asymmetry

### Data Structure

```json
{
    "id": "project-id",
    "title": "Project Title",
    "subtitle": "Optional one-liner description",
    "category": "Category",
    "year": "2024",
    "format": "compact",
    "description": "2-3 concise lines describing the project, tools used, creative approach, and key concept. Keep it simple and editorial.",
    "heroImage": {
        "src": "path/to/hero.png",
        "alt": "Alt text"
    },
    "links": {
        "live": "https://...",
        "behance": "https://behance.net/...",
        "dribbble": "https://dribbble.com/..."
    },
    "hoverImages": ["path/to/image1.png", "path/to/image2.png"]
}
```

### Layout Components

**Hero Section:**

- Centered title (48-64px)
- Optional subtitle (16-18px, light color)
- Category + Year tags
- CTA buttons (if links provided)

**Hero Image:**

- Free-floating with subtle shadow
- Hover: 1% scale + 0.5° rotation
- No container backgrounds

**Description:**

- 2-3 concise lines of text
- Centered, readable typography
- Simple and editorial

**Gallery:**

- Asymmetric grid (min 400px columns)
- Each image: hover scale + rotate
- Subtle gradient overlay on hover

---

## Full Case Study Structure

### 1. **Overview** (Section 01)

- High-level project description
- Goals and context
- Team structure

### 2. **Research & Ideation** (Section 02)

- Audience insights
- Competitive analysis
- Surveys and workshops
- Key findings

**Data Structure:**

```json
"research": {
    "title": "Research & Ideation",
    "description": "...",
    "images": [...]
}
```

### 3. **Lo-Fi Exploration & Early Concepts** (Section 03)

- Wireframes
- Sketches
- Early layout exploration
- Initial user testing feedback

**Data Structure:**

```json
"lofi": {
    "title": "Lo‑Fi Exploration & Early Concepts",
    "description": "...",
    "images": [...]
}
```

### 4. **Iterations & Refinements** (Section 04)

- Key problems identified
- What changed and why
- Before/after comparisons
- Progressive improvements

**Data Structure:**

```json
"iterations": {
    "title": "Iterations & Refinements",
    "description": "...",
    "improvements": [
        "Improvement 1",
        "Improvement 2",
        "Improvement 3"
    ],
    "images": [...]
}
```

### 5. **Final Solution** (Section 05)

- High-fidelity screens
- Editorial layout showcase
- Interactive hover previews
- Final implementation details

**Data Structure:**

```json
"solution": {
    "title": "Final Solution",
    "description": "...",
    "layout": "mobile|desktop|mixed",
    "images": [...]
}
```

### 6. **Impact & Lessons Learned** (Section 06)

- Project outcomes
- Key insights
- Reflections
- Metrics (can be qualitative or quantitative)

**Data Structure:**

```json
"outcomes": {
    "title": "Impact & Lessons Learned",
    "description": "...",
    "metrics": [
        { "value": "...", "label": "..." }
    ]
}
```

---

## Header CTA Implementation

Each project detail page now includes a prominent "Visit Live Site" link in the hero section.

**Features:**

- Positioned below tagline in hero
- Editorial styling with subtle border
- Hover animation (lift + shadow)
- External link icon
- Only appears if `project.links.live` exists

**Styling:**

- Minimal, borderless aesthetic
- Snappy 0.3s transitions
- Hover: -2px translateY + box-shadow
- Jackie Hu–style restraint

---

## InkLink Case Study Example

### Updated Content

**Overview:**

> InkLink is a platform for collaborative storytelling, enabling writers to extend, remix, and contribute to shared narratives. Our goal was to create an experience that is social, playful, and editorial...

**Research & Ideation:**

> We began by understanding the audience: competitive analysis of existing writing tools, surveys with writers and creative communities, and workshop sessions...

**Lo-Fi Exploration:**

> Wireframed navigation, story discovery, and contribution screens. Tested interaction logic with peers. Feedback highlighted confusion around entry points...

**Iterations & Refinements:**

- Highlighted CTAs for joining stories with motion and scale
- Removed containers; visuals float in whitespace
- Retuned animations for snappy ease-in/ease-out interactions
- Progressive reveal interactions to guide users

**Final Solution:**

> Editorial layout: asymmetry, whitespace, and modular sections. Interactive hover previews: images/videos float freely, with snappy motion...

**Impact & Lessons Learned:**

> Successfully communicates collaborative creativity. Balances expressive visuals with usability. Lessons Learned: Motion supports storytelling, not just decoration...

---

## Editorial Layout Principles

All case studies maintain Jackie Hu–style editorial design:

### Asymmetry

- Sections positioned with intentional negative space
- No rigid grid lock
- Content-driven layout variations per project

### Free-Floating Media

- Images/videos float in whitespace
- No container backgrounds
- Snappy diagonal animations with rotation
- Content-aware positioning (mobile/desktop/mixed)

### Typography Hierarchy

- Section labels: 11px, uppercase, tracked
- Titles: 32–48px, bold, tight leading
- Descriptions: 16–18px, generous line-height (1.7–1.8)
- Metadata: 14px, light weight

### Micro-Interactions

- Scroll-linked reveals (whileInView)
- Staggered delays (0.1–0.12s)
- Subtle rotation (±1°) on image entry
- Hover effects: scale + rotate + gradient overlay
- Duration: 0.3–0.7s with ease `[0.16, 1, 0.3, 1]`

---

## Component Updates

### ProjectDetail.jsx

**New Features:**

1. Header CTA link with live site URL
2. Support for Research section (`project.research`)
3. Support for Lo-Fi section (`project.lofi`)
4. Support for Iterations section (`project.iterations`)
5. Impact/Outcomes section with metrics grid
6. Legacy support (backwards compatible with old `problem`/`objectives` structure)

**Section Order:**

1. Overview
2. Research (or Problem if legacy)
3. Lo-Fi Exploration
4. Iterations & Refinements (or Objectives if legacy)
5. Final Solution
6. Impact & Lessons Learned

### ProjectDetail.css

**New Styles:**

- `.project-cta-link` - Header CTA button
- `.outcomes-section` - Impact section with top border
- `.outcomes-metrics` - Responsive metrics grid
- `.outcome-metric` - Individual metric card with hover effect
- `.metric-value` - Large metric number
- `.metric-label` - Small metric description

---

## Data Migration

### Old Structure (Legacy)

```json
{
    "overview": {...},
    "problem": {...},
    "objectives": [...],
    "solution": {...}
}
```

### New Structure (Recommended)

```json
{
    "overview": {...},
    "research": {...},
    "lofi": {...},
    "iterations": {
        "title": "...",
        "description": "...",
        "improvements": [...]
    },
    "solution": {...},
    "outcomes": {
        "title": "Impact & Lessons Learned",
        "description": "...",
        "metrics": [...]
    }
}
```

**Note:** Both structures are supported for backwards compatibility.

---

## Micro-Interaction Consistency

All projects maintain consistent interactive behaviors:

### Project Cards (Home Page)

- Cursor-aware parallax (±1.5° rotation)
- Smooth spring physics
- Hover lift (-4px translateY)

### Preview Panel (Home Page)

- Free-floating media with diagonal entry
- Interactive hover details (category/year fade-in)
- Subtle color overlays on hover
- Layered motion (scale + rotate)

### Case Study Images (Detail Page)

- Scroll-linked reveals with alternating rotation
- Staggered delays for depth
- Hover: 1% scale + ±0.5° rotation + gradient overlay
- Respects `prefers-reduced-motion`

---

## Accessibility & Performance

### Motion

- All animations use `prefers-reduced-motion` media query
- Reduced motion: transitions disabled
- Timing: 0.3–0.7s (snappy but not jarring)

### Navigation

- Semantic HTML structure
- Keyboard-accessible CTA links
- External links open in new tab with `rel="noopener noreferrer"`
- Back button with proper routing

### Loading States

- Spinner animation during project data fetch
- Graceful fallback if project not found
- Navigate to home on error

---

## Next Steps

### For Adding New Projects

1. **Create project folder** in `projects/[project-id]/`
2. **Add project data** to `projects/[project-id]/data.json`
3. **Register project** in `projects.json`
4. **Add images** to `projects/[project-id]/images/`

### Recommended Sections for Each Project

- **All Projects:** Overview, Final Solution, Impact
- **UX/UI Projects:** + Research, Lo-Fi, Iterations
- **Design Projects:** + Visual System, Technical Execution
- **Development Projects:** + Architecture, Implementation

### Live Site Links

Add to each `data.json`:

```json
"links": {
    "live": "https://your-project-site.com",
    "prototype": "https://figma.com/..."
}
```

---

## Technical Details

### React Router Structure

- Home: `/`
- Project Detail: `/project/:id`
- Dynamic routing with `useParams`
- Project loading from JSON files

### Framer Motion Integration

- `motion.section` for scroll reveals
- `whileInView` for scroll-linked animations
- `AnimatePresence` for preview swaps
- `useMotionValue` for cursor-aware parallax

### CSS Architecture

- Design system variables (`--space-*`, `--font-size-*`)
- Mobile-first responsive design
- Container queries for adaptive layouts
- Custom easing functions

---

**Last Updated:** February 2026  
**Version:** 2.0 - Structured Case Studies with Editorial Micro-Interactions
