# Quick Reference Card — Simulation Sandbox CSS

## File Structure
```
SimulationSandbox.css (main styles) → imported by SimulationSection.jsx
```

## Key Classes

### Layout
- `.sim-section` — Container
- `.sim-layout` — Two-column grid (1fr / 1.4fr)
- `.sim-panel` — Control panel (sticky on desktop)
- `.sim-outcome` — Output container

### Controls
- `.sim-panel__select` — Dropdown
- `.sim-panel__radio-label` — Radio button option
- `.sim-panel__checkbox-label` — Checkbox option
- `.sim-panel__reset` — Reset button

### Output
- `.sim-outcome__context` — Scenario tags
- `.sim-outcome__block` — Decision section (Scope, Removed, etc.)
- `.sim-outcome__block--accent` — Highlighted block (Tests)
- `.sim-outcome__list-item` — List item with bullet

## Colors Used
- **Background:** `--color-bg` (white)
- **Secondary BG:** `--color-bg-secondary` (light gray)
- **Text:** `--color-text` (dark/black)
- **Secondary Text:** `--color-text-secondary` (gray)
- **Tertiary Text:** `--color-text-tertiary` (light gray)
- **Borders:** `--color-border` (very light gray)

## Spacing Units
- 8px = `var(--space-2)`
- 12px = `var(--space-3)`
- 16px = `var(--space-4)`
- 24px = `var(--space-6)`
- 32px = `var(--space-8)`
- 48px = `var(--space-12)`

## Motion
- **Easing:** `--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)`
- **Timing:** `--duration-base: 300ms`
- **Stagger:** 60ms between list items
- **Principle:** Smooth, never bouncy

## Responsive Breakpoints
| Breakpoint | Behavior |
|-----------|----------|
| 1024px+ | Desktop: two-column, sticky panel |
| 641–1024px | Tablet: single column, adjusted spacing |
| 640px and down | Mobile: reduced padding, full-width |

## Common Hover Effects
| Element | Hover State |
|---------|------------|
| Select/Input | Border darkens, background lightens |
| Radio/Checkbox | Background appears lightly |
| Button | Scale slightly (0.98) on active |
| Outcome Block | Border darkens, shadow appears |
| Panel | Subtle shadow lift |

## Dark Mode
Automatic via CSS variables in `:root[data-theme="dark"]`
Dark mode tokens already exist in index.css

## Customization Shortcuts

**Make it feel more card-like:**
```css
.sim-outcome__block {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    border: none;
}
```

**Tighter spacing:**
```css
.sim-panel__fieldset {
    margin-bottom: var(--space-6);  /* instead of var(--space-8) */
}
```

**More prominent hover:**
```css
.sim-panel:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}
```

**Wider controls:**
```css
.sim-layout {
    grid-template-columns: 1.3fr 1fr;  /* instead of 1fr 1.4fr */
}
```

## Browser Support
✅ Chrome, Firefox, Safari (latest 2 versions)
✅ Mobile browsers (iOS Safari, Chrome Android)
✅ Keyboard navigation
✅ Screen readers
✅ Dark mode
✅ Reduced motion

## Accessibility Checklist
- [x] Focus states visible (outline ring)
- [x] Color contrast sufficient
- [x] Keyboard navigable (Tab through all)
- [x] ARIA labels included
- [x] Reduced motion supported

## Imports
```javascript
// In SimulationSection.jsx
import './SimulationSandbox.css';
```

## Testing Checklist
- [ ] Desktop view (1920px)
- [ ] Tablet view (1024px)
- [ ] Mobile view (640px)
- [ ] Hover states on all controls
- [ ] Focus navigation (keyboard Tab)
- [ ] Dark mode toggle
- [ ] Animation timing (should feel smooth)
- [ ] Reset button animation

## Performance Notes
- Uses CSS variables (browser caches them)
- No complex selectors or deep nesting
- Efficient transitions (no layout thrashing)
- Minimal shadows on small devices

## Future Extensions
Same classes work for additional outcome blocks:
```html
<div class="sim-outcome__block">
    <h4 class="sim-outcome__block-label">New Section</h4>
    <ul class="sim-outcome__list">
        <li class="sim-outcome__list-item">
            <span class="sim-outcome__bullet" />
            Content
        </li>
    </ul>
</div>
```

## Documentation
- `DESIGN_GUIDANCE.md` — Why decisions were made
- `IMPLEMENTATION_GUIDE.md` — How to customize
- `README_CSS_REFACTOR.md` — High-level summary
- `DELIVERY_SUMMARY.md` — What you received

## Design Principles
1. Restraint over decoration
2. Hierarchy through size/weight/color (not noise)
3. Editorial spacing rhythm
4. Smooth, intentional motion
5. Everything serves the content

## One-Liner
> Minimal, intentional, polished, quietly interactive—a premium design tool aesthetic for your case study sandbox.

---

**Ready to use. No additional setup required.** 🚀
