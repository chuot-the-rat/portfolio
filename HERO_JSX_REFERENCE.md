# Hero Section JSX - Key Components

## Overview

The Hero section in `/src/pages/Home.jsx` demonstrates:

1. **Three-voice typography system** (display serif title, body text, mono labels)
2. **Magnetic cursor interaction** (responsive to mouse position)
3. **Type-in animations** (phased entrance with Framer Motion)
4. **Strong CTA** with text mutation on hover

---

## Key Sections Explained

### Section 1: Hero Title (Display Font Emphasis)

**Line 201-224 of Home.jsx**

```jsx
<h1
    className="home-hero-title"
    ref={nameRef}
>
    {nameLetters.map((ch, i) => (
        <motion.span
            key={i}
            className="hero-letter"
            initial={prefersReducedMotion.current ? {} : { opacity: 0, y: 8 }}
            animate={showName ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 0.3,
                delay: i * 0.045,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {ch === " " ? "\u00A0" : ch}
        </motion.span>
    ))}
</h1>
```

**What This Does:**

- ✅ **Display Typography**: `className="home-hero-title"` applies Georgia serif font (see Home.css)
- ✅ **Letter-by-letter animation**: Each letter animates in with staggered delay (i \* 0.045)
- ✅ **Accessibility**: `prefersReducedMotion` skips animation if user prefers it
- ✅ **Magnetic Integration**: `ref={nameRef}` allows cursor to move the title

**CSS Connection:**

```css
.home-hero-title {
    font-family: var(--font-display); /* Georgia serif */
    font-size: clamp(3.5rem, 10vw, 8rem);
    font-weight: 700;
    letter-spacing: -0.05em; /* Tight, distinctive */
}
```

**Visual Effect:**

- Large, serif title feels editorial and high-end
- Letter spacing is tight (-0.05em) for condensed look
- Type-in animation creates emotional connection
- Magnetic tightens spacing when cursor active (-0.06em)

---

### Section 2: Bracket Cycler (Technical Accent)

**Line 227-255 of Home.jsx**

```jsx
<motion.div
    className="hero-bracket-cycler"
    initial={prefersReducedMotion.current ? {} : { opacity: 0, y: 10 }}
    animate={showName ? { opacity: 1, y: 0 } : {}}
    transition={{
        duration: 0.5,
        delay: nameDuration / 1000 + 0.1,
        ease: [0.4, 0, 0.2, 1],
    }}
>
    <BracketCycler
        baseText="leanale"
        primaryTokens={[".com", "003@gmail.com"]}
        burstTokens={[
            "ux",
            "ui",
            "react",
            "motion",
            "figma",
            "design",
            "code",
            "available",
            "burnaby",
        ]}
    />
</motion.div>
```

**What This Does:**

- ✅ **Tech Identity**: Mono font bracket component shows developer credentials
- ✅ **Cycling Animation**: Demonstrates technical personality (code-like feel)
- ✅ **Phased Entrance**: Appears after name finishes typing

**CSS Connection:**

```css
.hero-bracket-cycler {
    font-family: var(--bc-font, ui-monospace, "SF Mono", Consolas, monospace);
    font-size: clamp(1.1rem, 1.8vw, 1.4rem);
    font-weight: 500;
}
```

**Why It Works:**

- Complements display serif title with monospace contrast
- Shows technical skills through UI itself
- Responsive sizing with clamp()

---

### Section 3: Subtitle (Body Typography)

**Line 257-274 of Home.jsx**

```jsx
<motion.p
    className="home-hero-subtitle"
    initial={prefersReducedMotion.current ? {} : { opacity: 0, y: 10 }}
    animate={showSubtitle ? { opacity: 1, y: 0 } : {}}
    transition={{
        duration: 0.5,
        delay: nameDuration / 1000 + 0.05,
        ease: [0.4, 0, 0.2, 1],
    }}
>
    UI/UX Designer &amp; Developer creating thoughtful user experiences through
    research-driven design and clean code.
</motion.p>
```

**What This Does:**

- ✅ **Supporting Text**: Explains who you are in human language
- ✅ **Secondary Typography**: Sans-serif (Inter) for readability
- ✅ **Light Color**: `--color-text-secondary` to distinguish from emphasis

**CSS Connection:**

```css
.home-hero-subtitle {
    font-family: var(--font-sans); /* Inter */
    font-size: clamp(1rem, 1.5vw, 1.125rem);
    color: var(--color-text-secondary); /* Gray */
    line-height: 1.8; /* Comfortable reading */
}
```

**Why It Works:**

- Sans-serif body is easy to read
- Secondary color doesn't compete with title
- Relaxed line-height (1.8) for comfortable scanning

---

### Section 4: System Label (Mono, Technical)

**Line 278-287 of Home.jsx**

```jsx
<motion.span
    className="hero-system-label"
    initial={prefersReducedMotion.current ? {} : { opacity: 0 }}
    animate={showLabel ? { opacity: 0.6 } : {}}
    transition={{ duration: 0.3 }}
>
    [ SYSTEM: PROFILE_INITIALIZED ]
</motion.span>
```

**What This Does:**

- ✅ **UI Affordance**: Signals this is a designed system, not plain text
- ✅ **Mono Font**: SF Mono monospace creates technical aesthetic
- ✅ **Small, Muted**: `--color-text-tertiary` and `--font-size-xs`

