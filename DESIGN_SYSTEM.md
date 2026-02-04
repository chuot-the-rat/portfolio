# FIZZU Design System - Visual Reference

## 🎨 Color System

### Primary Palette (Neutral Base)
```
Text Primary:    #1a1a1a  ███████  Dark grey - Headlines, important text
Text Secondary:  #666666  ███████  Medium grey - Body text, labels
```

### Accent Color
```
Accent:          #0ea5e9  ███████  Sky blue - Links, highlights, CTAs
Accent Subtle:   #e0f2fe  ███████  Light blue - Backgrounds, badges
```

### Neutrals
```
Neutral 50:      #fafafa  ███████  Page background
Neutral 100:     #f5f5f5  ███████  Section background
Neutral 200:     #e5e5e5  ███████  Borders, dividers
```

### FIZZU Flavour Colors
```
Kewpie Pop:
  Main:    #C13048  ███████  Rich pink
  BG:      #E5B8CD  ███████  Light pink

Ponzu Zing:
  Main:    #F5C518  ███████  Bright yellow
  BG:      #7EC8E3  ███████  Sky blue

Ginger Zinger:
  Main:    #D4A574  ███████  Golden tan
  BG:      #F4EAA8  ███████  Pale yellow
```

---

## 📝 Typography Scale

```
Hero Title (Desktop)
  4rem / 64px
  Font Weight: 700 (Bold)
  Letter Spacing: -0.03em
  Line Height: 1.1
  FIZZU SODA CAN SERIES

Section Heading
  3rem / 48px
  Font Weight: 700 (Bold)
  Letter Spacing: -0.02em
  Line Height: 1.2
  Flavour Profiles

Card Title
  1.75rem / 28px
  Font Weight: 600 (Semibold)
  Letter Spacing: -0.01em
  Line Height: 1.3
  Kewpie Pop

Large Body Text
  1.375rem / 22px
  Font Weight: 500 (Medium)
  Line Height: 1.6
  FIZZU is a concept soda brand...

Body Text
  1.125rem / 18px
  Font Weight: 400 (Regular)
  Line Height: 1.7
  The visual system uses strong...

Small Text / Labels
  0.875rem / 14px
  Font Weight: 600 (Semibold)
  Text Transform: Uppercase
  Letter Spacing: 0.1em
  PACKAGING DESIGN

Micro Text
  0.75rem / 12px
  Font Weight: 600 (Semibold)
  Text Transform: Uppercase
  Letter Spacing: 0.05em
  FEATURED
```

---

## 📏 Spacing Scale

```
Based on 8px grid:

3xs: 4px   •
2xs: 8px   ••
xs:  16px  ••••
sm:  24px  ••••••
md:  32px  ••••••••
lg:  48px  ••••••••••••
xl:  64px  ••••••••••••••••
2xl: 96px  ••••••••••••••••••••••••
```

### Application Guide
```
Between sections:           96px  (2xl)
Section padding (vertical): 96px  (2xl)
Between project cards:      64px  (xl)
Card internal padding:      32px  (md)
Between related elements:   24px  (sm)
Between label and value:    16px  (xs)
Micro spacing:              8px   (2xs)
```

---

## 🎭 Component States

### Project Card

#### Default State
```
Border: none
Shadow: none
Transform: translateY(0)
Image Scale: 1
Arrow Opacity: 0
```

#### Hover State
```
Transform: translateY(-4px)
Shadow: 0 20px 40px rgba(0,0,0,0.1)
Image Scale: 1.05
Arrow Opacity: 1
Arrow Transform: translateX(4px)
Transition: 0.4s cubic-bezier(0.22, 1, 0.36, 1)
```

#### Focus State (Keyboard)
```
Outline: 2px solid #0ea5e9
Outline Offset: 4px
```

---

### Button / Link

#### Default
```
Background: white
Border: 2px solid #e5e5e5
Color: #1a1a1a
Transform: translateY(0)
```

#### Hover
```
Transform: translateY(-2px)
Shadow: 0 8px 16px rgba(0,0,0,0.1)
Border Color: #0ea5e9
Transition: 0.3s cubic-bezier(0.22, 1, 0.36, 1)
```

#### Active
```
Transform: translateY(0)
```

---

## 🎬 Animation Timings

### Durations
```
Ultra Fast:  0.15s  - Immediate feedback
Fast:        0.3s   - Button hovers, simple fades
Medium:      0.5s   - Card animations, slides
Slow:        0.8s   - Page loads, complex animations
```

### Easing Functions
```
Standard:      cubic-bezier(0.22, 1, 0.36, 1)
               ↗️ Smooth deceleration (expo out)

Bounce (avoid): cubic-bezier(0.68, -0.55, 0.265, 1.55)
                ⚠️ Too playful - don't use

Linear (avoid): linear
                ⚠️ Too robotic - don't use
```

### Animation Examples
```
Fade In Up:
  From: opacity 0, y 30px
  To:   opacity 1, y 0px
  Duration: 0.6s
  Easing: cubic-bezier(0.22, 1, 0.36, 1)

Stagger Children:
  Delay between: 0.1s
  First child: 0.5s delay
  Second child: 0.6s delay
  Third child: 0.7s delay

Image Hover Scale:
  From: scale(1)
  To:   scale(1.05)
  Duration: 0.6s
  Easing: cubic-bezier(0.22, 1, 0.36, 1)
```

