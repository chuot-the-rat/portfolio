# Quick Reference — Projects CSS Refactor

## Current State: CSS-Only Hover

```
Default          →  Hover
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Border: light    →  Border: medium-dark
Shadow: none     →  Shadow: subtle
Title: black     →  Title: dark (--color-accent)
Meta: light      →  Meta: medium-dark
Y-position: 0    →  Y-position: -2px

All over 300ms smooth easing
```

## Optional: De-Emphasis Effect

```
One Card Visible  →  One Card Active
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Card A: 100%      →  Card A: 60% (faded)
Card B: 100%      →  Card B: 100% (lifted)
Card C: 100%      →  Card C: 60% (faded)
```

To enable: Add 1 line to Projects.jsx (see guide)

---

## Token Reference

| Token | Value | Used For |
|-------|-------|----------|
| `--color-text` | #1a1a1a | Title default |
| `--color-accent` | #212121 | Title on hover |
| `--color-text-secondary` | #737373 | Subtitle, meta |
| `--color-text-tertiary` | #a3a3a3 | Empty state, faded |
| `--color-border` | #e5e5e5 | Card border default |
| `--space-8` | 32px | Card padding |
| `--space-12` | 48px | Grid gap (desktop) |
| `--space-16` | 64px | Grid gap (wide) |
| `--font-size-xl` | 24px | Card title |
| `--font-size-base` | 16px | Card subtitle |
| `--font-size-xs` | 11px | Card metadata |
| `--duration-base` | 300ms | All transitions |
| `--ease-smooth` | cubic-bezier(0.4, 0, 0.2, 1) | Easing |
| `--radius-lg` | 12px | Card radius |
| `--shadow-md` | 0 4px 6px... | Hover shadow |

---

## Component Hierarchy

```
.projects-grid
├─ grid-template-columns: auto-fill
├─ gap: var(--space-12)
└─ max 3 columns on desktop

    .project-card
    ├─ position: relative
    └─ height: 100%

        .project-card-link
        ├─ padding: var(--space-8)
        ├─ border: 1px var(--color-border)
        ├─ border-radius: var(--radius-lg)
        ├─ transition: all 300ms smooth
        └─ flex-direction: column

            .project-card-header
            ├─ margin-bottom: auto
            │
            ├─ .project-card-title
            │  ├─ font-size: 24px
            │  ├─ font-weight: 600
            │  └─ color shifts on hover
            │
            └─ .project-card-subtitle
               ├─ font-size: 16px
               └─ opacity shift on hover

            .project-card-meta
            ├─ margin-top: auto
            ├─ padding-top: var(--space-6)
            ├─ border-top: 1px var(--color-border)
            ├─ font-size: 11px
            ├─ text-transform: uppercase
            ├─ letter-spacing: 0.1em
            └─ color/border shift on hover
```

---

## Hover Timeline

```
0ms
├─ Border color: light → medium-dark
├─ Box shadow: none → subtle
├─ Transform: 0 → -2px
├─ Title color: black → dark
───────────────────────────────────────── Time (300ms)
└─ All changes animated smoothly
   Easing: smooth cubic-bezier
```

---

## Responsive Breakpoints

| Size | Columns | Gap | Padding | Title Size |
|------|---------|-----|---------|------------|
| Desktop (1024+) | 3 | 48px (space-12) | 32px (space-8) | 24px |
| Tablet (768-1024) | 2 | 48px | 32px | 18px |
| Mobile (<768) | 1 | 32px (space-8) | 24px (space-6) | 18px |

---

## CSS Classes & States

### Always Present
```css
.projects-grid          /* Main container */
.project-card          /* Card wrapper */
.project-card-link     /* Interactive element */
.project-card-header   /* Top section */
.project-card-title    /* Large title (24px) */
.project-card-subtitle /* Supporting text (16px) */
.project-card-meta     /* Bottom metadata (11px) */
.project-meta-item     /* Individual meta item */
.project-meta-dot      /* Dot separator (·) */
.project-card-highlight /* Reveal layer (optional) */
```