**CSS Connection:**

```css
.hero-system-label {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs); /* 11px */
    color: var(--color-text-tertiary); /* Light gray */
    letter-spacing: 0.08em; /* Wide spacing */
}
```

**Why It Works:**

- Micro-label signals "designed UI" without distraction
- Wide letter-spacing gives editorial quality (Jackie Hu principle)
- Light color keeps it secondary

---

### Section 5: Primary CTA - The Star

**Line 289-304 of Home.jsx**

```jsx
<motion.a
    ref={ctaRef}
    href="mailto:leanale003@gmail.com"
    className="hero-primary-cta"
    initial={prefersReducedMotion.current ? {} : { opacity: 0, scale: 0.98 }}
    animate={showCta ? { opacity: 1, scale: 1 } : {}}
    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    onMouseEnter={handleCtaEnter}
    onMouseLeave={handleCtaLeave}
>
    <span className="cta-text">{ctaText}</span>
</motion.a>
```

**What This Does:**

- ✅ **Primary Action**: Distinct button for contact
- ✅ **Scale Animation**: Grows in from 0.98 to 1 (subtle pop)
- ✅ **Text Mutation**: Changes on hover via `handleCtaEnter`
- ✅ **Magnetic Reference**: `ref={ctaRef}` allows cursor to push it

**CSS Connection:**

```css
.hero-primary-cta {
    padding: var(--space-4) var(--space-8); /* 16px 32px */
    background-color: var(--color-accent);
    font-size: var(--font-size-sm);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-sm); /* Subtle elevation */
    transition:
        box-shadow var(--duration-base) var(--ease-smooth),
        transform var(--duration-base) var(--ease-smooth);
}

.hero-primary-cta:hover {
    box-shadow: var(--shadow-lg); /* Elevates strongly */
    transform: translateY(-3px); /* Lift effect */
}
```

**Why It Works:**

- Dark button creates clear visual hierarchy
- Spacing tokens ensure consistency
- Shadow and lift on hover create tactile feedback
- Text mutation (code reveals) shows personality

---

### Section 6: Contact Links (Subtle Navigation)

**Line 306-341 of Home.jsx**

```jsx
<nav
    className="hero-inline-links"
    aria-label="Connect"
>
    {INLINE_LINKS.map((link, i) => (
        <motion.a
            key={link.label}
            href={link.href}
            className="hero-inline-link"
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            download={link.download ? "Leana_Le_Resume.pdf" : undefined}
            initial={prefersReducedMotion.current ? {} : { opacity: 0, y: 6 }}
            animate={showLinks ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 0.3,
                delay: i * 0.1,
                ease: [0.4, 0, 0.2, 1],
            }}
        >
            {link.label}
        </motion.a>
    ))}
</nav>
```

**What This Does:**

- ✅ **Connection Points**: Email, LinkedIn, GitHub, Resume
- ✅ **Staggered Animation**: Each link enters with 0.1s delay
- ✅ **Secondary Links**: Small, unobtrusive styling
- ✅ **Accessibility**: `aria-label="Connect"` for screen readers

**CSS Connection:**

```css
.hero-inline-link {
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
}

.hero-inline-link:hover {
    color: var(--color-accent);
    transform: translateX(6px); /* Slide right */
}

.hero-inline-link::after {
    content: "";
    background: var(--color-accent);
    transform: scaleX(0);
}

.hero-inline-link:hover::after {
    transform: scaleX(1); /* Underline reveals */
}
```

**Why It Works:**

- Small, secondary styling doesn't compete with CTA
- Hover effect (slide + underline) is playful but professional
- Multiple entry points increase engagement

---

## Three-Voice Typography System in Action

| Element        | Font                    | Size     | Color          | Purpose                  |
| -------------- | ----------------------- | -------- | -------------- | ------------------------ |
| **Title**      | Display serif (Georgia) | 56-128px | Primary text   | Main focus - distinctive |
| **Subtitle**   | Body sans (Inter)       | 16-18px  | Secondary text | Supporting explanation   |
| **Label**      | Mono (SF Mono)          | 11px     | Tertiary text  | Technical affordance     |
| **CTA Button** | Body + mono accents     | 14px     | Accent bg      | Clear action point       |
| **Links**      | Body sans               | 13px     | Secondary text | Additional connections   |

**Result:** Clear hierarchy without visual clutter

---

## Animation Philosophy

- **Type-in**: Emotional engagement (letter-by-letter)
- **Staggered entrance**: Guides eye through hierarchy
- **Magnetic cursor**: Playful interaction (responds to you)
- **CTA text mutation**: Personality + engagement
- **Link underlines**: Choreographed reveal (smooth, intentional)

---

## Accessibility Throughout

- ✅ `prefersReducedMotion` queries prevent animations for motion-sensitive users
- ✅ `aria-label="Connect"` makes nav semantic
- ✅ Contrast ratios maintained (--color-text-secondary on white bg)
- ✅ Focus states handled by global.css `:focus-visible`
- ✅ External links have `rel="noopener noreferrer"`
- ✅ Download attribute for resume link

---

## Current Status

✅ **Hero section is production-ready:**

- All design system tokens applied
- Accessibility features working
- Animation interactions polished
- Responsive design confirmed

**Next:** Projects component review
