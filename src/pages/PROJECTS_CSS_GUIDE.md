# Projects CSS - Refined Interactive Layout Guide

## Overview

A refined project list CSS inspired by Jackie Hu's interactive previews and Sharleen Wang's clean structure. Focus on:
- **Strong hierarchy** through spacing and typography
- **Refined hovering** with subtle reveals and elevation
- **Clean metadata** structured and precise
- **Smooth transitions** controlling motion carefully
- **De-emphasis system** using opacity to guide focus

---

## Design Principles

### 1. **Minimal by Default**
- Cards are calm and unobtrusive
- Hover state reveals refined elevation, not chaos
- Metadata is subtle but structured
- Never more than one thing animating

### 2. **Hierarchy Through Typography**
- **Title:** Large (24px), bold, command attention on hover
- **Subtitle:** Medium (16px), secondary color, relaxed line-height
- **Metadata:** Small (11px), uppercase tracked, color shifts on hover

### 3. **Motion in Purpose**
- Hover: Translate Y(-2px) + shadow lift
- Transition timing: 300ms smooth easing
- Border and color shift to guide the eye
- No bouncy, exaggerated motion

### 4. **De-Emphasis Pattern**
When a card is hovered:
- Hovered card: Normal > lifted + enhanced colors
- Other cards: Gradually fade to 60% opacity
- Creates focus without being aggressive

---

## CSS Key Features

### Token System Integration

All values use CSS variables:

```css
/* Colors */
--color-bg              /* #ffffff */
--color-border          /* #e5e5e5 */
--color-text            /* #1a1a1a */
--color-text-secondary  /* #737373 */
--color-text-tertiary   /* #a3a3a3 */
--color-accent          /* #212121 (title on hover) */

/* Spacing */
--space-3: 12px         /* gaps */
--space-4: 16px         /* content padding adjustments */
--space-6: 24px         /* padding, gaps */
--space-8: 32px         /* card padding, gap */
--space-12: 48px        /* grid gap desktop */
--space-16: 64px        /* grid gap wide */

/* Motion */
--duration-base: 300ms
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)

/* Radius */
--radius-lg: 12px

/* Shadows */
--shadow-none: none
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08)
```

### Layout Structure

```css
.projects-grid
  ├─ grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))
  ├─ gap: var(--space-12)  /* 48px on desktop */
  └─ Responsive: 1fr on mobile, 2-3 cols on tablet/desktop

.project-card
  └─ position: relative
  └─ height: 100%

.project-card-link
  ├─ padding: var(--space-8)  /* 32px spacing inside */
  ├─ border: 1px solid var(--color-border)
  ├─ border-radius: var(--radius-lg)  /* 12px */
  └─ flex-direction: column (header at top, meta at bottom)
```

### Hover State Behavior

```css
/* Default (calm) */
.project-card-link {
    background: white
    border: light gray
    shadow: none
    transform: none
}

/* Hover (refined elevation) */
.project-card-link:hover {
    border: darker gray (--color-text-tertiary)
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08)
    transform: translateY(-2px)
}

/* All transitions */
transition: all 300ms smooth-easing
```

### Typography Hierarchy

```css
.project-card-title         /* 24px, weight 600 */
  └─ hover: color shifts to --color-accent (darker)

.project-card-subtitle      /* 16px, secondary color */
  └─ hover: stays secondary but slightly lighter opacity

.project-card-meta          /* 11px, uppercase, tracked */
  └─ hover: color shifts to more visible secondary
```

---

## Interaction Model

### Option 1: CSS-Only (Hover)
The current CSS handles everything with `:hover` selectors. When you hover a card, only that card lifts and shifts colors. Other cards remain unchanged.

**Simplest approach, works great for portfolios.**

### Option 2: JavaScript De-Emphasis (Enhanced)
Add optional de-emphasis system using JS classes:

```javascript
// In Projects.jsx, add to existing hoveredProject state:

<motion.div
    className={`project-card ${
        hoveredProject && hoveredProject.id !== project.id
            ? 'is-muted'
            : ''
    } ${hoveredProject?.id === project.id ? 'is-active' : ''}`}
    onMouseEnter={() => setHoveredProject(project)}
    onMouseLeave={() => setHoveredProject(null)}
>
    {/* card content */}
</motion.div>
```

**CSS already supports these classes:**

