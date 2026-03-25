# 📚 COMPLETE REFERENCE GUIDE - File Navigation

## Where to Find Everything

### 🎯 Start Here

**Quick Overview:**

- `FINAL_DELIVERY_SUMMARY.md` - **READ THIS FIRST** (complete overview of all work)

---

### 📋 Design System Core Files

**Location:** `/src/styles/`

1. **variables.css** (14 KB)
    - All CSS custom properties (180+ tokens)
    - Colors, typography, spacing, motion
    - Dark mode overrides
    - One file to update for global changes

2. **typography.css** (12 KB)
    - All heading styles (h1-h6)
    - Body text, links, emphasis
    - Label typography (.meta, .eyebrow, .micro)
    - Accessibility features (reduced-motion, high-contrast)

3. **global.css** (19 KB - UPDATED)
    - Imports: variables.css → typography.css
    - Layout utilities, component patterns
    - Animations and responsive utilities

4. **App.css** & **index.css** (Legacy - unchanged)
    - Can be deprecated when components refactored

---

### 🏠 Component Documentation

**Location:** Root directory

#### Hero Section (Home.jsx + Home.css)

- `HERO_SECTION_REFERENCE.md` (400 lines)
    - All Hero CSS classes explained with design tokens
    - Magnetic interaction breakdown
    - Hover effects + responsive behavior
    - Accessibility features

- `HERO_JSX_REFERENCE.md` (350 lines)
    - Six key JSX sections with code
    - Three-voice typography in action
    - Animation philosophy breakdown
    - Accessibility (prefers-reduced-motion, aria-labels)

#### Projects Grid (Projects.jsx + Projects.css)

- `PROJECTS_COMPONENT_REFERENCE.md` (450 lines)
    - Data loading flow (case studies + standalone)
    - Grid layout with asymmetrical sizing
    - Hover dominance pattern implementation
    - Card structure (header, metadata, highlights)
    - Responsive behavior (desktop/tablet/mobile)

#### Project Detail (ProjectDetail.jsx + ProjectDetail.css)

- `PROJECT_DETAIL_REFERENCE.md` (400 lines)
    - Data loading & supplemental content merging
    - Hero section with metadata grid
    - ProjectContentMain with auto-incrementing micro-index
    - Section styling with scroll-triggered reveals
    - Editorial layout principles

---

### 📈 Session Documentation

**Previous Sessions:**

- `DESIGN_SYSTEM_STRATEGIC_REFACTOR.md` - Phase 4 work (tokens + typography)
- `DESIGN_SYSTEM_REFACTOR_COMPLETE.md` - Full system overview

**Current Session:**

- `SESSION_SUMMARY.md` - Complete summary of current work
- `STEP_5_COMPLETE_SUMMARY.md` - Component review completion
- `FINAL_DELIVERY_SUMMARY.md` - **Overall project completion ✅**

---

## How to Use This System

### For Design Changes

**Goal:** Change a color, spacing, or animation timing

**Steps:**

1. Open `/src/styles/variables.css`
2. Find the token you want to change (e.g., `--color-accent`)
3. Update the value
4. Changes automatically apply everywhere it's used
5. Build and deploy

**Example:**

```css
/* BEFORE */
--color-accent: #212121; /* Dark gray */

/* AFTER */
--color-accent: #ff6b35; /* Your new color */

/* Result: All buttons, links, hover states update instantly */
```

### For Component Styling

**Goal:** Add new component or update existing styling

**Steps:**

1. Import `/src/styles/global.css` (already imported globally)
2. Use design tokens in your CSS:

    ```css
    .my-button {
        padding: var(--space-4) var(--space-8);
        font-size: var(--font-size-sm);
        color: var(--color-text);
        background: var(--color-accent);
        box-shadow: var(--shadow-md);
        transition: box-shadow var(--dur-2) var(--ease-smooth);
    }

    .my-button:hover {
        box-shadow: var(--shadow-lg);
    }
    ```

### For Responsive Design

**Goal:** Make something responsive without breakpoints

