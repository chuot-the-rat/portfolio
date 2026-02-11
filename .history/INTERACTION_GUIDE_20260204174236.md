# Portfolio Interaction Guide

## Jackie Hu–Style Editorial Micro-Interactions

This document explains the interaction choices and editorial decisions applied consistently across all projects and case studies in this portfolio.

---

## Philosophy

**Goal:** Create a playful, sophisticated portfolio with Jackie Hu–style restraint
- Nothing overly flashy or cluttered
- Motion supports storytelling, not just decoration
- Negative space and editorial layout enhance readability
- Snappy, confident animations with intentional timing

**Inspiration:** Editorial fashion layouts, magazine spreads, asymmetric composition

---

## Interaction System

### 1. **Cursor-Aware Parallax (Project Cards)**

**Location:** `src/components/ProjectCard.jsx`

**Behavior:**
- Subtle 3D tilt that follows cursor movement
- ±1.5° rotation on X/Y axes based on mouse position
- Smooth spring physics (stiffness: 200, damping: 20)
- Resets to neutral on mouse leave

**Purpose:** Adds playful depth without being distracting. Makes cards feel tactile and responsive.

**Technical Implementation:**
```jsx
const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);

const rotateX = useSpring(
  useTransform(mouseY, [-0.5, 0.5], [1.5, -1.5]), 
  { stiffness: 200, damping: 20 }
);
const rotateY = useSpring(
  useTransform(mouseX, [-0.5, 0.5], [-1.5, 1.5]), 
  { stiffness: 200, damping: 20 }
);
```

---

### 2. **Free-Floating Preview Media**

**Location:** `src/components/PreviewPanel.jsx`

**Behavior:**
- Media floats directly in whitespace (no containers)
- Diagonal entry animation with rotation + skew
- Staggered timing (0.1s delay per item)
- Snappy 0.3s duration with custom easing `[0.16, 1, 0.3, 1]`

**Motion Variants:**
```jsx
hidden: {
  opacity: 0,
  x: 80 + index * 20,
  y: -40 + index * 25,
  rotate: 2 + index,
  skewY: 1
}
visible: {
  opacity: 1,
  x: 0, y: 0,
  rotate: 0,
  skewY: 0
}
```

**Purpose:** Creates editorial drama. Media "pops" into space with confidence, mimicking fashion magazine layouts.

---

### 3. **Interactive Hover Details**

**Location:** `src/components/PreviewPanel.jsx`

**Behavior:**
- Category and year metadata fades in on media hover
- Frosted glass label with 0.25s fade
- Positioned top-left of preview media
- Gentle color overlay (2–4% opacity gradient)

**Styling:**
```css
.preview-hover-detail {
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(8px);
  transition: opacity 0.25s;
}
```

**Purpose:** Provides context without cluttering the interface. Details appear only when user is interested (hovering).

---

### 4. **Skewed Preview Animation**

**Location:** `src/components/PreviewPanel.jsx`

**Behavior:**
- Subtle skewY transform on entry/exit
- ±1° skew for editorial dynamism
- Combined with rotation for layered motion

**Purpose:** Adds editorial sophistication. The slight skew makes motion feel intentional and designed, not just "sliding in."

---

### 5. **Hover Scale + Rotation**

**Location:** `src/components/PreviewPanel.jsx`

**Behavior:**
- 2% scale increase on hover
- ±0.5° rotation (alternates per item)
- 0.3s transition with snappy easing

**Purpose:** Acknowledges user interaction. Feels responsive and playful without being aggressive.

---

### 6. **Scroll-Linked Image Reveals (Case Studies)**

**Location:** `src/pages/ProjectDetail.jsx`

**Behavior:**
- Images revealed with `whileInView` from Framer Motion
- Initial offset: 40px down + ±1° rotation
- Staggered delays (0.12s per image)
- Viewport trigger: `-50px` margin
- Duration: 0.7s with custom easing

**Motion Pattern:**
```jsx
initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? -1 : 1 }}
whileInView={{ opacity: 1, y: 0, rotate: 0 }}
viewport={{ once: true, margin: "-50px" }}
transition={{ duration: 0.7, delay: index * 0.12 }}
```

**Purpose:** Progressive disclosure. Content reveals gracefully as user scrolls, maintaining focus and rhythm.

---

### 7. **Case Study Image Hover Effects**

**Location:** `src/pages/ProjectDetail.jsx`, `src/pages/ProjectDetail.css`

**Behavior:**
- 1% scale + ±0.5° rotation on hover
- Gradient overlay fades in (0.3s)
- Cursor changes to pointer

**Styling:**
```css
.section-image-overlay {
  background: linear-gradient(
    135deg, 
    rgba(33, 33, 33, 0.03) 0%, 
    rgba(33, 33, 33, 0.06) 100%
  );
}
```

**Purpose:** Makes case study images feel interactive and alive. Subtle enough to not distract from content.

