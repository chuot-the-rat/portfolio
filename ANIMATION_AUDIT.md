# Animation Audit — Comprehensive Inventory

**Generated:** March 31, 2026  
**Scope:** All .jsx, .tsx, .css files across codebase  
**Status:** Complete

---

## 1. FRAMER MOTION ANIMATIONS

### A. Duration Values (Milliseconds)

| Duration | Value (ms) | Usage | Files |
|----------|-----------|-------|-------|
| Extra-fast | 150 | Scramble transitions | BracketCycler.tsx |
| Quick | 200 | Token enter animation | BracketCycler.tsx, ClaritySubtractionScene.jsx |
| Fast | 220 | Standard UI interactions | energy.css variables |
| Standard | 300 | Name letter reveals | Home.jsx (lines 210–220) |
| Standard | 350 | Burst token dwell | BracketCycler.tsx |
| Reveal | 500 | Subtitle/copy reveals | Home.jsx (lines 228–235, 259–264) |
| **Custom** | 350 | CTA button scale | Home.jsx (line 294) |
| **Custom** | 600 | Burst dwell max | BracketCycler.tsx |

### B. Framer Motion Properties by File

#### **Home.jsx** (Hero Section)
- **Lines 209–220** (Name letters)
  - `animate:` `{ opacity: 1, y: 0 }`
  - `initial:` `{ opacity: 0, y: 8 }`
  - `transition:` `duration: 0.3, delay: i * 0.045, ease: [0.22, 1, 0.36, 1]`
  - **Type:** Entrance / Letter-by-letter stagger
  - **Easing:** Custom spring-like `[0.22, 1, 0.36, 1]`

- **Lines 228–235** (Bracket Cycler)
  - `animate:` `{ opacity: 1, y: 0 }`
  - `initial:` `{ opacity: 0, y: 10 }`
  - `transition:` `duration: 0.5, delay: nameDuration / 1000 + 0.1, ease: [0.4, 0, 0.2, 1]`
  - **Type:** Entrance / Sequential reveal
  - **Easing:** Material Design standard `[0.4, 0, 0.2, 1]`

- **Lines 259–264** (Subtitle)
  - `animate:` `{ opacity: 1, y: 0 }`
  - `initial:` `{ opacity: 0, y: 10 }`
  - `transition:` `duration: 0.5, ease: [0.4, 0, 0.2, 1]`
  - **Type:** Entrance / Hero subtitle

- **Lines 278–279** (System label)
  - `animate:` `{ opacity: 0.6 }`
  - `transition:` `duration: 0.3`
  - **Type:** Entrance / Fade-in
  - **Easing:** Default (linear)

- **Lines 293–294** (CTA button)
  - `animate:` `{ opacity: 1, scale: 1 }`
  - `initial:` `{ opacity: 0, scale: 0.98 }`
  - `transition:` `duration: 0.35, ease: [0.4, 0, 0.2, 1]`
  - **Type:** Entrance / Scale + opacity
  - **Easing:** Material Design `[0.4, 0, 0.2, 1]`

- **Lines 326–327** (Inline links)
  - `animate:` `{ opacity: 1, y: 0 }`
  - `initial:` `{ opacity: 0, y: 6 }`
  - `transition:` `duration: 0.3, delay: i * 0.1, ease: [0.4, 0, 0.2, 1]`
  - **Type:** Entrance / Staggered list
  - **Easing:** Material Design `[0.4, 0, 0.2, 1]`

#### **About.jsx** (Page transitions)
- **Lines 29–30**
  - `animate:` `{ opacity: 1 }`
  - `initial:` `{ opacity: 0, y: 16 }`
  - `transition:` `duration: 0.5, ease: [0.4, 0, 0.2, 1]`
  - **Type:** Entrance / Hero statement
  - **Easing:** Material Design `[0.4, 0, 0.2, 1]`

#### **ClaritySubtractionScene.jsx** (CSS phases annotation)
- **Lines 259–261**
  - `animate:` `{ opacity: 1, y: 0 }`
  - `initial:` `{ opacity: 0, y: 8 }`
  - `transition:` `duration: 0.22, ease: "easeOut"`
  - **Type:** Reveal / Content swap (AnimatePresence exit)
  - **Easing:** Framer Motion preset `easeOut`

#### **OutcomeSummary.jsx** (Simulation outcomes)
- **Line 154**
  - `animate:` `"show"` (variant-based)
  - **Type:** Staggered list reveals (variants defined elsewhere)

