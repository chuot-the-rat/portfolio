# Optional Enhancement: De-Emphasis Effect

## What It Does

When you hover over a project card, all OTHER cards fade to 60% opacity. This creates strong focus without being jarring—inspired by how interactive design tools highlight the active element.

**Before:** Hover shows subtle lift + color shift on that card
**After:** All other cards fade, making hovered card visually dominant

---

## Implementation (3 Steps)

### Step 1: Update Projects.jsx

Find this section in `Projects.jsx` (around line 110-174):

**BEFORE:**
```javascript
{projects.map((project, index) => (
    <motion.div
        key={project.id}
        className="project-card"
        initial={{ opacity: 0, y: 20 }}
        // ... rest of motion props
        onMouseEnter={() => setHoveredProject(project)}
        onMouseLeave={() => setHoveredProject(null)}
    >
```

**AFTER (add className logic):**
```javascript
{projects.map((project, index) => (
    <motion.div
        key={project.id}
        className={`project-card ${
            hoveredProject && hoveredProject.id !== project.id ? 'is-muted' : ''
        } ${hoveredProject?.id === project.id ? 'is-active' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        // ... rest of motion props
        onMouseEnter={() => setHoveredProject(project)}
        onMouseLeave={() => setHoveredProject(null)}
    >
```

**What it does:**
- `is-muted` class added to all cards EXCEPT the hovered one
- `is-active` class added to the currently hovered card
- CSS reads these classes and applies opacity changes

### Step 2: Verify CSS

The CSS already has these rules (no changes needed):

```css
.project-card.is-muted .project-card-link {
    opacity: 0.6;
    border-color: var(--color-border);
}

.project-card.is-muted .project-card-link:hover {
    opacity: 0.75;  /* Slightly more visible on hover, but still muted */
    transform: none;  /* No lift while other card is active */
}

.project-card.is-active .project-card-link {
    border-color: var(--color-text-tertiary);
    box-shadow: var(--shadow-md);
}
```

Just make sure `Projects.css` is updated (it is).

### Step 3: Test

1. Hover over a project card
   - That card should show: lift + colors shift + shadow
   - OTHER cards should fade to 60% opacity
2. Move mouse away
   - All cards return to normal opacity
3. Try on mobile (touch won't work, but it's OK)

---

## Result

### Without De-Emphasis (CSS Only - Current)
```
┌─────────────┬─────────────┬─────────────┐
│ Project 1   │ Project 2   │ Project 3   │  ← Hovering Project 2
│ (normal)    │ (lifted)    │ (normal)    │
│             │ (blue meta) │             │
└─────────────┴─────────────┴─────────────┘
```

Subtle. You notice the one being hovered.

### With De-Emphasis (CSS + JS)
```
┌─────────────┬─────────────┬─────────────┐
│ Project 1   │ Project 2   │ Project 3   │  ← Hovering Project 2
│ (60% fade)  │ (lifted)    │ (60% fade)  │
│ (reduced)   │ (darker)    │ (reduced)   │
└─────────────┴─────────────┴─────────────┘
```

Strong focus. Project 2 is clearly the active element.

---

## Tuning Options

### Make Non-Hovered Cards More Visible
```css
.project-card.is-muted .project-card-link {
    opacity: 0.75;  /* Instead of 0.6 */
}
```

### Make Non-Hovered Cards More Faded
```css
.project-card.is-muted .project-card-link {
    opacity: 0.5;  /* Instead of 0.6 */
}
```

### Disable Hover Lift for Muted Cards
```css
.project-card.is-muted .project-card-link:hover {
    transform: none;  /* Already in CSS, but here for clarity */
}
```

### More Dramatic Active State
```css
.project-card.is-active .project-card-link {
    box-shadow: var(--shadow-lg);  /* Stronger shadow */
    transform: translateY(-2px);  /* Optional lift for active */
}
```

---

## Code Diff (Exact Changes)

**File:** `src/pages/Projects.jsx`

**Location:** Around line 111-113, where the motion.div for project-card is

**Replace this:**
```javascript
<motion.div
    key={project.id}
    className="project-card"
```

**With this:**
```javascript
<motion.div
    key={project.id}
    className={`project-card ${
        hoveredProject && hoveredProject.id !== project.id ? 'is-muted' : ''
    } ${hoveredProject?.id === project.id ? 'is-active' : ''}`}
```

That's it. One line change (split for readability).

---

## Why This Works

1. **React State Exists:** `hoveredProject` state already tracks which card is being hovered
2. **CSS Already Ready:** Classes `.is-muted` and `.is-active` are pre-defined in the CSS
3. **No New Dependencies:** Uses what's already there (Framer Motion, React state)
4. **Smooth:** All opacity changes use CSS transitions (smooth 300ms easing)
5. **Accessible:** Still keyboard navigable, respects reduced-motion

---

## Optional Variants

### Variant A: Blur Non-Hovered (More Dramatic)
```css
.project-card.is-muted .project-card-link {
    opacity: 0.6;
    filter: blur(2px);  /* Adds blur effect */
}
```

### Variant B: Dim Non-Hovered (Darker)
```css
.project-card.is-muted .project-card-link {
    opacity: 0.5;
    background-color: var(--color-bg-secondary);  /* Slightly darker bg */
}
```

### Variant C: Scale Active Card (Big Focus)
```css
.project-card.is-active .project-card-link:hover {
    transform: scale(1.02) translateY(-2px);  /* Grows slightly */
}
```

All of these are CSS-only. Mix and match based on preference.

---

## When NOT to Use

If your project grid is:
- **Very small** (1-2 projects) → Not needed, no context to fade out
- **Often on mobile** → Touch events don't trigger hover anyway
- **Very sparse** → De-emphasis less effective with few items

But for a typical portfolio with 5+ projects? De-emphasis makes the interaction feel more intentional.

---

## Testing Checklist

- [ ] Added className logic to Projects.jsx
- [ ] CSS is already updated
- [ ] Hovered card shows lift + color shift
- [ ] Other cards fade to 60% opacity
- [ ] Moving mouse away restores all cards
- [ ] Works on desktop
- [ ] Keyboard Tab navigation still works
- [ ] No console errors
- [ ] Dark mode looks correct

---

## Summary

**Current (No JS Change):** CSS-only hover states. Each card responds to hover individually.

**Enhanced (Optional JS):** Add 2 CSS classes based on hovered state. Creates focused experience where one card stands out, others recede.

**How Much Effort:** 1 line change in JSX. No packages. Uses existing state.

**Worth It?** Depends. If your portfolio is heavy on projects and you want visual polish, yes. If it's minimal/focused, the CSS-only version is already excellent.

Either way, your project cards now use the refined design system and feel intentional! 🎨