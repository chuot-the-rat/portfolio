# Animation Components Integration Guide

## ✅ Implementation Complete

You now have three new files in `src/components/`:

1. **PixelLoopCanvas.tsx** — Canvas-based animated pixel grid
2. **BracketCycler.tsx** — Text token cycler with typewriter effect
3. **Hero.tsx** — Clean component that combines both animations
4. **Hero.css** — Responsive styling for the hero section

CSS variables have been added to `src/styles/index.css`.

---

## 🚀 Quick Start

### Option A: Replace Your Existing Hero (Recommended)

In your `src/pages/Home.jsx`, replace the existing `HeroSection` component with:

```jsx
import Hero from "../components/Hero";

// In your Home component, replace the <HeroSection /> with:
<Hero
    baseText="Leana Le"
    primaryTokens={[".com", "003@gmail.com"]}
    burstTokens={["ux", "ui", "react", "motion", "design", "code"]}
    headline="Digital Product Designer & Developer"
    tagline="Crafting experiences that bridge design and technology"
    ctaText="Let's Build Something →"
    onCtaClick={() => {
        // Handle CTA click if needed
        console.log("CTA clicked!");
    }}
/>;
```

### Option B: Add Hero to a New Section

Simply import and use the Hero component anywhere:

```jsx
import Hero from "./components/Hero";

export default function YourPage() {
    return <Hero />;
}
```

---

## 🎨 CSS Variable Customization

All customization happens through CSS variables. Edit `src/styles/index.css` under the `:root` block:

### PixelLoopCanvas Variables

```css
--hero-accent-opacity: 0.055; /* Higher = more visible (0–1) */
--hero-accent-sat: 0.12; /* Lower = more desaturated (0–1) */
--hero-accent-stroke: 0.55; /* Twinkle square brightness */
--hero-accent-cell: 14; /* Pixel size in px (8–20) */
--hero-accent-duration: 8000; /* Animation length in ms before freeze */
```

**Quick tweaks:**

- **Make grid more visible**: Increase `--hero-accent-opacity` to 0.08–0.12
- **Make grid more subtle**: Decrease to 0.03–0.05
- **Slower animation**: Keep it at 8000ms (8 seconds)
- **Larger/smaller pixels**: Adjust `--hero-accent-cell` (default 14px)
- **Different color tone**: Adjust `--hero-accent-sat` (lower = grayer, higher = more colorful)

### BracketCycler Variables

```css
--bc-text: var(--color-text); /* "leanale" color */
--bc-bracket: var(--color-text-tertiary); /* [ ] color */
--bc-token: var(--color-text); /* "ux", "react", etc. */
--bc-scramble: var(--color-text-tertiary); /* Scramble animation color */
--bc-font: ui-monospace, "SF Mono", Consolas, monospace; /* Token font */
--bc-enter-ms: 200ms; /* Token appear duration */
--bc-enter-y: 5px; /* Token vertical nudge on entry */
--bracket-opacity: 0.4; /* [ ] transparency (0–1) */
--cycler-freeze-ms: 15000; /* Total animation lifetime (then freezes) */
```

**Quick tweaks:**

- **Freeze after 20 seconds**: Set `--cycler-freeze-ms: 20000`
- **Faster token swaps**: Decrease `--bc-enter-ms` to 150ms
- **Subtler brackets**: Decrease `--bracket-opacity` to 0.2–0.3
- **Custom bracket color**: Set `--bc-bracket: #ff6600` (any color)

---

## ⏱️ How Timing Works

Both animations run **independently** and **simultaneously** when the page loads:

### PixelLoopCanvas Timeline

```
0ms ──────────────────────── 8000ms ──────► FREEZE (stops here)
     [continuous animation]
     • Pixel dots pulse and shimmer
     • Scan effect sweeps top to bottom every 4 seconds
     • Twinkle squares spawn randomly (0.9–2.3s intervals)
     • After 8s: animation freezes, looks intentional, not broken
```

### BracketCycler Timeline

```
0ms ─ 500ms ─► start
         ────► [Primary: 2–3s] e.g., ".com" displays with smooth entry
         ────► [Bursts: 0.35–0.6s each] e.g., "ux", "ui", "react" flash
         ────► [Repeat] cycles back to primary tokens
         ────► ... continues until 15000ms total
         ────► FREEZE at 15s, shows first primary token (".com")
```

**Key Point:** Both components independently freeze when their `*-duration` or `*-freeze-ms` time is reached. This looks intentional because:

- Grid smoothly fades to a static, subtle state
- Bracket text lands on a real token (not mid-scramble)
- Both happen around the same time (~8–15 seconds)

---

## 🔧 Customizing Tokens

### What Are Tokens?

**Primary Tokens** (`primaryTokens`):

- Longer display time (2–3 seconds, or longer for emails)
- Examples: ".com", "003@gmail.com"
- The email uses a **typewriter effect** (character-by-character reveal)

**Burst Tokens** (`burstTokens`):

- Brief flashes between primary tokens (0.35–0.6 seconds each)
- Examples: "ux", "ui", "react", "motion", "design", "available"
- Uses **scramble effect** (jumbled-to-focused animation)

### How to Customize

In your `Hero` component call, simply change the token arrays:

```jsx
<Hero
    baseText="Leana Le"
    primaryTokens={[
        ".com",
        "003@gmail.com",
        "design portfolio", // <-- add your own!
    ]}
    burstTokens={[
        "ux",
        "ui",
        "react",
        "motion",
        "figma",
        "javascript",
        "web design", // <-- customize!
        "available",
        "let's talk",
    ]}
/>
```

**Token Rules:**