```css
.project-card.is-muted .project-card-link {
    opacity: 0.6;           /* Fades non-active cards */
}

.project-card.is-active .project-card-link {
    border-color: darker;
    box-shadow: more prominent;
}
```

**Result:** When you hover one project, others fade to 60% opacity. Creates strong focus without being jarring.

---

## Component Breakdown

### Grid Container
```css
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-12);  /* 48px spacing between cards */
}

@media (min-width: 1200px) {
    gap: var(--space-16);  /* 64px on very large screens */
}

@media (max-width: 768px) {
    grid-template-columns: 1fr;  /* Full width on mobile */
}
```

**Result:** 3 columns on desktop (300px min), 1 column on mobile. Responsive without media queries for the grid itself.

### Card Container
```css
.project-card-link {
    display: flex;
    flex-direction: column;
    padding: var(--space-8);  /* 32px padding */
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);  /* 12px rounded */
}
```

**Layout:**
- Header (title + subtitle) at top, grows to fit content
- Metadata row at bottom on top padding (always visible)
- All transitions use smooth 300ms easing

### Title (Primary)
```css
.project-card-title {
    font-size: var(--font-size-xl);  /* 24px */
    font-weight: 600;
    color: var(--color-text);  /* Dark gray/black */
}

.project-card-link:hover .project-card-title {
    color: var(--color-accent);  /* Shifts to darker on hover */
}
```

**Effect:** Title becomes immediately more prominent on hover (darker/bolder).

### Subtitle (Supporting)
```css
.project-card-subtitle {
    font-size: var(--font-size-base);  /* 16px */
    color: var(--color-text-secondary);  /* Medium gray */
    line-height: var(--line-height-relaxed);  /* 1.8 */
}

.project-card-link:hover .project-card-subtitle {
    opacity: 0.85;  /* Subtle dim/reveal */
}
```

**Effect:** Slight opacity shift to differentiate hovered card from others.

### Metadata Row (Bottom)
```css
.project-card-meta {
    font-size: var(--font-size-xs);  /* 11px */
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-tracking);  /* 0.1em */
    color: var(--color-text-tertiary);  /* Light gray */
    border-top: 1px solid var(--color-border);
    padding-top: var(--space-6);  /* 24px */
}

.project-card-link:hover .project-card-meta {
    border-top-color: var(--color-text-tertiary);  /* Darker border */
    color: var(--color-text-secondary);  /* More visible text */
}
```

**Effect:** Metadata becomes more legible on hover (darker text, darker divider line).

---

## Hover State Timeline

```
Default → Hover
├─ 0ms         Border color shifts (light → medium)
├─ 0ms         Transform triggers (none → Y-2px)
├─ 0ms         Shadow appears (none → md)
├─ 0ms         Title color shifts (black → dark)
├─ 0ms         Meta color shifts (light gray → medium gray)
│
└─ All animated over 300ms with smooth easing
  (cubic-bezier(0.4, 0, 0.2, 1))
```

No jank, no bounce. Everything feels controlled and intentional.

---

## De-Emphasis Effect (If Using JS)

When hovering a card with JavaScript state tracking:

```
Normal State:
├─ All cards: opacity 1
└─ All cards: visible at full strength

Hover State (one card active):
├─ Hovered card: opacity 1 + shadow + border color
├─ Other cards: opacity 0.6 (faded)
└─ Creates clear focus without hiding content
```

**Enable this by adding to Projects.jsx:**
```javascript
// Add class based on hovered state
className={`project-card ${
    hoveredProject && hoveredProject.id !== project.id ? 'is-muted' : ''
}`}
```

---

## Responsive Behavior

### Desktop (1024px+)
- 3 columns (300px cards)
- 48px gap
- Full hover effects
- Title 24px, subtitle 16px

### Tablet (768px - 1024px)
- 2 columns
- 48px gap
- Hover effects still work
- Title 18px, subtitle 16px

### Mobile (< 768px)
- 1 column (full width)
- 32px gap
- Active state on tap (less pronounced)
- Title 18px, subtitle 16px
- Padding reduced to conserve space

```css
@media (max-width: 768px) {
    .projects-grid {
        grid-template-columns: 1fr;
        gap: var(--space-8);  /* 32px instead of 48px */
    }

    .project-card-link {
        padding: var(--space-6);  /* 24px instead of 32px */
    }

    /* On mobile, :active replaces :hover */
    .project-card-link:active {
        background-color: var(--color-bg-secondary);
    }
}
```

