# Design Tokens Reference Guide

## How the Design System Works

Your portfolio now uses a centralized token system. When you want to change something, you update one token and it cascades everywhere.

---

## Color Tokens

```css
/* Primary Colors */
--color-bg: #ffffff          /* Main background */
--color-text: #1a1a1a        /* Body text */
--color-accent: #212121      /* CTA buttons, borders on hover */

/* Secondary Colors */
--color-bg-secondary: #fafafa     /* Subtle backgrounds */
--color-text-secondary: #737373   /* Descriptions, subtitles */
--color-text-tertiary: #a3a3a3    /* Labels, metadata, hints */

/* Semantic */
--color-border: #e5e5e5      /* Dividers, card borders */
```

**Applied to:**
- Navigation: Uses `var(--color-text-secondary)` for inactive links
- Projects: Cards use `var(--color-border)` for default state
- About: CTA uses `var(--color-accent)` for primary button
- All components: Any color change updates everywhere

---

## Spacing Scale (4px Base)

```css
--space-1:  0.25rem   /* 4px  */
--space-2:  0.5rem    /* 8px  */
--space-3:  0.75rem   /* 12px */
--space-4:  1rem      /* 16px */ ← Base spacing unit
--space-6:  1.5rem    /* 24px */
--space-8:  2rem      /* 32px */ ← Section padding
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
--space-20: 5rem      /* 80px */
--space-24: 6rem      /* 96px */
--space-32: 8rem      /* 128px */
```

**Section Rhythm:**
```css
--section-spacing-sm:   48px   /* Between sections on mobile */
--section-spacing-base: 64px   /* Standard section gap */
--section-spacing-lg:   96px   /* Large emphasis sections */
```

**Examples:**
- Projects page grid gap: `gap: var(--space-12)` (48px)
- Project card padding: `padding: var(--space-8)` (32px)
- Section margins: `margin-bottom: var(--section-spacing-base)` (64px)

---

## Typography

### Sizes
```css
--font-size-xs:   0.6875rem   /* 11px  - tiny labels */
--font-size-sm:   0.875rem    /* 14px  - small text */
--font-size-base: 1rem        /* 16px  - body text */
--font-size-lg:   1.125rem    /* 18px  - descriptions */
--font-size-xl:   1.5rem      /* 24px  - subheadings */
--font-size-2xl:  2rem        /* 32px  - section titles */
--font-size-3xl:  2.5rem      /* 40px  - page title */
--font-size-4xl:  3rem        /* 48px  - hero title */
--font-size-5xl:  4rem        /* 64px  - large display */
```

### Line Heights
```css
--line-height-tight:    1.2   /* Headings */
--line-height-normal:   1.6   /* Default */
--line-height-relaxed:  1.8   /* Reading body copy */
```

### Letter Spacing
```css
--letter-spacing-tight:   -0.02em   /* Headings - tighter */
--letter-spacing-normal:  0         /* Default */
--letter-spacing-tracking: 0.1em    /* Labels - looser */
```

---

## Motion & Transitions

### Timing
```css
--duration-extra-fast: 100ms
--duration-fast:       200ms    /* Quick interactions */
--duration-base:       300ms    /* Standard everywhere */
--duration-slow:       500ms    /* Scroll reveals */
--duration-slower:     800ms    /* Emphasis animations */
```

### Easing
```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)  /* Used everywhere */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)
--ease-in:     cubic-bezier(0.4, 0, 1, 1)
--ease-out:    cubic-bezier(0, 0, 0.2, 1)
```

**Standard Pattern (used across site):**
```css
transition: all var(--duration-base) var(--ease-smooth);
/* = transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1); */
```

---

## Shadows

```css
--shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.08)
--shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.12)
```

**Usage:**
- Project card hover: `box-shadow: var(--shadow-md)`
- Elevated cards: `box-shadow: var(--shadow-lg)`

---

## Border Radius

```css
--radius-sm:   4px
--radius-base: 8px     /* Default for buttons, inputs */
--radius-lg:   12px    /* Cards, modals */
--radius-xl:   16px    /* Large containers */
--radius-full: 999px   /* Pill shape, avatars */
```

---

## Focus States (Accessibility)

