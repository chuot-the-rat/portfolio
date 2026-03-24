# Global Design System — Complete Guide

## Overview

A complete, cohesive CSS foundation for your portfolio built on clean typography, intentional spacing, and minimal interactive states. Inspired by Jackie Hu's interaction-rich editorial style and Sharleen Wang's structured product-design aesthetic.

**Key Principle:** Minimal, Modern, Intentional — let content lead, design supports.

---

## File Structure

```
src/styles/
├── global.css          ← NEW: Enhanced global system
├── index.css           ← Keep: Tokens + base styles
└── App.css             ← Page transitions

src/components/
├── Navigation.css      ← UPDATED: Uses tokens
└── SectionLayout.css   ← UPDATED: Uses tokens
```

**Import order in your app:**
```javascript
import './styles/global.css';  // This must come after index.css in your build
```

---

## Token System

### Colors

**Semantic naming (no "primary/secondary" confusion):**

```css
--color-bg               /* Main background */
--color-bg-secondary     /* Subtle background (cards, sections) */
--color-text             /* Body text (dark/black) */
--color-text-secondary   /* Muted text (gray) */
--color-text-tertiary    /* Very light text (light gray) */
--color-border           /* Divider and border color */
--color-accent           /* Strong accent (dark/black) */
```

**Usage:**
```css
.card { background: var(--color-bg); border: 1px solid var(--color-border); }
.button { background: var(--color-accent); color: var(--color-bg); }
.metadata { color: var(--color-text-tertiary); }
```

### Typography Scale

Clean, geometric scale (16px base):

```css
--font-size-xs: 0.6875rem   /* 11px - micro labels */
--font-size-sm: 0.875rem    /* 14px - labels, small UI */
--font-size-base: 1rem      /* 16px - body text */
--font-size-lg: 1.125rem    /* 18px - intro text */
--font-size-xl: 1.5rem      /* 24px - h3 */
--font-size-2xl: 2rem       /* 32px - h2 */
--font-size-3xl: 2.5rem     /* 40px - h1 */
--font-size-4xl: 3rem       /* 48px - hero large */
--font-size-5xl: 4rem       /* 64px - hero extra large */
```

**Line Heights:**
```css
--line-height-tight: 1.2      /* Headings */
--line-height-normal: 1.6     /* Body text */
--line-height-relaxed: 1.8    /* Long-form reading */
```

### Spacing Scale

4px base increment (consistent with Figma/design systems):

```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
--space-20: 5rem     /* 80px */
--space-24: 6rem     /* 96px */
--space-32: 8rem     /* 128px */

/* Section Spacing (predefined combinations) */
--section-spacing-sm: 48px
--section-spacing-base: 64px
--section-spacing-lg: 96px
```

### Motion Tokens

Smooth, not springy:

```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)

--duration-extra-fast: 100ms
--duration-fast: 200ms        /* Hover states */
--duration-base: 300ms        /* Default transitions */
--duration-slow: 500ms        /* Entrance animations */
--duration-slower: 800ms      /* Long reveals */
```

### Border Radius System

```css
--radius-sm: 4px        /* Small UI elements */
--radius-base: 8px      /* Buttons, inputs */
--radius-lg: 12px       /* Cards, sections */
--radius-xl: 16px       /* Large containers */
--radius-full: 999px    /* Perfect circles */
```

---

## Component Patterns

### Buttons

**Basic Usage:**
```html
<!-- Default (outline) -->
<button class="button">Click me</button>

<!-- Primary (filled) -->
<button class="button button--primary">Click me</button>

<!-- Secondary (soft) -->
<button class="button button--secondary">Click me</button>

<!-- Ghost (transparent) -->
<button class="button button--ghost">Click me</button>

<!-- Sizes -->
<button class="button button--sm">Small</button>
<button class="button button--lg">Large</button>
```

**CSS:**
```css
.button {
    padding: var(--space-3) var(--space-6);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-base);
    transition: all var(--duration-fast) var(--ease-smooth);
}

.button:hover {
    border-color: var(--color-text);
    box-shadow: var(--shadow-md);
}
```

### Cards

```html
<!-- Bordered card -->
<div class="card">Content</div>

<!-- Elevated card -->
<div class="card card--elevated">Content</div>

<!-- Compact card -->
<div class="card card--compact">Content</div>
```

### Badges

```html
<span class="badge">Default</span>
<span class="badge badge--accent">Accent</span>
```

### Badges

---

## Layout Patterns