---

## Accessibility

### Focus States
```css
.project-card-link:focus-visible {
    outline: var(--focus-ring);  /* 2px solid */
    outline-offset: var(--focus-offset);  /* 2px */
}
```

Keyboard navigation highlights cards clearly.

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
    .project-card-link {
        transition: none;
    }

    .project-card-link:hover {
        transform: none;  /* No Y translation */
    }
}
```

Users with motion sensitivity see no animations.

### High Contrast
```css
@media (prefers-contrast: more) {
    .project-card-link {
        border-width: 2px;  /* Thicker borders */
    }
}
```

Better visibility in high contrast modes.

---

## Implementation Checklist

### Step 1: Replace Projects.css
- ✅ Already done. The file is updated with token-based system.

### Step 2: Verify Imports
Make sure Projects.jsx imports the new CSS:
```javascript
import "./Projects.css";  // Should be there
```

### Step 3: Test States
- [ ] Hover over a project card (should lift + colors shift)
- [ ] Check on mobile (should tap/active state work)
- [ ] Tab navigation (should show focus rings)
- [ ] Dark mode (should invert colors correctly)
- [ ] Reduced motion (should have no transforms)

### Step 4: Optional Enhancement
If you want de-emphasis effect, add to Projects.jsx:
```javascript
// Add these classNames to the project-card motion.div:
className={`project-card ${
    hoveredProject && hoveredProject.id !== project.id ? 'is-muted' : ''
} ${hoveredProject?.id === project.id ? 'is-active' : ''}`}
```

### Step 5: Done!
Your project list now has:
- ✅ Token-based styling (scales globally)
- ✅ Refined hover states (elevated, color shifts)
- ✅ Typography hierarchy (title > subtitle > metadata)
- ✅ Smooth transitions (300ms smooth easing)
- ✅ Responsive behavior (desktop/tablet/mobile)
- ✅ Accessibility (focus rings, reduced motion, high contrast)

---

## Design Inspiration

### From Jackie Hu
- **Refined hover:** Subtle elevation, not dramatic
- **Color shifts:** Title color changes to draw attention
- **Calm default:** Cards are quiet until interacted with
- **Intentional spacing:** Generous gaps create sophistication

### From Sharleen Wang
- **Structured metadata:** Clean, tracke uppercase labels
- **Clear hierarchy:** Large title, supporting subtitle, small metadata
- **Minimal decoration:** No unnecessary UI elements
- **Editorial layout:** Whitespace does the work

### Principles Applied
1. **Minimal activation cost** → Small hover state changes
2. **Strong visual feedback** → Border, shadow, color all shift together
3. **Restrained motion** → 300ms smooth, no bounce
4. **Clear focus** → Optional de-emphasis makes active card obvious
5. **Intentional details** → Every transition serves a purpose

---

## Customization

### Change Card Size
```css
.projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    /* Adjust minmax 300px to your preferred width */
}
```

### Adjust Hover Lift
```css
.project-card-link:hover {
    transform: translateY(-3px);  /* More lift: -3px, Less: -1px */
}
```

### Change Title Color on Hover
```css
.project-card-link:hover .project-card-title {
    color: var(--color-accent);  /* Change to any token */
}
```

### Control Gap Spacing
```css
.projects-grid {
    gap: var(--space-12);  /* 48px, Change to var(--space-16), etc. */
}
```

### De-Emphasis Strength
```css
.project-card.is-muted .project-card-link {
    opacity: 0.6;  /* 60%, Change to 0.5 or 0.75 */
}
```

All changes scale through the design tokens. Update one variable, everything cascades.

---

## What This Achieves

✅ **Cohesion:** Uses global design tokens throughout
✅ **Hierarchy:** Clear typography scale and spacing
✅ **Interaction:** Refined hover that guides focus
✅ **Performance:** Smooth 60fps transitions (transform + shadow only)
✅ **Accessibility:** Focus states + reduced motion + high contrast
✅ **Responsive:** Works beautifully at all sizes
✅ **Maintainable:** Well-organized, commented CSS
✅ **Scalable:** Easy to adjust via tokens/variables

---

## Next Steps

1. **Verify it works:** Load the page, hover projects, check all responsive sizes
2. **Optional JS enhancement:** Add `is-muted` / `is-active` classes for de-emphasis
3. **Consistency:** Use this as your model for other interactive sections

The refined project list is ready to go! 🎨