**Use clamp() with fluid tokens:**

```css
.my-hero {
    padding: clamp(2rem, 5vw, 4rem); /* Mobile: 32px, Desktop: 64px */
    font-size: clamp(1.5rem, 5vw, 3rem); /* Mobile: 24px, Desktop: 48px */
    gap: var(--space-fluid-m); /* Automatically responsive */
}
```

### For Accessibility

**Support reduced motion:**

```css
@media (prefers-reduced-motion: reduce) {
    .my-animation {
        transition: none;
        animation: none;
    }
}
```

**All animations in the system already support this!**

---

## Quick Token Reference

### Typography

```css
--font-sans: "Inter", system-ui; /* Body text */
--font-display: "Georgia", serif; /* h1, h2 */
--font-mono: "SF Mono", monospace; /* Labels */

--font-size-xs: 0.6875rem; /* 11px */
--font-size-sm: 0.875rem; /* 14px */
--font-size-base: 1rem; /* 16px */
--font-size-lg: 1.125rem; /* 18px */
--font-size-xl: 1.5rem; /* 24px */
--font-size-2xl: 2rem; /* 32px */
--font-size-3xl: 2.5rem; /* 40px */
--font-size-4xl: 3rem; /* 48px */
```

### Spacing

```css
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-4: 1rem; /* 16px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */

/* Responsive fluid spacing */
--space-fluid-s: clamp(0.75rem, 0.55vw + 0.62rem, 1.05rem);
--space-fluid-m: clamp(1rem, 0.85vw + 0.75rem, 1.5rem);
--space-fluid-l: clamp(1.5rem, 1.4vw + 1.05rem, 2.25rem);
```

### Colors

```css
--color-bg: #ffffff; /* White */
--color-text: #1a1a1a; /* Dark gray */
--color-accent: #212121; /* Very dark gray */
--color-text-secondary: #737373; /* Gray */
--color-text-tertiary: #a3a3a3; /* Light gray */
--color-border: #e5e5e5; /* Very light gray */
--color-bg-secondary: #fafafa; /* Off-white */
```

### Motion

```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out-quad: cubic-bezier(0.16, 1, 0.3, 1); /* Snappy */
--dur-1: 120ms; /* Quick feedback */
--dur-2: 220ms; /* Standard interaction */
--dur-3: 360ms; /* Longer reveal */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.12);
```

---

## Component Architecture

### Hero Section (Home.jsx)

- **Location:** `/src/pages/Home.jsx` (400+ lines)
- **CSS:** `/src/pages/Home.css` (840+ lines)
- **Reference:** `HERO_SECTION_REFERENCE.md` + `HERO_JSX_REFERENCE.md`
- **Status:** ✅ Production-ready (no changes needed)

### Projects Grid (Projects.jsx)

- **Location:** `/src/pages/Projects.jsx` (237 lines)
- **CSS:** `/src/pages/Projects.css` (493 lines)
- **Reference:** `PROJECTS_COMPONENT_REFERENCE.md`
- **Status:** ✅ Production-ready (no changes needed)
- **Features:** Hover dominance, asymmetrical grid, data merging

### Project Detail (ProjectDetail.jsx)

- **Location:** `/src/pages/ProjectDetail.jsx` (400+ lines)
- **CSS:** `/src/pages/ProjectDetail.css` (500+ lines)
- **Reference:** `PROJECT_DETAIL_REFERENCE.md`
- **Status:** ✅ Production-ready (no changes needed)
- **Features:** Micro-index, scroll-triggered reveals, editorial layout

---

## Deployment

### Current Status

- ✅ Live at: https://leana-portfolio-two.vercel.app/
- ✅ Build: 489 modules, 3.48s, zero errors
- ✅ Production-ready (all components verified)

### To Deploy Changes

```bash
# 1. Make changes to design tokens or components
# 2. Run build to verify
npm run build

# 3. Git commit your changes
git add .
git commit -m "Describe your changes"

# 4. Push to origin
git push origin punchup

# 5. Vercel auto-deploys on push (configured)
```