### Container (Constrain Width)

```html
<div class="container">
    <!-- Content constrained to --max-width (1280px) -->
</div>

<!-- Variants -->
<div class="container container--narrow">  <!-- 900px -->
<div class="container container--wide">    <!-- 1400px -->
<div class="container container--full">    <!-- Full width -->
```

### Page Sections

```html
<!-- Standard section -->
<section class="page-section">
    <div class="container">
        <h2>Section Title</h2>
        <!-- Content -->
    </div>
</section>

<!-- Larger spacing -->
<section class="page-section page-section--lg">

<!-- With border -->
<section class="page-section page-section--header">
```

**Spacing added automatically: `--section-spacing-base` (64px)**

### Two-Column Layout

```html
<div class="layout-2col">
    <div>Left Content</div>
    <div>Right Content</div>
</div>
```

Responsive: stacks to 1 column on mobile.

### Hero Section

```html
<section class="hero-section">
    <h1>Big Title</h1>
    <p>Tagline</p>
    <button class="button button--primary">CTA</button>
</section>
```

Full viewport height, centered, flexible children.

### Section Dividers

```html
<!-- Simple divider -->
<hr class="divider" />

<!-- Faded divider -->
<hr class="divider divider--fade" />

<!-- Thick accent divider -->
<hr class="divider divider--short" />
```

---

## Utility Classes

**Flexbox:**
```html
<div class="flex flex--center">Centered</div>
<div class="flex flex--between">Between</div>
<div class="flex flex--gap">With gap</div>
```

**Stack (Vertical):**
```html
<div class="stack">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</div>

<!-- Tight stack (8px gap) -->
<div class="stack stack--tight">
```

**Grid:**
```html
<!-- 2 columns -->
<div class="grid grid--2col">

<!-- 3 columns -->
<div class="grid grid--3col">

<!-- Auto (responsive) -->
<div class="grid grid--auto">
```

**Text Utilities:**
```html
<p class="text-muted">Muted text</p>
<p class="text-subtle">Very subtle</p>
<p class="text-accent">Accent color</p>
<p class="text-sm">Small text</p>
<p class="text-lg">Large text</p>
<p class="text-bold">Bold text</p>
<p class="text-uppercase text-tracking">CAPS WITH TRACKING</p>
```

**Spacing Utilities:**
```html
<div class="mb-4">Margin bottom 16px</div>
<div class="mt-8">Margin top 32px</div>
<div class="gap-6">Gap 24px (flex/grid)</div>
```

---

## Animation & Motion

### Scroll Reveal (Enter Animation)

```html
<div class="scroll-reveal">Content fades in on scroll</div>
```

```javascript
// Use Intersection Observer or Framer Motion to add .revealed class
element.classList.add('revealed');
```

### Keyframe Animations

Predefined animations available:

```css
@keyframes fadeIn { /* opacity only */ }
@keyframes fadeInUp { /* opacity + translateY */ }
@keyframes fadeInDown { /* opacity + translateY */ }
@keyframes slideInLeft { /* translateX */ }
@keyframes slideInRight { /* translateX */ }
@keyframes scaleIn { /* scale + opacity */ }
```

**Usage:**
```css
.element {
    animation: fadeInUp 0.6s ease-out 0.2s both;
}
```

---

## CSS Variable Best Practices

### DO ✅

```css
/* Use tokens */
.component {
    padding: var(--space-4);
    color: var(--color-text);
    font-size: var(--font-size-base);
    transition: all var(--duration-base) var(--ease-smooth);
    border-radius: var(--radius-base);
}
```

### DON'T ❌

```css
/* Don't hard-code values */
.component {
    padding: 16px;           /* Use --space-4 */
    color: #1a1a1a;          /* Use --color-text */
    font-size: 16px;         /* Use --font-size-base */
    transition: all 0.3s ease; /* Use --duration-base + --ease-smooth */
    border-radius: 8px;      /* Use --radius-base */
}
```

---

## Migration Guide

### From Old Navigation.css

**Before:**
```css
.navbar { background-color: #fafaf9; }
.nav-logo { color: #1c1917; font-size: 1.8rem; }
.nav-link { color: #57534e; font-size: 0.95rem; }
```

**After:**
```css
.navbar { background-color: var(--color-bg-secondary); }
.nav-logo { color: var(--color-text); font-size: var(--font-size-2xl); }
.nav-link { color: var(--color-text-secondary); font-size: var(--font-size-sm); }
```

### From Old SectionLayout.css