---

## 📐 Layout Grids

### Project Card Grid
```
Desktop (>1200px):
  Columns: 2
  Gap: 64px (horizontal) × 96px (vertical)
  Max Width: 1200px
  Padding: 96px (top/bottom) × 48px (sides)

Tablet (768px - 1199px):
  Columns: 2
  Gap: 48px × 64px
  Padding: 64px × 32px

Mobile (<768px):
  Columns: 1
  Gap: 48px
  Padding: 64px × 24px
```

### Project Detail Page
```
Hero Section:
  Max Width: 1400px
  Padding: 128px (top) × 96px (bottom)

Content Sections:
  Max Width: 1200px
  Padding: 96px (vertical)

Text Columns:
  Max Width: 800px (for readability)
```

---

## 🎯 Hover Distances

```
Subtle Lift:     -2px   (Buttons, links)
Standard Lift:   -4px   (Cards, containers)
Dramatic Lift:   -8px   (Hero elements)

Horizontal Slide: 4px   (Arrows, small elements)
Image Scale:     1.05   (5% zoom)
```

---

## 📦 Component Anatomy

### Project Card Structure
```
project-card (container)
│
├── project-card__preview (image container)
│   ├── project-card__image-wrap
│   │   └── project-card__image
│   └── project-card__overlay (hover gradient)
│
└── project-card__content (text container)
    ├── project-card__category
    ├── project-card__title
    │   └── project-card__arrow
    └── project-card__badge (if featured)
```

### Flavour Card Structure
```
flavour-card (container)
│
├── flavour-card__image-wrap (colored background)
│   └── flavour-card__image (can mockup)
│
└── flavour-card__content
    ├── flavour-card__name
    ├── flavour-card__description
    └── flavour-card__details
        └── flavour-detail (multiple)
            ├── flavour-detail__label
            └── flavour-detail__value
```

---

## 🎨 Shadow System

```
Subtle:   0 4px 12px rgba(0, 0, 0, 0.05)
         ↳ Used for: Resting cards, subtle elevation

Standard: 0 8px 16px rgba(0, 0, 0, 0.1)
         ↳ Used for: Buttons on hover, modals

Strong:   0 20px 40px rgba(0, 0, 0, 0.1)
         ↳ Used for: Cards on hover, floating elements

Hero:     0 30px 60px rgba(0, 0, 0, 0.15)
         ↳ Used for: Hero images, primary CTAs
```

---

## 📱 Responsive Breakpoints

```
Mobile Small:    < 480px
Mobile:          < 768px
Tablet:          768px - 1199px
Desktop:         ≥ 1200px
Desktop Large:   ≥ 1600px
```

### Responsive Adjustments
```
Mobile:
  - 1 column grid
  - Reduced font sizes (16-24px range)
  - Increased touch targets (44px min)
  - Simplified animations
  - Reduced spacing (48-64px sections)

Tablet:
  - 2 column grid
  - Medium font sizes (18-32px range)
  - Standard touch targets
  - Full animations
  - Standard spacing (64-96px sections)

Desktop:
  - 2-3 column grid
  - Full font sizes (20-64px range)
  - Hover states active
  - Complex animations
  - Generous spacing (96-128px sections)
```

---

## 🎯 Accessibility

### Focus States
```
Visible outline: 2px solid #0ea5e9
Outline offset: 4px
Transition: none (immediate)
```

### Color Contrast
```
Text Primary on White:     #1a1a1a on #ffffff
  Ratio: 16.7:1 ✅ AAA

Text Secondary on White:   #666666 on #ffffff
  Ratio: 5.7:1 ✅ AA

Accent on White:          #0ea5e9 on #ffffff
  Ratio: 3.2:1 ✅ AA Large Text
```

### Touch Targets
```
Minimum: 44px × 44px
Recommended: 48px × 48px
Buttons/Links: 56px × 56px (generous padding)
```

---

## 💡 Usage Notes

### Do's ✅
- Use generous whitespace between sections
- Keep animations subtle and purposeful
- Maintain consistent timing across similar elements
- Use the neutral palette as base, accent sparingly
- Test on real devices, especially mobile

### Don'ts ❌
- Don't use multiple competing accent colors
- Don't make animations too fast (<0.2s) or slow (>1s)
- Don't use bounce/elastic easings (too playful)
- Don't cram content - embrace whitespace
- Don't forget keyboard navigation

---

## 🔍 Design Philosophy

**Minimal & Clean**
- Let the work speak for itself
- Generous whitespace creates breathing room
- Clear hierarchy guides the eye

**Professional Tone**
- Sophisticated, not playful
- Confident, not flashy
- Modern, not trendy

**Intentional Motion**
- Every animation has a purpose
- Smooth, natural easing
- Subtle, not distracting

---

**This design system ensures consistency across your entire portfolio while maintaining a professional, UI/UX-focused aesthetic.**