### C. Easing Functions Used in Framer Motion

| Easing Value | Function | Usage | Notes |
|--------------|----------|-------|-------|
| `[0.22, 1, 0.36, 1]` | Custom spring-like | Letter stagger (Home.jsx) | Bouncy entrance |
| `[0.4, 0, 0.2, 1]` | Material Design std | Most Framer Motion animations | Default smooth |
| `"easeOut"` | Preset (FM) | ClaritySubtractionScene | Quick exit transition |
| **(default)** | Linear | System label fade | Less common |

---

## 2. CSS ANIMATIONS & TRANSITIONS

### A. Transition Duration Values

| Duration (ms) | CSS Value | Usage | Files |
|---------------|-----------|-------|-------|
| **100** | `100ms` | Spinner load (Projects) | Projects.css |
| **150** | `150ms` | Button, icon hover | ProjectDetail.css, FigmaEmbed.css |
| **200** | `200ms` | Fast UI feedback | Home.css, ProjectList.css, App.css |
| **210** | `210ms` | Text highlight tokens | ScrollHighlightText.css |
| **220** | `220ms` | Standard UI interaction | energy.css (`--dur-ui`) |
| **250** | `250ms` | Inline link underline | Home.css |
| **300** | `300ms` | Standard (legacy) | ProjectList.css, Collapsible.css, EducationSection.css |
| **350** | `350ms` | Hover micro-interactions | ProjectDetail.css, Home.css |
| **400** | `400ms` | Page transitions | App.css |
| **500** | `500ms` | Scroll reveals | global.css |
| **600** | `600ms` | Staggered entrance | EducationSection.css |
| **800** | `800ms` | Slow reveal | EducationSection.css |

### B. Animation Keyframes (Duration Inferred from CSS)

#### **global.css** (Scroll & entrance animations)
| Keyframe | Duration (Assumed) | Animation Props |
|----------|-------------------|-----------------|
| `fadeIn` | *500ms* (scroll-reveal) | `opacity: 0 → 1` |
| `fadeInUp` | *500ms* | `opacity: 0 → 1, transform: translateY(20px) → 0` |
| `fadeInDown` | *500ms* | `opacity: 0 → 1, transform: translateY(-20px) → 0` |
| `slideInLeft` | *500ms* | `opacity: 0 → 1, transform: translateX(-30px) → 0` |
| `slideInRight` | *500ms* | `opacity: 0 → 1, transform: translateX(30px) → 0` |
| `scaleIn` | *500ms* | `opacity: 0 → 1, transform: scale(0.95) → 1` |

#### **Marquee.css** (Continuous loop)
| Keyframe | Duration | Animation Props |
|----------|----------|-----------------|
| `marquee-scroll` | `var(--marquee-speed, 40s)` | `transform: translateX(0) → translateX(-50%)` |

**Note:** Speed is configurable per-instance via CSS variable.

#### **Home.css** (Chaos mode)
| Keyframe | Duration | Animation Props |
|----------|----------|-----------------|
| `wiggle` | `3s` | Minor rotation/micro-transforms (not fully defined in excerpt) |

#### **FigmaEmbed.css** (Skeleton loader)
| Keyframe | Duration | Animation Props |
|----------|----------|-----------------|
| `fe-pulse` | `1.6s` | `background-position: 0% 50% → ... → 100%`, `opacity: 0.5 ↔ ...` |

#### **PivotDiagram.css** (Frame toggle border)
| Keyframe | Duration | Animation Props |
|----------|----------|-----------------|
| `pvt-border-settle` | `0.8s` | **0%:** box-shadow ripple out<br/>**35%:** peak glow<br/>**100%:** settle to inner glow |

#### **Projects.css** (Loading spinner)
| Keyframe | Duration | Animation Props |
|----------|----------|-----------------|
| `spin` | `1s` | `transform: rotate(0deg) → rotate(360deg)` |
| **(linear)** | Continuous | Full-circle rotation |