---

## Development Workflow

### Viewing Design System in Action

1. **Start dev server:**

    ```bash
    npm run dev
    ```

2. **View in browser:**
    - Home: http://localhost:5173/ (Hero with display serif)
    - Projects: http://localhost:5173/projects (Hover dominance)
    - Any project: http://localhost:5173/projects/[id] (Case study layout)

3. **Make changes in `/src/styles/variables.css`:**
    - Changes auto-reload in dev server
    - See tokens applied immediately across all components

### Common Tasks

**Add new spacing token:**

```css
/* In /src/styles/variables.css */
--space-new: 2.5rem; /* 40px */

/* Use it anywhere */
.element {
    padding: var(--space-new);
}
```

**Update typography:**

```css
/* In /src/styles/typography.css */
h1 {
    font-size: var(--font-size-4xl); /* Make h1 even larger */
    font-weight: 800; /* Extra bold */
}
```

**Change color scheme:**

```css
/* In /src/styles/variables.css */
--color-accent: #your-new-color;
/* All buttons, links, hover states update instantly */
```

---

## Testing the System

### Accessibility Testing

1. Developer Tools → More Tools → Accessibility Inspector
2. Check for color contrast
3. Verify `:focus-visible` states work (tab to elements)
4. Test reduced motion (Settings → Prefers Reduced Motion)

### Responsive Testing

1. DevTools → Toggle Device Toolbar
2. Check layouts at:
    - Mobile: 375px (iPhone SE)
    - Tablet: 768px (iPad)
    - Desktop: 1920px (Full HD)
3. Verify no breakpoint jumping (everything uses clamp())

### Performance Testing

1. DevTools → Lighthouse
2. Run audits for Performance, Accessibility, Best Practices
3. Should see:
    - Green in Performance (build is optimized)
    - Green in Accessibility (all features implemented)
    - Green in Best Practices (clean, semantic code)

---

## Key Files Summary

```
Portfolio Root
├── src/
│   ├── styles/
│   │   ├── variables.css .............. ✅ All tokens (14 KB)
│   │   ├── typography.css ............ ✅ All typography (12 KB)
│   │   ├── global.css ................ ✅ Updated with imports (19 KB)
│   │   └── index.css ................. (legacy)
│   ├── pages/
│   │   ├── Home.jsx .................. ✅ Hero component
│   │   ├── Home.css .................. ✅ All tokens applied
│   │   ├── Projects.jsx .............. ✅ Grid component
│   │   ├── Projects.css .............. ✅ Hover dominance
│   │   ├── ProjectDetail.jsx ......... ✅ Case study component
│   │   └── ProjectDetail.css ......... ✅ Editorial layout
│
├── FINAL_DELIVERY_SUMMARY.md ......... 📖 READ FIRST
├── HERO_SECTION_REFERENCE.md ........ 📖 Hero details
├── HERO_JSX_REFERENCE.md ............ 📖 Hero component
├── PROJECTS_COMPONENT_REFERENCE.md .. 📖 Grid details
├── PROJECT_DETAIL_REFERENCE.md ...... 📖 Case study details
├── STEP_5_COMPLETE_SUMMARY.md ....... 📖 Session review
└── DESIGN_SYSTEM_REFACTOR_COMPLETE.md 📖 Previous phase
```

---

## What's Next?

### You're Ready To:

- ✅ Deploy changes immediately
- ✅ Add new features (tokens available)
- ✅ Create new pages (design system applies)
- ✅ Implement dark mode (theme tokens ready)
- ✅ A/B test designs (change tokens, compare)

### Recommended Next Steps:

1. ✅ Deploy to production (all changes verified)
2. ✅ Monitor performance (Lighthouse score tracking)
3. ✅ Gather user feedback (analytics on engagement)
4. ✅ Plan next features (design system ready to scale)

---

**You now have a complete, documented, production-ready design system! 🎉**

Start with `FINAL_DELIVERY_SUMMARY.md` for the big picture, then dive into specific component references as needed.
