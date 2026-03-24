# InkLink Simulation Sandbox — CSS Refactor Guide

## Overview

This CSS refactor transforms your InkLink Simulation sandbox from a functional component into a **premium, editorial, quietly interactive** interface that feels like a real design tool rather than a generic form.

The design borrows from:
- **Jackie Hu's approach**: playful but controlled microinteractions, strong composition, project-forward presentation
- **Sharleen Wang's precision**: structured layout, quiet confidence, minimal product-designer language

---

## Design Principles Behind the Refactor

### 1. **Minimal but Expressive**
- No excessive borders, shadows, or decorations
- Every visual element has a purpose
- Whitespace creates sophistication and hierarchy
- Restraint creates polish

### 2. **Editorial Structure**
- Strong spacing rhythm (uses your existing 4px/8px scale)
- Generous vertical breathing room
- Hierarchy through size, weight, and color—not noise
- Reads like a carefully designed magazine layout

### 3. **Product-Design Language**
- Controls feel intentional, not template-like
- Two-column layout (input/output) creates natural flow
- "Sticky" control panel keeps configuration visible on scroll
- Output feels like a **decision engine**, not a simple result box

### 4. **Quiet Interactivity**
- Hover states provide subtle feedback (gentle border/shadow shifts)
- Transitions are smooth (cubic-bezier easing, not bouncy)
- Motion supports hierarchy and readability
- No flashy animations or distracting effects

### 5. **Intentional Visual Hierarchy**
- **Labels** (uppercase, tight tracking) separate sections clearly
- **Values** (regular weight, good size) remain readable
- **Hints** are smaller, dimmer, never compete with primary content
- **Accent elements** (the "Suggested Tests" block) draw attention through color/contrast

---

## Key Visual Decisions in the CSS

### Layout Architecture

**Two-Column Grid:**
```css
.sim-layout {
    grid-template-columns: 1fr 1.4fr;  /* Controls narrower, Output gets more space */
    gap: var(--space-12);               /* Editorial breathing room */
}
```

**Why 1fr / 1.4fr?**
- Controls are compact, scannable references
- Output needs more room for lists and content to breathe
- At desktop, this creates a natural flow from config → outcome
- Responsive: stacks to single column on smaller screens

**Sticky Panel:**
```css
.sim-panel {
    position: sticky;
    top: 120px;  /* Respects header height */
}
```

This keeps configuration in view while output scrolls, mimicking design tool UX.

---

### Control Styling — Make It Feel Premium

**Custom Select:**
- Removed browser default look
- Subtle secondary background (`var(--color-bg-secondary)`)
- Gentle hover: border color shifts, no aggressive shadows
- Chevron icon (▾) provides clarity
- Focus state uses soft shadow ring for accessibility

**Custom Radio & Checkbox:**
- Clean circular/square indicators
- Filled on selection (solid background, not just checkmark)
- Soft glow effect on select: `box-shadow: 0 0 0 3px rgba(0,0,0,0.05)`
- Responsive visual feedback without being loud

**Key Detail:** Typography in controls stays small and controlled. Labels are uppercase/tracked for hierarchy, values are regular weight. This prevents the controls from feeling blocky or dashboard-like.

---

### Output Styling — Scannable Decision Engine

**Context Tags:**
```css
.sim-outcome__context {
    display: flex;
    gap: var(--space-2);
    padding: var(--space-4);
    background-color: var(--color-bg-secondary);  /* Subtle background */
    border: 1px solid var(--color-border);
    border-radius: 8px;
}
```

This shows user scenario at a glance: User Type · Device · Constraints. Small pills communicate configuration without being flashy.

**Outcome Blocks:**
- Each section (MVP Scope, Removed Features, Tradeoffs, etc) gets its own bordered box
- Generous internal padding makes content easy to skim
- Hover state: border gets slightly darker, subtle shadow appears
- **Accent block** (Suggested Tests) uses secondary background to draw focus

**Lists:**
- Minimal bullets (tiny 4px dots vs. traditional bullets)
- Good line-height (1.6) for scanning
- Consistent gap between items (`var(--space-4)`)
- Proper color hierarchy: secondary text for body content

---

### Motion & Transitions

