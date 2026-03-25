# Quick Reference Card — Design System

## Token Quick Lookup

### Colors
```
--color-bg              Main background
--color-bg-secondary    Cards/sections
--color-text            Body text
--color-text-secondary  Muted text
--color-text-tertiary   Very muted
--color-border          Lines/borders
--color-accent          Strong accent
```

### Spacing
```
4px   --space-1    12px  --space-3    32px  --space-8     80px  --space-20
8px   --space-2    16px  --space-4    48px  --space-12    96px  --space-24
                        24px  --space-6    64px  --space-16    128px --space-32
```

### Section Spacing
```
--section-spacing-sm:     48px
--section-spacing-base:   64px
--section-spacing-lg:     96px
```

### Typography
```
--font-size-xs:   11px      --font-size-lg:   18px     --font-size-3xl: 40px
--font-size-sm:   14px      --font-size-xl:   24px     --font-size-4xl: 48px
--font-size-base: 16px      --font-size-2xl:  32px     --font-size-5xl: 64px
```

### Motion
```
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)
--duration-fast:  200ms      --duration-base:  300ms
--duration-slow:  500ms      --duration-slower: 800ms
```

### Border Radius
```
--radius-sm:   4px         --radius-lg:  12px        --radius-full: 999px
--radius-base: 8px         --radius-xl:  16px
```

---

## Component Patterns Quick Use

### Buttons
```html
<button class="button">Outline</button>
<button class="button button--primary">Primary</button>
<button class="button button--secondary">Secondary</button>
<button class="button button--ghost">Ghost</button>
<button class="button button--sm">Small</button>
<button class="button button--lg">Large</button>
```

### Cards
```html
<div class="card">Bordered card</div>
<div class="card card--elevated">With shadow</div>
<div class="card card--compact">Smaller padding</div>
```

### Badges
```html
<span class="badge">Default</span>
<span class="badge badge--accent">Accent</span>
```

### Grids
```html
<div class="grid grid--2col">2 columns</div>
<div class="grid grid--3col">3 columns</div>
<div class="grid grid--auto">Auto-fit responsive</div>
```

### Stack (Vertical Flex)
```html
<div class="stack">Multiple items</div>
<div class="stack stack--tight">Tight spacing</div>
<div class="stack stack--loose">Loose spacing</div>
```

### Flex
```html
<div class="flex flex--center">Centered</div>
<div class="flex flex--between">Space between</div>
<div class="flex flex--gap">With gap</div>
```

---

## Layout Patterns Quick Use

### Hero Section
```html
<section class="hero-section">
    <h1>Title</h1>
    <p>Subtitle</p>
</section>
```

### Page Section
```html
<section class="page-section page-section--lg">
    <div class="container">Content</div>
</section>
```

### Two-Column Layout
```html
<div class="layout-2col">
    <div>Left</div>
    <div>Right</div>
</div>
```

### Container (Width Constraint)
```html
<div class="container">Standard (1280px)</div>
<div class="container container--narrow">Narrow (900px)</div>
<div class="container container--wide">Wide (1400px)</div>
```

---

## Text Utilities Quick Use

```html
<p class="text-muted">Gray text</p>
<p class="text-subtle">Very gray</p>
<p class="text-accent">Accent color</p>
<p class="text-sm">Small text</p>
<p class="text-lg">Large text</p>
<p class="text-bold">Bold text</p>
<p class="text-uppercase text-tracking">CAPS WITH TRACKING</p>
<p class="text-center">Centered</p>
```

---

## Spacing Utilities Quick Use

```html
<div class="mb-4">Margin bottom 16px</div>
<div class="mt-8">Margin top 32px</div>
<div class="mb-0">No margin</div>

<!-- In flex/grid -->
<div class="flex gap-6">Gap 24px</div>
<div class="grid gap-8">Gap 32px</div>
```

---

## Common Combinations

### Button with Icon + Text
```html
<button class="button button--primary flex flex--gap">
    <svg>Icon</svg>
    Text
</button>
```

### Card with Badge Header
```html
<div class="card">
    <div class="flex flex--between mb-4">
        <h3>Title</h3>
        <span class="badge">New</span>
    </div>
    <p class="text-muted">Description</p>
</div>
```

### Section Timeline
```html
<section class="page-section page-section--lg">
    <div class="container">
        <h2>Section</h2>
        <div class="stack stack--loose mt-8">
            <!-- Items -->
        </div>
    </div>
</section>
```

### Hero Landing
```html
<section class="hero-section">
    <div class="container container--narrow text-center">
        <h1>Big Title</h1>
        <p class="text-lg text-muted">Subtitle</p>
        <button class="button button--primary mt-8">CTA</button>
    </div>
</section>
```

---

## CSS You Write Should Look Like

✅ DO THIS:
```css
.my-component {
    padding: var(--space-4);
    margin-bottom: var(--space-6);
    color: var(--color-text);
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-base);
    transition: all var(--duration-fast) var(--ease-smooth);
    font-size: var(--font-size-sm);
}

.my-component:hover {
    border-color: var(--color-text);
    box-shadow: var(--shadow-md);
}
```

❌ NOT THIS:
```css
.my-component {
    padding: 16px;
    margin-bottom: 24px;
    color: #1a1a1a;
    background-color: #fafafa;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-size: 14px;
}
```

---

## File Locations

```
src/styles/
├── global.css              Main system
├── index.css               Base tokens (don't edit)
├── App.css                 Page transitions
├── DESIGN_SYSTEM.md        Full documentation
└── REFACTOR_SUMMARY.md     This refactor's details

src/components/
├── Navigation.css          Uses tokens ✓
└── SectionLayout.css       Uses tokens ✓
```

---

## Setup Checklist

- [ ] `global.css` imported after `index.css`
- [ ] Page looks identical
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Keyboard Tab navigation works
- [ ] Have DESIGN_SYSTEM.md bookmarked

---

## 30-Second Rules

1. **Always use tokens** for colors, spacing, sizing
2. **Consistent transitions:** `var(--duration-base) var(--ease-smooth)`
3. **Include focus states** for all interactive elements
4. **Use utility classes** when you'd write simple CSS
5. **Mobile first** — write mobile, then add desktop rules

---

## Get Help

- Full reference: See `DESIGN_SYSTEM.md`
- Examples: See `REFACTOR_SUMMARY.md`
- Token values: Check `:root` in `global.css` or `index.css`
- Questions: Reference this card + documentation

---

**Bookmark this card. Use it daily.** 🎨