**Before:**
```css
.sections-container { padding: 0 3rem; }
.floating-sections { gap: 6rem; }
.section-accent-bg { padding: 4rem 3rem; border-radius: 24px; }
```

**After:**
```css
.sections-container { padding: 0 var(--gutter); }
.floating-sections { gap: var(--space-20); }
.section-accent-bg { padding: var(--section-spacing-base); border-radius: var(--radius-xl); }
```

---

## Dark Mode

Automatic via CSS variables! Just update `[data-theme="dark"]` in index.css:

```javascript
// User toggles dark mode
document.documentElement.setAttribute('data-theme', 'dark');
```

CSS variables automatically apply:

```css
:root { --color-bg: #ffffff; --color-text: #1a1a1a; }
[data-theme="dark"] { --color-bg: #0a0a0a; --color-text: #fafafa; }
```

All components using `var(--color-*)` tokens update automatically.

---

## Accessibility Features

### Focus States

All interactive elements have visible focus rings:

```css
:focus-visible {
    outline: var(--focus-ring);        /* 2px solid */
    outline-offset: var(--focus-offset); /* 2px */
}
```

### Reduced Motion

Automatically disabled for users with `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; }
}
```

### High Contrast

Enhanced borders for high contrast mode:

```css
@media (prefers-contrast: more) {
    .button, .card, .badge { border-width: 2px; }
}
```

---

## Design Philosophy

### 1. **Restraint Over Decoration**
Every element has a purpose. No unnecessary borders, shadows, or effects.

### 2. **Token-First**
Always use CSS variables. Never hard-code values.

### 3. **Consistency as Priority**
Use the same spacing, timing, and sizing everywhere.

### 4. **Motion is Supportive**
Animation clarifies, never distracts. All easing is smooth, never bouncy.

### 5. **Typography Leads**
Let type hierarchy and whitespace create structure.

### 6. **Responsive by Default**
Mobile-first approach; breakpoints scale elegantly.

---

## Quick Reference

| Need | Token | Value |
|------|-------|-------|
| Padding | `--space-4` | 16px |
| Section gap | `--section-spacing-base` | 64px |
| Text color | `--color-text` | #1a1a1a |
| Button padding | `--spacing-3 var(--space-6)` | 12px 24px |
| Transition | `var(--duration-base) var(--ease-smooth)` | 300ms smooth |
| Border radius | `--radius-base` | 8px |
| Focus ring | `var(--focus-ring)` | 2px solid |

---

## Component Checklist

When creating new components:

- [ ] Use CSS tokens for all colors, spacing, sizing
- [ ] Include hover and focus states
- [ ] Add dark mode support (automatic if using tokens)
- [ ] Ensure keyboard accessible
- [ ] Test at mobile/tablet/desktop
- [ ] Check with `prefers-reduced-motion`
- [ ] Document any custom classes

---

## Examples

### Button with Icon

```html
<button class="button button--primary flex flex--gap">
    <svg><!-- icon --></svg>
    Click me
</button>
```

### Card with Badge

```html
<div class="card">
    <div class="flex flex--between mb-4">
        <h3>Title</h3>
        <span class="badge">New</span>
    </div>
    <p class="text-muted">Description</p>
</div>
```

### Section with Hero Inside

```html
<section class="hero-section">
    <div class="container">
        <h1>Page Title</h1>
        <p class="text-lg">Subtitle</p>
    </div>
</section>

<section class="page-section page-section--lg">
    <div class="container">
        <!-- Content -->
    </div>
</section>
```

---

## Extending the System

### Add a New Component

1. Create a new CSS file: `src/components/MyComponent.css`
2. Use design tokens: `var(--color-*), var(--space-*), var(--radius-*)`
3. Include hover/focus states
4. Import in component where needed

### Change Global Values

Update tokens in `index.css` `:root`:

```css
:root {
    --max-width: 1400px;  /* Make layout wider */
    --section-spacing-lg: 8rem;  /* More spacing */
}
```

All components automatically update.

### Create New Utility

Add to `global.css`:

```css
.pointer-events-none {
    pointer-events: none;
}

.cursor-pointer {
    cursor: pointer;
}
```

---

## Support

This system is:
- **Flexible:** Tokens can be customized globally
- **Scalable:** Patterns work at any size
- **Maintainable:** Centralized, easy to change
- **Accessible:** WCAG compliance built-in
- **Modern:** Uses CSS variables, no preprocessor needed

Happy building! 🎨