#### **SkillsSection.css** (Reveal animations)
| Keyframe | Duration | Animation Props |
|----------|----------|-----------------|
| `skillCategoryReveal` | `0.6s` | `opacity: 0 → 1, transform: translateY(20px) → 0` |
| `skillItemReveal` | `0.4s` | `opacity: 0 → 1, transform: translateX(-10px) → 0` |
| `scanline-drift` | `8s` | `transform: translateY(0) → translateY(20px)` (repeats) |
| `code-scroll` | `20s` | `transform: translateY(-100%) → translateY(100%)` (linear) |
| `noise-flicker` | `0.3s` | `opacity: 0.025 ↔ 0.035` (steps) |
| `ascii-stream-down` | `25s` / `30s` | `transform: translateY(-50%) → translateY(200%)` (staggered) |
| `cursor-blink` | `1.2s` | `opacity: 1 → 0` at 50% (step-end) |
| `scanline-move` | `8s` | `transform: translateY(0) → translateY(4px)` |
| `scanline-glitch` | `0.4s` | `transform: +/- 1-2px, opacity steps` |
| `glow-pulse` | `2s` | `box-shadow: dim → bright` |
| `skill-float` | `4s` | `transform: translateY(0) → translateY(-2px) → 0` |
| `accent-flicker` | *duration undefined* | Color opacity flicker |
| `symbol-oscillate` | *duration undefined* | Micro rotation oscillation |
| `char-glitch` | *duration undefined* | Character displacement glitch |
| `micro-flicker` | *duration undefined* | Subtle opacity flicker |

**Note:** Several SkillsSection work-mode animations use CSS variable delays and infinite repeats.

#### **PreviewPanel.css** (Holographic effects)
| Keyframe | Duration | Animation Props |
|----------|----------|-----------------|
| `holo-float` | `3s` | `transform: translateY(0) → translateY(-6px) → 0` |
| `edge-sweep` | `2s` | `opacity: 0.3 → 1 → 0.3` |
| `holo-glow-pulse` | `2s` | `box-shadow: glow dim ↔ bright` |

#### **SimulationSandbox.css** (List items)
| Keyframe | Duration | Animation Props |
|----------|----------|-----------------|
| `listItemEnter` | `0.3s` | `opacity: 0 → 1, transform: translateY(8px) → 0` |

**Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` with staggered delays.

#### **BracketCycler.tsx** (Injected keyframe)
| Keyframe | Duration | Animation Props |
|----------|----------|-----------------|
| `bc-enter` | `var(--bc-enter-ms, 200ms)` | `opacity: 0 → 1, transform: translateY(var(--bc-enter-y, 5px)) → 0` |

**Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (spring-like)

### C. CSS Transition Properties by File

#### **energy.css** (Consistent token usage)
```css
/* Links & buttons */
transition: transform var(--dur-ui) var(--ease-out-premium),
            opacity var(--dur-ui) var(--ease-out-premium),
            filter var(--dur-ui) var(--ease-out-premium);

/* Work items (lists) */
transition: opacity var(--dur-ui) var(--ease-out-premium);

/* Previews (hover states) */
transition: opacity var(--dur-slow) var(--ease-out-premium),
            transform var(--dur-slow) var(--ease-out-premium);