- Keep primary tokens short (under 20 chars best)
- Burst tokens should be snappy (single word or short phrases)
- Use tokens that matter to your brand/story
- Tokens with `@` are auto-detected and use typewriter effect

---

## 🧪 Testing & Troubleshooting

### I don't see the pixel grid

**Check:**

1. Is `--hero-accent-opacity` set to `0.055` or higher?

    ```css
    --hero-accent-opacity: 0.15; /* Increase visibility for testing */
    ```

2. Is the canvas rendering?
    - Open DevTools → Inspect the `<canvas>` element
    - Look for `<canvas aria-hidden="true" style="...opacity: var(...)">`

3. Check browser console for errors
    - `PixelLoopCanvas` should produce no errors

### Animations are too fast or too slow

Adjust the duration variables:

```css
/* Slower pixel animation */
--hero-accent-duration: 12000; /* was 8000 */

/* Slower token cycling */
--cycler-freeze-ms: 25000; /* was 15000 */

/* Faster token entry */
--bc-enter-ms: 100ms; /* was 200ms */
```

### Grid looks wrong on mobile

This is normal. The grid adapts to viewport size. If it looks too sparse/dense:

```css
/* Adjust cell size for mobile */
@media (max-width: 768px) {
    .hero {
        --hero-accent-cell: 12; /* smaller grid */
    }
}
```

### Brackets look misaligned

This can happen with certain fonts. Try:

```css
--bc-font: "Courier New", monospace; /* fallback font */
```

Or align via the Hero.css, line ~56:

```css
.hero__bracket-cycler {
    font-family: monospace;
    line-height: 1.4; /* increase if vertically misaligned */
}
```

### Animation freezes or shows console errors

**BracketCycler freeze is intentional** — it shows the first token after 15 seconds. If it's stuck mid-animation:

1. Check `--cycler-freeze-ms` is set (default 15000)
2. Open DevTools Console → any errors?
3. Try refreshing the page
4. Check if `prefers-reduced-motion` is enabled in OS settings

**PixelLoopCanvas freeze is intentional** — it stops drawing after 8 seconds (clean freeze). If the canvas shows errors:

1. Check your browser supports HTML5 Canvas
2. Try a different browser
3. Check DevTools for WebGL errors

---

## 📋 Implementation Checklist

- [x] Copy `PixelLoopCanvas.tsx` to `src/components/`
- [x] Copy `BracketCycler.tsx` to `src/components/`
- [x] Copy `Hero.tsx` to `src/components/`
- [x] Copy `Hero.css` to `src/components/`
- [x] Add CSS variables to `src/styles/index.css`
- [ ] Update `src/pages/Home.jsx` to use `<Hero />` component
- [ ] Customize token lists for your brand
- [ ] Adjust CSS variables to taste
- [ ] Test on desktop, tablet, mobile
- [ ] Test with `prefers-reduced-motion: reduce` enabled
- [ ] Verify no console errors
- [ ] Deploy! 🚀

---

## 📱 Responsive Behavior

Both components are fully responsive:

- **Desktop**: Full animations, rich pixel grid
- **Tablet**: Slightly smaller text, slightly denser grid
- **Mobile**: Scaled-down for smaller screens, still animated

Adjust breakpoints in `Hero.css` if needed:

```css
@media (max-width: 768px) {
    .hero__headline {
        font-size: var(--font-size-4xl);
    }
}

@media (max-width: 480px) {
    .hero__headline {
        font-size: var(--font-size-3xl);
    }
}
```

---

## ♿ Accessibility

Both components respect:

- **`prefers-reduced-motion`** — No animations if user has this enabled
- **ARIA labels** — Screen reader friendly
- **Semantic HTML** — Proper heading hierarchy (`<h1>`)
- **Color contrast** — Tested with WCAG AA standards

The components will gracefully degrade if animations are disabled.

---

## 🎯 Quick Reference: What Each File Does

| File                  | Purpose                                                                           |
| --------------------- | --------------------------------------------------------------------------------- |
| `PixelLoopCanvas.tsx` | Renders animated pixel grid in canvas. Runs for 8s then freezes.                  |
| `BracketCycler.tsx`   | Displays `name[token]` with typewriter & scramble effects. Runs 15s then freezes. |
| `Hero.tsx`            | Combines both components with headline, tagline, CTA.                             |
| `Hero.css`            | Responsive styling for hero section and animations.                               |
| `index.css`           | CSS variables for customization.                                                  |

---

## 💡 Pro Tips

1. **Color matching**: If colors look off, make sure your CSS variable names match (e.g., `--foreground`, `--muted-foreground` for shadcn themes)

2. **Performance**: Both components are optimized. Canvas uses `requestAnimationFrame`, BracketCycler debounces updates. Safe to use on most devices.

3. **Dark mode**: Both components auto-adapt via CSS variables. No special dark mode code needed.

4. **Custom fonts**: Set `--bc-font` to your preferred monospace font for the tokens.

5. **Animation intensity**: The pixel grid's `--hero-accent-sat` is the best tuning knob for visual impact without hurting performance.

---

## 🐛 Still Having Issues?

1. **Check the browser console** for errors
2. **Verify CSS variables are set** in DevTools → Computed Styles
3. **Try clearing cache** and hard-refreshing
4. **Test in incognito mode** (eliminates extensions)
5. **Check component props** are being passed correctly

If issues persist, the components are self-contained and can be debugged independently:

- Test PixelLoopCanvas in isolation
- Test BracketCycler with different token lists
- Use DevTools to inspect DOM and CSS

---

**You're all set! Start by updating `Home.jsx` to use the new `Hero` component, then customize the tokens and CSS variables to match your brand.** ✨