---

## Editorial Layout Principles

### Asymmetry
- Project cards have staggered transforms (-40px, +80px, +20px, +120px)
- Preview media positioned diagonally across whitespace
- No grid lock—intentional, confident placement

### Negative Space
- Hero section: 128px margins, generous breathing room
- Between sections: 96–128px spacing
- Media doesn't fill space—it floats in it

### Typography
- Hero title: 96px, light weight (300)
- Card titles: 48–56px, medium weight (500)
- Metadata: 11px, tracked (0.08em), uppercase
- High contrast, generous line-height (1.6–1.8)

### Motion Timing
- **Snappy:** 0.25–0.3s for hover interactions
- **Confident:** Custom easing `[0.16, 1, 0.3, 1]` (ease-out with overshoot)
- **Staggered:** 0.1–0.12s delays for layered reveals
- **Intentional:** No motion without purpose

---

## Technical Stack

- **React 18.3** + **Vite 7.2.4**: Fast dev environment
- **Framer Motion 11.0.3**: All animations and micro-interactions
- **React Router 6.22.0**: Case study navigation
- **CSS Variables**: Design system (spacing, typography, colors)

---

## Accessibility

### Reduced Motion
All animations respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  .preview-media-float,
  .preview-image,
  .preview-video {
    transition: none !important;
    animation: none !important;
  }
}
```

### Keyboard Navigation
- All interactive elements are focusable
- Links use React Router for proper navigation
- Hover states also apply to `:focus-visible`

---

## Content-Driven Layout Types

Preview media adapts to project category:

### Mobile Layout
- Narrower widths (240px)
- Vertical stacking
- Tighter vertical spacing

### Desktop Layout
- Wider widths (480px)
- More horizontal spread
- Diagonal composition

### Mixed Layout
- Flexible sizing (300–420px)
- Magazine-style asymmetric positioning
- Maximum editorial impact

---

## Consistency Rules

### Across Project Cards
✓ Same cursor-aware parallax
✓ Same hover lift (-4px translateY)
✓ Same spring physics
✓ Same timing (0.3s)

### Across Preview Panels
✓ Same diagonal entry animation
✓ Same skew + rotation pattern
✓ Same hover details appearance
✓ Same color overlay style

### Across Case Studies
✓ Same scroll-linked reveals
✓ Same staggered delays
✓ Same hover effects on images
✓ Same gradient overlays

---

## Design Decisions

### Why diagonal motion?
Creates editorial drama. Straight vertical/horizontal motion feels predictable—diagonal with rotation feels intentional and designed.

### Why such short durations (0.3s)?
Snappy motion feels confident. Long animations (0.6s+) feel sluggish and interfere with browsing.

### Why cursor-aware parallax?
Adds playfulness without complexity. Makes cards feel tactile and responsive to user input.

### Why staggered delays?
Prevents overwhelming "pop-in." Layered motion creates depth and guides the eye.

### Why minimal rotations (±1.5°)?
Restraint is key. Large rotations feel gimmicky. Subtle tilts add sophistication.

### Why frosted glass labels?
Maintains legibility without blocking visuals. Feels modern and editorial.

### Why no containers on preview media?
Jackie Hu–style free-floating media. Containers create boxes—we want artifacts floating in whitespace.

---

## File Structure

```
src/
├── components/
│   ├── ProjectCard.jsx      # Cursor-aware parallax cards
│   ├── ProjectCard.css       # Editorial card styling
│   ├── PreviewPanel.jsx      # Free-floating media with hover details
│   └── PreviewPanel.css      # Media styling + overlays
├── pages/
│   ├── Home.jsx              # Asymmetric project grid
│   ├── Home.css              # Editorial layout + hero
│   ├── ProjectDetail.jsx     # Case study with scroll reveals
│   └── ProjectDetail.css     # Case study styling + image effects
└── styles/
    └── index.css             # Design system variables
```

---

## Lessons Learned

1. **Motion supports storytelling, not just decoration**
   - Every animation has a purpose
   - No motion for motion's sake

2. **Negative space enhances readability**
   - Generous margins create breathing room
   - Whitespace is not wasted space

3. **Iterations from lo-fi to high-fi are essential**
   - Early wireframes identified UX issues
   - Progressive refinement improved clarity

4. **Restraint is more sophisticated than excess**
   - Subtle effects (1–2°, 1–2% scale) feel professional
   - Flashy effects distract from content

5. **Consistency creates cohesion**
   - Same timing, easing, and patterns across all projects
   - Users learn the interaction language once

---

## Credits

- **Design System:** Fashion editorial inspiration (asymmetry, negative space)
- **Motion Philosophy:** Jackie Hu–style restraint and confidence
- **Technical Approach:** Framer Motion for declarative animations
- **Case Study Content:** InkLink collaborative writing platform

---

**Last Updated:** February 2026