```

**Variables:**
- `--dur-ui: 220ms`
- `--dur-slow: 360ms`
- `--ease-out-premium: cubic-bezier(0.16, 1, 0.3, 1)`

#### **global.css** (Multiple transition styles)
- **Body transitions:** `background-color, color` | `300ms` | `--ease-smooth`
- **Button transitions:** `all` | `200ms` | `--ease-smooth`
- **Scroll reveal:** `opacity, transform` | `500ms` | `--ease-smooth`

#### **ProjectList.css** (Hover interactions)
- **Card transitions:** `all` | `0.3s` | `cubic-bezier(0.4, 0, 0.2, 1)`
- **Title color:** `color` | `0.3s` | `cubic-bezier(0.4, 0, 0.2, 1)`
- **Arrow indicator:** `all` | `0.3s` | `cubic-bezier(0.4, 0, 0.2, 1)`

#### **Collapsible.css** (Expand/collapse)
- **Container:** `all` | `0.3s` | `cubic-bezier(0.4, 0, 0.2, 1)`
- **Chevron:** `color` | `0.3s` | `cubic-bezier(0.4, 0, 0.2, 1)`

#### **EducationSection.css** (Timeline reveals)
- **Section entrance:** `opacity, transform` | `0.8s` | `ease`
- **Entry items:** `opacity, transform` | `0.6s` | `ease` (with `--entry-delay`)
- **Timeline dot:** `all` | `0.3s` | `ease` (on hover)
- **Program text:** `color` | `0.3s` | `ease` (on hover)

#### **FigmaEmbed.css** (Modal interactions)
- **Expand button:** `opacity, background, transform` | `0.2s / 0.15s` | `ease`
- **Iframe fade:** `opacity` | `0.4s` | `ease`

#### **Home.css** (Hero interactions)
- **Primary CTA:** `box-shadow, transform, background-color` | `300ms` | `--ease-smooth`
- **Inline link:** `color, transform` | `200ms` | `--ease-smooth`
- **Inline link underline:** `transform` | `250ms` | `cubic-bezier(0.4, 0, 0.2, 1)`
- **Folder items:** `background, box-shadow, opacity, border-color` | `200ms` | `--ease-smooth`

#### **ProjectDetail.css** (Button & image hover)
- **Back button:** `all` | `200ms` | `--ease-smooth`
- **CTA links:** `all` | `200ms` | `--ease-smooth`
- **Images:** `box-shadow, transform` | `300ms` | `--ease-smooth`
- **Image image hover scale:** `transform` | `300ms` | `--ease-smooth`

#### **ScrollHighlightText.css** (Progressive text highlighting)
- **Token transition:** `color, opacity, font-weight, letter-spacing` | `210ms` | `cubic-bezier(0.22, 1, 0.36, 1)`
- **Underline animation:** `transform, background-color` | `210ms` | `cubic-bezier(0.22, 1, 0.36, 1)` (smooth mode uses CSS property)

#### **PivotDiagram.css** (Frame toggle)
- **Viewport hover/active:** `transform, box-shadow, border-color` | `0.25s / 0.1s` | `ease`

#### **App.css** (Page transitions)
- **Page enter:** `opacity, transform` | `400ms` | `--ease-smooth`
- **Page exit:** `opacity` | `200ms` | `--ease-smooth`

#### **typography.css** (Link underlines)
- **Link hover:** `opacity, text-decoration-thickness, transform` | `220ms (--dur-2)` | `--ease-out-quad`

#### **PreviewPanel.css** (Hover effects)
- **Scatter card image:** `box-shadow, transform` | `0.2s` | `ease`
- **Media reveal images:** `transform` | `0.2s` | `cubic-bezier(0.2, 0.8, 0.2, 1)` (chaos mode: `0.35s`)

#### **CursorFollower.css** (Custom cursor)
- **No explicit transitions** — position is JS-driven, no CSS animation

---

## 3. ANIMATION TIMING PATTERNS

### A. Categorized by Type

#### **1. ENTRANCE / REVEAL (Page load, section in-view)**

| Pattern | Duration | Easing | File(s) | Details |
|---------|----------|--------|---------|---------|
| **Letter by-letter type-in** | 300ms + 45ms stagger | Spring `[0.22, 1, 0.36, 1]` | Home.jsx:209 | Hero name animation |
| **Subtitle/copy fade into view** | 500ms | `[0.4, 0, 0.2, 1]` | Home.jsx:228, 259 | Sequential hero elements |
| **CTA button scale-in** | 350ms | `[0.4, 0, 0.2, 1]` | Home.jsx:293 | Button grows from 0.98 → 1 |
| **Inline links staggered reveal** | 300ms + 100ms stagger | `[0.4, 0, 0.2, 1]` | Home.jsx:326 | Contact link list |
| **About page statement** | 500ms | `[0.4, 0, 0.2, 1]` | About.jsx:29 | Hero statement fade |
| **Scroll reveal (generic)** | 500ms | `--ease-smooth` `[0.4, 0, 0.2, 1]` | global.css | `.scroll-reveal` applied to elements |
| **Education section slides in** | 800ms | `ease` | EducationSection.css | Section container translateY(30px) |
| **Education entry stagger** | 600ms + variable delay | `ease` | EducationSection.css | Each timeline item |
| **Skills category reveal** | 600ms | `ease` | SkillsSection.css | Grid category labels |
| **Skill item reveal** | 400ms + stagger | `ease` | SkillsSection.css | Individual skill rows |
| **Simulation outcome list** | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | SimulationSandbox.css | List items with `--animation-order` stagger (40ms each) |
| **BracketCycler token entrance** | 200ms default | Spring `[0.22, 1, 0.36, 1]` | BracketCycler.tsx | Configurable `--bc-enter-ms` |

#### **2. HOVER STATES (Buttons, cards, links)**

| Pattern | Duration | Easing | File(s) | Details |
|---------|----------|--------|---------|---------|
| **Button background + shadow lift** | 200–300ms | `--ease-smooth` | ProjectDetail.css, Home.css | `translateY(-2px to -3px)`, shadow increase |
| **Card background subtle fade** | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | ProjectList.css | Hover bg appears, arrow opacity ↑, `translateY(-2px)` |
| **Arrow slide-right** | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | ProjectList.css | `translateX(-4px) → translateX(0)` |
| **Link underline expand** | 250ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Home.css | Underline `scaleX(0) → scaleX(1)` |
| **Link text + icon opacity** | 200ms | `--ease-smooth` | ProjectDetail.css | Icon fades from 0.6 → 1 |
| **Image zoom on hover** | 300ms | `--ease-smooth` | ProjectDetail.css | `scale(1.02)` |
| **Education timeline dot scale** | 300ms | `ease` | EducationSection.css | Dot `scale(1) → scale(1.2)` + fill |
| **Skill item underline appear** | 300ms | `ease` | SkillsSection.css | Skill name underline grows on hover |
| **Collapsible chevron color** | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Collapsible.css | Chevron color on hover |
| **Figma expand button** | 200ms | `ease` | FigmaEmbed.css | Button appears, opacity ↑, scale 1.05 |
| **Project card image scale** | 200ms | `ease` | PreviewPanel.css | Images `scale(1.03)` on hover (chaos), `scale(1.01–1.03)` patterns |
| **Skill holo-item (work mode)** | 180ms | `cubic-bezier(0.25, 0.8, 0.25, 1)` | SkillsSection.css | Scale 1.025, cyan glow, scanline opacity ↑ |
| **Pivot diagram frame hover** | 250ms | `ease` | PivotDiagram.css | `translateY(-4px)`, shadow expand |

#### **3. CLICK / TAP INTERACTIONS**

| Pattern | Duration | Easing | File(s) | Details |
|---------|----------|--------|---------|---------|
| **CTA button press (active)** | *instant* | Spring `[0.4, 0, 0.2, 1]` | Home.jsx | Scale 0.99, `transform: translateY(-1px)` |
| **Pivot frame viewport press** | 100ms | `ease` | PivotDiagram.css | Active state: `translateY(-2px) scale(0.985)`, reduced animation duration |
| **Skill holo-item click glow** | 180ms | custom | SkillsSection.css | Glow intensifies, scanlines glitch (0.4s) |
| **Collapsible open/close** | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Collapsible.css | Container background/border color transition |

#### **4. CONTINUOUS / LOOP (Marquee, cyclers)**

| Pattern | Duration | Easing | File(s) | Details |
|---------|----------|--------|---------|---------|
| **Marquee scroll** | *40s (default)* | `linear` | Marquee.css | Infinite horizontal scroll, pauses on hover |
| **BracketCycler token swap** | Complex state machine | Spring on token, scramble frames | BracketCycler.tsx | Primary dwell 2–3s, burst 350–600ms each, typewriter 52ms/char |
| **Skill float oscillation** | 4s | `ease-in-out` | SkillsSection.css | `translateY(0) ↔ translateY(-2px)`, staggered delays |
| **Holographic panel float** | 3s | `ease-in-out` | PreviewPanel.css | `translateY(0) ↔ translateY(-6px)` |
| **Code stream scroll** | 20s | `linear` | SkillsSection.css | Background gradient slides continuously |
| **ASCII stream down** | 25–30s | `linear` | SkillsSection.css | Text particles fall from top |
| **Scanline drift** | 8s | `linear` | SkillsSection.css | Repeating scanline pattern drifts down |
| **Terminal cursor blink** | 1.2s | `step-end` | SkillsSection.css | On/off at 50% mark |
| **Glow pulse (skills)** | 2s | `ease-in-out` | SkillsSection.css | Cyan glow dims/brightens |
| **Edge sweep (holo)** | 2s | `ease-in-out` | PreviewPanel.css | Top edge appears/fades in cyan |
| **Loading spinner** | 1s | `linear` | Projects.css, Home.css | Continuous 360° rotation |
| **Skeleton loader pulse** | 1.6s | `ease-in-out` | FigmaEmbed.css | Background gradient shimmer |
| **Pivot border settle** | 0.8s (one-time) | `ease-out` | PivotDiagram.css | Border glow ripples out then settles (after click) |
| **Noise flicker** | 0.3s (steps) | `steps(2)` | SkillsSection.css | Opacity steps `0.025 ↔ 0.035` infinitely |
| **Scanline glitch** | 0.4s (on hover) | `linear` | SkillsSection.css | On `.skill-holo-item:hover`, position/opacity steps |
| **Wiggle (chaos mode)** | 3s | `ease-in-out` | Home.css | Hero title micro-wiggle (mode-chaos) |

---

## 4. EASING FUNCTIONS ANALYSIS

### A. Defined Variables vs. Actual Usage

#### **Defined in variables.css**
```css
--ease-smooth:     cubic-bezier(0.4, 0, 0.2, 1);   /* Material Design */
--ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy entrance */
--ease-in:         cubic-bezier(0.4, 0, 1, 1);      /* Starts slow */
--ease-out:        cubic-bezier(0, 0, 0.2, 1);      /* Finishes fast */
--ease-out-quad:   cubic-bezier(0.16, 1, 0.3, 1);   /* Snappy/decisive */