### Optional (Add via JS)
```css
.project-card.is-muted      /* Non-active card, opacity: 0.6 */
.project-card.is-active     /* Active card, enhanced shadow */
```

---

## Hover Effects Map

```
               Title
                 ↓
     ┌─────────────────────┐
     │ Project Name        │  ← Color: black → dark
     │ Supporting text     │  ← Opacity shift
     └─────────────────────┘
           ↑            ↑
        Lift -2px     Shadow
     Border: darker

     ┌─────────────────────┐
     │ Category · Year     │  ← Color: light → medium
     └─────────────────────┘
          Border
        Becomes darker
```

All transitions: 300ms smooth easing

---

## Customization Quick Commands

### Change All Spacings
In Projects.css, find and adjust:
```css
gap: var(--space-12);              /* Grid gap, 48px */
padding: var(--space-8);           /* Card padding, 32px */
margin-bottom: var(--space-8);     /* Section spacing */
```

### Change Hover Lift Height
```css
.project-card-link:hover {
    transform: translateY(-3px);  /* More/less lift */
}
```

### Change Title Hover Color
```css
.project-card-link:hover .project-card-title {
    color: var(--color-text);  /* Any token */
}
```

### Change Transition Speed
```css
transition: all 200ms var(--ease-smooth);  /* Faster: 200ms, Slower: 400ms */
```

### Stricter Grid (Fewer Columns)
```css
grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));  /* Larger min-width */
```

---

## Debugging

### Card doesn't hover?
- Check: Classes `.project-card-link` present
- Check: Click to navigate works (not CSS, likely JS)

### Colors look wrong?
- Check: Global design system imported first
- Check: Dark mode inheritance correct

### Spacing looks off?
- Check: Grid gap token (--space-12 vs --space-16)
- Check: Card padding token (--space-8 vs --space-6)
- Check: Mobile breakpoint (768px)

### Transitions feel choppy?
- Check: Reduced motion setting (may disable animations)
- Check: Device performance (should be smooth)

---

## Files & Documentation

```
Projects.css
├─ Component styles (read this for implementation)
│
PROJECTS_CSS_GUIDE.md
├─ Complete reference (read this for understanding)
├─ Design principles
├─ Component breakdown
├─ Hover timeline
├─ Customization guide
└─ Best practices

PROJECTS_ENHANCEMENT_OPTIONAL.md
├─ Add de-emphasis effect (1 line change)
├─ Code diff exact changes
├─ Tuning options
└─ When to use

PROJECTS_REFACTOR_SUMMARY.md
└─ This summary (quick overview)
```

---

## State Machine

```
DEFAULT STATE (No Hover)
  ├─ Border: light
  ├─ Shadow: none
  ├─ Y: 0
  ├─ Title color: normal
  └─ Meta color: light

        ↓ (Mouse Enter)

HOVER STATE (300ms transition)
  ├─ Border: dark
  ├─ Shadow: subtle
  ├─ Y: -2px
  ├─ Title color: accent
  └─ Meta color: medium

        ↑ (Mouse Leave)

(Returns to DEFAULT)
```

All transitions use: `300ms cubic-bezier(0.4, 0, 0.2, 1)`

---

## Test Checklist

- [ ] Hover works (lift + colors shift)
- [ ] 3 columns on desktop
- [ ] 1 column on mobile (<768px)
- [ ] Focus rings visible (Tab navigation)
- [ ] Dark mode looks right
- [ ] Metadata is uppercase & tracked
- [ ] No console errors
- [ ] Touch/active state works on mobile
- [ ] Reduced motion setting respected

---

## Design at a Glance

**Inspired by:**
- Jackie Hu: Refined hover, editorial spacing
- Sharleen Wang: Clean structure, polished details

**Principles:**
- Minimal by default
- Intentional on hover
- Strong hierarchy
- Smooth motion
- Always readable

**Result:** A portfolio project list that feels polished, intentional, and interactive without being overwhelming. ✨

---

**Need details?** Read the full guides.
**Just need to verify?** Run the checklist above.
**Want to customize?** Use the token reference.

Ready to ship! 🚀