**Philosophy:** Motion should support, not distract.

**What Animates:**
- List items: stagger entrance with Framer Motion (already in your component)
- Hover states: border/shadow transitions (300ms smooth easing)
- Button feedback: subtle scale on active (`scale(0.98)`)
- Nothing bounces or overshoots

**Key Easing:**
```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
```

This is your existing smooth easing. Everywhere controls/outcomes transition, it uses this rhythm for consistency.

**Stagger Pattern:**
Your Framer Motion already does this beautifully:
```javascript
const containerVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.06 },  /* 60ms between items */
    },
};
```

The CSS provides a subtle fallback animation for list items without JS:
```css
@keyframes listItemEnter {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}

.sim-outcome__list-item {
    animation: listItemEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1) backwards;
    animation-delay: calc(var(--animation-order, 0) * 40ms);
}
```

This creates a gentle, editorial feel—items don't all pop in at once.

---

### Hierarchy with Restraint

**Avoiding "Dashboard Feeling":**
- No thick border lines or heavy boxes
- No badges, pills, or loud visual containers everywhere
- Color palette stays minimal (text, secondary text, borders)
- Whitespace does the heavy lifting

**Typography Hierarchy:**
- **`sim-panel__legend`**: UPPERCASE 0.75rem (xs), tight tracking, text color
- **`sim-outcome__block-label`**: UPPERCASE 0.875rem (sm), tracked, matches legend weight
- **`sim-outcome__list-item`**: Regular 0.875rem (sm), secondary text color for body
- **Header hint**: Smaller, lighter gray for contextual info

This mirrors the editorial standards already in your portfolio.

---

## Token System Used

The CSS uses your existing design tokens from `index.css`:

```css
/* Colors */
--color-bg: #ffffff
--color-bg-secondary: #fafafa
--color-text: #1a1a1a
--color-text-secondary: #737373
--color-text-tertiary: #a3a3a3
--color-border: #e5e5e5

/* Spacing (editorial scale, all multiples of 4px) */
--space-2: 0.5rem     /* 8px */
--space-3: 0.75rem    /* 12px */
--space-4: 1rem       /* 16px */
--space-6: 1.5rem     /* 24px */
--space-8: 2rem       /* 32px */
--space-12: 3rem      /* 48px */

/* Timing */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)
--duration-fast: 200ms
--duration-base: 300ms
```

**No new tokens were added.** The design works within your existing system, making it scalable and maintainable.

---

## How the Design Supports Content

### 1. **Controls Panel**
- Sticky positioning keeps configuration visible
- Organized fieldsets (User Type → Device → Constraints)
- Clear disabled/enabled states
- Reset button is always accessible
- Feeling: "This is a real tool I can trust"

### 2. **Context Tags**
- One quick glance shows the active scenario
- Pill design is modern but not trendy
- No guessing what config produced the outcome

### 3. **Outcome Blocks**
- Each decision category is visually separate
- Block labels are scannable (uppercase, distinct color)
- Lists breathe (proper spacing, generous line-height)
- Accent block (Tests) draws eyes without being aggressive

### 4. **Overall Composition**
- Two columns create natural left-to-right flow
- No empty space feels wasted
- Mobile stacks gracefully
- Scrolling reveals more content without disruption

---

## Implementation Details

### Class Naming Convention

All simulation classes use `sim-` prefix for clarity:
- `.sim-section` — main container
- `.sim-panel` — control panel wrapper
- `.sim-panel__*` — controls and sub-elements (BEM naming)
- `.sim-outcome` — output wrapper
- `.sim-outcome__*` — outcome sub-elements

This keeps classes scoped and prevents conflicts with existing portfolio styles.

### Reusable Patterns

**The structure you can apply to future sections:**

1. **Container Wrapper** (`.sim-section`)
   - Inherits from `.project-section`
   - Adds specific layout rules

2. **Input Panel** (`.sim-panel`)
   - Sticky, bordered container
   - Clear section dividers
   - Consistent fieldset spacing

3. **Output Container** (`.sim-outcome`)
   - Context header showing active config
   - Staggered list animations
   - Block-based organization

4. **List Items** (`.sim-outcome__list-item`)
   - Flexible for any content type
   - Consistent styling regardless of item count