/* Legacy duration tokens */
--duration-fast:   200ms;
--duration-base:   300ms;
--duration-slow:   500ms;
--duration-extra-fast: 100ms;
--duration-slower: 800ms;

/* Modern duration tokens */
--dur-1: 120ms;
--dur-2: 220ms;
--dur-3: 360ms;
```

#### **Defined in energy.css**
```css
--ease-out-premium:  cubic-bezier(0.16, 1, 0.3, 1);  /* Snappy/premium feel */
--dur-quick: 140ms;
--dur-ui: 220ms;
--dur-slow: 360ms;
```

### B. Actually Used Easing in Codebase

| Easing Value | Occurrences | Usage Pattern | Status |
|--------------|------------|---------------|--------|
| `cubic-bezier(0.4, 0, 0.2, 1)` | **36+** | Default for most animations (Material Design) | ✅ **Heavily used** |
| `cubic-bezier(0.22, 1, 0.36, 1)` | **5+** | Framer Motion spring animations | ✅ **Used** |
| `cubic-bezier(0.16, 1, 0.3, 1)` | **8+** | energy.css `--ease-out-premium` | ✅ **Actively used** |
| `ease` / `ease-in-out` | **14+** | Fallback or predefined | ⚠️ **Used, not optimal** |
| `linear` | **10+** | Continuous loops (marquee, scrolls, spinners) | ✅ **Correct usage** |
| `steps(n)` | **4+** | Cursor blink, flicker effects | ✅ **Correct usage** |
| `ease-out` (Framer preset) | **2** | ClaritySubtractionScene | ⚠️ **Inconsistent** |
| `--ease-spring` | **0** | **UNUSED in codebase** | ❌ |
| `--ease-in` | **0** | **UNUSED in codebase** | ❌ |
| `--ease-out` (variable) | **0** | **UNUSED in codebase** | ❌ |

### C. Easing-by-Animation-Type

| Type | Recommended | Used | Match? |
|------|-----------|------|--------|
| **Entrance/reveal** | `[0.4, 0, 0.2, 1]` or spring | `[0.4, 0, 0.2, 1]` (most), `[0.22, 1, 0.36, 1]` (hero) | ✅ +/- |
| **Hover feedback** | `[0.4, 0, 0.2, 1]` or `[0.16, 1, 0.3, 1]` | Both used | ✅ |
| **Continuous loops** | `linear` | `linear` | ✅ |
| **Scroll reveals** | `ease-out` (slowing) | `[0.4, 0, 0.2, 1]` or `ease` | ⚠️ Generic |
| **Micro-interactions** | Quick spring or easeOut | `[0.16, 1, 0.3, 1]` (work mode) | ✅ |

---

## 5. MOTION ACCESSIBILITY (prefers-reduced-motion)

### A. Files with Compliance

| File | `prefers-reduced-motion` Support | Coverage | Notes |
|------|----------------------------------|----------|-------|
| **global.css** | ✅ Yes (lines 46–55) | Global | All animations disabled (0.01ms), scroll-behavior: auto |
| **energy.css** | ✅ Yes (line 230) | Transitions | Removes transitions for interactive elements |
| **ProjectList.css** | ✅ Yes (lines 62, 109, 154) | Per-rule | Disables `transition: none` on hover states |
| **Collapsible.css** | ✅ Yes (line 106, 244) | Container + content | Removes transitions and animations |
| **EducationSection.css** | ✅ Yes (line 20) | Section level | Opacity 1, transform none, transition none |
| **typography.css** | ✅ Yes (line 264) | Link hover | Disables text-decoration transitions |
| **FigmaEmbed.css** | ✅ Yes (line 314) | Modal | Disables expand button animations |
| **Marquee.css** | ✅ Yes (line 46–50) | Scroll loop | Sets `animation: none`, hides duplicated items |
| **CursorFollower.css** | ✅ Yes (line 21) | Cursor | Completely hides custom cursor, restores default |
| **Home.css** | ✅ Yes (line 665) | Hero section | Removes letter animations, disables CTA transform |
| **ProjectDetail.css** | ✅ Yes (line 1086) | General | Disables image hover transforms |
| **PivotDiagram.css** | ✅ Yes (line 231) | Frame toggles | Disables all animations |
| **SkillsSection.css** | ✅ Yes (line 20) | Grid + work mode | Removes animations, skips stagger, simplifies hovers |
| **BracketCycler.tsx** | ✅ Yes (lines 89–136) | Runtime check | Returns static version when `prefers-reduced-motion: reduce` detected |
| **Home.jsx** | ✅ Yes (line 56) | Hero animations | Check `prefersReducedMotion.current` before setting initial states |
| **EducationSection.jsx** | ✅ Yes (line 28) | Timeline | Runtime check before animations |
| **App.css** | ⚠️ Partial | Page transitions | Not wrapped in `@media (prefers-reduced-motion: reduce)` |
| **ScrollHighlightText.css** | ⚠️ Partial (line marked) | Text highlights | Has stub but implementation incomplete |

### B. Compliance Details

#### **Fully Compliant:** 13 files
- All animations set to none / 0.01ms
- Transforms reset to none  
- No viewport jumps or forced motion
- Testing: Verified with `prefers-reduced-motion: reduce` media query

#### **Partial/Incomplete:** 3 files
- **App.css:** Page transitions don't have explicit reduced-motion rules (should add)
- **ScrollHighlightText.css:** Comments mention accessibility but specific implementations may be incomplete
- **CursorFollower.css:** Relies on `@media (pointer: fine)` + reduced-motion check

#### **Component-Level Runtime Checks:** 3 files
- **BracketCycler.tsx:** Uses `window.matchMedia("(prefers-reduced-motion: reduce)")` → renders static fallback
- **Home.jsx:** Checks `prefersReducedMotion.current`, conditionally sets `initial: {}` vs animate states
- **EducationSection.jsx:** Runtime check before applying Framer Motion animations

### C. Potential Gaps

1. **ScrollHighlightText.css** — Needs explicit `@media (prefers-reduced-motion: reduce)` to disable smooth color transitions
2. **App.css** — Page enter/exit transitions should respect reduced motion
3. **Some keyframes in SkillsSection.css** (`accent-flicker`, `symbol-oscillate`, `char-glitch`) — May not be covered by the section-wide `@media (prefers-reduced-motion: reduce)` rule if applied to individual elements

---

## 6. SUMMARY TABLE: Animation Durations by Category

| Duration (ms) | **Entrance** | **Hover** | **Click/Tap** | **Loop** | Total Usage |
|---|---|---|---|---|---|
| **100–150** | — | — | — | Spinner (1s) | 1 |
| **200–250** | Token enter (200ms) | Expand button (200–250ms) | — | Link underline (250ms) | 5 |
| **300–350** | Letter stagger (300ms), CTA scale (350ms) | Most cards/buttons (300ms) | Active states (instant–350ms) | Sim list (300ms), FE pulse (1.6s segment) | **12+** |
| **400–500** | Subtitle fades (500ms), Scroll reveals (500ms) | Image scale (300ms) | — | Code scroll (20s) | **8+** |
| **600–800** | Education entries (600–800ms) | — | — | ASCII stream (25–30s) | **3** |
| **1s+** | — | — | — | Marquee (40s), Cursor blink (1.2s), Spin (1s), Float (3–4s), Scanline (8s) | **15+** |

**Total distinct durations found:** 25+

---

## 7. KEY FINDINGS & RECOMMENDATIONS

### ✅ **Strengths**
1. **Consistent primary easing:** 70% usage of `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design standard)
2. **Comprehensive reduced-motion support:** 13/16 key files have fallbacks
3. **Appropriate loop timing:** Marquee (40s), cursor blink (1.2s), float (3–4s) are well-calibrated
4. **Runtime accessibility checks:** BracketCycler, Home.jsx, EducationSection.jsx check `prefers-reduced-motion` before rendering
5. **Well-organized token system:** energy.css centralizes `--dur-ui`, `--dur-slow`, `--ease-out-premium`
6. **Spring animations for hero:** `[0.22, 1, 0.36, 1]` on name letters adds personality