```css
--focus-color: var(--color-text)
--focus-offset: 2px
--focus-ring: 2px solid var(--focus-color)
```

**Usage on every interactive element:**
```css
.button:focus-visible {
    outline: var(--focus-ring);
    outline-offset: var(--focus-offset);
}
```

---

## Layout Tokens

```css
--max-width:         1280px   /* Standard container */
--max-width-narrow:  900px    /* Content reading width */
--max-width-wide:    1400px   /* Wide content */
--gutter:            1.5rem   /* Desktop padding */
--gutter-mobile:     1rem     /* Mobile padding */
```

---

## Typography Stack

```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif
--font-mono: ui-monospace, "SF Mono", "Monaco", Consolas, monospace
```

---

## Dark Mode

To enable dark mode, set `data-theme="dark"` on the root element:

```html
<html data-theme="dark">
```

The system automatically inverts colors via CSS variables:

```css
[data-theme="dark"] {
    --color-bg: #0a0a0a
    --color-bg-secondary: #171717
    --color-text: #fafafa
    --color-text-secondary: #a3a3a3
    --color-text-tertiary: #737373
    --color-border: #262626
    --color-accent: #fafafa
}
```

---

## Real-World Examples

### Project Card (from Projects.jsx)
```css
.project-card-link {
    padding: var(--space-8);                              /* 32px */
    background-color: var(--color-bg);                   /* white */
    border: 1px solid var(--color-border);               /* light gray */
    border-radius: var(--radius-lg);                     /* 12px */
    transition: all var(--duration-base) var(--ease-smooth);  /* 300ms smooth */
}

.project-card-link:hover {
    border-color: var(--color-text-tertiary);           /* darker */
    box-shadow: var(--shadow-md);                        /* lift */
    transform: translateY(-2px);                         /* -2px up */
}
```

### About CTA Button
```css
.about-link {
    padding: var(--space-3) var(--space-6);             /* 12px 24px */
    background-color: var(--color-accent);              /* dark */
    color: var(--color-bg);                             /* white */
    border-radius: var(--radius-base);                  /* 8px */
    font-size: var(--font-size-sm);                     /* 14px */
    transition: all var(--duration-base) var(--ease-smooth);
}

.about-link:hover {
    background-color: var(--color-text);                /* even darker */
    transform: translateX(4px);                         /* slide right */
    box-shadow: var(--shadow-md);                       /* lift */
}
```

### Section Spacing (from ProjectDetail)
```css
.project-section {
    margin-bottom: var(--section-spacing-base);  /* 64px between sections */
    max-width: var(--max-width-narrow);          /* 900px reading width */
}

.section-title {
    font-size: var(--font-size-2xl);             /* 32px */
    font-weight: 600;
    letter-spacing: var(--letter-spacing-tight);
    margin-bottom: var(--space-8);               /* 32px to description */
    line-height: var(--line-height-tight);
}
```

---

## Modifier Pattern

The system uses CSS selectors to apply variations:

```css
/* Base state */
.button { padding: var(--space-3) var(--space-6); }

/* Size variations */
.button--sm { padding: var(--space-2) var(--space-4); }
.button--lg { padding: var(--space-4) var(--space-8); }

/* Style variations */
.button--primary { background-color: var(--color-accent); }
.button--secondary { background-color: var(--color-bg-secondary); }
.button--ghost { background-color: transparent; }
```

---

## Accessibility Features Built In

```css
/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}

/* High Contrast Mode */
@media (prefers-contrast: more) {
    .button {
        border-width: 2px;  /* Thicker borders */
    }
}
```

---

## How to Use This System

### When you want to change colors:
1. Update one token in `global.css`
2. All components using that token update instantly
3. No need to search and replace

### When you want to add a new component:
1. Base all dimensions on spacing scale: `var(--space-*)`
2. Use only defined colors: `var(--color-*)`
3. Transitions: always `var(--duration-base) var(--ease-smooth)`
4. Shadows: use `var(--shadow-*)`
5. Borders: use `var(--radius-*)`

### When you want to change site-wide timing:
1. Update `--duration-base` to make all transitions faster/slower
2. Update `--ease-smooth` to change animation feel globally

---

This system makes your site **easy to maintain**, **cohesive**, and **professional**. ✨