---

## Hover & Focus States

### Button Hover Behavior
```css
.sim-panel__select:hover {
    border-color: var(--color-text-tertiary);  /* Darkens edge */
    background-color: var(--color-bg);         /* Lifts slightly */
}
```

**Why this matters:** The border darkening is subtle but clear. No shadow explosion, just a refined response to interaction.

### Custom Input Focus
```css
.sim-panel__select:focus {
    outline: none;
    border-color: var(--color-text);           /* Clear indicator */
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05); /* Soft glow */
}
```

This passes accessibility guidelines while staying visually restrained.

### Block Hover
```css
.sim-outcome__block:hover {
    border-color: var(--color-text-tertiary);  /* Subtle border shift */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Light lift */
}
```

Outcome blocks respond to hover but don't become loud. A designer appreciates subtlety.

---

## Responsive Behavior

### Desktop (1024px+)
- Two-column layout (1fr / 1.4fr)
- Panel is sticky
- Full spacing and breathing room

### Tablet (1024px down)
```css
.sim-layout {
    grid-template-columns: 1fr;  /* Single column */
    gap: var(--space-16);         /* Increased vertical gap */
}

.sim-panel {
    position: static;  /* Not sticky on mobile */
}
```

### Mobile (640px down)
- Padding reduces (`var(--space-6)` instead of `var(--space-8)`)
- Fieldsets stay organized but tighter
- Blocks remain readable with adjusted internal padding

---

## Accessibility Features Built In

1. **Focus States:** All interactive elements have clear focus rings
2. **Color Contrast:** Text and borders use sufficient contrast ratios
3. **Semantic HTML:** Fieldsets, legends, and labels remain in place
4. **Reduced Motion:** Motion is disabled for users with `prefers-reduced-motion`
5. **Keyboard Navigation:** All controls are keyboard-accessible
6. **ARIA Labels:** Components include aria-label where needed

---

## Future Extensions

### If You Add More Sections to InkLink:

1. **Use the same `.sim-layout` grid structure**
   - Keeps consistency across all simulation features
   - Easy to understand for future developers

2. **Follow the fieldset + legend pattern**
   - Maintains visual hierarchy
   - Ensures accessibility

3. **Apply the same color/spacing tokens**
   - No new CSS variables needed
   - Everything feels cohesive

4. **Reuse the block styling**
   - `.sim-outcome__block` pattern works for any sectioned output
   - Just change the content, not the structure

### Example Extension:
If you add a "Roadmap Impact" section:
```html
<div class="sim-outcome__block">
    <h4 class="sim-outcome__block-label">Roadmap Impact</h4>
    <ul class="sim-outcome__list">
        {/* list items */}
    </ul>
</div>
```

No new CSS needed—it inherits the entire design system.

---

## Visual Logic Summary

**The design principle in one line:**
> Every pixel serves the content. Controls are compact and responsive. Output is generous and scannable. Motion is smooth and purposeful. The interface disappears to let the ideas shine.

This is the difference between a "case study tool" and a "design portfolio feature." The styling creates the feeling of intention and craft—key traits of both Jackie Hu's and Sharleen Wang's portfolios.

---

## Troubleshooting

### "It feels too minimal"
→ You're right. That's the design. Add more content, don't add more visual decoration.

### "The panel doesn't stick on mobile"
→ Correct behavior. It shouldn't—vertical real estate is precious on small screens.

### "The text colors don't match my dark mode"
→ Your design tokens handle this. The CSS uses CSS variables, so dark mode just works.

### "I want the blocks to do more on hover"
→ Be careful. The restraint is the point. If needed, adjust the shadow or border-color transition, but avoid transforms or scale changes—they break the editorial feel.

---

## Next Steps

1. ✅ Import `SimulationSandbox.css` in SimulationSection (already done)
2. Test the sandbox at different screen sizes (mobile, tablet, desktop)
3. Verify all interactive states (hover, focus, active, disabled)
4. Check accessibility with keyboard navigation
5. Review dark mode appearance
6. Consider adding to your design system documentation

The CSS is ready to use as-is. All styling is complete and follows your portfolio's design language.