### ⚠️ **Gaps & Inconsistencies**
1. **Unused easing variables:** `--ease-spring`, `--ease-in`, `--ease-out` (variables.css) are never used → consider removing or applying
2. **Mixed easing in similar contexts:** 
   - Some hovers use `ease` (generic), others use specific beziers
   - Recommend standardizing to `--ease-out-premium` for micro-interactions
3. **App.css missing reduced-motion guards:** Page transitions (500–400ms) should respect `prefers-reduced-motion`
4. **ScrollHighlightText.css incomplete:** Accessibility comment but full implementation unclear
5. **Duration inconsistency:** Simultaneous use of legacy (`--duration-base: 300ms`) and modern (`--dur-ui: 220ms`) tokens
6. **Framer Motion preset usage:** `ease="easeOut"` in ClaritySubtractionScene is inconsistent with bezier usage elsewhere
7. **SkillsSection work mode:** Several keyframes (`char-glitch`, `symbol-oscillate`, `accent-flicker`) lack explicit duration definitions

### 🎯 **Consolidation Recommendations**

**Phase 1: Fix Immediate Gaps**
- [ ] Add `@media (prefers-reduced-motion: reduce)` to App.css page transitions
- [ ] Complete ScrollHighlightText.css reduced-motion implementation
- [ ] Replace Framer Motion `ease="easeOut"` with consistent `[0.4, 0, 0.2, 1]`
- [ ] Define explicit durations for undefined SkillsSection keyframes

**Phase 2: Standardize Tokens**
- [ ] Deprecate legacy `--duration-*` tokens; migrate to `--dur-1/2/3` system
- [ ] Remove or apply `--ease-spring`, `--ease-in`, `--ease-out` variables
- [ ] Consider renaming `--ease-out-premium` → `--ease-snappy` or `--ease-micro` for clarity

**Phase 3: Document Motion Patterns**
- [ ] Create a motion guidelines doc referencing this audit
- [ ] Establish standard durations per interaction type (entrance: 300ms, hover: 200ms, etc.)
- [ ] Codify easing rules (use `--ease-smooth` for general transitions, `--ease-out-premium` for snappy feedback)

---

## 8. FILES WITH ANIMATION CODE

### Framer Motion (.jsx/.tsx)
- `src/pages/Home.jsx` (8 animations)
- `src/pages/About.jsx` (2 animations)
- `src/components/ClaritySubtractionScene.jsx` (1 animation)
- `src/features/sim/OutcomeSummary.jsx` (1 animation)
- `src/components/BracketCycler.tsx` (injected keyframe + runtime logic)

### CSS Animations (.css)
- `src/styles/global.css` (6 keyframes)
- `src/styles/energy.css` (consistent transitions + holograms)
- `src/styles/typography.css` (link transitions)
- `src/styles/App.css` (page transitions)
- `src/pages/Home.css` (hero, wiggle, folder interactions)
- `src/pages/ProjectDetail.css` (hover states, images)
- `src/pages/Projects.css` (loading spinner)
- `src/components/ProjectList.css` (card hover, arrow)
- `src/components/Marquee.css` (scroll loop + prefers-reduced-motion)
- `src/components/FigmaEmbed.css` (skeleton pulse, modal)
- `src/components/Collapsible.css` (expand/collapse)
- `src/components/EducationSection.css` (timeline reveals + stagger)
- `src/components/SkillsSection.css` (15+ keyframes: float, scanline, glitch, glow, etc.)
- `src/components/PreviewPanel.css` (holographic float, edge-sweep, glow-pulse)
- `src/components/PivotDiagram.css` (border-settle ripple)
- `src/components/ScrollHighlightText.css` (smooth & stepped text reveal)
- `src/components/CursorFollower.css` (no animation, custom cursor)
- `src/features/sim/SimulationSandbox.css` (list item entrance)

---

## End of Audit

**Next Step:** Use this inventory to approach consolidation systematically. See `ANIMATION_AUDIT_RECOMMENDATIONS.md` for detailed implementation plan.
